# Backend Dockerfile — for local docker-compose / standalone use
# For Render deployment, use the root Dockerfile instead

# ─── Stage 1: Builder ────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY dashboard/package.json dashboard/
COPY email-service/package.json email-service/
RUN npm ci --workspace=backend

COPY backend/prisma backend/prisma
RUN npx prisma generate --schema=backend/prisma/schema.prisma

COPY backend/src backend/src
COPY backend/tsconfig.json backend/
RUN npm run build --workspace=backend

RUN npm prune --production --workspace=backend

# ─── Stage 2: Production ─────────────────────────────────────────────
FROM node:20-alpine AS production
RUN apk add --no-cache tini curl openssl
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/node_modules ./backend/node_modules

RUN addgroup -g 1001 -S portfolio && \
    adduser -S portfolio -u 1001 -G portfolio && \
    chown -R portfolio:portfolio /app

USER portfolio

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT:-4000}/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy --schema=backend/prisma/schema.prisma && node backend/dist/server.js"]
