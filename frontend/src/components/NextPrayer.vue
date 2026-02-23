<script setup>
import { defineProps } from "vue";

const props = defineProps({
  nextName: { type: String, default: "No upcoming prayers" },
  nextCountdown: { type: String, default: "" },
});
</script>

<template>
  <div
    class="next-prayer"
    role="region"
    aria-label="Next prayer"
  >
    <div class="next-prayer__top">
      <div class="next-prayer__content">
        <div
          v-if="nextName !== 'No upcoming prayers'"
          class="next-prayer__main"
        >
          <span class="next-prayer__name" aria-label="Next prayer name">{{
            nextName
          }}</span>
          <span class="next-prayer__separator" aria-hidden="true"
            >STARTS IN</span
          >
          <span
            class="next-prayer__countdown"
            :aria-label="`${nextCountdown} until ${nextName}`"
            >{{ nextCountdown }}</span
          >
        </div>
        <div v-else class="next-prayer__main">
          <span class="next-prayer__name" aria-label="Prayer status">{{
            nextName
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../styles/stylesetter";

.next-prayer {
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--color-next-prayer-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid var(--color-next-prayer-border);
  box-shadow: 0 2px 16px 0 var(--color-panel-shadow);
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &__top {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    display: flex;
    align-items: baseline;
    gap: 8px;
    justify-content: center;
    min-width: 0;
  }

  &__main {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
  }

  &__name {
    font-size: 1.8rem;
    font-weight: $font-weight-extra-bold;
    color: var(--color-next-prayer-text);
    white-space: nowrap;
  }

  &__separator {
    font-size: $font-size-medium;
    color: var(--color-label-text);
    font-weight: $font-weight-bold;
    letter-spacing: 0.05em;
  }

  &__countdown {
    font-size: 1.8rem;
    font-weight: $font-weight-extra-bold;
    color: var(--color-next-prayer-text-dark);
    white-space: nowrap;
  }

  @media (max-width: $breakpoint-tablet) {
    padding: 16px 20px;
    gap: 12px;

    &__top {
      flex-direction: column;
      align-items: flex-start;
    }

    &__content {
      width: 100%;
    }

    &__name {
      font-size: $font-size-large;
    }

    &__countdown {
      font-size: $font-size-large;
    }

    &__ramadan {
      flex-wrap: wrap;
      gap: 8px;
    }

    .ramadan-divider {
      display: none;
    }
  }

  @media (max-width: $breakpoint-mobile) {
    padding: 8px 12px;
    gap: 4px;
    border-radius: 10px;

    &__main {
      gap: 4px;
    }

    &__name {
      font-size: 1.2rem;
    }

    &__separator {
      font-size: 0.9rem;
    }

    &__countdown {
      font-size: 1.2rem;
    }

    &__ramadan {
      gap: 6px;
      flex-direction: column;
    }

    .ramadan-label,
    .ramadan-time {
      font-size: 1.2rem;
    }
  }
}
</style>
