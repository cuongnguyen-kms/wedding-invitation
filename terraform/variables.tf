variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix used for naming AWS resources"
  type        = string
  default     = "wedding-invitation"
}

variable "db_name" {
  description = "Postgres database name"
  type        = string
  default     = "wedding"
}

variable "db_username" {
  description = "Postgres master username"
  type        = string
  default     = "wedding_app"
}

variable "admin_username" {
  description = "HTTP Basic Auth username for /admin routes (see proxy.ts)"
  type        = string
  default     = "admin"
}

variable "admin_password" {
  description = "HTTP Basic Auth password for /admin routes (see proxy.ts). Set this in terraform.tfvars (gitignored) - never commit it."
  type        = string
  sensitive   = true
}

variable "container_image_tag" {
  description = "Tag in ECR that the App Runner service should run"
  type        = string
  default     = "latest"
}

variable "enable_nat_gateway" {
  description = "Creates a NAT Gateway (real hourly cost) so the private subnets can reach the internet - needed by codebuild-migrate.tf's VPC-attached build to pull our ECR image. Flip on right before running a migration, off right after; nothing NAT-related exists in this config at all while false."
  type        = bool
  default     = false
}

variable "github_owner_repo" {
  description = "GitHub \"owner/repo\" that's allowed to assume the deploy role via OIDC - see github-actions.tf"
  type        = string
  default     = "cuongnguyen-kms/wedding-invitation"
}

variable "github_deploy_branch" {
  description = "Branch allowed to assume the deploy role - matches the trigger branch in ../.github/workflows/deploy.yml"
  type        = string
  default     = "master"
}
