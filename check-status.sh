#!/bin/bash

# ERP Warteg - Project Status Check
# This script checks if all components are properly configured

echo "🏪 ERP WARTEG - PROJECT STATUS CHECK"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "   Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
else
    echo "✅ Docker is installed"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    echo "   Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
else
    echo "✅ Docker Compose is installed"
fi

# Check if Node.js is installed (for development)
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed (required for development mode)"
    echo "   Install Node.js 18+: https://nodejs.org/"
else
    echo "✅ Node.js is installed: $(node --version)"
fi

echo ""
echo "📁 PROJECT STRUCTURE:"
echo "----------------------"

# Check backend structure
if [ -d "backend/src" ]; then
    echo "✅ Backend structure complete"
    echo "   - Controllers: $(ls backend/src/controllers/*.js 2>/dev/null | wc -l) files"
    echo "   - Services: $(ls backend/src/services/*.js 2>/dev/null | wc -l) files"
    echo "   - Routes: $(ls backend/src/routes/*.js 2>/dev/null | wc -l) files"
    echo "   - Middleware: $(ls backend/src/middleware/*.js 2>/dev/null | wc -l) files"
    echo "   - Utilities: $(ls backend/src/utils/*.js 2>/dev/null | wc -l) files"
else
    echo "❌ Backend structure incomplete"
fi

# Check frontend structure
if [ -d "frontend/src" ]; then
    echo "✅ Frontend structure complete"
    echo "   - Pages: $(find frontend/src/app -name "page.tsx" 2>/dev/null | wc -l) files"
    echo "   - Components: $(find frontend/src -name "*.tsx" -not -path "*/app/*" 2>/dev/null | wc -l) files"
    echo "   - Services: $(ls frontend/src/lib/*.ts 2>/dev/null | wc -l) files"
else
    echo "❌ Frontend structure incomplete"
fi

# Check database structure
if [ -f "backend/prisma/schema.prisma" ]; then
    echo "✅ Database schema defined"
    echo "   - Models: $(grep -c "^model" backend/prisma/schema.prisma) entities"
else
    echo "❌ Database schema missing"
fi

# Check Docker configuration
if [ -f "docker-compose.yml" ]; then
    echo "✅ Docker Compose configuration exists"
    echo "   - Services: $(grep -c "^  [a-zA-Z]" docker-compose.yml) containers"
else
    echo "❌ Docker Compose configuration missing"
fi

# Check environment files
echo ""
echo "🔧 ENVIRONMENT SETUP:"
echo "--------------------"

if [ -f ".env.example" ]; then
    echo "✅ Root environment example exists"
else
    echo "❌ Root environment example missing"
fi

if [ -f "backend/.env.example" ]; then
    echo "✅ Backend environment example exists"
else
    echo "❌ Backend environment example missing"
fi

if [ -f "frontend/.env.example" ]; then
    echo "✅ Frontend environment example exists"
else
    echo "❌ Frontend environment example missing"
fi

echo ""
echo "🚀 QUICK START OPTIONS:"
echo "----------------------"
echo "1. Production (Docker): ./setup.sh"
echo "2. Development: ./dev-start.sh"
echo ""

# Check if setup is ready
READY=true

if [ ! -f ".env" ]; then
    echo "⚠️  Copy .env.example to .env and configure"
    READY=false
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Copy backend/.env.example to backend/.env and configure"
    READY=false
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Copy frontend/.env.example to frontend/.env and configure"
    READY=false
fi

if [ "$READY" = true ]; then
    echo "✅ Project is ready to run!"
    echo ""
    echo "📊 DEMO CREDENTIALS:"
    echo "-------------------"
    echo "Owner: admin@warteg.com / password123"
    echo "Employee: kasir@warteg.com / password123"
    echo "Customer: customer@warteg.com / password123"
else
    echo ""
    echo "⚠️  Please configure environment files before running"
fi

echo ""
echo "📖 For detailed setup instructions, see README.md"
echo ""
