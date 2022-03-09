<template>
  <section class="relative flex flex-col gap-2 items-center px-5 py-10">
    <div class="absolute top-4 right-4 flex gap-3">
      <button v-if="initialized" class="icon-btn" @click="start()">
        <Icon icon="carbon-close" />
      </button>
      <button v-else class="icon-btn" @click="toggleDark()">
        <Icon :icon="isDark ? 'carbon-moon' : 'carbon-sun'" />
      </button>
    </div>
    <header class="contents">
      <AppName class="h-10" />
      <p class="-mt-1 opacity-50 text-sm">
        汉字 Wordle
      </p>
    </header>
    <hr class="separator">
    <p class="mb-4 text-xl font-serif">
      <b>游戏规则</b>
    </p>
    <p>
      你有十次机会猜一个 <b class="text-$c-ok">四字成语</b>。
    </p>
    <p>
      每次猜测后，汉字与拼音的颜色将会标识其与正确答案的区别。
    </p>
    <hr class="separator">
    <WordBlock word="班门弄斧" revealed answer=" 门  " class="my-2" />
    <p>
      第二个字 <b class="text-$c-ok">门</b> 为青色，表示其出现在答案中且在正确的位置。
    </p>
    <WordBlock word="水落石出" revealed answer="   水" class="my-2" />
    <p>
      第一个字 <b class="text-$c-misplaced">水</b> 为橙色，表示其出现在答案中，但并不是第一个字。
    </p>
    <WordBlock word="巧夺天工" revealed answer="桥它拖 " class="my-2" />
    <p class="max-w-130 text-left">
      每个格子的 <b>汉字、声母、韵母、声调</b> 都会独立进行颜色的指示。
      例如，第一个 <b class="opacity-50">巧</b> 汉字为灰色，而其 声母 与 韵母 均为青色，代表该位置的正确答案为其同音字但非 <b class="opacity-50">巧</b> 字本身。
      同理，第二个字中韵母 <b class="text-$c-misplaced">uo</b> 为橙色，代表其韵母出现在四个字之中，但非位居第二。以此类推。
    </p>
    <WordBlock word="武运昌隆" revealed answer="武运昌隆" class="my-2" />
    <p>
      当四个格子都为青色时，你便赢得了游戏！
    </p>
    <hr class="separator">
    <p>
      本游戏严格按照
      <a
        href="http://www.moe.gov.cn/ewebeditor/uploadfile/2015/03/02/20150302165814246.pdf"
        target="_blank"
        class="text-$c-primary hover:text-$c-primary-deep"
      >
        汉语拼音方案
      </a>
      判断和展示拼音，请在游戏前认真阅读。
    </p>
    <hr class="separator">
    <button class="btn px-4 py-2" @click="start()">
      <span class="pl-1 tracking-1">开始游戏</span>
    </button>
    <hr class="separator">
    <Settings />
    <hr class="separator">
    <button class="opacity-80 text-$c-primary hover:opacity-100" @click="showVariant()">
      其他中文 Wordle 变体
    </button>
    <a
      href="https://github.com/xuanyan0x7c7/handle"
      target="_blank"
      class="flex gap-1 justify-center items-center opacity-50 hover:opacity-80"
    >
      <Icon icon="carbon-logo-github" /> Source Code
    </a>
  </section>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { showHelp, showVariants, useMask } from '@/lib/state';
import { initialized } from '@/lib/storage';

const isDark = useDark();
const toggleDark = useToggle(isDark);

function start() {
  showHelp.value = false;
  useMask.value = false;
  initialized.value = true;
}

function showVariant() {
  showVariants.value = true;
}
</script>

<style scoped lang="postcss">
.separator {
  @apply w-10 h-px m-4 border-b border-gray-400/10;
}
</style>
