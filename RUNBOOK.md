# Deploy Smart Progress Tracker

## Overview

Deploys the three-container stack — `mongo` (MongoDB 7), `server` (Express API), `client` (Vite build served by nginx) — on a single Docker host with Docker Compose v2, using `docker-compose.yml`. nginx in the `client` container is the only published service; it serves the SPA and reverse-proxies `/api/` to `server:5000`, so the browser stays on one origin. Done means: `docker compose ps` shows all three containers `healthy`, `http://<HOST_IP>:8080/api/health` returns `"success": true`, and you can register a user and log a task in the browser.

```mermaid
flowchart LR
    B[Browser] -->|:8080| C[client / nginx]
    C -->|/api/ → :5000| S[server / Express]
    S -->|:27017| M[(mongo)]
    M --- V[(mongo-data volume)]
```

## Prerequisites

| Group | Requirement |
|---|---|
| Access | Shell on the Docker host with rights to run `docker` (root, or a user in the `docker` group) |
| Access | Outbound HTTPS from the host to Docker Hub (`mongo:7`, `node:20-alpine`, `nginx:1.27-alpine`) and `registry.npmjs.org` — both builds run `npm ci` |
| Infrastructure | CPU with AVX — MongoDB 5+ refuses to start without it. On a Proxmox VM this means CPU type `host` (or another AVX-capable model), not the default `kvm64`. Check: `grep -c avx /proc/cpuinfo` must be > 0 |
| Infrastructure | ~2 GB free disk for images plus the Mongo data volume; ~1 GB RAM free for the three containers |
| Infrastructure | TCP 8080 free on the host (or set `WEB_PORT` in `.env`) |
| Software | Docker Engine with the Compose **v2** plugin. `docker compose version` must print `v2.x` or later — the compose files use `depends_on: condition:` and `${VAR:?}`, which the legacy `docker-compose` v1 binary does not support |
| Software | `git`, `openssl` (for secret generation) |

## Ports and Firewall

| Port | Protocol | Direction | Source → Destination | Purpose |
|---|---|---|---|---|
| 8080 | TCP | Inbound | LAN / Cloudflare Tunnel → `client` container :80 | Web UI and `/api/` proxy. Only published port |
| 5000 | TCP | Internal | `client` → `server` | API. Not published; reachable only on the `spt` network |
| 27017 | TCP | Internal | `server` → `mongo` | Database. Not published |

Docker publishes ports through its own iptables/nftables chains and normally bypasses firewalld, so no rule is usually needed. If 8080 is unreachable from another machine on the LAN, open it:

```bash
sudo firewall-cmd --permanent --add-port=8080/tcp && sudo firewall-cmd --reload
```
<!-- verify: whether firewalld on this AlmaLinux host actually blocks Docker-published ports depends on its Docker/firewalld zone setup; test from another machine before adding the rule -->

## Installation

1. Clone the repo (first time only; later updates are in Operations).

   ```bash
   git clone https://github.com/IBatsios/smart-progress-tracker.git
   cd smart-progress-tracker
   ```

2. Create `.env` from the template. `.env` is gitignored, so `git pull` never touches it.

   ```bash
   cp .env.example .env
   ```

3. Generate the two required secrets and write them in. Use **hex** — a base64 password can contain `/`, which makes the `mongodb://` URI unparseable, and `$` is interpolated by Compose.

   ```bash
   sed -i "s|^MONGO_PASSWORD=.*|MONGO_PASSWORD=$(openssl rand -hex 24)|" .env
   sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$(openssl rand -hex 32)|" .env
   grep -E '^(MONGO_PASSWORD|JWT_SECRET)=' .env      # both must show a value
   ```

4. Confirm Compose accepts the config before building anything. This is the step that catches a bad `.env`.

   ```bash
   docker compose config --quiet && echo OK
   ```

5. Build the images and start the stack. First run pulls three base images and runs `npm ci` + `vite build`; expect several minutes. The `client` container stays in `Created` until `server` reports healthy (~20–30 s after Mongo is up).

   ```bash
   docker compose up -d --build
   ```
   <!-- verify: build time depends on the VM's CPU and link speed; not measured -->

6. Make the stack survive reboots. `restart: unless-stopped` is already set on every service; it only helps if the Docker daemon itself starts at boot.

   ```bash
   sudo systemctl enable --now docker
   ```

## Configuration

File: `.env` (read by Compose from the project directory only)

| Key | Default | Change when |
|---|---|---|
| `MONGO_PASSWORD` | *(empty — required)* | Always. Hex only |
| `JWT_SECRET` | *(empty — required)* | Always. Hex only. Changing it later invalidates every logged-in session |
| `WEB_PORT` | `8080` | 8080 is taken on the host |
| `CLIENT_URL` | `http://localhost:8080` | Only matters if you ever publish port 5000 directly; behind nginx the browser is same-origin and CORS never applies |
| `MONGODB_URI` | *(unset → bundled Mongo)* | Pointing the API at Atlas instead of the local container |
| `MONGO_USER`, `MONGO_DB`, `JWT_EXPIRE` | `spt`, `smart_progress_tracker`, `7d` | Rarely |

After any `.env` change: `docker compose up -d` (no rebuild needed — these are runtime variables, not build args).

## Verification

| # | Command | Expected | Proves |
|---|---|---|---|
| 1 | `docker compose ps` | `spt-mongo`, `spt-server`, `spt-client` all `Up … (healthy)` | All three healthchecks pass; nothing is crash-looping |
| 2 | `docker compose logs server \| grep -i connected` | `MongoDB Connected Successfully` | API authenticated to Mongo with the `.env` password |
| 3 | `curl -s http://localhost:8080/api/health` | JSON with `"success":true` and `"environment":"production"` | nginx → server proxy path works end to end |
| 4 | `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/tasks` | `200` | SPA fallback serves `index.html` for a client-side route |
| 5 | Browser from another machine: `http://<HOST_IP>:8080` → Register → log one task | Task appears on the dashboard | Full write path: browser → nginx → API → Mongo, and the port is reachable off-host |
| 6 | `docker compose exec mongo mongosh -u spt -p "$(grep ^MONGO_PASSWORD= .env \| cut -d= -f2)" --authenticationDatabase admin --quiet --eval 'db.getSiblingDB("smart_progress_tracker").users.countDocuments()'` | `1` (or the number of users you registered) | Data landed in the named volume, not somewhere ephemeral |

## Rollback

1. Stop the stack, keep the data. Reversible.

   ```bash
   docker compose down
   ```

2. Roll the application back to a previous commit and rebuild — the images are tagged `latest`, so a rebuild replaces them in place.

   ```bash
   git log --oneline -5
   git checkout <PREVIOUS_COMMIT>
   docker compose up -d --build
   ```

3. Restore the database from a backup taken in Operations, if the newer version changed the data.

   ```bash
   docker compose exec -T mongo mongorestore --drop --archive -u spt -p "$(grep ^MONGO_PASSWORD= .env | cut -d= -f2)" --authenticationDatabase admin < backup.archive
   ```

4. **Point of no return:** `docker compose down -v` deletes the `mongo-data` volume and every user, task and snapshot in it. Take a `mongodump` first (Operations → Backup). Removing the images (`docker rmi spt-server spt-client`) is safe — they rebuild from source.

## Operations

| Task | Command |
|---|---|
| Update to latest code | `git pull && docker compose up -d --build` — the `--build` is not optional; without it Compose reuses the stale image |
| Logs (follow) | `docker compose logs -f server` (or `client`, `mongo`) |
| Restart one service | `docker compose restart server` |
| Rebuild one service | `docker compose up -d --build server` |
| Mongo shell | `docker compose exec mongo mongosh -u spt -p --authenticationDatabase admin` (prompts for the password) |
| Backup DB | `docker compose exec -T mongo mongodump --archive -u spt -p "$(grep ^MONGO_PASSWORD= .env \| cut -d= -f2)" --authenticationDatabase admin > backup-$(date +%F).archive` |
| Restore DB | See Rollback step 3 |
| Reclaim disk after rebuilds | `docker image prune -f` |
| Stop, keep data | `docker compose down` |
| Stop, **delete data** | `docker compose down -v` |

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `docker compose up` exits immediately: `required variable MONGO_PASSWORD is missing a value: set MONGO_PASSWORD in .env` | No `.env`, or the key is empty | Installation steps 2–3 |
| `spt-server` restarts in a loop; `docker compose logs server` shows `MongoDB Connection Error: Invalid URL` or `Password contains unescaped characters` | `MONGO_PASSWORD` contains `/`, `@`, `:`, `#` or `?` — typical of a base64 secret | Regenerate with `openssl rand -hex 24`, then `docker compose down -v && docker compose up -d` (the Mongo root password is only set on first init of an empty volume) |
| Compose warns `The "xxx" variable is not set. Defaulting to a blank string.` at config time | `MONGO_PASSWORD` or `JWT_SECRET` contains `$` | Regenerate as hex, or escape every `$` as `$$` in `.env` |
| `spt-server` shows `Password contains unescaped characters`, `.env` looks fine, and the password in `docker compose config` starts with `# ` | An older `.env.example` had comments on the same line as an empty value; Compose read the comment as the value | Put comments on their own lines (current template already does), refill the value |
| `spt-client` sits in `Created` and never starts | It waits on `server`'s healthcheck (`/api/health`), which waits on Mongo's; one of them is failing | `docker compose ps` to find the unhealthy one, then its logs |
| `spt-mongo` exits within seconds, exit code 132 / `Illegal instruction` | Host CPU exposes no AVX (Proxmox `kvm64` CPU type) | Set the VM's CPU type to `host` in Proxmox and restart the VM |
| Changed `MONGO_PASSWORD` in `.env`, now `server` cannot authenticate | Mongo only applies `MONGO_INITDB_ROOT_PASSWORD` to an empty volume; the old password is still in the data | Either change it inside Mongo (`db.changeUserPassword`) or `docker compose down -v` and start fresh (destroys data) |
| UI loads but every API call fails; `curl localhost:8080/api/health` returns nginx 502 | nginx is up but `server` is not answering on 5000 | `docker compose logs server`; usually the Mongo URI or password |
| Ran `docker compose -f docker-compose.dev.yml up` on the VM and cannot reach 5173 from your workstation | Dev stack binds all ports to `127.0.0.1` on purpose | Use the production stack (`docker-compose.yml`) on the VM, or SSH-tunnel: `ssh -L 5173:localhost:5173 <VM>` |
