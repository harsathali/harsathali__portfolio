/**
 * HARSATH ALI - ANIMATIONS & PROGRESSIVE ENHANCEMENT ENGINE
 * Safe, performance-optimized animations where all content remains 100% visible by default.
 * Respects prefers-reduced-motion. Never permanently hides content.
 * Premium, slow, cinematic easing: cubic-bezier(0.22, 1, 0.36, 1)
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Ensure all content elements are active and visible immediately (JavaScript failure safety)
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-scale, .reveal-slide-left, .timeline-item, .skill-card, .project-card, .contact-form-wrapper');
  revealElements.forEach(el => {
    el.classList.add('active');
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.visibility = 'visible';
  });

  if (prefersReducedMotion) return;

  // 2. Smooth page entry animation (850ms calm transition)
  document.body.classList.add('page-enter');

  // 3. Progressive enhancement via GSAP only if available and non-blocking
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      try {
        gsap.registerPlugin(ScrollTrigger);
      } catch (e) {
        // Fallback gracefully
      }
    }

    try {
      // Subtle enhancement on section headings & banners: 950ms, 25px translation, 120ms stagger
      gsap.utils.toArray('.section-header, .page-banner').forEach(header => {
        const targets = header.querySelectorAll('.section-tag, .page-header-title, .section-title, .section-subtitle, .page-header-subtitle');
        if (targets.length > 0) {
          gsap.fromTo(targets, 
            { y: 25, opacity: 0.85 },
            {
              y: 0,
              opacity: 1,
              duration: 0.95,
              stagger: 0.14,
              ease: 'power2.out',
              scrollTrigger: typeof ScrollTrigger !== 'undefined' ? {
                trigger: header,
                start: 'top 90%',
                toggleActions: 'play none none none'
              } : undefined
            }
          );
        }
      });

      // Categorized Skills Section Sequence:
      // Category heading appears (850ms), followed by 100-150ms stagger to skill cards (950ms, 30px translation)
      gsap.utils.toArray('.skill-category-group').forEach(group => {
        const header = group.querySelector('.category-header');
        const cards = group.querySelectorAll('.skill-card');

        if (header) {
          gsap.fromTo(header,
            { y: 25, opacity: 0.85 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'power2.out',
              scrollTrigger: typeof ScrollTrigger !== 'undefined' ? {
                trigger: group,
                start: 'top 85%',
                toggleActions: 'play none none none'
              } : undefined
            }
          );
        }

        if (cards.length > 0) {
          gsap.fromTo(cards,
            { y: 30, opacity: 0.85 },
            {
              y: 0,
              opacity: 1,
              duration: 0.95,
              stagger: 0.12, // 120ms natural stagger
              ease: 'power2.out',
              delay: 0.12,
              scrollTrigger: typeof ScrollTrigger !== 'undefined' ? {
                trigger: group,
                start: 'top 85%',
                toggleActions: 'play none none none'
              } : undefined
            }
          );
        }
      });

      // Project Cards Entrance: 1000ms, subtle 25px translation, 140ms stagger
      const projectCards = document.querySelectorAll('.project-card, .project-preview-card');
      if (projectCards.length > 0) {
        gsap.fromTo(projectCards,
          { y: 25, opacity: 0.85 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.14,
            ease: 'power2.out',
            scrollTrigger: typeof ScrollTrigger !== 'undefined' ? {
              trigger: projectCards[0].parentElement,
              start: 'top 85%',
              toggleActions: 'play none none none'
            } : undefined
          }
        );
      }

      // Contact Form Smooth Entrance: 950ms
      const contactSection = document.querySelector('.contact-form-wrapper');
      if (contactSection) {
        gsap.fromTo(contactSection,
          { y: 25, opacity: 0.85 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power2.out',
            scrollTrigger: typeof ScrollTrigger !== 'undefined' ? {
              trigger: contactSection,
              start: 'top 88%',
              toggleActions: 'play none none none'
            } : undefined
          }
        );
      }

      // Profile frame subtle entrance
      const profileFrame = document.querySelector('.about-profile-frame, .hero-image-wrapper');
      if (profileFrame) {
        gsap.fromTo(profileFrame, { scale: 0.96 }, { scale: 1, duration: 0.95, ease: 'power2.out' });
      }
    } catch (err) {
      console.warn('GSAP enhancement skipped:', err);
    }
  }
});
