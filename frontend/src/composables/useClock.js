import { ref, onMounted, onUnmounted } from "vue";
import { PRAYER_TICK_INTERVAL_MS } from "../utils/constants.js";

// Shared "now" ref and interval so multiple components can subscribe
// without starting multiple timers.
const now = ref(new Date());
let intervalId = null;
let subscriberCount = 0;

function startClock() {
  if (intervalId !== null) return;
  intervalId = setInterval(() => {
    now.value = new Date();
  }, PRAYER_TICK_INTERVAL_MS);
}

function stopClockIfUnused() {
  if (subscriberCount === 0 && intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * useClock
 *
 * Provides a reactive "now" Date that updates every PRAYER_TICK_INTERVAL_MS.
 * All consumers share a single timer under the hood.
 */
export function useClock() {
  onMounted(() => {
    subscriberCount += 1;
    startClock();
  });

  onUnmounted(() => {
    subscriberCount = Math.max(0, subscriberCount - 1);
    stopClockIfUnused();
  });

  return { now };
}

