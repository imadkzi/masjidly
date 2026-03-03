'use strict';

/**
 * announcement controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::announcement.announcement', ({ strapi }) => ({
  async cronExpiry(ctx) {
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret) {
      const provided = ctx.request.query.secret;
      if (!provided || provided !== expectedSecret) {
        return ctx.unauthorized('Invalid or missing cron secret');
      }
    }

    const { deleted } = await strapi
      .service('api::announcement.announcement')
      .deleteExpired();

    strapi.log.info(`[cron] HTTP announcement expiry ran. Deleted: ${deleted}`);
    ctx.body = { deleted };
  },
}));
