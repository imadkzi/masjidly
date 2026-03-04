# Masjidly – Docker setup (offline / local PC)

This setup runs the full Masjidly stack (Strapi backend, Vue frontend, Postgres) with Docker. **Backend secrets** are auto-generated, the **frontend API URL** is set from `PUBLIC_URL`, and **storage defaults to local**. The **Strapi API token** is not automatic—create it in Strapi Admin and put it in **`.strapi_token`** (see §5). Masjid branding and Ramadan settings are configured in Strapi Admin (**Masjid Setting** and **Ramadan Setting** single types).

---

## 1. Install Docker

You need **Docker Desktop** (includes Docker Engine and Docker Compose). Install for your OS, then start Docker Desktop before running any commands below.

### Mac

1. **Download:** [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
   - Choose **Apple Silicon** or **Intel** depending on your Mac.
2. Open the downloaded `.dmg`, drag **Docker** into **Applications**.
3. Open **Docker** from Applications. Accept the terms and finish setup.
4. Wait until the whale icon in the menu bar is steady (Docker is running).

### Windows

1. **Download:** [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - Needs **WSL 2** (Windows Subsystem for Linux). The installer can enable it for you if needed.
2. Run the installer and follow the steps (restart if asked).
3. Start **Docker Desktop** from the Start menu.
4. Wait until it says “Docker Desktop is running” in the system tray.

**Check it works:** Open a terminal (Mac) or PowerShell (Windows) and run:

```bash
docker --version
docker compose version
```

Both should print a version. Then you’re ready for the one-time setup below.

---

## 2. One-time setup

From the **project root**:

```bash
copy .env.example .env
copy .strapi_token.example .strapi_token
```

(Mac/Linux: `cp .env.example .env` and `cp .strapi_token.example .strapi_token`)

Edit **`.env`** (in the project root):

- Set **`POSTGRES_PASSWORD`** (e.g. use a random string, or see **Generating secrets** below).
- Set **`CRON_ENABLED`** to `true` or `false` (enables Strapi cron tasks; default `false`).
- Set **`VITE_ENABLE_SERVER_LOGS`** to `true` or `false` if you want to override the default (default `false`; used when the frontend image is built).
- Optionally set **`PUBLIC_URL`** if the backend will be at a different URL (default `http://localhost:1337`).
- **API token:** This cannot be auto-generated. After the first run, create an API token in **Strapi Admin** (Settings → API Tokens) and put it in **`.strapi_token`** (see §5).

You do **not** need to create `backend/.env` or `frontend/.env` for Docker. Backend secrets are generated automatically. The frontend API URL comes from `PUBLIC_URL`. The API token goes in **`.strapi_token`** (copy from `.strapi_token.example` before first build so the file exists).

**How frontend env works:** Vite (the frontend build tool) only loads a file named **`.env`** in the frontend folder. There is no separate “.env.frontend” that gets read. For **Docker**, we build the frontend image with values from the root `.env` and the Dockerfile writes a **`.env`** inside the container. For **local dev**, copy `frontend/.env.frontend.example` to **`frontend/.env`** so Vite picks it up. So in both cases the file that is actually used is **`.env`**; `.env.frontend.example` is just the template (the name is to distinguish it from the backend’s `.env`).

**Generating secrets**  
To generate random values for `POSTGRES_PASSWORD` or other secrets:

- **PowerShell (Windows):**  
  Hex-like string: `-join ((48..57) + (97..102) | Get-Random -Count 32 | ForEach-Object { [char]$_ })`  
  Base64: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])`
- **Node (any OS, e.g. Mac/Linux or inside Docker):**  
  `docker run --rm node:alpine node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`  
  Run multiple times for `APP_KEYS` (comma-separate the outputs), or once per secret.

---

## 3. Build and run

From the project root:

```bash
docker compose up -d --build
```

- **Frontend:** http://localhost:3000
- **Backend (Strapi):** http://localhost:1337
- **Strapi Admin:** http://localhost:1337/admin (create admin user on first run)

---

## 4. What’s automated

| Item                 | Behaviour                                                                                                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend secrets**  | If `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, or `JWT_SECRET` are not set, the backend entrypoint generates them (using Node) and persists them to a `backend_secrets` volume so the app can start without `backend/.env` and keep working across restarts. |
| **Frontend API URL** | Set at build time from **`PUBLIC_URL`** in the root `.env` (default `http://localhost:1337`). The frontend is built with this so the browser talks to your backend.                                                        |
| **Strapi API token** | **Not automatic.** Create in Strapi Admin, put in `.strapi_token`, then rebuild frontend.                                                                 |
| **Storage (Docker)** | Backend runs with **`STORAGE_PROVIDER=local`** by default. Uploads go to the `backend_uploads` volume (`./public/uploads` in the container).                                                                               |

---

## 5. API token (required for frontend to fetch data)

The Strapi API token is **only** created in the admin panel; it cannot be generated by Docker. Do this after the first run:

1. Open **Strapi Admin**: http://localhost:1337/admin and sign in.
2. Go to **Settings → API Tokens** (or **Settings → Users & Permissions → Roles → Public**) and create or configure a token so the frontend can fetch:
   - **masjid-setting** (find) – masjid name, logo, theme, day labels
   - **ramadan-setting** (find) – Taraweeh duration, image, Ramadan banner
   - **announcements** (find), **salaah-times** (find)
3. Put the token in the build secret file (project root):  
   `echo "paste_token_here" > .strapi_token`  
   Or from root `.env`:  
   `grep VITE_STRAPI_API_TOKEN .env | cut -d= -f2- > .strapi_token`
4. Rebuild the frontend (image only) and restart it:  
   `docker compose build --no-cache frontend && docker compose up -d frontend`

---

## 6. Optional: use Cloudinary

To use Cloudinary instead of local storage:

1. In root **`.env`** set:  
   `STORAGE_PROVIDER=cloudinary`
2. Create **`backend/.env`** (or use existing) with:
   - `CLOUDINARY_CLOUD_NAME=...`
   - `CLOUDINARY_API_KEY=...`
   - `CLOUDINARY_API_SECRET=...`
3. Restart backend:  
   `docker compose up -d backend`

(Compose uses `backend/.env` if present; `required: false` so the file is optional.)

---

## 7. How the frontend talks to the backend

- The **browser** loads the app from http://localhost:3000 and calls the API using the URL baked into the frontend at **build** time.
- That URL is **`PUBLIC_URL`** from the root `.env` (default `http://localhost:1337`).
- The backend container port is mapped to the host, so the browser reaches it at `http://localhost:1337`. No need to use the container name in the frontend.

---

## 8. Local uploads (offline mode)

With `STORAGE_PROVIDER=local` (default in Docker):

- Files are stored in the **`backend_uploads`** volume (container path `/app/public/uploads`).
- They persist across restarts. To backup:  
  `docker cp masjidly-backend:/app/public/uploads ./backup-uploads`

---

## 9. Manual secret generation (non-Docker)

If you run the backend **without** Docker, copy `backend/.env.example` to `backend/.env` and set secrets yourself. Generate random base64 values with Node (run multiple times for `APP_KEYS`, comma-separated):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 10. Quick reference

| Goal                            | Action                                                                                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Run offline                     | Set `POSTGRES_PASSWORD` and `CRON_ENABLED` (true/false) in root `.env`, then `docker compose up -d --build`.                                                |
| Enable/disable cron             | Set `CRON_ENABLED=true` or `false` in root `.env`, then restart: `docker compose up -d backend`.                                                            |
| Frontend options (logs) | Set `VITE_ENABLE_SERVER_LOGS` to `true` or `false` in root `.env`, then rebuild: `docker compose up -d --build frontend`. |
| API token for frontend          | Create in Strapi Admin (Settings → API Tokens), add as `VITE_STRAPI_API_TOKEN` in root `.env`, then `docker compose up -d --build frontend`.                |
| Set API URL                     | Set `PUBLIC_URL` in root `.env`, then rebuild: `docker compose up -d --build frontend`.                                                                     |
| Use local storage               | Do nothing (default in Docker is `STORAGE_PROVIDER=local`).                                                                                                 |
| Use Cloudinary                  | Set `STORAGE_PROVIDER=cloudinary` in root `.env` and set `CLOUDINARY_*` in `backend/.env`, then restart backend.                                            |
| Stop                            | `docker compose down`. Remove data: `docker compose down -v`.                                                                                               |
