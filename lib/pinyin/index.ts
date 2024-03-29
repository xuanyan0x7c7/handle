import type { MatchResult, ParsedChar, MatchType, CharMatchResult } from '../types';
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

export function parseAndMatchAnswer(word: string, parsedAnswer: ParsedChar[]) {
  const parsedWord = parseWord(word);
  const matchResult = matchAnswer(parsedWord, parsedAnswer);
  const list: CharMatchResult[] = [];
  for (let i = 0; i < word.length; ++i) {
    list.push({ parsedChar: parsedWord[i], matchResult: matchResult[i] });
  }
  return list;
}

export function isBetterMatch(current: CharMatchResult[], previous: CharMatchResult[]) {
  for (const key of ['char', 'displayInitial', 'final', 'tone'] as const) {
    const currentMisplacedCount: Record<string | number, number> = {};
    const previousMisplacedCount: Record<string | number, number> = {};
    for (let charIndex = 0; charIndex < 4; ++charIndex) {
      const currentParsedChar = current[charIndex].parsedChar[key];
      const currentMatchResult = current[charIndex].matchResult[key];
      const previousParsedChar = previous[charIndex].parsedChar[key];
      const previousMatchResult = previous[charIndex].matchResult[key];
      if (previousParsedChar && previousMatchResult === 'exact') {
        if (currentMatchResult === 'exact') {
          continue;
        } else {
          return false;
        }
      }
      if (currentParsedChar && currentMatchResult !== 'none') {
        currentMisplacedCount[currentParsedChar] = (currentMisplacedCount[currentParsedChar] ?? 0) + 1;
      }
      if (previousParsedChar && previousMatchResult === 'misplaced') {
        previousMisplacedCount[previousParsedChar] = (previousMisplacedCount[previousParsedChar] ?? 0) + 1;
      }
    }
    for (const item of Object.keys(previousMisplacedCount)) {
      if ((currentMisplacedCount[item] ?? 0) < previousMisplacedCount[item]) {
        return false;
      }
    }
  }
  return true;
}
