<template>
  <footer class="my-1 opacity-50 text-center text-sm whitespace-nowrap">
    <template v-if="level">
      {{ levelNoHanzi }} ·
    </template>
    {{ levelMode }} ·
    {{ formatDuration(levelState.duration ?? 0) }}
  </footer>
</template>

<script setup lang="ts">
import { levelNoHanzi } from '@/lib/state';
import { levelState } from '@/lib/storage';
import { formatDuration } from '@/lib/util';

defineProps<{ level?: boolean }>();

const levelMode = computed(() => {
  if (levelState.value.mode === 'nightmare') {
    return '地狱模式';
  } else if (levelState.value.mode === 'hard') {
    return '困难模式';
  } else if (levelState.value.hintLevel == null) {
    return '无提示';
  } else if (levelState.value.hintLevel === 'pinyin') {
    return '字音提示';
  } else {
    return '汉字提示';
  }
});
</script>
