export default ({ env }) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-supabase',
      providerOptions: {
        apiUrl: env('SUPABASE_API_URL'),
        apiKey: env('SUPABASE_API_KEY'),
        bucket: env('SUPABASE_BUCKET'),
        directory: env('SUPABASE_DIRECTORY'),
        options: {}
      },
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
    },
  },
  "fuzzy-search": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::produit.produit",
          modelName: "produit",
          fuzzysortOptions: {
            limit: 10,
            characterLimit: 500,
            keys: [
              {
                name: "name",
                weight: 0.1,
              },
              {
                name: "description",
                weight: -0.1,
              },
            ],
          },
        },
      ],
    },
  },
});
