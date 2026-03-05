# Masjidly – Auto-start Docker and open browser (Windows)
# Run at login via Task Scheduler for "start on boot" behaviour.
# Requires: Docker Desktop set to "Start when you sign in"

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

# Wait for Docker to be ready (Docker Desktop starts after login)
$maxAttempts = 60
$attempt = 0
while ($attempt -lt $maxAttempts) {
    $result = docker info 2>$null
    if ($LASTEXITCODE -eq 0) { break }
    Start-Sleep -Seconds 5
    $attempt++
}
if ($attempt -ge $maxAttempts) {
    Write-Host "Docker did not become ready in time. Start Docker Desktop manually and run: docker compose up -d"
    exit 1
}

# Start stack
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "docker compose up failed"
    exit 1
}

# Brief delay for containers to bind ports
Start-Sleep -Seconds 10

# Open browser tabs
Start-Process "http://localhost:3000"      # Frontend
Start-Process "http://localhost:1337/admin" # Strapi Admin
