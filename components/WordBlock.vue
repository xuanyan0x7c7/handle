<template>
  <div class="flex">
    <div
      v-for="parsedChar, index in parseWord(word.padEnd(4, ' '))"
      :key="index"
      class="relative w-20 h-20 m-1 transform-3d select-none"
    >
      <template v-if="animate">
        <CharBlock
          :char="parsedChar"
          :active="active"
          class="!absolute top-0 left-0 transform-gpu transition-transform duration-600 backface-hidden"
          :class="{ 'rotate-y-180': flip }"
          :style="{ transitionDelay: `${index * (300 + Math.random() * 50)}ms` }"
        />
        <CharBlock
          :char="parsedChar"
          :answer="result[index]"
          class="!absolute top-0 left-0 transform-gpu transition-transform duration-600 backface-hidden"
          :class="{ 'rotate-y-180': !flip }"
          :style="{
            transitionDelay: `${index * (300 + Math.random() * 50)}ms`,
            animationDelay: `${index * (100 + Math.random() * 50)}ms`
          }"
        />
      </template>
      <CharBlock
        v-else
        :char="parsedChar"
        :answer="result[index]"
        :active="active"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { matchAnswer, parseWord } from '@/lib/pinyin';
import { parsedAnswer } from '@/lib/state';

const props = withDefaults(
  defineProps<{
    word: string;
    revealed?: boolean;
    answer?: string;
    animate?: boolean;
    active?: boolean;
  }>(),
  { answer: undefined, animate: true },
);

const result = computed(() => {
  if (props.revealed) {
    return matchAnswer(
      parseWord(props.word),
      props.answer ? parseWord(props.answer) : parsedAnswer.value,
    );
  }
  return [];
});

const flip = ref(false);

watch(
  () => props.revealed,
  revealed => {
    if (revealed) {
      setTimeout(() => {
        flip.value = true;
      }, Math.random() * 300);
    }
  },
  { immediate: true },
);
</script>
