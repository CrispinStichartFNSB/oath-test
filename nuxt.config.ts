import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },
  modules: ["@pinia/nuxt"],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      script: [
        {
          src: "https://connect.facebook.net/en_US/sdk.js",
          async: true,
          defer: true,
          crossorigin: "anonymous",
        },
      ],
    },
  },
});
