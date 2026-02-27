import { ref, watch } from "vue";
import { usePrayerTimesStore } from "../stores/prayerTimes";
import { useClock } from "./useClock";
import { time24ToSeconds } from "../utils/timeUtils";
import { PRAYER_NAMES } from "../utils/constants";
import { isRamadanNow } from "../utils/ramadanUtils";

const START_MINS_AFTER_ISHA_JAMAT = 15;
const DURATION_MINS = 90;
const SECONDS_PER_DAY = 24 * 3600;
const NOON_SEC = 12 * 3600;

function getLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function inTaraweehDuaWindow(now, prayers) {
  const currentSec =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  if (!prayers?.length) return false;
  if (currentSec < NOON_SEC) return false;
  const isha = prayers.find((p) => p.Name?.includes(PRAYER_NAMES.ISHA));
  const ishaTime24 =
    isha?.["Jamat Time (24hr)"] || isha?.["Start Time (24hr)"] || "";
  const ishaSec = time24ToSeconds(ishaTime24);
  if (ishaSec == null) return false;
  if (ishaSec < NOON_SEC) return false;
  const startSec = ishaSec + START_MINS_AFTER_ISHA_JAMAT * 60;
  const endSec = ishaSec + (START_MINS_AFTER_ISHA_JAMAT + DURATION_MINS) * 60;
  let inWindow;
  if (endSec <= SECONDS_PER_DAY) {
    inWindow = currentSec >= startSec && currentSec < endSec;
  } else {
    inWindow = currentSec >= startSec || currentSec < endSec % SECONDS_PER_DAY;
  }
  return inWindow;
}

export function useTaraweehDua() {
  const store = usePrayerTimesStore();
  const { now } = useClock();
  const showTaraweehDua = ref(false);
  const windowEndedForDate = ref(null);

  function update() {
    if (!isRamadanNow()) {
      showTaraweehDua.value = false;
      return;
    }
    const todayLocal = getLocalDateString(now.value);
    if (windowEndedForDate.value === todayLocal) {
      showTaraweehDua.value = false;
      return;
    }
    const wasShowing = showTaraweehDua.value;
    // Use originalTodayData so we always use today's Isha jamat for the window.
    // updatedTodayData can swap in tomorrow's Isha after today's has passed.
    const data = store.originalTodayData;
    const inWindow = data?.length
      ? inTaraweehDuaWindow(now.value, data)
      : false;
    showTaraweehDua.value = inWindow;
    if (wasShowing && !inWindow) {
      windowEndedForDate.value = todayLocal;
    }
  }

  update();

  watch(now, update);
  watch(() => [store.originalTodayData, store.updatedTodayData], update, {
    deep: true,
  });

  return { showTaraweehDua };
}
