<script setup>
import { onMounted, ref } from "vue";
import SalaahView from "./views/SalaahView.vue";
import Date from "./components/Date.vue";
import News from "./components/News.vue";
import ErrorBoundary from "./components/ErrorBoundary.vue";

// Dark mode toggle
const isDark = ref(false);

onMounted(() => {
  // Check for saved preference or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    isDark.value = true;
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    isDark.value = false;
    document.documentElement.setAttribute("data-theme", "light");
  }

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      isDark.value = e.matches;
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    }
  });
});

// Toggle function (can be called from UI if needed)
const toggleTheme = () => {
  isDark.value = !isDark.value;
  const theme = isDark.value ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};
</script>

<template>
  <ErrorBoundary>
    <div class="tv-shell">
      <button 
        @click="toggleTheme" 
        class="theme-toggle"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        title="Toggle dark mode"
      >
        <span v-if="isDark">☀️</span>
        <span v-else>🌙</span>
      </button>
      <header class="tv-shell__header" role="banner">
        <Date />
      </header>

      <main class="tv-shell__main" role="main">
        <section class="tv-shell__grid">
          <div class="tv-shell__panel tv-shell__panel--timetable" role="region" aria-label="Prayer times">
            <SalaahView />
          </div>
          <div class="tv-shell__panel tv-shell__panel--news" role="region" aria-label="Announcements">
            <News />
          </div>
        </section>
      </main>
    </div>
  </ErrorBoundary>
</template>

<style lang="scss">
@import "./styles/stylesetter";

// Layout constants (matching JS constants)
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
$layout-shell-padding-bottom: 16px;
$layout-shell-padding-left: 8px;
$layout-shell-margin-top: 12px;
$layout-shell-margin-bottom: 8px;

.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--color-panel-border);
  background: var(--color-panel-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px 0 var(--color-panel-shadow);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px 0 var(--color-panel-shadow);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: $breakpoint-mobile) {
    bottom: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

.tv-shell {
  min-height: 100vh;
  max-width: $layout-max-width;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: $layout-shell-padding-top $layout-shell-padding-right $layout-shell-padding-bottom $layout-shell-padding-left;

  &__header {
    flex-shrink: 0;
  }

  &__main {
    flex: 1;
    margin-top: $layout-shell-margin-top;
    margin-bottom: $layout-shell-margin-bottom;
    min-height: 0; /* Allow flex child to shrink */
    max-height: calc(100vh - #{$layout-header-height-offset});
    display: flex;
    flex-direction: column;

    @media (max-width: $breakpoint-mobile) {
      max-height: none; /* Remove height constraint on mobile to allow full expansion */
      flex: none; /* Allow natural height on mobile */
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1.05fr 1.15fr;
    gap: $layout-grid-gap-small;
    align-items: stretch;
    height: 100%; /* Fill the full height of the main container */
    flex: 1; /* Take up all available space */
    min-height: 0; /* Allow grid to shrink */

    @media (min-width: $breakpoint-large) {
      grid-template-columns: 35fr 65fr;
      gap: $layout-grid-gap-large;
    }

    @media (max-width: $breakpoint-desktop) {
      grid-template-columns: 1fr;
    }
  }

  &__panel {
    padding: $layout-panel-padding-default-y $layout-panel-padding-default-x;
    display: flex;
    flex-direction: column;
    min-height: 0; /* allow children to control scroll */
    max-height: 100%; /* Prevent overflow */
    overflow: hidden; /* Prevent content from overflowing */
    background: var(--color-panel-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid var(--color-panel-border);
    box-shadow: 0 8px 32px 0 var(--color-panel-shadow);
    transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

    @media (min-width: $breakpoint-large) {
      padding: $layout-panel-padding-large-y $layout-panel-padding-large-x;
    }

    @media (max-width: $breakpoint-mobile) {
      max-height: none; /* Remove height constraint on mobile */
      overflow: visible; /* Allow content to expand on mobile */
    }
  }

  &__panel--timetable {
    padding: $layout-panel-padding-timetable-y $layout-panel-padding-timetable-x;
  }

  &__panel--news {
    padding: $layout-panel-padding-news;

    @media (min-width: $breakpoint-large) {
      padding: $layout-panel-padding-news-large;
    }
  }
}

/* Global reset and Apple-style glass background */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
  color: var(--color-text-primary);
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 50%, var(--color-bg-tertiary) 100%);
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
}

/* Auto dark mode based on system preference */
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

/* Subtle scrollbars (for mobile) */
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
