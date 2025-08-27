#!/bin/bash

echo "🍛 ERP Warteg - Development Quick Start"
echo "======================================"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ All prerequisites are installed."

# Check if .env files exist
echo "📝 Setting up environment files..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env file"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local file"
fi

# Start PostgreSQL with Docker
echo "🐳 Starting PostgreSQL database..."
docker run -d \
    --name warteg-postgres \
    -e POSTGRES_USER=warteg_user \
    -e POSTGRES_PASSWORD=warteg_password \
    -e POSTGRES_DB=warteg_db \
    -p 5432:5432 \
    postgres:15-alpine || echo "PostgreSQL container might already be running"

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Setup backend
echo "🔧 Setting up backend..."
cd backend

if [ ! -d node_modules ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "🗃️ Setting up database..."
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

if [ ! -d node_modules ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "🚀 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ ERP Warteg is now running!"
echo "================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "🗃️ Database: localhost:5432"
echo ""
echo "🔐 Demo Accounts:"
echo "   👑 Owner:    owner@warteg.com / password123"
echo "   👷 Employee: employee1@warteg.com / password123"
echo "   👤 Customer: customer1@example.com / password123"
echo ""
echo "⚡ Development servers are running in the background."
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   docker stop warteg-postgres"
echo ""
echo "📊 Useful URLs:"
echo "   Prisma Studio: http://localhost:5555 (run 'npm run prisma:studio' in backend/)"
echo "   API Health:    http://localhost:5000/health"

# Keep script running
wait
