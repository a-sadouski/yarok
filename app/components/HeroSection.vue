<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>

<template>
  <section class="relative min-h-80 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <NuxtImg
        src="/images/hero.png"
        alt="Тротуарная плитка в Слуцке — укладка и варианты"
        class="absolute inset-0 h-full w-full object-cover"
        format="webp"
        quality="85"
        preload
        fetchpriority="high"
        densities="x1 x2"
      />

      <div class="absolute inset-0 bg-black/45" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/20" />
    </div>

    <div class="relative z-10 flex min-h-76 items-center">
      <div class="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div class="max-w-7xl">
          <p
            class="mb-4 text-xs inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium text-white/90 backdrop-blur"
          >
            Продажа тротуарной плитки в Беларуси
          </p>

          <p
            class="mb-4 ml-2 text-xs inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium text-white/90 backdrop-blur"
          >
            Внешнеэкономическая деятельность, оказание консультативных, инжиниринговых, маркетинговых услуг в области
            производства сахарной свеклы
          </p>

          <h1 class="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-4xl lg:text-6xl">
            Тротуарная плитка в Слуцке — купить от производителя
          </h1>

          <p class="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
            Купить тротуарную плитку в Слуцке от производителя с доставкой по Минской области. В наличии
            вибропрессованная и вибролитая плитка, бордюры и элементы благоустройства.
          </p>

          <p class="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
            Мы производим и продаём тротуарную плитку и железобетонные изделия в Слуцке, а также работаем по Минску,
            Гомелю, Могилёву и Бресту. Подберём плитку под ваш проект: классические и современные варианты, бордюры и
            элементы благоустройства. Возможна доставка и изготовление под заказ.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <UButton
              label="Оставить заявку ->"
              size="xl"
              class="bg-secondary-700 hover:bg-secondary-500 text-white justify-center rounded-full px-6 cursor-pointer"
              to="#contacts"
            />

            <UButton
              label="Смотреть каталог"
              size="xl"
              variant="soft"
              color="neutral"
              class="justify-center rounded-full px-6 bg-white/15 text-white ring-1 ring-white/20 hover:bg-white/20 cursor-pointer"
              to="/catalog"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
