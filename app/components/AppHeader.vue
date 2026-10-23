<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const toast = useToast();

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const clickTimestamps = ref<number[]>([]);

const navItems = [
  { label: 'Каталог', to: '/catalog' },
  { label: 'О нас', to: '/#about' },
  { label: 'Почему мы', to: '/#advantages' },
  { label: 'Контакты', to: '/#contacts' },
];

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

function handleScroll() {
  isScrolled.value = window.scrollY > 16;
}

function onOrderCallClick() {
  const now = Date.now();

  clickTimestamps.value = clickTimestamps.value.filter(timestamp => now - timestamp < 1500);

  clickTimestamps.value.push(now);

  if (clickTimestamps.value.length > 1) {
    toast.add({
      title: 'Пожалуйста, заполните заявку',
      color: 'neutral',
    });

    return;
  }
}

onMounted(() => {
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50">
    <div class="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div
        class="transition-all duration-300"
        :class="[
          isScrolled
            ? 'rounded-2xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.14)] backdrop-blur'
            : 'rounded-2xl bg-white shadow-[0_6px_18px_rgba(15,23,42,0.08)] backdrop-blur',
        ]"
      >
        <div class="flex items-center justify-between px-4 py-3 md:px-6">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 text-sm font-bold tracking-wide text-primary-700"
            @click="closeMobileMenu"
          >
            <img src="/images/logo.png" alt="Ярок" class="h-8 w-auto" >
          </NuxtLink>

          <nav class="hidden items-center gap-8 md:flex">
            <a
              v-for="item in navItems"
              :key="item.label"
              :href="item.to"
              class="text-md font-medium text-menu-700 transition-colors hover:text-secondary-600"
            >
              {{ item.label }}
            </a>
          </nav>

          <div class="hidden items-center gap-3 md:flex">
            <a href="tel:+375290000000" class="whitespace-nowrap text-md font-semibold text-primary-700">
              +375 (29) 103-98-09
            </a>

            <UButton
              label="Заказать звонок"
              size="md"
              class="cursor-pointer rounded-full bg-secondary-700 px-4 py-2 text-md text-white hover:bg-secondary-500"
              to="#contacts"
              @click="onOrderCallClick"
            />
          </div>

          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary-700 transition hover:bg-slate-100 md:hidden cursor-pointer"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Открыть меню"
            @click="toggleMobileMenu"
          >
            <UIcon :name="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="h-5 w-5" />
          </button>
        </div>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="isMobileMenuOpen" class="border-t border-secondary-600 px-4 pb-4 pt-1 md:hidden">
            <nav class="flex flex-col gap-1">
              <a
                v-for="item in navItems"
                :key="item.label"
                :href="item.to"
                class="rounded-xl px-3 py-3 text-sm text-center font-medium text-menu-700 transition-colors hover:bg-slate-50 hover:text-secondary-600"
                @click="closeMobileMenu"
              >
                {{ item.label }}
              </a>
            </nav>

            <div class="mt-4 flex flex-col gap-3">
              <a href="tel:+375291039809" class="text-sm text-center font-semibold text-primary-700">
                +375 (29) 103-98-09
              </a>

              <UButton
                label="Заказать звонок"
                to="#contacts"
                block
                size="md"
                class="cursor-pointer rounded-full bg-secondary-700 text-white hover:bg-secondary-500"
                @click="onOrderCallClick"
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>
