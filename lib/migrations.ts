import compareVersion from 'semver-compare';
import { version as packageVersion } from '../package.json';
import { IDIOMS, isIdiom } from './idioms';
import { isBetterMatch, parseAndMatchAnswer, parseWord } from './pinyin';
import { history, version } from './storage';

let levelModesRecalculated = false;

function recalculateLevelModes() {
  if (levelModesRecalculated) {
    return;
  }
  for (let level = 0; level < history.value.length; ++level) {
    const state = history.value[level];
    if (state?.trials == null) {
      continue;
    } else if (state.hintLevel || state.trials.some(trial => !isIdiom(trial))) {
      state.mode = null;
      continue;
    }
    state.mode = 'nightmare';
    if (state.trials.length === 0) {
      continue;
    }
    const answer = IDIOMS[level];
    const parsedAnswer = parseWord(answer);
    let previousWordMatchResult = parseAndMatchAnswer(state.trials[0], parsedAnswer);
    for (let i = 1; i < state.trials.length; ++i) {
      const currentWordMatchResult = parseAndMatchAnswer(state.trials[i], parsedAnswer);
      if (!isBetterMatch(currentWordMatchResult, previousWordMatchResult)) {
        state.mode = 'hard';
        break;
      }
      previousWordMatchResult = currentWordMatchResult;
    }
  }
  levelModesRecalculated = true;
}

const migrations = [
  {
    version: '0.1.0',
    migrate: () => {
      recalculateLevelModes();
    },
  },
  {
    version: '0.1.2',
    migrate: () => {
      recalculateLevelModes();
    },
  },
  {
    version: '0.1.3',
    migrate: () => {
      recalculateLevelModes();
    },
  },
  {
    version: '0.1.4',
    migrate: () => {
      recalculateLevelModes();
    },
  },
];

export function runMigraions() {
  for (const migration of migrations) {
    if (compareVersion(version.value, migration.version) < 0) {
      migration.migrate();
      version.value = migration.version;
    }
  }
  version.value = packageVersion;
}
