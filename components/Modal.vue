<template>
  <aside
    class="fixed z-40"
    :class="[directionClass, { 'inset-0': mask, 'pointer-events-none': !modelValue }]"
  >
    <div
      class="absolute inset-0 bg-base transition-opacity duration-500 ease-out"
      :class="modelValue ? 'opacity-50' : 'opacity-0'"
      @click="$emit('update:modelValue', false)"
    />
    <div
      class="absolute bg-base border-gray-400/10 transition-all duration-200 ease-out max-w-screen max-h-screen-display overflow-auto transform"
      :class="[...positionClass, transformClass]"
    >
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    direction?: 'top' | 'bottom' | 'left' | 'right';
    mask?: boolean;
  }>(),
  {
    modelValue: false,
    direction: 'bottom',
    mask: true,
  },
);

defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

const directionClass = computed(() => {
  switch (props.direction) {
    case 'top':
      return 'top-0 inset-x-0';
    case 'bottom':
      return 'bottom-0 inset-x-0';
    case 'left':
      return 'inset-y-0 left-0';
    case 'right':
      return 'inset-y-0 right-0';
  }
});

const positionClass = computed(() => {
  const list = directionClass.value.split(' ');
  switch (props.direction) {
    case 'top':
      list.push('border-b');
      break;
    case 'bottom':
      list.push('border-t');
      break;
    case 'left':
      list.push('border-r', 'w-max');
      break;
    case 'right':
      list.push('border-l', 'w-max');
      break;
  }
  return list;
});

const transformClass = computed(() => {
  if (props.modelValue) {
    return '';
  }
  switch (props.direction) {
    case 'top':
      return '-translate-y-full';
    case 'bottom':
      return 'translate-y-full';
    case 'left':
      return '-translate-x-full';
    case 'right':
      return 'translate-x-full';
    default:
      return '';
  }
});
</script>
