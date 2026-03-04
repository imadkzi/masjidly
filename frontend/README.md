# Masjidly Frontend (Vue 3 + Vite)

This is the TV‑optimised frontend for **Masjidly**. It renders:

- The daily **prayer timetable** with current/next prayer highlighting and optional Today/Tomorrow labels.
- **Next prayer** card and Ramadan banner (Sehri/Iftar times during Ramadan).
- A rotating **announcements** section sourced from the Strapi backend.

The UI is designed for large displays (e.g. a smart TV browser).

---

## Local development

From the `frontend` directory:

```bash
npm install

# Run the dev server
npm run dev

# Build for production
npm run build

# Run unit tests (Vitest)
npm run test
```

By default, Vite serves the app at `http://localhost:5173`.

---

## Environment variables

See **`frontend/.env.example`** for the full list. Key ones:

```bash
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=...

```

- `VITE_STRAPI_URL` – Base URL of the Strapi backend (without `/api`).
- `VITE_STRAPI_API_TOKEN` – Strapi API token used by the frontend to fetch data.
- `showDayLabels (Strapi)` – Configure in Strapi Admin → Masjid Setting. When enabled, timetable rows show “Fajr Today”, “Zuhr Tomorrow”, etc.

---

## Notes

- The frontend assumes the Strapi backend exposes:
  - `/api/salaah-times` (daily timetable)  
  - `/api/announcements` (TV announcements)
- Prayer‑based theming (light/dark around Fajr/Maghrib) and Ramadan banner logic live in composables:
  - `src/composables/usePrayerTheme.js`
  - `src/composables/useRamadanTimes.js`
