<script setup>
import NextPrayer from "../components/NextPrayer.vue";
import TimeTable from "../components/TimeTable.vue";
import { usePrayerSchedule } from "../composables/usePrayerSchedule.js";

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
  height: 100%; /* Fill the full height of the panel */
  min-height: 0; /* Allow flex child to shrink */
  gap: 8px; /* Space between NextPrayer and TimeTable */

  @media (max-width: $breakpoint-mobile) {
    height: auto; /* Allow natural height on mobile */
    min-height: auto;
  }
}

.timetable-wrapper {
  flex: 1; /* TimeTable takes up remaining space */
  min-height: 0; /* Allow it to shrink if needed */
  display: flex;
  flex-direction: column;

  @media (max-width: $breakpoint-mobile) {
    flex: none; /* Allow natural height on mobile */
    min-height: auto;
  }
}

.error {
  color: red;
  text-align: center;
}
</style>
