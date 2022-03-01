<script setup lang="ts">
import confetti from 'canvas-confetti'
import { answer, isFailed, isFinished, isPassed, levelNoHanzi, showCheatSheet, showFailed, showHelp, showHint, useMask } from '~/state'
import { currentLevel, gamesCount, hardMode, markStart, meta, tries } from '~/storage'
import { t } from '~/i18n'
import { TRIES_LIMIT, WORD_LENGTH } from '~/logic'

const el = ref<HTMLInputElement>()
const input = ref('')
const inputValue = ref('')

const isFinishedDelay = debouncedRef(isFinished, 800)

function go() {
  if (input.value.length !== WORD_LENGTH)
    return
  tries.value.push(input.value)
  input.value = ''
  inputValue.value = ''
}
function handleInput(e: Event) {
  const el = (e.target! as HTMLInputElement)
  input.value = Array.from(el.value)
    .filter(i => /\p{Script=Han}/u.test(i))
    .slice(0, 4)
    .join('')
  markStart()
}
function focus() {
  el.value?.focus()
}
function hint() {
  meta.value.hint = true
  if (!meta.value.hintLevel)
    meta.value.hintLevel = 1
  showHint.value = true
}
function sheet() {
  showCheatSheet.value = true
}
function congrats() {
  const defaults = {
    colors: [
      '#5D8C7B',
      '#F2D091',
      '#F2A679',
      '#D9695F',
      '#8C4646',
    ],
    shapes: ['square'],
    ticks: 500,
  } as confetti.Options
  confetti({
    ...defaults,
    particleCount: 80,
    spread: 100,
    origin: { y: 0 },
  })
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      angle: 60,
      spread: 80,
      origin: { x: 0 },
    })
  }, 250)
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 50,
      angle: 120,
      spread: 80,
      origin: { x: 1 },
    })
  }, 400)
}

function previousLevel() {
  currentLevel.value = currentLevel.value - 1
  useMask.value = false
}

function nextLevel() {
  currentLevel.value = currentLevel.value + 1
  useMask.value = false
}

watch(isPassed, (v) => {
  if (v)
    setTimeout(congrats, 300)
}, { flush: 'post' })

watchEffect(() => {
  if (!showHelp.value)
    focus()
})

watchEffect(() => {
  if (isFailed.value && !meta.value.failed) {
    meta.value.failed = true
    setTimeout(() => {
      showFailed.value = true
    }, 1200)
  }
})
</script>

<template>
  <div>
    <div flex="~ col" pt4 items-center text-2xl>
      <div flex="~ gap-8">
        <button btn px2 :disabled="currentLevel === 0" @click="previousLevel">
          <div i-carbon-arrow-left />
        </button>
        {{ levelNoHanzi }}
        <button btn px-2 :disabled="currentLevel >= gamesCount" @click="nextLevel">
          <div i-carbon-arrow-right />
        </button>
      </div>
    </div>
    <div flex="~ col gap-2" pt4 items-center>
      <WordBlocks v-for="w,i of tries" :key="i" :word="w" :revealed="true" @click="focus()" />

      <template v-if="meta.answer">
        <div my4>
          <div font-serif p2>
            {{ t('correct-answer') }}
          </div>
          <WordBlocks :word="answer.word" />
        </div>
      </template>

      <WordBlocks v-if="!isFinished" :word="input" :active="true" @click="focus()" />

      <Transition name="fade-out">
        <div v-if="!isFinished" flex="~ col gap-2" items-center>
          <input
            ref="el"
            v-model="inputValue"
            type="text"
            autocomplete="false"
            outline-none
            :placeholder="t('input-placeholder')"
            w-86 p3
            border="2 base"
            text="center"
            bg="transparent"
            :disabled="isFinished"
            @input="handleInput"
            @keydown.enter="go"
          >
          <button
            mt3
            btn p="x6 y2"
            :disabled="input.length !== WORD_LENGTH"
            @click="go"
          >
            {{ t('ok-spaced') }}
          </button>
          <div v-if="tries.length > 4 && !isFailed" op50>
            {{ t('tries-rest', TRIES_LIMIT - tries.length) }}
          </div>
          <button v-if="isFailed" icon-btn text-base gap-1 my4 inline-flex items-center justify-center @click="showFailed = true">
            <div i-mdi-emoticon-devil-outline /> {{ t('view-answer') }}
          </button>

          <div flex="~ center gap-4" mt4 :class="isFinished ? 'op0! pointer-events-none' : ''">
            <button v-if="!hardMode" icon-btn text-base pb2 gap-1 flex="~ center" @click="hint()">
              <div i-carbon-idea /> {{ t('hint') }}
            </button>
            <button icon-btn text-base pb2 gap-1 flex="~ center" @click="sheet()">
              <div i-carbon-grid /> {{ t('cheatsheet') }}
            </button>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div v-if="isFinishedDelay && isFinished">
          <ResultFooter />
          <Countdown />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.fade-enter-active {
  transition: all 1s ease;
}
.fade-out-leave-active {
  transition: all 0.5s ease;
}

.fade-out-leave-to,
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
