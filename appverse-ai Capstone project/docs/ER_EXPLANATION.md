# AppVerse AI – Entity Relationship Explanation

---

## 📊 ERD Overview

```
users ──────────────────────────────────────────────────────────
  │  id (PK)                                                     │
  │  username, email, password, full_name, role, is_active       │
  │                                                              │
  ├──── ONE-TO-MANY ──── apps (as developer)                     │
  │       apps.developer_id → users.id                           │
  │                                                              │
  ├──── ONE-TO-MANY ──── reviews                                 │
  │       reviews.user_id → users.id                             │
  │                                                              │
  ├──── ONE-TO-MANY ──── downloads                               │
  │       downloads.user_id → users.id                           │
  │                                                              │
  └──── ONE-TO-ONE  ──── refresh_tokens                          │
          refresh_tokens.user_id → users.id                      │

apps ──────────────────────────────────────────────────────────
  │  id (PK), name, slug, description, version                   │
  │  developer_id (FK → users), category_id (FK → categories)    │
  │  price, download_count, avg_rating, trending_score, status   │
  │                                                              │
  ├──── MANY-TO-ONE ──── categories                              │
  │       apps.category_id → categories.id                       │
  │                                                              │
  ├──── MANY-TO-ONE ──── users (developer)                       │
  │       apps.developer_id → users.id                           │
  │                                                              │
  ├──── ONE-TO-MANY ──── reviews                                 │
  │       reviews.app_id → apps.id                               │
  │                                                              │
  ├──── ONE-TO-MANY ──── downloads                               │
  │       downloads.app_id → apps.id                             │
  │                                                              │
  └──── ONE-TO-MANY ──── app_versions                            │
          app_versions.app_id → apps.id                          │

categories ─────────────────────────────────────────────────────
  │  id (PK), name, description, icon, color                     │
  └──── ONE-TO-MANY ──── apps                                    │

reviews ────────────────────────────────────────────────────────
  │  id (PK)                                                      │
  │  app_id (FK → apps)         MANY-TO-ONE                      │
  │  user_id (FK → users)       MANY-TO-ONE                      │
  │  rating, title, content                                       │
  │  sentiment, sentiment_score                                   │
  │  is_flagged, is_fake                                          │
  └──── UNIQUE CONSTRAINT: (user_id, app_id)  ← one review/user/app

downloads ──────────────────────────────────────────────────────
  │  id (PK)                                                      │
  │  app_id (FK → apps)         MANY-TO-ONE                      │
  │  user_id (FK → users)       MANY-TO-ONE (nullable)            │
  │  ip_address, platform                                         │
  └──── Multiple downloads per user/app are allowed               │

app_versions ───────────────────────────────────────────────────
  │  id (PK)                                                      │
  │  app_id (FK → apps)         MANY-TO-ONE                      │
  │  version, release_notes, download_url                         │
  └──── History of all versions for an app                        │

bookmarks ──────────────────────────────────────────────────────
  │  id (PK)                                                      │
  │  user_id (FK → users)       MANY-TO-ONE                      │
  │  app_id (FK → apps)         MANY-TO-ONE                      │
  └──── UNIQUE: (user_id, app_id)                                 │
```

---

## 🔑 Key Relationships

### 1. User ↔ Apps (Developer relationship)
```
One User (DEVELOPER role) → Many Apps
One App → One Developer (User)
```
A developer can publish many apps. Each app has exactly one developer.

### 2. User ↔ Reviews
```
One User → Many Reviews (one per app)
One App → Many Reviews (from different users)
```
The `UNIQUE KEY (user_id, app_id)` on reviews table ensures each user can review each app only once.

### 3. Apps ↔ Categories
```
One Category → Many Apps
One App → One Category
```
Every app belongs to exactly one category.

### 4. Apps ↔ Downloads (Analytics)
```
One App → Many Downloads
One User → Many Downloads (of different apps)
```
Downloads are logged individually for analytics. No unique constraint – the same user can download multiple times (re-installs).

### 5. User ↔ RefreshToken
```
One User → One RefreshToken (1-to-1)
```
Previous refresh token is deleted when a new one is issued.

---

## 📐 Normalisation Level

The schema is in **3NF (Third Normal Form)**:
- No partial dependencies (all non-key columns depend on the full primary key)
- No transitive dependencies
- Separate tables for categories (not stored as strings in apps)
- Download history is a separate table (not a counter-only approach)

---

## 🔢 Indexes Used

| Table | Index | Purpose |
|-------|-------|---------|
| apps | idx_category | Fast category-based browsing |
| apps | idx_developer | Developer's app list |
| apps | idx_status | Filter by APPROVED/PENDING |
| apps | idx_trending | Trending sort |
| apps | ft_search | Full-text search (name, description) |
| downloads | idx_app_downloads | Count downloads per app |
| downloads | idx_date | Time-based analytics |
