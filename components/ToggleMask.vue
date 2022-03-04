<template>
  <button
    class="square-btn gap-1 m-a"
    :class="buttonClass"
    @click="toggleMask()"
  >
    <Icon :icon="useMask ? 'carbon-view-off' : 'carbon-view'" />
    {{ useMask ? '遮罩开启' : '遮罩关闭' }}
  </button>
  <p v-if="hint" class="my-2 opacity-50">
    分享时建议开启遮罩避免剧透
  </p>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';
import { useMask } from '@/lib/state';

const props = defineProps<{ hint?: boolean }>();

const toggleMask = useToggle(useMask);

const buttonClass = computed(() => {
  if (useMask.value) {
    return 'text-$c-primary';
  } else if (props.hint) {
    return 'opacity-50';
  } else {
    return '';
  }
});
</script>
