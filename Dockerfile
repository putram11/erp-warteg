# ===========================
# Stage 1: Build Frontend (React + Vite)
# ===========================
FROM node:18-bullseye-slim AS frontend-builder

WORKDIR /app/frontend

# Install deps untuk build
RUN apt-get update && apt-get install -y curl bash && rm -rf /var/lib/apt/lists/*

# Copy package.json dulu supaya cache lebih optimal
COPY frontend/package*.json ./
RUN npm ci

# Copy source code & build
COPY frontend/ ./
RUN npm run build


# ===========================
# Stage 2: Build Backend (Node + Prisma)
# ===========================
FROM node:18-bullseye-slim AS backend-builder

WORKDIR /app/backend

# Install deps untuk prisma
RUN apt-get update && apt-get install -y openssl curl bash && rm -rf /var/lib/apt/lists/*

# Copy package.json & prisma schema
COPY backend/package*.json ./
COPY backend/prisma ./prisma

# Install deps (include dev untuk prisma)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy backend source
COPY backend/ ./


# ===========================
# Stage 3: Production
# ===========================
FROM node:18-bullseye-slim AS production

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y openssl curl bash \
  && npm install -g pm2 serve \
  && rm -rf /var/lib/apt/lists/*

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
