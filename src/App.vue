<script setup lang="ts">
import '~/init'
import { colorblind, currentLevel, gamesCount } from '~/storage'

const { height } = useWindowSize()

watchEffect(() => {
  document.documentElement.style.setProperty('--vh', `${height.value / 100}px`)
})
</script>

<template>
  <main font-sans text="center gray-700 dark:gray-300" select-none :class="{ colorblind }">
    <Navbar />
    <div p="4">
      <NoFuturePlay v-if="currentLevel > gamesCount" />
      <Play v-else />
    </div>
  </main>
</template>
