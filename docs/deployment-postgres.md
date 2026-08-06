# Deploying with PostgreSQL instead of SQLite

The app defaults to SQLite (`lib/db.ts`, `prisma/schema.prisma`, a local
`dev.db` file). That's fine for local development and for any host with a
persistent, single-instance filesystem, but it's not a good fit for
serverless hosts like Vercel: the filesystem is read-only/ephemeral at
runtime, so a SQLite file written by one request won't be there for the
next one, and concurrent serverless instances can't safely share a single
local file. If you're deploying somewhere like that, switch to Postgres.

## Why this isn't a `DATABASE_PROVIDER=postgresql` env var

Prisma 7's driver-adapter model bakes dialect-specific query generation into
the Prisma Client at `prisma generate` time — the client generated from a
`provider = "sqlite"` schema cannot correctly execute against Postgres just
by swapping the adapter passed to `new PrismaClient({ adapter })`. The two
providers need genuinely separate generated clients. That's why this repo
ships **two** schema files (`prisma/schema.prisma` for SQLite,
`prisma/schema.postgres.prisma` for Postgres) with separate generator
`output` paths, rather than one schema with a dynamic provider. This is
schema/deployment-time scaffolding, not a runtime toggle — `lib/db.ts`
still hardcodes the SQLite client today, and switching to Postgres means
deliberately replacing it (see below), not flipping an env var.

## Steps

1. **Provision a Postgres database** (Vercel Postgres, Neon, Supabase,
   RDS, etc.) and get its connection string.

2. **Set `POSTGRES_DATABASE_URL`** in `.env` (locally) or your host's env
   vars (in production) to that connection string. This is a separate var
   from `DATABASE_URL` so the existing SQLite dev setup keeps working
   untouched.

3. **Move the Postgres packages into `dependencies`.** They're currently
   `devDependencies` (needed locally to run `generate`/`migrate` against
   the schema below) — for the app to actually run against Postgres in
   production, `@prisma/adapter-pg` and `pg` need to ship in the
   production bundle:

   ```bash
   npm install @prisma/adapter-pg pg
   npm uninstall --save-dev @prisma/adapter-pg pg @types/pg
   npm install --save-dev @types/pg
   ```

4. **Generate the Postgres client:**

   ```bash
   npm run db:generate:postgres
   ```

   This reads `prisma.postgres.config.ts` → `prisma/schema.postgres.prisma`
   and writes the client to `lib/generated/prisma-postgres/` (gitignored,
   same as the SQLite client).

5. **Run the initial migration against your Postgres database:**

   ```bash
   npm run db:migrate:postgres
   ```

   This creates `prisma/migrations-postgres/` — a separate migration
   history from `prisma/migrations/`, since the SQL is dialect-specific.
   Commit this folder once it exists.

6. **Point `lib/db.ts` at the Postgres client and adapter.** Replace its
   contents with:

   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";
   import { PrismaClient } from "@/lib/generated/prisma-postgres/client";

   const globalForPrisma = globalThis as unknown as {
     prisma: PrismaClient | undefined;
   };

   function createPrismaClient() {
     const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_DATABASE_URL });
     return new PrismaClient({ adapter });
   }

   export const prisma = globalForPrisma.prisma ?? createPrismaClient();

   if (process.env.NODE_ENV !== "production") {
     globalForPrisma.prisma = prisma;
   }
   ```

   From this point on, `prisma/schema.prisma` (SQLite) and its generated
   client are unused dead weight in that deployment — you can leave them
   in place for local dev against SQLite on a branch, or remove them if
   this app will only ever run against Postgres from here on.

7. **Seed and verify** as usual (`npm run db:seed`, `npm run build`,
   `npm run start`), now pointed at Postgres.

## Keeping both schemas in sync

There's no `include`/inheritance mechanism between the two schema files —
if you add or change a model, update both `prisma/schema.prisma` and
`prisma/schema.postgres.prisma` by hand, then regenerate both clients and
create matching migrations in both `prisma/migrations/` and
`prisma/migrations-postgres/`.

## The `Bytes` fields (Photo model)

`Photo.thumbData`/`Photo.fullData` map to `BLOB` in SQLite and `bytea` in
Postgres — both are handled transparently by Prisma's driver adapters, no
extra config needed.
