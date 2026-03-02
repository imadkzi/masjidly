#!/bin/sh
set -e

# Auto-generate Strapi secrets if not set (so Docker can run without backend/.env)
# Use Node crypto (openssl not available in node:alpine)
# Persist generated secrets to a volume-backed file so they are stable across container recreations.

SECRETS_DIR="/app/runtime-secrets"
SECRETS_FILE="${SECRETS_DIR}/secrets.env"

generate_secret() {
  if [ -z "$(eval "echo \$$1")" ]; then
    export "$1=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"
    echo "Generated $1"
  fi
}

# 1) If secrets file exists, load it and export values
if [ -f "${SECRETS_FILE}" ]; then
  # shellcheck disable=SC1090
  set -a
  . "${SECRETS_FILE}"
  set +a
  echo "Loaded Strapi secrets from ${SECRETS_FILE}"
fi

# 2) Generate any missing secrets (first run, or when not provided via env_file)
generate_secret "API_TOKEN_SALT"
generate_secret "ADMIN_JWT_SECRET"
generate_secret "TRANSFER_TOKEN_SALT"
generate_secret "JWT_SECRET"

if [ -z "$APP_KEYS" ]; then
  export APP_KEYS="$(node -e "const c=require('crypto');console.log([1,2,3,4].map(()=>c.randomBytes(32).toString('base64')).join(','))")"
  echo "Generated APP_KEYS"
fi

# 3) If secrets file does not exist yet, persist the effective secrets once
if [ ! -f "${SECRETS_FILE}" ]; then
  mkdir -p "${SECRETS_DIR}"
  cat > "${SECRETS_FILE}" <<EOF
API_TOKEN_SALT=${API_TOKEN_SALT}
ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
TRANSFER_TOKEN_SALT=${TRANSFER_TOKEN_SALT}
JWT_SECRET=${JWT_SECRET}
APP_KEYS=${APP_KEYS}
EOF
  echo "Persisted Strapi secrets to ${SECRETS_FILE}"
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
