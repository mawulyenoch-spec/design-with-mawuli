/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — Dogbey Mawuli Enoch
   main.js
═══════════════════════════════════════════════════════════ */

/* ── 1. Mirror link text into data-text attribute
        so the CSS bold-ghost trick works correctly ──────── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.setAttribute('data-text', link.textContent.trim());
});


/* ── 2. Active nav link on scroll ───────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const observerOptions = {
  root: null,
  rootMargin: `-${getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-height')
    .trim()} 0px 0px 0px`,
  threshold: 0.45,
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(
        `.nav-link[href="#${entry.target.id}"]`
      );
      if (active) active.classList.add('active');
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));


/* ── 3. Smooth scroll for all anchor links ──────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
