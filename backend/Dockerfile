# Masjidly Backend (Strapi v5) - works with Node 20
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Build Strapi admin
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Production image
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 strapi
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/config ./config
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh \
  && mkdir -p public/uploads database/migrations .tmp \
  && chown -R strapi:nodejs public/uploads database .tmp
USER strapi
EXPOSE 1337
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npx", "strapi", "start"]
