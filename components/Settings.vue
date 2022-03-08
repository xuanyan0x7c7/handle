<template>
  <section class="flex flex-col">
    <div class="flex flex-wrap justify-center items-center">
      <div class="square-btn m-2">
        <button :class="buttonClass(!useNumberTone)" @click="useNumberTone = false">
          符号声调
        </button>
        <div class="w-px h-4 border-r border-gray-400/10" />
        <button :class="buttonClass(useNumberTone)" @click="useNumberTone = true">
          数字声调
        </button>
      </div>
    </div>
    <div class="flex flex-wrap justify-center items-center">
      <div class="square-btn m-2">
        <button :class="buttonClass(hardMode == null)" @click="switchHardMode(null)">
          普通模式
        </button>
        <div class="w-px h-4 border-r border-gray-400/10" />
        <button :class="buttonClass(hardMode === 'hard')" @click="switchHardMode('hard')">
          困难模式
        </button>
        <div class="w-px h-4 border-r border-gray-400/10" />
        <button :class="buttonClass(hardMode === 'nightmare')" @click="switchHardMode('nightmare')">
          地狱模式
        </button>
      </div>
    </div>
    <div class="flex flex-wrap justify-center items-center">
      <button
        class="square-btn m-2"
        :class="buttonClass(colorblind)"
        @click="toggleColorblind()"
      >
        色彩增强
        <div v-if="colorblind" class="square-btn-mark" />
      </button>
      <button
        class="square-btn m-2"
        :class="buttonClass(useCheckAssist)"
        @click="toggleCheckAssist()"
      >
        检查辅助
        <div v-if="useCheckAssist" class="square-btn-mark" />
      </button>
    </div>
    <div class="flex flex-wrap justify-center items-center">
      <button class="btn m-2" @click="importSaving()">
        导入存档
      </button>
      <button class="btn m-2" @click="exportSaving()">
        导出存档
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IDIOMS } from '@/lib/idioms';
import { recalculateLevelStates, runMigrations } from '@/lib/migrations';
import {
  colorblind,
  currentLevel,
  hardMode,
  history,
  initialized,
  STORAGE_KEYS,
  useCheckAssist,
  useNumberTone,
  version,
} from '@/lib/storage';

const clipboard = useClipboard();
const toggleColorblind = useToggle(colorblind);
const toggleCheckAssist = useToggle(useCheckAssist);

function switchHardMode(mode: 'hard' | 'nightmare' | null) {
  hardMode.value = mode;
}

function buttonClass(state: boolean) {
  return state ? 'text-$c-primary' : 'opacity-80';
}

function importSaving() {
  const promptString = clipboard.isSupported ? clipboard.text.value : '';
  const serializedData = prompt('导入存档（当前存档将被覆盖！）', promptString);
  if (serializedData) {
    try {
      const data: Record<string, string> = JSON.parse(serializedData);
      if (/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(data[STORAGE_KEYS.VERSION] ?? '')) {
        version.value = data[STORAGE_KEYS.VERSION];
      }
      initialized.value = true;
      const levelStateList = JSON.parse(data[STORAGE_KEYS.LEVEL_STATE]);
      if (Array.isArray(levelStateList)) {
        history.value = levelStateList.slice(0, IDIOMS.length);
      } else {
        history.value = [];
      }
      useNumberTone.value = data[STORAGE_KEYS.NUMBER_TONE] === 'true';
      colorblind.value = data[STORAGE_KEYS.COLORBLIND] === 'true';
      const hardModeValue = data[STORAGE_KEYS.HARD_MODE];
      if (hardModeValue === 'hard' || hardModeValue === 'nightmare') {
        hardMode.value = hardModeValue;
      } else {
        hardMode.value = null;
      }
      useCheckAssist.value = data[STORAGE_KEYS.CHECK_ASSIST] !== 'false';
      if (/^(0|[1-9]\d*)$/.test(data[STORAGE_KEYS.LEVEL] ?? '')) {
        const level = Number.parseInt(data[STORAGE_KEYS.LEVEL]);
        currentLevel.value = level < IDIOMS.length ? level : 0;
      } else {
        currentLevel.value = 0;
      }
      recalculateLevelStates(true);
      runMigrations();
      alert('导入成功！');
    } catch (error) {
      alert('导入格式错误！');
    }
  }
}

async function exportSaving() {
  if (clipboard.isSupported) {
    const data: Record<string, string> = {};
    for (const key of Object.values(STORAGE_KEYS)) {
      const value = localStorage.getItem(key);
      if (value != null) {
        data[key] = value;
      }
    }
    const serializedData = JSON.stringify(data);
    await clipboard.copy(serializedData);
    alert('存档已导出至剪贴板');
  }
}
</script>
