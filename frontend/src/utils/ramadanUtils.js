import moment from "moment-hijri";

export function isRamadanNow(options = {}) {
  const { respectUrl = true, respectEnv = true } = options;

  if (respectUrl && typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const ramadanParam = params.get("ramadan");
    if (ramadanParam === "true") return true;
    if (ramadanParam === "false") return false;
  }

  if (respectEnv) {
    const forceRamadan = import.meta.env.VITE_FORCE_RAMADAN;
    if (forceRamadan === "true") return true;
    if (forceRamadan === "false") return false;
  }

  const m = moment();
  const hijriMonthIndex = m.iMonth();
  const hijriDay = m.iDate();
  const isRamadanMonth = hijriMonthIndex === 8;
  const is29Shaaban = hijriMonthIndex === 7 && hijriDay === 29;
  return isRamadanMonth || is29Shaaban;
}

