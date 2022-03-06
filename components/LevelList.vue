<template>
  <section class="relative flex flex-col justify-center items-center p-5">
    <div class="absolute top-4 right-4 flex gap-3">
      <button class="icon-btn" @click="close()">
        <Icon icon="carbon-close" />
      </button>
    </div>
    <header class="mb-4 text-xl font-serif">
      <b>关卡列表</b>
    </header>
    <div class="flex gap-4 mb-4 items-center">
      <button class="btn px-2" :disabled="page === 0" @click="previousPage()">
        <Icon icon="carbon-arrow-left" />
      </button>
      <p>
        {{ page * 20 + 1 }} - {{ page * 20 + 20 }}
      </p>
      <button class="btn px-2" :disabled="page + 1 === totalPages" @click="nextPage()">
        <Icon icon="carbon-arrow-right" />
      </button>
    </div>
    <div class="grid grid-cols-2 gap-3 mb-4 font-mono font-light">
      <button
        v-for="level of range(page * 20, page * 20 + 20)"
        :key="level"
        class="btn"
        :class="getLevelStatusClass(level)"
        @click="playLevel(level)"
      >
        {{ level + 1 }} {{ levelHasAnswer(level) ? IDIOMS[level] : '????' }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IDIOMS } from '@/lib/idioms';
import { showLevelList } from '@/lib/state';
import { currentLevel, history } from '@/lib/storage';

const page = ref(Math.floor(currentLevel.value / 20));
const totalPages = computed(() => Math.ceil(IDIOMS.length / 20));

function levelHasAnswer(level: number) {
  const state = history.value[level];
  if (state == null) {
    return null;
  } else {
    return state.passed || state.answer;
  }
}

function getLevelStatusClass(level: number) {
  const state = history.value[level];
  if (state == null) {
    return 'bg-gray-400';
  } else if (state.failed) {
    return 'bg-$c-misplaced';
  } else if (state.passed) {
    return '';
  } else {
    return 'bg-gray-400';
  }
}

function* range(start: number, end: number) {
  for (let x = start; x < end; ++x) {
    yield x;
  }
}

function playLevel(level: number) {
  showLevelList.value = false;
  currentLevel.value = level;
}

function previousPage() {
  --page.value;
}

function nextPage() {
  ++page.value;
}

function close() {
  showLevelList.value = false;
}
</script>
