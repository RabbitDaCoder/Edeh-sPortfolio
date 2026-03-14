#!/bin/sh
set -e

echo "==> Running Prisma migrations..."
npx prisma migrate deploy --schema=backend/prisma/schema.prisma

echo "==> Running seed script..."
node backend/dist/seed/seed.js || echo "Seed script failed (may already be seeded), continuing..."

echo "==> Starting server..."
exec node backend/dist/server.js
