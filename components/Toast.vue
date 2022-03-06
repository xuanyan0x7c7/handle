<template>
  <div
    class="fixed top-0 inset-x-0 flex justify-center items-center transition-all pointer-events-none"
    :class="{ 'opacity-0 -translate-y-10px': !modelValue }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue?: boolean }>();
</script>
