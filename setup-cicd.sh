#!/bin/bash

echo "🚀 ERP Warteg CI/CD Quick Setup"
echo "================================="

# Check if required tools are installed
echo "🔍 Checking requirements..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check Git
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Requirements check passed"

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configurations"
else
    echo "✅ .env file already exists"
fi

# Check if this is a git repository
if [ ! -d .git ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit with CI/CD setup"
else
    echo "✅ Git repository already initialized"
fi

# Create logs directory
mkdir -p logs
echo "✅ Created logs directory"

# Setup GitHub repository
echo ""
echo "🔧 Manual Setup Required:"
echo "========================="
echo ""
echo "1. Create a new repository on GitHub"
echo "2. Add Docker Hub secrets to GitHub repository:"
echo "   - Go to Settings > Secrets and variables > Actions"
echo "   - Add DOCKER_USERNAME: your Docker Hub username"
echo "   - Add DOCKER_PASSWORD: your Docker Hub access token"
echo ""
echo "3. Push this code to GitHub:"
echo "   git remote add origin https://github.com/username/erp-warteg.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Edit .env file with your configurations:"
echo "   - DOCKER_USERNAME=your-dockerhub-username"
echo "   - Database credentials"
echo "   - JWT secret"
echo ""
echo "5. For production deployment:"
echo "   - Copy .env.example to .env.production"
echo "   - Update production environment variables"
echo "   - Run: ./deploy.sh"
echo ""
echo "📖 For detailed instructions, read CICD-README.md"
echo ""
echo "🎉 Setup completed! Happy coding!"
