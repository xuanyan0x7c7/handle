import { preferZhuyin, t } from './i18n'
import type { InputMode, TriesMeta } from './logic'

export const legacyTries = useStorage<Record<number, string[]>>('handle.xuanyan.ws-tries', {})

export const initialized = useStorage('handle.xuanyan.ws-initialized', false)
export const history = useStorage<TriesMeta[]>('handle.xuanyan.ws-tries-meta', [])
export const inputMode = useStorage<InputMode>('handle.xuanyan.ws-mode', preferZhuyin ? 'zy' : 'py')
export const useNumberTone = useStorage('handle.xuanyan.ws-number-tone', false)
export const colorblind = useStorage('handle.xuanyan.ws-colorblind', false)
export const hardMode = useStorage('handle.xuanyan.ws-hard-mode', false)
export const checkAssist = useStorage('handle.xuanyan.ws-check-assist', false)
export const acceptCollecting = useStorage('handle.xuanyan.ws-accept-collecting', true)
export const currentLevel = useStorage('handle.xuanyan.ws-level', 0)

if (!Array.isArray(history.value)) {
  const newHistory: TriesMeta[] = []
  for (const [level, meta] of Object.entries(history.value as Record<number, TriesMeta>))
    newHistory[Number.parseInt(level)] = meta
  history.value = newHistory
}

export const meta = computed<TriesMeta>({
  get() {
    if (!(currentLevel.value in history.value))
      history.value[currentLevel.value] = {}
    return history.value[currentLevel.value]
  },
  set(v) {
    history.value[currentLevel.value] = v
  },
})

export const tries = computed<string[]>({
  get() {
    if (!meta.value.tries)
      meta.value.tries = []
    return legacyTries.value[currentLevel.value] || meta.value.tries
  },
  set(v) {
    meta.value.tries = v
  },
})

export function markStart() {
  if (meta.value.end)
    return
  if (!meta.value.start)
    meta.value.start = Date.now()
}

export function markEnd() {
  if (meta.value.end)
    return

  if (!meta.value.duration)
    meta.value.duration = 0

  meta.value.end = Date.now()
  if (meta.value.start)
    meta.value.duration += meta.value.end - meta.value.start
}

export function pauseTimer() {
  if (meta.value.end)
    return

  if (!meta.value.duration)
    meta.value.duration = 0

  if (meta.value.start) {
    meta.value.duration += Date.now() - meta.value.start
    meta.value.start = undefined
  }
}

export const gamesCount = computed(() => history.value.filter(m => m.passed || m.answer || m.failed).length)
export const passedTries = computed(() => history.value.filter(m => m.passed))
export const passedCount = computed(() => passedTries.value.length)
export const noHintPassedCount = computed(() => history.value.filter(m => m.passed && !m.hint).length)
export const historyTriesCount = computed(() => history.value.filter(m => m.passed || m.answer || m.failed).map(m => m.tries?.length || 0).reduce((a, b) => a + b, 0))

export const triesCount = computed(() => tries.value.length)
export const averageDurations = computed(() => {
  const items = history.value.filter(m => m.passed && m.duration)
  if (!items.length)
    return 0
  const durations = items.map(m => m.duration!).reduce((a, b) => a + b, 0)
  return formatDuration(durations / items.length)
})

export function formatDuration(duration: number) {
  const ts = duration / 1000
  const m = Math.floor(ts / 60)
  const s = Math.round(ts % 60)
  if (m)
    return m + t('minutes') + s + t('seconds')
  return s + t('seconds')
}
