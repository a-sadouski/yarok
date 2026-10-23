<script setup lang="ts">
import { reactive } from 'vue';
import { getApiErrorMessage } from '~/utils/api-error';
import { ContactsApi } from '~/api/contacts.api';

const contactItems = [
  {
    title: 'Режим работы',
    value: 'Вт-Пт: 08:00–17:00, Сб: 08:00–16:30, Вс-Пн: выходной',
    icon: 'i-lucide-clock-3',
  },
  {
    title: 'Телефон',
    value: '+375 29 103-98-09',
    icon: 'i-lucide-phone',
  },
  {
    title: 'Адрес офиса и склада',
    value: 'г. Слуцк, ул. М. Богдановича, 220',
    icon: 'i-lucide-map-pin',
  },
  {
    title: 'Email',
    value: 'art-beton@tut.by',
    icon: 'i-lucide-mail',
  },
];

const toast = useToast();

const isLoading = ref(false);

const formState = reactive({
  name: '',
  phone: '',
  comment: '',
  company: '',
});

async function submitRequest() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await ContactsApi.sendEMail(formState);

    toast.add({
      title: 'Заявка отправлена',
      description: 'Мы свяжемся с вами в ближайшее время',
      color: 'success',
    });

    formState.name = '';
    formState.phone = '';
    formState.comment = '';
    formState.company = '';
  } catch (error) {
    toast.add({
      title: 'Ошибка отправки',
      description: getApiErrorMessage(error, 'Не удалось отправить заявку. Попробуйте ещё раз позже.'),
      color: 'error',
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <section id="contacts" class="relative scroll-mt-20 overflow-hidden py-10">
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-[#382A25]/80" />
      <div class="absolute inset-0 bg-gradient-to-r from-[#382A25]/92 via-[#382A25]/82 to-[#382A25]/58" />
    </div>

    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(340px,1.2fr)] lg:items-start lg:gap-10">
        <div class="text-white">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-500">Контакты</p>

          <h2 class="mt-3 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Свяжитесь с нами для консультации
          </h2>

          <div class="mt-4 grid gap-6 sm:grid-cols-2">
            <div
              v-for="item in contactItems"
              :key="item.title"
              class="flex items-start gap-4 rounded-2xl p-4 pl-0 backdrop-blur-sm"
            >
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-secondary-500/30 bg-secondary-500/10 text-secondary-500"
              >
                <UIcon :name="item.icon" class="h-5 w-5" />
              </div>

              <div>
                <h3 class="text-lg font-semibold text-white">
                  {{ item.title }}
                </h3>

                <p class="mt-1 text-base leading-7 text-white/75">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm"
          >
            <YMap :center="[52.9974267, 27.5939992]" :zoom="12" height="260px" />
          </div>
        </div>

        <div class="h-full rounded-[28px] bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-8">
          <h3 class="text-2xl font-bold text-primary-700">Отправьте нам сообщение</h3>

          <UForm :state="formState" class="mt-8 space-y-5" @submit="submitRequest">
            <div class="hidden" aria-hidden="true">
              <input v-model="formState.company" type="text" tabindex="-1" autocomplete="off" >
            </div>

            <UFormField label="Ваше имя" name="name">
              <UInput
                v-model="formState.name"
                size="xl"
                placeholder="Иван Иванов"
                class="w-full"
                :ui="{ base: 'h-12 rounded-xl' }"
              />
            </UFormField>

            <UFormField label="Телефон" name="phone">
              <UInput
                v-model="formState.phone"
                size="xl"
                placeholder="+375 (__) ___-__-__"
                class="w-full"
                :ui="{ base: 'h-12 rounded-xl' }"
              />
            </UFormField>

            <UFormField label="Комментарий" name="comment">
              <UTextarea
                v-model="formState.comment"
                :rows="5"
                placeholder="Напишите, что вас интересует..."
                class="w-full"
                :ui="{ base: 'rounded-xl' }"
              />
            </UFormField>

            <UButton
              type="submit"
              block
              size="xl"
              label="Отправить заявку"
              class="mt-2 rounded-xl bg-secondary-600 text-white hover:bg-secondary-500 disabled:bg-secondary-300 disabled:opacity-100"
              :loading="isLoading"
              :disabled="isLoading"
            />

            <p class="text-xs leading-5 text-slate-400">
              Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных.
            </p>
          </UForm>
        </div>
      </div>
    </div>
  </section>
</template>
