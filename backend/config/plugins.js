module.exports = ({ env }) => {
  const config = {
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
  };

  // Storage: cloudinary (online) or local filesystem (offline). Default: local.
  if (env("STORAGE_PROVIDER", "local") === "cloudinary") {
    config.upload = {
      config: {
        provider: "cloudinary",
        providerOptions: {
          cloud_name: env("CLOUDINARY_CLOUD_NAME") || env("CLOUDINARY_NAME"),
          api_key: env("CLOUDINARY_API_KEY") || env("CLOUDINARY_KEY"),
          api_secret: env("CLOUDINARY_API_SECRET") || env("CLOUDINARY_SECRET"),
          secure: true,
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    };
  }
  // When STORAGE_PROVIDER=local, Strapi uses default local provider (./public/uploads).

  return config;
};
