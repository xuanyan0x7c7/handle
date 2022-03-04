<template>
  <div
    class="text-center text-gray-700 dark:text-gray-300 font-sans select-none"
    :class="{ colorblind }"
  >
    <Navbar />
    <template v-if="loaded">
      <main class="block p-4">
        <slot />
      </main>
      <Modal v-model="showCheatSheet" :direction="lg ? 'right' : 'top'" :mask="!lg">
        <CheatSheet />
      </Modal>
      <Modal v-model="showDashboard" direction="top">
        <Dashboard />
      </Modal>
      <Modal v-model="showFailed" direction="top">
        <Failed />
      </Modal>
      <Modal v-model="showHint" direction="top">
        <Hint />
      </Modal>
      <Modal v-model="showLevelList" direction="top">
        <LevelList />
      </Modal>
      <Modal v-model="showSettings" direction="top">
        <Settings class="my-6" />
      </Modal>
      <Modal v-model="showShareDialog" direction="top">
        <ShareDialog />
      </Modal>
      <Modal v-model="showVariants" direction="top">
        <VariantLinks />
      </Modal>
      <Modal v-model="showHelp" direction="top">
        <Welcome />
      </Modal>
      <Confetti />
    </template>
    <div v-else class="fixed inset-0 flex justify-center items-center pointer-events-none">
      <Icon icon="mdi-loading" class="text-8xl animate-spin animate-loop" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocumentVisibility } from '@vueuse/core';
import { initJieba } from '@/lib/pinyin-parser';
import {
  breakpoints,
  isFinished,
  isPassed,
  showCheatSheet,
  showDashboard,
  showFailed,
  showHelp,
  showHint,
  showLevelList,
  showSettings,
  showShareDialog,
  showVariants,
} from '@/lib/state';
import { colorblind, initialized, levelState, markEnd, markStart } from '@/lib/storage';

const lg = breakpoints.lg;
const loaded = ref(false);

onBeforeMount(async () => {
  await initJieba();
  await new Promise(resolve => setTimeout(resolve, 1e4));
  loaded.value = true;
});

if (!initialized.value) {
  showHelp.value = true;
}

watch(isPassed, passed => {
  if (passed) {
    levelState.value.passed = true;
  }
},
{ immediate: true });

watch(isFinished, finished => {
  if (finished) {
    markEnd();
    showCheatSheet.value = false;
  }
},
{ flush: 'post' });

function pauseTimer() {
  if (levelState.value.end) {
    return;
  }
  if (!levelState.value.duration) {
    levelState.value.duration = 0;
  }
  if (levelState.value.start) {
    levelState.value.duration += Date.now() - levelState.value.start;
    levelState.value.start = undefined;
  }
}

const visible = useDocumentVisibility();
let leaveTime = 0;
watch(visible, visible => {
  if (visible === 'visible') {
    if (leaveTime && Date.now() - leaveTime > 3 * 3600 * 1000) {
      location.reload();
    }
    if (levelState.value.duration) {
      markStart();
    }
  } else {
    leaveTime = Date.now();
    pauseTimer();
  }
}, { flush: 'post' });
</script>
