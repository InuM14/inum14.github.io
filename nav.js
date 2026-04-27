/* ============================================================
   The Fighting Games Hub — nav.js
   Shared hamburger menu logic
   ============================================================ */

const btn  = document.getElementById('hamburgerBtn');
const menu = document.getElementById('navMenu');

btn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  btn.classList.toggle('open', open);
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('open');
    btn.classList.remove('open');
  }
});

// Close when a nav link is followed
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  btn.classList.remove('open');
}));
