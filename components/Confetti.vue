<template>
  <div />
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti';
import { isPassed } from '@/lib/state';

function congrats() {
  const defaults: confetti.Options = {
    colors: [
      '#5d8c7b',
      '#f2d091',
      '#f2a679',
      '#d9695f',
      '#8c4646',
    ],
    shapes: ['square'],
    ticks: 500,
  };
  confetti({
    ...defaults,
    particleCount: 80,
    spread: 100,
    origin: { y: 0 },
  });
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      angle: 60,
      spread: 80,
      origin: { x: 0 },
    });
  }, 250);
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      angle: 120,
      spread: 80,
      origin: { x: 1 },
    });
  }, 400);
}

watch(isPassed, passed => {
  if (passed) {
    setTimeout(congrats, 300);
  }
}, { flush: 'post' });
</script>
