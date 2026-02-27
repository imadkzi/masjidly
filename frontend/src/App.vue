<script setup>
import SalaahView from "./views/SalaahView.vue";
import Date from "./components/Date.vue";
import News from "./components/News.vue";
import ErrorBoundary from "./components/ErrorBoundary.vue";
import { usePrayerTheme } from "./composables/usePrayerTheme";

const { isDark, toggleTheme } = usePrayerTheme();
const showDayLabels = import.meta.env.VITE_SHOW_PRAYER_DAY_LABELS === "true";
</script>

<template>
  <ErrorBoundary>
    <div class="tv-shell">
      <button
        @click="toggleTheme"
        class="theme-toggle"
        type="button"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <span class="theme-toggle__icon" aria-hidden="true">
          <svg
            v-if="isDark"
            class="theme-toggle__svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg
            v-else
            class="theme-toggle__svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
        <span class="theme-toggle__label">{{ isDark ? "Light" : "Dark" }}</span>
      </button>
      <header class="tv-shell__header" role="banner">
        <Date />
      </header>

      <main class="tv-shell__main" role="main">
        <section class="tv-shell__grid">
          <div
            class="tv-shell__panel tv-shell__panel--timetable"
            role="region"
            aria-label="Prayer times"
          >
            <SalaahView :show-day-labels="showDayLabels" />
          </div>
          <div
            class="tv-shell__panel tv-shell__panel--news"
            role="region"
            aria-label="Announcements"
          >
            <News />
          </div>
        </section>
      </main>
    </div>
  </ErrorBoundary>
</template>

<style lang="scss">
@import "./styles/stylesetter";

$layout-max-width: 1920px;
$layout-header-height-offset: 135px;
$layout-grid-gap-small: 16px;
$layout-grid-gap-large: 24px;
$layout-panel-padding-default-y: 20px;
$layout-panel-padding-default-x: 22px;
$layout-panel-padding-large-y: 22px;
$layout-panel-padding-large-x: 24px;
$layout-panel-padding-news: 12px;
$layout-panel-padding-news-large: 16px;
$layout-panel-padding-timetable-y: 12px;
$layout-panel-padding-timetable-x: 16px;
$layout-shell-padding-top: 8px;
$layout-shell-padding-right: 8px;
$layout-shell-padding-bottom: 0;
$layout-shell-padding-left: 8px;
$layout-shell-main-gap: 10px;

.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 16px;
  border-radius: 9999px;
  border: 1px solid var(--color-panel-border);
  background: var(--color-panel-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px 0 var(--color-panel-shadow);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px 0 var(--color-panel-shadow);
  }

  &:active {
    transform: scale(0.98);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__svg {
    width: 22px;
    height: 22px;
  }

  &__label {
    white-space: nowrap;
  }

  @media (max-width: $breakpoint-mobile) {
    bottom: 12px;
    right: 12px;
    padding: 8px 12px;
    gap: 6px;
    font-size: 0.85rem;

    .theme-toggle__svg {
      width: 18px;
      height: 18px;
    }
  }
}

.tv-shell {
  width: 100%;
  min-height: 100vh;
  max-width: $layout-max-width;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: $layout-shell-padding-top $layout-shell-padding-right
    $layout-shell-padding-bottom $layout-shell-padding-left;
  overflow-x: hidden;

  &__header {
    flex-shrink: 0;
  }

  &__main {
    flex: 1;
    margin-top: $layout-shell-main-gap;
    min-height: 0;
    max-height: calc(100vh - #{$layout-header-height-offset});
    display: flex;
    flex-direction: column;
    gap: $layout-shell-main-gap;

    @media (max-width: $breakpoint-mobile) {
      margin-top: 6px;
      margin-bottom: 4px;
      flex: 1;
      min-height: 0;
      max-height: none;
      -webkit-overflow-scrolling: touch;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1.05fr 1.15fr;
    gap: $layout-grid-gap-small;
    align-items: stretch;
    height: 100%;
    flex: 1;
    min-height: 0;
    min-width: 0;

    @media (min-width: $breakpoint-large) {
      grid-template-columns: 35fr 65fr;
      gap: $layout-grid-gap-large;
    }

    @media (max-width: $breakpoint-desktop) {
      grid-template-columns: 1fr;
    }

    @media (max-width: $breakpoint-mobile) {
      gap: 8px;
      min-height: 0;
      grid-template-rows: auto 1fr;
      align-items: start;
    }
  }

  &__panel {
    padding: $layout-panel-padding-default-y $layout-panel-padding-default-x;
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    max-height: 100%;
    overflow: hidden;
    background: var(--color-panel-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid var(--color-panel-border);
    box-shadow: 0 8px 32px 0 var(--color-panel-shadow);
    transition:
      background 0.3s ease,
      border-color 0.3s ease,
      box-shadow 0.3s ease;

    @media (min-width: $breakpoint-large) {
      padding: $layout-panel-padding-large-y $layout-panel-padding-large-x;
    }

    @media (max-width: $breakpoint-mobile) {
      padding: 10px 12px;
      border-radius: 12px;
      min-height: 0;
      max-height: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
  }

  &__panel--timetable {
    padding: $layout-panel-padding-timetable-y $layout-panel-padding-timetable-x;

    @media (max-width: $breakpoint-mobile) {
      overflow: visible;
      max-height: none;
      min-height: auto;
    }
  }

  &__panel--news {
    padding: $layout-panel-padding-news;

    @media (min-width: $breakpoint-large) {
      padding: $layout-panel-padding-news-large;
    }

    @media (max-width: $breakpoint-mobile) {
      min-height: 200px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, system-ui, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
    sans-serif;
  color: var(--color-text-primary);
  overflow: auto;
  background: linear-gradient(
    135deg,
    var(--color-bg-primary) 0%,
    var(--color-bg-secondary) 50%,
    var(--color-bg-tertiary) 100%
  );
  min-height: 100vh;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-primary: #0f172a;
    --color-bg-secondary: #1e293b;
    --color-bg-tertiary: #334155;
    --color-text-primary: #f1f5f9;
    --color-text-secondary: rgba(241, 245, 249, 0.8);
    --color-text-accent: #cbd5e1;
    --color-panel-bg: rgba(30, 41, 59, 0.4);
    --color-panel-border: rgba(255, 255, 255, 0.1);
    --color-panel-shadow: rgba(0, 0, 0, 0.5);
    --color-next-prayer-bg: rgba(34, 197, 94, 0.15);
    --color-next-prayer-border: rgba(34, 197, 94, 0.3);
    --color-next-prayer-text: #86efac;
    --color-next-prayer-text-dark: #4ade80;
    --color-active-bg: rgba(34, 197, 94, 0.2);
    --color-active-border: rgba(34, 197, 94, 0.4);
    --color-active-glow: rgba(34, 197, 94, 0.4);
    --color-jummah-bg: rgba(255, 107, 0, 0.2);
    --color-jummah-border: rgba(255, 107, 0, 0.7);
    --color-jummah-text: #ffa64d;
    --color-scrollbar-track: #1e293b;
    --color-scrollbar-thumb: #475569;
    --color-scrollbar-thumb-hover: #64748b;
    --color-label-text: rgba(255, 255, 255, 0.9);
    --color-ramadan-label-text: rgba(255, 255, 255, 0.9);
    --color-date-text: rgba(255, 255, 255, 0.9);
    --color-time-text: rgba(255, 255, 255, 0.95);
  }
}

@media (max-width: 1024px) {
  body {
    overflow: auto;
  }
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-scrollbar-track);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar-thumb);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-scrollbar-thumb-hover);
}
</style>
