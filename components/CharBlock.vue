<template>
  <div
    class="relative flex justify-center items-center w-20 h-20 border-2 leading-1em font-serif"
    :class="blockColorClass"
  >
    <template v-if="char?.char">
      <div
        class="text-3xl leading-1em"
        :class="[getColorClass(parsed.char, true), useMask ? 'mt-6': 'mt-4']"
      >
        {{ char.char }}
      </div>
      <div
        class="absolute inset-x-0 flex flex-col items-center text-center font-mono font-thin"
        :class="useMask ? 'top-14px' : 'top-11px'"
      >
        <div class="relative flex justify-center items-start m-auto">
          <div v-if="charDisplay.initial" class="mx-1px" :class="getColorClass(parsed.displayInitial)">
            {{ charDisplay.initial }}
          </div>
          <div v-if="charDisplay.final" class="mx-1px" :class="getColorClass(parsed.final)">
            {{ charDisplay.final }}
          </div>
          <div
            v-if="useNumberTone"
            class="-mt-1 ml-1px -mr-3 text-xs leading-1em"
            :class="getColorClass(parsed?.tone)"
          >
            {{ char.tone }}
          </div>
          <ToneSymbol
            v-else
            :tone="char.tone"
            class="absolute -mt-1 transform"
            :class="[
              getColorClass(parsed.tone),
              { '-translate-y-1px': raiseTone && !useMask }
            ]"
            :style="{
              left: toneCharLeftOffset + 'px',
              top: useMask ? '-8px' : '-1.2px'
            }"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getSymbolState, useMask } from '@/lib/state';
import { checkAssist, useNumberTone } from '@/lib/storage';
import type { ExtendedMatchResult, ExtendedMatchType, MatchResult, ParsedChar } from '@/lib/types';

const props = defineProps<{
  char?: ParsedChar;
  answer?: MatchResult;
  active?: boolean;
}>();

const exact = computed(() => props.answer && Object.values(props.answer).every(type => type === 'exact'));

const toneCharLocation = computed(() => {
  const part = props.char?.pinyin ?? '';
  return [
    part.lastIndexOf('iu') > -1 ? part.lastIndexOf('iu') + 1 : -1,
    part.lastIndexOf('a'),
    part.lastIndexOf('e'),
    part.lastIndexOf('o'),
    part.lastIndexOf('i'),
    part.lastIndexOf('u'),
    part.lastIndexOf('ü'),
  ].find(x => x >= 0) ?? 0;
});

const toneCharLeftOffset = computed(() => {
  if (props.char == null) {
    return 0;
  }
  const gaps = toneCharLocation.value < props.char.initial.length ? 0 : 1;
  return 1 + toneCharLocation.value * 10.2 + gaps * 2.3;
});

const charDisplay = computed(() => {
  if (props.char == null) {
    return { initial: '', final: '' };
  }
  return {
    initial: props.char.displayInitial,
    final: !useNumberTone.value && props.char.tone && props.char.pinyin[toneCharLocation.value] === 'i'
      ? props.char.displayFinal.replace('i', 'ı')
      : props.char.displayFinal,
  };
});

const parsed = computed(() => {
  if (props.answer) {
    return props.answer;
  } else if (!props.char || !checkAssist.value || !props.active) {
    return {};
  }
  return {
    displayInitial: getSymbolState(props.char.displayInitial) === 'none' ? 'deleted' : undefined,
    final: getSymbolState(props.char.final) === 'none' ? 'deleted' : undefined,
    tone: getSymbolState(props.char.tone, 'tone') === 'none' ? 'deleted' : undefined,
  } as Partial<ExtendedMatchResult>;
});

const raiseTone = computed(() => props.char?.pinyin[toneCharLocation.value] === 'v');

const blockColorClass = computed(() => {
  if (!props.answer) {
    return 'border-gray-400/10';
  } else if (exact.value) {
    return 'border-transparent bg-$c-ok text-white';
  } else {
    return 'border-transparent bg-gray-400/8';
  }
});

function getColorClass(matchType?: ExtendedMatchType, isChar = false) {
  const classList: string[] = [];
  if (useMask.value) {
    classList.push('bg-current', 'border', 'border-current', isChar ? '!opacity-70' : '!opacity-30');
  }
  if (matchType == null || exact.value) {
    return classList;
  }
  const colors = {
    exact: ['text-$c-ok'],
    misplaced: ['text-$c-misplaced'],
    none: [isChar ? 'opacity-80' : 'opacity-40'],
    deleted: ['opacity-30', 'line-through'],
  };
  return [...classList, ...colors[matchType]];
}
</script>
