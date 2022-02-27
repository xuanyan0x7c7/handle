<script setup lang="ts">
import { t } from '~/i18n'
import { useMask } from '~/state'
import { currentLevel } from '~/storage'
function nextLevel() {
  currentLevel.value = currentLevel.value == null ? 0 : currentLevel.value + 1
  useMask.value = false
}
</script>

<template>
  <div flex gap-5 py8>
    <button
      btn flex="~ wrap gap-x-3" items-center justify-center ws-nowrap text-xl font-serif p="x4 y2"
      @click="nextLevel()"
    >
      {{ t('next-level') }}
    </button>

    <div w-1px border="l base" />

    <div flex="~ col gap-4" items-center>
      <ShareButton />
      <ExportImage />
    </div>
  </div>
</template>
