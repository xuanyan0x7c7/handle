<template>
  <section class="relative flex flex-col items-center p-6">
    <div class="absolute top-4 right-4 flex">
      <button class="icon-btn" @click="close()">
        <Icon icon="carbon-close" />
      </button>
    </div>
    <div v-if="shareType" class="absolute top-4 left-4 flex">
      <button class="icon-btn" @click="setShareType('')">
        <Icon icon="carbon-arrow-left" />
      </button>
    </div>
    <p class="mb-4 text-xl font-serif">
      <b>{{ shareTypeText }}</b>
    </p>
    <ShareText v-if="shareType === 'text'" />
    <ShareImage v-else-if="shareType === 'image'" />
    <template v-else>
      <header>选择分享方式</header>
      <div class="grid grid-cols-2 gap-2 my-4">
        <button
          class="flex flex-col justify-center items-center border border-gray-400/10 p-4 opacity-80 hover(:opacity-100 bg-gray-400/5) w-30 h-30"
          @click="setShareType('text')"
        >
          <Icon icon="ep-tickets" class="mb-1 opacity-70 text-[2.5rem]" />
          <p>文本分享</p>
        </button>
        <button
          class="flex flex-col justify-center items-center border border-gray-400/10 p-4 opacity-80 hover(:opacity-100 bg-gray-400/5) w-30 h-30"
          @click="setShareType('image')"
        >
          <Icon icon="ep-picture" class="mb-1 opacity-70 text-[2.5rem]" />
          <p>保存为图片</p>
        </button>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { showShareDialog } from '~~/lib/state';

type ShareType = 'text' | 'image' | '';
const shareType = ref<ShareType>('');
const shareTypeText = computed(() => ({ text: '文本分享', image: '保存为图片', '': '分享' })[shareType.value]);

function close() {
  showShareDialog.value = false;
}

function setShareType(type: ShareType) {
  shareType.value = type;
}

watch(showShareDialog, show => {
  if (!show) {
    shareType.value = '';
  }
});
</script>
