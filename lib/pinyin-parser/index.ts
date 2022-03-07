import PHONETIC_SYMBOL from './phonetic-symbol';

export enum PINYIN_STYLE {
  NORMAL,
  TONE,
  TONE2,
  TO3NE,
  INITIALS,
  FIRST_LETTER,
};

export type Options = {
  style: PINYIN_STYLE;
  segment: boolean;
  heteronym: boolean;
};

export const DEFAULT_OPTIONS: Options = {
  style: PINYIN_STYLE.TONE,
  segment: false,
  heteronym: false,
};

const INITIALS = 'b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,zh,ch,sh,z,c,s'.split(',');
const RE_PHONETIC_SYMBOL = new RegExp(`([${Object.keys(PHONETIC_SYMBOL).join('')}])`, 'g');
const RE_TONE2 = /([aeoiuvnm])([0-4])$/;

function initials(pinyin: string) {
  for (let i = 0, l = INITIALS.length; i < l; i++) {
    if (pinyin.indexOf(INITIALS[i]) === 0) {
      return INITIALS[i];
    }
  }
  return '';
}

let jieba: {
  init: () => Promise<void>;
  cut: (text: string, hmm: boolean) => string[];
} | null = null;

function product<T>(array: T[][]) {
  function productReduce<T>(array1: T[][], array2: T[]) {
    const result: T[][] = [];
    for (const x of array1) {
      for (const y of array2) {
        result.push([...x, y]);
      }
    }
    return result;
  }
  let result: T[][] = [[]];
  for (const item of array) {
    result = productReduce(result, item);
  }
  return result;
}

class Pinyin {
  private pinyinDict: string[] = [];
  private phrasesDict: Record<string, string[][]> = {};

  private static toFixed(pinyin: string, style: PINYIN_STYLE) {
    if (style === PINYIN_STYLE.NORMAL) {
      return pinyin.replace(RE_PHONETIC_SYMBOL, ($0, $1) => PHONETIC_SYMBOL[$1].replace(RE_TONE2, '$1'));
    } else if (style === PINYIN_STYLE.TONE) {
      return pinyin;
    } else if (style === PINYIN_STYLE.TONE2) {
      let tone = '';
      const py = pinyin.replace(RE_PHONETIC_SYMBOL, ($0, $1) => {
        tone = PHONETIC_SYMBOL[$1].replace(RE_TONE2, '$2');
        return PHONETIC_SYMBOL[$1].replace(RE_TONE2, '$1');
      });
      return py + tone;
    } else if (style === PINYIN_STYLE.TO3NE) {
      return pinyin.replace(RE_PHONETIC_SYMBOL, ($0, $1) => PHONETIC_SYMBOL[$1]);
    } else if (style === PINYIN_STYLE.INITIALS) {
      return initials(pinyin);
    } else {
      let firstLetter = pinyin.charAt(0);
      if (firstLetter in PHONETIC_SYMBOL) {
        firstLetter = PHONETIC_SYMBOL[firstLetter].charAt(0);
      }
      return firstLetter;
    }
  }

  setDict(pinyinDict: string[], phrasesDict: Record<string, string[][]>) {
    this.pinyinDict = pinyinDict;
    this.phrasesDict = phrasesDict;
  }

  convert(hans: string, options: Partial<Options> = {}) {
    const mergedOptions: Options = Object.assign({}, DEFAULT_OPTIONS, options);
    const phrases = mergedOptions.segment ? jieba!.cut(hans, true) : hans;
    const pinyins: string[][] = [];
    let noHans = '';
    for (const phrase of phrases) {
      const firstCharCode = phrase.charCodeAt(0);
      if (this.pinyinDict[firstCharCode]) {
        if (noHans.length > 0) {
          pinyins.push([noHans]);
          noHans = '';
        }
        pinyins.push(
          phrase.length === 1
            ? this.simpleConvert(phrase, mergedOptions)
            : this.phrasePinyin(phrase, mergedOptions),
        );
      } else {
        noHans += phrase;
      }
    }
    if (noHans.length > 0) {
      pinyins.push([noHans]);
    }
    return product(pinyins).map(pinyin => pinyin.flatMap(s => s.split(' ')));
  }

  compare(hanA: string, hanB: string) {
    const pinyinA = this.simpleConvert(hanA, DEFAULT_OPTIONS);
    const pinyinB = this.simpleConvert(hanB, DEFAULT_OPTIONS);
    return String(pinyinA).localeCompare(String(pinyinB));
  }

  private simpleConvert(hans: string, options: Options) {
    const pinyins: string[][] = [];
    let noHans = '';
    for (const words of hans) {
      const firstCharCode = words.charCodeAt(0);
      if (this.pinyinDict[firstCharCode]) {
        if (noHans.length > 0) {
          pinyins.push([noHans]);
          noHans = '';
        }
        pinyins.push(this.singlePinyin(words, options));
      } else {
        noHans += words;
      }
    }
    if (noHans.length > 0) {
      pinyins.push([noHans]);
    }
    return product(pinyins).map(pinyin => pinyin.join(' '));
  }

  private phrasePinyin(phrase: string, options: Options) {
    if (phrase in this.phrasesDict) {
      const toFixed = (pinyin: string) => Pinyin.toFixed(pinyin, options.style);
      if (options.heteronym) {
        return this.phrasesDict[phrase].map(pinyin => pinyin.map(toFixed).join(' '));
      } else {
        return [this.phrasesDict[phrase][0].map(toFixed).join(' ')];
      }
    } else {
      const pinyins: string[][] = [];
      for (const word of phrase) {
        pinyins.push(this.simpleConvert(word, options));
      }
      return product(pinyins).map(pinyin => pinyin.join(' '));
    }
  }

  private singlePinyin(han: string, options: Options): string[] {
    const hanCode = han.charCodeAt(0);
    if (!this.pinyinDict[hanCode]) {
      return [han];
    }
    const pys = this.pinyinDict[hanCode].split(',');
    if (!options.heteronym) {
      return [Pinyin.toFixed(pys[0], options.style)];
    }
    const pyCached = new Set<string>();
    const pinyins: string[] = [];
    for (const p of pys) {
      const py = Pinyin.toFixed(p, options.style);
      if (pyCached.has(py)) {
        continue;
      }
      pyCached.add(py);
      pinyins.push(py);
    }
    return pinyins;
  }
}

const pinyin = new Pinyin();

export async function initJieba() {
  if (jieba == null) {
    jieba = await import('./jieba');
    await jieba.init();
    const [
      { default: pinyinDict },
      { default: phrasesJSON },
    ] = await Promise.all([
      import('./data/dict-zi.json'),
      import('./data/phrases-dict.json'),
    ]);
    const phrasesDict: Record<string, string[][]> = {};
    for (const [phrase, pinyins] of Object.entries(phrasesJSON)) {
      phrasesDict[phrase] = pinyins.map(pinyin => pinyin.split(' '));
    }
    pinyin.setDict(pinyinDict, phrasesDict);
  }
}

export default pinyin;
