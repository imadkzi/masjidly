<script setup>
import { computed } from "vue";
import { useRamadanTimes } from "../composables/useRamadanTimes";

const {
  isRamadan,
  sehriEndTime,
  iftarTime,
  sehriLabel,
  iftarLabel,
  ramadanDay,
} = useRamadanTimes();

function ordinal(n) {
  if (n == null || n < 1) return "";
  const v = n % 100;
  if (v >= 11 && v <= 13) return n + "TH";
  const s = ["TH", "ST", "ND", "RD"];
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const ramadanDayOrdinal = computed(() =>
  ramadanDay.value != null ? ordinal(ramadanDay.value) : "",
);
</script>

<template>
  <div
    v-if="isRamadan"
    class="ramadan-banner"
    role="region"
    aria-label="Ramadan day and key times"
  >
    <template v-if="ramadanDayOrdinal">
      <span class="ramadan-banner__day" :aria-label="`${ramadanDayOrdinal} day of Ramadhan`">
        {{ ramadanDayOrdinal }}
      </span>
      <span class="ramadan-banner__title">Ramadhan</span>
    </template>
    <span class="ramadan-banner__divider" aria-hidden="true">|</span>
    <span class="ramadan-banner__item">
      <span class="ramadan-banner__label">{{ sehriLabel }}:</span>
      <time
        class="ramadan-banner__time"
        :datetime="sehriEndTime || undefined"
        aria-label="Sehri end time"
      >
        {{ sehriEndTime || "—" }}
      </time>
    </span>
    <span class="ramadan-banner__divider" aria-hidden="true">|</span>
    <span class="ramadan-banner__item">
      <span class="ramadan-banner__label">{{ iftarLabel }}:</span>
      <time
        class="ramadan-banner__time"
        :datetime="iftarTime || undefined"
        aria-label="Iftar time"
      >
        {{ iftarTime || "—" }}
      </time>
    </span>
  </div>
</template>

<style scoped lang="scss">
@import "../styles/stylesetter";

.ramadan-banner {
  padding: 10px 16px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  background: var(--color-next-prayer-bg);
  border: 1px solid var(--color-next-prayer-border);
  box-shadow: 0 2px 10px 0 var(--color-panel-shadow);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  text-align: center;

  @media (max-width: $breakpoint-mobile) {
    gap: 8px;
    font-size: 1.2rem;

    .ramadan-banner__title,
    .ramadan-banner__day,
    .ramadan-banner__label,
    .ramadan-banner__time {
      font-size: 1.2rem;
    }

    .ramadan-banner__divider {
      display: none;
    }
  }

  &__title {
    font-size: 1.4rem;
    font-weight: $font-weight-extra-bold;
    letter-spacing: 0.08em;
    color: var(--color-ramadan-label-text);
    text-transform: uppercase;
  }

  &__day {
    font-size: 1.4rem;
    font-weight: $font-weight-extra-bold;
    color: var(--color-next-prayer-text);
    text-transform: uppercase;
  }

  &__item {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    white-space: nowrap;
  }

  &__label {
    font-size: 1.4rem;
    font-weight: $font-weight-bold;
    color: var(--color-ramadan-label-text);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    }

  &__time {
    font-size: 1.4rem;
    font-weight: $font-weight-extra-bold;
    color: var(--color-next-prayer-text);
  }

  &__divider {
    font-size: 1.4rem;
    font-weight: $font-weight-bold;
    color: var(--color-ramadan-label-text);
    opacity: 0.7;
    padding: 0 4px;
    user-select: none;
  }
}
</style>

