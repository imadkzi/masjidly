<script setup>
import NextPrayer from "../components/NextPrayer.vue";
import TimeTable from "../components/TimeTable.vue";
import { usePrayerSchedule } from "../composables/usePrayerSchedule.js";

const props = defineProps({
  showDayLabels: { type: Boolean, default: true },
});

const {
  prayers,
  nextPrayerName,
  nextPrayerCountdown,
  currentPrayerName,
  tomorrowData,
  loading,
  error,
} = usePrayerSchedule();
</script>

<template>
  <section class="salaah-view">
    <NextPrayer
      :nextName="nextPrayerName"
      :nextCountdown="nextPrayerCountdown"
    />
    <div class="timetable-wrapper">
      <TimeTable
        :prayers="prayers"
        :activeName="currentPrayerName"
        :tomorrowData="tomorrowData"
        :show-day-labels="props.showDayLabels"
      />
    </div>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </section>
</template>

<style scoped lang="scss">
@import "../styles/stylesetter";

.salaah-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  gap: 8px;

  @media (max-width: $breakpoint-mobile) {
    height: auto;
    min-height: auto;
    gap: 6px;
  }
}

.salaah-view__schedule-label {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  flex-shrink: 0;

  @media (max-width: $breakpoint-mobile) {
    font-size: 0.9rem;
    margin-bottom: 2px;
  }
}

.timetable-wrapper {
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: $breakpoint-mobile) {
    flex: none;
    min-height: auto;
    overflow: visible;
  }
}

.error {
  color: red;
  text-align: center;
}
</style>
