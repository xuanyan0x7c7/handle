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
  group: boolean;
};

export const DEFAULT_OPTIONS: Options = {
  style: PINYIN_STYLE.TONE,
  segment: false,
  heteronym: false,
  group: false,
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

function combo2array(array1: string[], array2: string[]) {
  if (array1.length === 0) {
    return array2;
  }
  if (array2.length === 0) {
    return array1;
  }
  const result: string[] = [];
  for (let i = 0, l = array1.length; i < l; ++i) {
    for (let j = 0, m = array2.length; j < m; ++j) {
      result.push(array1[i] + array2[j]);
    }
  }
  return result;
}

function combo(array: string[][]) {
  return array.reduce(combo2array, []);
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
    for (const words of phrases) {
      const firstCharCode = words.charCodeAt(0);
      if (this.pinyinDict[firstCharCode]) {
        if (noHans.length > 0) {
          pinyins.push([noHans]);
          noHans = '';
        }
        const newPinyins = words.length === 1
          ? this.simpleConvert(words, mergedOptions)
          : this.phrasePinyin(words, mergedOptions);
        if (mergedOptions.group) {
          pinyins.push(combo(newPinyins));
        } else {
          pinyins.push(...newPinyins);
        }
      } else {
        noHans += words;
      }
    }
    if (noHans.length > 0) {
      pinyins.push([noHans]);
    }
    return pinyins;
  }

  compare(hanA: string, hanB: string) {
    const pinyinA = this.simpleConvert(hanA, DEFAULT_OPTIONS);
    const pinyinB = this.simpleConvert(hanB, DEFAULT_OPTIONS);
    return String(pinyinA).localeCompare(String(pinyinB));
  }

  private simpleConvert(hans: string, options: Partial<Options> = {}) {
    const mergedOptions: Options = Object.assign({}, DEFAULT_OPTIONS, options);
    const pinyins: string[][] = [];
    let noHans = '';
    for (const words of hans) {
      const firstCharCode = words.charCodeAt(0);
      if (this.pinyinDict[firstCharCode]) {
        if (noHans.length > 0) {
          pinyins.push([noHans]);
          noHans = '';
        }
        pinyins.push(this.singlePinyin(words, mergedOptions));
      } else {
        noHans += words;
      }
    }
    if (noHans.length > 0) {
      pinyins.push([noHans]);
    }
    return pinyins;
  }

  private phrasePinyin(phrase: string, options: Options) {
    const pinyins: string[][] = [];
    if (phrase in this.phrasesDict) {
      for (const item of this.phrasesDict[phrase]) {
        pinyins.push(
          options.heteronym
            ? item.map(pyItem => Pinyin.toFixed(pyItem, options.style))
            : [Pinyin.toFixed(item[0], options.style)],
        );
      }
    } else {
      for (const word of phrase) {
        pinyins.push(...this.simpleConvert(word, options));
      }
    }
    return pinyins;
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
      { default: phrasesDict },
    ] = await Promise.all([
      import('./data/dict-zi.json'),
      import('./data/phrases-dict.json'),
    ]);
    pinyin.setDict(pinyinDict, phrasesDict);
  }
}

export default pinyin;
