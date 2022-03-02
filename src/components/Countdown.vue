<script setup lang="ts">
import { t } from '~/i18n'
import { useMask } from '~/state'
import { currentLevel } from '~/storage'

function nextLevel() {
  currentLevel.value = currentLevel.value + 1
  useMask.value = false
}
</script>

<template>
  <div pt12 pb16>
    <div flex="~ col" items-center>
      <ShareButton m4 />
      <ToggleMask :hint="true" />
    </div>

    <div h-1px w-10 border="t base" mt4 mb6 mxa />

    <button
      btn flex="~ wrap gap-x-3" items-center justify-center ws-nowrap text-xl font-serif mxa p="x4 y2"
      @click="nextLevel()"
    >
      {{ t('next-level') }}
    </button>
  </div>
</template>
