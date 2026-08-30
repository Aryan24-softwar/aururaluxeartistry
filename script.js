/**
 * ==============================================================================
 * AURORA LUXE ARTISTRY - MASTER APPLICATION CONTROLLER (ES5 Compatible)
 * FormSubmit Direct Integration & Interactive UX
 * ==============================================================================
 */

// 1. BUSINESS CONFIGURATION
var BUSINESS_INFO = {
  businessName: 'Aurora Luxe Artistry',
  artistName: 'Elena Roche',
  phone: '+1 (555) 234-5678',
  email: 'concierge@auroraluxeartistry.com', 
  address: '742 Fifth Avenue, Suite 12B, New York, NY 10019',
  website: window.location.origin || 'https://auroraluxeartistry.com'
};

// Global state tracking for Lightbox
var currentLightboxIndex = 0;
var visibleGalleryImages = [];

// 2. DOM INITIALIZATION
document.addEventListener('DOMContentLoaded', function () {
  initLoadingScreen();
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
 * Set minimum date for event booking to today
 */
function setMinEventDate() {
  var dateInput = document.getElementById('eventDate');
  if (dateInput) {
    var today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}

// 3. APPOINTMENT BOOKING & FORMSUBMIT AJAX DISPATCH
function initBookingSystem() {
  var form = document.getElementById('bookingForm');
  var modalBackdrop = document.getElementById('bookingModal');
  var modalCloseBtn = document.getElementById('modalCloseBtn');
  var modalDoneBtn = document.getElementById('modalDoneBtn');
  var copyRefBtn = document.getElementById('copyRefBtn');
  var printModalBtn = document.getElementById('printModalBtn');

  if (!form) return;

  // Real-time field validation setup
  var inputs = form.querySelectorAll('input, select, textarea');
  Array.prototype.forEach.call(inputs, function (input) {
    input.addEventListener('blur', function () { validateField(input); });
    input.addEventListener('input', function () {
      if (input.classList.contains('is-invalid')) {
        validateField(input);
      }
    });
  });

  // Handle Form Submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate Required Fields
    var isValid = true;
    var requiredInputs = form.querySelectorAll('[required]');
    Array.prototype.forEach.call(requiredInputs, function (input) {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      showToast('Please correct the highlighted fields before submitting.', 'error');
      var firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Extract Values safely
    var fullNameEl = document.getElementById('fullName');
    var emailEl = document.getElementById('emailAddress');
    var phoneEl = document.getElementById('phoneNumber');
    var serviceEl = document.getElementById('preferredService');
    var dateEl = document.getElementById('eventDate');
    var timeEl = document.getElementById('eventTime');
    var partyEl = document.getElementById('partySize');
    var venueEl = document.getElementById('eventLocation');
    var notesEl = document.getElementById('additionalNotes');

    var fullName = fullNameEl ? fullNameEl.value.trim() : '';
    var email = emailEl ? emailEl.value.trim() : '';
    var phone = phoneEl ? phoneEl.value.trim() : '';
    var service = serviceEl ? serviceEl.value : 'General Inquiry';
    var eventDate = dateEl ? dateEl.value : '';
    var eventTime = timeEl ? timeEl.value : 'Morning (10:00 AM)';
    var partySize = partyEl ? partyEl.value.trim() : '1 Person (Bride Only)';
    var venue = venueEl ? venueEl.value.trim() : 'Studio / On-Location TBD';
    var message = notesEl ? notesEl.value.trim() : 'No additional notes provided.';

    var bookingRef = 'AL-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    var formattedDate = formatDate(eventDate);
    var submissionTime = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    // UI Loading State
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg style="animation: spin 1s linear infinite; width:18px; height:18px; margin-right:8px; vertical-align:middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg><span>Sending Booking Request...</span>';

    // Construct Payload for FormSubmit API
    var targetArtistEmail = BUSINESS_INFO.email;
    var formSubmitPayload = {
      _subject: '✨ New Booking Request: ' + fullName + ' – ' + service + ' [' + bookingRef + ']',
      _replyto: email,
      _template: 'table',
      _captcha: 'false',
      _autoresponse: 'Dear ' + fullName + ',\n\nThank you for choosing ' + BUSINESS_INFO.businessName + '!\n\n── Booking Request Summary ──\nReference Code: ' + bookingRef + '\nService: ' + service + '\nPreferred Date: ' + formattedDate + '\nPreferred Time: ' + eventTime + '\nVenue: ' + venue + '\nParty Size: ' + partySize + '\n\nOur concierge team will review availability and confirm your booking within 24 hours.\n\nWarm regards,\n' + BUSINESS_INFO.artistName + '\n' + BUSINESS_INFO.businessName + '\nPhone: ' + BUSINESS_INFO.phone + '\nEmail: ' + BUSINESS_INFO.email,
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

    // AJAX Dispatch
    fetch('https://formsubmit.co/ajax/' + targetArtistEmail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formSubmitPayload)
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Server returned response code ' + response.status);
      }
      return response.json();
    })
    .then(function(result) {
      console.log('✅ [FormSubmit] Email dispatched successfully:', result);
      populateConfirmationModal({
        bookingRef: bookingRef,
        fullName: fullName,
        email: email,
        phone: phone,
        service: service,
        formattedDate: formattedDate,
        eventTime: eventTime,
        partySize: partySize,
        venue: venue
      });

      if (modalBackdrop) modalBackdrop.classList.add('active');
      showToast('Appointment request sent! Check your inbox for confirmation.', 'success');

      form.reset();
      Array.prototype.forEach.call(inputs, function (input) {
        input.classList.remove('is-valid', 'is-invalid');
      });
    })
    .catch(function(error) {
      console.error('❌ [FormSubmit Error]:', error);
      showToast('Form transmission failed. Please contact us directly at ' + BUSINESS_INFO.phone, 'error');
    })
    .then(function() {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    });
  });

  // Modal Controls
  var closeModal = function () {
    if (modalBackdrop) modalBackdrop.classList.remove('active');
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  if (copyRefBtn) {
    copyRefBtn.addEventListener('click', function () {
      var refCodeEl = document.getElementById('modalRefCode');
      if (refCodeEl) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(refCodeEl.innerText).then(function () {
            showToast('Reference ' + refCodeEl.innerText + ' copied to clipboard!', 'success');
          }).catch(function () {
            showToast('Code: ' + refCodeEl.innerText, 'info');
          });
        } else {
          showToast('Code: ' + refCodeEl.innerText, 'info');
        }
      }
    });
  }

  if (printModalBtn) {
    printModalBtn.addEventListener('click', function () {
      window.print();
    });
  }
}

/**
 * Validate Individual Fields
 */
function validateField(input) {
  var value = input.value.trim();
  var isRequired = input.hasAttribute('required');
  var isValid = true;

  if (isRequired && !value) {
    isValid = false;
  } else if (input.type === 'email' && value) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
  } else if (input.type === 'tel' && value) {
    isValid = value.replace(/\D/g, '').length >= 7;
  } else if (input.type === 'date' && value) {
    var selectedDate = new Date(value);
    var today = new Date();
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
 * Populate Confirmation Modal Content
 */
function populateConfirmationModal(data) {
  var setElText = function (id, text) {
    var el = document.getElementById(id);
    if (el) el.innerText = text;
  };

  setElText('modalRefCode', data.bookingRef);
  setElText('modalClientName', data.fullName);
  setElText('modalService', data.service);
  setElText('modalDateTime', data.formattedDate + ' at ' + data.eventTime);
  setElText('modalVenue', data.venue);
  setElText('modalPartySize', data.partySize);
  setElText('modalContact', data.email + ' • ' + data.phone);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  var parts = dateStr.split('-');
  var dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// 4. SERVICE PRE-SELECTION SYNC
function initServiceSelectTriggers() {
  var bookButtons = document.querySelectorAll('[data-book-service]');
  var serviceDropdown = document.getElementById('preferredService');
  var bookingSection = document.getElementById('booking');

  Array.prototype.forEach.call(bookButtons, function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var targetService = btn.getAttribute('data-book-service');

      if (serviceDropdown && targetService) {
        for (var i = 0; i < serviceDropdown.options.length; i++) {
          if (serviceDropdown.options[i].value.toLowerCase().indexOf(targetService.toLowerCase()) !== -1) {
            serviceDropdown.selectedIndex = i;
            break;
          }
        }
      }

      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        if (serviceDropdown) {
          setTimeout(function () {
            serviceDropdown.focus();
            serviceDropdown.style.borderColor = 'var(--gold-primary, #c5a059)';
            serviceDropdown.style.boxShadow = '0 0 0 4px rgba(197, 160, 89, 0.2)';
            setTimeout(function () {
              serviceDropdown.style.boxShadow = '';
            }, 1800);
          }, 400);
        }
      }
    });
  });
}

// 5. PORTFOLIO / GALLERY CATEGORY FILTERING
function initGalleryFilters() {
  var tabs = document.querySelectorAll('.gallery-tab');
  var items = document.querySelectorAll('.gallery-item');

  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener('click', function () {
      Array.prototype.forEach.call(tabs, function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      var filterValue = tab.getAttribute('data-filter');

      Array.prototype.forEach.call(items, function (item) {
        var itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          item.style.display = '';
        } else {
          item.classList.add('hidden');
          item.style.display = 'none';
        }
      });
    });
  });
}

// 6. IMAGE LIGHTBOX MODAL
function initLightbox() {
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightbox = document.getElementById('lightboxModal');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');

  if (!lightbox) return;

  Array.prototype.forEach.call(galleryItems, function (item) {
    item.addEventListener('click', function () {
      var visibleNodes = document.querySelectorAll('.gallery-item:not(.hidden)');
      visibleGalleryImages = Array.prototype.slice.call(visibleNodes);
      currentLightboxIndex = visibleGalleryImages.indexOf(item);
      openLightboxAt(currentLightboxIndex);
    });
  });

  function openLightboxAt(index) {
    if (index < 0 || index >= visibleGalleryImages.length) return;
    var targetItem = visibleGalleryImages[index];
    var imgEl = targetItem.querySelector('img');
    var titleEl = targetItem.querySelector('.gallery-item-title');

    if (imgEl && lightboxImg) {
      lightboxImg.src = imgEl.src;
      if (lightboxCaption) {
        lightboxCaption.innerText = titleEl ? titleEl.innerText : 'Aurora Luxe Artistry Look';
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  var closeLightbox = function () {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex - 1 + visibleGalleryImages.length) % visibleGalleryImages.length;
      openLightboxAt(currentLightboxIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex + 1) % visibleGalleryImages.length;
      openLightboxAt(currentLightboxIndex);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

// 7. BEFORE & AFTER COMPARISON SLIDER
function initComparisonSlider() {
  var container = document.getElementById('comparisonSlider');
  var beforeImage = document.getElementById('comparisonBefore');
  var handle = document.getElementById('comparisonHandle');

  if (!container || !beforeImage || !handle) return;

  var isSliding = false;

  var updateSlider = function (clientX) {
    var rect = container.getBoundingClientRect();
    var positionX = clientX - rect.left;

    if (positionX < 0) positionX = 0;
    if (positionX > rect.width) positionX = rect.width;

    var percentage = (positionX / rect.width) * 100;
    beforeImage.style.width = percentage + '%';
    handle.style.left = percentage + '%';
  };

  container.addEventListener('mousedown', function (e) {
    isSliding = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', function (e) {
    if (!isSliding) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', function () {
    isSliding = false;
  });

  container.addEventListener('touchstart', function (e) {
    isSliding = true;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (!isSliding) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', function () {
    isSliding = false;
  });
}

// 8. STICKY HEADER & MOBILE NAVIGATION
function initHeaderScroll() {
  var header = document.querySelector('.header');
  if (!header) return;

  var handleScroll = function () {
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
  var toggleBtn = document.getElementById('mobileToggle');
  var navMenu = document.getElementById('navMenu');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', function () {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  Array.prototype.forEach.call(navLinks, function (link) {
    link.addEventListener('click', function () {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// 9. FAQ ACCORDION
function initFaqAccordion() {
  var faqItems = document.querySelectorAll('.faq-item');

  Array.prototype.forEach.call(faqItems, function (item) {
    var questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', function () {
      var isActive = item.classList.contains('active');

      Array.prototype.forEach.call(faqItems, function (otherItem) {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// 10. BACK TO TOP BUTTON
function initBackToTop() {
  var backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 11. TOAST NOTIFICATION SYSTEM
function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  var toast = document.createElement('div');
  toast.className = 'toast ' + type;

  var icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  toast.innerHTML = '<span style="font-weight: bold; font-size: 1.1rem;">' + icon + '</span><span>' + message + '</span>';

  container.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4500);
}

window.showToast = showToast;

// 12. LOADING SCREEN
function initLoadingScreen() {
  var loader = document.getElementById('loadingScreen');
  if (!loader) return;

  setTimeout(function () {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    setTimeout(function () {
      loader.style.display = 'none';
    }, 500);
  }, 600);
}

// 13. SCROLL REVEAL ANIMATIONS
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  var observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  };

  var observer = new IntersectionObserver(function (entries) {
    Array.prototype.forEach.call(entries, function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  var animatedEls = document.querySelectorAll(
    '.service-card, .package-card, .testimonial-card, .why-card, .gallery-item, .faq-item, .contact-card, .cred-card, .section-header, .booking-container, .comparison-container'
  );

  Array.prototype.forEach.call(animatedEls, function (el, index) {
    el.classList.add('scroll-reveal');
    el.style.transitionDelay = (index % 4) * 0.08 + 's';
    observer.observe(el);
  });
}

// 14. ACTIVE NAV LINK HIGHLIGHT
function initActiveNavHighlight() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', function () {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    Array.prototype.forEach.call(sections, function (section) {
      var sectionHeight = section.offsetHeight;
      var sectionTop = section.offsetTop - 140;
      var sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        Array.prototype.forEach.call(navLinks, function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

// 15. COOKIE CONSENT BANNER
function initCookieConsent() {
  if (localStorage.getItem('cookieConsent') === 'accepted') return;

  var banner = document.getElementById('cookieConsent');
  var acceptBtn = document.getElementById('cookieAcceptBtn');

  if (!banner || !acceptBtn) return;

  setTimeout(function () {
    banner.classList.add('visible');
  }, 1500);

  acceptBtn.addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.classList.remove('visible');
    setTimeout(function () {
      banner.style.display = 'none';
    }, 400);
  });
}
