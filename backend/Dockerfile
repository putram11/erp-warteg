FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (include dev dependencies for prisma)
RUN npm ci

# Copy prisma schema first
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# For development, always ensure prisma is generated when container starts
CMD ["sh", "-c", "npx prisma generate && npm run dev"]
