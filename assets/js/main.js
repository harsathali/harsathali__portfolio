/**
 * HARSATH ALI A - MAIN PORTFOLIO CONTROLLER
 * Splash Screen, Project Configuration, Formspree Contact & Modal Controller
 */

// ================= CENTRALIZED PROJECT REPOSITORY CONFIGURATION =================
// Update project GitHub repository URLs here:
const projectLinks = {
  calculator: "https://github.com/harsathali/codealpha_calculator.git",
  musicPlayer: "https://github.com/harsathali/codealpha_musicplayer.git",
  imageGallery: "https://github.com/harsathali/codealpha_gallery.git"
};
window.projectLinks = projectLinks;

window.PORTFOLIO_PROJECTS = {
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    tech: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: projectLinks.calculator,
    description: 'Developed a web-based calculator performing addition, subtraction, multiplication, and division with a clean, responsive layout and real-time result display.'
  },
  musicPlayer: {
    id: 'musicPlayer',
    title: 'Music Player',
    tech: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: projectLinks.musicPlayer,
    description: 'Built a browser-based music player with play, pause, skip, and track-switching controls and an interactive UI.'
  },
  imageGallery: {
    id: 'imageGallery',
    title: 'Image Gallery',
    tech: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: projectLinks.imageGallery,
    description: 'Created a responsive, grid-based image gallery with image preview functionality for an enhanced user experience.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. SYNCHRONIZED SPLASH SCREEN (Requirement 3 & 4) =================
  const splashScreen = document.getElementById('splashScreen');
  const splashLoaderFill = document.getElementById('splashLoaderFill');
  const splashStatus = document.getElementById('splashStatus');

  if (splashScreen) {
    let currentProgress = 0;
    let isFinished = false;
    const startTime = performance.now();

    function setProgress(val, statusText) {
      currentProgress = Math.min(val, 100);
      if (splashLoaderFill) splashLoaderFill.style.width = `${currentProgress}%`;
      if (splashStatus && statusText) splashStatus.textContent = statusText;
    }

    // Step 1: Initial simulated progressive loading
    setProgress(15, 'INITIALIZING PORTFOLIO...');

    setTimeout(() => {
      if (!isFinished) setProgress(42, 'LOADING TECHNICAL PROFILE...');
    }, 400);

    setTimeout(() => {
      if (!isFinished) setProgress(72, 'INITIALIZING INTERACTIVE MODULES...');
    }, 900);

    setTimeout(() => {
      if (!isFinished) setProgress(88, 'FINALIZING ASSETS & READY STATE...');
    }, 1500);

    function onApplicationReady() {
      if (isFinished) return;

      // Guarantee minimum cinematic duration (1600ms) for high-end impression
      const elapsed = performance.now() - startTime;
      const minDuration = 1600;
      const remainingWait = Math.max(minDuration - elapsed, 0);

      setTimeout(() => {
        if (isFinished) return;
        isFinished = true;

        // LOADING BAR -> 100%
        setProgress(100, 'SYSTEM READY');

        // SHORT HOLD (280ms)
        setTimeout(() => {
          // SPLASH FADE OUT (650ms smooth transition, no white flash, no layout jump)
          splashScreen.style.transition = 'opacity 650ms cubic-bezier(0.22, 1, 0.36, 1), transform 650ms cubic-bezier(0.22, 1, 0.36, 1), visibility 650ms cubic-bezier(0.22, 1, 0.36, 1)';
          splashScreen.style.opacity = '0';
          splashScreen.style.transform = 'translateY(-10px)';
          splashScreen.style.visibility = 'hidden';

          // HOME PAGE REVEALED: Dispatch event to trigger Home Entrance directional sequence
          window.dispatchEvent(new CustomEvent('splashCompleted'));

          setTimeout(() => {
            if (splashScreen.parentNode) {
              splashScreen.parentNode.removeChild(splashScreen);
            }
          }, 650);
        }, 280);
      }, remainingWait);
    }

    if (document.readyState === 'complete') {
      onApplicationReady();
    } else {
      window.addEventListener('load', onApplicationReady);
      // Failsafe timeout to prevent any hang
      setTimeout(onApplicationReady, 3200);
    }
  }

  // ================= 2. BIND GITHUB URLS & ACTIONS =================
  document.querySelectorAll('[data-project-github]').forEach(btn => {
    const projectId = btn.getAttribute('data-project-github');
    let url = projectLinks[projectId];
    if (url && !url.startsWith('PASTE_ACTUAL')) {
      btn.setAttribute('href', url);
    } else {
      // Default to user's real GitHub profile when specific project repo URL is pending
      btn.setAttribute('href', 'https://github.com/harsathali');
    }
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });

  // ================= 3. TOAST NOTIFICATION UTILITY =================
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  function showToast(message, duration = 3500) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, duration);
  }
  window.showToast = showToast;

  // Copy to Clipboard Buttons
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          btn.classList.add('copied');
          showToast(`Copied to clipboard: ${textToCopy}`);
          setTimeout(() => btn.classList.remove('copied'), 2000);
        }).catch(() => {
          showToast('Failed to copy. Please copy manually.');
        });
      }
    });
  });

  // ================= 4. GENERIC MODAL CONTROLLER =================
  function setupModal(modalId, triggerSelector, closeSelector, backdropSelector) {
    const modal = document.getElementById(modalId);
    if (!modal) return null;

    const triggers = document.querySelectorAll(triggerSelector);
    const closeBtns = document.querySelectorAll(closeSelector);
    const backdrop = document.getElementById(backdropSelector);

    function openModal() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    triggers.forEach(trigger => trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    }));

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    return { open: openModal, close: closeModal };
  }

  // Modals for Resume
  setupModal('resumeModal', '.resume-trigger-btn', '#resumeCloseBtn', 'resumeBackdrop');

  // ================= 5. CERTIFICATE PDF MODAL CONTROLLER =================
  const certPdfModal = document.getElementById('certPdfModal');
  const certPdfIframe = document.getElementById('certPdfIframe');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalOrg = document.getElementById('certModalOrg');
  const certModalDownloadBtn = document.getElementById('certModalDownloadBtn');
  const certModalCloseBtn = document.getElementById('certModalCloseBtn');
  const certPdfBackdrop = document.getElementById('certPdfBackdrop');

  function openCertPdfModal(title, org, pdfUrl) {
    if (!certPdfModal || !certPdfIframe) return;
    if (certModalTitle) certModalTitle.textContent = title;
    if (certModalOrg) certModalOrg.textContent = org.toUpperCase();
    if (certModalDownloadBtn) {
      certModalDownloadBtn.setAttribute('href', pdfUrl);
      const filename = pdfUrl.split('/').pop() || 'certificate.pdf';
      certModalDownloadBtn.setAttribute('download', filename);
    }
    certPdfIframe.src = pdfUrl;
    certPdfModal.classList.add('open');
    certPdfModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCertPdfModal() {
    if (!certPdfModal) return;
    certPdfModal.classList.remove('open');
    certPdfModal.setAttribute('aria-hidden', 'true');
    if (certPdfIframe) certPdfIframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.cert-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-cert-title') || 'Certificate';
      const org = btn.getAttribute('data-cert-org') || 'Official Credential';
      const pdfUrl = btn.getAttribute('data-cert-pdf') || '';
      if (pdfUrl) {
        openCertPdfModal(title, org, pdfUrl);
      }
    });
  });

  if (certModalCloseBtn) certModalCloseBtn.addEventListener('click', closeCertPdfModal);
  if (certPdfBackdrop) certPdfBackdrop.addEventListener('click', closeCertPdfModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certPdfModal && certPdfModal.classList.contains('open')) {
      closeCertPdfModal();
    }
  });

  // ================= 5B. CIRCULAR SKILL PROGRESS RINGS OBSERVER (1.5s VISIBLE ANIMATION) =================
  const skillCircleItems = document.querySelectorAll('.skill-circle-item, .skill-card');
  if (skillCircleItems.length > 0) {
    if ('IntersectionObserver' in window) {
      const ringObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const item = entry.target;
            const ring = item.querySelector('.skill-ring-progress');
            const percentEl = item.querySelector('.skill-percentage');
            const targetPercent = item.getAttribute('aria-valuenow') ? parseInt(item.getAttribute('aria-valuenow'), 10) : 0;
            
            if (ring) {
              const dataOffset = ring.getAttribute('data-target-offset');
              let finalOffset = dataOffset;
              if (!finalOffset) {
                const styleAttr = ring.getAttribute('style') || '';
                const match = styleAttr.match(/stroke-dashoffset:\s*([^;]+)/);
                finalOffset = match && match[1] ? match[1].trim() : '0';
              }
              
              // Get item index for gentle stagger (80-120ms)
              const parent = item.parentElement;
              const index = parent ? Array.from(parent.children).indexOf(item) : 0;
              const delay = Math.min(index * 110, 450);

              ring.style.strokeDashoffset = '251.33';
              if (percentEl) percentEl.textContent = '0%';

              setTimeout(() => {
                // 1500ms smooth ease-out animation (within 1.2–1.8s range)
                ring.style.transition = 'stroke-dashoffset 1500ms cubic-bezier(0.22, 1, 0.36, 1)';
                ring.style.strokeDashoffset = finalOffset;

                // Animate percentage number counter simultaneously
                if (percentEl && targetPercent > 0) {
                  const startTime = performance.now();
                  const animDuration = 1500;
                  function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / animDuration, 1);
                    // Cubic ease-out curve
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentVal = Math.round(easeOut * targetPercent);
                    percentEl.textContent = `${currentVal}%`;
                    if (progress < 1) {
                      requestAnimationFrame(updateCounter);
                    } else {
                      percentEl.textContent = `${targetPercent}%`;
                      // Subtle completion glow pulse
                      item.classList.add('animation-complete');
                    }
                  }
                  requestAnimationFrame(updateCounter);
                }
              }, delay);
            }

            observer.unobserve(item);
          }
        });
      }, { threshold: 0.15 });

      skillCircleItems.forEach(item => ringObserver.observe(item));
    }
  }

  // ================= 6. CONTACT FORM HANDLER (FORMSPREE INTEGRATION) =================
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  function setFormStatus(type, message) {
    if (!formStatus) return;
    formStatus.className = `form-status ${type}`;
    const iconSvg = type === 'success'
      ? `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    formStatus.innerHTML = `${iconSvg}<span>${message}</span>`;
  }

  function clearFormStatus() {
    if (!formStatus) return;
    formStatus.className = 'form-status';
    formStatus.innerHTML = '';
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormStatus();
      let isValid = true;

      // Validate Name (must not be empty)
      const nameGroup = nameInput?.closest('.form-group');
      if (!nameInput?.value.trim()) {
        if (nameGroup) nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        if (nameGroup) nameGroup.classList.remove('has-error');
      }

      // Validate Email (must be valid email)
      const emailGroup = emailInput?.closest('.form-group');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput?.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        if (emailGroup) emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        if (emailGroup) emailGroup.classList.remove('has-error');
      }

      // Validate Subject (must not be empty)
      const subjectGroup = subjectInput?.closest('.form-group');
      if (!subjectInput?.value.trim()) {
        if (subjectGroup) subjectGroup.classList.add('has-error');
        isValid = false;
      } else {
        if (subjectGroup) subjectGroup.classList.remove('has-error');
      }

      // Validate Message (must not be empty)
      const messageGroup = messageInput?.closest('.form-group');
      if (!messageInput?.value.trim()) {
        if (messageGroup) messageGroup.classList.add('has-error');
        isValid = false;
      } else {
        if (messageGroup) messageGroup.classList.remove('has-error');
      }

      if (!isValid) return;

      // Submit State: disable button and show SENDING...
      submitBtn.disabled = true;
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="btn-text">SENDING...</span>
      `;

      const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/xvkggpdg';
      const formData = new FormData(contactForm);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Reset form on confirmed success
          contactForm.reset();
          const successMsg = 'Message sent successfully. Thank you for reaching out.';
          setFormStatus('success', successMsg);
          showToast(successMsg, 5000);

          submitBtn.innerHTML = `
            <span class="btn-text">MESSAGE SENT!</span>
            <span class="arrow" aria-hidden="true">✓</span>
          `;

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }, 3500);
        } else {
          // Keep form values intact on error
          const errorMsg = 'Something went wrong. Please try again.';
          setFormStatus('error', errorMsg);
          showToast(errorMsg, 5000);
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      } catch (error) {
        console.error('Form submission error:', error);
        const errorMsg = 'Something went wrong. Please try again.';
        setFormStatus('error', errorMsg);
        showToast(errorMsg, 5000);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });

    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          const group = input.closest('.form-group');
          if (group) group.classList.remove('has-error');
          clearFormStatus();
        });
      }
    });
  }
});
