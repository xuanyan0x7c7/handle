import type { MatchResult, ParsedChar, MatchType } from '../types';
import pinyin, { PINYIN_STYLE } from '../pinyin-parser';
import { parsePinyin } from './util';

function getPinyin(word: string) {
  if (word === '') {
    return '';
  }
  const list = pinyin.convert(word, { style: PINYIN_STYLE.TONE2, segment: true });
  return list.flat();
}

function parseChar(char: string, pinyin: string): ParsedChar {
  const tone = /\d$/.test(pinyin) ? Number(pinyin.slice(-1)) : 0;
  if (tone) {
    pinyin = pinyin.slice(0, -1);
  }
  return {
    char,
    ...parsePinyin(pinyin),
    tone,
  };
}

function splitWord(word: string) {
  const result: string[] = [];
  for (const char of word) {
    if (result.length > 0 && result[result.length - 1] !== ' ' && char !== ' ') {
      result[result.length - 1] += char;
    } else {
      result.push(char);
    }
  }
  return result;
}

export function parseWord(word: string) {
  const pinyins = splitWord(word.replace(/\s/, ' ')).map(getPinyin).flat();
  return [...word].map((char, index) => parseChar(char, pinyins[index]));
}

export function matchAnswer(input: ParsedChar[], answer: ParsedChar[]): MatchResult[] {
  const unmatched = {
    char: new Array<string>(),
    displayInitial: new Array<string>(),
    final: new Array<string>(),
    tone: new Array<number>(),
  };
  for (let i = 0; i < input.length; ++i) {
    if (answer[i].char !== input[i].char) {
      unmatched.char.push(answer[i].char);
    }
    if (answer[i].displayInitial !== input[i].displayInitial) {
      unmatched.displayInitial.push(answer[i].displayInitial);
    }
    if (answer[i].final !== input[i].final) {
      unmatched.final.push(answer[i].final);
    }
    if (answer[i].tone !== input[i].tone) {
      unmatched.tone.push(answer[i].tone);
    }
  }

  function includesAndRemove<T>(array: T[], value: T) {
    const index = array.indexOf(value);
    if (index >= 0) {
      array.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }

  function getMatchType(x: ParsedChar, y: ParsedChar, key: keyof MatchResult): MatchType {
    if (x[key] === y[key]) {
      return 'exact';
    } else if (includesAndRemove(unmatched[key], x[key])) {
      return 'misplaced';
    } else {
      return 'none';
    }
  }

  return input.map((parsedChar, index) => ({
    char: getMatchType(parsedChar, answer[index], 'char'),
    displayInitial: getMatchType(parsedChar, answer[index], 'displayInitial'),
    final: getMatchType(parsedChar, answer[index], 'final'),
    tone: getMatchType(parsedChar, answer[index], 'tone'),
  }));
}

export function isBetterMatch(
  currentParsedInput: ParsedChar[],
  currentMatch: MatchResult[],
  previousParsedInput: ParsedChar[],
  previousMatch: MatchResult[],
) {
  console.log(currentParsedInput, currentMatch, previousParsedInput, previousMatch);
  for (const key of ['char', 'displayInitial', 'final', 'tone'] as const) {
    const currentMisplacedCount: Record<string | number, number> = {};
    const previousMisplacedCount: Record<string | number, number> = {};
    for (let charIndex = 0; charIndex < 4; ++charIndex) {
      const currentItem = currentParsedInput[charIndex][key];
      const currentMatchItem = currentMatch[charIndex][key];
      const previousItem = previousParsedInput[charIndex][key];
      const previousMatchItem = previousMatch[charIndex][key];
      if (previousItem && previousMatchItem === 'exact') {
        if (currentMatchItem === 'exact') {
          continue;
        } else {
          return false;
        }
      }
      if (currentItem && currentMatchItem !== 'none') {
        currentMisplacedCount[currentItem] = (currentMisplacedCount[currentItem] ?? 0) + 1;
      }
      if (previousItem && previousMatchItem === 'misplaced') {
        previousMisplacedCount[previousItem] = (previousMisplacedCount[previousItem] ?? 0) + 1;
      }
    }
    console.log(key, currentMisplacedCount, previousMisplacedCount);
    for (const item of Object.keys(previousMisplacedCount)) {
      if ((currentMisplacedCount[item] ?? 0) < previousMisplacedCount[item]) {
        return false;
      }
    }
  }
  return true;
}
