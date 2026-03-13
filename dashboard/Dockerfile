# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo files
COPY package.json package-lock.json ./
COPY dashboard ./dashboard

# Install dependencies
RUN npm ci

# Build dashboard
WORKDIR /app/dashboard
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dashboard/dist ./dashboard/dist

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/ || exit 1

CMD ["serve", "-s", "dashboard/dist", "-l", "3001"]
