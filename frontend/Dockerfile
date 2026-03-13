# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo files
COPY package.json package-lock.json ./
COPY frontend ./frontend

# Install dependencies
RUN npm ci

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Runtime stage - serve with Node static server
FROM node:20-alpine

WORKDIR /app

# Install serve to run static build
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["serve", "-s", "frontend/dist", "-l", "3000"]
