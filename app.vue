<template>
  <Title>汉兜 - 汉字 Wordle</Title>
  <Meta name="description" content="汉兜 - 汉字 Wordle" />
  <Link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <Link rel="manifest" href="/manifest.json" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';

const { height } = useWindowSize();
watch(height, height => {
  document.documentElement.style.setProperty('--vh', `${height / 100}px`);
});

window.addEventListener('load', () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('serviceWorker is not supported in current browser!');
  }
  navigator.serviceWorker.register('/sw.js');
});
</script>

<style>
html, body, #__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #121212;
}

:root {
  --c-primary: #0d828e;
  --c-primary-deep: #08606a;
  --c-ok: #1d9c9c;
  --c-misplaced: #de7525;
}
.dark {
  --c-ok: #0d8e8e;
}
.colorblind {
  --c-ok: #5ba554;
  --c-misplaced: #ff46ff;
  --c-primary: #5ba554;
}
</style>
