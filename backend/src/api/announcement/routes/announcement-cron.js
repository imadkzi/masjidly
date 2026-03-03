'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/internal/cron/announcements-expiry',
      handler: 'announcement.cronExpiry',
      config: {
        auth: false,
      },
    },
  ],
};

