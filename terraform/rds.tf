resource "random_password" "db" {
  length  = 24
  special = false # avoids URL-encoding headaches in the connection string below
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.project_name}-db"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_db_instance" "this" {
  identifier     = "${var.project_name}-db"
  engine         = "postgres"
  engine_version = "16.4"
  instance_class = "db.t4g.micro"

  allocated_storage = 20
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = var.enable_public_migration_access

  multi_az                = false
  backup_retention_period = 3
  skip_final_snapshot     = true
  deletion_protection     = false

  tags = { Name = "${var.project_name}-db" }
}

# The app reads a single POSTGRES_DATABASE_URL (see lib/db.ts / docs/deployment-postgres.md),
# so the full connection string - not just host/user/pass - is stored as one secret,
# which is also what App Runner's runtime_environment_secrets can reference in one shot.
resource "aws_secretsmanager_secret" "db_url" {
  name = "${var.project_name}/postgres-database-url"
}

resource "aws_secretsmanager_secret_version" "db_url" {
  secret_id     = aws_secretsmanager_secret.db_url.id
  secret_string = "postgresql://${var.db_username}:${random_password.db.result}@${aws_db_instance.this.address}:${aws_db_instance.this.port}/${var.db_name}?sslmode=require"
}

resource "aws_secretsmanager_secret" "admin_password" {
  name = "${var.project_name}/admin-password"
}

resource "aws_secretsmanager_secret_version" "admin_password" {
  secret_id     = aws_secretsmanager_secret.admin_password.id
  secret_string = var.admin_password
}
