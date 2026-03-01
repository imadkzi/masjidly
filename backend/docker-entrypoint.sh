#!/bin/sh
set -e

# Auto-generate Strapi secrets if not set (so Docker can run without backend/.env)
# Use Node crypto (openssl not available in node:alpine)
generate_secret() {
  if [ -z "$(eval "echo \$$1")" ]; then
    export "$1=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
    echo "Generated $1"
  fi
}

generate_secret "API_TOKEN_SALT"
generate_secret "ADMIN_JWT_SECRET"
generate_secret "TRANSFER_TOKEN_SALT"
generate_secret "JWT_SECRET"

if [ -z "$APP_KEYS" ]; then
  export APP_KEYS="$(node -e "const c=require('crypto');console.log([1,2,3,4].map(()=>c.randomBytes(32).toString('base64')).join(','))")"
  echo "Generated APP_KEYS"
fi

# Wait for Postgres to be ready (used by docker-compose)
if [ -n "${DATABASE_HOST}" ]; then
  echo "Waiting for Postgres at ${DATABASE_HOST}:${DATABASE_PORT:-5432}..."
  while ! node -e "
    const net = require('net');
    const s = net.createConnection(process.env.DATABASE_PORT || 5432, process.env.DATABASE_HOST, () => { s.destroy(); process.exit(0); });
    s.on('error', () => process.exit(1));
    s.setTimeout(5000, () => { s.destroy(); process.exit(1); });
  " 2>/dev/null; do
    sleep 2
  done
  echo "Postgres is up."
fi

exec "$@"
