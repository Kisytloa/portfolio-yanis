document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  if (hamburger && mobileNav && mobileClose) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
    });

    mobileClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Reveal Animations on Scroll
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // 10% of the element must be visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // Language and Bar Animations
  const animateBars = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.lang-bar, .bar-fill').forEach(bar => {
          const width = bar.dataset.w;
          if (width) {
            bar.style.width = `${width}%`;
          }
        });
        observer.unobserve(entry.target);
      }
    });
  };

  const barContainers = document.querySelectorAll('.langs, .bars');
  const barObserver = new IntersectionObserver(animateBars, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Trigger when 50% of the container is visible
  });

  barContainers.forEach(container => {
    barObserver.observe(container);
  });

  // Modal Mentions Légales
  const openLegal = document.getElementById('openLegal');
  const closeLegal = document.getElementById('closeLegal');
  const legalModal = document.getElementById('legalModal');

  if (openLegal && closeLegal && legalModal) {
    openLegal.addEventListener('click', (e) => {
      e.preventDefault();
      legalModal.classList.add('open');
      document.body.style.overflow = 'hidden'; // Empêche le scroll en arrière-plan
    });

    const closeModal = () => {
      legalModal.classList.remove('open');
      document.body.style.overflow = ''; 
    };

    closeLegal.addEventListener('click', closeModal);
    legalModal.addEventListener('click', (e) => { if(e.target === legalModal) closeModal(); });
  }
});