import { ref, computed, watch } from "vue";
import moment from "moment-hijri";
import { usePrayerTimesStore } from "../stores/prayerTimes";
import { useClock } from "./useClock";
import { formatTimeTo12HourWithPeriod } from "../utils/salaahUtils";
import { time24ToSeconds } from "../utils/timeUtils";
import { PRAYER_NAMES } from "../utils/constants";
import { isRamadanNow } from "../utils/ramadanUtils";

export function useRamadanTimes() {
  const store = usePrayerTimesStore();
  const { now } = useClock();

  const sehriEndTime = ref("");
  const iftarTime = ref("");
  const sehriLabel = ref("Sehri End Today");
  const iftarLabel = ref("Iftar");
  const ramadanDay = ref(null);
  const ramadanYear = ref(null);

  let isSehriUpdatedToTomorrow = false;
  let isIftarUpdatedToTomorrow = false;

  const isRamadan = computed(() => isRamadanNow());

  function updateTimesFromStore(type = "both", forTomorrow = false) {
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
  }

  function updateRamadanTimes(current) {
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
  }

  function resetUpdateFlag(current) {
    if (current.getHours() === 0 && current.getMinutes() === 0) {
      isSehriUpdatedToTomorrow = false;
      isIftarUpdatedToTomorrow = false;
      updateTimesFromStore("both", false);
    }
  }

  function updateRamadanMeta() {
    if (!isRamadan.value) {
      ramadanDay.value = null;
      ramadanYear.value = null;
      return;
    }

    const m = moment();
    // Only show a counter when we're actually in Ramadan month
    const hijriMonthIndex = m.iMonth();
    if (hijriMonthIndex === 8) {
      ramadanDay.value = m.iDate();
      ramadanYear.value = m.iYear();
    } else {
      ramadanDay.value = null;
      ramadanYear.value = null;
    }
  }

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
        updateRamadanMeta();
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

  return {
    isRamadan,
    sehriEndTime,
    iftarTime,
    sehriLabel,
    iftarLabel,
    ramadanDay,
    ramadanYear,
  };
}
