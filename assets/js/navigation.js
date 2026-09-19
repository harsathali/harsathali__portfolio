/**
 * HARSATH ALI - SHARED NAVIGATION SCRIPT
 * Handles active page state, animated darker hamburger drawer,
 * directional section transitions with liquid glow, scroll progress & back-to-top
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. ACTIVE NAVIGATION DETECTION =================
  const currentPath = window.location.pathname;
  let pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1).toLowerCase();
  
  // Default to index.html if root or empty
  if (!pageName || pageName === '' || pageName === '/') {
    pageName = 'index.html';
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function markActiveLink(link) {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const targetFile = href.split('#')[0].split('?')[0].toLowerCase();
    
    if (targetFile === pageName) {
      link.classList.add('active');
    } else if ((pageName === 'certificates.html' || pageName === 'certification.html') && (targetFile === 'certificates.html' || targetFile === 'certification.html')) {
      link.classList.add('active');
    } else if ((pageName === 'index.html' || pageName === '') && (targetFile === 'index.html' || targetFile === './' || targetFile === '')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  }

  navLinks.forEach(markActiveLink);
  drawerLinks.forEach(markActiveLink);

  // ================= 2. DIRECTIONAL SECTION TRANSITIONS (Requirement 9 & 25) =================
  // Transitions Roadmap:
  // Home → About = RIGHT
  // About → Skills = BOTTOM
  // Skills → Experience = LEFT
  // Experience → Projects = RIGHT
  // Projects → Certificates = TOP
  // Certificates → Education = BOTTOM
  // Education → Contact = LEFT
  const TRANSITION_MAP = {
    'index.html->about.html': 'right',
    'about.html->skills.html': 'bottom',
    'skills.html->experience.html': 'left',
    'experience.html->projects.html': 'right',
    'projects.html->certificates.html': 'top',
    'certificates.html->education.html': 'bottom',
    'education.html->contact.html': 'left',

    // Natural Reverse Navigation:
    'about.html->index.html': 'left',
    'skills.html->about.html': 'top',
    'experience.html->skills.html': 'right',
    'projects.html->experience.html': 'left',
    'certificates.html->projects.html': 'bottom',
    'education.html->certificates.html': 'top',
    'contact.html->education.html': 'right'
  };

  // Ensure subtle liquid transition overlay exists in DOM
  let liquidOverlay = document.querySelector('.transition-liquid-overlay');
  if (!liquidOverlay) {
    liquidOverlay = document.createElement('div');
    liquidOverlay.className = 'transition-liquid-overlay';
    document.body.appendChild(liquidOverlay);
  }

  function handleSectionNavigation(e, targetHref) {
    const targetUrl = targetHref.split('#')[0].split('?')[0].toLowerCase();
    const cleanTarget = targetUrl.substring(targetUrl.lastIndexOf('/') + 1) || 'index.html';

    // Only intercept internal portfolio HTML pages
    if (!cleanTarget.endsWith('.html') || cleanTarget === pageName) return;

    const transitionKey = `${pageName}->${cleanTarget}`;
    const direction = TRANSITION_MAP[transitionKey] || 'right';

    e.preventDefault();

    // Map enter direction to corresponding exit class
    let exitClass = 'page-trans-exit-left';
    if (direction === 'right') exitClass = 'page-trans-exit-left';
    else if (direction === 'left') exitClass = 'page-trans-exit-right';
    else if (direction === 'bottom') exitClass = 'page-trans-exit-top';
    else if (direction === 'top') exitClass = 'page-trans-exit-bottom';

    // Store pending transition for next page
    sessionStorage.setItem('pending_page_trans', direction);

    // Trigger directional slide + subtle liquid glow
    document.body.classList.add(exitClass);
    if (liquidOverlay) liquidOverlay.classList.add('active');

    setTimeout(() => {
      window.location.href = targetHref;
    }, 460);
  }

  // Bind to navigation links, drawer links, and back-to-home buttons
  const internalNavTargets = document.querySelectorAll('.nav-link, .drawer-link, .back-home-btn, .preview-card-link');
  internalNavTargets.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#')) {
      link.addEventListener('click', (e) => handleSectionNavigation(e, href));
    }
  });

  // ================= 3. MOBILE HAMBURGER MENU & DRAWER (Requirement 5 & 6) =================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  function openDrawer() {
    if (!mobileDrawer || !mobileMenuToggle) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer || !mobileMenuToggle) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // ================= 4. SCROLL PROGRESS & HEADER STATE =================
  const scrollProgress = document.getElementById('scrollProgress');
  const mainHeader = document.getElementById('mainHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent}%`;
    }

    if (mainHeader) {
      if (scrollTop > 30) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 320) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
