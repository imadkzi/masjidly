## 1.0.4 – 2026-03-06

- **Railway Nixpacks, multi-instance cron, cron docs fix, dark mode logo.**

### Added

- **Dark mode logo** – Masjid Setting now has `darkModeLogo`. When the display is in dark mode, the dark logo is shown if set; otherwise the light logo is inverted as before.

### Changed

- **Railway deployment**
  - Renamed `backend/Dockerfile` and `frontend/Dockerfile` to `Dockerfile.local` so Railway uses Nixpacks instead of Docker. Local Docker Compose unchanged; `docker-compose.yml` now references `Dockerfile.local`.

- **Announcement expiry cron**
  - GitHub Action supports `STRAPI_CRON_URLS` (comma-separated) for multiple Railway instances; falls back to `STRAPI_CRON_URL` for single instance.
  - README: Option B corrected to in-process Strapi cron (`CRON_ENABLED=true`), not Railway Cron Schedule (Railway does not run arbitrary curl commands).

- **Backend `.env.example`** – Added OpenSSL commands for generating secrets (`openssl rand -base64 32` for keys, `openssl rand -base64 24` for database password).

---

## 1.0.3 – 2026-03-04

- **Masjid settings, Ramadan settings, theming, PWA manifest, auto-start scripts, roadmap.**

### Added

- **Masjid setting (Strapi single type)** – per-masjid branding and UI configuration.
  - `masjidName` – masjid name (default `"Masjidly"`); used for page title, PWA manifest, `apple-mobile-web-app-title`.
  - `logo` – optional logo image(s).
  - `showMasjidName` – toggle to show or hide masjid name in header.
  - `themePreset` – colour preset: `default`, `green`, `blue`, `purple`, `amber`, `copper`, or `custom`.
  - `customPrimaryColor` – custom hex colour when `themePreset` is `custom`.
  - `showDayLabels` – toggle to show "Today"/"Tomorrow" labels in prayer timetable.

- **Ramadan setting (Strapi single type)** – Ramadan-specific behaviour.
  - `taraweehDuaDurationMins` – configurable duration (default 90 mins) for the Taraweeh duʿā window after ʿIshā Jamāt.
  - `taraweehDuaImage` – optional custom image (falls back to built-in asset if not set).
  - `showRamadanBanner` – toggle to show or hide the Ramadan banner (Sehri/Iftar times) during Ramadan.

- **Frontend composables**
  - `useMasjidBranding` – applies masjid name to document title, PWA manifest (`name`, `short_name`), and `apple-mobile-web-app-title`.
  - `useMasjidSettings` – fetches masjid-setting; provides theme preset, custom colour, logo, day labels.
  - `useRamadanSettings` – fetches ramadan-setting; provides taraweeh duration, banner visibility, image.
  - `useThemePreset` – applies theme preset and custom colour from masjid-setting.
  - `ThemeToggle` component for manual light/dark switching.

- **Auto-start on boot**
  - `scripts/start-windows.ps1`, `scripts/start-windows.bat`, `scripts/start-unix.sh` – run `docker compose up -d` and open frontend + admin in browser.
  - Documentation for Task Scheduler (Windows), launchd (macOS), and systemd/cron (Linux) in `DOCKER.md`.

### Changed

- **Taraweeh duʿā**
  - Duration now configurable via `ramadan-setting` (was hardcoded 90 mins).
  - Image now from Strapi when set; otherwise uses built-in fallback.

- **Ramadan banner**
  - Visibility controlled by `showRamadanBanner` in ramadan-setting.

- **PWA and page title**
  - Document title, PWA manifest name/short_name, and apple-mobile-web-app-title now use masjid name from `masjid-setting`.

- **Documentation**
  - Updated `README.md` with masjid branding and Ramadan settings features; added Strapi content types section.
  - Updated `DOCKER.md` with API token permissions for `masjid-setting` and `ramadan-setting`; added §10 auto-start on boot.
  - Updated `ROADMAP.md`: Phase 2 (per‑masjid configuration) marked done; admin users and password reset moved to Phase 1 as pre-ship requirement.

---

## 1.0.2 – 2026-03-03

- **Ops/cron improvements for announcements.**

### Changed

- **Announcement expiry cadence**
  - Run the Strapi `announcement.deleteExpired` job more reliably by:
    - Tweaking the in‑process cron cadence.
    - Adding an HTTP endpoint (`POST /api/internal/cron/announcements-expiry`) that can be triggered by Railway’s Cron Schedule using a shared `CRON_SECRET`.
- **Docs and env templates**
  - Documented Docker/Railway cron behaviour and configuration in `README.md` and `DOCKER.md`.
  - Updated `backend/.env.example` and backend README to include `CRON_ENABLED` and `CRON_SECRET` guidance.

---

## 1.0.1 – 2026-03-02

- **Infrastructure and Docker improvements.**

### Fixed

- **Strapi Docker secrets stability**
  - Persist Strapi internal secrets (`APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`) to a dedicated `backend_secrets` volume so they are stable across container rebuilds and restarts.
  - Ensure the Strapi Admin API token used by the frontend remains valid across backend restarts, as long as Docker volumes (`postgres_data`, `backend_secrets`) are not deleted.

### Changed

- **Docker developer experience**
  - Updated `DOCKER.md` to document secrets persistence and to recommend rebuilding the frontend with `docker compose build --no-cache frontend && docker compose up -d frontend` so the backend is not unnecessarily recreated.

---

## 1.0.0 – 2026-02-23

- **Major update over previous masjidly instance**, covering all changes since commit `60b0532b84976676e9bac52e92ebfb8d749f83a2`.

### Added

- **Prayer-aware theming and timetable UX**
  - Automatic light/dark theme that follows prayer times, with a full time simulator for debugging midnight behaviour.
  - Per-prayer "Today/Tomorrow" labels in the timetable, including Jummah-specific labelling and layout refinements.
  - Enlarged next-prayer card typography and improved hierarchy for TV display readability.

- **Announcements and Ramadan experience**
  - Ramadan banner with support for a Taraweeh duʿā slide and conditional display logic.
  - Rich announcement slideshow fed from Strapi, with configurable background colours.

- **Data import/export and backend features**
  - CSV import/export for `salaah-time` using `strapi-csv-import-export` and Tablify.
  - Announcement expiry via `enddate` field and a Strapi cron job that deletes expired announcements nightly.

- **Deployment and local development**
  - Dockerised local stack for Postgres, Strapi 5, and Vue (served via Nginx), plus fixes for frontend token handling and image URL resolution inside Docker.

### Changed

- **Timetable and header UI**
  - Reworked timetable layout, fonts, and responsive behaviour (including 1440px-specific tweaks) to avoid squashing and truncation.
  - Refined Jummah row naming and styling, with a dedicated Jummah font size.
  - Header reordered to logo → time → date, with Hijri stacked under Gregorian and unified date sizing.
  - Logo container text made larger and bolder to read well on TV screens.

- **Visual polish**
  - Adjusted mobile font sizes across timetable and banner components, including Taraweeh duʿā and Ramadan banner.
  - Updated favicon and several iterative styling passes to improve overall legibility on large and small displays.

### Fixed

- **Prayer time logic and timetable behaviour**
  - Corrected Taraweeh window to use _today's_ ʿIshā time.
  - Fixed day-label font sizes and overflow issues in the timetable (especially with "Today/Tomorrow" labels and at 1440px widths).

- **Data imports and Strapi configuration**
  - Normalised `salaah-time` CSV inputs in Strapi lifecycles (handling `"null"`, `N/A`, empty strings, and various time formats) and added CRLF-aware column handling.
  - Migrated `users-permissions` to the Strapi 5 plugin and resolved related dependency issues.

### Tooling, docs, and ops

- **Infrastructure and logging**
  - Standardised on **Node 20.x** and **npm ≥10** for both frontend and backend.
  - Added configurable logging for prayer-time and announcement fetches (controlled via `VITE_ENABLE_SERVER_LOGS`) plus clearer midnight refresh logging.

- **Documentation**
  - Updated root, frontend, and backend READMEs in British English, reflecting current environment variables, Strapi configuration, and deployment flow.
  - Added a project `ROADMAP.md` and marked timetable CSV robustness and announcement reliability work as complete.
