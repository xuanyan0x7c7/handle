import compareVersion from 'semver-compare';
import { version as packageVersion } from '../package.json';
import { IDIOMS, isIdiom } from './idioms';
import { isBetterMatch, parseAndMatchAnswer, parseWord } from './pinyin';
import { history, version } from './storage';
import type { CharMatchResult } from './types';

let levelModesRecalculated = false;

export function recalculateLevelStates(forceRecalculate = false) {
  if (levelModesRecalculated && !forceRecalculate) {
    return;
  }
  for (let level = 0; level < history.value.length; ++level) {
    const state = history.value[level];
    if (state?.trials == null) {
      continue;
    }
    state.mode = state.hintLevel ? null : 'nightmare';
    if (state.trials.length === 0) {
      continue;
    }
    const answer = IDIOMS[level];
    const parsedAnswer = parseWord(answer);
    delete state.passed;
    if (!state.answer) {
      delete state.failed;
    }
    let previousWordMatchResult: CharMatchResult[] | null = null;
    for (let i = 0; i < state.trials.length; ++i) {
      const trial = state.trials[i];
      if (state.trials.slice(0, i).includes(trial)) {
        state.trials.splice(i--, 1);
        continue;
      }
      if (i === 10) {
        state.failed = true;
      }
      if (trial === answer) {
        state.trials.splice(i + 1);
        if (!state.end) {
          if (!state.duration) {
            state.duration = 0;
          }
          state.end = Date.now();
          if (state.start) {
            state.duration += state.end - state.start;
          }
        }
        state.passed = true;
        break;
      }
      if (!isIdiom(trial)) {
        state.mode = null;
      }
      const currentWordMatchResult = parseAndMatchAnswer(trial, parsedAnswer);
      if (
        state.mode === 'nightmare'
        && previousWordMatchResult
        && !isBetterMatch(currentWordMatchResult, previousWordMatchResult)
      ) {
        state.mode = 'hard';
      }
      previousWordMatchResult = currentWordMatchResult;
    }
    if (!state.passed && !state.answer && state.end) {
      state.start = state.end;
      delete state.end;
    }
  }
  levelModesRecalculated = true;
}

const migrations = [
  {
    version: '0.1.0',
    migrate: () => {
      recalculateLevelStates();
    },
  },
  {
    version: '0.1.2',
    migrate: () => {
      recalculateLevelStates();
    },
  },
  {
    version: '0.1.3',
    migrate: () => {
      recalculateLevelStates();
    },
  },
  {
    version: '0.1.4',
    migrate: () => {
      recalculateLevelStates();
    },
  },
  {
    version: '0.1.5',
    migrate: () => {
      recalculateLevelStates();
    },
  },
];

export function runMigrations() {
  for (const migration of migrations) {
    if (compareVersion(version.value, migration.version) < 0) {
      migration.migrate();
      version.value = migration.version;
    }
  }
  version.value = packageVersion;
}
