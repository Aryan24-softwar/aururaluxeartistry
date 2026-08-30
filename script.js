/**
 * ==============================================================================
 * AURORA LUXE ARTISTRY - MASTER APPLICATION CONTROLLER
 * Luxury Makeup Artist Booking Website
 * 
 * Features:
 * 1. EmailJS Dual-Email Integration (Dealer Notification + Client Auto-Reply)
 * 2. Real-Time Form Validation & Error State Management
 * 3. Portfolio Category Filtering & Image Lightbox Modal
 * 4. Interactive Before & After Comparison Slider
 * 5. Dynamic Service Pre-Selection & Smooth Scroll
 * 6. Sticky Luxury Navigation & Mobile Menu Drawer
 * 7. FAQ Accordion & Toast Notification System
 * 8. Booking Confirmation Modal with Copy Reference & Print
 * ==============================================================================
 */

// ==============================================================================
// 1. EMAILJS & BUSINESS CONFIGURATION
// ==============================================================================
const EMAILJS_CONFIG = {
  PUBLIC_KEY: '9O-4bkclJduO41UWE',            // Public EmailJS key
  SERVICE_ID: 'service_luxbj6j',            // EmailJS service ID
  DEALER_TEMPLATE_ID: 'YOUR_DEALER_TEMPLATE', // e.g., 'template_dealer_booking'
  CLIENT_TEMPLATE_ID: 'YOUR_CLIENT_TEMPLATE'  // e.g., 'template_client_confirm'
};

// Business & Artist Public Details
const BUSINESS_INFO = {
  businessName: 'Aurora Luxe Artistry',
  artistName: 'Elena Roche',
  phone: '+1 (555) 234-5678',
  email: 'concierge@auroraluxeartistry.com',
  address: '742 Fifth Avenue, Suite 12B, New York, NY 10019',
  website: window.location.origin || 'https://auroraluxeartistry.com'
};

// ==============================================================================
// 2. DOM INITIALIZATION
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initEmailJS();
  initHeaderScroll();
  initMobileNav();
  initActiveNavHighlight();
  initBookingSystem();
  initServiceSelectTriggers();
  initGalleryFilters();
  initLightbox();
  initComparisonSlider();
  initFaqAccordion();
  initBackToTop();
  initScrollReveal();
  initCookieConsent();
  setMinEventDate();
});

/**
 * Initialize EmailJS SDK if valid public key is supplied
 */
function initEmailJS() {
  if (window.emailjs && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    try {
      emailjs.init({
        publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
      });
      console.log('✨ [EmailJS] Initialized successfully in live production mode.');
    } catch (err) {
      console.warn('⚠️ [EmailJS] Initialization error:', err);
    }
  } else {
    console.log('ℹ️ [EmailJS] Running in smart preview/demo mode. Submissions will simulate dual email delivery or fall back to FormSubmit.');
  }
}

/**
 * Set minimum date for event booking to today
 */
function setMinEventDate() {
  const dateInput = document.getElementById('eventDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
}

// ==============================================================================
// 3. APPOINTMENT BOOKING & EMAIL DISPATCH
// ==============================================================================
function initBookingSystem() {
  const form = document.getElementById('bookingForm');
  const modalBackdrop = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const copyRefBtn = document.getElementById('copyRefBtn');
  const printModalBtn = document.getElementById('printModalBtn');

  if (!form) return;

  // Real-time input validation on blur / input
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        validateField(input);
      }
    });
  });

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Validate all required fields
    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      showToast('Please correct the highlighted fields before submitting.', 'error');
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // 2. Extract and format form values
    const fullName = document.getElementById('fullName')?.value.trim() || '';
    const email = document.getElementById('emailAddress')?.value.trim() || '';
    const phone = document.getElementById('phoneNumber')?.value.trim() || '';
    const service = document.getElementById('preferredService')?.value || 'General Inquiry';
    const eventDate = document.getElementById('eventDate')?.value || '';
    const eventTime = document.getElementById('eventTime')?.value || 'Morning (10:00 AM)';
    const partySize = document.getElementById('partySize')?.value.trim() || '1 Person (Bride Only)';
    const venue = document.getElementById('eventLocation')?.value.trim() || 'Manhattan Studio / On-Location TBD';
    const message = document.getElementById('additionalNotes')?.value.trim() || 'No additional notes provided.';

    // Generate unique luxury booking reference number (e.g., AL-2026-8942)
    const bookingRef = `AL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDate = formatDate(eventDate);
    const submissionTime = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    // 3. UI Loading State
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg style="animation: spin 1s linear infinite; width:18px; height:18px; margin-right:8px; vertical-align:middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      <span>Processing Booking Request...</span>
    `;

    // 4. Prepare Email Payloads for EmailJS
    const dealerTemplateParams = {
      client_name: fullName,
      client_email: email,
      client_phone: phone,
      service_name: service,
      booking_date: formattedDate,
      booking_time: eventTime,
      party_size: partySize,
      venue_location: venue,
      client_message: message,
      booking_ref: bookingRef,
      submission_time: submissionTime
    };

    const clientTemplateParams = {
      to_name: fullName,
      to_email: email,
      service_name: service,
      booking_date: formattedDate,
      booking_time: eventTime,
      venue_location: venue,
      party_size: partySize,
      booking_ref: bookingRef,
      business_name: BUSINESS_INFO.businessName,
      artist_name: BUSINESS_INFO.artistName,
      artist_phone: BUSINESS_INFO.phone,
      artist_email: BUSINESS_INFO.email,
      studio_address: BUSINESS_INFO.address
    };

    try {
      const isFullEmailJS = window.emailjs &&
                            EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
                            EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
                            EMAILJS_CONFIG.DEALER_TEMPLATE_ID !== 'YOUR_DEALER_TEMPLATE' &&
                            EMAILJS_CONFIG.CLIENT_TEMPLATE_ID !== 'YOUR_CLIENT_TEMPLATE';

      if (isFullEmailJS) {
        // Path A: EmailJS Dual-Email
        console.log('📧 [Dispatch] Using EmailJS dual-email path...');
        const [dealerRes, clientRes] = await Promise.all([
          emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.DEALER_TEMPLATE_ID, dealerTemplateParams),
          emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.CLIENT_TEMPLATE_ID, clientTemplateParams)
        ]);
        console.log('✅ [EmailJS] Artist Notification Sent:', dealerRes.status);
        console.log('✅ [EmailJS] Client Confirmation Sent:', clientRes.status);
      } else {
        // Path B: FormSubmit AJAX Fallback
        const targetArtistEmail = BUSINESS_INFO.email;
        console.log('📧 [Dispatch] Using FormSubmit path → ' + targetArtistEmail);

        const formSubmitPayload = {
          _subject: `✨ New Booking Request: ${fullName} – ${service} [${bookingRef}]`,
          _replyto: email,
          _template: 'table',
          _captcha: 'false',
          _autoresponse: `Dear ${fullName},\n\nThank you for your appointment request with ${BUSINESS_INFO.businessName}!\n\n── Booking Summary ──\nService: ${service}\nDate: ${formattedDate}\nTime: ${eventTime}\nVenue: ${venue}\nParty Size: ${partySize}\nReference: ${bookingRef}\n\nOur concierge team will review availability and contact you within 24 hours.\n\nFor immediate assistance, please call ${BUSINESS_INFO.phone} or email ${BUSINESS_INFO.email}.\n\nWarm regards,\n${BUSINESS_INFO.artistName}\n${BUSINESS_INFO.businessName}`,
          "Booking Reference": bookingRef,
          "Client Name": fullName,
          "Email Address": email,
          "Phone Number": phone,
          "Makeup Service": service,
          "Preferred Date": formattedDate,
          "Preferred Time": eventTime,
          "Party Size": partySize,
          "Venue Location": venue,
          "Additional Message": message,
          "Submission Time": submissionTime
        };

        const response = await fetch(`https://formsubmit.co/ajax/${targetArtistEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formSubmitPayload)
        });

        if (!response.ok) throw new Error(`FormSubmit returned ${response.status}`);
        const result = await response.json();
        console.log('✅ [FormSubmit] Email dispatched successfully:', result);
      }

      // 5. Populate and show Booking Confirmation Modal
      populateConfirmationModal({
        bookingRef,
        fullName,
        email,
        phone,
        service,
        formattedDate,
        eventTime,
        partySize,
        venue
      });

      if (modalBackdrop) modalBackdrop.classList.add('active');
      showToast('Appointment request sent! Check your inbox for confirmation.', 'success');

      form.reset();
      inputs.forEach(input => input.classList.remove('is-valid', 'is-invalid'));

    } catch (error) {
      console.error('❌ [Email Transmission Error]:', error);
      showToast('Email transmission failed. Please contact us directly at ' + BUSINESS_INFO.phone, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });

  // Modal Close Handlers
  const closeModal = () => {
    if (modalBackdrop) modalBackdrop.classList.remove('active');
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Copy Booking Reference Button
  if (copyRefBtn) {
    copyRefBtn.addEventListener('click', () => {
      const refCodeEl = document.getElementById('modalRefCode');
      if (refCodeEl) {
        navigator.clipboard.writeText(refCodeEl.innerText).then(() => {
          showToast(`Reference ${refCodeEl.innerText} copied to clipboard!`, 'success');
        }).catch(() => {
          showToast('Could not copy automatically. Code: ' + refCodeEl.innerText, 'info');
        });
      }
    });
  }

  // Print Booking Receipt
  if (printModalBtn) {
    printModalBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/**
 * Field-level validator
 */
function validateField(input) {
  const value = input.value.trim();
  const isRequired = input.hasAttribute('required');
  let isValid = true;

  if (isRequired && !value) {
    isValid = false;
  } else if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
  } else if (input.type === 'tel' && value) {
    isValid = value.replace(/\D/g, '').length >= 7;
  } else if (input.type === 'date' && value) {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    isValid = selectedDate >= today;
  }

  if (isValid) {
    input.classList.remove('is-invalid');
    if (value) input.classList.add('is-valid');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }

  return isValid;
}

/**
 * Populate Confirmation Modal Data
 */
function populateConfirmationModal(data) {
  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  };

  setElText('modalRefCode', data.bookingRef);
  setElText('modalClientName', data.fullName);
  setElText('modalService', data.service);
  setElText('modalDateTime', `${data.formattedDate} at ${data.eventTime}`);
  setElText('modalVenue', data.venue);
  setElText('modalPartySize', data.partySize);
  setElText('modalContact', `${data.email} • ${data.phone}`);
}

/**
 * Helper to format date strings gracefully
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// ==============================================================================
// 4. SERVICE PRE-SELECTION SYNC
// ==============================================================================
function initServiceSelectTriggers() {
  const bookButtons = document.querySelectorAll('[data-book-service]');
  const serviceDropdown = document.getElementById('preferredService');
  const bookingSection = document.getElementById('booking');

  bookButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetService = btn.getAttribute('data-book-service');

      if (serviceDropdown && targetService) {
        for (let i = 0; i < serviceDropdown.options.length; i++) {
          if (serviceDropdown.options[i].value.toLowerCase().includes(targetService.toLowerCase())) {
            serviceDropdown.selectedIndex = i;
            break;
          }
        }
      }

      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        if (serviceDropdown) {
          setTimeout(() => {
            serviceDropdown.focus();
            serviceDropdown.style.borderColor = 'var(--gold-primary)';
            serviceDropdown.style.boxShadow = '0 0 0 4px var(--gold-subtle)';
            setTimeout(() => {
              serviceDropdown.style.boxShadow = '';
            }, 1800);
          }, 400);
        }
      }
    });
  });
}

// ==============================================================================
// 5. PORTFOLIO / GALLERY CATEGORY FILTERING
// ==============================================================================
function initGalleryFilters() {
  const tabs = document.querySelectorAll('.gallery-tab');
  const items = document.querySelectorAll('.gallery-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

// ==============================================================================
// 6. IMAGE LIGHTBOX MODAL
// ==============================================================================
let currentLightboxIndex = 0;
let visibleGalleryImages = [];

function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      visibleGalleryImages = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
      currentLightboxIndex = visibleGalleryImages.indexOf(item);
      openLightboxAt(currentLightboxIndex);
    });
  });

  function openLightboxAt(index) {
    if (index < 0 || index >= visibleGalleryImages.length) return;
    const targetItem = visibleGalleryImages[index];
    const imgEl = targetItem.querySelector('img');
    const titleEl = targetItem.querySelector('.gallery-item-title');

    if (imgEl && lightboxImg) {
      lightboxImg.src = imgEl.src;
      lightboxCaption.innerText = titleEl ? titleEl.innerText : 'Aurora Luxe Artistry Signature Look';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex - 1 + visibleGalleryImages.length) % visibleGalleryImages.length;
      openLightboxAt(currentLightboxIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex + 1) % visibleGalleryImages.length;
      openLightboxAt(currentLightboxIndex);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

// ==============================================================================
// 7. BEFORE & AFTER COMPARISON SLIDER
// ==============================================================================
function initComparisonSlider() {
  const container = document.getElementById('comparisonSlider');
  const beforeImage = document.getElementById('comparisonBefore');
  const handle = document.getElementById('comparisonHandle');

  if (!container || !beforeImage || !handle) return;

  let isSliding = false;

  const updateSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let positionX = clientX - rect.left;

    if (positionX < 0) positionX = 0;
    if (positionX > rect.width) positionX = rect.width;

    const percentage = (positionX / rect.width) * 100;
    beforeImage.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  container.addEventListener('mousedown', (e) => {
    isSliding = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isSliding) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isSliding = false;
  });

  container.addEventListener('touchstart', (e) => {
    isSliding = true;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isSliding) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isSliding = false;
  });
}

// ==============================================================================
// 8. STICKY HEADER & MOBILE DRAWER NAVIGATION
// ==============================================================================
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ==============================================================================
// 9. FAQ ACCORDION
// ==============================================================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ==============================================================================
// 10. BACK TO TOP BUTTON
// ==============================================================================
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==============================================================================
// 11. TOAST NOTIFICATION SYSTEM
// ==============================================================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  toast.innerHTML = `
    <span style="font-weight: bold; font-size: 1.1rem;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}

window.showToast = showToast;

// ==============================================================================
// 12. LOADING SCREEN
// ==============================================================================
function initLoadingScreen() {
  const loader = document.getElementById('loadingScreen');
  if (!loader) return;

  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }, 600);
}

// ==============================================================================
// 13. SCROLL REVEAL ANIMATIONS
// ==============================================================================
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedEls = document.querySelectorAll(
    '.service-card, .package-card, .testimonial-card, .why-card, .gallery-item, .faq-item, .contact-card, .cred-card, .section-header, .booking-container, .comparison-container'
  );

  animatedEls.forEach((el, index) => {
    el.classList.add('scroll-reveal');
    el.style.transitionDelay = `${(index % 4) * 0.08}s`;
    observer.observe(el);
  });
}

// ==============================================================================
// 14. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
// ==============================================================================
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

// ==============================================================================
// 15. COOKIE CONSENT BANNER
// ==============================================================================
function initCookieConsent() {
  if (localStorage.getItem('cookieConsent') === 'accepted') return;

  const banner = document.getElementById('cookieConsent');
  const acceptBtn = document.getElementById('cookieAcceptBtn');

  if (!banner || !acceptBtn) return;

  setTimeout(() => {
    banner.classList.add('visible');
  }, 1500);

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.classList.remove('visible');
    setTimeout(() => {
      banner.style.display = 'none';
    }, 400);
  });
}
