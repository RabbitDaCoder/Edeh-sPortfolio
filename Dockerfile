# ─── Stage 1: Builder ────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# System deps for native modules (bcrypt, prisma)
RUN apk add --no-cache python3 make g++

# 1. Copy manifests first (maximizes Docker layer cache)
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY dashboard/package.json dashboard/
COPY email-service/package.json email-service/

# 2. Install ALL deps (dev + prod) for building
RUN npm ci --workspace=backend

# 3. Copy Prisma schema and generate client
COPY backend/prisma backend/prisma
RUN npx --prefix backend prisma generate --schema=backend/prisma/schema.prisma

# 4. Copy source and build
COPY backend/src backend/src
COPY backend/tsconfig.json backend/
RUN npm run build --workspace=backend

# 5. Prune dev dependencies for production image
RUN npm prune --production --workspace=backend

# ─── Stage 2: Production ─────────────────────────────────────────────
FROM node:20-alpine AS production
RUN apk add --no-cache tini curl openssl
WORKDIR /app

# Copy production artifacts from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# Non-root user for security
RUN addgroup -g 1001 -S portfolio && \
    adduser -S portfolio -u 1001 -G portfolio && \
    mkdir -p /tmp/uploads && \
    chown -R portfolio:portfolio /app /tmp/uploads

USER portfolio

ENV NODE_ENV=production
ENV PORT=4000
ENV UPLOAD_TEMP_DIR=/tmp/uploads
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT:-4000}/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]

# Default CMD: run migrations, seed admin, then start API server
CMD ["sh", "-c", "npx --prefix backend prisma migrate deploy --schema=backend/prisma/schema.prisma && node backend/dist/server.js"]
