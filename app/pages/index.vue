<script setup lang="ts">
import SeoSection from '~/components/SeoSection.vue';

const siteUrl = useRuntimeConfig().public.siteUrl;

useHead({
  link: [
    {
      rel: 'canonical',
      href: siteUrl,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Yarok',
        url: siteUrl,
        areaServed: ['Слуцк', 'Минская область'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Слуцк',
          addressRegion: 'Минская область',
          addressCountry: 'BY',
        },
        description: 'Производство и продажа тротуарной плитки, бордюров и декоративных бетонных изделий.',
      }),
    },
  ],
});

useSeoMeta({
  title: 'Купить тротуарную плитку в Слуцке - цены от производителя | Yarok',
  description:
    'Производство и продажа тротуарной плитки, бордюров и ЖБИ. Купить плитку в Слуцке и Минской области с доставкой.',

  ogTitle: 'Тротуарная плитка в Слуцке - Yarok',
  ogDescription: 'Каталог тротуарной плитки и ЖБИ. Производство в Слуцке, доставка по Минской области.',
  ogImage: `${siteUrl}/og-image.jpg`,
  ogUrl: siteUrl,
  ogType: 'website',
  ogSiteName: 'Yarok',

  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div class="bg-white text-gray-900">
    <AppHeader />
    <HeroSection />
    <ProductsSection />
    <AboutSection />
    <AdvantagesSection />
    <ContactsSection />
    <SeoSection />
    <AppFooter />
  </div>
</template>
