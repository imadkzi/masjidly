# Masjidly Roadmap

This roadmap focuses on making Masjidly easy to run in any masjid, with reliable timetables, clear announcements, and a TV‑friendly UI.

---

## Phase 1 – Stability and admin confidence (short term)

- **Timetable robustness**
  - Add **data sanity checks** on imported rows (e.g. required times present where expected, no obviously incorrect ordering such as Asr earlier than Zuhr), and surface any issues in logs or the admin UI.

- **Announcements reliability**
  - Add modest retry / error handling in the announcements component so temporary API issues do not leave the screen blank.

---

## Phase 2 – Announcements v2 (richer cards)

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

## Phase 3 – Per‑masjid configuration

- **`masjid-settings` single type (Strapi)**
  - Store high‑level settings:
    - Masjid name, logo, timezone.
    - Whether to show Today/Tomorrow labels.
    - Whether to show the Ramadan banner.
    - Announcement rotation duration and similar options.

- **Frontend configuration layer**
  - Add a composable/store (e.g. `useMasjidSettings`) that:
    - Fetches `/api/masjid-settings` on start.
    - Exposes simple flags/values (`showDayLabels`, `showRamadanBanner`, `rotationSeconds`, etc.) to components.
  - Reduce use of hard‑coded values or env flags in favour of configuration.

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

