// Config for the PostgreSQL variant of the schema (prisma/schema.postgres.prisma).
// Used only when deploying with Postgres instead of the default SQLite setup —
// see docs/deployment-postgres.md. Not read by the app at runtime.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.postgres.prisma",
  migrations: {
    path: "prisma/migrations-postgres",
  },
  datasource: {
    url: process.env["POSTGRES_DATABASE_URL"],
  },
});
