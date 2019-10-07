let mode = 'info';
const buttons = document.querySelectorAll('#card-mode-toggle button');

document.addEventListener('DOMContentLoaded', () => {
  for (let button of buttons) {
    button.addEventListener('click', event => {
      const element = event.target;
      if (element.dataset.mode !== mode) {
        const oldMode = mode;
        mode = element.dataset.mode;
        switchMode(element.dataset.mode, oldMode);
      }
    });
  }
});

const switchMode = (newMode, oldMode) => {
  const toShow = document.querySelector('#company-card-' + newMode);
  const toHide = document.querySelector('#company-card-' + oldMode);

  if (toShow) {
    toShow.style.display = 'flex';
  }
  if (toHide) {
    toHide.style.display = 'none';
  }

  for (let button of buttons) {
    if (button.dataset.mode === newMode) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  }
};
