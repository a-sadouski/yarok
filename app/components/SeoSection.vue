<script setup lang="ts">
const seoContent = {
  title: 'Тротуарная плитка в Слуцке и Минской области',
  paragraphs: [
    'Yarok - производство и продажа тротуарной плитки, бордюров и декоративных бетонных изделий в Слуцке.',
    'В каталоге представлены вибропрессованная и вибролитая плитка, бордюры и элементы благоустройства.',
    'Мы работаем по Слуцку, Минску, Гомелю и Могилеву, предлагаем доставку и помощь в подборе продукции.',
  ],
};
</script>

<template>
  <section v-if="seoContent" class="bg-white py-10 scroll-mt-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)]">
        <div
          class="relative overflow-hidden rounded-[28px] border border-gray-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-600">О компании ЯРОК</p>

          <h2 class="mt-3 text-2xl font-extrabold leading-tight text-primary-700 sm:text-3xl">
            {{ seoContent.title }}
          </h2>

          <div class="mt-6 space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
            <p v-for="(p, i) in seoContent.paragraphs" :key="i">
              {{ p }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
