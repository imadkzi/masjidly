import { ref, computed, onMounted, onUnmounted } from "vue";
import { usePrayerTimesStore } from "../stores/prayerTimes.js";
import { processDailyPrayer } from "../utils/salaahUtils.js";
import { processJummah } from "../utils/prayerUtils.js";
import { time24ToSeconds, formatCountdown } from "../utils/timeUtils.js";
import {
  PRAYER_TICK_INTERVAL_MS,
  SEEN_PRAYER_GRACE_SECONDS,
} from "../utils/constants.js";
import { normalizePrayerRow } from "../utils/prayerNormalization.js";

export function usePrayerSchedule() {
  const store = usePrayerTimesStore();

  const rawPrayers = ref([]);
  const nextPrayerName = ref("");
  const nextPrayerCountdown = ref("");
  const currentPrayerName = ref("");

  let updateInterval = null;
  let midnightTimeout = null;

  const prayers = computed(() => rawPrayers.value.map(normalizePrayerRow));

  async function fetchWeekData() {
    await store.fetchWeekData();
    buildTodaysData();
  }

  async function fetchTomorrowData() {
    await store.fetchTomorrowData();
  }

  function findNextAndCurrentPrayer() {
    const now = new Date();
    const isFriday = now.getDay() === 5;
    const currentSec =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    let nextPrayer = null;
    let currentPrayer = null;

    const prayersWithSec = rawPrayers.value
      .map((p) => {
        const startTime24 = p["Start Time (24hr)"] || "";
        const sec = time24ToSeconds(startTime24);
        return { ...p, sec };
      })
      .filter((p) => p.sec != null && (isFriday || p.Name !== "Jummah"))
      .sort((a, b) => (a.sec ?? 0) - (b.sec ?? 0));

    if (!prayersWithSec.length) {
      nextPrayerName.value = "No upcoming prayers";
      nextPrayerCountdown.value = "";
      currentPrayerName.value = "";
      return;
    }

    for (const p of prayersWithSec) {
      if (p.sec > currentSec) {
        nextPrayer = p;
        break;
      }
    }

    const passedPrayers = prayersWithSec.filter((p) => p.sec <= currentSec);
    if (passedPrayers.length > 0) {
      currentPrayer = passedPrayers[passedPrayers.length - 1];
    }

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
    store.setTodayData([...originalPrayers, jummahRow], []);

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
      [...updatedPrayers, jummahRow],
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
