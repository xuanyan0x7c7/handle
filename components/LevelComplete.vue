<template>
  <section class="pt-12 pb-15">
    <div class="flex flex-col items-center">
      <ShareButton class="m-4" />
      <ToggleMask hint />
    </div>
    <div class="w-10 h-px mt-4 mb-6 mx-auto border-t border-gray-400/10" />
    <button
      :disabled="!hasNextLevel"
      class="btn flex flex-wrap gap-x-3 justify-center items-center mx-auto px-4 py-2 text-xl font-serif whitespace-nowrap"
      @click="enterNextLevel()"
    >
      下一关
    </button>
  </section>
</template>

<script setup lang="ts">
import { IDIOMS } from '@/lib/idioms';
import { useMask } from '@/lib/state';
import { currentLevel, history } from '@/lib/storage';

const nextLevel = computed(() => {
  for (let level = 0; level < IDIOMS.length; ++level) {
    const state = history.value[level];
    if (state == null || !state.passed && !state.answer) {
      return level;
    }
  }
  return null;
});

const hasNextLevel = computed(() => nextLevel.value != null);

function enterNextLevel() {
  if (hasNextLevel.value) {
    currentLevel.value = nextLevel.value!;
  }
  useMask.value = false;
}
</script>
