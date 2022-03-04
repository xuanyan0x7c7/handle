<template>
  <section class="relative flex flex-col justify-center items-center p-5">
    <div class="absolute top-4 right-4 flex gap-3">
      <button class="icon-btn" @click="close()">
        <Icon icon="carbon-close" />
      </button>
    </div>
    <header class="mb-4 text-xl font-serif">
      <b>拼音速查表</b>
    </header>
    <div class="grid grid-cols-[1fr_3fr] gap-x-10 gap-y-4 mb-4 font-mono font-light">
      <div class="text-center">
        声母
      </div>
      <div class="text-center">
        韵母
      </div>
      <div class="grid grid-cols-2 gap-3 h-min">
        <div
          v-for="initial of pinyinInitials"
          :key="initial"
          :class="getSymbolClass(initial, 'displayInitial')"
        >
          {{ initial }}
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3 h-min">
        <div
          v-for="final of pinyinFinals"
          :key="final"
          :class="getSymbolClass(final, 'final')"
        >
          {{ final }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getSymbolState, showCheatSheet } from '@/lib/state';
import { pinyinInitials, pinyinFinals } from '@/lib/pinyin/util';

function getSymbolClass(symbol: string, key?: 'displayInitial' | 'final') {
  const state = getSymbolState(symbol, key);
  if (!state) {
    return '';
  }
  return {
    exact: 'text-$c-ok',
    misplaced: 'text-$c-misplaced',
    none: 'opacity-30',
  }[state];
}

function close() {
  showCheatSheet.value = false;
}
</script>
