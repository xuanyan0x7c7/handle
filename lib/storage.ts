import { useLocalStorage } from '@vueuse/core';
import { version as packageVersion } from '../package.json';
import type { HardMode, LevelState } from './types';

if (localStorage.getItem('handle-version') == null) {
  localStorage.clear();
}

export const version = useLocalStorage('handle-version', packageVersion);
export const initialized = useLocalStorage('handle-initialized', false);
export const history = useLocalStorage<(LevelState | null)[]>('handle-level-state', []);
export const useNumberTone = useLocalStorage('handle-number-tone', false);
export const colorblind = useLocalStorage('handle-colorblind', false);
export const hardMode = useLocalStorage<HardMode>('handle-hard-mode', null);
export const checkAssist = useLocalStorage('handle-check-assist', true);
export const currentLevel = useLocalStorage('handle-level', 0);

export const levelState = computed<LevelState>({
  get() {
    if (history.value[currentLevel.value] == null) {
      history.value[currentLevel.value] = {};
    }
    return history.value[currentLevel.value]!;
  },
  set(state) {
    history.value[currentLevel.value] = state;
  },
});

export const trials = computed<string[]>({
  get() {
    if (!levelState.value.trials) {
      levelState.value.trials = [];
    }
    return levelState.value.trials;
  },
  set(trials) {
    levelState.value.trials = trials;
  },
});

export function markStart() {
  if (levelState.value.end) {
    return;
  }
  if (!levelState.value.start) {
    levelState.value.start = Date.now();
    levelState.value.mode = 'nightmare';
  }
}

export function markEnd() {
  if (levelState.value.end) {
    return;
  }
  if (!levelState.value.duration) {
    levelState.value.duration = 0;
  }
  levelState.value.end = Date.now();
  if (levelState.value.start) {
    levelState.value.duration += levelState.value.end - levelState.value.start;
  }
}

export const gamesCount = computed(
  () => history.value.filter(level => level && (level.passed || level.answer || level.failed)).length,
);
