<script setup>
import SalaahView from "./views/SalaahView.vue";
import Date from "./components/Date.vue";
import News from "./components/News.vue";
import ErrorBoundary from "./components/ErrorBoundary.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import { usePrayerTheme } from "./composables/usePrayerTheme";
import { useMasjidSettings } from "./composables/useMasjidSettings";
import { useMasjidBranding } from "./composables/useMasjidBranding";
import { useThemePreset } from "./composables/useThemePreset";

const { isDark, toggleTheme } = usePrayerTheme();
const { settings } = useMasjidSettings();

useMasjidBranding(settings);
useThemePreset(settings);
</script>

<template>
  <ErrorBoundary>
    <div class="tv-shell">
      <ThemeToggle :is-dark="isDark" @toggle="toggleTheme" />
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
            <SalaahView :show-day-labels="settings.showDayLabels" />
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
@import "./styles/App.scss";
</style>
