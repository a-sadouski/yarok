<script setup lang="ts">
type Advantage = {
  title: string;
  description: string;
  icon: string;
};

const items: Advantage[] = [
  {
    title: 'Собственное производство',
    description: 'Контролируем качество продукции на каждом этапе — от подготовки смеси до готового изделия.',
    icon: 'i-lucide-factory',
  },
  {
    title: 'Высокая прочность',
    description: 'Плитка выдерживает интенсивные нагрузки, перепады температуры и длительную эксплуатацию.',
    icon: 'i-lucide-pickaxe',
  },
  {
    title: 'Быстрая доставка',
    description: 'Оперативно комплектуем заказ и организуем доставку по Слуцку и Минской области.',
    icon: 'i-lucide-zap',
  },
  {
    title: 'Большой выбор',
    description: 'В каталоге представлены разные формы, фактуры, цвета и размеры плитки.',
    icon: 'i-lucide-shapes',
  },
  {
    title: 'Вся Беларусь',
    description: 'Работаем с частными и корпоративными клиентами по всей стране.',
    icon: 'i-lucide-map',
  },
];
</script>

<template>
  <section id="advantages" class="bg-[#f6f3f2] scroll-mt-20 py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-600">Наши преимущества</p>

        <h2 class="mt-3 text-3xl font-extrabold leading-tight text-primary-700 sm:text-4xl lg:text-5xl">
          Почему выбирают Ярок
        </h2>
      </div>

      <div class="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <article
          v-for="item in items"
          :key="item.title"
          class="rounded-[24px] border border-slate-200/70 bg-white px-6 py-8 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1"
        >
          <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-600"
          >
            <UIcon :name="item.icon" class="h-6 w-6" />
          </div>

          <h3 class="mt-6 text-xl font-bold leading-snug text-primary-700">
            {{ item.title }}
          </h3>

          <p class="mt-4 text-sm leading-7 text-[#64748b]">
            {{ item.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
