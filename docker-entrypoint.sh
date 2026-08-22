#!/bin/sh
set -e

# Ensure workspace binaries are available if runtime scripts need them.
export PATH="/app/node_modules/.bin:/app/backend/node_modules/.bin:$PATH"

# Seed is a MANUAL command only; never run automatically on deploy.
# Use: npm run db:seed (local) or run seed.js directly in the container.
# Running seed on every deploy risks overwriting live dashboard data.

echo "==> Starting server..."
exec node backend/dist/server.js
