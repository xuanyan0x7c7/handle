import seedrandom from 'seedrandom';
import ALL_IDIOMS_LIST from './all.json';
import NORMAL_IDIOMS_LIST from './normal.json';

const ALL_IDIOMS_SET = new Set(ALL_IDIOMS_LIST);

export function isIdiom(word: string) {
  return ALL_IDIOMS_SET.has(word);
}

const RANDOM_SEED = (import.meta.env.VITE_RANDOM_SEED as string | undefined) ?? 'handle';

function seedShuffle<T>(array: T[], seed = RANDOM_SEED): T[] {
  const rng = seedrandom(seed);
  for (let currentIndex = array.length; currentIndex > 0; --currentIndex) {
    const randomIndex = Math.floor(rng() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export const IDIOMS = seedShuffle(NORMAL_IDIOMS_LIST);

function getHint(word: string) {
  return word[Math.floor(seedrandom(word)() * word.length)];
}

export function getIdiomOfLevel(level: number) {
  const idiom = IDIOMS[level];
  return { word: idiom, hint: getHint(idiom) };
}
