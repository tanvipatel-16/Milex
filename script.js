/* ===================================================
   MILEX REALTY — Interactive Features & Animations
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ───────────────────────────────────────────────────
  // NAVBAR — Scroll behavior & transparency toggle
  // ───────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  let lastScroll = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      navbar.classList.remove('transparent');
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.add('transparent');
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // initial state

  // Back to Top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ───────────────────────────────────────────────────
  // MOBILE MENU — Hamburger toggle
  // ───────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelectorAll('.navbar-menu a');

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // ───────────────────────────────────────────────────
  // ACTIVE NAV LINK — Highlight based on scroll position
  // ───────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.navbar-menu a[href="#${sectionId}"]`);

      if (navLink && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ───────────────────────────────────────────────────
  // SCROLL REVEAL — Intersection Observer animations
  // ───────────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ───────────────────────────────────────────────────
  // STATS COUNTER — Animated number counting
  // ───────────────────────────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNumbers.forEach(stat => animateCounter(stat));
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ───────────────────────────────────────────────────
  // PROJECT FILTER — Tab filtering with animation
  // ───────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ───────────────────────────────────────────────────
  // TESTIMONIAL SLIDER — Auto-play carousel
  // ───────────────────────────────────────────────────
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.testimonial-dot');
  const slides = document.querySelectorAll('.testimonial-slide');
  let currentSlide = 0;
  let autoPlayTimer;

  function goToSlide(index) {
    currentSlide = index;
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      startAutoPlay(); // restart timer
    });
  });

  // Pause on hover
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  }

  // ───────────────────────────────────────────────────
  // CONTACT FORM — Validation & submission
  // ───────────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous errors
      const errorFields = contactForm.querySelectorAll('.error');
      errorFields.forEach(f => f.classList.remove('error'));
      const errorTexts = contactForm.querySelectorAll('.error-text');
      errorTexts.forEach(t => t.classList.remove('visible'));

      let isValid = true;

      // Validate required fields
      const name = document.getElementById('formName');
      const email = document.getElementById('formEmail');
      const phone = document.getElementById('formPhone');
      const message = document.getElementById('formMessage');

      if (!name.value.trim()) {
        showError(name, 'nameError');
        isValid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        showError(email, 'emailError');
        isValid = false;
      }

      if (!phone.value.trim() || phone.value.trim().length < 10) {
        showError(phone, 'phoneError');
        isValid = false;
      }

      if (!message.value.trim()) {
        showError(message, 'messageError');
        isValid = false;
      }

      if (isValid) {
        // Show success
        contactForm.style.display = 'none';
        formSuccess.classList.add('visible');
      }
    });
  }

  function showError(input, errorId) {
    input.classList.add('error');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.classList.add('visible');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ───────────────────────────────────────────────────
  // SMOOTH SCROLL — For anchor links with offset
  // ───────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight;
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ───────────────────────────────────────────────────
  // PARALLAX — Subtle hero background movement
  // ───────────────────────────────────────────────────
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
      }
    }, { passive: true });
  }

});

/* Fade-in keyframe for project filter */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);
