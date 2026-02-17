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

const isRamadan = computed(() => isRamadanNow());

const updateTimesFromStore = (type = "both", forTomorrow = false) => {
  const prayers = forTomorrow ? store.tomorrowData : store.originalTodayData;

  if (type === "both" || type === "sehri") {
    const sehriPrayer = prayers.find((prayer) =>
      prayer.Name.includes(PRAYER_NAMES.SEHRI_END),
    );
    let time24 = sehriPrayer?.["Start Time (24hr)"] || "";
    let label = forTomorrow ? "Sehri End Tomorrow" : "Sehri End Today";
    if (!forTomorrow && !time24 && store.tomorrowData.length > 0) {
      const tomorrowSehri = store.tomorrowData.find((prayer) =>
        prayer.Name.includes(PRAYER_NAMES.SEHRI_END),
      );
      const tomorrowTime24 = tomorrowSehri?.["Start Time (24hr)"] || "";
      if (tomorrowTime24) {
        time24 = tomorrowTime24;
        label = "Sehri End Tomorrow";
      }
    }
    sehriEndTime.value = time24 ? formatTimeTo12HourWithPeriod(time24) : "";
    sehriLabel.value = label;
  }

  if (type === "both" || type === "iftar") {
    const iftarPrayer = prayers.find((prayer) =>
      prayer.Name.includes(PRAYER_NAMES.MAGHRIB),
    );
    const time24 = iftarPrayer?.["Jamat Time (24hr)"] || "";
    iftarTime.value = time24 ? formatTimeTo12HourWithPeriod(time24) : "";
    iftarLabel.value = forTomorrow ? "Iftar Tomorrow" : "Iftar Today";
  }
};

const updateRamadanTimes = (current) => {
  if (!isRamadan.value) {
    sehriEndTime.value = "";
    iftarTime.value = "";
    return;
  }

  if (store.originalTodayData.length === 0) {
    return;
  }

  const currentSec =
    current.getHours() * 3600 +
    current.getMinutes() * 60 +
    current.getSeconds();

  const sehriPrayer = store.originalTodayData.find((prayer) =>
    prayer.Name.includes(PRAYER_NAMES.SEHRI_END),
  );
  if (
    sehriPrayer &&
    store.tomorrowData.length > 0 &&
    !isSehriUpdatedToTomorrow
  ) {
    const sehriTime24 = sehriPrayer["Start Time (24hr)"] || "";
    if (sehriTime24) {
      const sehriSec = time24ToSeconds(sehriTime24);
      if (sehriSec != null && currentSec >= sehriSec) {
        const tomorrowSehri = store.tomorrowData.find((prayer) =>
          prayer.Name.includes(PRAYER_NAMES.SEHRI_END),
        );
        if (tomorrowSehri) {
          isSehriUpdatedToTomorrow = true;
          updateTimesFromStore("sehri", true);
        }
      }
    }
  }

  const maghribPrayer = store.originalTodayData.find((prayer) =>
    prayer.Name.includes(PRAYER_NAMES.MAGHRIB),
  );
  if (
    maghribPrayer &&
    store.tomorrowData.length > 0 &&
    !isIftarUpdatedToTomorrow
  ) {
    const maghribTime24 = maghribPrayer["Jamat Time (24hr)"] || "";
    if (maghribTime24) {
      const maghribSec = time24ToSeconds(maghribTime24);
      if (maghribSec != null && currentSec >= maghribSec) {
        const tomorrowMaghrib = store.tomorrowData.find((prayer) =>
          prayer.Name.includes(PRAYER_NAMES.MAGHRIB),
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
    if (
      newData.length > 0 &&
      isRamadan.value &&
      !isSehriUpdatedToTomorrow &&
      !isIftarUpdatedToTomorrow
    ) {
      updateTimesFromStore("both", false);
    } else if (!isRamadan.value) {
      sehriEndTime.value = "";
      iftarTime.value = "";
    }
  },
  { deep: true },
);

watch(
  () => store.tomorrowData,
  (newData) => {
    if (newData.length > 0) {
      if (isSehriUpdatedToTomorrow) {
        updateTimesFromStore("sehri", true);
      }
      if (isIftarUpdatedToTomorrow) {
        updateTimesFromStore("iftar", true);
      }
    }
  },
  { deep: true },
);

watch(
  now,
  (current) => {
    if (isRamadan.value) {
      updateRamadanTimes(current);
      resetUpdateFlag(current);
      if (
        store.originalTodayData.length > 0 &&
        !isSehriUpdatedToTomorrow &&
        !isIftarUpdatedToTomorrow
      ) {
        updateTimesFromStore("both", false);
      }
    } else {
      sehriEndTime.value = "";
      iftarTime.value = "";
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="next-prayer"
    role="region"
    aria-label="Next prayer and Ramadan times"
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
    <div
      class="next-prayer__ramadan"
      v-if="isRamadan"
      role="region"
      aria-label="Ramadan times"
    >
      <span class="ramadan-item">
        <span class="ramadan-label">{{ sehriLabel }}:</span>
        <time
          class="ramadan-time"
          :datetime="sehriEndTime || undefined"
          aria-label="Sehri end time"
          >{{ sehriEndTime || "—" }}</time
        >
      </span>
      <span class="ramadan-divider" aria-hidden="true">|</span>
      <span class="ramadan-item">
        <span class="ramadan-label">{{ iftarLabel }}:</span>
        <time
          class="ramadan-time"
          :datetime="iftarTime || undefined"
          aria-label="Iftar time"
          >{{ iftarTime || "—" }}</time
        >
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
      font-size: 1rem;
    }

    &__separator {
      font-size: 0.7rem;
    }

    &__countdown {
      font-size: 1rem;
    }

    &__ramadan {
      gap: 6px;
    }

    .ramadan-label,
    .ramadan-time {
      font-size: 0.75rem;
    }
  }
}
</style>
