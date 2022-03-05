import compareVersion from 'semver-compare';
import { version as packageVersion } from '../package.json';
import { IDIOMS, isIdiom } from './idioms';
import { isBetterMatch, matchAnswer, parseWord } from './pinyin';
import { history, version } from './storage';

function recalculateLevelModes() {
  for (let level = 0; level < history.value.length; ++level) {
    const state = history.value[level];
    if (state?.trials == null) {
      continue;
    }
    if (state.hintLevel || state.trials.some(trial => !isIdiom(trial))) {
      state.mode = null;
      return;
    }
    const answer = IDIOMS[level];
    const parsedAnswer = parseWord(answer);
    const parsedInputs = state.trials.map(parseWord);
    const matchResults = parsedInputs.map(input => matchAnswer(input, parsedAnswer));
    for (let i = 1; i < state.trials.length; ++i) {
      for (let j = 0; j < i; ++j) {
        if (!isBetterMatch(parsedInputs[i], matchResults[i], parsedInputs[j], matchResults[j])) {
          state.mode = 'hard';
          return;
        }
      }
    }
    state.mode = 'nightmare';
  }
}

const migrations = [
  {
    version: '0.1.0',
    migrate: () => {
      recalculateLevelModes();
    },
  },
];

export function runMigraions() {
  for (const migration of migrations) {
    if (compareVersion(version.value, migration.version) < 0) {
      migration.migrate();
    }
  }
  version.value = packageVersion;
}
