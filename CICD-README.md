# GitHub CI/CD Setup untuk ERP Warteg

## 📋 Overview
Repository ini menggunakan GitHub Actions untuk otomatis build dan push Docker image ke Docker Hub setiap kali ada push ke branch main atau develop.

## 🚀 Features
- **Multi-stage Docker build** untuk optimasi ukuran image
- **Automated testing** sebelum build
- **Security scanning** dengan Trivy
- **Multi-platform support** (AMD64 dan ARM64)
- **Caching** untuk mempercepat build
- **Backend dan Frontend** dalam satu image menggunakan PM2

## 🔧 Setup Instructions

### 1. Setup Docker Hub Secrets
Di GitHub repository, tambahkan secrets berikut di **Settings > Secrets and variables > Actions**:

```
DOCKER_USERNAME: your-dockerhub-username
DOCKER_PASSWORD: your-dockerhub-access-token
```

**Cara membuat Docker Hub Access Token:**
1. Login ke Docker Hub
2. Pergi ke **Account Settings > Security**
3. Klik **New Access Token**
4. Berikan nama dan pilih permissions
5. Copy token yang dihasilkan

### 2. Repository Structure
```
├── .github/workflows/
│   └── docker-build.yml     # GitHub Actions workflow
├── backend/                 # Backend Node.js application
├── frontend/                # Frontend Next.js application
├── Dockerfile              # Multi-stage Docker build
├── ecosystem.config.js     # PM2 configuration
├── .dockerignore          # Docker ignore file
└── docker-compose.yml     # Development environment
```

### 3. Workflow Triggers
Workflow akan berjalan pada:
- **Push** ke branch `main` atau `develop`
- **Pull Request** ke branch `main`
- **Git tags** dengan format `v*` (contoh: v1.0.0)

### 4. Docker Image Tags
- `latest` - untuk push ke main branch
- `develop` - untuk push ke develop branch
- `v1.0.0` - untuk git tags
- `pr-123` - untuk pull requests

## 🏗️ Build Process

### Stage 1: Testing
- Install dependencies untuk backend dan frontend
- Run tests (jika ada)
- Run linting (jika ada)

### Stage 2: Docker Build
- Build frontend dengan Next.js
- Setup backend dengan Node.js
- Combine keduanya dalam production image
- Push ke Docker Hub dengan tags yang sesuai

### Stage 3: Security Scan
- Scan image dengan Trivy untuk vulnerabilities
- Upload hasil ke GitHub Security tab

## 🐳 Docker Image Details

### Ports
- **3000** - Frontend (Next.js)
- **5000** - Backend (Node.js API)

### Services
Image menjalankan 2 service dengan PM2:
1. **erp-warteg-frontend** - Next.js application
2. **erp-warteg-backend** - Node.js API server

### Health Check
Container memiliki health check pada port 3000/health

## 🚀 Deployment

### Manual Run
```bash
# Pull image
docker pull your-username/erp-warteg:latest

# Run container
docker run -d \
  --name erp-warteg \
  -p 3000:3000 \
  -p 5000:5000 \
  your-username/erp-warteg:latest
```

### Docker Compose
```yaml
version: '3.8'
services:
  erp-warteg:
    image: your-username/erp-warteg:latest
    ports:
      - "3000:3000"
      - "5000:5000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 📊 Monitoring

### Logs
```bash
# View all logs
docker logs erp-warteg

# View PM2 logs
docker exec erp-warteg pm2 logs

# View specific service logs
docker exec erp-warteg pm2 logs erp-warteg-frontend
docker exec erp-warteg pm2 logs erp-warteg-backend
```

### PM2 Monitoring
```bash
# View PM2 status
docker exec erp-warteg pm2 status

# Monitor processes
docker exec erp-warteg pm2 monit
```

## 🔒 Security

- Image di-scan menggunakan Trivy untuk vulnerabilities
- Multi-stage build untuk mengurangi attack surface
- Non-root user untuk menjalankan aplikasi
- Health checks untuk monitoring

## 🛠️ Troubleshooting

### Build Failures
1. Check workflow logs di GitHub Actions tab
2. Verify Docker Hub credentials
3. Check if all dependencies are properly installed

### Runtime Issues
1. Check container logs: `docker logs erp-warteg`
2. Verify port availability
3. Check PM2 process status: `docker exec erp-warteg pm2 status`

### Performance Optimization
- Image menggunakan Alpine Linux untuk ukuran minimal
- Multi-stage build untuk exclude development dependencies
- Build cache untuk mempercepat subsequent builds

## 📝 Notes
- Workflow akan skip jika tidak ada perubahan pada Dockerfile atau source code
- Security scan hanya berjalan untuk push ke main branch
- Multi-platform build mendukung AMD64 dan ARM64 architectures
