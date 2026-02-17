/**
 * @typedef {Object} PrayerRowNormalized
 * @property {string} name
 * @property {string} startTime24
 * @property {string} jamatTime24
 * @property {string} startTime12
 * @property {string} jamatTime12
 * @property {any} raw Original row object for backward compatibility
 */

export function normalizePrayerRow(row) {
  if (!row) {
    return {
      name: "",
      startTime24: "",
      jamatTime24: "",
      startTime12: "",
      jamatTime12: "",
      raw: row,
    };
  }

  return {
    name: row.Name || "",
    startTime24: row["Start Time (24hr)"] || "",
    jamatTime24: row["Jamat Time (24hr)"] || "",
    startTime12: row["Start Time"] || "",
    jamatTime12: row["Jamat Time"] || "",
    raw: row,
  };
}

