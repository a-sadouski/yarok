<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();
const isNotFound = computed(() => props.error.statusCode === 404);
useHead({
  title: () => (isNotFound.value ? 'Страница не найдена — Yarok' : 'Сервис временно недоступен — Yarok'),
  meta: [{ name: 'robots', content: 'noindex' }],
});
function retry() {
  window.location.reload();
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#f8f6f5] p-6 text-primary-700">
    <div class="max-w-lg space-y-5 text-center">
      <h1 class="text-3xl font-bold">{{ isNotFound ? 'Страница не найдена' : 'Сервис временно недоступен' }}</h1>
      <p>
        {{
          isNotFound
            ? 'Проверьте адрес или вернитесь на главную страницу.'
            : 'Не удалось загрузить данные. Подождите немного и повторите попытку.'
        }}
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <UButton v-if="!isNotFound" label="Повторить загрузку" @click="retry" />
        <UButton label="На главную" variant="soft" @click="clearError({ redirect: '/' })" />
      </div>
    </div>
  </main>
</template>
