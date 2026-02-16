/** Utility: Convert 24-hour time to 12-hour format (no AM/PM) */
export function formatTimeTo12Hour(timeStr) {
  if (!timeStr) return "";
  const [hh, mm] = timeStr.split(":");
  const hour = parseInt(hh, 10);
  if (Number.isNaN(hour)) return "";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${mm}`;
}

/** Utility: Convert 24-hour time to 12-hour format with AM/PM */
export function formatTimeTo12HourWithPeriod(timeStr) {
  if (!timeStr) return "";
  const [hh, mm] = timeStr.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return "";
  const period = hh >= 12 ? "PM" : "AM";
  const hours12 = hh % 12 || 12;
  return `${hours12}:${mm.toString().padStart(2, "0")} ${period}`;
}

/** Utility: Process prayers */
export function processDailyPrayer(entry) {
  if (!entry) return [];
  const item = entry;
  const prayers = [
    { name: "Fajr", start: "fajr_start", jamat: "fajr_jamat" },
    { name: "Sunrise", start: "sunrise", jamat: null },
    { name: "Sehri End", start: "sehri_end", jamat: null },
    { name: "Zuhr", start: "zohar_start", jamat: "zohar_jamat" },
    { name: "Asr", start: "asr_start", jamat: "asr_jamat" },
    { name: "Maghrib", start: "maghrib_start", jamat: "maghrib_jamat" },
    { name: "Isha", start: "isha_start", jamat: "isha_jamat" },
  ];

  return prayers.map((pr) => ({
    Name: pr.name,
    "Start Time (24hr)": item[pr.start]?.slice(0, 5) || "",
    "Jamat Time (24hr)": item[pr.jamat]?.slice(0, 5) || "",
    "Start Time": formatTimeTo12Hour(item[pr.start]?.slice(0, 5) || ""),
    "Jamat Time": formatTimeTo12Hour(item[pr.jamat]?.slice(0, 5) || ""),
  }));
}

/** Utility: Process prayers */
export function processTomorrowsPrayer(entry) {
  if (!entry) return [];
  const item = entry;
  const prayers = [
    { name: "Fajr", start: "fajr_start", jamat: "fajr_jamat" },
    { name: "Sunrise", start: "sunrise", jamat: null },
    { name: "Sehri End", start: "sehri_end", jamat: null },
    { name: "Zuhr", start: "zohar_start", jamat: "zohar_jamat" },
    { name: "Asr", start: "asr_start", jamat: "asr_jamat" },
    { name: "Maghrib", start: "maghrib_start", jamat: "maghrib_jamat" },
    { name: "Isha", start: "isha_start", jamat: "isha_jamat" },
  ];

  return prayers.map((pr) => ({
    Name: pr.name,
    "Start Time (24hr)": item[pr.start]?.slice(0, 5) || "",
    "Jamat Time (24hr)": item[pr.jamat]?.slice(0, 5) || "",
    "Start Time": formatTimeTo12Hour(item[pr.start]?.slice(0, 5) || ""),
    "Jamat Time": formatTimeTo12Hour(item[pr.jamat]?.slice(0, 5) || ""),
  }));
}

/** Format X seconds => "Xh Ym" or "Xm Ys" or "Xs" */
export function formatCountdown(seconds) {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const remainder = seconds % 3600;
    const mins = Math.floor(remainder / 60);
    return `${hours}h ${mins}m`;
  } else if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  } else {
    return `${seconds}s`;
  }
}
