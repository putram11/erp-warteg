#!/bin/bash

# Production deployment script
echo "🚀 Starting ERP Warteg Production Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Pull latest image
echo "📥 Pulling latest image..."
docker pull $DOCKER_USERNAME/erp-warteg:latest

# Stop and remove existing container
echo "🛑 Stopping existing container..."
docker stop erp-warteg 2>/dev/null || true
docker rm erp-warteg 2>/dev/null || true

# Create logs directory
mkdir -p ./logs

# Run new container
echo "🔄 Starting new container..."
docker run -d \
  --name erp-warteg \
  --restart unless-stopped \
  -p 3000:3000 \
  -p 5000:5000 \
  -v $(pwd)/logs:/app/logs \
  -e NODE_ENV=production \
  $DOCKER_USERNAME/erp-warteg:latest

# Wait for container to start
echo "⏳ Waiting for services to start..."
sleep 10

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
fi

# Show container status
echo "📊 Container status:"
docker ps | grep erp-warteg

echo "🎉 Deployment completed!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:5000"
echo "📝 Logs: docker logs erp-warteg"
