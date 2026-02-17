import { formatTimeTo12Hour } from "./salaahUtils.js";

export function processJummah(entry) {
  if (!entry) return { Name: "Jummah", "Start Time": "", "Jamat Time": "" };
  const item = entry;
  return {
    Name: "Jummah",
    "Start Time (24hr)": item.jummah_1?.slice(0, 5) || "",
    "Jamat Time (24hr)": item.jummah_2?.slice(0, 5) || "",
    "Start Time": formatTimeTo12Hour(item.jummah_1?.slice(0, 5) || ""),
    "Jamat Time": formatTimeTo12Hour(item.jummah_2?.slice(0, 5) || ""),
  };
}
