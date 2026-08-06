# AWS deployment (App Runner + RDS Postgres)

Provisions: a private-only VPC (RDS + an App Runner VPC connector, no NAT
Gateway), RDS Postgres, an ECR repository, Secrets Manager secrets for the DB
URL and admin password, and an App Runner service running the app from
`../Dockerfile`.

## Prerequisites

- Terraform >= 1.5
- Docker, logged in to build for `linux/amd64` (App Runner's platform)
- Working AWS credentials: `aws sts get-caller-identity` should succeed. If
  you see `InvalidClientTokenId`, fix `~/.aws/credentials` (or `AWS_PROFILE`)
  before continuing - nothing below will work otherwise.

## One-time setup

Create `terraform/terraform.tfvars` (already gitignored - never commit it):

```hcl
admin_password = "<a real password, not the local-dev changeme one>"
```

(`admin_username`, `db_name`, etc. all have sane defaults in `variables.tf`;
override there if you want.)

## Deploy order

The App Runner service depends on an image that doesn't exist yet on your
very first apply, and its health check (`GET /`) depends on the database
already being migrated. Both are chicken-and-egg, so the first deploy is
three steps, in this order:

### 1. Create everything except the App Runner service

```bash
cd terraform
terraform init
terraform apply
```

This creates the VPC, RDS instance, ECR repo, IAM roles, and secrets. The
`aws_apprunner_service` resource will fail here with an image-not-found style
error - that's expected, ignore it. Everything else is now in state.

### 2. Build and push the image

```bash
cd ..
aws ecr get-login-password --region <aws_region> | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.<aws_region>.amazonaws.com

docker build --platform linux/amd64 -t wedding-invitation .
docker tag wedding-invitation:latest "$(cd terraform && terraform output -raw ecr_repository_url):latest"
docker push "$(cd terraform && terraform output -raw ecr_repository_url):latest"
```

### 3. Migrate the database

RDS is private by default. Temporarily open it to your IP, run the migration
and seed, then close it back up:

```bash
cd terraform
terraform apply -var="enable_public_migration_access=true" -var="migration_access_cidr=$(curl -s ifconfig.me)/32"

# Fetch the connection string Terraform generated and use it locally:
aws secretsmanager get-secret-value \
  --secret-id "$(terraform output -raw postgres_database_url_secret_arn)" \
  --query SecretString --output text
```

Export that value as `POSTGRES_DATABASE_URL` (e.g. in a throwaway `.env.local`
or your shell), then from the repo root:

```bash
npm run db:deploy:postgres
npm run db:seed
```

Then close RDS back up:

```bash
cd terraform
terraform apply -var="enable_public_migration_access=false"
```

### 4. Create the App Runner service

```bash
terraform apply
```

The image and the migrated database both exist now, so this succeeds and the
health check passes immediately. Grab the URL:

```bash
terraform output app_runner_url
```

## Redeploying after a code change

```bash
docker build --platform linux/amd64 -t wedding-invitation .
docker tag wedding-invitation:latest "$(cd terraform && terraform output -raw ecr_repository_url):latest"
docker push "$(cd terraform && terraform output -raw ecr_repository_url):latest"
```

`auto_deployments_enabled = true` on the service means App Runner picks up
the new `:latest` push automatically - no `terraform apply` needed unless you
also changed `.tf` files. If you changed `prisma/schema.postgres.prisma`,
generate + commit a new migration (`npm run db:migrate:postgres` against a
local/tunneled Postgres) and run it against RDS the same way as step 3 above
before or right after pushing the new image.

## Teardown

```bash
terraform destroy
```

`skip_final_snapshot = true` on the RDS instance means this does not leave a
snapshot behind - if you want to keep the data, take a manual RDS snapshot
first.
