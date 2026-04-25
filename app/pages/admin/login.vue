<script setup lang="ts">
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
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: form,
    });

    await navigateTo('/admin/products');
  } catch {
    toast.add({
      title: 'Ошибка авторизации',
      description: 'Проверьте логин и пароль',
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
        <UInput v-model="form.login" placeholder="Логин" size="xl" />
        <UInput v-model="form.password" type="password" placeholder="Пароль" size="xl" />
        <UButton type="submit" block size="xl" :loading="isLoading">Войти</UButton>
      </form>
    </div>
  </div>
</template>
