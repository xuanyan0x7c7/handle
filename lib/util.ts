export const isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
export const isMobile = isIOS || /iPad|iPhone|iPod|Android|Phone|webOS/i.test(navigator.userAgent);

export function formatDuration(duration: number) {
  const time = duration / 1000;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time % 3600 / 60);
  const seconds = Math.round(time % 60);
  if (hours) {
    return `${hours}时${minutes}分${seconds}秒`;
  }
  if (minutes) {
    return `${minutes}分${seconds}秒`;
  }
  return `${seconds}秒`;
}
