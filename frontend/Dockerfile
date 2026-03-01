# Masjidly Frontend (Vue 3 + Vite) - build then serve with Nginx
# Non-secret build args: VITE_STRAPI_URL, VITE_ENABLE_SERVER_LOGS, VITE_SHOW_PRAYER_DAY_LABELS
# Token is passed as a build secret (file) so it never appears in image layers or ARG/ENV.
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_STRAPI_URL=http://localhost:1337
ARG VITE_ENABLE_SERVER_LOGS=false
ARG VITE_SHOW_PRAYER_DAY_LABELS=false

COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

# Build .env: token from secret mount (no ARG/ENV for token); other vars from ARG
# If .env.frontend exists (local override), use it; else create from args + secret
RUN --mount=type=secret,id=strapi_token \
  if [ -f .env.frontend ]; then \
    cp .env.frontend .env; \
  else \
    TOKEN=$(cat /run/secrets/strapi_token 2>/dev/null || true); \
    printf 'VITE_STRAPI_URL=%s\nVITE_STRAPI_API_TOKEN=%s\nVITE_ENABLE_SERVER_LOGS=%s\nVITE_SHOW_PRAYER_DAY_LABELS=%s\n' \
      "${VITE_STRAPI_URL}" "${TOKEN}" "${VITE_ENABLE_SERVER_LOGS}" "${VITE_SHOW_PRAYER_DAY_LABELS}" > .env; \
  fi
RUN npm run build

# Serve with Nginx
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
