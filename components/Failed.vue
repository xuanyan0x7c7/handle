<template>
  <section class="flex flex-col justify-center items-center p-5">
    <Icon icon="carbon-face-dizzy" class="m-4 opacity-50 text-5xl" />
    <p>
      今天你已经用完十次尝试机会了
      <br><br>
      但是没关系，你还可以继续尝试
      <br>
      你也可以随时放弃并查看答案
    </p>
    <div class="flex gap-5 justify-center items-center p-4">
      <button class="btn" @click="close()">
        继续游戏
      </button>
      <button
        class="icon-btn inline-flex gap-1 justify-center items-center text-base text-$c-misplaced"
        @click="revealAnswer()"
      >
        <Icon icon="mdi-emoticon-devil-outline" /> 查看答案
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { showFailed } from '@/lib/state';
import { levelState } from '@/lib/storage';

function close() {
  showFailed.value = false;
}

function revealAnswer() {
  showFailed.value = false;
  levelState.value.answer = true;
  levelState.value.failed = true;
}
</script>
