resource "aws_apprunner_vpc_connector" "this" {
  vpc_connector_name = "${var.project_name}-connector"
  subnets            = aws_subnet.private[*].id
  security_groups    = [aws_security_group.apprunner.id]
}

# Lets App Runner's build service pull the image from our private ECR repo.
data "aws_iam_policy_document" "apprunner_ecr_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["build.apprunner.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "apprunner_ecr_access" {
  name               = "${var.project_name}-apprunner-ecr-access"
  assume_role_policy = data.aws_iam_policy_document.apprunner_ecr_assume.json
}

resource "aws_iam_role_policy_attachment" "apprunner_ecr_access" {
  role       = aws_iam_role.apprunner_ecr_access.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

# The running container's own role - only needs to read the two secrets below.
data "aws_iam_policy_document" "apprunner_instance_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["tasks.apprunner.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "apprunner_instance" {
  name               = "${var.project_name}-apprunner-instance"
  assume_role_policy = data.aws_iam_policy_document.apprunner_instance_assume.json
}

data "aws_iam_policy_document" "apprunner_instance_secrets" {
  statement {
    actions = ["secretsmanager:GetSecretValue"]
    resources = [
      aws_secretsmanager_secret.db_url.arn,
      aws_secretsmanager_secret.admin_password.arn,
    ]
  }
}

resource "aws_iam_role_policy" "apprunner_instance_secrets" {
  name   = "${var.project_name}-apprunner-secrets"
  role   = aws_iam_role.apprunner_instance.id
  policy = data.aws_iam_policy_document.apprunner_instance_secrets.json
}

# NOTE on apply order (see README.md): on a brand-new deploy this resource
# will fail to create until an image has actually been pushed to the ECR repo
# at container_image_tag, and it will fail its health checks until the DB has
# been migrated. Both are expected - see the README runbook.
resource "aws_apprunner_service" "this" {
  service_name = var.project_name

  source_configuration {
    auto_deployments_enabled = true

    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_ecr_access.arn
    }

    image_repository {
      image_identifier      = "${aws_ecr_repository.this.repository_url}:${var.container_image_tag}"
      image_repository_type = "ECR"

      image_configuration {
        port = "3000"

        runtime_environment_variables = {
          ADMIN_USERNAME = var.admin_username
        }

        runtime_environment_secrets = {
          POSTGRES_DATABASE_URL = aws_secretsmanager_secret.db_url.arn
          ADMIN_PASSWORD        = aws_secretsmanager_secret.admin_password.arn
        }
      }
    }
  }

  instance_configuration {
    cpu               = "0.25 vCPU"
    memory            = "0.5 GB"
    instance_role_arn = aws_iam_role.apprunner_instance.arn
  }

  network_configuration {
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.this.arn
    }
  }

  health_check_configuration {
    protocol = "HTTP"
    path     = "/"
  }

  tags = { Name = var.project_name }
}
