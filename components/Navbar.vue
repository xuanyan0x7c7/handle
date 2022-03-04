<template>
  <nav class="relative border-b border-gray-400/10">
    <header class="absolute inset-0 -z-1 flex text-2xl font-serif tracking-2">
      <AppName class="m-auto" />
    </header>
    <div class="flex justify-between items-center md:max-w-md m-auto px-2 py-4">
      <div class="flex items-center">
        <button class="icon-btn mx-2" @click="openHelp()">
          <Icon icon="carbon-help" />
        </button>
        <button v-if="gamesCount > 0" class="icon-btn mx-2" @click="toggleDashboard()">
          <Icon icon="carbon-catalog" />
        </button>
        <button class="icon-btn mx-2" @click="chooseLevel()">
          <Icon icon="carbon-apps" />
        </button>
      </div>
      <div class="flex items-center">
        <button class="icon-btn mx-2" @click="toggleSettings()">
          <Icon icon="carbon-settings" />
        </button>
        <button class="icon-btn mx-2" @click="toggleDark()">
          <Icon :icon="isDark ? 'carbon-moon' : 'carbon-sun'" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';
import { isDark, showDashboard, showHelp, showLevelList, showSettings, useMask } from '@/lib/state';
import { gamesCount } from '@/lib/storage';

const toggleDark = useToggle(isDark);
const toggleSettings = useToggle(showSettings);
const toggleDashboard = useToggle(showDashboard);

function openHelp() {
  showHelp.value = true;
  useMask.value = false;
}
function chooseLevel() {
  showLevelList.value = true;
}
</script>
