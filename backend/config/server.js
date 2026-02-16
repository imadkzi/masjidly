module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("PUBLIC_URL", "https://admin.masjidly.co.uk"),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
  http: {
    serverOptions: {
      requestTimeout: 30 * 60 * 1000, // 30 minutes for slow uploads
    },
  },
});
