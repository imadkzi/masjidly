# Masjidly Backend (Strapi)

This is the Strapi backend for **Masjidly**. It provides:

- Content APIs for:
  - `salaah-time` – normalized daily prayer timetable used by the TV frontend.
  - `announcement` – image‑based announcements with optional expiry (`enddate`).
- A nightly **announcement expiry cron** (deletes announcements whose `enddate` is in the past).
- Support for importing timetables from Google Sheets/CSV via **Tablify**, with backend
  normalization of time fields.

---

## Local development

From the `backend` directory:

```bash
npm install

# Run Strapi in dev mode with file watching
npm run develop

# Build the admin panel
npm run build

# Start Strapi in production mode (after build)
npm run start
```

Strapi runs at `http://localhost:1337` by default.

---

## Environment variables

An example configuration lives in **`backend/.env.example`**.

Key variables (non‑exhaustive):

- Database:
  - `DATABASE_CLIENT`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`,
    `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- Strapi secrets:
  - `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`
- Server:
  - `HOST`, `PORT`
- Cloudinary:
  - `CLOUDINARY_KEY`, `CLOUDINARY_NAME`, `CLOUDINARY_SECRET`
- Cron:
  - `CRON_ENABLED=true` – enables Strapi cron jobs (including announcement expiry).

Refer to the root `README.md` for more detailed deployment notes.

---

## Timetable import (Tablify + lifecycles)

Timetables are imported from Google Sheets as CSV via **Tablify** into the `salaah-time`
collection. To be more forgiving with sheet exports, we normalize time fields in
`src/api/salaah-time/content-types/salaah-time/lifecycles.js`:

- Accepts `HH:mm`, `HH:mm:ss`, or `HH:mm:ss.SSS` and normalizes to `HH:mm:ss.SSS`.
- Treats `"null"`, `"N/A"`, and empty strings as `null`.

This prevents imports from failing due to minor formatting differences in the CSV.***
