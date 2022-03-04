<template>
  <section class="flex flex-col">
    <div class="flex flex-wrap justify-center items-center">
      <div class="square-btn m-2">
        <button :class="buttonClass(!useNumberTone)" @click="useNumberTone = false">
          符号声调
        </button>
        <div class="w-1px h-4 border-r border-gray-400/10" />
        <button :class="buttonClass(useNumberTone)" @click="useNumberTone = true">
          数字声调
        </button>
      </div>
    </div>
    <div class="flex flex-wrap justify-center items-center">
      <div class="square-btn m-2">
        <button :class="buttonClass(hardMode == null)" @click="switchHardMode(null)">
          普通模式
        </button>
        <div class="w-1px h-4 border-r border-gray-400/10" />
        <button :class="buttonClass(hardMode === 'hard')" @click="switchHardMode('hard')">
          困难模式
        </button>
        <div class="w-1px h-4 border-r border-gray-400/10" />
        <button :class="buttonClass(hardMode === 'nightmare')" @click="switchHardMode('nightmare')">
          地狱模式
        </button>
      </div>
    </div>
    <div class="flex flex-wrap justify-center items-center">
      <button
        class="square-btn m-2"
        :class="buttonClass(colorblind)"
        @click="toggleColorblind()"
      >
        色彩增强
        <div v-if="colorblind" class="square-btn-mark" />
      </button>
      <button
        class="square-btn m-2"
        :class="buttonClass(checkAssist)"
        @click="toggleCheckAssist()"
      >
        检查辅助
        <div v-if="checkAssist" class="square-btn-mark" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';
import { checkAssist, colorblind, hardMode, useNumberTone } from '@/lib/storage';

const toggleColorblind = useToggle(colorblind);
const toggleCheckAssist = useToggle(checkAssist);

function switchHardMode(mode: 'hard' | 'nightmare' | null) {
  hardMode.value = mode;
}

function buttonClass(state: boolean) {
  return state ? 'text-$c-primary' : 'opacity-80';
}
</script>
