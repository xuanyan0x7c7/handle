export type ParsedChar = {
  char: string;
  pinyin: string;
  initial: string;
  final: string;
  displayInitial: string;
  displayFinal: string;
  tone: number;
};

export type MatchType = 'exact' | 'misplaced' | 'none';
export type ExtendedMatchType = MatchType | 'deleted';
export type MatchResult = Record<'char' | 'displayInitial' | 'final' | 'tone', MatchType>;
export type ExtendedMatchResult = Record<keyof MatchResult, ExtendedMatchType>;

export type CharMatchResult = {
  parsedChar: ParsedChar;
  matchResult: MatchResult;
};

export type HardMode = 'hard' | 'nightmare' | null;

export type LevelState = {
  answer?: boolean;
  start?: number;
  end?: number;
  duration?: number;
  failed?: boolean;
  passed?: boolean;
  trials?: string[];
  hintLevel?: 'pinyin' | 'char';
  mode?: HardMode;
};
