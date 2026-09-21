document.addEventListener('DOMContentLoaded', () => {

  // 1. Top Scroll Progress Bar
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollProgress.style.width = scrolled + '%';
    });
  }

  // 2. Floating Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 3. Mobile Navigation
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  if (hamburger && mobileNav && mobileClose) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeMobile = () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    };

    mobileClose.addEventListener('click', closeMobile);

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobile);
    });
  }

  // 4. Reveal Animations on Scroll
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // 5. Animated Progress Bars
  const animateBars = (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.lang-bar, .bar-fill').forEach(bar => {
          const width = bar.dataset.w;
          if (width) {
            bar.style.width = `${width}%`;
          }
        });
        obs.unobserve(entry.target);
      }
    });
  };

  const barContainers = document.querySelectorAll('.langs, .bars');
  const barObserver = new IntersectionObserver(animateBars, {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  });

  barContainers.forEach(container => barObserver.observe(container));

  // 6. Dynamic Number Counters (Hero Stats)
  const statNumbers = document.querySelectorAll('.stat-num[data-target]');
  if (statNumbers.length > 0) {
    const animateCount = (el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(easeProgress * target);

        el.textContent = `${prefix}${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => countObserver.observe(num));
  }

  // 7. Interactive Project Filtering (projets.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.proj-card[data-category]');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const categories = card.getAttribute('data-category').split(' ');
          if (filterValue === 'all' || categories.includes(filterValue)) {
            card.style.display = 'grid';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 8. Card Mouse Spotlight Glow
  const glowCards = document.querySelectorAll('.proj-card, .skill-bloc, .about-card, .timeline-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 9. Quick Copy Email Functionality
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy') || 'yanisdutilleul21112006@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copié !';
        btn.style.background = 'var(--emerald)';
        btn.style.color = '#fff';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2200);
      });
    });
  });

  // 10. Modal Mentions Légales
  const openLegal = document.getElementById('openLegal');
  const closeLegal = document.getElementById('closeLegal');
  const legalModal = document.getElementById('legalModal');

  if (openLegal && closeLegal && legalModal) {
    const openModal = (e) => {
      e.preventDefault();
      legalModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      legalModal.classList.remove('open');
      document.body.style.overflow = '';
    };

    openLegal.addEventListener('click', openModal);
    closeLegal.addEventListener('click', closeModal);
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && legalModal.classList.contains('open')) {
        closeModal();
      }
    });
  }
});