import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchData } from "../utils/apiUtils";
import { handleError } from "../utils/errorHandler";
import { getWeekRange, getTomorrowISO } from "../utils/dateUtils";
import {
  processDailyPrayer,
  processTomorrowsPrayer,
} from "../utils/salaahUtils";

export const usePrayerTimesStore = defineStore("prayerTimes", () => {
  const weekData = ref([]);
  const originalTodayData = ref([]);
  const updatedTodayData = ref([]);
  const tomorrowData = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchWeekData() {
    loading.value = true;
    error.value = null;

    try {
      if (import.meta.env.DEV) {
        console.log("[prayerTimes] fetchWeekData: starting request");
      }
      const { startISO, endISO } = getWeekRange();
      const queryParams = new URLSearchParams({
        "filters[date][$gte]": startISO,
        "filters[date][$lte]": endISO,
        populate: "*",
      });
      const url = `${
        import.meta.env.VITE_STRAPI_URL
      }/api/salaah-times?${queryParams}`;
      const data = await fetchData(url, import.meta.env.VITE_STRAPI_API_TOKEN);
      weekData.value = data.data || [];
      if (import.meta.env.DEV) {
        console.log(
          "[prayerTimes] fetchWeekData: success, records:",
          weekData.value.length,
        );
      }
      return weekData.value;
    } catch (err) {
            error.value = handleError(err, "fetchWeekData", "Unable to load weekly prayer times");
      console.error("[prayerTimes] fetchWeekData error:", err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchTomorrowData() {
    loading.value = true;
    error.value = null;

    try {
      if (import.meta.env.DEV) {
        console.log("[prayerTimes] fetchTomorrowData: starting request");
      }
      const tomorrowISO = getTomorrowISO();
      const url = `${
        import.meta.env.VITE_STRAPI_URL
      }/api/salaah-times?filters[date][$eq]=${tomorrowISO}&populate=*`;
      const data = await fetchData(url, import.meta.env.VITE_STRAPI_API_TOKEN);
      tomorrowData.value = processTomorrowsPrayer(data.data?.[0]);
      if (import.meta.env.DEV) {
        console.log(
          "[prayerTimes] fetchTomorrowData: success, hasRecord:",
          !!data.data?.[0],
        );
      }
      return tomorrowData.value;
    } catch (err) {
      tomorrowData.value = [];
            error.value = handleError(err, "fetchTomorrowData", "Unable to load tomorrow's prayer times");
      console.error("[prayerTimes] fetchTomorrowData error:", err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  function setTodayData(original, updated) {
    originalTodayData.value = original;
    updatedTodayData.value = updated;
  }

  return {
    weekData,
    originalTodayData,
    updatedTodayData,
    tomorrowData,
    loading,
    error,
    fetchWeekData,
    fetchTomorrowData,
    setTodayData,
  };
});
