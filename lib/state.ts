import { TRIALS_LIMIT } from './constants';
import { getIdiomOfLevel } from './idioms';
import { matchAnswer, parseWord } from './pinyin';
import { currentLevel, levelState, trials } from './storage';
import type { MatchType } from './types';

export const showHint = ref(false);
export const showSettings = ref(false);
export const showHelp = ref(false);
export const showShare = ref(false);
export const showFailed = ref(false);
export const showDashboard = ref(false);
export const showVariants = ref(false);
export const showCheatSheet = ref(false);
export const showShareDialog = ref(false);
export const showLevelList = ref(false);
export const useMask = ref(false);

export const gameInited = ref(false);

export const levelAnswer = computed(() => getIdiomOfLevel(currentLevel.value));
export const parsedAnswer = computed(() => parseWord(levelAnswer.value.word));

export const parsedTrials = computed(() => {
  if (!gameInited.value) {
    return null;
  }
  return trials.value.map(trial => {
    const word = parseWord(trial);
    const result = matchAnswer(word, parsedAnswer.value);
    return { word, result };
  });
});

export const isPassed = computed(() => {
  if (!gameInited.value) {
    return false;
  }
  if (levelState.value.passed) {
    return true;
  } else if (parsedTrials.value!.length === 0) {
    return false;
  }
  const lastTrial = parsedTrials.value![parsedTrials.value!.length - 1];
  return lastTrial.result.every(result => result.char === 'exact');
});

export const isFailed = computed(() => !isPassed.value && trials.value.length >= TRIALS_LIMIT);
export const isFinished = computed(() => isPassed.value || levelState.value.answer);

export function getSymbolState(symbol?: string | number, key?: 'displayInitial' | 'final' | 'tone') {
  if (!gameInited.value) {
    return null;
  }
  const results: MatchType[] = [];
  for (const trial of parsedTrials.value!) {
    for (let i = 0; i < 4; i++) {
      const word = trial.word[i];
      const result = trial.result[i];
      if (key) {
        if (word[key] === symbol) {
          results.push(result[key]);
        }
      } else {
        if (word.displayInitial === symbol) {
          results.push(result.displayInitial);
        }
        if (word.final === symbol) {
          results.push(result.final);
        }
      }
    }
  }
  if (results.includes('exact')) {
    return 'exact';
  }
  if (results.includes('misplaced')) {
    return 'misplaced';
  }
  if (results.includes('none')) {
    return 'none';
  }
  return null;
}

const numberChar = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const tens = ['', '拾', '佰', '仟', '万'];

export function numberToHanzi(number: number) {
  const digits = [...number.toString()].map(c => Number.parseInt(c));
  const chars = digits.map((digit, index) => {
    const unit = digit === 0 ? '' : tens[digits.length - 1 - index];
    return numberChar[digit] + unit;
  });
  return chars
    .join('')
    .replace('壹拾', '拾')
    .replace(/零+/, '零')
    .replace(/零$/, '');
}

export const levelNoHanzi = computed(() => numberToHanzi(currentLevel.value + 1));
