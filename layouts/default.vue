<template>
  <div
    class="text-center text-gray-700 dark:text-gray-300 font-sans select-none"
    :class="{ colorblind }"
  >
    <Navbar />
    <template v-if="gameInited">
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
      <Modal v-model="showHelp" direction="top">
        <Welcome />
      </Modal>
      <Modal v-model="showVariants" direction="top">
        <VariantLinks />
      </Modal>
      <Confetti />
    </template>
    <div v-else class="fixed inset-0 flex justify-center items-center pointer-events-none">
      <Icon icon="mdi-loading" class="text-8xl animate-spin animate-loop" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';
import { initIdioms } from '@/lib/idioms';
import '@/lib/init';
import { runMigrations } from '@/lib/migrations';
import { initJieba } from '@/lib/pinyin-parser';
import {
  gameInited,
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
import { colorblind } from '@/lib/storage';

const breakpoints = useBreakpoints(breakpointsTailwind);
const lg = breakpoints.lg;

onBeforeMount(async () => {
  await Promise.all([
    initIdioms(),
    initJieba(),
  ]);
  runMigrations();
  gameInited.value = true;
});
</script>
