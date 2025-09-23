# ===========================
# Stage 1: Build Frontend (React + Vite)
# ===========================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files dulu biar cache lebih optimal
COPY frontend/package*.json ./
RUN npm ci

# Copy source code & build
COPY frontend/ ./
RUN npm run build

# ===========================
# Stage 2: Build Backend (FastAPI / Node backend Prisma)
# ===========================
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Prisma butuh OpenSSL 1.1 → install di build stage juga
RUN apk add --no-cache openssl1.1 bash

# Copy package.json & prisma schema
COPY backend/package*.json ./
COPY backend/prisma ./prisma

# Install deps (include dev buat prisma)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy backend source code
COPY backend/ ./

# ===========================
# Stage 3: Production
# ===========================
FROM node:18-alpine AS production

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache openssl1.1 curl bash \
  && npm install -g pm2 serve

# Copy backend (include node_modules + prisma client)
COPY --from=backend-builder /app/backend ./backend
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=frontend-builder /app/frontend/package.json ./frontend/package.json

# Copy PM2 ecosystem
COPY ecosystem.config.js ./

# Logs directory
RUN mkdir -p /app/logs

# Expose ports (Frontend 3000, Backend 5000)
EXPOSE 3000 5000

# Healthcheck (cek backend health endpoint)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Jalankan pakai PM2 (fork mode)
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
