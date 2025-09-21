# ERP Warteg Makefile
.PHONY: help build run stop clean dev prod deploy logs test lint

# Default target
help: ## Show this help message
	@echo "ERP Warteg - Available Commands:"
	@echo "================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development
dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	docker-compose up --build

dev-detached: ## Start development environment in background
	@echo "🚀 Starting development environment (detached)..."
	docker-compose up -d --build

stop: ## Stop all containers
	@echo "🛑 Stopping all containers..."
	docker-compose down

clean: ## Stop containers and remove volumes
	@echo "🧹 Cleaning up containers and volumes..."
	docker-compose down -v --remove-orphans
	docker system prune -f

# Production
build: ## Build production Docker image
	@echo "🏗️ Building production Docker image..."
	docker build -t erp-warteg:latest .

prod: ## Start production environment
	@echo "🚀 Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d

prod-build: ## Build and start production environment
	@echo "🏗️ Building and starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d --build

deploy: ## Deploy using deployment script
	@echo "🚀 Deploying application..."
	./deploy.sh

# Monitoring
logs: ## Show logs from all containers
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker logs -f warteg-backend

logs-frontend: ## Show frontend logs
	docker logs -f warteg-frontend

status: ## Show container status
	@echo "📊 Container Status:"
	docker ps | grep warteg

# Database
db-migrate: ## Run database migrations
	@echo "🗃️ Running database migrations..."
	docker-compose exec backend npx prisma migrate dev

db-seed: ## Seed database with sample data
	@echo "🌱 Seeding database..."
	docker-compose exec backend npm run seed

db-reset: ## Reset database
	@echo "🔄 Resetting database..."
	docker-compose exec backend npx prisma migrate reset

# Testing
test: ## Run tests
	@echo "🧪 Running tests..."
	docker-compose exec backend npm test
	docker-compose exec frontend npm test

test-backend: ## Run backend tests only
	@echo "🧪 Running backend tests..."
	docker-compose exec backend npm test

test-frontend: ## Run frontend tests only
	@echo "🧪 Running frontend tests..."
	docker-compose exec frontend npm test

# Code Quality
lint: ## Run linting
	@echo "🔍 Running linting..."
	docker-compose exec backend npm run lint || echo "Backend: No lint script found"
	docker-compose exec frontend npm run lint || echo "Frontend: No lint script found"

format: ## Format code
	@echo "✨ Formatting code..."
	docker-compose exec backend npm run format || echo "Backend: No format script found"
	docker-compose exec frontend npm run format || echo "Frontend: No format script found"

# Docker Hub
push: ## Push image to Docker Hub
	@echo "📤 Pushing image to Docker Hub..."
	@if [ -z "$$DOCKER_USERNAME" ]; then \
		echo "❌ DOCKER_USERNAME environment variable is not set"; \
		exit 1; \
	fi
	docker tag erp-warteg:latest $$DOCKER_USERNAME/erp-warteg:latest
	docker push $$DOCKER_USERNAME/erp-warteg:latest

pull: ## Pull image from Docker Hub
	@echo "📥 Pulling image from Docker Hub..."
	@if [ -z "$$DOCKER_USERNAME" ]; then \
		echo "❌ DOCKER_USERNAME environment variable is not set"; \
		exit 1; \
	fi
	docker pull $$DOCKER_USERNAME/erp-warteg:latest

# Setup
setup: ## Setup CI/CD and development environment
	@echo "🔧 Setting up CI/CD and development environment..."
	./setup-cicd.sh

install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	cd backend && npm install
	cd frontend && npm install

# Backup
backup-db: ## Backup database
	@echo "💾 Backing up database..."
	docker-compose exec postgres pg_dump -U warteg_user warteg_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db: ## Restore database from backup (specify BACKUP_FILE)
	@echo "📥 Restoring database..."
	@if [ -z "$$BACKUP_FILE" ]; then \
		echo "❌ Please specify BACKUP_FILE=filename.sql"; \
		exit 1; \
	fi
	docker-compose exec -T postgres psql -U warteg_user warteg_db < $$BACKUP_FILE

# Health checks
health: ## Check application health
	@echo "🏥 Checking application health..."
	@echo "Backend Health:"
	@curl -s http://localhost:5000/health | jq . || echo "❌ Backend not responding"
	@echo "Frontend Health:"
	@curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200" && echo "✅ Frontend OK" || echo "❌ Frontend not responding"

# Quick commands
restart: stop dev ## Restart development environment

rebuild: clean dev ## Clean and rebuild development environment
