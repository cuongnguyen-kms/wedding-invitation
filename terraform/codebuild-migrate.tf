# One-off runner for `prisma migrate deploy` against RDS, without ever
# exposing RDS to the public internet. Runs inside the same private VPC as
# the App Runner service, reusing aws_security_group.apprunner (already
# permanently allowed to reach RDS on 5432 via aws_security_group_rule.rds_from_apprunner)
# rather than an IP allowlist - IP-based access turned out to be impractical
# here (corporate network blocks outbound 5432 entirely; CloudShell's egress
# IP isn't stable).
#
# Uses our own app image (already in ECR) as the build environment instead of
# fetching source from GitHub + `npm ci`, specifically so this needs no
# internet egress at all: the private subnets have no NAT Gateway (kept out
# to avoid its recurring cost), so a build that needed to reach GitHub/npm
# would just hang in DOWNLOAD_SOURCE forever, like it originally did here.
# CodeBuild pulls its own build-environment image via AWS's infrastructure,
# not through the project's VPC config, so this sidesteps the NAT requirement
# entirely - only the actual `prisma migrate deploy` step needs to reach RDS,
# which it does over the VPC connector's security-group path.
#
# Trigger manually after schema changes:
#   aws codebuild start-build --project-name wedding-invitation-migrate --region <region>

data "aws_iam_policy_document" "codebuild_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["codebuild.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "codebuild_migrate" {
  name               = "${var.project_name}-codebuild-migrate"
  assume_role_policy = data.aws_iam_policy_document.codebuild_assume.json
}

data "aws_iam_policy_document" "codebuild_migrate" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:${var.aws_region}:*:log-group:/aws/codebuild/${var.project_name}-migrate*"]
  }

  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [aws_secretsmanager_secret.db_url.arn]
  }

  statement {
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  statement {
    actions = [
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
    ]
    resources = [aws_ecr_repository.this.arn]
  }

  # Minimal VPC-networking permissions CodeBuild needs to attach an ENI in
  # our subnets - see https://docs.aws.amazon.com/codebuild/latest/userguide/vpc-support.html
  statement {
    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface",
      "ec2:DescribeSubnets",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeDhcpOptions",
      "ec2:DescribeVpcs",
    ]
    resources = ["*"]
  }

  statement {
    actions   = ["ec2:CreateNetworkInterfacePermission"]
    resources = ["arn:aws:ec2:${var.aws_region}:*:network-interface/*"]
    condition {
      test     = "StringEquals"
      variable = "ec2:AuthorizedService"
      values   = ["codebuild.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "codebuild_migrate" {
  name   = "${var.project_name}-codebuild-migrate"
  role   = aws_iam_role.codebuild_migrate.id
  policy = data.aws_iam_policy_document.codebuild_migrate.json
}

resource "aws_codebuild_project" "migrate" {
  name         = "${var.project_name}-migrate"
  service_role = aws_iam_role.codebuild_migrate.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "${aws_ecr_repository.this.repository_url}:${var.container_image_tag}"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "SERVICE_ROLE"
  }

  source {
    type      = "NO_SOURCE"
    buildspec = <<-EOF
      version: 0.2
      env:
        secrets-manager:
          POSTGRES_DATABASE_URL: "${aws_secretsmanager_secret.db_url.name}"
      phases:
        build:
          commands:
            - cd /app
            - npx prisma migrate deploy --config prisma.postgres.config.ts
    EOF
  }

  vpc_config {
    vpc_id             = aws_vpc.this.id
    subnets            = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.apprunner.id]
  }
}
