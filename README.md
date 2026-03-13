# Portfolio Platform

> A production-grade monorepo portfolio platform built with PERN stack (PostgreSQL, Express, React, Node.js) + TypeScript, Redis caching, BullMQ job queue, and admin dashboard.

## 🏗️ Architecture

### Tech Stack

- **Backend**: Node.js 20 + Express.js + TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Caching & Sessions**: Redis with ioredis
- **Frontend**: React 18 + Vite + TypeScript
- **Admin Dashboard**: React 18 + Vite + TypeScript (with JWT auth)
- **Styling**: Tailwind CSS with CSS variables for theming
- **Validation**: Zod schemas on all boundaries
- **Background Jobs**: BullMQ with Redis queue
- **Email**: Nodemailer with SMTP
- **API Documentation**: Swagger/OpenAPI 3.0
- **Rate Limiting**: express-rate-limit with Redis store
- **Logging**: Pino (structured) + Morgan (HTTP)
- **Containerization**: Docker multi-stage builds + docker-compose

### Project Structure

```
portfolio-platform/
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── config/          # Environment, DB, Redis, Mail configs
│   │   ├── middleware/      # Auth, rate-limit, error handling
│   │   ├── services/        # Cache, mail services
│   │   ├── jobs/            # BullMQ queue and workers
│   │   ├── utils/           # Helpers, error codes, logger
│   │   ├── modules/         # Feature modules (8 total)
│   │   │   ├── auth/        # JWT, bcryptjs, token rotation
│   │   │   ├── blog/        # CRUD with Redis caching
│   │   │   ├── articles/    # CRUD with Redis caching
│   │   │   ├── books/       # CRUD with pricing
│   │   │   ├── career/      # Timeline with type enums
│   │   │   ├── achievements/
│   │   │   ├── downloads/   # Counter tracking
│   │   │   ├── contact/     # Form submission + email
│   │   │   └── newsletter/  # Subscribe/unsubscribe
│   │   ├── routes/v1/       # API route aggregation
│   │   ├── docs/            # Swagger setup
│   │   ├── app.ts           # Express app factory
│   │   └── server.ts        # Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema (11 models)
│   │   └── seed.ts          # Initial data seeding
│   └── Dockerfile           # Multi-stage build
│
├── frontend/                 # Public portfolio website
│   ├── src/
│   │   ├── lib/             # Axios instance, React Query client
│   │   ├── routes/          # 11 lazy-loaded routes
│   │   ├── features/        # Feature hooks (blog, articles, etc.)
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable UI components
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Utilities
│   │   ├── App.tsx          # Root component
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Tailwind directives
│   └── Dockerfile           # Multi-stage build
│
├── dashboard/               # Admin panel
│   ├── src/
│   │   ├── lib/             # Axios instance, React Query client
│   │   ├── routes/          # Protected routes + login
│   │   ├── pages/           # Admin pages (CRUD, messages)
│   │   ├── components/      # Admin UI components
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── Dockerfile           # Multi-stage build
│
├── docker-compose.yml       # Multi-service orchestration
├── .dockerignore             # Docker build exclude patterns
└── .github/workflows/ci.yml # GitHub Actions CI pipeline
```

### API Modules

| Module           | Features                                               | Rate Limit  |
| ---------------- | ------------------------------------------------------ | ----------- |
| **auth**         | Register, login, refresh token, logout                 | 5 req/min   |
| **blog**         | CRUD blogs. Cached: lists (5min), posts (10min)        | 100 req/min |
| **articles**     | CRUD articles. Same caching as blog                    | 100 req/min |
| **books**        | CRUD books with pricing (Decimal type)                 | 100 req/min |
| **career**       | Timeline entries with type enum (JOB, EDUCATION, etc.) | 100 req/min |
| **achievements** | Badge/achievement tracking                             | 100 req/min |
| **downloads**    | Resource management with counter                       | 100 req/min |
| **contact**      | Form submission with admin email                       | 3 req/hour  |
| **newsletter**   | Subscribe/unsubscribe with welcome email               | 100 req/min |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (or Docker)
- **PostgreSQL** 16+
- **Redis** 7+
- **npm** 10+ or **pnpm**

### Installation

#### Local Development

1. **Clone and setup root**:

   ```bash
   git clone <repo>
   cd portfolio-platform
   npm install
   ```

2. **Environment setup**:

   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL, Redis, SMTP credentials
   ```

3. **Database migration**:

   ```bash
   npm run db:migrate --workspace=backend
   npm run db:seed --workspace=backend
   ```

4. **Start all services** (concurrent):

   ```bash
   npm run dev
   ```

   Or start individually:

   ```bash
   npm run dev --workspace=backend      # http://localhost:4000
   npm run dev --workspace=frontend     # http://localhost:3000
   npm run dev --workspace=dashboard    # http://localhost:3001
   ```

5. **Access the stack**:
   - **Frontend**: http://localhost:3000
   - **Dashboard**: http://localhost:3001 (login required)
   - **API Docs**: http://localhost:4000/api/docs

#### Docker Compose

1. **Build and start all services**:

   ```bash
   docker-compose up -d
   ```

   First-time only, run migrations:

   ```bash
   docker-compose exec backend npm run db:migrate
   docker-compose exec backend npm run db:seed
   ```

2. **Access**:
   - Frontend: http://localhost:3000
   - Dashboard: http://localhost:3001
   - API: http://localhost:4000
   - Postgres: localhost:5432 (user: `portfolio`, password: `portfolio_dev`)
   - Redis: localhost:6379

3. **View logs**:

   ```bash
   docker-compose logs -f backend
   docker-compose logs -f frontend
   docker-compose logs -f dashboard
   ```

4. **Shutdown gracefully**:
   ```bash
   docker-compose down
   ```

## 🧪 Testing & Validation

```bash
# Type check all workspaces
npm run typecheck

# Lint all workspaces
npm run lint

# Test backend
npm run test --workspace=backend

# Build all workspaces
npm run build

# Build Docker images
docker-compose build
```

## 📚 API Reference

### Authentication

**Register**:

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure123"
}
```

**Login**:

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt...",
    "refreshToken": "jwt...",
    "user": { "id": "...", "email": "..." }
  }
}
```

**Refresh Token**:

```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt..."
}
```

### Blog (Public)

**List blogs** (paginated):

```bash
GET /api/v1/blog?page=1&limit=10
```

**Get blog by slug**:

```bash
GET /api/v1/blog/:slug
```

**For admin**: All CRUD operations at `POST`, `PUT`, `DELETE /api/v1/blog/:id` require JWT admin token.

### Full API Documentation

Swagger UI available at: **http://localhost:4000/api/docs**

## 🔐 Security Features

- **JWT Authentication**: Short-lived access tokens (15min) + long-lived refresh tokens (7d)
- **Password Hashing**: bcryptjs with 12 salt rounds
- **Rate Limiting**: Graduated limits (100/min general, 5/min auth, 3/hr contact)
- **CORS**: Configurable origin whitelist
- **Helmet**: Security headers on all HTTP responses
- **Input Validation**: Zod schemas on every endpoint
- **Idempotency Keys**: 30s cache on POST requests to prevent duplicates
- **Error Handling**: Centralized middleware, no stack traces in production

## 🎨 Customization

### Environment Variables

Create `.env` file from `.env.example`:

```env
# Critical
DATABASE_URL=postgresql://user:pass@localhost/portfolio_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@portfolio.dev

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Frontend
VITE_API_URL=http://localhost:4000/api
```

### Tailwind Theming

Edit `frontend/tailwind.config.ts` and `dashboard/tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
    },
    fontFamily: {
      display: 'var(--font-display)',
    },
  },
}
```

CSS variables in `src/index.css`:

```css
:root {
  --color-primary: #3b82f6;
  --font-display: "Inter", sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #1e40af;
  }
}
```

## 📊 Database Schema

### Key Models

- **User**: Profiles, roles (USER, ADMIN), token tracking
- **Blog**: Post content, slug-based routing, view counting
- **Article**: Similar to Blog, separate table for organization
- **Book**: Metadata, pricing (Decimal), file URLs
- **CareerTimeline**: Type enum (JOB, EDUCATION, etc.), date range
- **Achievement**: Badges, date tracking
- **Download**: Resource tracking with counter
- **Contact**: Form submissions, read status, admin replies
- **NewsletterSubscriber**: Email list with unsubscribe tracking
- **RefreshToken**: JWT revocation, device tracking
- **AuditLog**: Admin action tracking (optional, not in initial schema)

All models use:

- UUID primary keys
- `createdAt` / `updatedAt` timestamps
- Proper indexes for common queries (slug, email, etc.)

## 🐛 Debugging

### Backend Logs

Enable debug mode:

```bash
DEBUG=portfolio:* npm run dev --workspace=backend
```

### Frontend React DevTools

Install React Developer Tools browser extension, then:

```bash
npm run dev --workspace=frontend
```

### Database Queries

View Prisma Studio:

```bash
npm run prisma:studio --workspace=backend
```

## 🚢 Deployment

### Using Docker

1. **Build images**:

   ```bash
   docker-compose build
   ```

2. **Push to registry** (optional):

   ```bash
   docker tag portfolio-backend:latest your-registry/portfolio-backend:latest
   docker push your-registry/portfolio-backend:latest
   ```

3. **Deploy** (see your infrastructure provider's docs for:
   - Kubernetes YAML
   - AWS ECS task definitions
   - Heroku procfile
   - DigitalOcean app spec

### Environment Variables for Production

Use a secure secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.) and inject:

```env
DATABASE_URL=postgresql://prod_user:prod_pass@prod-db:5432/portfolio
REDIS_URL=redis://:password@prod-redis:6379
JWT_SECRET=<random-64-char-key>
SMTP_HOST=smtp.sendgrid.net
# ... others
```

## 📝 Contributing

1. Fork and create feature branch: `git checkout -b feature/my-feature`
2. Make changes following the architecture patterns
3. Run linting and type checks: `npm run lint && npm run typecheck`
4. Test your changes: `npm run test`
5. Push and create a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Edeh Chinedu Daniel** - Portfolio & Contact Platform

---

**Questions or issues?** Open an issue on GitHub or contact admin@portfolio.dev
