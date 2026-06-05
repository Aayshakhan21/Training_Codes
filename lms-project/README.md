# 📚 LMS Project — Learning Management System

A full-stack Learning Management System (LMS) built with a **Spring Boot** REST API backend and a **React + Vite** frontend. The platform supports two distinct roles — **Admin** and **Student (User)** — with separate dashboards, course management, enrollment tracking, grades, certificates, and analytics.

---

## 🗂️ Project Structure

```
lms-project/
├── lms-backend/          # Spring Boot REST API (Java 17)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/lms/
│   │       │   ├── config/         # Security & data seeding
│   │       │   ├── controller/     # REST controllers
│   │       │   ├── entity/         # JPA entities
│   │       │   ├── exception/      # Global exception handling
│   │       │   ├── repository/     # Spring Data JPA repos
│   │       │   └── service/        # Business logic
│   │       └── resources/
│   │           └── application.properties
│   ├── sql/              # SQL seed scripts
│   └── pom.xml
└── lms-frontend/         # React 19 + Vite 8 SPA
    ├── src/
    │   ├── components/   # Shared UI components
    │   ├── context/      # Auth context
    │   ├── pages/
    │   │   ├── admin/    # Admin pages
    │   │   ├── auth/     # Login page
    │   │   └── user/     # Student pages
    │   └── services/     # Axios API layer
    └── package.json
```

---

## ⚙️ Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.3.0 |
| Security | Spring Security (BCrypt) |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL |
| Build Tool | Maven (with Maven Wrapper) |
| Utilities | Lombok, Bean Validation |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

---

### 1. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE lmsdb;
```

Seed initial data (run in order):

```bash
mysql -u root -p lmsdb < lms-backend/sql/seed_modules_and_activities.sql
mysql -u root -p lmsdb < lms-backend/sql/seed_real_lms_data.sql
```

---

### 2. Backend Setup

Navigate to the backend directory and configure the database connection:

```bash
cd lms-backend
```

Edit `src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lmsdb
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

Run the application:

```bash
./mvnw spring-boot:run
```

The API starts on **`http://localhost:8080`**.

---

### 3. Frontend Setup

```bash
cd lms-frontend
npm install
npm run dev
```

The app runs on **`http://localhost:5173`**.

> Vite is configured to proxy `/api` requests to the backend at `localhost:8080`, so no CORS setup is needed in development.

---

## 🔐 Authentication

The app uses a custom stateless authentication flow (no session/JWT — credentials validated per request via `AppUserService`).

### Login Endpoint
```
POST /api/auth/login
Body: { "username": "...", "password": "..." }
```

### Register Endpoint
```
POST /api/auth/register
Body: { "username": "...", "password": "...", "name": "..." }
```

Passwords are hashed with **BCrypt**. After login, user info (id, username, name, role) is stored in React context and `localStorage`.

### Roles
| Role | Access |
|---|---|
| `ADMIN` | Admin dashboard, course/student management, analytics, reports |
| `USER` | Student dashboard, course browsing, enrollment, grades, certificates |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive user info |

### Courses (Admin CRUD)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | Get all courses |
| POST | `/api/courses` | Create a course |
| PUT | `/api/courses/{id}` | Update a course |
| DELETE | `/api/courses/{id}` | Delete a course |

### Students (Admin CRUD)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |

### Learning (Student-facing)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/learning/catalog` | Browse all courses with enrollment status |
| POST | `/api/learning/enroll` | Enroll in a course |
| POST | `/api/learning/unenroll` | Unenroll from a course |
| GET | `/api/learning/courses-progress` | Enrolled courses with progress % |
| GET | `/api/learning/courses/{id}/modules` | Course modules, parts & activities |
| GET | `/api/learning/user/grades` | Grades per course (score, GPA) |
| GET | `/api/learning/user/certificates` | Earned and in-progress certificates |
| GET | `/api/learning/notifications` | User notifications |
| GET | `/api/learning/analytics` | Enrollment/completion analytics |
| GET | `/api/learning/help` | FAQs and support contacts |

---

## 🖥️ Frontend Pages

### Admin
| Page | Route | Description |
|---|---|---|
| Dashboard | `/admin/dashboard` | Overview stats, charts (area, bar, pie) |
| Courses | `/admin/courses` | Full CRUD for courses |
| Students | `/admin/students` | Full CRUD for students |
| Enrollments | `/admin/enrollments` | View & manage enrollments |
| Analytics | `/admin/analytics` | Monthly enrollment/completion charts, radar chart |
| Certificates | `/admin/certificates` | Certificate overview |
| Reports | `/admin/reports` | Downloadable/printable reports |

### Student (User)
| Page | Route | Description |
|---|---|---|
| Dashboard | `/user/dashboard` | Personal stats and course progress |
| My Courses | `/user/courses` | Enrolled courses with progress tracking |
| Browse | `/user/browse` | Course catalog with category filter & enrollment |
| Grades | `/user/grades` | Scores, letter grades, GPA |
| Certificates | `/user/certificates` | Earned certificates with credential IDs |
| Help | `/user/help` | FAQs and support contacts |

---

## 🗃️ Database Schema (Key Tables)

| Table | Description |
|---|---|
| `app_users` | Login credentials and roles |
| `students` | Student profiles linked to users |
| `courses` | Course catalog |
| `student_course` | Many-to-many enrollment join table |
| `course_modules` | Modules per course |
| `module_parts` | Video/reading parts within modules |
| `module_activities` | Assignments/quizzes/projects per module |
| `student_activity_progress` | Per-student activity completion and scores |
| `help_faqs` | FAQ entries for the help page |
| `support_contacts` | Support contact entries |

---

## 🏗️ Key Design Decisions

**Direct JDBC in `LearningController`** — The learning/student-facing endpoints use `JdbcTemplate` with raw SQL for complex multi-join queries (progress calculation, grade aggregation, certificate eligibility). This avoids N+1 problems inherent in the ORM approach used for the simpler admin CRUD endpoints.

**Role-based routing in React** — `ProtectedRoute` wraps every page and checks the user's role from `AuthContext`. Unauthorized access redirects to `/login`.

**Progress calculation** — Course progress is computed server-side as `(completed_activities / total_activities) * 100`. A certificate is issued when progress ≥ 70%.

**GPA formula** — `GPA = min(4.0, avgScore / 25)`, mapping a 0–100 score to a 0–4.0 GPA scale.

---

## 🛠️ Development Scripts

### Backend
```bash
./mvnw spring-boot:run       # Start dev server
./mvnw test                  # Run tests
./mvnw package               # Build JAR
```

### Frontend
```bash
npm run dev       # Start Vite dev server (port 5173)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check
```

---

## 📝 Notes

- The default database credentials (`root/root`) in `application.properties` are for local development only. Change these before any deployment.
- CORS is configured to allow `http://localhost:5173` in all REST controllers via `@CrossOrigin`. Update this for production.
- Spring Security is currently set to **permit all `/api/**`** requests without authentication checks at the filter level; authentication is enforced at the service layer instead.
