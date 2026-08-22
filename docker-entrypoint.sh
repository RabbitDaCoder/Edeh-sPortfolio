#!/bin/sh
set -e

# Ensure prisma binary is on PATH (may be hoisted to root or in backend).
export PATH="/app/node_modules/.bin:/app/backend/node_modules/.bin:$PATH"

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is empty. Set it in Render to your MongoDB connection string, including the database name."
  echo "Example: mongodb+srv://USER:PASSWORD@HOST/edeh-portfolioDB?appName=edeh-portfolioDB"
  exit 1
fi

echo "==> Syncing Prisma schema to MongoDB..."
prisma db push --schema=backend/prisma/schema.prisma --skip-generate --accept-data-loss

# Seed is a MANUAL command only; never run automatically on deploy.
# Use: npm run db:seed (local) or run seed.js directly in the container.
# Running seed on every deploy risks overwriting live dashboard data.

echo "==> Starting server..."
exec node backend/dist/server.js
