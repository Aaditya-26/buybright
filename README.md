# BuyBright

BuyBright is a modern multi-seller e-commerce marketplace platform built with FastAPI, SQLAlchemy 2.0, PostgreSQL 16, Redis 7, and Docker Compose. A React + Vite frontend will be added in a future phase.

## Tech Stack
- **Backend Framework:** FastAPI (Python 3.12)
- **Database & ORM:** PostgreSQL 16 with SQLAlchemy 2.0 (sync, psycopg2-binary)
- **Migrations:** Alembic
- **Caching & Sessions:** Redis 7
- **Settings & Validation:** Pydantic Settings
- **Containerization:** Docker Compose
- **Frontend (Planned):** React + Vite + Tailwind CSS

## Project Structure
```text
buybright/
├── .env.example              # Sample environment variables
├── .env                      # Local secret environment variables (never committed)
├── .gitignore                # Git ignore rules
├── .gitattributes            # Line ending configurations (LF enforcement)
├── CLAUDE.md                 # Project agent guidelines and business rules
├── docker-compose.yml        # Docker service orchestration (db, redis, backend)
├── README.md                 # Project documentation
├── docs/                     # Additional project documentation
└── backend/
    ├── Dockerfile            # Container build recipe for Python backend
    ├── requirements.txt      # Production Python dependencies
    ├── requirements-dev.txt  # Development/testing dependencies
    ├── scripts/              # Helper utility scripts
    ├── tests/                # Automated tests
    └── app/
        ├── main.py           # FastAPI entrypoint and /health route
        ├── deps.py           # Shared FastAPI dependencies
        ├── core/             # Core configurations (config, database, redis)
        ├── models/           # SQLAlchemy database models
        ├── schemas/          # Pydantic schemas for request/response validation
        ├── routers/          # API endpoint routes (Customer, Seller, Admin)
        └── services/         # Core business logic
```

## Getting Started

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Windows CMD or PowerShell.

### 2. Environment Configuration
Ensure your `.env` file exists at the root and contains valid configuration values (see `.env.example`).

### 3. Running with Docker Compose
Start all services (PostgreSQL, Redis, and FastAPI Backend):
```cmd
docker compose up --build
```

### 4. Endpoints & Documentation
Once running:
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Service Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

