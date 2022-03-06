<template>
  <div class="flex">
    <div
      v-for="parsedChar, index in parseWord(formattedWord)"
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
          :match="wordMatchResult[index]?.matchResult"
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
        :match="wordMatchResult[index]?.matchResult"
        :active="active"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseAndMatchAnswer, parseWord } from '@/lib/pinyin';
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

const formattedWord = computed(() => props.word.padEnd(4, ' ').slice(0, 4));

const wordMatchResult = computed(() => {
  if (props.revealed) {
    return parseAndMatchAnswer(
      formattedWord.value,
      props.answer ? parseWord(props.answer) : parsedAnswer.value,
    );
  } else {
    return [];
  }
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
