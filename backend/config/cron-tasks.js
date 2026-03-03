/**
 * Cron tasks
 *
 * Enable with CRON_ENABLED=true in .env. On Railway set CRON_ENABLED=true.
 *
 * For testing: schedule is set to every minute so you can see it run.
 * After testing, change back to '0 0 * * *' (midnight daily).
 */

module.exports = {
  // Every minute (for testing) — change to '0 0 * * *' for production (midnight daily)
  "*/10 * * * *": async ({ strapi }) => {
    const { deleted } = await strapi
      .service("api::announcement.announcement")
      .deleteExpired();
    strapi.log.info(`[cron] Announcement expiry ran. Deleted: ${deleted}`);
  },
};
