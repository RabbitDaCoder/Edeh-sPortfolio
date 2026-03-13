# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo files
COPY package.json package-lock.json ./
COPY backend ./backend

# Install dependencies for the entire monorepo
RUN npm ci

# Build backend
WORKDIR /app/backend
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/prisma ./backend/prisma

# Install production dependencies only
RUN npm ci --omit=dev --workspace=backend

WORKDIR /app/backend

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 4000

CMD ["node", "dist/server.js"]
