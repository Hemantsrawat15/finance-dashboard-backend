# Finance Dashboard Backend API

A production-grade RESTful API for a Finance Dashboard system built with 
Node.js, Express.js, and MongoDB. Supports role-based access control, 
JWT authentication, financial record management, and dashboard analytics.

---

## 🚀 Live Deployment

> The API is fully deployed. No setup required to test.

| Resource | URL |
|----------|-----|
| Base URL | `https://finance-dashboard-backend-production-d325.up.railway.app/` |
| Health Check | `https://finance-dashboard-backend-production-d325.up.railway.app/health` |
| **Swagger Docs** | `https://finance-dashboard-backend-production-d325.up.railway.app/api/docs` |

### Default Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@finance.com | admin123 |
| Analyst | analyst@test.com | password123 |
| Viewer | viewer@test.com | password123 |

> **How to test via Swagger:**
> 1. Open the Swagger URL above
> 2. Call `POST /api/auth/login` with admin credentials
> 3. Copy the `token` from the response
> 4. Click the **Authorize 🔒** button at the top right
> 5. Paste: `Bearer <your_token_here>`
> 6. Now every endpoint is unlocked — click any route and hit **Try it out**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js v18+ |
| Framework | Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Authentication | JWT via jsonwebtoken |
| Password Hashing | bcryptjs |
| Validation | Joi |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Security | Helmet, CORS, Rate Limiting |
| Logging | Morgan |

---

## ⚡ Local Setup (Run on Your Machine)

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas URI

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/Hemantsrawat15/finance-dashboard-backend.git
cd finance-dashboard-backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Open .env and fill in your values

# 4. Seed the admin user
node seed.js

# 5. Start the development server
npm run dev
```

### Local URLs
| Resource | URL |
|----------|-----|
| Health Check | `http://localhost:3000/health` |
| Swagger Docs | `http://localhost:3000/api/docs` |
| Base API | `http://localhost:3000/api` |

---

## 🔐 Environment Variables

Create a `.env` file in the root folder. See `.env.example` for reference.

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_long_secret_key` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |

---

## 👥 Role & Permission Matrix

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View own profile | ✅ | ✅ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Manage users (role/status) | ❌ | ❌ | ✅ |
| View financial records | ✅ | ✅ | ✅ |
| Create / Update / Delete records | ❌ | ❌ | ✅ |
| Access dashboard analytics | ❌ | ✅ | ✅ |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, receive JWT |
| GET | `/api/auth/me` | Any logged-in | Get current user profile |

### User Management
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Admin | Get user by ID |
| PATCH | `/api/users/:id/role` | Admin | Change user role |
| PATCH | `/api/users/:id/status` | Admin | Activate/deactivate user |

### Financial Records
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/records` | All logged-in | Get all records (with filters) |
| GET | `/api/records/:id` | All logged-in | Get single record |
| POST | `/api/records` | Admin | Create a record |
| PATCH | `/api/records/:id` | Admin | Update a record |
| DELETE | `/api/records/:id` | Admin | Soft delete a record |

**Filtering:** `GET /api/records?type=expense&category=Rent&from=2026-01-01&to=2026-03-31&page=1&limit=10`

### Dashboard Analytics
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | Analyst/Admin | Total income, expenses, net balance |
| GET | `/api/dashboard/by-category` | Analyst/Admin | Category-wise breakdown |
| GET | `/api/dashboard/trends` | Analyst/Admin | Last 12 months income vs expense |
| GET | `/api/dashboard/recent` | Analyst/Admin | Last 10 transactions |

---

## 📁 Project Structure
```
finance-dashboard-backend/
├── src/
│   ├── config/         → MongoDB connection
│   ├── middleware/     → JWT auth + RBAC
│   ├── models/         → Mongoose schemas
│   ├── routes/         → API route definitions
│   ├── controllers/    → Request/response handlers
│   ├── services/       → Business logic
│   └── validators/     → Joi validation schemas
├── seed.js             → Admin user seeder
├── server.js           → Entry point
├── .env.example        → Environment variable template
└── README.md
```

---

## 📝 Assumptions Made

- Only **admins** can create, update, or delete financial records
- **Viewers** can read records but cannot access dashboard analytics
- **Soft delete** is used for records to preserve audit trail — deleted records remain in the database with `isDeleted: true`
- JWT tokens expire in **7 days**; no refresh token mechanism is implemented
- Monetary amounts use MongoDB's `Decimal128` type to avoid floating point precision issues
- The first admin is created via `node seed.js`; in production a more secure flow would be used
- Pagination defaults to **page 1, 10 items** if not specified in query params
- Mongoose pre-query middleware automatically excludes soft-deleted records from all `find` queries

---

## ⚖️ Tradeoffs Considered

- **MongoDB over PostgreSQL** — chosen for its natural JSON document model, seamless Node.js integration, and powerful aggregation pipelines for dashboard analytics
- **Soft delete over hard delete** — preserves financial audit history at the cost of slightly more complex queries
- **Stateless JWT over sessions** — simpler to scale horizontally; tradeoff is tokens cannot be invalidated before expiry
- **Service layer pattern** — adds a layer of abstraction over simple CRUD but makes business logic testable and reusable

---

## ✅ Submission Checklist

- [x] All 14+ endpoints implemented and tested
- [x] JWT authentication working
- [x] Role-based access control enforced (403 for wrong role, 401 for no token)
- [x] Joi validation on all POST/PATCH requests (422 with error details)
- [x] Soft delete implemented and verified
- [x] Pagination and filtering on GET /api/records
- [x] MongoDB aggregation pipelines for dashboard
- [x] Swagger documentation available (local + deployed)
- [x] .env excluded from Git, .env.example included
- [x] Admin seeder script included
- [x] Deployed and live
