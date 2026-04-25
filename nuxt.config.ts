export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    adminLogin: process.env.ADMIN_LOGIN,
    adminPassword: process.env.ADMIN_PASSWORD,
    adminSessionSecret: process.env.ADMIN_SESSION_SECRET,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpSecure: process.env.SMTP_SECURE,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    contactToEmail: process.env.CONTACT_TO_EMAIL,
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
