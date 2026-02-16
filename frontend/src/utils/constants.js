// Shared configuration constants for the frontend

// Slideshow delay between slides (News component)
export const SLIDESHOW_DELAY_MS = 10000;

// How often the prayer/timetable logic ticks
export const PRAYER_TICK_INTERVAL_MS = 1000;

// Grace period after a prayer time (in seconds) before we consider it "passed"
export const SEEN_PRAYER_GRACE_SECONDS = 300; // 5 minutes

// How often to check if it's Ramadan (optimized - Ramadan doesn't change every second)
export const RAMADAN_CHECK_INTERVAL_MS = 60000; // 1 minute

// Layout constants
export const LAYOUT = {
  MAX_WIDTH: 1920, // px
  HEADER_HEIGHT_OFFSET: 135, // px - used in calc(100vh - 135px)
  GRID_GAP_SMALL: 16, // px
  GRID_GAP_LARGE: 24, // px
  PANEL_PADDING_DEFAULT: { x: 22, y: 20 }, // px
  PANEL_PADDING_LARGE: { x: 24, y: 22 }, // px
  PANEL_PADDING_NEWS: 12, // px
  PANEL_PADDING_NEWS_LARGE: 16, // px
  PANEL_PADDING_TIMETABLE: { x: 16, y: 12 }, // px
  SHELL_PADDING: { top: 8, right: 8, bottom: 16, left: 8 }, // px
  SHELL_MARGIN: { top: 12, bottom: 8 }, // px
};

// Prayer name constants
export const PRAYER_NAMES = {
  FAJR: "Fajr",
  SUNRISE: "Sunrise",
  SEHRI_END: "Sehri End",
  ZUHR: "Zuhr",
  ASR: "Asr",
  MAGHRIB: "Maghrib",
  ISHA: "Isha",
  JUMMAH: "Jummah",
};

// Breakpoint constants (matching SCSS variables)
export const BREAKPOINTS = {
  MOBILE: 600, // px
  TABLET: 768, // px
  DESKTOP: 1024, // px
  LARGE: 1280, // px
};
