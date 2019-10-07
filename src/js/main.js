let showMenu = false;

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  navToggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    if (showMenu) {
      nav.classList.add('hidden');
      showMenu = false;
    } else {
      nav.classList.remove('hidden');
      showMenu = true;
    }
  });
});
