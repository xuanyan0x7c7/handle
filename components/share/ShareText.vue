<template>
  <p class="w-80 mb-4 text-center">
    {{ true ? '分享内容已复制到剪贴板' : '请复制以下文本进行分享' }}
  </p>
  <textarea
    :rows="lines.length"
    :value="text"
    readonly
    class="p-5 rounded bg-gray-500/5 outline-none resize-none text-left leading-19px tracking-1px select-text"
  />
  <button v-if="share.isSupported" class="square-btn my-4" @click="shareSystem()">
    <Icon icon="carbon-share" /> 调用系统分享
  </button>
</template>

<script setup lang="ts">
import { useClipboard, useShare } from '@vueuse/core';
import { matchAnswer, parseWord } from '@/lib/pinyin';
import { levelNoHanzi, parsedAnswer } from '@/lib/state';
import { levelState, trials } from '@/lib/storage';
import { isMobile } from '@/lib/util';

const lines = computed(() => {
  const table = trials.value.map(word => {
    const parsed = parseWord(word);
    return matchAnswer(parsed, parsedAnswer.value)
      .map((result, index) => {
        if (result.char === 'exact') {
          return '🟩';
        } else if (result.char === 'misplaced') {
          return '🟧';
        } else if (parsed[index].displayInitial && result.displayInitial === 'exact') {
          return '🟠';
        } else if (parsed[index].final && result.final === 'exact') {
          return '🟠';
        } else if (result.displayInitial === 'misplaced' || result.final === 'misplaced') {
          return '🟡';
        } else {
          return '⬜️';
        }
      })
      .join('');
  });

  let levelMode = '';
  if (levelState.value.mode === 'nightmare') {
    levelMode = '地狱模式';
  } else if (levelState.value.mode === 'hard') {
    levelMode = '困难模式';
  } else if (levelState.value.hintLevel == null) {
    levelMode = '无提示';
  } else if (levelState.value.hintLevel === 'pinyin') {
    levelMode = '字音提示';
  } else {
    levelMode = '汉字提示';
  }

  return [
    ['汉兜', levelNoHanzi.value, levelMode].filter(Boolean).join(' · '),
    '',
    ...table,
    '',
    'handle.xuanyan.ws',
  ];
});

const text = computed(() => lines.value.join('\n'));

const share = useShare(computed(() => ({
  title: '汉兜',
  text: text.value,
})));
const clipboard = useClipboard();
const copied = ref(false);

async function shareSystem() {
  if (share.isSupported && isMobile) {
    await share.share();
    return true;
  }
  return false;
}

onMounted(async () => {
  if (clipboard.isSupported) {
    await clipboard.copy(text.value);
    copied.value = true;
  }
});
</script>
