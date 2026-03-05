/* ════════════════════════════════════════════
   YANIS DUTILLEUL — script.js
════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. CURSOR PERSONNALISÉ
───────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animRing() {
    rx += (mouseX - rx) * 0.11;
    ry += (mouseY - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const targets = document.querySelectorAll('a, button, .pcard, .soft-skill, .stag, .interest-tag');
  targets.forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); ring.classList.remove('hovered'); });
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; ring.style.opacity = '0.45'; });
})();


/* ─────────────────────────────────────────
   2. NAVBAR — scroll shrink + active link
───────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Active link sur scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => obs.observe(s));
})();


/* ─────────────────────────────────────────
   3. MOBILE NAV
───────────────────────────────────────── */
(function initMobileNav() {
  const nav       = document.getElementById('mobileNav');
  const hamburger = document.getElementById('hamburger');
  const closeBtn  = document.getElementById('mobileClose');
  if (!nav || !hamburger) return;

  const open  = () => { nav.classList.add('open');    document.body.style.overflow = 'hidden'; };
  const close = () => { nav.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();


/* ─────────────────────────────────────────
   4. SMOOTH SCROLL
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});


/* ─────────────────────────────────────────
   5. REVEAL ON SCROLL
───────────────────────────────────────── */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ─────────────────────────────────────────
   6. TIMELINE STAGGERÉE
───────────────────────────────────────── */
(function initTimeline() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.idx || 0);
        setTimeout(() => entry.target.classList.add('visible'), idx * 180);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.tl-item').forEach((el, i) => {
    el.dataset.idx = i;
    obs.observe(el);
  });
})();


/* ─────────────────────────────────────────
   7. BARRES DE LANGUES
───────────────────────────────────────── */
(function initLangBars() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.lang-fill').forEach((fill, i) => {
          const w = fill.dataset.w || 0;
          setTimeout(() => { fill.style.width = w + '%'; }, i * 150);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const langBlock = document.querySelector('.langs-block');
  if (langBlock) obs.observe(langBlock);
})();


/* ─────────────────────────────────────────
   8. BARRES DE COMPÉTENCES
───────────────────────────────────────── */
(function initSkillBars() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sbar-fill').forEach((fill, i) => {
          const w = fill.dataset.w || 0;
          setTimeout(() => { fill.style.width = w + '%'; }, i * 100);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const barsBlock = document.querySelector('.skills-bars');
  if (barsBlock) obs.observe(barsBlock);
})();


/* ─────────────────────────────────────────
   9. SKILL TAGS — apparition staggerée
───────────────────────────────────────── */
(function initSkillCats() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stag').forEach((tag, i) => {
          tag.style.opacity   = '0';
          tag.style.transform = 'translateY(6px)';
          setTimeout(() => {
            tag.style.transition = 'opacity .35s, transform .35s';
            tag.style.opacity    = '1';
            tag.style.transform  = 'translateY(0)';
          }, i * 55);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.skill-cat').forEach(el => obs.observe(el));
})();


/* ─────────────────────────────────────────
   10. SOFT SKILLS — apparition staggerée
───────────────────────────────────────── */
(function initSoftSkills() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.soft-skill').forEach((el, i) => {
          el.style.opacity   = '0';
          el.style.transform = 'translateX(-8px)';
          setTimeout(() => {
            el.style.transition = 'opacity .4s, transform .4s, border-color .2s, color .2s';
            el.style.opacity    = '1';
            el.style.transform  = 'translateX(0)';
          }, i * 100);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const softBlock = document.querySelector('.soft-skills');
  if (softBlock) obs.observe(softBlock);
})();


/* ─────────────────────────────────────────
   11. PROJECT CARDS — ripple au clic
───────────────────────────────────────── */
(function initRipple() {
  // Injecter les keyframes une seule fois
  const style = document.createElement('style');
  style.textContent = `@keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }`;
  document.head.appendChild(style);

  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('click', (e) => {
      const rect   = card.getBoundingClientRect();
      const ripple = document.createElement('span');
      Object.assign(ripple.style, {
        position:    'absolute',
        borderRadius:'50%',
        background:  'rgba(122,110,78,0.1)',
        transform:   'scale(0)',
        animation:   'rippleAnim .6s linear',
        width:       '200px', height: '200px',
        left:        (e.clientX - rect.left - 100) + 'px',
        top:         (e.clientY - rect.top  - 100) + 'px',
        pointerEvents:'none',
        zIndex:      '5',
      });
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();


/* ─────────────────────────────────────────
   12. EMBLEM — légère rotation au mouvement souris
───────────────────────────────────────── */
(function initEmblemParallax() {
  const emblem = document.querySelector('.hero-emblem');
  if (!emblem) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 à 1
    const dy = (e.clientY - cy) / cy;
    emblem.style.transform = `rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg)`;
  });
})();


/* ─────────────────────────────────────────
   13. INTERESTS — apparition staggerée
───────────────────────────────────────── */
(function initInterests() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.interest-tag').forEach((tag, i) => {
          tag.style.opacity   = '0';
          tag.style.transform = 'scale(0.85)';
          setTimeout(() => {
            tag.style.transition = 'opacity .3s, transform .3s, border-color .2s, color .2s';
            tag.style.opacity    = '1';
            tag.style.transform  = 'scale(1)';
          }, i * 80);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const interestsBlock = document.querySelector('.interests-block');
  if (interestsBlock) obs.observe(interestsBlock);
})();


/* ─────────────────────────────────────────
   14. HERO VALUES — animation de soulignement cyclique
───────────────────────────────────────── */
(function initHeroValues() {
  const spans = document.querySelectorAll('.hero-values span:not(.sep)');
  if (!spans.length) return;

  let idx = 0;
  spans.forEach(s => {
    s.style.transition = 'color .4s';
  });

  setInterval(() => {
    spans.forEach(s => s.style.color = '');
    spans[idx].style.color = '#9A8B65';
    idx = (idx + 1) % spans.length;
  }, 1800);
})();
