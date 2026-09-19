/**
 * HARSATH ALI - DIRECTIONAL ANIMATION & SCROLL REVEAL ENGINE
 * Directional Motion + Liquid Parallax + Staggered Entrance
 * High performance, GPU-accelerated transforms, zero layout shifts
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Accessibility Check: if reduced motion is requested, reveal all content immediately
  if (prefersReducedMotion) {
    document.querySelectorAll('.slide-left, .slide-right, .slide-up, .slide-down, .fade-in, .reveal-fade-up, .reveal-on-scroll, .project-card, .skill-card, .timeline-item')
      .forEach(el => {
        el.classList.add('is-visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
      });
    return;
  }

  // 2. Section Directional Transitions: Check if incoming from another section
  const pendingTrans = sessionStorage.getItem('pending_page_trans');
  if (pendingTrans) {
    document.body.classList.add(`page-trans-enter-${pendingTrans}`);
    sessionStorage.removeItem('pending_page_trans');
    setTimeout(() => {
      document.body.classList.remove(`page-trans-enter-${pendingTrans}`);
    }, 700);
  } else {
    document.body.classList.add('page-enter');
  }

  // 3. HOME PAGE ENTRANCE COORDINATOR (Requirement 8)
  // Sequence: Heading -> LEFT, Subtitle -> RIGHT, Bio -> BOTTOM, Buttons -> TOP, Profile -> RIGHT
  function initHomeEntrance() {
    const heroTitle = document.querySelector('.hero-title');
    const heroRole = document.querySelector('.hero-role');
    const heroBio = document.querySelector('.hero-bio');
    const heroCta = document.querySelector('.hero-cta-group');
    const heroImage = document.querySelector('.hero-image-wrapper');
    const heroStatus = document.querySelector('.badge-status');

    if (!heroTitle && !heroImage) return;

    // Remove any static conflicting classes
    [heroTitle, heroRole, heroBio, heroCta, heroImage, heroStatus].forEach(el => {
      if (el) {
        el.classList.remove('anim-fade-up', 'anim-scale-in', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500');
      }
    });

    const sequence = [
      { el: heroStatus, class: 'slide-down', delay: 40 },
      { el: heroTitle, class: 'slide-left', delay: 120 },
      { el: heroRole, class: 'slide-right', delay: 240 },
      { el: heroBio, class: 'slide-up', delay: 360 },
      { el: heroCta, class: 'slide-down', delay: 480 },
      { el: heroImage, class: 'slide-right', delay: 600 }
    ];

    sequence.forEach(({ el, class: animClass, delay }) => {
      if (el) {
        el.classList.add(animClass);
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);
      }
    });
  }

  // If splash screen is present on index.html, wait for splash completion event
  const splashScreen = document.getElementById('splashScreen');
  if (splashScreen) {
    window.addEventListener('splashCompleted', () => {
      initHomeEntrance();
    });
    // Safety fallback: if splash event not fired within 4.5s
    setTimeout(() => {
      if (!splashScreen.parentNode) {
        initHomeEntrance();
      }
    }, 4500);
  } else {
    // If not on splash screen or already removed, trigger immediately
    setTimeout(initHomeEntrance, 120);
  }

  // 4. PROJECT CARDS ALTERNATING DIRECTION SYSTEM (Requirement 14)
  // Project 1 -> LEFT, Project 2 -> RIGHT, Project 3 -> LEFT, etc.
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.classList.remove('reveal-fade-up', 'anim-fade-up');
    if (index % 2 === 0) {
      card.classList.add('slide-left');
    } else {
      card.classList.add('slide-right');
    }
  });

  // 5. INTERSECTION OBSERVER SCROLL REVEAL (Requirement 10)
  // Observes elements and triggers directional reveal once when in viewport
  const revealTargets = document.querySelectorAll(`
    .slide-left:not(.hero-title),
    .slide-right:not(.hero-role):not(.hero-image-wrapper),
    .slide-up:not(.hero-bio),
    .slide-down:not(.hero-cta-group):not(.badge-status),
    .fade-in,
    .reveal-on-scroll,
    .reveal-fade-up,
    .skill-category-card,
    .cert-card-premium,
    .timeline-card,
    .preview-card,
    .channel-card,
    .activity-card
  `);

  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Support backwards-compatible reveal-fade-up active class
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => scrollObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealTargets.forEach(el => el.classList.add('is-visible', 'active'));
  }

  // 6. LIQUID SCROLL PARALLAX EFFECT (Requirement 24)
  // Background liquid blobs move slightly slower than foreground to create organic depth
  const liquidBlobs = document.querySelectorAll('.liquid-blob');
  if (liquidBlobs.length > 0) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          // Very gentle parallax translation (8-12% scroll speed)
          const parallaxOffset = scrollY * 0.08;
          liquidBlobs.forEach((blob, idx) => {
            const factor = idx % 2 === 0 ? 1 : -0.7;
            blob.style.transform = `translateY(${parallaxOffset * factor}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 7. Safety Fail-Safe: ensure all content is visible after 3.8s regardless of scroll
  setTimeout(() => {
    document.querySelectorAll('.slide-left, .slide-right, .slide-up, .slide-down, .fade-in, .reveal-on-scroll')
      .forEach(el => {
        el.classList.add('is-visible', 'active');
      });
  }, 3800);
});
