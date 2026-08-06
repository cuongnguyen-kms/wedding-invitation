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

variable "enable_public_migration_access" {
  description = "Temporarily makes RDS publicly accessible (restricted to migration_access_cidr) so you can run `prisma migrate deploy`/seed from your machine. Flip back to false once done."
  type        = bool
  default     = false
}

variable "migration_access_cidr" {
  description = "Your IP in CIDR form (e.g. 1.2.3.4/32). Only used when enable_public_migration_access is true."
  type        = string
  default     = ""
}
