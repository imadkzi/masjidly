/**
 * Schedules a callback to run at the next 10 minutes past midnight (00:10:00 local time),
 * then reschedules so it runs every night at 00:10.
 *
 * @param {() => void | Promise<void>} callback - Function to run at each midnight
 * @returns {() => void} cancel - Call to clear the scheduled timeout and stop future runs
 */
export function scheduleAtMidnight(callback) {
  let timeoutId = null;

  function runAtNextMidnight() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    // Run slightly after midnight so backend cron/DB cleanup has time to complete
    tomorrow.setHours(0, 10, 0, 0);
    const msUntilMidnight = tomorrow - now;

    timeoutId = setTimeout(() => {
      callback();
      runAtNextMidnight();
    }, msUntilMidnight);
  }

  runAtNextMidnight();

  return function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
}
