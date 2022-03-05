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
          <div v-if="charDisplay.initial" class="flex mx-px">
            <div v-for="c, index of charDisplay.initial" :key="index" class="relative">
              <span :class="getColorClass(parsed.displayInitial)">{{ c }}</span>
              <ToneSymbol
                v-if="!useNumberTone && toneCharLocation === index"
                :tone="char.tone"
                class="absolute w-[86%] left-[8%]"
                :class="[getColorClass(parsed.tone), useMask ? 'bottom-5' : 'bottom-3.2']"
              />
            </div>
          </div>
          <div v-if="charDisplay.final" class="flex mx-px">
            <div v-for="c, index of charDisplay.final" :key="index" class="relative">
              <span :class="getColorClass(parsed.final)">{{ c }}</span>
              <ToneSymbol
                v-if="!useNumberTone && toneCharLocation === charDisplay.initial.length + index"
                :tone="char.tone"
                class="absolute w-[86%] left-[8%]"
                :class="[
                  getColorClass(parsed.tone),
                  {
                    'bottom-5': useMask,
                    'bottom-4': !useMask && c === 'ü',
                    'bottom-3.2': !useMask && c !== 'ü',
                  }
                ]"
              />
            </div>
          </div>
          <div
            v-if="useNumberTone"
            class="-mt-1 ml-px -mr-3 text-xs leading-1em"
            :class="getColorClass(parsed?.tone)"
          >
            {{ char.tone }}
          </div>
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
    none: [isChar ? 'opacity-80' : 'opacity-35'],
    deleted: ['opacity-30', 'line-through'],
  };
  return [...classList, ...colors[matchType]];
}
</script>
