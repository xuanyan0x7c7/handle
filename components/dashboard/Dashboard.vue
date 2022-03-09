<template>
  <section class="relative flex flex-col justify-center items-center p-5">
    <div class="absolute top-4 right-4 flex gap-3">
      <button class="icon-btn" @click="close()">
        <Icon icon="carbon-close" />
      </button>
    </div>
    <header class="mb-2 text-xl font-serif">
      <b>计分板</b>
    </header>
    <div v-if="passedTrials.length >= 3 && trialsCountList.length > 0" class="w-full max-w-100 my-4 p-4 bg-gray-400/5">
      <p class="-mt-1 mb-2 text-center text-lg font-serif tracking-widest">
        尝试次数分布
      </p>
      <div v-for="count, trials in trialsCountList" :key="trials" class="flex gap-2 items-center">
        <template v-if="trials > 0">
          <div class="flex-none w-6 opacity-50 text-right">
            {{ trials === 10 ? '10+' : trials }}
          </div>
          <div
            class="flex justify-end h-5 bg-$c-primary text-right text-white"
            :style="{ width: Math.max(count / trialsMaxCount * 100, 1) + '%' }"
          >
            <div v-if="count > 0" class="my-auto mr-1 text-sm">
              {{ count }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="flex flex-wrap gap-4 justify-center min-w-100px py-2">
      <DashboardItem :value="gamesCount">
        游戏次数
      </DashboardItem>
      <DashboardItem :value="passedCount">
        获胜次数
      </DashboardItem>
      <DashboardItem :value="Math.round(passedCount / gamesCount * 100) + '%'">
        胜率
      </DashboardItem>
    </div>
    <div class="flex flex-wrap gap-4 justify-center min-w-100px py-2">
      <DashboardItem :value="noHintPassedCount">
        无提示
      </DashboardItem>
      <DashboardItem :value="hardPassedCount">
        困难模式
      </DashboardItem>
      <DashboardItem :value="nightmarePassedCount">
        地狱模式
      </DashboardItem>
    </div>
    <div class="flex flex-wrap gap-4 justify-center min-w-100px py-2">
      <DashboardItem :value="Math.round(historyTrialsCount / gamesCount * 10) / 10">
        平均尝试
      </DashboardItem>
      <DashboardItem :value="averageDuration ?? '-'">
        平均用时
      </DashboardItem>
    </div>
    <div class="flex flex-wrap gap-4 justify-center min-w-100px py-2">
      <DashboardItem :value="idiomStats.distinctIdiomsCount">
        成语使用
      </DashboardItem>
      <DashboardItem :value="Math.round(idiomStats.idiomsCount / idiomStats.wordsCount * 100) + '%'">
        成语比例
      </DashboardItem>
    </div>
  </section>
</template>

<script setup lang="ts">
import { isIdiom } from '@/lib/idioms';
import { showDashboard } from '@/lib/state';
import { gamesCount, history } from '@/lib/storage';
import { formatDuration } from '@/lib/util';

const passedTrials = computed(() => history.value.filter(state => state?.passed).map(x => x!));
const passedCount = computed(() => passedTrials.value.length);
const noHintPassedCount = computed(() => history.value.filter(state => state?.passed && state.hintLevel == null).length);
const hardPassedCount = computed(() => history.value.filter(state => state?.passed && state.mode === 'hard').length);
const nightmarePassedCount = computed(() => history.value.filter(state => state?.passed && state.mode === 'nightmare').length);
const historyTrialsCount = computed(
  () => history.value
    .filter(state => state && (state.passed || state.answer || state.failed))
    .map(state => state!.trials?.length ?? 0)
    .reduce((x, y) => x + y, 0),
);

const trialsCountList = computed(() => {
  const list = new Array<number>(11).fill(0);
  for (const state of passedTrials.value) {
    const count = Math.min(state.trials!.length, 10);
    ++list[count];
  }
  while (list[list.length - 1] === 0) {
    list.pop();
  }
  return list;
});

const trialsMaxCount = computed(() => Math.max(1, ...trialsCountList.value));

const averageDuration = computed(() => {
  const items = history.value.filter(level => level?.passed && level.duration).map(x => x!);
  if (items.length === 0) {
    return null;
  }
  const durations = items.map(m => m.duration!).reduce((a, b) => a + b);
  return formatDuration(durations / items.length);
});

const idiomStats = computed(() => {
  const usedIdioms = new Set<string>();
  let wordsCount = 0;
  let idiomsCount = 0;
  for (const state of history.value) {
    if (state?.trials == null) {
      continue;
    }
    for (const word of state.trials) {
      ++wordsCount;
      if (isIdiom(word)) {
        ++idiomsCount;
        usedIdioms.add(word);
      }
    }
  }
  return {
    wordsCount,
    idiomsCount,
    distinctIdiomsCount: usedIdioms.size,
  };
});

function close() {
  showDashboard.value = false;
}
</script>
