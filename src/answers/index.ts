import seedrandom from 'seedrandom'
import DATA from '../data/idioms.json'
import { getHint } from '../logic'
import { answers } from './list'
import { seedShuffle } from './utils'
import { RANDOM_SEED } from '~/logic'

const DATA_SET = DATA.length

export function getAnswerOfDay(day: number) {
  let [word = '', hint = ''] = answers[day] || []
  if (!word) {
    const rng = seedrandom(RANDOM_SEED)
    for (let i = 0; i <= day; i++)
      rng()
    word = DATA[Math.floor(rng() * DATA_SET - 1)][0]
  }
  if (!hint)
    hint = getHint(word)
  return {
    word,
    hint,
  }
}

const WORDS = seedShuffle(DATA)

export function getLevelWord(level: number) {
  const word = WORDS[level % DATA_SET][0]
  return {
    word,
    hint: getHint(word),
  }
}
