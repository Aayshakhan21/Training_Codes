# AppVerse AI

> A smart, AI-powered app marketplace platform with sentiment analysis, fake review detection, personalized recommendations, and a Gemini-backed review summarization engine.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. AI Service Setup](#3-ai-service-setup)
  - [4. Frontend Setup](#4-frontend-setup)
  - [5. Docker (All-in-One)](#5-docker-all-in-one)
- [Configuration](#configuration)
- [AI Features](#ai-features)
  - [Sentiment Analysis](#sentiment-analysis)
  - [Review Summary](#review-summary)
  - [Recommendations](#recommendations)
  - [Similar Apps](#similar-apps)
  - [AI Chatbot](#ai-chatbot)
- [Testing Sentiment Analysis](#testing-sentiment-analysis)
- [API Reference](#api-reference)
- [Role Permissions](#role-permissions)
- [Demo Accounts](#demo-accounts)
- [Common Issues](#common-issues)

---

## Overview

AppVerse AI is a full-stack app marketplace where:

- **Users** browse, download, purchase, and review apps
- **Developers** upload and manage their apps with analytics
- **Admins** approve apps, moderate reviews, and view platform stats
- **AI (Gemini + local fallback)** automatically analyzes every review for sentiment, detects fake reviews, generates summaries, and powers personalized recommendations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3, React Router 6, Axios |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA, JWT |
| AI Service | FastAPI, Python, Google Gemini API |
| Database | MySQL 8.0 |
| Container | Docker, Docker Compose |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                    │
│            (Vite · Tailwind · Axios)                │
│                  localhost:5173                      │
└────────────────────┬────────────────────────────────┘
                     │ REST (JWT)
┌────────────────────▼────────────────────────────────┐
│              Spring Boot Backend                    │
│       (Security · JPA · Swagger · Mail)             │
│                  localhost:8080                      │
│                                                     │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │  ReviewService│    │   AiInsightsService      │   │
│  │  AppService   │    │   RecommendationService  │   │
│  │  AuthService  │    │   SentimentAnalysisService│  │
│  └──────────────┘    └────────────┬─────────────┘   │
└───────────────────────────────────┼─────────────────┘
                     │ HTTP (internal)
┌────────────────────▼────────────────────────────────┐
│               FastAPI AI Service                    │
│        (Gemini API · Local Fallback Logic)          │
│                  localhost:8001                      │
└─────────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                  MySQL 8.0                          │
│                  localhost:3306                      │
└─────────────────────────────────────────────────────┘
```

**Key design decision — AI fallback chain:**

Every AI call goes through two layers. The Java backend first calls the Python AI service (Gemini). If the AI service is unreachable or returns an error, `SentimentAnalysisService.analyseLocally()` runs keyword-based analysis directly in Java — so reviews always get a real sentiment even when the AI service is down.

---

## Project Structure

```
appverse-ai/
├── backend/                        # Spring Boot
│   ├── pom.xml
│   └── src/main/java/com/appverse/
│       ├── AppVerseApplication.java
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   ├── JpaConfig.java
│       │   ├── WebConfig.java
│       │   └── RestTemplateConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── AppController.java
│       │   ├── ReviewController.java
│       │   ├── ReviewAnalysisController.java
│       │   ├── AIController.java
│       │   ├── RecommendationController.java
│       │   ├── AdminController.java
│       │   ├── DeveloperController.java
│       │   ├── BookmarkController.java
│       │   ├── NotificationController.java
│       │   ├── DownloadController.java
│       │   ├── CategoryController.java
│       │   ├── UserController.java
│       │   ├── SocialController.java
│       │   └── PaymentController.java
│       ├── service/impl/
│       │   ├── AuthService.java
│       │   ├── AppService.java
│       │   ├── ReviewService.java
│       │   ├── SentimentAnalysisService.java   ← AI fallback lives here
│       │   ├── AiInsightsService.java
│       │   ├── RecommendationService.java
│       │   ├── UserService.java
│       │   ├── BookmarkService.java
│       │   ├── NotificationService.java
│       │   ├── AdminAnalyticsService.java
│       │   └── DeveloperAnalyticsService.java
│       ├── client/
│       │   └── AiServiceClient.java            ← calls Python service
│       ├── entity/
│       │   ├── User.java
│       │   ├── App.java
│       │   ├── Review.java
│       │   ├── Category.java
│       │   ├── Download.java
│       │   ├── AppVersion.java
│       │   ├── Bookmark.java
│       │   ├── Notification.java
│       │   ├── Recommendation.java
│       │   ├── AiAnalysisLog.java
│       │   └── RefreshToken.java
│       ├── repository/
│       ├── dto/
│       │   ├── ai/AiServiceDTOs.java
│       │   ├── request/
│       │   └── response/
│       ├── security/jwt/
│       ├── exception/
│       └── enums/
│           ├── Role.java           (USER, DEVELOPER, ADMIN)
│           ├── Sentiment.java      (POSITIVE, NEGATIVE, NEUTRAL)
│           └── AppStatus.java      (PENDING, APPROVED, REJECTED, SUSPENDED)
│
├── ai-service/                     # Python FastAPI
│   ├── requirements.txt
│   ├── .env
│   └── app/
│       ├── main.py
│       ├── controllers/ai_controller.py
│       ├── services/
│       │   ├── ai_service.py       ← Gemini + local fallback
│       │   └── gemini_service.py
│       ├── models/schemas.py
│       └── prompts/templates.py
│
├── frontend/                       # React + Vite
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── services/api.js         ← all API calls
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── AppContext.jsx
│       ├── components/
│       │   ├── shared/             (Button, Badge, StarRating, Spinner…)
│       │   ├── ai/AIChatbotWidget.jsx
│       │   ├── auth/ProtectedRoute.jsx
│       │   └── marketplace/AppCard.jsx
│       └── pages/
│           ├── HomePage.jsx
│           ├── AppDetailsPage.jsx  ← reviews, ratings, AI summary
│           ├── AppListingPage.jsx
│           ├── SearchResultsPage.jsx
│           ├── RecommendationsPage.jsx
│           ├── DeveloperDashboardPage.jsx
│           ├── AdminDashboardPage.jsx
│           └── ...
│
├── docs/
│   ├── schema.sql
│   ├── dummy_data.sql
│   ├── API_DOCS.md
│   ├── POSTMAN.json
│   └── DEPLOYMENT.md
│
└── docker-compose.yml
```

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Java | 17+ | Required for Spring Boot 3 |
| Maven | 3.8+ | `mvn -v` to check |
| Node.js | 18+ | `node -v` to check |
| Python | 3.10+ | For AI service |
| MySQL | 8.0+ | Running locally or via Docker |
| Git | Any | |
| Docker | 20+ | Only needed for Docker setup |

---

## Getting Started

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run schema
source /path/to/appverse-ai/docs/schema.sql;

# Seed demo data (optional)
source /path/to/appverse-ai/docs/dummy_data.sql;

# Verify
USE appverse_db;
SHOW TABLES;
```

Expected tables: `users`, `apps`, `categories`, `reviews`, `downloads`, `app_versions`, `refresh_tokens`, `bookmarks`, `recommendations`, `ai_analysis_logs`, `notifications`

---

### 2. Backend Setup

**2.1 Configure `backend/src/main/resources/application.properties`:**

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/appverse_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT
app.jwt.secret=YourSuperSecretKeyAtLeast32CharactersLong!
app.jwt.expiration-ms=86400000
app.jwt.refresh-expiration-ms=604800000

# AI Service URL (local dev)
app.ai-service.base-url=http://localhost:8001/api/ai

# CORS
app.cors.allowed-origins=http://localhost:5173
```

**2.2 Build and run:**

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`
API Docs: `http://localhost:8080/api-docs`

---

### 3. AI Service Setup

**3.1 Set your Gemini API key:**

Edit `ai-service/.env`:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

> Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com)

**3.2 Install and run:**

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

AI service runs at: `http://localhost:8001`
Health check: `http://localhost:8001/health`

> **Note:** If `GEMINI_API_KEY` is not set or is invalid, the service starts in **local fallback mode** — all AI endpoints still work using built-in keyword logic. You will see a warning in the logs:
> ```
> AppVerse AI Service started — Gemini DISABLED. All endpoints will use local fallback logic.
> ```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

**Environment variable (optional):**

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8080/api
```

---

### 5. Docker (All-in-One)

```bash
# From the appverse-ai/ root directory
docker compose up --build
```

| Service | Port |
|---------|------|
| MySQL | 3306 |
| Spring Boot Backend | 8080 |
| FastAPI AI Service | 8001 |
| React Frontend | 5173 |

> Before running Docker, make sure to set `GEMINI_API_KEY` in `ai-service/.env`.

---

## Configuration

### Backend — `application.properties`

| Property | Default | Description |
|----------|---------|-------------|
| `server.port` | `8080` | Backend port |
| `spring.datasource.url` | localhost:3306 | MySQL connection string |
| `spring.datasource.username` | `root` | DB username |
| `spring.datasource.password` | `root` | DB password |
| `spring.jpa.hibernate.ddl-auto` | `update` | Auto-creates/updates tables |
| `app.jwt.secret` | (set this!) | JWT signing key, min 32 chars |
| `app.jwt.expiration-ms` | `86400000` | Access token TTL (1 day) |
| `app.jwt.refresh-expiration-ms` | `604800000` | Refresh token TTL (7 days) |
| `app.ai-service.base-url` | `http://ai-service:8001/api/ai` | Python AI service URL |
| `app.cors.allowed-origins` | `http://localhost:5173` | Frontend origin for CORS |
| `spring.mail.username` | — | Gmail address for email verification |
| `spring.mail.password` | — | Gmail app password |

### AI Service — `.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | `YOUR_GEMINI_API_KEY_HERE` | Google Gemini API key |
| `GEMINI_MODEL` | `gemini-1.5-flash` | Gemini model to use |

---

## AI Features

### Sentiment Analysis

Every review submitted goes through a two-layer analysis pipeline:

```
User submits review
       │
       ▼
ReviewService.addReview()
       │
       ▼
SentimentAnalysisService.analyse(text, rating)
       │
       ├─► [1] Try Python AI Service (Gemini)
       │         └─ Returns: sentiment, confidence, trustScore,
       │                     predictedRating, fakeReview, moderationReason
       │
       └─► [2] If AI service down → analyseLocally() (Java fallback)
                 └─ Keyword scanning: positive/negative word sets,
                    phrase matching, rating tiebreaker
                    Returns same fields — never returns blind NEUTRAL
```

**Fields stored on every review:**

| Field | Type | Description |
|-------|------|-------------|
| `sentiment` | `POSITIVE / NEGATIVE / NEUTRAL` | Overall tone |
| `aiConfidence` | `0.0–1.0` | How confident the model is |
| `trustScore` | `0.0–1.0` | How trustworthy the review appears |
| `predictedRating` | `1–5` | AI's predicted star rating from text alone |
| `isFake` | boolean | Spam/promotional language detected |
| `isFlagged` | boolean | Needs human moderation |
| `moderationReason` | string | Human-readable explanation |

---

### Review Summary

On the App Details page, an AI-generated summary of all reviews is shown, powered by Gemini. It includes positive highlights, negative highlights, and an overall sentiment badge.

**Endpoint:** `POST /api/ai/review-summary`

If Gemini is unavailable, a local summary is built from the stored sentiment counts.

---

### Recommendations

Personalized recommendations are generated by analyzing:
- User's download history
- User's rating history
- Category frequency (most-used categories scored higher)
- Trending apps as fallback

**Endpoint:** `GET /api/recommendations/user/{userId}?limit=10`

---

### Similar Apps

For each app detail page, similar apps are found by:
- Matching category
- Shared tags
- Name/keyword overlap

**Endpoint:** `POST /api/ai/similar-apps`

---

### AI Chatbot

A floating chatbot widget on the frontend lets users ask questions about the marketplace. It uses Gemini with the current user context and recent app data injected into the prompt.

**Endpoint:** `POST /api/ai/chat`

---

## Testing Sentiment Analysis

Use these reviews to verify the sentiment pipeline works correctly end-to-end. Submit them via the app UI or directly via the API (`POST /api/reviews/app/{appId}/user/{userId}`).

### POSITIVE — expect `POSITIVE` sentiment

```
"This is the best app I have ever used. Easy to use, fast and smooth. Highly recommended to everyone!"
```
```
"Amazing app, very reliable and responsive. Love how clean the interface is."
```
```
"Great app, love it!"
```
*(short — trust score will be ~0.45)*

---

### NEGATIVE — expect `NEGATIVE` sentiment

```
"This app does not work at all. It stopped working after the last update and keeps freezing every time I open it."
```
```
"Terrible app. Full of bugs and crashes constantly. Slow and broken. Total waste of money."
```
```
"Worst app ever. Avoid."
```

---

### NEUTRAL — expect `NEUTRAL` sentiment

```
"The app is good but has some bugs. Fast in some areas but slow in others. Overall decent experience."
```
```
"I downloaded this app and used it for a while. It does what it says."
```

---

### Rating as tiebreaker — mixed text, result depends on star rating

Submit the same review body with different star ratings:

```
"The app is okay, nothing special really."
```

| Stars | Expected |
|-------|----------|
| 5 ⭐ | `POSITIVE` |
| 3 ⭐ | `NEUTRAL` |
| 1 ⭐ | `NEGATIVE` |

---

### Testing the fallback specifically

Stop the Python AI service container, then submit any review — sentiment should still be detected correctly (not blank or always NEUTRAL):

```bash
docker stop appverse-ai-service
```

Then submit a review with clear positive or negative language and confirm the `sentiment` field in the response is not blindly `NEUTRAL`.

---

### Expected results summary

| Review text | Stars | Sentiment | Trust Score |
|-------------|-------|-----------|-------------|
| "best app, easy to use, fast and smooth" | 5 | POSITIVE | 0.72 |
| "great app, love it" | 5 | POSITIVE | 0.45 |
| "does not work, keeps freezing" | 1 | NEGATIVE | 0.72 |
| "worst app, crashes everywhere, bugs" | 1 | NEGATIVE | 0.60 |
| "good but has some bugs, fast but slow" | 3 | NEUTRAL | 0.72 |
| "okay nothing special" | 5 | POSITIVE *(rating tips it)* | 0.60 |
| "okay nothing special" | 1 | NEGATIVE *(rating tips it)* | 0.60 |

---

## API Reference

Base URL: `http://localhost:8080/api`

All protected endpoints require the header:
```
Authorization: Bearer <accessToken>
```

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login, get JWT tokens |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout/{userId}` | Public | Invalidate refresh token |
| POST | `/auth/forgot-password` | Public | Send reset email |
| POST | `/auth/reset-password` | Public | Reset with token |
| POST | `/auth/verify-email` | Public | Verify email address |

### Apps

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/apps?page=0&size=12&sortBy=createdAt` | Public | Browse apps |
| GET | `/apps/search?q=query` | Public | Search apps |
| GET | `/apps/{id}` | Public | Get app by ID |
| GET | `/apps/trending?limit=10` | Public | Trending apps |
| GET | `/apps/top-rated?limit=10` | Public | Top rated apps |
| GET | `/apps/featured?limit=10` | Public | Featured apps |
| POST | `/apps` | DEVELOPER | Submit new app |
| PUT | `/apps/{id}` | DEVELOPER | Update own app |
| DELETE | `/apps/{id}` | DEVELOPER/ADMIN | Delete app |
| POST | `/apps/{id}/download` | Public | Record download |
| PATCH | `/apps/{id}/status` | ADMIN | Approve/reject/suspend |
| GET | `/apps/{id}/versions` | Public | Version history |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/app/{appId}?page=0&size=10` | Public | Get reviews for app |
| POST | `/reviews/app/{appId}/user/{userId}` | USER | Submit review (AI applied) |
| DELETE | `/reviews/{reviewId}?userId=x` | USER/ADMIN | Delete review |
| GET | `/reviews/flagged` | ADMIN | Get flagged reviews |
| PATCH | `/reviews/{reviewId}/moderate?approve=true` | ADMIN | Moderate review |

### AI Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ai/analyze-review` | USER | Analyze review text |
| POST | `/ai/review-summary` | Public | Summarize app reviews |
| POST | `/ai/recommendations` | USER | Personalized recommendations |
| POST | `/ai/similar-apps` | Public | Find similar apps |
| POST | `/ai/trending` | Public | Trending analysis |
| POST | `/ai/chat` | USER | Chat with AI assistant |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/stats` | ADMIN | Platform statistics |
| GET | `/admin/analytics` | ADMIN | Detailed analytics |
| GET | `/admin/users` | ADMIN | All users |
| PATCH | `/admin/users/{userId}/toggle` | ADMIN | Toggle user active/suspended |
| PATCH | `/admin/users/{userId}/make-developer` | ADMIN | Promote to developer |
| GET | `/admin/apps/pending` | ADMIN | Apps awaiting approval |

### Error Response Format

```json
{
  "status": 404,
  "message": "App not found with id: 999",
  "timestamp": "2024-01-01T10:00:00",
  "errors": null
}
```

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Validation error |
| 401 | Invalid/expired token |
| 403 | Insufficient role |
| 404 | Not found |
| 409 | Duplicate resource |
| 500 | Server error |

---

## Role Permissions

| Feature | USER | DEVELOPER | ADMIN |
|---------|------|-----------|-------|
| Browse & search apps | ✅ | ✅ | ✅ |
| Download apps | ✅ | ✅ | ✅ |
| Submit reviews | ✅ | ✅ | ✅ |
| Bookmark apps | ✅ | ✅ | ✅ |
| Upload apps | ❌ | ✅ | ✅ |
| Edit own apps | ❌ | ✅ | ✅ |
| View developer analytics | ❌ | ✅ | ✅ |
| Approve/reject apps | ❌ | ❌ | ✅ |
| Moderate reviews | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| View platform stats | ❌ | ❌ | ✅ |

---

## Demo Accounts

All demo accounts use the password: **`Test@123`**

```sql
-- Admin
INSERT INTO users (username, email, password, full_name, role, is_active) VALUES
('admin', 'admin@appverse.ai',
 '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS',
 'AppVerse Admin', 'ADMIN', true);

-- Developer
INSERT INTO users (username, email, password, full_name, role, is_active) VALUES
('devuser', 'dev@example.com',
 '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS',
 'Demo Developer', 'DEVELOPER', true);

-- Regular User
INSERT INTO users (username, email, password, full_name, role, is_active) VALUES
('testuser', 'user@example.com',
 '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS',
 'Test User', 'USER', true);
```

---

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `CORS error` in browser | Origin not whitelisted | Add `http://localhost:5173` to `app.cors.allowed-origins` |
| `401` on all requests | Wrong or expired JWT | Check `app.jwt.secret` matches between runs |
| `MySQL connection refused` | MySQL not running | `sudo service mysql start` or `docker compose up mysql` |
| Port 8080 already in use | Another process | Change `server.port=8081` in `application.properties` |
| `npm install` fails | Stale lock file | Delete `node_modules` and `package-lock.json`, retry |
| Blank white screen | API URL mismatch | Check `VITE_API_URL` in `frontend/.env` |
| All reviews show `NEUTRAL` | Python AI service down | Expected — local fallback now handles this correctly after the `SentimentAnalysisService` fix |
| AI summary shows "No reviews yet" | No reviews in DB | Submit at least one review for the app first |
| Gemini returns empty | API key missing | Set `GEMINI_API_KEY` in `ai-service/.env` |
| Rating bars all look the same | Paginated reviews used for count | Fixed by fetching with larger page size in `reviewsAPI.getByApp()` |

---

## Quick Test with cURL

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@test.com","password":"Test@123","fullName":"John Doe","role":"USER"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test@123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])")

# Get apps
curl http://localhost:8080/api/apps

# Submit a review (replace appId and userId)
curl -X POST http://localhost:8080/api/reviews/app/1/user/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"rating":5,"title":"Great app","content":"This is the best app I have ever used. Fast, smooth, and very reliable."}'
```
