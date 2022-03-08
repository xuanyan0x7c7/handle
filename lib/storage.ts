import { version as packageVersion } from '../package.json';
import type { HardMode, LevelState } from './types';

export const STORAGE_KEYS = {
  VERSION: 'handle-version',
  INITIALIZED: 'handle-initialized',
  LEVEL_STATE: 'handle-level-state',
  NUMBER_TONE: 'handle-number-tone',
  COLORBLIND: 'handle-colorblind',
  HARD_MODE: 'handle-hard-mode',
  CHECK_ASSIST: 'handle-check-assist',
  LEVEL: 'handle-level',
} as const;

if (localStorage.getItem(STORAGE_KEYS.VERSION) == null) {
  localStorage.clear();
}

export const version = useLocalStorage(STORAGE_KEYS.VERSION, packageVersion);
export const initialized = useLocalStorage(STORAGE_KEYS.INITIALIZED, false);
export const history = useLocalStorage<(LevelState | null)[]>(STORAGE_KEYS.LEVEL_STATE, []);
export const useNumberTone = useLocalStorage(STORAGE_KEYS.NUMBER_TONE, false);
export const colorblind = useLocalStorage(STORAGE_KEYS.COLORBLIND, false);
export const hardMode = useLocalStorage<HardMode>(STORAGE_KEYS.HARD_MODE, null);
export const useCheckAssist = useLocalStorage(STORAGE_KEYS.CHECK_ASSIST, true);
export const currentLevel = useLocalStorage(STORAGE_KEYS.LEVEL, 0);

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
