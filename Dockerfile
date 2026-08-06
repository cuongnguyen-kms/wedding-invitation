# Build for linux/amd64 (App Runner's platform): docker build --platform linux/amd64 -t wedding-invitation .
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generates lib/generated/prisma-postgres (gitignored) from prisma/schema.postgres.prisma.
# Needs no live DB connection - schema-only codegen.
RUN npx prisma generate --config prisma.postgres.config.ts
RUN npm run build
RUN npm prune --omit=dev

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app ./
USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
