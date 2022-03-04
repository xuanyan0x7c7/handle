<template>
  <div>
    <div class="text-3xl">
      {{ value }}
    </div>
    <div class="opacity-50 text-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ value: string | number }>();
</script>
