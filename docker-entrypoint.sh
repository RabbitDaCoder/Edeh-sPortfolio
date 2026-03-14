#!/bin/sh
set -e

# Ensure prisma binary is on PATH (may be hoisted to root or in backend)
export PATH="/app/node_modules/.bin:/app/backend/node_modules/.bin:$PATH"

echo "==> Running Prisma migrations..."
prisma migrate deploy --schema=backend/prisma/schema.prisma

echo "==> Running seed script..."
node backend/dist/seed/seed.js || echo "Seed script failed (may already be seeded), continuing..."

echo "==> Starting server..."
exec node backend/dist/server.js
