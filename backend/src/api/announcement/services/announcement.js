'use strict';

/**
 * announcement service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::announcement.announcement', ({ strapi }) => ({
  /**
   * Delete announcements whose enddate is before today. Used by cron and by dev test route.
   * @returns {{ deleted: number }}
   */
  async deleteExpired() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);

    const docs = await strapi.documents('api::announcement.announcement').findMany({
      filters: { enddate: { $lt: todayStr } },
      fields: ['documentId'],
    });

    let deleted = 0;
    for (const doc of docs) {
      await strapi.documents('api::announcement.announcement').delete({
        documentId: doc.documentId,
      });
      deleted += 1;
    }

    return { deleted };
  },
}));
