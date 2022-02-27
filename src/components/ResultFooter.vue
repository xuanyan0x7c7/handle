<script setup lang="ts">
import { currentLevel, formatDuration, meta } from '~/storage'
import { t } from '~/i18n'
</script>

<template>
  <div relative op50 my2 text-sm min-h-1em>
    <div absolute text-sm left-0 bottom-0 ws-nowrap>
      L{{ currentLevel }} · {{ meta.hintLevel ? meta.hintLevel + t('hint-level') : t('hint-level-none') }}
    </div>
    <div absolute text-sm right-0 bottom-0 ws-nowrap>
      {{ formatDuration(meta.duration || 0) }} ·
      {{ meta.answer ? 'X' : meta.tries?.length || 0 }}/10
    </div>
  </div>
</template>
