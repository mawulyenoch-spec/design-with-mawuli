/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — Dogbey Mawuli Enoch
   main.js
═══════════════════════════════════════════════════════════ */
/* <screen loader> */

// Keep track of page status and minimum time
let pageLoaded = false;
let minimumTimePassed = false;

// 1. Force the loader to stay for exactly 5 seconds (5000 milliseconds)
setTimeout(function() {
  minimumTimePassed = true;
  checkAndHideLoader();
}, 3000); 

// 2. Monitor actual page asset loading
window.addEventListener("load", function () {
  pageLoaded = true;
  checkAndHideLoader();
});

// 3. Only hide the loader when BOTH conditions are met
function checkAndHideLoader() {
  if (pageLoaded && minimumTimePassed) {
    const loader = document.getElementById("loader-wrapper");
    if (loader) {
      // Hide the loader overlay
      loader.classList.add("loader-hidden");
      
      // Add class to body to release the CSS styles and fire word animations
      document.body.classList.add("start-page-animation");
      triggerWordAnimations();
    }
  }
}

// 4. Stagger animation for words on load
function triggerWordAnimations() {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const words = heroContent.querySelectorAll('.word');
    words.forEach((word, index) => {
      word.style.animationDelay = `${index * 0.08}s`;
    });
  }
}




/* <screen loader> */

/* ── 1. Mirror link text into data-text attribute
        so the CSS bold-ghost trick works correctly ──────── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.setAttribute('data-text', link.textContent.trim());
});


/* ── 2. Active nav link on scroll ───────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if (sections.length && navLinks.length) {
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
}


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
if (heroContent) {
  const words = heroContent.querySelectorAll('.word');
  words.forEach((word, index) => {
    word.style.animationDelay = `${index * 0.08}s`;
  });
}

/* <3 video cards> */

/* <3 video cards> */
const track = document.getElementById('track');
const dotsEl = document.getElementById('dots');

if (track && dotsEl) {
  const cards = Array.from(track.querySelectorAll('.card'));
  let current = 0;

  function isMobile() {
    return track.parentElement.offsetWidth <= 480;
  }

  function getVisible() {
    // only used above 480px now — mobile has its own path below
    const w = track.parentElement.offsetWidth;
    if (w <= 700) return 1.2;
    return 3;
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    const total = isMobile()
      ? cards.length
      : Math.max(1, cards.length - Math.round(getVisible()) + 1);

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
    const gap = getGap();

function getGap() {
  return parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;

}
    if (isMobile()) {
      // one dot = one card, measured directly from the real DOM width
      current = Math.max(0, Math.min(idx, cards.length - 1));
      const cardW = cards[0].getBoundingClientRect().width;
      const viewportW = track.parentElement.offsetWidth;
      const maxTranslate = Math.max(0, track.scrollWidth - viewportW);
      let translate = current * (cardW + gap);
      translate = Math.min(translate, maxTranslate); // never scroll past the last real card
      track.style.transform = `translateX(-${translate}px)`;
    } else {
      // original sliding-window logic, unchanged, for tablet/desktop
      const vis = Math.round(getVisible());
      const max = Math.max(0, cards.length - vis);
      current = Math.max(0, Math.min(idx, max));
      const cardW = track.parentElement.offsetWidth;
      const singleW = (cardW - gap * (vis - 1)) / vis;
      track.style.transform = `translateX(-${current * (singleW + gap)}px)`;
    }

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

  window.addEventListener('resize', () => {
    current = 0; // reset — dot count differs between mobile/desktop modes, so an old index could point at nothing
    buildDots();
    goTo(0);
  });
}

/* <new code for the 3 video cards — modal> */
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalVideoSource = document.getElementById('modalVideoSource');
const videoModalBackdrop = document.getElementById('videoModalBackdrop');
const videoModalClose = document.getElementById('videoModalClose');

if (videoModal && modalVideo && modalVideoSource && videoModalBackdrop && videoModalClose) {
  function openVideoModal(src) {
    modalVideoSource.src = src;
    modalVideo.load();      // forces the new source to load
    videoModal.classList.add('open');
    modalVideo.play();
  }

  function closeVideoModal() {
    videoModal.classList.remove('open');
    modalVideo.pause();
    modalVideoSource.src = '';
    modalVideo.load();      // clears the buffered video so it doesn't keep playing in background
  }

  document.querySelectorAll('.card').forEach(card => {
    const videoSourceEl = card.querySelector('video source');
    if (!videoSourceEl) return;
    const cardVideoSrc = videoSourceEl.getAttribute('src');

    const playBtn = card.querySelector('.play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', e => {
        e.stopPropagation();
        openVideoModal(cardVideoSrc);
      });
    }

    const arrowBtn = card.querySelector('.arrow-btn');
    if (arrowBtn) {
      arrowBtn.addEventListener('click', e => {
        e.stopPropagation();
        openVideoModal(cardVideoSrc);
      });
    }
  });

  videoModalBackdrop.addEventListener('click', closeVideoModal);
  videoModalClose.addEventListener('click', closeVideoModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && videoModal.classList.contains('open')) {
      closeVideoModal();
    }
  });
}


/* <estate video> */
const wrap = document.getElementById('videoWrap');
const video = document.getElementById('mwVideo');

if (wrap && video) {
  function playInline() {
    video.style.display = 'block';
    const thumb = document.getElementById('videoThumb');
    if (thumb) thumb.style.display = 'none';
    const playIcon = document.querySelector('.mw-play');
    if (playIcon) playIcon.style.display = 'none';
    video.play();
  }

  function toggleFullscreen() {
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

    if (isFullscreen) {
      // exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      return;
    }

    // make sure it's playing inline first (in case fullscreen is clicked before play)
    playInline();

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen(); // iOS Safari
    }
  }

  // keyboard accessibility – Enter / Space triggers play
  wrap.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      wrap.click();
    }
  });

  wrap.addEventListener('click', function (e) {
    if (e.target.closest('.mw-corner-btn')) return;
    playInline(); // just plays in the card now
  });

  const cornerBtn = document.querySelector('.mw-corner-btn');
  if (cornerBtn) {
    cornerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleFullscreen(); // toggles fullscreen on/off
    });
  }
}


/* <logo section reveal> */
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


/* ── reveal animation for all text ───────────────────────── */
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

(function () {
  const cards = document.querySelectorAll('.reveal-card');
  if (!cards.length) return;

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.10}s`;
  });

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          cardObserver.unobserve(entry.target);

          entry.target.addEventListener('transitionend', () => {
          entry.target.style.transitionDelay = '0s';
        }, { once: true });
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.1,
    }
  );

  cards.forEach((card) => cardObserver.observe(card));
})();


/* ── testimonials ─────────────────────────────────────────── */
(function () {
  const testimonials = [
    { initial: "B", name: "Brian Hardy", review: "Communication was a massive strong point. He explained his creative process clearly and made me feel so comfortable along the way." },
    { initial: "S", name: "Sarah Lewis", review: "Delivered exactly what we needed, he also involves you in the design process" },
    { initial: "M", name: "Marcus Chen", review: "Working together felt effortless from start to finish." }
  ];
  let current = 0;

  const avatarEl = document.getElementById('testimonial-avatar');
  const nameEl = document.getElementById('testimonial-name');
  const reviewEl = document.getElementById('testimonial-review');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!nameEl || !avatarEl || !reviewEl || !prevBtn || !nextBtn) return;

  function show(index) {
    current = (index + testimonials.length) % testimonials.length;
    avatarEl.textContent = testimonials[current].initial;
    nameEl.textContent = testimonials[current].name;
    reviewEl.textContent = testimonials[current].review;
  }

  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
})();


/* <burger menu on small screen> */
document.addEventListener('DOMContentLoaded', () => {

  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!burgerBtn || !mobileMenu) return;

  const burgerLines = burgerBtn.querySelectorAll('.burger-line');
  const menuLinks = mobileMenu.querySelectorAll('.mobile-link');
  const menuItems = mobileMenu.querySelectorAll('.mobile-menu-links li');

  let isOpen = false;
  let isAnimating = false;

  const CIRCLE_DURATION = 300;
  const LINE_DURATION = 280;
  const OVERLAY_DURATION = 350;
  const STAGGER_STEP = 70;

  function animateBurgerToX() {
    burgerLines[0].style.transition = `top ${LINE_DURATION}ms cubic-bezier(.65,0,.35,1), transform ${LINE_DURATION}ms cubic-bezier(.65,0,.35,1), background-color 250ms ease`;
    burgerLines[1].style.transition = `top ${LINE_DURATION}ms cubic-bezier(.65,0,.35,1), transform ${LINE_DURATION}ms cubic-bezier(.65,0,.35,1), background-color 250ms ease`;

    burgerLines[0].style.top = '6px';
    burgerLines[1].style.top = '6px';

    requestAnimationFrame(() => {
      burgerLines[0].style.transform = 'rotate(45deg)';
      burgerLines[1].style.transform = 'rotate(-45deg)';
      burgerLines[0].style.backgroundColor = '#';
      burgerLines[1].style.backgroundColor = '#';
    });
  }

  function animateXToBurger() {
    burgerLines[0].style.transition = `top ${LINE_DURATION}ms cubic-bezier(.65,0,.35,1), transform ${LINE_DURATION}ms cubic-bezier(.65,0,.35,1), background-color 250ms ease`;
    burgerLines[1].style.transition = `top ${LINE_DURATION}ms cubic-bezier(.65,0,.35,1), transform ${LINE_DURATION}ms cubic-bezier(.65,0,.35,1), background-color 250ms ease`;

    burgerLines[0].style.transform = 'rotate(0deg)';
    burgerLines[1].style.transform = 'rotate(0deg)';

    requestAnimationFrame(() => {
      burgerLines[0].style.top = '0px';
      burgerLines[1].style.top = '12px';
      burgerLines[0].style.backgroundColor = '#';
      burgerLines[1].style.backgroundColor = '#';
    });
  }

  function animateCircleIn() {
    burgerBtn.style.transition = `background-color ${CIRCLE_DURATION}ms ease, transform ${CIRCLE_DURATION}ms ease`;
    burgerBtn.style.transform = 'scale(1.08)';
    burgerBtn.style.backgroundColor = '#';

    setTimeout(() => {
      burgerBtn.style.transform = 'scale(1)';
    }, CIRCLE_DURATION);
  }

  function animateCircleOut() {
    burgerBtn.style.transition = `background-color ${CIRCLE_DURATION}ms ease, transform ${CIRCLE_DURATION}ms ease`;
    burgerBtn.style.backgroundColor = '#';
  }

  function animateOverlayIn() {
    mobileMenu.style.visibility = 'visible';
    mobileMenu.style.transition = `opacity ${OVERLAY_DURATION}ms ease, transform ${OVERLAY_DURATION}ms ease`;

    requestAnimationFrame(() => {
      mobileMenu.style.opacity = '1';
      mobileMenu.style.transform = 'translateY(0)';
    });

    menuItems.forEach((item, i) => {
      item.style.transition = `opacity 400ms ease, transform 400ms ease`;
      item.style.transitionDelay = `${i * STAGGER_STEP}ms`;
      requestAnimationFrame(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    });
  }

  function animateOverlayOut() {
    mobileMenu.style.transition = `opacity ${OVERLAY_DURATION}ms ease, transform ${OVERLAY_DURATION}ms ease`;
    mobileMenu.style.opacity = '0';
    mobileMenu.style.transform = 'translateY(-12px)';

    menuItems.forEach((item) => {
      item.style.transitionDelay = '0ms';
      item.style.opacity = '0';
      item.style.transform = 'translateY(16px)';
    });

    setTimeout(() => {
      mobileMenu.style.visibility = 'hidden';
    }, OVERLAY_DURATION);
  }

  function openMenu() {
    if (isAnimating || isOpen) return;
    isAnimating = true;
    isOpen = true;

    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');

    animateCircleIn();
    animateBurgerToX();
    animateOverlayIn();

    setTimeout(() => { isAnimating = false; }, Math.max(CIRCLE_DURATION, LINE_DURATION, OVERLAY_DURATION));
  }

  function closeMenu() {
    if (isAnimating || !isOpen) return;
    isAnimating = true;
    isOpen = false;

    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');

    animateCircleOut();
    animateXToBurger();
    animateOverlayOut();

    setTimeout(() => { isAnimating = false; }, Math.max(CIRCLE_DURATION, LINE_DURATION, OVERLAY_DURATION));
  }

  function toggleMenu() {
    isOpen ? closeMenu() : openMenu();
  }

  burgerBtn.addEventListener('click', toggleMenu);

  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

});
/* <burger menu closes> */


/* <navbar animation> */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const SCROLL_THRESHOLD = 60;
  const HIDE_THRESHOLD = 10;

  function updateNavbar() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    if (currentScrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (currentScrollY <= SCROLL_THRESHOLD) {
      navbar.classList.remove('nav-hidden');
    } else if (Math.abs(scrollDelta) > HIDE_THRESHOLD) {
      if (scrollDelta > 0) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });
})();
/* <navbar animation> */

// Basic active-state toggle so you can click through the pills while reviewing.
    // Filtering logic itself comes later once the project grid exists.
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      });
    });


    // <from the work section>

    // ═══════════════════════════════════════
// WORKS PAGE — null-guarded like your other
// page-specific blocks in main.js. Safe to append
// directly to main.js, or keep as its own works.js
// and include with <script src="./works.js"></script>
// right before your closing </body> tag.
// ═══════════════════════════════════════
const worksGrid = document.querySelector('.works-grid');
 
if (worksGrid) {
 
  const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%23d9d9d9'/%3E%3C/svg%3E";
 
  // Shared by both modal systems below, to skip the slide/fade transition for users who prefer reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  // ─────────────────────────────────────
  // PROJECT DATA — case-study modal (video projects for now)
  // `media` is an ordered array rendered top-to-bottom in the modal.
  // Swap placeholder srcs for real assets (1920x1080 recommended
  // for the Images, per your spec). `deepLink: true` makes a
  // project shareable via ?project=<id> in the URL.
  // ─────────────────────────────────────
  const PROJECTS = {
    'proj-03': {
      title: 'FC26  CUSTOM PLAYER MODEL',
      tag: 'JABEY',
      deepLink: true,
      media: [
        { type: 'image', src: './Images/jb2.png', alt: 'Process image 1 ' },
        { type: 'image', src: './Images/jbb.png', alt: 'Process image 2 ' },
        { type: 'image', src: './Images/jb4.jpg', alt: 'Process image 3 ' },
        { type: 'image', src: './Images/jb3.png', alt: 'Process image 4' },
        { type: 'video', src: './videos/jabey1.mp4', poster: './Images/fc26.jpg' }
        
      ]
    },
    'proj-06': {
      title: 'VIDEOMEMTUM',
      tag: 'Motion Graphics',
      deepLink: false,
      media: [
        // { type: 'image', src: PLACEHOLDER_IMG, alt: 'Process image 1 — TODO: describe' },
        // { type: 'image', src: PLACEHOLDER_IMG, alt: 'Process image 2 — TODO: describe' },
        { type: 'video', src: './videos/investors.mp4', poster: './Images/vmemtum.png'}
      ]
    },
    'proj-08': {
        title: 'Nhyira City Estate',
        tag: 'Architectural Visualisation',
        deepLink: false,
        media: [
          { type: 'image', src: './Images/estate04.jpg', alt: 'Process image 1  ' },
          { type: 'image', src: './Images/estate05.jpg', alt: 'Process image 2 ' },
          { type: 'image', src: './Images/estate1.png', alt: 'Process image 3 ' },
          { type: 'image', src: './Images/estate03.jpg', alt: 'Process image 4 ' },
          { type: 'image', src: './Images/estate02.jpg', alt: 'Process image 5 ' },
          { type: 'image', src: './Images/night2.png', alt: 'Process image 6 ' },
          { type: 'image', src: './Images/night.png', alt: 'Process image 7 ' },
          { type: 'image', src: './Images/night3.png', alt: 'Process image 8 ' },
          { type: 'image', src: './Images/night1.png', alt: 'Process image 9 ' },
          { type: 'video', src: './videos/nhyira-city-estate1.mp4', poster: './Images/066.png' }
        ]
      },
      'proj-10': {
        title: 'Architectural Visualisation',
        tag: 'THE EYE OF KNUST',
        deepLink: false,
        media: [
          { type: 'image', src: './Images/DJI02.jpg', alt: 'Process image 1 — TODO: describe' },
          { type: 'image', src: './Images/dji04.png', alt: 'Process image 2 — TODO: describe' },
          { type: 'image', src: './Images/dji05.png', alt: 'Process image 3 — TODO: describe' },
           { type: 'image', src: './Images/dji09.png', alt: 'Process image 4 — TODO: describe' },
            { type: 'image', src: './Images/dji08.png', alt: 'Process image 5 — TODO: describe' },
            { type: 'image', src: './Images/cabe.png', alt: 'Process image 6 — TODO: describe' },
          { type: 'video', src: './videos/LEVERAGING_VISUAL_STORYTELLING_TECHNIQUES_FOR_ARCHITECTURAL_VISU.mp4', poster: './Images/cabe 02.png' }
        ]
      },
      'proj-14': {
        title: 'AGENLY',
        tag: 'Motion Graphics',
        deepLink: false,
        media: [
          // { type: 'image', src: PLACEHOLDER_IMG, alt: 'Process image 1 — TODO: describe' },
          // { type: 'image', src: PLACEHOLDER_IMG, alt: 'Process image 2 — TODO: describe' },
          { type: 'video', src: './videos/video3.mp4', poster: './Images/shot-2.png' }
        ]
      },
      'proj-16': {
        title: 'AGENLY',
        tag: 'Motion Graphics',
        deepLink: false,
        media: [
          // { type: 'image', src: PLACEHOLDER_IMG, alt: 'Process image 1 — TODO: describe' },
          // { type: 'image', src: PLACEHOLDER_IMG, alt: 'Process image 2 — TODO: describe' },
          { type: 'video', src: './videos/video1.mp4', poster: './Images/shot-1.png'}
        ]
      },
       'proj-18': {
        title: 'FC26  CUSTOM PLAYER MODEL',
        tag: 'NATHANIEL',
        deepLink: false,
        media: [
          { type: 'image', src: './Images/102.png',  },
          { type: 'image', src: './Images/104.png',  },
          { type: 'image', src: './Images/099.png',  },
          { type: 'image', src: './Images/100.png',  },
           { type: 'image', src: './Images/103.png', },
          { type: 'video', src: './videos/Download(2).mp4', poster: './Images/fc26.jpg' },
           { type: 'video', src: './videos/Download(11).mp4', poster:  './Images/fc26.jpg' ,}
        ]
      },
       'proj-19': {
        title: 'PERSONAL PROJECT',
        tag: 'Architectural Visualisation ',
        deepLink: false,
        media: [
          // { type: 'image', src: PLACEHOLDER_IMG, alt: 'Process image 1 — TODO: describe' },
          // { type: 'image', src: PLACEHOLDER_IMG, alt: 'Process image 2 — TODO: describe' },
          { type: 'video', src: './videos/building03.mp4', poster: './Images/building03.png' }
        ]
      },
      'proj-17': {
        title: 'Motion Reel ',
        tag: 'Motion Reel',
        deepLink: false,
        media: [
          { type: 'video', src: './videos/myReel.mp4', poster: './Images/rellpaper.jpg'}
        ]
      }
  };



 
  // ─────────────────────────────────────
  // CASE-STUDY MODAL LOGIC
  // ─────────────────────────────────────
  const caseModal = document.getElementById('caseModal');
  const caseModalSheet = caseModal.querySelector('.case-modal-sheet');
  const caseModalTitle = document.getElementById('caseModalTitle');
  const caseModalTag = document.getElementById('caseModalTag');
  const caseModalMediaStack = document.getElementById('caseModalMediaStack');
 
  let lastFocusedEl = null;
 
  function pauseAllModalVideos() {
  const videos = caseModalMediaStack.querySelectorAll('video');
  videos.forEach(video => {
    video.pause();
    video.currentTime = 0;
  });
}

  function openCaseModal(projectId, triggerEl) {
    const data = PROJECTS[projectId];
    if (!caseModal || !data) return;
 
    lastFocusedEl = triggerEl || document.activeElement;
 
    caseModalTitle.textContent = data.title;
    caseModalTag.textContent = data.tag;
 
    pauseAllModalVideos();
    caseModalMediaStack.innerHTML = '';
    data.media.forEach(item => {
      const block = document.createElement('div');
      block.className = 'case-modal-media-item';
 
      if (item.type === 'video') {
        const video = document.createElement('video');
        video.poster = item.poster || '';
        video.controls = true;
        video.playsInline = true;
        if (item.src) {
          const source = document.createElement('source');
          source.src = item.src;
          source.type = 'video/mp4';
          video.appendChild(source);
        }
        block.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || '';
        block.appendChild(img);
      }
 
      caseModalMediaStack.appendChild(block);
    });
 
    if (data.deepLink) {
      history.replaceState(null, '', `?project=${projectId}`);
    } else if (window.location.search.includes('project=')) {
      history.replaceState(null, '', window.location.pathname);
    }
 
    // Set display first, then add .is-open on the next frame so the
    // slide + fade transition has a "closed" state to animate from.
    caseModal.style.display = 'block';
    void caseModal.offsetHeight; // force reflow
    requestAnimationFrame(() => {
      caseModal.classList.add('is-open');
    });
 
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleCaseModalKeydown);
 
    const closeBtn = caseModal.querySelector('.case-modal-close');
    if (closeBtn) closeBtn.focus();
  }
 
  function closeCaseModal() {
    if (!caseModal || !caseModal.classList.contains('is-open')) return;
 
      pauseAllModalVideos();

    caseModal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleCaseModalKeydown);
 
    if (window.location.search.includes('project=')) {
      history.replaceState(null, '', window.location.pathname);
    }
 
    if (prefersReducedMotion) {
      caseModal.style.display = 'none';
    } else {
      const onTransitionEnd = (e) => {
        if (e.target !== caseModalSheet) return;
        caseModal.style.display = 'none';
        caseModalSheet.removeEventListener('transitionend', onTransitionEnd);
      };
      caseModalSheet.addEventListener('transitionend', onTransitionEnd);
    }
 
    if (lastFocusedEl) lastFocusedEl.focus();
  }
 
  function handleCaseModalKeydown(e) {
    if (e.key === 'Escape') {
      closeCaseModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = caseModal.querySelectorAll(
        'button, [href], video[controls], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
 
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
 
  caseModal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeCaseModal);
  });
 
  // Click the small visible gap above the sheet (not the sheet itself) to close
  caseModal.addEventListener('click', (e) => {
    if (e.target === caseModal) closeCaseModal();
  });
 
  document.querySelectorAll('.project-card[data-project-id]').forEach(card => {
    const projectId = card.dataset.projectId;
    const data = PROJECTS[projectId];
    if (data) card.setAttribute('aria-label', `View project: ${data.title}`);
 
    card.addEventListener('click', () => openCaseModal(projectId, card));
  });
 
  // Auto-open on load if the URL already has ?project=<deepLink-enabled id>
  const urlParams = new URLSearchParams(window.location.search);
  const deepLinkId = urlParams.get('project');
  if (deepLinkId && PROJECTS[deepLinkId] && PROJECTS[deepLinkId].deepLink) {
    openCaseModal(deepLinkId, null);
  }
 
  // ─────────────────────────────────────
  // IMAGE PROJECT DATA — slide-up panel (image-only projects)
  // Swap placeholder src/caption for the real thing per project.
  // ─────────────────────────────────────
  const IMAGE_PROJECTS = {
    'proj-01': { image: './Images/011.png', caption: 'The flyer emphasizes the value of customer experience, showing that 61% of customers are willing to pay at least 5% more when assured of outstanding service.' },
    'proj-02': { image: './Images/044.png', caption: 'This campaign uplifts young girls by ensuring access to essential hygiene, fostering dignity and confidence." \n "Every donation brings hope and empowers the girl child to thrive without barriers.' },
    'proj-04': { image: './Images/033.png', caption: '' },
    'proj-05': { image: './Images/022.png', caption: '' },
    'proj-07': { image: './Images/055.jpg', caption: '' },
    'proj-09': { image: './Images/Desktop13.png', caption: '© Code by Dogbey Mawuli Enoch' },
    'proj-12': { image: PLACEHOLDER_IMG, caption: 'TODO: add a short caption for this project' },
    'proj-15': { image: PLACEHOLDER_IMG, caption: 'TODO: add a short caption for this project' }
  };
 
  // ─────────────────────────────────────
  // IMAGE PANEL LOGIC
  // ─────────────────────────────────────
  const imagePanel = document.getElementById('imagePanel');
  const imagePanelSheet = imagePanel.querySelector('.image-panel-sheet');
  const imagePanelImg = document.getElementById('imagePanelImg');
  const imagePanelCaption = document.getElementById('imagePanelCaption');
 
  let lastFocusedImageEl = null;
 
  function openImagePanel(projectId, triggerEl) {
    const data = IMAGE_PROJECTS[projectId];
    if (!imagePanel || !data) return;
 
    lastFocusedImageEl = triggerEl || document.activeElement;
 
    imagePanelImg.src = data.image;
    imagePanelImg.alt = data.caption || '';
    imagePanelCaption.textContent = data.caption;
 
    // Set display first, then add .is-open on the next frame so the
    // slide-up + fade-in transition actually has a "closed" state to animate from.
    imagePanel.style.display = 'block';
    void imagePanel.offsetHeight; // force reflow
    requestAnimationFrame(() => {
      imagePanel.classList.add('is-open');
    });
 
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleImagePanelKeydown);
 
    const closeBtn = imagePanel.querySelector('.image-panel-close');
    if (closeBtn) closeBtn.focus();
  }
 
  function closeImagePanel() {
    if (!imagePanel || !imagePanel.classList.contains('is-open')) return;
 
    imagePanel.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleImagePanelKeydown);
 
    if (prefersReducedMotion) {
      imagePanel.style.display = 'none';
    } else {
      const onTransitionEnd = (e) => {
        if (e.target !== imagePanelSheet) return;
        imagePanel.style.display = 'none';
        imagePanelSheet.removeEventListener('transitionend', onTransitionEnd);
      };
      imagePanelSheet.addEventListener('transitionend', onTransitionEnd);
    }
 
    if (lastFocusedImageEl) lastFocusedImageEl.focus();
  }
 
  function handleImagePanelKeydown(e) {
    if (e.key === 'Escape') {
      closeImagePanel();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = imagePanel.querySelectorAll(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
 
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
 
  imagePanel.querySelectorAll('[data-image-panel-close]').forEach(el => {
    el.addEventListener('click', closeImagePanel);
  });
 
  // Click the small visible gap above the sheet (not the sheet itself) to close
  imagePanel.addEventListener('click', (e) => {
    if (e.target === imagePanel) closeImagePanel();
  });
 
  document.querySelectorAll('.project-card[data-project-id]').forEach(card => {
    const projectId = card.dataset.projectId;
    const imgData = IMAGE_PROJECTS[projectId];
    if (imgData) {
      card.setAttribute('aria-label', 'View project image');
      card.addEventListener('click', () => openImagePanel(projectId, card));
    }
  });
//  < new added code>

// ─────────────────────────────────────
    // PDF PROJECT DATA — used by the wide PDF card.
    // Set `pdfSrc` to a real relative path (e.g. './Documents/works/project-name.pdf')
    // when the file's ready. Leave it '' to show the placeholder message.
    // ─────────────────────────────────────
    const PDF_PROJECTS = {
      'proj-11': { pdfSrc: './brand-deck.pdf' },
      'proj-13': { pdfSrc: './hair-brand.pdf' }
    };
 
    // ─────────────────────────────────────
    // PDF PANEL LOGIC
    // ─────────────────────────────────────
    const pdfPanel = document.getElementById('pdfPanel');
    const pdfPanelSheet = pdfPanel.querySelector('.pdf-panel-sheet');
    const pdfPanelFrame = document.getElementById('pdfPanelFrame');
    const pdfPanelEmpty = document.getElementById('pdfPanelEmpty');
 
    let lastFocusedPdfEl = null;
 
    function openPdfPanel(projectId, triggerEl) {
      const data = PDF_PROJECTS[projectId];
      if (!pdfPanel || !data) return;
 
      lastFocusedPdfEl = triggerEl || document.activeElement;
 
      if (data.pdfSrc) {
        pdfPanelFrame.src = data.pdfSrc;
        pdfPanelFrame.hidden = false;
        pdfPanelEmpty.hidden = true;
      } else {
        pdfPanelFrame.hidden = true;
        pdfPanelEmpty.hidden = false;
      }
 
      pdfPanel.style.display = 'block';
      void pdfPanel.offsetHeight; // force reflow
      requestAnimationFrame(() => {
        pdfPanel.classList.add('is-open');
      });
 
      document.body.classList.add('modal-open');
      document.addEventListener('keydown', handlePdfPanelKeydown);
 
      const closeBtn = pdfPanel.querySelector('.pdf-panel-close');
      if (closeBtn) closeBtn.focus();
    }
 
    function closePdfPanel() {
      if (!pdfPanel || !pdfPanel.classList.contains('is-open')) return;
 
      pdfPanel.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handlePdfPanelKeydown);
 
      if (prefersReducedMotion) {
        pdfPanel.style.display = 'none';
        pdfPanelFrame.src = ''; // stop the PDF loading/rendering once hidden
      } else {
        const onTransitionEnd = (e) => {
          if (e.target !== pdfPanelSheet) return;
          pdfPanel.style.display = 'none';
          pdfPanelFrame.src = '';
          pdfPanelSheet.removeEventListener('transitionend', onTransitionEnd);
        };
        pdfPanelSheet.addEventListener('transitionend', onTransitionEnd);
      }
 
      if (lastFocusedPdfEl) lastFocusedPdfEl.focus();
    }
 
    function handlePdfPanelKeydown(e) {
      if (e.key === 'Escape') {
        closePdfPanel();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = pdfPanel.querySelectorAll(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
 
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
 
    pdfPanel.querySelectorAll('[data-pdf-panel-close]').forEach(el => {
      el.addEventListener('click', closePdfPanel);
    });
 
    // Click the small visible gap above the sheet (not the sheet itself) to close
    pdfPanel.addEventListener('click', (e) => {
      if (e.target === pdfPanel) closePdfPanel();
    });
 
    document.querySelectorAll('.project-card[data-project-id]').forEach(card => {
      const projectId = card.dataset.projectId;
      const pdfData = PDF_PROJECTS[projectId];
      if (pdfData) {
        card.setAttribute('aria-label', 'View project document');
        card.addEventListener('click', () => openPdfPanel(projectId, card));
      }
    });
 
/* <new code added> */

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // update active pill state
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      // filter the project cards
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        const show = filter === 'all' || categories.includes(filter);
        card.style.display = show ? '' : 'none';
      });
    });
  });
});

} // end .works-grid null-guard
   