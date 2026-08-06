# AWS deployment (App Runner + RDS Postgres)

Provisions: a private-only VPC (RDS + an App Runner VPC connector, no
standing NAT Gateway), RDS Postgres, an ECR repository, a CodeBuild-based
migration runner, Secrets Manager secrets for the DB URL and admin password,
and an App Runner service running the app from `../Dockerfile`.

## Prerequisites

- Terraform >= 1.5
- Docker, able to build for `linux/amd64` (App Runner's platform). If Docker
  isn't available locally, AWS CloudShell has it preinstalled and is already
  authenticated as your AWS user - `git clone` the repo there and build from
  `/tmp` (CloudShell's `$HOME` has only a 1GB persistent quota, easy to blow
  through with `node_modules` + a Docker build).
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

## Why RDS has no public-access toggle

An earlier version of this setup temporarily flipped RDS to
`publicly_accessible = true` (restricted to your IP) to run migrations from a
developer machine. That turned out to be impractical in practice - some
networks block outbound 5432 entirely regardless of what the security group
allows, and CloudShell's egress IP isn't stable between commands - so it was
replaced with the CodeBuild-based runner below, which never exposes RDS to
the internet at all.

## Deploy order

The App Runner service depends on an image that doesn't exist yet on your
very first apply, and its health check (`GET /`) depends on the database
already being migrated. Both are chicken-and-egg, so the first deploy is four
steps, in this order:

### 1. Create everything except the App Runner service

```bash
cd terraform
terraform init
terraform apply
```

This creates the VPC, RDS instance, ECR repo, CodeBuild migration runner,
IAM roles, and secrets. The `aws_apprunner_service` resource will fail here
with an image-not-found style error - that's expected, ignore it. Everything
else is now in state.

### 2. Build and push the image

```bash
cd ..
aws ecr get-login-password --region <aws_region> | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.<aws_region>.amazonaws.com

docker build --platform linux/amd64 -t wedding-invitation .
docker tag wedding-invitation:latest "$(cd terraform && terraform output -raw ecr_repository_url):latest"
docker push "$(cd terraform && terraform output -raw ecr_repository_url):latest"
```

### 3. Migrate the database via CodeBuild

RDS is never publicly accessible, so migrations run inside the VPC via a
CodeBuild project (`codebuild-migrate.tf`) using the app image itself as the
build environment - no `npm ci`/GitHub/npm-registry access needed, only a
connection to RDS over the existing security-group path. That path still
needs a NAT Gateway for CodeBuild to pull the image in the first place
(pulling a custom build-environment image goes through the project's VPC
config), so it's created just for this step and torn down right after:

```bash
cd terraform
terraform apply -var="enable_nat_gateway=true"

aws codebuild start-build --project-name wedding-invitation-migrate --region <aws_region>
```

Poll until it finishes (`aws codebuild batch-get-builds --ids <build-id> --region <aws_region> --query 'builds[0].buildStatus'`),
then tear the NAT Gateway back down:

```bash
terraform apply -var="enable_nat_gateway=false"
```

This only runs `prisma migrate deploy` - no seed data. `prisma/seed.ts`
inserts fake example guests, meant for local dev, not a real deployment; add
real guests via `/admin` after the app is up. If you want the seed data
anyway, run it the same way you'd run any other one-off command against
RDS from inside the VPC (e.g. temporarily add `npm run db:seed` to the
CodeBuild buildspec's `commands` in `codebuild-migrate.tf`, apply, run,
revert) - the pruned production image doesn't have `tsx` (a devDependency),
which `db:seed` needs.

### 4. Create the App Runner service

```bash
cd terraform
terraform apply
```

The image and the migrated database both exist now, so this succeeds and the
health check passes. Grab the URL:

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
generate a new migration (`npm run db:migrate:postgres` against a
local/tunneled Postgres), commit it, rebuild/push the image so the migration
file is baked in, then run it against RDS the same way as step 3 above.

## Teardown

```bash
terraform destroy
```

`skip_final_snapshot = true` on the RDS instance means this does not leave a
snapshot behind - if you want to keep the data, take a manual RDS snapshot
first.
