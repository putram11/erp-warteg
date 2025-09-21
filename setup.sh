#!/bin/bash

# ERP Warteg Setup Script
echo "🚀 Setting up ERP Warteg application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Copy environment file if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
fi

# Stop any running containers
echo "� Stopping any existing containers..."
docker-compose down

# Remove any existing volumes (optional - uncomment if you want fresh DB)
# docker-compose down -v

# Build and start services
echo "� Building and starting services..."
docker-compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 15

# Setup database (run migrations and seed)
echo "�️ Setting up database..."
docker-compose exec backend npm run prisma:generate
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed

echo "✅ Setup complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:5000"
echo "   Database: localhost:5432"
echo ""
echo "�️ Useful commands:"
echo "   Stop: docker-compose down"
echo "   Logs: docker-compose logs -f"
echo "   Rebuild: docker-compose up --build"
echo "   Reset DB: docker-compose exec backend npm run prisma:reset"
