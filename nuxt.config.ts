export default defineNuxtConfig({
  // Keep browser requests and admin cookies on the Nuxt origin.
  routeRules: {
    '/api/**': {
      proxy: `${process.env.YAROK_BACKEND_URL || 'http://localhost:5050'}/api/**`,
    },
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },

  runtimeConfig: {
    public: {
      yandexMapsApiKey: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
    },
  },

  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image', '@nuxtjs/sitemap'],

  sitemap: {
    exclude: ['/admin/**'],
    urls: [
      '/',
      '/catalog',
      '/catalog/vibropressovannaya-plitka',
      '/catalog/vibrolitaya-plitka',
      '/catalog/bordyury',
      '/catalog/dekorativnye-izdeliya',
    ],
  },

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',
});
