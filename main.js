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

/* ── Stagger animation for words on load ───────────────────── */
const heroContent = document.querySelector('.hero-content');
const words = heroContent.querySelectorAll('.word');

words.forEach((word, index) => {
  word.style.animationDelay = `${index * 0.08}s`;
});
const track = document.getElementById('track');
  const dotsEl = document.getElementById('dots');
  const cards = Array.from(track.querySelectorAll('.card'));
  let current = 0;

  function getVisible() {
    const w = track.parentElement.offsetWidth;
    if (w <= 440) return 1;
    if (w <= 700) return 1.2;
    return 3;
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    const vis = Math.round(getVisible());
    const total = Math.max(1, cards.length - vis + 1);
    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      b.className = 'dot' + (i === current ? ' active' : '');
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.setAttribute('role', 'tab');
      b.onclick = () => goTo(i);
      dotsEl.appendChild(b);
    }
  }

  function goTo(idx) {
    const vis = Math.round(getVisible());
    const max = Math.max(0, cards.length - vis);
    current = Math.max(0, Math.min(idx, max));
    const gap = 16;
    const cardW = track.parentElement.offsetWidth;
    const singleW = (cardW - gap * (Math.round(getVisible()) - 1)) / Math.round(getVisible());
    track.style.transform = `translateX(-${current * (singleW + gap)}px)`;
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  buildDots();
  goTo(0);

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? goTo(current + 1) : goTo(current - 1); }
  });

  window.addEventListener('resize', () => { buildDots(); goTo(current); });
const wrap = document.getElementById('videoWrap');

    // keyboard accessibility – Enter / Space triggers play
    wrap.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        wrap.click();
      }
    });

    wrap.addEventListener('click', function(e) {
      // ignore clicks on the corner button
      if (e.target.closest('.mw-corner-btn')) return;
      // TODO: swap in your video URL here
      console.log('Play video');
    });

    document.querySelector('.mw-corner-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      // TODO: open fullscreen / modal
      console.log('Open fullscreen');
    });
  (function () {
      // IntersectionObserver — triggers bottom-to-top reveal on scroll
      const cards = document.querySelectorAll(".logo-section .cardL");

      if (!cards.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              // Once revealed, stop watching (one-shot animation)
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,          // viewport
          rootMargin: '0px 0px -60px 0px', // trigger slightly before fully in view
          threshold: 0.12,     // 12 % of the card must be visible
        }
      );

      cards.forEach((card) => observer.observe(card));
    })();

    /* ── Home pictures: 3D perspective hover effect ───────────── */
// const hoverCards = document.querySelectorAll('.hover-3d');

// hoverCards.forEach((el) => {
//   el.addEventListener('mousemove', (e) => {
//     const rect = el.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width  - 0.5;
//     const y = (e.clientY - rect.top)  / rect.height - 0.5;
//     const tiltX = -(y * 20).toFixed(1);
//     const tiltY =  (x * 20).toFixed(1);
//     el.style.transform =
//       `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.07)`;
//   });

//   el.addEventListener('mouseleave', () => {
//     el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
//   });
// });

(function () {
  const lines = document.querySelectorAll(".reveal-line");

  if (!lines.length) return;

  // stagger: each line waits a bit longer than the one before it
  lines.forEach((line, index) => {
    line.style.transitionDelay = `${index * 0.15}s`;
  });

  const lineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          lineObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12,
    }
  );

  lines.forEach((line) => lineObserver.observe(line));
})();