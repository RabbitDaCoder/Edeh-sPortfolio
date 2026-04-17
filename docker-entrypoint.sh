#!/bin/sh
set -e

# Ensure prisma binary is on PATH (may be hoisted to root or in backend)
export PATH="/app/node_modules/.bin:/app/backend/node_modules/.bin:$PATH"

# Fallback: if DIRECT_DATABASE_URL is not set, use DATABASE_URL
export DIRECT_DATABASE_URL="${DIRECT_DATABASE_URL:-$DATABASE_URL}"

echo "==> Running Prisma migrations..."
prisma migrate deploy --schema=backend/prisma/schema.prisma

# Seed is a MANUAL command only — never run automatically on deploy.
# Use: npm run db:seed (local) or run seed.js directly in the container.
# Running seed on every deploy risks overwriting live dashboard data.

echo "==> Starting server..."
exec node backend/dist/server.js
