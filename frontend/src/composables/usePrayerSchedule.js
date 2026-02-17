import { ref, computed, onMounted, onUnmounted } from "vue";
import { usePrayerTimesStore } from "../stores/prayerTimes.js";
import { processDailyPrayer } from "../utils/salaahUtils.js";
import { processJummah } from "../utils/prayerUtils.js";
import {
  time24ToSeconds,
  formatCountdown,
} from "../utils/timeUtils.js";
import {
  PRAYER_TICK_INTERVAL_MS,
  SEEN_PRAYER_GRACE_SECONDS,
} from "../utils/constants.js";
import { normalizePrayerRow } from "../utils/prayerNormalization.js";

/**
 * Encapsulates all the logic for:
 * - Building today's timetable (including Jummah)
 * - Deriving the next/current prayer
 * - Exposing normalized rows for display
 */
export function usePrayerSchedule() {
  const store = usePrayerTimesStore();

  const rawPrayers = ref([]); // legacy shape, used internally
  const nextPrayerName = ref("");
  const nextPrayerCountdown = ref("");
  const currentPrayerName = ref("");

  let updateInterval = null;
  let midnightTimeout = null;

  // Normalized rows for UI components
  const prayers = computed(() => rawPrayers.value.map(normalizePrayerRow));

  async function fetchWeekData() {
    await store.fetchWeekData();
    buildTodaysData();
  }

  async function fetchTomorrowData() {
    await store.fetchTomorrowData();
  }

  function findNextAndCurrentPrayer() {
    // Derive "next" and "current" using the most relevant time for each prayer:
    // - Prefer Jamat time if present, otherwise use the start time.
    // - "Next" = the first prayer whose time is still in the future.
    // - "Current" = the latest prayer whose time has already passed (or the first, if none passed yet).
    const now = new Date();
    const isFriday = now.getDay() === 5; // 5 = Friday
    const currentSec =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    let nextPrayer = null;
    let currentPrayer = null;

    const prayersWithSec = rawPrayers.value
      .map((p) => {
        // Active/next logic is based strictly on the *start* time,
        // not the jamat time.
        const startTime24 = p["Start Time (24hr)"] || "";
        const sec = time24ToSeconds(startTime24);
        return { ...p, sec };
      })
      // Drop rows that have no valid start time at all
      // and ignore Jummah on non‑Fridays for active/next calculations.
      .filter((p) => p.sec != null && (isFriday || p.Name !== "Jummah"))
      // Sort once by time ascending to make later logic easier
      .sort((a, b) => (a.sec ?? 0) - (b.sec ?? 0));

    if (!prayersWithSec.length) {
      // No valid timings; clear state and bail out
      nextPrayerName.value = "No upcoming prayers";
      nextPrayerCountdown.value = "";
      currentPrayerName.value = "";
      return;
    }

    // Find the next prayer (time hasn't happened yet today)
    for (const p of prayersWithSec) {
      if (p.sec > currentSec) {
        nextPrayer = p;
        break;
      }
    }

    // Find the current prayer *by start time*:
    // - If at least one prayer's start time has already passed today,
    //   pick the latest one.
    // - Otherwise (before the first start time of the day), there is no
    //   "current" prayer yet.
    const passedPrayers = prayersWithSec.filter((p) => p.sec <= currentSec);
    if (passedPrayers.length > 0) {
      currentPrayer = passedPrayers[passedPrayers.length - 1];
    }

    // If we still didn't find a "next" (we are after the last prayer),
    // wrap around so that the first prayer of the list is considered "next".
    if (!nextPrayer && prayersWithSec.length > 0) {
      nextPrayer = prayersWithSec[0];
    }

    if (!nextPrayer) {
      nextPrayerName.value = "No upcoming prayers";
      nextPrayerCountdown.value = "";
    } else {
      nextPrayerName.value = nextPrayer.Name;
      let diff = (nextPrayer.sec ?? 0) - currentSec;
      if (diff < 0) diff += 24 * 3600;
      nextPrayerCountdown.value = formatCountdown(diff);
    }

    currentPrayerName.value = currentPrayer?.Name || "";
  }

  function buildTodaysData() {
    const now = new Date();
    const currentSec =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const todayISO = now.toISOString().split("T")[0];

    const todaysRecord = store.weekData.find((r) => r?.date === todayISO);
    const fridayRecord = store.weekData.find((r) => {
      const d = new Date(r?.date || "");
      return d.getDay() === 5;
    });

    const dailyPrayers = processDailyPrayer(todaysRecord);
    const jummahRow = processJummah(fridayRecord);

    const originalPrayers = [...dailyPrayers];
    store.setTodayData(
      [...originalPrayers, jummahRow],
      [] // updated data (will be set below)
    );

    const updatedPrayers = dailyPrayers.map((prayer, index) => {
      if (prayer.Name === "Sehri End") {
        return prayer;
      }

      const timeStr =
        prayer["Jamat Time (24hr)"] || prayer["Start Time (24hr)"];
      const prayerSec = time24ToSeconds(timeStr);
      if (prayerSec == null) {
        return prayer;
      }

      if (prayerSec + SEEN_PRAYER_GRACE_SECONDS < currentSec) {
        if (store.tomorrowData[index]) {
          return store.tomorrowData[index];
        }
      }

      return prayer;
    });

    store.setTodayData(
      [...originalPrayers, jummahRow],
      [...updatedPrayers, jummahRow]
    );

    rawPrayers.value = updatedPrayers
      .filter((prayer) => prayer.Name !== "Sehri End")
      .concat(jummahRow);

    findNextAndCurrentPrayer();
  }

  function scheduleMidnightRefresh() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow - now;

    midnightTimeout = setTimeout(() => {
      fetchWeekData();
      fetchTomorrowData();
      scheduleMidnightRefresh();
    }, msUntilMidnight);
  }

  onMounted(() => {
    fetchWeekData();
    fetchTomorrowData();
    scheduleMidnightRefresh();

    updateInterval = setInterval(() => {
      buildTodaysData();
      findNextAndCurrentPrayer();
    }, PRAYER_TICK_INTERVAL_MS);
  });

  onUnmounted(() => {
    if (updateInterval) clearInterval(updateInterval);
    if (midnightTimeout) clearTimeout(midnightTimeout);
  });

  return {
    prayers,
    nextPrayerName,
    nextPrayerCountdown,
    currentPrayerName,
    tomorrowData: computed(() => store.tomorrowData),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
  };
}

