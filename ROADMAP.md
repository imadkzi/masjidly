# Masjidly Roadmap

This roadmap focuses on making Masjidly easy to run in any masjid, with reliable timetables, clear announcements, and a TV‑friendly UI.

---

## Deployment – Two instances

Masjidly can be shipped in two ways:

| Instance | Backend (Strapi + DB) | Frontend |
|----------|------------------------|----------|
| **Cloud** | Railway (Strapi + Postgres) | Netlify |
| **Local** | Docker (backend, Postgres, frontend) | Docker |

- **Cloud**: Deploy Strapi and Postgres on Railway, frontend on Netlify. Announcement expiry cron runs via GitHub Actions at midnight UTC.
- **Local**: Use Docker Compose for a full stack. Strapi in‑process cron handles announcement expiry when `CRON_ENABLED=true`.

---

## Phase 1 – Stability and admin confidence (short term)

- **Timetable robustness** ✓ done
  - Lifecycle hooks normalise CSV imports (e.g. `"null"` strings from Google Sheets → `null`), avoiding invalid time format errors.
  - *(Future)* Data sanity checks on imported rows (required times present, no incorrect ordering), surfaced in logs or admin UI.

- **Announcements reliability** ✓ done
  - Announcement expiry cron: GitHub Actions (Cloud) or Strapi in‑process (Docker) delete expired announcements at midnight.
  - Frontend refetches at 00:10 local time.
  - Error handling and optional logging in the announcements component.
  - *(Future)* Retry logic for temporary API issues.

- **Admin users and password reset (non-tech-friendly)** – required before ship
  - Replace expensive SendGrid with free Brevo SMTP for admin invite and forgot-password emails (300 emails/day free).
  - Add reset-link helper page for when email is not configured: Super Admin visits `/api/internal/admin-reset-link/form`, enters email + secret, copies link, shares via WhatsApp. Works for Docker and Railway.

---

## Phase 2 – Per‑masjid configuration ✓ done (core)

With Cloud and Local deployment, each masjid runs its own instance. Per‑masjid settings avoid repeated env changes and make admin easier.

- **`masjid-settings` single type (Strapi)** ✓ done
  - Store high‑level settings:
    - Masjid name, logo ✓
    - Whether to show Today/Tomorrow labels ✓
    - Whether to show the Ramadan banner ✓ (via `ramadan-setting` single type)
    - *(Future)* Timezone.
    - *(Future)* Announcement rotation duration and similar options.

- **`ramadan-settings` single type (Strapi)** ✓ done
  - Taraweeh dua duration, image; show Ramadan banner.

- **Frontend configuration layer** ✓ done
  - `useMasjidSettings` fetches `/api/masjid-setting` on start; exposes masjidName, logo, themePreset, customPrimaryColor, showDayLabels.
  - `useRamadanSettings` fetches `/api/ramadan-setting`; exposes taraweehDuaDurationMins, taraweehDuaImage, showRamadanBanner.
  - `useMasjidBranding` applies masjid name to page title, PWA manifest, apple-mobile-web-app-title.
  - *(Future)* `rotationSeconds` from Strapi.

---

## Phase 3 – Announcements v2 (richer cards)

- **Richer announcement model in Strapi**
  - Extend the `announcement` content type to support:
    - `title`, `body`, optional `cta_label` / `cta_url`.
    - `variant` (image‑only, image‑left, text‑only, image‑background).
    - `theme` (info / warning / event / default).
    - `startdate`, `enddate`, `pin`, `priority`.

- **AnnouncementCard component**
  - Build a reusable card component in the frontend that renders layouts based on `variant` and `theme`.
  - Update `News.vue` to:
    - Filter by `startdate`/`enddate`.
    - Respect `pin` and `priority` when ordering cards.

- **Admin UX**
  - Provide a handful of “templates” (event poster, simple notice, recurring class) documented in the README.
  - Optionally add a basic preview in Strapi so admins can see roughly how a card will look on the TV.

---

## Phase 4 – Offline‑friendly and observability

- **Offline‑resilient TV client**
  - Cache the last successful timetable and announcements locally (e.g. `localStorage` / IndexedDB).
  - On load, display cached data immediately, refresh in the background, and show a subtle “last updated” indicator.

- **Status / diagnostics**
  - Add an internal status view (or JSON endpoint) showing:
    - Last timetable import date and number of days.
    - Last successful announcement fetch on the frontend.
    - Last announcement‑expiry cron run and how many records were deleted.
  - Use this to aid debugging in production and give admins confidence that the system is healthy.

---

## Phase 5 – Layouts and multi‑screen support (longer term)

- **Alternative layouts**
  - Support additional display layouts (e.g. timetable‑only, full‑screen announcements, different grid ratios).
  - Choose layout via configuration (later via `masjid-settings`).

- **Multiple screens**
  - Allow defining multiple “screens” (e.g. Main Hall, Sisters’ Hall) with:
    - Their own layout.
    - Their own announcement filters (e.g. children’s activities on a particular screen).

These phases are intentionally broad; each can be broken down into smaller tickets as work begins. The priority ordering can be adjusted as real‑world usage highlights which areas matter most.

