<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    overlay?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    label: 'Загрузка...',
    overlay: false,
    size: 'md',
  },
);

const sizeClasses = {
  sm: {
    wrapper: 'gap-2',
    spinner: 'h-5 w-5 border-2',
    text: 'text-sm',
  },
  md: {
    wrapper: 'gap-3',
    spinner: 'h-8 w-8 border-[3px]',
    text: 'text-sm',
  },
  lg: {
    wrapper: 'gap-4',
    spinner: 'h-12 w-12 border-4',
    text: 'text-base',
  },
};
</script>

<template>
  <div
    v-if="overlay"
    class="absolute inset-0 z-50 flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-[2px]"
  >
    <div class="flex flex-col items-center justify-center" :class="sizeClasses[size].wrapper">
      <div
        class="animate-spin rounded-full border-secondary-500 border-t-transparent"
        :class="sizeClasses[size].spinner"
      />

      <p class="font-medium text-primary-700" :class="sizeClasses[size].text">
        {{ label }}
      </p>
    </div>
  </div>

  <div v-else class="flex items-center justify-center" :class="sizeClasses[size].wrapper">
    <div
      class="animate-spin rounded-full border-secondary-500 border-t-transparent"
      :class="sizeClasses[size].spinner"
    />

    <p v-if="label" class="font-medium text-primary-700" :class="sizeClasses[size].text">
      {{ label }}
    </p>
  </div>
</template>
