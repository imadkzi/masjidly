import moment from "moment-hijri";

/**
 * Determine whether the UI should be in "Ramadan mode".
 *
 * - Can be forced via URL param:  ?ramadan=true or ?ramadan=false
 * - Can be forced via env var:   VITE_FORCE_RAMADAN=true or VITE_FORCE_RAMADAN=false
 * - Otherwise, falls back to the actual Hijri month.
 */
export function isRamadanNow(options = {}) {
  const { respectUrl = true, respectEnv = true } = options;

  // 1) URL flag (useful for quick manual testing)
  if (respectUrl && typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const ramadanParam = params.get("ramadan");
    if (ramadanParam === "true") {
      return true;
    }
    if (ramadanParam === "false") {
      return false; // Explicitly disable Ramadan mode
    }
  }

  // 2) Environment flag (useful for TV builds / deployments)
  if (respectEnv) {
    const forceRamadan = import.meta.env.VITE_FORCE_RAMADAN;
    if (forceRamadan === "true") {
      return true;
    }
    if (forceRamadan === "false") {
      return false; // Explicitly disable Ramadan mode
    }
  }

  // 3) Real Hijri month check (only if no test flags are set)
  moment.locale("en");
  const hijriMonth = moment().format("iMMMM");
  return hijriMonth === "Ramadhan";
}

