# Deployment Guide

This guide covers deploying the portfolio platform to production environments.

## 🏗️ Pre-Deployment Checklist

- [ ] All tests pass: `npm run test`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Linting passes: `npm run lint`
- [ ] All features reviewed and working
- [ ] Environment secrets secured
- [ ] Database backups configured
- [ ] CORS origins whitelist updated
- [ ] JWT secrets changed from defaults

## 🐳 Docker Deployment

### Build Production Images

```bash
# Build all images
docker-compose build

# Or build individual images
docker build -t portfolio-backend:latest -f backend/Dockerfile .
docker build -t portfolio-frontend:latest -f frontend/Dockerfile .
docker build -t portfolio-dashboard:latest -f dashboard/Dockerfile .
```

### Push to Registry (Docker Hub / ECR / GCR)

```bash
# Tag for registry
docker tag portfolio-backend:latest your-registry/portfolio-backend:latest
docker tag portfolio-frontend:latest your-registry/portfolio-frontend:latest
docker tag portfolio-dashboard:latest your-registry/portfolio-dashboard:latest

# Push
docker push your-registry/portfolio-backend:latest
docker push your-registry/portfolio-frontend:latest
docker push your-registry/portfolio-dashboard:latest
```

## ☁️ Platform-Specific Deployment

### AWS ECS (Elastic Container Service)

1. **Create ECR repositories**:

   ```bash
   aws ecr create-repository --repository-name portfolio-backend
   aws ecr create-repository --repository-name portfolio-frontend
   aws ecr create-repository --repository-name portfolio-dashboard
   ```

2. **Push images**:

   ```bash
   # Get ECR login token
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Push images
   docker tag portfolio-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/portfolio-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/portfolio-backend:latest
   # Repeat for frontend, dashboard
   ```

3. **Create ECS task definitions** (AWS Console or CLI):
   - CPU: 256, Memory: 512 (minimal)
   - Environment variables from Secrets Manager
   - CloudWatch logs for debugging
   - Health check from Dockerfile HEALTHCHECK

4. **Create ECS service** with:
   - Load balancer (ALB)
   - Auto-scaling policy
   - Desired count: 2+ for high availability

### Heroku Deployment

1. **Install Heroku CLI**: `heroku login`

2. **Create apps**:

   ```bash
   heroku create portfolio-backend
   heroku create portfolio-frontend
   heroku create portfolio-dashboard
   ```

3. **Set environment variables**:

   ```bash
   heroku config:set DATABASE_URL=<postgres-url> --app portfolio-backend
   heroku config:set REDIS_URL=<redis-url> --app portfolio-backend
   heroku config:set JWT_SECRET=<secure-random-key> --app portfolio-backend
   # ... set other secrets
   ```

4. **Add Procfile** in root:

   ```
   release: npm run db:migrate --workspace=backend
   web: npm run start --workspace=backend
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   ```

### DigitalOcean App Platform

1. **Create `app.yaml`** in root:

   ```yaml
   name: portfolio-platform
   services:
     - name: backend
       dockerfile_path: backend/Dockerfile
       source: github
       envs:
         - key: DATABASE_URL
           value: ${db.connection_string}
     - name: frontend
       dockerfile_path: frontend/Dockerfile
       source: github
     - name: dashboard
       dockerfile_path: dashboard/Dockerfile
       source: github
   databases:
     - name: portfolio-db
       engine: PG
       version: "16"
   ```

2. **Deploy via CLI**:
   ```bash
   doctl apps create --spec app.yaml
   ```

### Kubernetes (k8s)

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: portfolio-backend
  template:
    metadata:
      labels:
        app: portfolio-backend
    spec:
      containers:
        - name: backend
          image: your-registry/portfolio-backend:latest
          ports:
            - containerPort: 4000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: portfolio-secrets
                  key: database-url
          livenessProbe:
            httpGet:
              path: /health
              port: 4000
            initialDelaySeconds: 30
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: portfolio-backend-service
spec:
  selector:
    app: portfolio-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 4000
  type: LoadBalancer
```

Deploy:

```bash
kubectl apply -f k8s/deployment.yaml
```

## 🔒 Security Best Practices

### Environment Variables

**Never commit secrets!** Use secure secret management:

- **AWS**: Secrets Manager or Parameter Store
- **Heroku**: `heroku config:set KEY=value`
- **DigitalOcean**: Built-in secrets in App Platform
- **Kubernetes**: `kubectl create secret generic portfolio-secrets ...`

Example production `.env`:

```env
# Database (managed service, not exposed)
DATABASE_URL=postgresql://user:pass@prod-rds.amazonaws.com/portfolio

# Redis (AWS ElastiCache or managed)
REDIS_URL=redis://:password@prod-redis.amazonaws.com:6379

# JWT (use 64+ char random keys)
JWT_SECRET=<generate: openssl rand -base64 32>
JWT_REFRESH_SECRET=<generate: openssl rand -base64 32>

# Email via SendGrid or SES (not Gmail for prod)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<sendgrid-api-key>

# Restrict CORS to exact domains
CORS_ORIGIN=https://portfolio.example.com,https://admin.example.com

# Security headers
NODE_ENV=production
```

### Database Security

- Use managed services (AWS RDS, DigitalOcean Managed Databases)
- Enable SSL/TLS connections
- Create separate user with minimal permissions
- Setup automated backups
- Use VPC/private networks

### SSL/TLS Certificates

Use **Let's Encrypt** for free certificates:

```bash
# With Certbot
certbot certonly --standalone -d portfolio.example.com

# Or use provider's managed certificates (AWS ACM, DigitalOcean, etc.)
```

## 📊 Monitoring & Logging

### Health Checks

All services have health endpoints:

- **Backend**: `GET /health` → `{"status":"ok"}`
- **Frontend**: Verifies static assets load
- **Dashboard**: Verifies static assets load

Monitoring tools:

- **Datadog**: APM + logs + metrics
- **New Relic**: Full-stack observability
- **Sentry**: Error tracking
- **CloudWatch** (AWS): Logs and metrics

### Structured Logging

Backend uses Pino for structured logs:

```json
{
  "level": "info",
  "time": "2025-03-10T10:15:30.123Z",
  "msg": "User logged in",
  "userId": "uuid",
  "ip": "127.0.0.1"
}
```

View logs:

```bash
# AWS CloudWatch
aws logs tail /aws/ecs/portfolio-backend --follow

# Heroku
heroku logs --tail --app portfolio-backend

# Docker
docker logs portfolio-backend --follow
```

## 🔄 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push:

1. **Lint** - Code style
2. **Type check** - TypeScript validation
3. **Test** - Unit tests
4. **Build** - Production builds
5. **Push images** - To registry (main branch only)

Modify for your registry:

```yaml
- name: Push to ECR
  run: |
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com
    docker push ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/portfolio-backend:latest
```

## 🚀 Rollout Strategy

### Blue-Green Deployment

1. Deploy to "green" (new) environment
2. Run smoke tests
3. Switch traffic from "blue" to "green"
4. Keep "blue" as instant rollback

### Canary Deployment

1. Deploy to 10% of traffic
2. Monitor metrics (errors, latency)
3. Gradually increase to 100%
4. Rollback if issues

## 📉 Database Migrations

For zero-downtime migrations:

1. **Add new column** (backward compatible):

   ```prisma
   model User {
     newField String?  // nullable first
   }
   ```

2. **Deploy code** that reads/writes new field

3. **Make column required** (if needed):
   ```prisma
   newField String  // change to required
   ```

Run migrations before service restart:

```bash
# In Dockerfile or deployment script
RUN npx prisma migrate deploy

# Or in ECS task definition as "entryPoint"
"sh", "-c", "npx prisma migrate deploy && node dist/server.js"
```

## 🔄 Rollback Procedure

### Database

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back last-migration-name

# Deploy previous migration
npx prisma migrate deploy
```

### Application

```bash
# Redeploy previous container version
docker run your-registry/portfolio-backend:v1.0.0

# Or via GitHub Actions: manually trigger deployment to previous tag
```

## ✅ Post-Deployment Validation

Checklist for after deploying:

- [ ] Services healthy: `curl https://api.example.com/health`
- [ ] Database migrations applied: `psql ... SELECT * FROM information_schema.migrations`
- [ ] Frontend loads: `https://example.com`
- [ ] Dashboard loads: `https://admin.example.com`
- [ ] Admin login works
- [ ] Blog CRUD operations work
- [ ] Contact form sends emails
- [ ] No error logs in CloudWatch/monitoring
- [ ] Metrics/APM data flowing

## 📞 Support

For deployment issues:

- Check service logs
- Verify environment variables
- Test database connectivity
- Review error messages in monitoring tool
- Contact: admin@portfolio.dev

---

**Happy deployment!** 🚀
