const modeBtn = document.getElementById('mode-btn');
const onOffBtn = document.getElementById('onoff-btn');

modeBtn.addEventListener('click', () => {
  if (modeBtn.classList.contains('auto-mode')) {
    modeBtn.classList.remove('auto-mode');
    modeBtn.classList.add('manual-mode');
    modeBtn.textContent = 'Manual';
    onOffBtn.style.display = 'block';
  } else {
    modeBtn.classList.remove('manual-mode');
    modeBtn.classList.add('auto-mode');
    modeBtn.textContent = 'Auto';
    onOffBtn.style.display = 'none';
  }
});

onOffBtn.addEventListener('click', () => {
  if (onOffBtn.classList.contains('off-mode')) {
    onOffBtn.classList.remove('off-mode');
    onOffBtn.classList.add('on-mode');
    onOffBtn.textContent = 'On';
    // turn on irrigation system code here
  } else {
    onOffBtn.classList.remove('on-mode');
    onOffBtn.classList.add('off-mode');
    onOffBtn.textContent = 'Off';
    // turn off irrigation system code here
  }
});
