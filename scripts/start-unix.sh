#!/usr/bin/env bash
# Masjidly – Auto-start Docker and open browser (macOS / Linux)
# Run at login via launchd (Mac) or systemd/cron (Linux).
# Requires: Docker Desktop (Mac) or Docker daemon (Linux) to start on boot

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Wait for Docker to be ready
for i in $(seq 1 60); do
    if docker info >/dev/null 2>&1; then break; fi
    sleep 5
    if [ "$i" -eq 60 ]; then
        echo "Docker did not become ready in time."
        exit 1
    fi
done

docker compose up -d
sleep 10

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:3000"
    open "http://localhost:1337/admin"
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:3000"
    xdg-open "http://localhost:1337/admin"
fi
