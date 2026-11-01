# BuyBright: Comprehensive Progress & Learning Report (Phases 1, 2 & 3)
**Author:** @Aaditya · **Project:** BuyBright Multi-Seller E-Commerce Marketplace  
**Date:** November 2026 · **Target Audience:** College Review Committee, Viva Examiners & Student Study Guide

---

# Table of Contents
1. [Project Overview & Big Picture](#1-project-overview--big-picture)
2. [Phase 1: Foundation, Infrastructure & Containerization](#2-phase-1-foundation-infrastructure--containerization)
3. [Phase 2: Database Models & Alembic Migrations](#3-phase-2-database-models--alembic-migrations)
4. [Phase 3: Authentication, Security & Role-Based Access Control (RBAC)](#4-phase-3-authentication-security--role-based-access-control-rbac)
5. [Summary of All Problems Faced & Exact Solutions](#5-summary-of-all-problems-faced--exact-solutions)
6. [The Top 10 Viva Questions & Exact Answers](#6-the-top-10-viva-questions--exact-answers)

---

# 1. Project Overview & Big Picture

### What is BuyBright?
BuyBright is a modern **multi-seller e-commerce marketplace** (similar in concept to Amazon or Flipkart):
- **Sellers:** Register, get vetted and approved by the platform Admin, subscribe to a seller plan, and manage their own inventory, orders, and earnings.
- **Customers:** Browse a unified catalogue from multiple independent sellers, add items from different sellers into one shopping cart, and checkout with simulated payment or platform wallet credits.
- **Admin:** Approves or rejects seller applications, configures dynamic platform commission fees (e.g., 5%) and delivery fees, reviews revenue analytics, and approves payouts.
- **Simulated Financials:** Since real payment gateway integration (like Razorpay/Stripe live mode) requires a registered business entity, all transactions, wallet balances, loyalty points, and seller payouts are simulated with mathematical precision.

---

# 2. Phase 1: Foundation, Infrastructure & Containerization

### What We Built:
- **`docker-compose.yml`**: Orchestrates 3 services together:
  - `db`: PostgreSQL 16 on private network, published to host on `127.0.0.1:5433:5432` with `pg_isready` healthcheck and `postgres_data` persistent volume.
  - `redis`: Redis 7 in-memory cache with `redis-cli ping` healthcheck (internal only).
  - `backend`: FastAPI Python 3.12 service with hot reload (`--reload`) and depends_on healthy database and cache.
- **`backend/Dockerfile`**: Lightweight image based on `python:3.12-slim`, non-root user `appuser` for security, requirements layer caching, and port 8000 exposed.
- **`backend/app/core/config.py`**: Pydantic Settings reading environment variables safely from `.env`.
- **`backend/app/core/database.py`**: Synchronous SQLAlchemy 2.0 connection engine with `pool_pre_ping=True` and `get_db()` session generator.
- **`backend/app/core/redis_client.py`**: Shared Redis client with string decoding.
- **`backend/app/main.py`**: FastAPI application with CORS middleware, `@app.get("/")` welcome route, and `@app.get("/health")` dual-service liveness check.

### Why We Did This & Purpose:
1. **Why Docker Compose?**
   - *Purpose:* Prevents the *"it works on my computer but not on yours"* problem. Your guide or examiner doesn't need to install Python 3.12, PostgreSQL, or Redis manually on their PC. Running `docker compose up` starts the entire system identically on any machine.
2. **Why Host Port 5433 instead of 5432?**
   - *Purpose:* On Windows developer laptops, a local PostgreSQL server is very often already running on port 5432. Mapping the host port to `5433:5432` avoids port collisions on your laptop while keeping the internal container port as standard `5432`.
3. **Why Non-Root User in Dockerfile (`appuser`)?**
   - *Purpose:* Security principle of least privilege. If a malicious attacker discovers a remote code execution exploit in an API library, running as `appuser` prevents them from gaining administrative root control over the operating system.

---

# 3. Phase 2: Database Models & Alembic Migrations

### What We Built:
1. **`TimestampMixin` (`mixins.py`)**: Automatically manages `created_at` and `updated_at` timestamps using database-native functions (`func.now()`).
2. **`User` (`user.py`)**: Stores user accounts with email (unique, indexed), password hash, full name, phone, role (`CUSTOMER`, `SELLER`, `ADMIN`), and active status.
3. **`SellerProfile` (`seller_profile.py`)**: 1-to-1 extension of a User. Holds business name, contact info, approval status (`PENDING`, `APPROVED`, `SUSPENDED`, `EXPIRED`), and admin approval tracking.
4. **`Category` (`category.py`)**: Product categories with unique names and indexed URL slugs (e.g. `slug="electronics"`).
5. **`Product` (`product.py`)**: Items for sale, foreign-keyed to both `seller_profiles.id` and `categories.id`. Contains price (`Numeric(10, 2)`), stock quantity, and database check constraints.
6. **`Setting` (`setting.py`)**: Key-value table storing dynamic business parameters (commission rate, delivery fee, points conversion rates).
7. **Alembic Integration (`alembic/env.py`)**: Reads database credentials dynamically from Pydantic settings and binds `Base.metadata` for automated migrations.
8. **`seed_settings.py` (`scripts/seed_settings.py`)**: Script to seed default store parameters safely (only inserts missing keys).

### Why We Did This & Purpose (With Real-World Examples):
1. **Why Alembic instead of creating tables manually with SQL?**
   - *Example:* If you manually run `CREATE TABLE products` in DBeaver on your laptop, your teammate or production server will not have that table. With Alembic, schema changes are written as code migrations (`alembic revision --autogenerate`), versioned in Git, and executed reliably with `alembic upgrade head`. If a migration breaks, you can instantly rollback with `alembic downgrade -1`.
2. **Why `Numeric(10, 2)` / `Decimal` instead of `Float` for money?**
   - *Example:* In computer hardware, floating-point math causes binary rounding errors. For example, `0.1 + 0.2` in floating-point equals `0.30000000000000004`. In e-commerce, rounding errors cause financial discrepancies and invoice mismatches. `Numeric(10, 2)` enforces exact fixed-point decimal arithmetic (up to 10 total digits with exactly 2 decimal places: e.g. `99,999,999.99`).
3. **Why Database `CheckConstraint` on Product price and stock?**
   - *Example:* `CheckConstraint("price >= 0")` and `CheckConstraint("stock >= 0")`. Even if a developer makes a coding error in Python that attempts to set stock to `-5` or price to `-100`, PostgreSQL immediately rejects the transaction at the database level.
4. **Why Foreign Keys with `RESTRICT` and `CASCADE`?**
   - When a User is deleted, their `SellerProfile` is deleted too (`ondelete="CASCADE"`).
   - But if a Seller or Category has active Products, PostgreSQL forbids deleting that Category or Seller (`ondelete="RESTRICT"`) to prevent orphaned products.

---

# 4. Phase 3: Authentication, Security & Role-Based Access Control (RBAC)

### What We Built:
1. **`core/security.py`**:
   - `hash_password()`: Hashes passwords using **bcrypt** with an automatically generated salt.
   - `verify_password()`: Verifies plain text against stored bcrypt hash safely.
   - `create_access_token()`: Creates signed JSON Web Tokens (JWT) using HS256 algorithm and expiration timestamps.
   - `decode_access_token()`: Validates cryptographic signature and expiration.
2. **`schemas/auth.py`**:
   - `RegisterRequest`: Validates incoming email format, password length (8-64 characters), and full name.
   - `UserOut`: Response schema. **Noticeably omits password fields** to ensure password hashes can never leak in JSON responses.
   - `TokenOut`: Standard OAuth2 token response (`access_token`, `token_type: "bearer"`).
3. **`services/auth_service.py`**:
   - `register_customer()`: Checks for existing email, hashes password, and **strictly forces the role to `CUSTOMER`**.
   - `authenticate()`: Checks password, verifies account is active, and **enforces brute-force protection in Redis** (locks login after 5 failed attempts for 15 minutes).
4. **`deps.py`**:
   - `get_current_user`: Extracts JWT from `Authorization: Bearer <token>`, decodes user ID, and loads the fresh user record from the database.
   - `require_roles(*roles)`: Reusable role guard dependency that raises HTTP 403 Forbidden if the user's role does not match allowed roles.
5. **`routers/auth.py`**:
   - `POST /auth/register`: Public registration endpoint.
   - `POST /auth/login`: Form-data login endpoint compatible with Swagger UI's "Authorize" button.
   - `GET /auth/me`: Returns current authenticated user's profile.
   - `GET /auth/admin-only`: Demonstrates role-based route protection.
6. **`scripts/create_admin.py`**:
   - Command-line utility to bootstrap the first Platform Admin with hidden password entry via `getpass`.
7. **`tests/conftest.py` & `test_auth.py`**:
   - Automated Pytest test suite running against an isolated `buybright_test` database with rollback after every test.

### Why We Did This & Purpose (With Real-World Examples):

#### 1. Why Bcrypt for Passwords?
- **The Problem:** Simple hashing algorithms like MD5 or SHA-256 can be computed billions of times per second on modern graphics cards (GPUs). If a database leaks, hackers use precomputed "rainbow tables" to crack millions of passwords in seconds.
- **The Solution:** Bcrypt includes a unique random salt (preventing rainbow table attacks) and is deliberately slow to compute (work factor). It makes brute-force cracking practically impossible.

#### 2. Why Public Registration Cannot Choose a Role
- **The Threat:** In a vulnerable API, a user could send `{"email": "hacker@test.com", "password": "...", "role": "admin"}` in JSON and give themselves administrator privileges.
- **Our Defense:** Our `RegisterRequest` schema has no `role` field, and `register_customer()` hardcodes `role=UserRole.CUSTOMER`. Admins can only be created via the internal CLI script `create_admin.py`.

#### 3. Why the Role is Loaded from Database, Not Stored in JWT
- **The Problem:** If the user's role (e.g. `role: "seller"`) is stored inside the JWT token, and the admin suspends that seller for fraud, the seller could continue making authenticated requests until their token expires 60 minutes later!
- **Our Defense:** The JWT token only contains the `sub` (user ID). On every request, `get_current_user` queries the database. If `is_active` is False or their role changed, the suspension takes effect **immediately on their very next click**.

#### 4. Why Redis Brute-Force Rate Limiting?
- **The Threat:** Attackers write automated scripts to try millions of common passwords against user accounts (credential stuffing).
- **Our Defense:** In `auth_service.py`, failed attempts increment a Redis key `login_fail:{email}`. After 5 failed attempts within 15 minutes, Redis automatically rejects further attempts with `HTTP 429 Too Many Requests`. Successful logins immediately delete the counter.

#### 5. Why "Invalid email or password" (Generic Error Message)?
- **The Threat:** If the server returned *"Email not found"*, an attacker could test email lists to discover which of their targets have accounts on BuyBright.
- **Our Defense:** We return the exact same message and 401 status whether the email is unknown or the password was wrong.

---

# 5. Summary of All Problems Faced & Exact Solutions

| # | Problem Encountered | Root Cause | Exact Engineering Solution |
|---|:---|:---|:---|
| 1 | **`mkdir -p` & `{a,b}` failed** | Linux Bash syntax run in Windows CMD | Used CMD-compatible syntax or created directories sequentially. |
| 2 | **OneDrive Git & Docker locking** | Project was inside `C:\Users\...\OneDrive\Desktop` where cloud sync locked `.git/HEAD` | Migrated project directory to `C:\dev\buybright` outside OneDrive. |
| 3 | **Scaffold files were 0 bytes** | Initial boilerplate setup had empty placeholder files | Implemented complete production code for config, database, redis, and main.py; verified byte sizes and syntax. |
| 4 | **Windows CRLF line endings** | Windows editors save files with `\r\n`, breaking Linux containers | Converted all files to LF (`\n`) and enforced `* text=auto eol=lf` in `.gitattributes`. |
| 5 | **Git initial branch was `master`** | Legacy Git default on Windows | Renamed branch to modern `main` and set `git config core.autocrlf false`. |
| 6 | **Database host port conflict** | Port 5432 often occupied by existing Windows Postgres | Mapped host port to `127.0.0.1:5433:5432` (loopback only) while internal container network uses `db:5432`. |
| 7 | **`alembic` error: `NoSuchModuleError: driver`** | Default `alembic.ini` had placeholder `driver://...` before `env.py` was replaced | Replaced `backend/alembic/env.py` to read `settings.database_url` directly from Pydantic settings. |
| 8 | **IDE red squiggly warnings (`missing-import`)** | Host Windows Python didn't have packages installed in a virtual environment | Created local `.venv`, ran `pip install -r requirements.txt -r requirements-dev.txt`, and selected `.venv` as interpreter. |

---

# 6. The Top 10 Viva Questions & Exact Answers

1. **Q: What is the architecture of BuyBright?**  
   *A:* "BuyBright is a three-tier containerized web application. The backend is built with FastAPI and synchronous SQLAlchemy 2.0. PostgreSQL 16 serves as our relational source of truth for transactions, orders, and products. Redis 7 serves as an in-memory cache and rate-limiting store. All services are orchestrated with Docker Compose."

2. **Q: Why did you pick FastAPI instead of Django or Flask?**  
   *A:* "FastAPI provides native asynchronous capabilities, automatic interactive documentation (Swagger UI / OpenAPI), and strict data validation using Pydantic schemas, resulting in cleaner and faster APIs."

3. **Q: What is Alembic and why is it necessary?**  
   *A:* "Alembic is a database migration tool for SQLAlchemy. It tracks changes to database models over time as versioned migration scripts. This allows us to upgrade databases reliably across environments and rollback changes if an issue occurs without writing raw SQL."

4. **Q: Why do you store money as `Numeric(10, 2)` instead of `Float`?**  
   *A:* "Floating-point numbers in computers suffer from binary representation errors (such as `0.1 + 0.2 != 0.3`). In financial and e-commerce systems, monetary amounts require exact precision, which `Numeric(10, 2)` guarantees."

5. **Q: How does password hashing work in your system?**  
   *A:* "We never store plain text passwords. We use bcrypt to hash passwords with an automatic cryptographic salt. Bcrypt is deliberately slow and computationally intensive, protecting stored hashes against rainbow table and brute-force attacks."

6. **Q: How does JWT authentication work in BuyBright?**  
   *A:* "When a user logs in, the server verifies their credentials and issues a signed JSON Web Token (JWT) containing their user ID and an expiration timestamp. The client sends this token in the `Authorization: Bearer` header on subsequent requests. The server cryptographically verifies the token signature on each request."

7. **Q: Why don't you store user roles inside the JWT?**  
   *A:* "If a role is inside the token, an admin who bans a user or changes a seller's permissions cannot revoke their access until the token expires. By storing only the user ID in the token and querying the database on each request, permission changes and account bans take effect immediately."

8. **Q: How do you protect against brute-force login attacks?**  
   *A:* "We use Redis as a rate limiter. Every failed login attempt increments a counter tied to that email with a 15-minute TTL. If an attacker fails 5 times, Redis blocks subsequent login attempts with HTTP 429 Too Many Requests."

9. **Q: Why do you have `.env` and `.env.example`?**  
   *A:* "`.env` contains sensitive real passwords and keys and is strictly excluded by `.gitignore` so it never leaks onto GitHub. `.env.example` is a safe, dummy template that shows other developers which environment variables are required without revealing secrets."

10. **Q: What does your `/health` endpoint do?**  
    *A:* "It serves as a liveness probe. It executes `SELECT 1` on PostgreSQL and a `PING` on Redis. If both respond, it returns HTTP 200 OK. If either service is unreachable, it logs the error internally and returns HTTP 503 Service Unavailable."



---

# 7. Live Verification Results & Execution Evidence (November 2, 2026)

The following live milestones were executed and verified inside the Docker container environment:

### 1. Alembic Migration Applied
- **Command:** `docker compose exec backend alembic revision --autogenerate -m "create users sellers categories products settings"`
- **Revision Generated:** `99439f3aee19_create_users_sellers_categories_.py`
- **Upgrade Applied:** `docker compose exec backend alembic upgrade head`
- **Current Revision:** `99439f3aee19 (head)`

### 2. Database Tables Verified in PostgreSQL
- **Command:** `docker compose exec db psql -U buybright -d buybright_db -c "\dt"`
- **Result:** 6 relations successfully created:
  1. `alembic_version` (tracks migration state)
  2. `categories` (product categories with unique slug)
  3. `products` (items with `Numeric(10, 2)` price & stock checks)
  4. `seller_profiles` (seller account details & approval state)
  5. `settings` (dynamic platform parameters)
  6. `users` (accounts with bcrypt hashed passwords & roles)

### 3. Dynamic Platform Settings Seeded
- **Command:** `docker compose exec backend python -m scripts.seed_settings`
- **Result (7 rows):**
  - `store_name` = `BuyBright`
  - `commission_percent` = `5.00` (%)
  - `delivery_fee` = `40.00` (INR)
  - `points_per_100` = `1` (loyalty point)
  - `point_value` = `1.00` (INR)
  - `points_redeem_cap_percent` = `20` (%)
  - `low_stock_threshold` = `5` (units)

### 4. Administrator Account Created
- **Command:** `docker compose exec backend python -m scripts.create_admin`
- **Result:** Created platform admin (`buybright@admin.com`) with securely salted bcrypt hash.

### 5. Automated Test Suite Execution (10/10 Passed)
- **Command:** `docker compose exec backend python -m pytest -v`
- **Result:** **10 passed in 4.77s** against isolated `buybright_test` database:
  - `tests/test_auth.py::test_register_login_me_flow` -> **PASSED**
  - `tests/test_auth.py::test_client_cannot_choose_role` -> **PASSED**
  - `tests/test_auth.py::test_duplicate_email_rejected` -> **PASSED**
  - `tests/test_auth.py::test_wrong_password_rejected` -> **PASSED**
  - `tests/test_auth.py::test_password_is_stored_hashed` -> **PASSED**
  - `tests/test_auth.py::test_me_requires_token` -> **PASSED**
  - `tests/test_auth.py::test_customer_blocked_from_admin_route` -> **PASSED**
  - `tests/test_auth.py::test_admin_allowed_on_admin_route` -> **PASSED**
  - `tests/test_health.py::test_root_endpoint` -> **PASSED**
  - `tests/test_health.py::test_health_endpoint_response_structure` -> **PASSED**

---

### Project Readiness:
- **Phase 1 (Infrastructure & Docker):** 100% COMPLETE & VERIFIED.
- **Phase 2 (Models & Alembic Migrations):** 100% COMPLETE & VERIFIED.
- **Phase 3 (Authentication, RBAC & Security):** 100% COMPLETE & VERIFIED.
- **Ready for Next Phase:** Frontend Skeleton & Login/Register UI.


---

# 8. Phase 4: Frontend Skeleton (React + Vite + Tailwind CSS)

### What We Built:
- **`frontend/package.json`**: Pre-configured with React 19, React Router v7, Axios, Chart.js, and Tailwind CSS v4.
- **`frontend/vite.config.js`**: Vite configuration enabled with `@tailwindcss/vite` and `@vitejs/plugin-react`.
- **`frontend/.env`**: Points frontend to backend API URL: `VITE_API_URL=http://localhost:8000`.
- **`frontend/src/api/client.js`**: Shared, centralized Axios client configured with `baseURL`.
- **`frontend/src/App.jsx`**: Live connectivity test page that calls `GET /health` and renders the real-time health card.
- **`frontend/src/index.css`**: Configured with modern Tailwind CSS v4 `@import "tailwindcss";`.
- **Directory Structure:** Organized into modular folders: `src/api`, `src/context`, `src/components`, `src/routes`, `src/pages/customer`, `src/pages/seller`, `src/pages/admin`.

### Why We Did This & Purpose:
1. **Centralized API Client (`client.js`):** Instead of typing `http://localhost:8000` in every component, having a single Axios instance means we can attach authentication headers (`Authorization: Bearer <token>`) and base URLs in one place.
2. **Tailwind CSS v4 with Vite:** Provides utility-first styling with zero runtime overhead and instant hot-module replacement (HMR).
3. **Connection Verification (`App.jsx`):** Before building complex login and catalogue pages, verifying that React can successfully communicate across origins to FastAPI's `/health` endpoint proves CORS and network routing are working properly.
