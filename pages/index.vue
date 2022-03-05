<template>
  <div>
    <header class="flex flex-col items-center pt-4 text-3xl">
      {{ numberToHanzi(currentLevel + 1) }}
    </header>
    <div class="flex flex-col items-center pt-4">
      <section class="contents">
        <WordBlock
          v-for="word, index in trials"
          :key="index"
          :word="word"
          revealed
          @click="focus()"
        />
        <div v-if="levelState.answer" class="my-4">
          <p class="p-2 font-serif">
            正确答案
          </p>
          <WordBlock :word="levelAnswer.word" />
        </div>
        <WordBlock
          v-if="!isFinished"
          :word="input"
          active
          @click="focus()"
        />
      </section>
      <div class="mt-1" />
      <Transition name="fade-out">
        <section v-if="!isFinished" class="flex flex-col gap-2 items-center">
          <input
            ref="el"
            v-model="inputValue"
            type="text"
            autocomplete="off"
            placeholder="输入四字成语..."
            :disabled="isFinished"
            class="w-86 p-3 border-2 border-gray-400/10 outline-none bg-transparent text-center"
            @input="handleInput"
            @keydown.enter="go()"
          >
          <button
            class="btn mt-3 px-6 py-2"
            :disabled="!isValidInput"
            @click="go()"
          >
            确 定
          </button>
          <p v-if="trials.length > 4 && !isFailed" class="opacity-50">
            剩余 {{ TRIALS_LIMIT - trials.length }} 次机会
          </p>
          <button v-if="isFailed" class="square-btn" @click="openFailedPage()">
            <Icon icon="mdi-emoticon-devil-outline" /> 查看答案
          </button>
          <div
            class="flex justify-center items-center mt-4"
            :class="{ 'opacity-0 pointer-events-none': isFinished }"
          >
            <button
              v-if="hardMode == null"
              class="icon-btn flex gap-1 justify-center items-center mx-2 pb-2 text-base"
              @click="getHint()"
            >
              <Icon icon="carbon-idea" /> 提示
            </button>
            <button
              class="icon-btn flex gap-1 justify-center items-center mx-2 pb-2 text-base"
              @click="toggleCheatSheet()"
            >
              <Icon icon="carbon-grid" /> 速查表
            </button>
          </div>
        </section>
      </Transition>
      <Transition name="fade">
        <div v-if="isFinishedDelay && isFinished">
          <ResultFooter />
          <LevelComplete />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TRIALS_LIMIT } from '@/lib/constants';
import { isBetterMatch, matchAnswer, parseWord } from '@/lib/pinyin';
import { isIdiom } from '@/lib/idioms';
import {
  isFailed,
  isFinished,
  levelAnswer,
  numberToHanzi,
  parsedAnswer,
  parsedTrials,
  showCheatSheet,
  showFailed,
  showHelp,
  showHint,
} from '@/lib/state';
import { currentLevel, hardMode, levelState, markStart, trials } from '@/lib/storage';

const el = ref<HTMLInputElement>();
const input = ref('');
const inputValue = ref('');
const isFinishedDelay = debouncedRef(isFinished, 800);

function handleInput(event: Event) {
  const el = event.target! as HTMLInputElement;
  input.value = [...el.value]
    .filter(i => /\p{Script=Han}/u.test(i))
    .slice(0, 4)
    .join('');
  markStart();
}

const isBetterInput = computed(() => {
  if (input.value.length !== 4) {
    return false;
  }
  const parsedInput = parseWord(input.value);
  const matchResult = matchAnswer(parsedInput, parsedAnswer.value);
  return parsedTrials.value!.every(trial => isBetterMatch(parsedInput, matchResult, trial.word, trial.result));
});

const isValidInput = computed(() => {
  if (input.value.length !== 4) {
    return false;
  } else if (hardMode.value == null) {
    return true;
  } else if (!isIdiom(input.value)) {
    return false;
  } else if (hardMode.value === 'hard') {
    return true;
  } else {
    return isBetterInput.value;
  }
});

function go() {
  if (!isValidInput.value) {
    return;
  }
  if (!isIdiom(input.value)) {
    levelState.value.mode = null;
  } else if (levelState.value.mode === 'nightmare' && !isBetterInput.value) {
    levelState.value.mode = 'hard';
  }
  trials.value.push(input.value);
  input.value = '';
  inputValue.value = '';
}

function focus() {
  el.value?.focus();
}

function openFailedPage() {
  showFailed.value = true;
}

function getHint() {
  levelState.value.mode = null;
  if (levelState.value.hintLevel == null) {
    levelState.value.hintLevel = 'pinyin';
  }
  showHint.value = true;
}

const toggleCheatSheet = useToggle(showCheatSheet);

watch(showHelp, showHelp => {
  if (!showHelp) {
    focus();
  }
});

watch(isFailed, failed => {
  if (failed && !levelState.value.failed) {
    levelState.value.failed = true;
    setTimeout(() => {
      showFailed.value = true;
    }, 1200);
  }
});
</script>

<style lang="postcss" scoped>
:deep(.fade-enter-active) {
  @apply transition duration-1000 ease;
}
:deep(.fade-out-leave-active) {
  @apply transition duration-500 ease;
}
:deep(.fade-enter-from), :deep(.fade-out-leave-to) {
  @apply opacity-0 transform translate-y-10px;
}
</style>
