/* ════════════════════════════════════
   YANIS DUTILLEUL — script.js
   Sans curseur custom
════════════════════════════════════ */

'use strict';

/* ── 1. NAVBAR scroll shrink + active link ── */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle(
          'active',
          l.getAttribute('href') === '#' + entry.target.id
        ));
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => obs.observe(s));
})();


/* ── 2. MOBILE NAV ── */
(function () {
  const nav  = document.getElementById('mobileNav');
  const btn  = document.getElementById('hamburger');
  const cls  = document.getElementById('mobileClose');
  if (!nav || !btn) return;

  const open  = () => { nav.classList.add('open');    document.body.style.overflow = 'hidden'; };
  const close = () => { nav.classList.remove('open'); document.body.style.overflow = ''; };

  btn.addEventListener('click', open);
  cls?.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();


/* ── 3. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});


/* ── 4. REVEAL ON SCROLL ── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


/* ── 5. LANG BARS ── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.lang-bar').forEach((bar, i) => {
          setTimeout(() => { bar.style.width = (bar.dataset.w || 0) + '%'; }, i * 120);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const block = document.querySelector('.langs');
  if (block) obs.observe(block);
})();


/* ── 6. SKILL BARS ── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach((fill, i) => {
          setTimeout(() => { fill.style.width = (fill.dataset.w || 0) + '%'; }, i * 90);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  const block = document.querySelector('.bars');
  if (block) obs.observe(block);
})();


/* ── 7. SKILL TAGS stagger ── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.tags-wrap span, .proj-stack span').forEach((el, i) => {
          el.style.opacity   = '0';
          el.style.transform = 'translateY(6px)';
          setTimeout(() => {
            el.style.transition = 'opacity .3s, transform .3s, border-color .2s, color .2s';
            el.style.opacity    = '1';
            el.style.transform  = 'translateY(0)';
          }, i * 50);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-bloc, .proj-item').forEach(el => obs.observe(el));
})();


/* ── 8. HERO VALUES highlight cycle ── */
(function () {
  const spans = document.querySelectorAll('.badge-text');
  if (!spans.length) return;

  let idx = 0;
  spans.forEach(s => { s.style.transition = 'color .4s'; });

  setInterval(() => {
    spans.forEach(s => s.style.color = '');
    spans[idx].style.color = 'var(--or-l)';
    idx = (idx + 1) % spans.length;
  }, 2000);
})();


/* ── 9. PROJECT ITEMS — hover number highlight ── */
/* Géré en CSS déjà, rien à faire en JS */


/* ── 10. FORM ITEMS stagger ── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.form-item').forEach((el, i) => {
          el.style.opacity   = '0';
          el.style.transform = 'translateY(12px)';
          setTimeout(() => {
            el.style.transition = 'opacity .5s, transform .5s';
            el.style.opacity    = '1';
            el.style.transform  = 'translateY(0)';
          }, i * 160);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const form = document.querySelector('.formation');
  if (form) obs.observe(form);
})();
