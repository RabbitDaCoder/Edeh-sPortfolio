# Contributing to Portfolio Platform

Thank you for interest in contributing to the portfolio platform! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 16+
- Redis 7+

### Setup Development Environment

1. **Clone the repository**:

   ```bash
   git clone <repo>
   cd portfolio-platform
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Setup environment variables**:

   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env.local
   cp dashboard/.env.example dashboard/.env.local
   ```

   Edit `.env` with your local PostgreSQL, Redis, and SMTP credentials.

4. **Initialize database**:

   ```bash
   npm run db:migrate --workspace=backend
   npm run db:seed --workspace=backend
   ```

   This creates tables and seeds an admin user (email: `admin@portfolio.dev`, password: `password123`).

5. **Start development servers**:

   ```bash
   npm run dev
   ```

   - **Frontend**: http://localhost:3000
   - **Dashboard**: http://localhost:3001 (login with admin credentials)
   - **Backend**: http://localhost:4000/api (Swagger at `/api/docs`)

## Development Workflow

### Code Quality

Before committing, ensure code passes all checks:

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# Test
npm run test --workspace=backend
```

### Git Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes with clear, atomic commits
3. Push: `git push origin feature/my-feature`
4. Create a Pull Request with description of changes

### Commit Message Convention

Follow conventional commits:

```
feat: Add new feature
fix: Fix bug or typo
docs: Update documentation
style: Format/lint changes
refactor: Code reorganization
perf: Performance improvements
test: Add/update tests
ci: CI/CD configuration
```

Example:

```
feat(blog): Add markdown editor to blog post creation

- Implemented Monaco editor integration
- Added syntax highlighting support
- Added live preview panel
- Updated blog schema to support markdown storage
```

## Architecture & Code Style

### Project Structure

- **Backend**: Controller → Service → Repository pattern (strict layer separation)
- **Frontend/Dashboard**: Feature-based structure with hooks, components, pages
- **Database**: Prisma ORM with migrations in `prisma/migrations/`

### TypeScript

- Strict mode enabled (`tsconfig.json` has `"strict": true`)
- No `any` types; use explicit types or inferred from Zod
- Interfaces for API responses, Zod schemas for validation

### Naming Conventions

- **Files**: `camelCase` for components/utilities, `snake_case` for config
- **Functions**: `use*` for hooks, `*Controller` for controllers, `*Service` for services
- **Enums**: `PascalCase` (e.g., `TimelineType`, `Role`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `MAX_UPLOAD_SIZE`)

### API Design

- **Routes**: `/api/v1/{module}/{resource}` (e.g., `/api/v1/blog`, `/api/v1/blog/my-slug`)
- **Verbs**: `GET` (read), `POST` (create), `PUT/PATCH` (update), `DELETE` (delete)
- **Responses**: Use `apiResponse.success()` / `apiResponse.error()` helpers
- **Status Codes**: 200 (success), 201 (created), 400 (bad request), 401 (unauth), 403 (forbidden), 404 (not found), 500 (server error)

### Validation

- **Backend**: Use Zod schemas in `*.schema.ts` files, validate mid-route
- **Frontend**: Use React Hook Form + Zod for client-side validation

## Module Template

When adding a new feature module to backend:

```typescript
// module.schema.ts
import { z } from "zod";

export const CreateModuleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

// module.repository.ts - Prisma queries
export class ModuleRepository {
  async findById(id: string) {
    /* ... */
  }
  async findMany() {
    /* ... */
  }
  async create(data) {
    /* ... */
  }
}

// module.service.ts - Business logic
export class ModuleService {
  constructor(
    private repo: ModuleRepository,
    private cache: CacheService,
  ) {}
  async getData() {
    /* ... */
  }
}

// module.controller.ts - HTTP handlers
export class ModuleController {
  async list(req, res) {
    /* ... */
  }
}

// module.routes.ts - Route definitions
const router = express.Router();
router.get("/", controller.list);
export default router;
```

## Testing

### Backend Unit Tests

Create test files alongside source: `module.service.spec.ts`

```typescript
import { describe, it, expect } from "vitest";
import { ModuleService } from "./module.service";

describe("ModuleService", () => {
  it("should fetch data", async () => {
    // Arrange, Act, Assert
  });
});
```

Run tests:

```bash
npm run test --workspace=backend
```

### Frontend Integration Tests (Optional)

Use Vitest + React Testing Library:

```bash
npm run test --workspace=frontend
```

## Documentation

- **Code comments**: Add comments for complex logic, WHY not WHAT
- **JSDoc**: Document public functions and exports
- **README**: Update [README.md](./README.md) if adding user-facing features
- **API docs**: Use JSDoc annotations for Swagger (auto-generated at `/api/docs`)

## Pull Request Process

1. **Title**: Descriptive, follows conventional commits
2. **Description**:
   - What problem does this solve?
   - How was it implemented?
   - Any breaking changes?
   - Checklist: tests, docs, types, linting
3. **Self-review**: Check code before requesting review
4. **Address feedback**: Update PR with suggestions
5. **Merge**: Squash commits for clean history

### PR Template

```markdown
## Description

Brief summary of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Docs update

## How to Test

Steps to verify changes

## Checklist

- [ ] Tests pass
- [ ] Types check (`npm run typecheck`)
- [ ] Code lints (`npm run lint`)
- [ ] Docs updated
- [ ] No console errors/warnings
```

## Performance & Security

### Performance Tips

- Use React Query caching wisely (see TTLs in `frontend/src/lib/queryClient.ts`)
- Avoid N+1 queries via Prisma `include`/`select`
- Cache expensive operations in Redis (TTL defined in `CacheService`)
- Use code-splitting for large bundles (routes are lazy-loaded)

### Security Checklist

- Validate all inputs (Zod schemas)
- Escape/sanitize HTML if rendering user content
- Don't expose sensitive data in API responses
- Use HTTPS in production
- Keep dependencies updated: `npm audit`

## Debugging

### Backend

```bash
# Enable debug logs
DEBUG=portfolio:* npm run dev --workspace=backend

# Inspect Prisma queries
npm run prisma:studio --workspace=backend
```

### Frontend

- Use React DevTools browser extension
- Check Network tab for API responses
- Use `console.log` or debugger in VS Code

## Questions?

- Check [existing issues](https://github.com/YOUR_ORG/portfolio-platform/issues)
- Open a [discussion](https://github.com/YOUR_ORG/portfolio-platform/discussions)
- Email: admin@portfolio.dev

---

**Happy coding!** 🎉
