# syntax=docker/dockerfile:1
# ============================================
# Smart Progress Tracker - API (Express + Mongoose)
# ============================================

FROM node:20-alpine AS base
WORKDIR /app

# ---------- production dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---------- production runtime ----------
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=5000
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:5000/api/health || exit 1
CMD ["node", "server.js"]

# ---------- dev runtime (nodemon, all deps) ----------
FROM base AS dev
ENV NODE_ENV=development \
    PORT=5000
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npx", "nodemon", "server.js"]
