<script setup>
import { defineProps, ref, watch, computed } from "vue";
import { usePrayerTimesStore } from "../stores/prayerTimes";
import { formatTimeTo12HourWithPeriod } from "../utils/salaahUtils.js";
import { useClock } from "../composables/useClock.js";
import { time24ToSeconds } from "../utils/timeUtils.js";
import { PRAYER_NAMES } from "../utils/constants.js";
import { isRamadanNow } from "../utils/ramadanUtils.js";

const props = defineProps({
  nextName: { type: String, default: "No upcoming prayers" },
  nextCountdown: { type: String, default: "" },
});

const store = usePrayerTimesStore();
const { now } = useClock();
const sehriEndTime = ref("");
const iftarTime = ref("");
const sehriLabel = ref("Sehri End Today");
const iftarLabel = ref("Iftar");
let isSehriUpdatedToTomorrow = false;
let isIftarUpdatedToTomorrow = false;

// Check if it's Ramadan (respects URL and env flags)
const isRamadan = computed(() => isRamadanNow());

const updateTimesFromStore = (type = "both", forTomorrow = false) => {
  const prayers = forTomorrow ? store.tomorrowData : store.originalTodayData;

  if (type === "both" || type === "sehri") {
    const sehriPrayer = prayers.find((prayer) =>
      prayer.Name.includes(PRAYER_NAMES.SEHRI_END)
    );
    const time24 = sehriPrayer?.["Start Time (24hr)"] || "";
    sehriEndTime.value = time24 ? formatTimeTo12HourWithPeriod(time24) : "";
    sehriLabel.value = forTomorrow ? "Sehri End Tomorrow" : "Sehri End Today";
  }

  if (type === "both" || type === "iftar") {
    const iftarPrayer = prayers.find((prayer) =>
      prayer.Name.includes(PRAYER_NAMES.MAGHRIB)
    );
    const time24 = iftarPrayer?.["Jamat Time (24hr)"] || "";
    iftarTime.value = time24 ? formatTimeTo12HourWithPeriod(time24) : "";
    iftarLabel.value = forTomorrow ? "Iftar Tomorrow" : "Iftar Today";
  }
};

const updateRamadanTimes = (current) => {
  // Only update Ramadan times if it's actually Ramadan
  if (!isRamadan.value) {
    sehriEndTime.value = "";
    iftarTime.value = "";
    return;
  }

  if (store.originalTodayData.length === 0) {
    return;
  }

  const currentSec =
    current.getHours() * 3600 + current.getMinutes() * 60 + current.getSeconds();

  // Check Sehri time using 24-hour time directly from store
  const sehriPrayer = store.originalTodayData.find((prayer) =>
    prayer.Name.includes(PRAYER_NAMES.SEHRI_END)
  );
  if (sehriPrayer && store.tomorrowData.length > 0 && !isSehriUpdatedToTomorrow) {
    const sehriTime24 = sehriPrayer["Start Time (24hr)"] || "";
    if (sehriTime24) {
      const sehriSec = time24ToSeconds(sehriTime24);
      if (sehriSec != null && currentSec >= sehriSec) {
        // Check if tomorrow's data has Sehri End
        const tomorrowSehri = store.tomorrowData.find((prayer) =>
          prayer.Name.includes(PRAYER_NAMES.SEHRI_END)
        );
        if (tomorrowSehri) {
          isSehriUpdatedToTomorrow = true;
          updateTimesFromStore("sehri", true);
        }
      }
    }
  }

  // Check Maghrib (Iftar) time using 24-hour time directly from store
  const maghribPrayer = store.originalTodayData.find((prayer) =>
    prayer.Name.includes(PRAYER_NAMES.MAGHRIB)
  );
  if (maghribPrayer && store.tomorrowData.length > 0 && !isIftarUpdatedToTomorrow) {
    const maghribTime24 = maghribPrayer["Jamat Time (24hr)"] || "";
    if (maghribTime24) {
      const maghribSec = time24ToSeconds(maghribTime24);
      if (maghribSec != null && currentSec >= maghribSec) {
        // Check if tomorrow's data has Maghrib
        const tomorrowMaghrib = store.tomorrowData.find((prayer) =>
          prayer.Name.includes(PRAYER_NAMES.MAGHRIB)
        );
        if (tomorrowMaghrib) {
          isIftarUpdatedToTomorrow = true;
          updateTimesFromStore("iftar", true);
        }
      }
    }
  }
};

const resetUpdateFlag = (current) => {
  if (current.getHours() === 0 && current.getMinutes() === 0) {
    isSehriUpdatedToTomorrow = false;
    isIftarUpdatedToTomorrow = false;
    updateTimesFromStore("both", false);
  }
};

watch(
  () => store.originalTodayData,
  (newData) => {
    if (newData.length > 0 && isRamadan.value && !isSehriUpdatedToTomorrow && !isIftarUpdatedToTomorrow) {
      // Only initialize if it's Ramadan and neither has been updated to tomorrow
      updateTimesFromStore("both", false);
    } else if (!isRamadan.value) {
      // Clear Ramadan times if not Ramadan
      sehriEndTime.value = "";
      iftarTime.value = "";
    }
  },
  { deep: true }
);

watch(
  () => store.tomorrowData,
  (newData) => {
    if (newData.length > 0) {
      // Update Sehri if it's been marked for tomorrow update
      if (isSehriUpdatedToTomorrow) {
        updateTimesFromStore("sehri", true);
      }
      // Update Iftar if it's been marked for tomorrow update
      if (isIftarUpdatedToTomorrow) {
        updateTimesFromStore("iftar", true);
      }
    }
  },
  { deep: true }
);

// Drive updates from the shared clock
watch(
  now,
  (current) => {
    // Only update Ramadan times if it's Ramadan
    if (isRamadan.value) {
      // First check and update Ramadan times
      updateRamadanTimes(current);
      // Then reset flags at midnight
      resetUpdateFlag(current);
      // Only initialize times if data is available and we haven't updated to tomorrow
      if (store.originalTodayData.length > 0 && !isSehriUpdatedToTomorrow && !isIftarUpdatedToTomorrow) {
        updateTimesFromStore("both", false);
      }
    } else {
      // Clear Ramadan times if not Ramadan
      sehriEndTime.value = "";
      iftarTime.value = "";
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="next-prayer" role="region" aria-label="Next prayer and Ramadan times">
    <div class="next-prayer__top">
      <div class="next-prayer__content">
        <div v-if="nextName !== 'No upcoming prayers'" class="next-prayer__main">
          <span class="next-prayer__name" aria-label="Next prayer name">{{ nextName }}</span>
          <span class="next-prayer__separator" aria-hidden="true">STARTS IN</span>
          <span class="next-prayer__countdown" :aria-label="`${nextCountdown} until ${nextName}`">{{ nextCountdown }}</span>
        </div>
        <div v-else class="next-prayer__main">
          <span class="next-prayer__name" aria-label="Prayer status">{{ nextName }}</span>
        </div>
      </div>
    </div>
    <div class="next-prayer__ramadan" v-if="isRamadan && (sehriEndTime || iftarTime)" role="region" aria-label="Ramadan times">
      <span class="ramadan-item">
        <span class="ramadan-label">{{ sehriLabel }}:</span>
        <time class="ramadan-time" :datetime="sehriEndTime" aria-label="Sehri end time">{{ sehriEndTime }}</time>
      </span>
      <span class="ramadan-divider" aria-hidden="true">|</span>
      <span class="ramadan-item">
        <span class="ramadan-label">{{ iftarLabel }}:</span>
        <time class="ramadan-time" :datetime="iftarTime" aria-label="Iftar time">{{ iftarTime }}</time>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../styles/stylesetter";

.next-prayer {
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px; /* Spacing between top section and Ramadan times */
  background: var(--color-next-prayer-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid var(--color-next-prayer-border);
  box-shadow: 0 2px 16px 0 var(--color-panel-shadow);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

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

  &__ramadan {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: nowrap;
    white-space: nowrap;
  }

  .ramadan-item {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    white-space: nowrap;
  }

  .ramadan-label {
    font-size: $font-size-medium;
    color: var(--color-ramadan-label-text);
    font-weight: $font-weight-bold;
  }

  .ramadan-time {
    font-size: $font-size-large;
    color: var(--color-next-prayer-text);
    font-weight: $font-weight-extra-bold;
  }

  .ramadan-divider {
    color: rgba(15, 118, 110, 0.4);
    font-size: $font-size-medium;
  }

  @media (max-width: $breakpoint-tablet) {
    padding: 16px 20px;
    gap: 12px;

    &__top {
      flex-direction: column;
      align-items: flex-start;
    }

    &__content {
      justify-content: flex-start;
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
}
</style>
