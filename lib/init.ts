import { isFinished, isPassed, showCheatSheet, showHelp } from './state';
import { initialized, levelState, markEnd, markStart } from './storage';

if (/MicroMessenger/i.test(navigator.userAgent)) {
  alert('建议在外部浏览器中打开本游戏，以便获得更好的体验。');
}

if (!initialized.value) {
  showHelp.value = true;
}

watch(isPassed, passed => {
  if (passed) {
    levelState.value.passed = true;
  }
},
{ immediate: true });

watch(isFinished, finished => {
  if (finished) {
    markEnd();
    showCheatSheet.value = false;
  }
},
{ flush: 'post' });

function pauseTimer() {
  if (levelState.value.end) {
    return;
  }
  if (!levelState.value.duration) {
    levelState.value.duration = 0;
  }
  if (levelState.value.start) {
    levelState.value.duration += Date.now() - levelState.value.start;
    levelState.value.start = undefined;
  }
}

const visible = useDocumentVisibility();
let leaveTime = 0;
watch(visible, visible => {
  if (visible === 'visible') {
    if (leaveTime && Date.now() - leaveTime > 3 * 3600 * 1000) {
      location.reload();
    }
    if (levelState.value.duration) {
      markStart();
    }
  } else {
    leaveTime = Date.now();
    pauseTimer();
  }
}, { flush: 'post' });
