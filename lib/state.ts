import { TRIALS_LIMIT } from './constants';
import { getIdiomOfLevel } from './idioms';
import { parseAndMatchAnswer, parseWord } from './pinyin';
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
  return trials.value.map(trial => parseAndMatchAnswer(trial, parsedAnswer.value));
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
  const lastParsedTrial = parsedTrials.value![parsedTrials.value!.length - 1];
  return lastParsedTrial.every(result => result.matchResult.char === 'exact');
});

export const isFailed = computed(() => !isPassed.value && trials.value.length >= TRIALS_LIMIT);
export const isFinished = computed(() => isPassed.value || levelState.value.answer);

export function getSymbolState(symbol?: string | number, key?: 'displayInitial' | 'final' | 'tone') {
  if (!gameInited.value) {
    return null;
  }
  const matchTypes: MatchType[] = [];
  for (const trial of parsedTrials.value!) {
    for (let i = 0; i < 4; i++) {
      const { parsedChar, matchResult } = trial[i];
      if (key) {
        if (parsedChar[key] === symbol) {
          matchTypes.push(matchResult[key]);
        }
      } else {
        if (parsedChar.displayInitial === symbol) {
          matchTypes.push(matchResult.displayInitial);
        }
        if (parsedChar.final === symbol) {
          matchTypes.push(matchResult.final);
        }
      }
    }
  }
  if (matchTypes.includes('exact')) {
    return 'exact';
  }
  if (matchTypes.includes('misplaced')) {
    return 'misplaced';
  }
  if (matchTypes.includes('none')) {
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
