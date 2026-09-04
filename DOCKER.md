# 🐳 Docker Guide — Smart Progress Tracker

## The Five Ws

| | |
|---|---|
| **What** | Three containers — `mongo` (database), `server` (Express API), `client` (React build served by nginx) — wired together by Docker Compose. |
| **Why** | Reproducible stack: one command brings up the whole app with its database, no Node/Mongo installed on the host, no Atlas account required. |
| **Who** | You, on any machine with Docker Desktop or Docker Engine + Compose v2. |
| **Where** | `docker-compose.yml` = production/self-host. `docker-compose.dev.yml` = local development with hot reload. |
| **When** | Prod stack for the homelab; dev stack while writing code. They use separate project names and volumes, so both can exist side by side. |
| **How** | See below. |

---

## Quick start

```bash
cp .env.example .env
# fill in MONGO_PASSWORD and JWT_SECRET (both are required, compose refuses to start without them)

docker compose up -d --build       # production stack
# -> http://localhost:8080
```

```bash
docker compose -f docker-compose.dev.yml up --build    # development stack
# -> http://localhost:5173  (Vite HMR)  |  API on :5000  |  Mongo on :27017
```

Generate secrets:

```bash
openssl rand -base64 24    # MONGO_PASSWORD
openssl rand -hex 32       # JWT_SECRET
```

---

## What each file does

| File | Purpose |
|---|---|
| `server/Dockerfile` | Multi-stage. `runtime` = prod (`npm ci --omit=dev`, runs as the non-root `node` user, `/api/health` healthcheck). `dev` = full deps + nodemon. |
| `client/Dockerfile` | Multi-stage. `runtime` = Vite build copied into `nginx:1.27-alpine`. `dev` = Vite dev server on 5173. |
| `client/nginx.conf` | SPA fallback for react-router, immutable caching for `/assets/`, and reverse proxy `/api/` → `server:5000`. |
| `docker-compose.yml` | Prod stack. Mongo has a named volume, API is **not** published (reachable only through nginx). |
| `docker-compose.dev.yml` | Dev stack. Source bind-mounted, all three ports published, separate volume. Standalone file, not an override. |
| `.env.example` | Template. Copy to `.env` — `.env` is already gitignored. |

---

## Two design decisions worth knowing

**1. nginx proxies `/api` instead of baking an API URL into the bundle.**
Vite inlines `import.meta.env.*` at *build* time, so an image built with `VITE_API_URL=https://foo` can never be repointed at runtime — you'd rebuild the image per environment. Building with it empty makes `client/src/services/api.js` fall back to the relative `/api`, which nginx forwards to the API container. One image, any environment, and the browser stays on a single origin so CORS never applies.

**2. The dev stack is a separate file, not an override.**
Compose *appends* list fields (`ports`) when merging override files, which would have left the dev client mapping both `8080:80` and `5173:5173`. Two standalone files duplicate the mongo block but behave predictably.

---

## Common operations

| Task | Command |
|---|---|
| Logs | `docker compose logs -f server` |
| Rebuild one service | `docker compose up -d --build server` |
| Mongo shell | `docker compose exec mongo mongosh -u spt -p --authenticationDatabase admin` |
| Backup DB | `docker compose exec -T mongo mongodump --archive -u spt -p "$MONGO_PASSWORD" --authenticationDatabase admin > backup.archive` |
| Restore DB | `docker compose exec -T mongo mongorestore --archive -u spt -p "$MONGO_PASSWORD" --authenticationDatabase admin < backup.archive` |
| Stop, keep data | `docker compose down` |
| Stop, **delete data** | `docker compose down -v` |
| Health | `docker compose ps` (shows healthy/unhealthy) |

---

## Using MongoDB Atlas instead of the bundled container

Set `MONGODB_URI` in `.env` to your Atlas SRV string. The API will use it and ignore the local Mongo. The `mongo` service still starts — comment it out of `docker-compose.yml` (and the `depends_on` block) if you don't want an idle container.

---

## Known rough edges in the app (not caused by containerizing)

| Issue | Where | Impact |
|---|---|---|
| CORS falls through to `callback(null, true)` for **every** origin | `server/server.js` | Harmless behind nginx (same origin). Becomes a real hole if you ever publish port 5000 directly. |
| `npm run seed` points at `seeds/seedData.js`, which doesn't exist | `server/package.json` | The script fails if run. Not referenced by any container. |
| No `engines` field | both `package.json` | Node version was unpinned; the images pin it to Node 20. |

---

## Exposing it from the homelab

nginx already terminates on port 80 inside the `client` container. Point a Cloudflare Tunnel at `http://localhost:8080` (or attach `cloudflared` to the `spt` network and target `http://client:80`) — no inbound ports needed. Set `CLIENT_URL` in `.env` to the public hostname.
