# syntax=docker/dockerfile:1
# ============================================
# Smart Progress Tracker - Web (Vite/React -> nginx)
# ============================================

FROM node:20-alpine AS base
WORKDIR /app

# ---------- build the static bundle ----------
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Leave empty so src/services/api.js falls back to the relative "/api",
# which nginx proxies to the API container (same-origin, no CORS).
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- production runtime ----------
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]

# ---------- dev runtime (vite dev server + HMR) ----------
FROM base AS dev
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
