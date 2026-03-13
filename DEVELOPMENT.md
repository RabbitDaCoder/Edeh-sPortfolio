# Getting Started with Development

This guide walks you through setting up the portfolio platform for local development.

## 📋 Prerequisites

Ensure you have the following installed:

- **Node.js** 20+ (download from [nodejs.org](https://nodejs.org))
- **npm** 10+ (comes with Node.js)
- **PostgreSQL** 16+ (download from [postgresql.org](https://www.postgresql.org/download/))
- **Redis** 7+ (download from [redis.io](https://redis.io/download))
- **Git** (download from [git-scm.com](https://git-scm.com))

Verify installations:

```bash
node --version   # v20.x.x
npm --version    # 10.x.x or higher
psql --version   # PostgreSQL 16.x
redis-cli --version # redis-cli 7.x
```

## 🚀 Quick Start (5 minutes)

### 1. Clone and install

```bash
git clone <repository-url>
cd portfolio-platform
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

Open `.env` and update:

```env
# Database (use your PostgreSQL credentials)
DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/portfolio_dev

# Redis (if not running on default)
REDIS_URL=redis://localhost:6379

# Email (optional, set for contact form testing)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# JWT secrets (change these!)
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-key-change-in-production
```

### 3. Setup database

```bash
# Create tables and schema
npm run db:migrate --workspace=backend

# Seed initial data (creates admin user)
npm run db:seed --workspace=backend
```

Admin credentials for dashboard login:

- **Email**: `admin@portfolio.dev`
- **Password**: `password123`

### 4. Create frontend/dashboard env files

```bash
cp frontend/.env.example frontend/.env.local
cp dashboard/.env.example dashboard/.env.local
```

The default `VITE_API_URL=http://localhost:4000/api` should work.

### 5. Start development servers

```bash
npm run dev
```

This starts all three apps concurrently:

| Service       | URL                   | Purpose                   |
| ------------- | --------------------- | ------------------------- |
| **Backend**   | http://localhost:4000 | API server & Swagger docs |
| **Frontend**  | http://localhost:3000 | Public portfolio website  |
| **Dashboard** | http://localhost:3001 | Admin panel               |

**First load** may take 30-60s as Vite builds the frontend apps.

---

## 🛠️ Manual Setup (if concurrent start fails)

Start each app in a separate terminal:

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3: Dashboard
npm run dev:dashboard
```

---

## 🐳 Docker Setup (Alternative)

If you have Docker installed, skip manual PostgreSQL/Redis setup:

```bash
# Build and start all services (postgres, redis, backend, frontend, dashboard)
docker-compose up -d

# First time only: run migrations
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# View logs
docker-compose logs -f backend

# Shutdown
docker-compose down
```

Same URLs work: http://localhost:3000, http://localhost:3001, http://localhost:4000

---

## ✅ Verify Setup

After starting, check:

- [ ] **Frontend loads**: http://localhost:3000 (you should see your portfolio)
- [ ] **Dashboard loads**: http://localhost:3001 (login page)
- [ ] **Backend API works**: http://localhost:4000/health (should return `{"status":"ok"}`)
- [ ] **Swagger docs available**: http://localhost:4000/api/docs (full API reference)

---

## 📝 Common Commands

### Development

```bash
# Start all apps with hot reload
npm run dev

# Start specific app
npm run dev:frontend
npm run dev:dashboard
npm run dev:backend

# Type check
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format
```

### Database

```bash
# Create migration from schema changes
npm run db:migrate --workspace=backend

# View data (Prisma Studio GUI)
npm run prisma:studio --workspace=backend

# Seed database with initial data
npm run db:seed --workspace=backend

# Reset database (careful!)
npm run db:reset --workspace=backend
```

### Build

```bash
# Build all apps for production
npm run build

# Build specific app
npm run build:backend
npm run build:frontend
npm run build:dashboard
```

### Testing

```bash
# Run backend tests
npm run test --workspace=backend

# Watch mode
npm run test:watch --workspace=backend
```

---

## 🔐 Default Credentials

After seeding, you can login to the dashboard:

- **Email**: `admin@portfolio.dev`
- **Password**: `password123`

**⚠️ Change these in production!**

---

## 🐛 Troubleshooting

### Port already in use (3000/3001/4000)

Another app is using the port. Either:

1. Kill the process: `netstat -ano | findstr :3000` (Windows) or `lsof -i :3000` (Mac/Linux)
2. Change port in `vite.config.ts`

### PostgreSQL connection refused

Check PostgreSQL is running:

```bash
psql -U postgres -d postgres -c "SELECT 1"
```

If not installed, download from [postgresql.org](https://www.postgresql.org/download/)

### Redis connection refused

Check Redis is running:

```bash
redis-cli ping  # Should return "PONG"
```

If not installed, download from [redis.io](https://redis.io/download)

### Database migration fails

```bash
# Reset to clean state
npm run db:reset --workspace=backend

# Then re-migrate
npm run db:migrate --workspace=backend
```

### "Cannot find module" errors

Dependencies may not be installed:

```bash
npm install
```

### Frontend API 404 errors

Ensure backend is running (`npm run dev:backend`) and `VITE_API_URL` in `frontend/.env.local` matches backend URL.

---

## 📚 Learn More

- [Architecture Overview](./README.md#-architecture)
- [API Documentation](http://localhost:4000/api/docs) (available when backend runs)
- [Contributing Guide](./CONTRIBUTING.md)
- [Deployment Guide](./README.md#-deployment)

---

**Stuck?** Open an issue on GitHub or email admin@portfolio.dev
