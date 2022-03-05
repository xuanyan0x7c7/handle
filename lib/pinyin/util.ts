export const pinyinInitials = 'b p m f d t n l g k h j q x zh ch sh r z c s'.split(/\s/g);
export const pinyinFinals = 'a o e ai ei ao ou an en ang eng ong i ia ie iao iou ian in iang ing iong u ua uo uai uei uan uen uang ueng ü üe üan ün er'.split(/\s/g);

type Pinyin = {
  pinyin: string;
  initial: string;
  final: string;
  displayInitial: string;
  displayFinal: string;
};

export function parsePinyin(pinyin: string) {
  if (pinyin == null) {
    console.trace();
  }
  const displayPinyin = pinyin.replace('v', 'ü');
  const formattedPinyin = displayPinyin
    .replace(/([jqxy])u(\w*)$/, '$1ü$2')
    .replace('iu', 'iou')
    .replace('ui', 'uei')
    .replace('un', 'uen')
    .replace(/y(?![iü])/, 'i')
    .replace(/w(?!u)/, 'u')
    .replace('y', '')
    .replace('w', '');
  const initial = ['ng', ...pinyinInitials].find(initial => formattedPinyin.startsWith(initial)) ?? '';
  const final = formattedPinyin.slice(initial.length);
  let displayInitial = initial;
  if (!initial) {
    if (final.startsWith('i') || final.startsWith('ü')) {
      displayInitial = 'y';
    } else if (final.startsWith('u')) {
      displayInitial = 'w';
    }
  }
  return {
    pinyin: displayPinyin,
    initial,
    final,
    displayInitial,
    displayFinal: displayPinyin.slice(displayInitial.length),
  } as Pinyin;
}
