<script setup>
import { computed } from "vue";
import moment from "moment-hijri";
import { useClock } from "../composables/useClock.js";
import { useMasjidSettings } from "../composables/useMasjidSettings.js";
import { usePrayerTheme } from "../composables/usePrayerTheme.js";
import logoDefault from "../assets/logo-full.svg";

const { now } = useClock();
const { settings } = useMasjidSettings();
const { isDark } = usePrayerTheme();

const logoUrl = computed(() => {
  if (isDark.value && settings.value.darkModeLogo) {
    return settings.value.darkModeLogo;
  }
  return settings.value.logo || logoDefault;
});

const useDarkLogoVariant = computed(
  () => isDark.value && !!settings.value.darkModeLogo,
);
const masjidName = computed(() => settings.value.masjidName || "");
const showMasjidName = computed(() => settings.value.showMasjidName ?? true);

// Current time string (updating via the shared clock)
const currentTime = computed(() =>
  now.value.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }),
);

// Gregorian date (derived from "now")
const date = computed(() =>
  now.value.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
);

// Hijri date (derived from "now")
const hijri = computed(() => {
  moment.locale("en");
  return moment(now.value).format("iD iMMMM iYYYY");
});
</script>

<template>
  <header role="banner">
    <div class="header-row">
      <div class="header-section logo-container">
        <img
          :key="logoUrl"
          :src="logoUrl"
          :alt="masjidName || 'Masjidly'"
          class="logo"
          :class="{ 'logo--dark-variant': useDarkLogoVariant }"
        />
        <span v-if="showMasjidName && masjidName" aria-hidden="true">{{ masjidName }}</span>
      </div>
      <div class="header-section time-container" v-if="currentTime">
        <time
          class="time"
          :datetime="now.toISOString()"
          :aria-label="`Current time: ${currentTime}`"
          >{{ currentTime }}</time
        >
      </div>
      <div class="header-section date-container" v-if="date && hijri">
        <time
          :datetime="now.toISOString()"
          :aria-label="`Current date: ${date} and Hijri date: ${hijri}`"
          class="date-block"
        >
          <span class="date-gregorian">{{ date }}</span>
          <span class="date-hijri">{{ hijri }}</span>
        </time>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import "../styles/stylesetter";

header {
  padding: $padding-medium;
  background: var(--color-panel-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid var(--color-panel-border);
  box-shadow: 0 8px 32px 0 var(--color-panel-shadow);
  min-height: 90px;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  @media (max-width: $breakpoint-mobile) {
    border-radius: 12px;
  }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  .header-section {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 $padding-small;

    span {
      color: $color-accent;
    }
  }

  .logo-container {
    justify-content: flex-start;
    gap: 16px;

    img {
      height: 75px;
      width: auto;
      transition: filter 0.3s ease;
    }

    span {
      font-size: 1.75rem;
      font-weight: $font-weight-bold;
      color: var(--color-text-primary);
      letter-spacing: 0.02em;
    }
  }

  .time-container {
    justify-content: center;
    flex-grow: 1;

    .time {
      font-size: 3.7rem;
      font-weight: $font-weight-extra-bold;
      color: var(--color-time-text);
      letter-spacing: 0.02em;
    }
  }

  .date-container {
    justify-content: flex-end;
    text-align: right;

    .date-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      font-size: $font-size-large;
      color: var(--color-date-text);
      font-weight: $font-weight-bold;
      line-height: 1.4;

      .date-gregorian,
      .date-hijri {
        display: block;
      }
    }
  }

  @media (max-width: $breakpoint-desktop) {
    height: 80px;
    padding: 0 16px;

    .header-section {
      padding: 0 12px;
    }

    .logo-container {
      img {
        height: 48px;
      }

      span {
        font-size: 1.5rem;
      }
    }

    .date-container .date-block {
      font-size: $font-size-large;
    }

    .time-container .time {
      font-size: 2.4rem;
    }
  }

  @media (max-width: $breakpoint-mobile) {
    min-height: 0;
    height: auto;
    padding: 8px 10px;

    .header-row {
      flex-direction: column;
      gap: 6px;
    }

    .header-section {
      padding: 0;
    }

    .logo-container {
      order: 1;
      justify-content: center;
      gap: 8px;

      img {
        height: 40px;
      }

      span {
        font-size: 1.25rem;
      }
    }

    .date-container {
      order: 2;
      justify-content: center;
      text-align: center;

      .date-block {
        align-items: center;
        font-size: 0.875rem;
        line-height: 1.3;
      }
    }

    .time-container {
      display: none;
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-color: #f0f0f0;
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #f0f0f0;
  }
}

/* Dark mode: invert light logo when no dark variant is set */
[data-theme="dark"] .logo-container img:not(.logo--dark-variant) {
  filter: brightness(0) invert(1);
}
</style>
