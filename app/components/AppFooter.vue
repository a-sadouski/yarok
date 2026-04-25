<script setup lang="ts">
const contactLinks = [
  {
    label: '+375 (29) 103-98-09',
    href: 'tel:+375291039809',
    icon: 'i-lucide-phone',
  },
  {
    label: 'art-beton@tut.by',
    href: 'mailto:info@yark.by',
    icon: 'i-lucide-mail',
  },
  {
    label: 'г. Слуцк, ул. М. Богдановича, 220',
    href: '#contacts',
    icon: 'i-lucide-map-pin',
  },
];
</script>

<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-center">
        <div class="max-w-sm">
          <NuxtLink to="/" class="inline-flex items-center">
            <img src="/images/logo.png" alt="Ярок" class="h-14 w-auto" />
          </NuxtLink>
        </div>

        <div class="flex flex-col xl:flex-row xl:justify-between mt-5 sm:mt-0">
          <h3 class="flex items-center text-sm font-extrabold uppercase tracking-[0.08em] text-primary-700">
            Контакты
          </h3>

          <div class="flex flex-col xl:flex-row mt-2 xl:mt-0">
            <a
              v-for="item in contactLinks"
              :key="item.label"
              :href="item.href"
              class="flex items-start gap-3 xl:ml-10 text-lg text-slate-700 transition-colors hover:text-secondary-600"
            >
              <UIcon :name="item.icon" class="mt-1 h-5 w-5 shrink-0 text-secondary-600" />
              <span>{{ item.label }}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-6 border-t border-slate-200 pt-6">
        <div class="flex flex-col gap-4 text-xs text-slate-700 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Ярок. Все права защищены.</p>

          <div class="flex flex-wrap gap-x-6 gap-y-2">
            <a class="text-xs">
              Информация размещенная на сайте не является публичной офертой в соответствии со ст. 407 гражданского
              кодекса РБ и носит справочный характер.
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
