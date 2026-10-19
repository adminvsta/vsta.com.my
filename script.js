const body = document.body;
const menuButton = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.site-nav a');
const header = document.querySelector('.site-header');
const headerIdleDelay = 3000;
let headerIdleTimer;
let previousScrollY = window.scrollY;

function headerIsInUse() {
  return body.classList.contains('nav-open') ||
    (header.contains(document.activeElement) && document.activeElement.matches(':focus-visible'));
}

function hideHeader() {
  if (!headerIsInUse()) header.classList.add('is-hidden');
}

function showHeader() {
  header.classList.remove('is-hidden');
  window.clearTimeout(headerIdleTimer);
  headerIdleTimer = window.setTimeout(hideHeader, headerIdleDelay);
}

function updateHeader() {
  const currentScrollY = Math.max(0, window.scrollY);
  header.classList.toggle('is-scrolled', currentScrollY > 24);
  if (Math.abs(currentScrollY - previousScrollY) < 5) return;
  if (currentScrollY < previousScrollY) showHeader();
  else hideHeader();
  previousScrollY = currentScrollY;
}

updateHeader();
showHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
document.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'mouse') showHeader();
}, { passive: true });
document.addEventListener('pointerdown', showHeader, { passive: true });
header.addEventListener('focusin', showHeader);
header.addEventListener('focusout', showHeader);

function setMenu(open) {
  body.classList.toggle('nav-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  showHeader();
}

menuButton.addEventListener('click', () => {
  setMenu(!body.classList.contains('nav-open'));
});

navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const revealItems = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

document.getElementById('year').textContent = new Date().getFullYear();
