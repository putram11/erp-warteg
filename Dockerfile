# Multi-stage build untuk ERP Warteg
# Stage 1: Build Frontend (React + Vite)
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files first for better caching
COPY frontend/package*.json ./
RUN npm ci

# Copy source code and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy package files first for better caching
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy source code
COPY backend/ ./

# Stage 3: Production
FROM node:18-alpine AS production

# Install PM2 globally
RUN npm install -g pm2

# Create app directory
WORKDIR /app

# Copy backend files and dependencies
COPY --from=backend-builder /app/backend ./backend
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy frontend build (Vite build output)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=frontend-builder /app/frontend/package.json ./frontend/package.json

# Install serve to serve the React build
RUN npm install -g serve

# Create PM2 ecosystem file
COPY ecosystem.config.js ./

# Expose ports
EXPOSE 3000 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start both services with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
