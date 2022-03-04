<template>
  <button
    class="btn flex flex-wrap gap-x-2 justify-center items-center px-3 py-1 text-lg font-serif whitespace-nowrap"
    @click="openShareDialog()"
  >
    <Icon icon="carbon-share" class="text-base" /> 分享
  </button>
</template>

<script setup lang="ts">
import { showShareDialog } from '@/lib/state';

function openShareDialog() {
  showShareDialog.value = true;
}
</script>
