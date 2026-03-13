# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY dashboard/package.json dashboard/
COPY email-service/package.json email-service/
RUN npm ci --workspace=backend

COPY backend/ backend/

WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

# Runtime stage
FROM node:20-alpine

RUN apk add --no-cache dumb-init

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/node_modules ./backend/node_modules

WORKDIR /app/backend

# Uploads go to Cloudinary (memory storage), but keep a tmp dir for multer edge cases
RUN mkdir -p /tmp/uploads && chown -R node:node /tmp/uploads
ENV UPLOAD_TEMP_DIR=/tmp/uploads

USER node

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 4000) + '/health', (r) => { if (r.statusCode !== 200) process.exit(1) })"

EXPOSE 4000

CMD ["dumb-init", "node", "dist/server.js"]
