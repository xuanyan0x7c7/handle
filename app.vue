<template>
  <Title>汉兜 - 汉字 Wordle</Title>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

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
