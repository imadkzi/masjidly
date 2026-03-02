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
  - Corrected Taraweeh window to use *today's* ʿIshā time.
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

