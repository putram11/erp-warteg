#!/bin/bash

echo "🍛 Setting up ERP Warteg development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env.local ]; then
    echo "📝 Creating frontend/.env.local file..."
    cp frontend/.env.example frontend/.env.local
fi

echo "🐳 Building and starting services..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 30

echo "🗃️ Setting up database..."
docker-compose exec backend npm run db:setup

echo "✅ Setup complete!"
echo ""
echo "🚀 Services are running:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Database: localhost:5432"
echo ""
echo "🔐 Demo accounts:"
echo "   Owner:    owner@warteg.com / password123"
echo "   Employee: employee1@warteg.com / password123"
echo "   Customer: customer1@example.com / password123"
echo ""
echo "📊 Useful commands:"
echo "   docker-compose logs -f [service]  # View logs"
echo "   docker-compose down               # Stop services"
echo "   docker-compose up                 # Start services"
