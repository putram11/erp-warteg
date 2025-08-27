# ERP Warteg - Enterprise Warteg Planning System 🍛

Sistem manajemen warteg lengkap yang dibangun dengan teknologi modern untuk mengelola menu, transaksi, keuangan, karyawan, dan laporan bisnis warteg.

## 🌟 Fitur Utama

### 🍛 Menu Management
- CRUD menu (lauk, nasi, sambal, sayur, minuman)
- Tracking stok otomatis (berkurang setelah transaksi)
- Kategori menu yang terorganisir
- Alert stok rendah

### 💵 Keuangan
- Pencatatan utang pelanggan
- Sistem cicilan "bayar nanti"
- Laporan arus kas harian/bulanan
- Tracking pembayaran dan hutang

### 🧍 Manajemen Karyawan & Pelanggan
- Data lengkap ibu warteg dan karyawan
- Database pelanggan langganan
- Role-based access control
- Manajemen user yang fleksibel

### 📊 Laporan & Analytics
- Dashboard real-time dengan statistik
- Grafik penjualan harian/bulanan
- Analisis menu terpopuler
- Laporan keuangan komprehensif
- Visualisasi data dengan Recharts

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **Prisma ORM** - Database management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query (TanStack Query)** - Data fetching
- **React Hook Form** - Form management
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Node.js 18** - Runtime environment

## 🏗️ Struktur Project

```
erp-warteg/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── routes/            # API routes per module
│   │   ├── controllers/       # Business logic controllers
│   │   ├── services/          # Database services
│   │   ├── middleware/        # Auth & validation middleware
│   │   └── utils/             # Helper utilities
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seeders/           # Dummy data seeders
│   └── Dockerfile
├── frontend/                   # Next.js client application
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # API services & configs
│   │   ├── types/             # TypeScript definitions
│   │   └── utils/             # Helper functions
│   └── Dockerfile
├── docker-compose.yml          # Multi-service orchestration
└── README.md
```

## 🚀 Quick Start

### Prasyarat
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/erp-warteg.git
cd erp-warteg
```

### 2. Setup Environment Variables
```bash
# Copy example environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit .env files sesuai kebutuhan
```

### 3. Start dengan Docker Compose
```bash
# Build dan start semua services
docker-compose up --build

# Atau jalankan di background
docker-compose up -d --build
```

### 4. Setup Database (opsional jika menggunakan Docker)
```bash
# Masuk ke container backend
docker-compose exec backend bash

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed dummy data
npm run prisma:seed
```

### 5. Akses Aplikasi
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

## 🔐 Login Demo

### Akun Demo yang Tersedia:
- **Pemilik**: `owner@warteg.com` / `password123`
- **Karyawan**: `employee1@warteg.com` / `password123`
- **Pelanggan**: `customer1@example.com` / `password123`

## 📖 Development

### Backend Development
```bash
cd backend

# Install dependencies
npm install

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start development server
npm run dev

# View database
npm run prisma:studio
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## 🗃️ Database Schema

### Core Entities:
- **Users** - Pemilik, karyawan, pelanggan dengan role-based access
- **Menus** - Daftar makanan/minuman dengan kategori dan stok
- **Transactions** - Record transaksi penjualan
- **TransactionItems** - Detail item dalam setiap transaksi
- **CustomerDebts** - Manajemen utang pelanggan
- **PaymentRecords** - Record pembayaran cicilan
- **StockHistories** - Riwayat perubahan stok

### Relationships:
- One-to-Many: User → Transactions
- One-to-Many: Transaction → TransactionItems
- One-to-One: Transaction → CustomerDebt
- One-to-Many: CustomerDebt → PaymentRecords

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Menu Management
- `GET /api/menus` - List semua menu
- `POST /api/menus` - Tambah menu baru
- `PUT /api/menus/:id` - Update menu
- `DELETE /api/menus/:id` - Hapus menu
- `POST /api/menus/:id/stock` - Update stok

### Transactions
- `GET /api/transactions` - List transaksi
- `POST /api/transactions` - Buat transaksi baru
- `POST /api/transactions/:id/payments` - Tambah pembayaran

### Reports
- `GET /api/reports/dashboard` - Dashboard data
- `GET /api/reports/sales/daily` - Laporan penjualan harian
- `GET /api/reports/menu/popular` - Menu terpopuler

## 🐳 Docker Services

### Services yang berjalan:
1. **postgres** - PostgreSQL database (port 5432)
2. **backend** - Express.js API server (port 5000)
3. **frontend** - Next.js application (port 3000)

### Docker Commands:
```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Rebuild specific service
docker-compose up --build [service_name]

# Access service shell
docker-compose exec [service_name] bash
```

## 📊 Features Roadmap

### ✅ Implemented
- [x] User authentication & authorization
- [x] Menu CRUD dengan kategori
- [x] Stock management otomatis
- [x] Transaction processing
- [x] Customer debt management
- [x] Payment tracking
- [x] Dashboard analytics
- [x] Sales reports
- [x] Docker containerization

### 🔄 Coming Soon
- [ ] Notification system
- [ ] Inventory reorder alerts
- [ ] Advanced reporting filters
- [ ] Export data (PDF, Excel)
- [ ] Mobile responsive improvements
- [ ] Multi-tenant support

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Terinspirasi dari kebutuhan digitalisasi UMKM warteg di Indonesia
- Built with modern web technologies untuk scalability dan maintainability
- Special thanks to warteg owners yang memberikan insights tentang proses bisnis

---

**Made with ❤️ for Indonesian Warteg Industry**