<script setup>
import { useRamadanTimes } from "../composables/useRamadanTimes";

const { isRamadan, sehriEndTime, iftarTime, sehriLabel, iftarLabel } =
  useRamadanTimes();
</script>

<template>
  <div
    v-if="isRamadan"
    class="ramadan-banner"
    role="region"
    aria-label="Ramadan key times"
  >
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

    .ramadan-banner__label,
    .ramadan-banner__time {
      font-size: 1.2rem;
    }

    .ramadan-banner__divider {
      display: none;
    }
  }

  &__item {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    white-space: nowrap;
  }

  &__label {
    font-size: 2rem;
    font-weight: $font-weight-bold;
    color: var(--color-ramadan-label-text);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__time {
    font-size: 2rem;
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
