export function time24ToSeconds(time24) {
  if (!time24 || typeof time24 !== "string") return null;
  const [hh, mm] = time24.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 3600 + mm * 60;
}

export function secondsUntil(time24, now = new Date()) {
  const targetSec = time24ToSeconds(time24);
  if (targetSec == null) return null;

  const currentSec =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  let diff = targetSec - currentSec;
  if (diff < 0) diff += 24 * 3600;
  return diff;
}

export function hasTimePassed(time24, now = new Date()) {
  const targetSec = time24ToSeconds(time24);
  if (targetSec == null) return false;

  const currentSec =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  return currentSec >= targetSec;
}

export { formatCountdown } from "./salaahUtils.js";

