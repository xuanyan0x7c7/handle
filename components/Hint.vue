<template>
  <section class="flex flex-col gap-4 items-center p-8">
    <p>
      <b>{{ levelNoHanzi }}</b>
    </p>
    <p>
      答案包含以下 <b>{{ levelState.hintLevel === 'char' ? '汉字' : '字音' }}</b>
    </p>
    <CharBlock :char="levelState.hintLevel === 'char' ? parsed : marked" />
    <button
      v-if="levelState.hintLevel === 'pinyin'"
      class="btn bg-$c-misplaced"
      @click="nextHint()"
    >
      进一步提示
    </button>
  </section>
</template>

<script setup lang="ts">
import { parseWord } from '@/lib/pinyin';
import { levelAnswer, levelNoHanzi } from '@/lib/state';
import { levelState } from '@/lib/storage';

const parsed = computed(() => parseWord(levelAnswer.value.hint)[0]);
const marked = computed(() => ({ ...parsed.value, char: '?' }));

function nextHint() {
  levelState.value.hintLevel = 'char';
}
</script>
