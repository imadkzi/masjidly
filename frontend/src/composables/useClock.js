import { ref, onMounted, onUnmounted } from "vue";
import { PRAYER_TICK_INTERVAL_MS } from "../utils/constants.js";

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

