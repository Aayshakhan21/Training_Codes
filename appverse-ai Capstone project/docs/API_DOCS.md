HELLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLOOOOOOOOOOOOOOOOOOOOOOOOOOO

# AppVerse AI – REST API Documentation

Base URL: `http://localhost:8080/api`

---

## Authentication

All protected endpoints require:

```
Authorization: Bearer <accessToken>
```

---

## 🔐 Auth Endpoints

### POST `/auth/register`

Register a new user.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Test@123",
  "fullName": "John Doe",
  "role": "USER"
}
```

Roles: `USER` | `DEVELOPER` | `ADMIN`

**Response 200:**

```json
{ "success": true, "message": "Registration successful", "userId": 1 }
```

---

### POST `/auth/login`

Login and receive JWT tokens.

**Request Body:**

```json
{ "email": "john@example.com", "password": "Test@123" }
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "uuid-string",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00"
    }
  }
}
```

---

### POST `/auth/refresh`

Exchange a refresh token for a new access token.

**Request Body:**

```json
{ "refreshToken": "uuid-string" }
```

---

### POST `/auth/logout/{userId}`

Invalidate refresh token and log out.

---

## 📱 Apps Endpoints

### GET `/apps`

Browse approved apps with pagination.

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 12 | Items per page |
| sortBy | string | createdAt | `createdAt`, `downloadCount`, `avgRating`, `trendingScore`, `price` |
| direction | string | desc | `asc` or `desc` |
| categoryId | long | - | Filter by category |

**Response 200:**

```json
{
  "success": true,
  "data": {
    "content": [ { ...app } ],
    "totalPages": 10,
    "totalElements": 120,
    "number": 0,
    "size": 12
  }
}
```

---

### GET `/apps/search?q={query}`

Full-text search across name, description.

---

### GET `/apps/{id}`

Get app by numeric ID.

---

### GET `/apps/slug/{slug}`

Get app by URL slug.

---

### GET `/apps/trending?limit=10`

Top trending apps by trending score.

---

### GET `/apps/pending` 🔒 ADMIN

List apps awaiting approval.

---

### POST `/apps` 🔒 DEVELOPER

Create/submit a new app.

**Request Body:**

```json
{
  "name": "My App",
  "description": "Full app description",
  "shortDesc": "One-liner pitch",
  "iconUrl": "https://...",
  "bannerUrl": "https://...",
  "categoryId": 1,
  "price": 0.0,
  "version": "1.0.0",
  "releaseNotes": "Initial release",
  "tags": "[\"productivity\", \"ai\"]",
  "sizeMb": 24.5,
  "minOsVersion": "Android 8.0"
}
```

Status auto-set to `PENDING`.

---

### PUT `/apps/{id}` 🔒 DEVELOPER (own app)

Update app details.

---

### DELETE `/apps/{id}` 🔒 DEVELOPER (own app) / ADMIN

Delete an app.

---

### POST `/apps/{id}/download`

Record a download. Increments download counter.

---

### PATCH `/apps/{id}/status` 🔒 ADMIN

Change app status.

**Request Body:**

```json
{ "status": "APPROVED", "reason": "Looks great!" }
```

Status values: `APPROVED` | `REJECTED` | `SUSPENDED` | `PENDING`

---

## ⭐ Reviews Endpoints

### GET `/reviews/app/{appId}?page=0&size=10`

Get paginated reviews for an app. Sorted newest first.

**Response includes:**

```json
{
  "id": 1,
  "rating": 5,
  "title": "Amazing app!",
  "content": "Really useful for my work.",
  "sentiment": "POSITIVE",
  "sentimentScore": 0.875,
  "isFlagged": false,
  "isFake": false,
  "helpfulCount": 12
}
```

---

### POST `/reviews/app/{appId}/user/{userId}` 🔒 USER

Submit a review. AI sentiment analysis applied automatically.

**Request Body:**

```json
{
  "rating": 5,
  "title": "Excellent app",
  "content": "This app is amazing and very helpful for productivity."
}
```

---

## 🤖 AI Service Endpoints

Base URL: `http://localhost:8001/api/v1`

### GET `/health`

Health check for the Python service.

### POST `/recommendations/personalized`

Generate personalized recommendations from user history and app features.

### POST `/recommendations/similar`

Return similar apps based on the current app profile and catalog.

### POST `/recommendations/trending`

Rank apps by download momentum and engagement signals.

### POST `/sentiment/analyze`

Analyze review sentiment, predict rating, and detect suspicious review content.

### POST `/sentiment/predict-rating`

Predict a 1-5 rating from review text.

### POST `/sentiment/fake-detect`

Return fake-review detection signals and confidence.

### DELETE `/reviews/{reviewId}?userId={id}` 🔒 USER (own) / ADMIN

Delete a review.

---

### GET `/reviews/flagged` 🔒 ADMIN

Get all flagged/suspicious reviews.

---

### PATCH `/reviews/{reviewId}/moderate?approve=true` 🔒 ADMIN

Approve or remove a flagged review.

---

## 🤖 Recommendations Endpoints

### GET `/recommendations/user/{userId}?limit=10`

Personalised app recommendations based on:

- Download history
- Rating history
- Category interests
- Trending apps (fallback)

---

### GET `/recommendations/trending?limit=10`

Platform-wide trending apps.

---

### GET `/recommendations/similar/{appId}?limit=6`

Similar apps in same category, ranked by rating.

---

## 📂 Categories Endpoints

### GET `/categories`

List all categories.

**Response:**

```json
[
  { "id": 1, "name": "Productivity", "description": "...", "icon": "briefcase", "color": "#6366F1" },
  ...
]
```

### GET `/categories/{id}`

Get single category.

---

## 🛡️ Admin Endpoints (all require ADMIN role)

### GET `/admin/stats`

Platform-wide statistics.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalDevelopers": 340,
    "totalApps": 892,
    "pendingApps": 14,
    "totalDownloads": 48320,
    "recentDownloads": 1240,
    "trendingApps": [ ...top 5 apps... ]
  }
}
```

---

### GET `/admin/users?page=0&size=20`

List all platform users.

---

### PATCH `/admin/users/{userId}/toggle`

Toggle user active/suspended status.

---

### GET `/admin/apps/pending`

Apps awaiting admin approval.

---

## ❌ Error Responses

All errors follow this shape:

```json
{
  "status": 404,
  "message": "App not found with id: 999",
  "timestamp": "2024-01-01T10:00:00",
  "errors": null
}
```

Validation errors include field-level details:

```json
{
  "status": 400,
  "message": "Validation failed",
  "timestamp": "2024-01-01T10:00:00",
  "errors": {
    "email": "Invalid email format",
    "password": "Must contain letters and numbers"
  }
}
```

**HTTP Status Codes Used:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (invalid/expired token) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource Not Found |
| 409 | Conflict (duplicate email, etc.) |
| 500 | Internal Server Error |
