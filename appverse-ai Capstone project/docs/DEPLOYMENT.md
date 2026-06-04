# AppVerse AI – Deployment Guide

---

## 🐳 Option 1: Docker Compose (Recommended)

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: appverse-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: appverse_db
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./docs/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: appverse-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/appverse_db?useSSL=false&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
      APP_JWT_SECRET: YourSuperSecretKeyForProductionUse!
    depends_on:
      mysql:
        condition: service_healthy

  frontend:
    build: ./frontend
    container_name: appverse-frontend
    ports:
      - "3000:80"
    environment:
      REACT_APP_API_URL: http://localhost:8080/api
    depends_on:
      - backend

volumes:
  mysql-data:
```

### `backend/Dockerfile`
```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:resolve
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/appverse-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### `frontend/Dockerfile`
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `frontend/nginx.conf`
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Run with Docker Compose
```bash
docker-compose up -d
```

---

## ☁️ Option 2: AWS Deployment

### Architecture
```
Route 53 → CloudFront → S3 (React build)
                      → ALB → ECS Fargate (Spring Boot)
                            → RDS MySQL
```

### Steps
1. **RDS MySQL** – Create MySQL 8.0 instance, note endpoint
2. **ECR** – Push Docker image: `aws ecr push appverse-backend`
3. **ECS Fargate** – Create service with backend image, set env vars
4. **S3 + CloudFront** – Upload React build, configure CloudFront distribution
5. **ALB** – Route `/api/*` to ECS, `/*` to S3

---

## 🌐 Option 3: Railway / Render (Easy PaaS)

### Backend on Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

cd backend
railway login
railway init
railway add --plugin mysql
railway up
```

Set environment variables in Railway dashboard:
- `SPRING_DATASOURCE_URL`
- `APP_JWT_SECRET`

### Frontend on Vercel
```bash
cd frontend
npx vercel --prod
```

Set `REACT_APP_API_URL=https://your-backend.railway.app/api`

---

## 🔒 Production Security Checklist

- [ ] Change JWT secret to a 64+ char random string
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (not update)
- [ ] Enable HTTPS / SSL certificates
- [ ] Set `spring.jpa.show-sql=false`
- [ ] Configure rate limiting (Spring's `Bucket4j` or API Gateway)
- [ ] Enable request logging with log rotation
- [ ] Set up database backups (daily snapshots)
- [ ] Configure CORS for production domain only
- [ ] Set `HttpOnly`, `Secure` flags on cookies
- [ ] Enable Spring Actuator with auth for health checks

---

## 📊 Monitoring

### Spring Boot Actuator
Add to `application.properties`:
```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

Health endpoint: `GET /actuator/health`

### Suggested Stack
- **Metrics**: Prometheus + Grafana
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger or Zipkin
- **Alerts**: PagerDuty or OpsGenie
