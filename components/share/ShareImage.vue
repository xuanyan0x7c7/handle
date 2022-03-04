<template>
  <p v-if="isMobile" class="mb-4 opacity-50">
    长按下图保存到相册
  </p>
  <img v-if="dataUrl" :src="dataUrl" class="w-80 min-h-10 border border-gray-400/10 rounded">
  <p v-else class="w-80 p-4 border border-gray-400/10 rounded animate-pulse">
    生成中...
  </p>
  <div class="flex py-4">
    <button v-if="!isIOS" class="square-btn gap-1 mx-2" @click="download()">
      <Icon icon="carbon-download" /> 下载
    </button>
    <ToggleMask class="mx-2" />
  </div>
  <div v-if="show" class="fixed" style="left: 200vw; top: 200vh">
    <div ref="el" class="relative flex flex-col items-center px-6 py-4 bg-base">
      <AppName />
      <p class="mt-1 mb-3 opacity-50 text-xs whitespace-nowrap">
        handle.xuanyan.ws
      </p>
      <WordBlock v-for="word, index of trials" :key="index" :word="word" revealed :animate="false" />
      <ResultFooter level class="mt-3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { levelNoHanzi, useMask } from '@/lib/state';
import { trials } from '@/lib/storage';
import { isIOS, isMobile } from '@/lib/util';

const el = ref<HTMLDivElement>();
const show = ref(false);
const showDialog = ref(false);
const dataUrlUnmasked = ref('');
const dataUrlMasked = ref('');
const dataUrl = computed(() => useMask.value ? dataUrlMasked.value : dataUrlUnmasked.value);

async function render() {
  show.value = true;
  const { toPng } = await import('@/lib/export-image');
  await nextTick();
  await nextTick();
  showDialog.value = true;
  const p = useMask.value;
  useMask.value = false;
  await nextTick();
  dataUrlUnmasked.value = await toPng(el.value!);
  useMask.value = true;
  await nextTick();
  dataUrlMasked.value = await toPng(el.value!);
  useMask.value = p;
  show.value = false;
}

async function download() {
  const { saveAs } = await import('@/lib/export-image');
  saveAs(dataUrl.value, `汉兜 ${levelNoHanzi.value}${useMask.value ? ' 遮罩' : ''}.png`);
}

onMounted(render);
</script>
