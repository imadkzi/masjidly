module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
        secure: true,
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "Masjidly <salaam@masjidly.co.uk>",
        defaultReplyTo: "Masjidly <salaam@masjidly.co.uk>",
      },
    },
  },
  "strapi-csv-import-export": {
    config: {
      authorizedExports: ["api::salaah-time.salaah-time"],
      authorizedImports: ["api::salaah-time.salaah-time"],
    },
  },
});
