# Sakila Webapp (Node.js + MySQL, SSR, Callbacks)
## Prerequisites
- Docker & Docker Compose (or Portainer Stack)
- Download the official MySQL Sakila sample SQL files and place them in `dbinit/`:
- `sakila-schema.sql`
- `sakila-data.sql`
## 1) Configure environment
Copy `.env.example` to `.env` and set secure values.
## 2) Run with Docker Compose
```bash
docker compose up -d --build
