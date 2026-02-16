// Generic time-related helpers shared across the app

/**
 * Convert a 24-hour time string "HH:MM" into seconds since midnight.
 * Returns null if the input is invalid.
 */
export function time24ToSeconds(time24) {
  if (!time24 || typeof time24 !== "string") return null;
  const [hh, mm] = time24.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 3600 + mm * 60;
}

/**
 * Return seconds until a given 24-hour time from "now".
 * Handles wrap-around to the next day.
 */
export function secondsUntil(time24, now = new Date()) {
  const targetSec = time24ToSeconds(time24);
  if (targetSec == null) return null;

  const currentSec =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  let diff = targetSec - currentSec;
  if (diff < 0) diff += 24 * 3600;
  return diff;
}

/**
 * Check whether a given 24‑hour time has already passed relative to "now".
 */
export function hasTimePassed(time24, now = new Date()) {
  const targetSec = time24ToSeconds(time24);
  if (targetSec == null) return false;

  const currentSec =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  return currentSec >= targetSec;
}

/**
 * Re-export countdown formatting so callers can import from a single place.
 * The implementation lives in salaahUtils to avoid duplication.
 */
export { formatCountdown } from "./salaahUtils.js";

