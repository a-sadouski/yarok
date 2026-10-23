<script setup lang="ts">
import { getApiErrorMessage, getApiErrorStatus } from '~/utils/api-error';
import { AdminApi } from '~/api/admin.api';
const toast = useToast();

const form = reactive({
  login: '',
  password: '',
});

const isLoading = ref(false);

async function onSubmit() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await AdminApi.login(form);

    await navigateTo('/admin/products');
  } catch (error) {
    toast.add({
      title: 'Ошибка авторизации',
      description:
        getApiErrorStatus(error) === 401
          ? 'Проверьте логин и пароль'
          : getApiErrorMessage(error, 'Сервис входа недоступен. Повторите попытку позже.'),
      color: 'error',
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[#f8f6f5] px-4">
    <div class="w-full max-w-md rounded-[28px] bg-white p-8 shadow-sm">
      <h2 class="text-2xl font-bold text-primary-700">Вход в админку</h2>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Логин" required
          ><UInput v-model="form.login" autocomplete="username" :maxlength="200" required placeholder="Логин" size="xl"
        /></UFormField>
        <UFormField label="Пароль" required
          ><UInput
            v-model="form.password"
            autocomplete="current-password"
            :maxlength="1024"
            required
            type="password"
            placeholder="Пароль"
            size="xl"
        /></UFormField>
        <UButton type="submit" block size="xl" :loading="isLoading" :disabled="isLoading">Войти</UButton>
      </form>
    </div>
  </div>
</template>
