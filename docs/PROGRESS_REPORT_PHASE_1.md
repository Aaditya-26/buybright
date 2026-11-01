# BuyBright: Progress Report (Phase 1)
**Date:** November 2, 2026 · **Author:** @Aaditya

Phase 1 is complete: BuyBright is defined, planned, container-configured with Docker Compose (FastAPI, PostgreSQL 16, and Redis 7), and verified on Windows CMD. The repository is version-controlled on the `main` branch, pushed to GitHub with credentials safely excluded, and ready for container startup.

---

## 1. What BuyBright Is
BuyBright is a modern multi-seller e-commerce marketplace platform:
- **Sellers:** Register, get approved by admin, choose a monthly/yearly subscription plan, and manage their own product inventory and orders.
- **Customers:** Browse products from multiple sellers in one unified shopping cart, pay using simulated payment methods or an in-platform wallet, earn loyalty points, and subscribe to Prime for free delivery.
- **Admin:** Oversees seller approvals, sets platform commission percentage (e.g., 5%), manages seller subscription tiers, reviews analytics, and approves payouts.
- **Simulated Environment:** All payments, customer wallets, seller commission ledgers, and payouts are simulated (no real card processing required).

---

## 2. Key Architecture Decisions

| Decision | Choice | Reason |
| :--- | :--- | :--- |
| **Backend** | FastAPI instead of Django REST Framework | Modern asynchronous architecture, high performance, automatic Swagger OpenAPI documentation, and strict Pydantic validation. |
| **Scope** | Multi-seller marketplace with seller plans, commission, and wallets | Practical, portfolio-ready architecture demonstrating multi-tenant database design and transactional business logic. |
| **Data Storage** | PostgreSQL 16 (source of truth) + Redis 7 (caching) | Relational database transactions for money and stock consistency; in-memory cache for fast session and product lookups. |
| **ORM Style** | Synchronous SQLAlchemy 2.0 with Alembic | Rock-solid support for row-level locking (`SELECT ... FOR UPDATE`), transaction isolation, and checkout idempotency. |
| **Configuration** | Dynamic business values stored in database | Delivery fees, points conversion rates, and seller plans live in database tables rather than hardcoded in Python code. |
| **Payments** | Simulated only | Live payment gateway integration is out of scope for university submission; simulated flows allow testing all edge cases (success, failure, timeout). |
| **Version Control** | Git & GitHub (`main` branch) | Industry-standard versioning with strict `.env` secret exclusion rules. |

---

## 3. Technology Stack

| Layer | Tools | Purpose |
| :--- | :--- | :--- |
| **Frontend (Planned)** | React, Vite, Tailwind CSS, Chart.js, Axios | Dynamic single-page application with responsive UI and charts. |
| **Backend** | Python 3.12, FastAPI, Uvicorn | High-performance RESTful API framework and ASGI server. |
| **Database** | PostgreSQL 16, SQLAlchemy 2.0, Alembic | Relational datastore, modern ORM, and schema migration manager. |
| **Cache** | Redis 7, `redis-py` | In-memory key-value cache and session management. |
| **Analytics (Planned)** | pandas, Chart.js | Platform revenue aggregation, top product rankings, and seller reports. |
| **Containerization** | Docker Compose, Dockerfile (Python 3.12-slim) | Reproducible multi-container orchestration. |
| **Dev Tools** | Git, GitHub, VS Code / Antigravity, Swagger UI | Source control, development environment, and interactive API testing. |

---

## 4. Setup Completed (Phase 1)
- [x] Initialized project repository at `C:\dev\buybright` (outside OneDrive).
- [x] Created clean directory structure: `backend/app/` (`core`, `models`, `schemas`, `routers`, `services`), `scripts/`, `tests/`, and `docs/`.
- [x] Configured `.gitignore` and `.gitattributes` to enforce Linux LF line endings and protect `.env`.
- [x] Implemented Pydantic Settings in `backend/app/core/config.py` with lowercase fields and CORS list parser.
- [x] Implemented SQLAlchemy 2.0 database engine and session dependency in `backend/app/core/database.py`.
- [x] Implemented Redis client in `backend/app/core/redis_client.py`.
- [x] Implemented FastAPI entrypoint in `backend/app/main.py` with welcome endpoint, CORS, and dual-service `/health` probe.
- [x] Created shared dependency helpers in `backend/app/deps.py`.
- [x] Added automated unit tests in `backend/tests/test_health.py`.
- [x] Created production-ready `backend/Dockerfile` with Python 3.12-slim, dependency caching, and non-root user `appuser`.
- [x] Created `docker-compose.yml` with health checks, persistent PostgreSQL named volume, host port conflict avoidance (`127.0.0.1:5433:5432`), and backend reload mode.
- [x] Conducted comprehensive review and syntax verification with `py_compile`.
- [x] Pushed clean initial commit to GitHub repository on `main` branch (`https://github.com/Aaditya-26/buybright`).

---

## 5. Problems Faced and How They Were Solved

| Problem | Cause | Exact Fix |
| :--- | :--- | :--- |
| **`mkdir -p` and `{a,b}` syntax errors** | Linux Bash shell commands executed inside Windows CMD / PowerShell | Used native Windows CMD commands or created folders sequentially. |
| **OneDrive file locking and Git corruption** | Project initially lived in `C:\Users\user\OneDrive\Desktop\...` where background syncing held open locks on `.git/config` and `.git/HEAD` | Moved project completely outside OneDrive to `C:\dev\buybright`. |
| **Files created in wrong root folders** | Scaffold created backend sub-files at root | Restructured cleanly into `backend/app/core/`, `models/`, etc. |
| **Empty scaffold files discovered during review** | Boilerplate files (`config.py`, `database.py`, `redis_client.py`, `main.py`, `Dockerfile`, `docker-compose.yml`) were 0 bytes | Implemented full production code, verified non-zero byte sizes, and checked Python compilation syntax. |
| **Windows CRLF line endings** | Windows editors save files with `\r\n`, which can break Linux container scripts | Normalized all project files to LF (`\n`) and enforced `* text=auto eol=lf` in `.gitattributes`. |
| **Default branch named `master`** | Git initialization defaulted to legacy `master` branch | Switched branch to modern standard `main` and configured `git config core.autocrlf false`. |
| **Host database port conflict & network exposure** | Default port `5432` could conflict with a local PostgreSQL installation and expose the database publicly | Mapped to `127.0.0.1:5433:5432` (host port 5433 on loopback only; inside Docker stays `db:5432`), keeping Redis unexposed on host for security. |

---

## 6. Current Status & Next Steps

| Item | Status | Details |
| :--- | :---: | :--- |
| **Project Directory `C:\dev\buybright`** | **Done** | Fast, local filesystem outside OneDrive. |
| **GitHub Repository** | **Done** | Pushed to `main` branch; `.env` verified excluded. |
| **Core Backend Code** | **Done** | `config.py`, `database.py`, `redis_client.py`, `deps.py`, and `main.py` verified. |
| **Container Specification** | **Done** | `Dockerfile` and `docker-compose.yml` fully configured. |
| **Docker Startup** | **Ready** | Start with `docker compose up --build`. |
| **`/health` Probe** | **Ready** | Test in browser at `http://localhost:8000/health`. |
| **Phase 2 (Models & Migrations)** | **Next** | Initialize Alembic, write models (`User`, `SellerProfile`, `Category`, `Product`), run first migration. |
