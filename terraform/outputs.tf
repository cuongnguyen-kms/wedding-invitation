output "app_runner_url" {
  description = "Default App Runner URL for the deployed service"
  value       = "https://${aws_apprunner_service.this.service_url}"
}

output "ecr_repository_url" {
  description = "Push images here, e.g. `docker push <this>:latest`"
  value       = aws_ecr_repository.this.repository_url
}

output "rds_endpoint" {
  description = "RDS Postgres endpoint (host:port)"
  value       = aws_db_instance.this.endpoint
}

output "postgres_database_url_secret_arn" {
  description = "Secrets Manager ARN holding the full POSTGRES_DATABASE_URL"
  value       = aws_secretsmanager_secret.db_url.arn
}
