# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files and all workspace package.json stubs
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY dashboard/package.json dashboard/
COPY email-service/package.json email-service/

# Install all workspace dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ frontend/

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Runtime stage
FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/frontend/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["serve", "-s", "dist", "-l", "3000"]
