# BuyBright: Agent Rules

## Stack
React + Vite + Tailwind, FastAPI, SQLAlchemy 2.0 (sync, psycopg2), Alembic, PostgreSQL, Redis, pandas, Chart.js, Docker Compose.

## Critical rules
- Money uses Decimal / Numeric(10, 2). Never float.
- The server recalculates all totals. Never trust browser prices or payment messages.
- Stock and wallet changes happen in one DB transaction with row locking (SELECT ... FOR UPDATE).
- Checkout is idempotent (idempotency key + unique constraint).
- Every order stores snapshots: unit price, delivery fee, commission %, points rate.
- Business values (commission, delivery fee, points rate, plans) live in the database, not in code.
- Routers stay thin. Business logic goes in app/services/.
- All schema changes go through Alembic migrations. Never edit tables by hand.
- Sync SQLAlchemy only. Pydantic for validation.
- Write or update tests with every feature.
- Never commit .env or secrets.
- Keep it simple. Do not add features I did not ask for.

## Roles
Customer, Seller, Admin. Every endpoint checks the role and ownership.