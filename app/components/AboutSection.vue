<script setup lang="ts">
const features = [
  'Современное вибропрессовое оборудование',
  'Строгий контроль качества на каждом этапе',
  'Высокая прочность и точная геометрия плитки',
];
</script>

<template>
  <section id="about" class="bg-white scroll-mt-20 py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div class="relative">
          <div class="absolute -left-3 top-6 h-16 w-16 rounded-full bg-secondary-100" />

          <div class="relative overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <img
              src="/images/production.png"
              alt="Производство тротуарной плитки"
              class="h-[420px] w-full object-cover sm:h-[480px] lg:h-[520px]"
            >
          </div>

          <div
            class="absolute -bottom-5 right-4 rounded-2xl bg-secondary-600 px-6 py-5 text-white shadow-[0_18px_40px_rgba(211,49,49,0.28)] sm:right-8"
          >
            <div class="text-4xl font-extrabold leading-none">20+</div>
            <div class="mt-2 text-sm font-medium text-white/90">лет опыта на рынке</div>
          </div>
        </div>

        <div class="max-w-xl">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-600">О производстве</p>

          <h2 class="mt-3 text-3xl font-extrabold leading-tight text-primary-700 sm:text-4xl lg:text-5xl">
            Качество, проверенное временем
          </h2>

          <p class="mt-6 text-base leading-8 text-menu-700 sm:text-lg">
            Наше предприятие оснащено современным автоматизированным оборудованием для производства вибропрессованной и
            вибролитой плитки. Это позволяет добиваться точной геометрии, высокой плотности бетона и стабильного
            качества каждой партии продукции.
          </p>

          <ul class="mt-8 space-y-4">
            <li v-for="feature in features" :key="feature" class="flex items-start gap-3">
              <span
                class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-secondary-200 text-secondary-600"
              >
                <UIcon name="i-lucide-check" class="h-4 w-4" />
              </span>

              <span class="text-sm font-medium leading-6 text-primary-700 sm:text-base">
                {{ feature }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
