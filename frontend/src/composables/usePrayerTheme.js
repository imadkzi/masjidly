import { onMounted, ref, watch } from "vue";
import { usePrayerTimesStore } from "../stores/prayerTimes";
import { useClock } from "./useClock";
import { time24ToSeconds } from "../utils/timeUtils";
import { PRAYER_NAMES } from "../utils/constants";

const THEME_STORAGE_KEY = "theme";

// Shared ref so all consumers (App, Date, etc.) react to theme changes
let sharedIsDark = null;

export function usePrayerTheme() {
  if (!sharedIsDark) sharedIsDark = ref(false);
  const isDark = sharedIsDark;
  const store = usePrayerTimesStore();
  const { now } = useClock();

  function applyTheme(dark) {
    isDark.value = dark;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  function shouldBeDarkByPrayerTime() {
    const prayers = store.originalTodayData;
    if (!prayers?.length) return null;
    const fajr = prayers.find((p) => p.Name?.includes(PRAYER_NAMES.FAJR));
    const maghrib = prayers.find((p) => p.Name?.includes(PRAYER_NAMES.MAGHRIB));
    const fajrSec = fajr?.["Start Time (24hr)"]
      ? time24ToSeconds(fajr["Start Time (24hr)"])
      : null;
    const maghribSec = maghrib?.["Start Time (24hr)"]
      ? time24ToSeconds(maghrib["Start Time (24hr)"])
      : null;
    if (fajrSec == null || maghribSec == null) return null;
    const t = now.value;
    const currentSec =
      t.getHours() * 3600 + t.getMinutes() * 60 + t.getSeconds();
    return currentSec >= maghribSec || currentSec < fajrSec;
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || savedTheme === "light") {
      applyTheme(savedTheme === "dark");
      return;
    }

    const darkByTime = shouldBeDarkByPrayerTime();
    if (darkByTime !== null) {
      applyTheme(darkByTime);
    } else {
      applyTheme(prefersDark);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          const darkByTime = shouldBeDarkByPrayerTime();
          if (darkByTime !== null) applyTheme(darkByTime);
          else applyTheme(e.matches);
        }
      });
  });

  watch(
    [now, () => store.originalTodayData],
    () => {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      const darkByTime = shouldBeDarkByPrayerTime();
      if (darkByTime !== null) applyTheme(darkByTime);
    },
    { deep: true },
  );

  function toggleTheme() {
    isDark.value = !isDark.value;
    const theme = isDark.value ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  return { isDark, toggleTheme };
}
