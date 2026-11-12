/* ═══════════════════════════════════════════════════════════════
   YANIS DUTILLEUL — PORTFOLIO « ÉTHER »
   Moteur d'effets : ciel procédural, ailes de lumière, cercle runique,
   particules d'éther, curseur, révélations, factions.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const d = document;
  const root = d.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => Array.from(c.querySelectorAll(s));
  const cssVar = (n) => getComputedStyle(root).getPropertyValue(n).trim();
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const SVGNS = 'http://www.w3.org/2000/svg';

  // Générateur pseudo-aléatoire déterministe (même ciel à chaque visite)
  const rng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  /* ─────────────────────────────────────────────
     1. DÉFINITIONS SVG PARTAGÉES (dégradés)
     ───────────────────────────────────────────── */
  const defs = d.createElementNS(SVGNS, 'svg');
  defs.setAttribute('aria-hidden', 'true');
  defs.setAttribute('width', '0');
  defs.setAttribute('height', '0');
  defs.style.position = 'absolute';
  defs.innerHTML = `
    <defs>
      <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style="stop-color:var(--rock-top)"/>
        <stop offset=".45" style="stop-color:var(--rock-bot)"/>
        <stop offset="1" style="stop-color:var(--rock-bot);stop-opacity:.2"/>
      </linearGradient>
      <radialGradient id="coreGlow">
        <stop offset="0" style="stop-color:var(--horizon);stop-opacity:.35"/>
        <stop offset=".5" style="stop-color:var(--accent);stop-opacity:.08"/>
        <stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/>
      </radialGradient>
      <linearGradient id="fA" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" style="stop-color:var(--wing-a);stop-opacity:.6"/>
        <stop offset=".55" style="stop-color:var(--wing-b);stop-opacity:.3"/>
        <stop offset="1" style="stop-color:var(--wing-c);stop-opacity:.04"/>
      </linearGradient>
      <linearGradient id="fB" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" style="stop-color:var(--wing-a);stop-opacity:.7"/>
        <stop offset=".6" style="stop-color:var(--wing-b);stop-opacity:.38"/>
        <stop offset="1" style="stop-color:var(--wing-b);stop-opacity:.08"/>
      </linearGradient>
      <linearGradient id="fC" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" style="stop-color:#ffffff;stop-opacity:.8"/>
        <stop offset="1" style="stop-color:var(--wing-a);stop-opacity:.35"/>
      </linearGradient>
      <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" style="stop-color:var(--accent);stop-opacity:.25"/>
        <stop offset="1" style="stop-color:var(--gold-hi);stop-opacity:.95"/>
      </linearGradient>
      <radialGradient id="medalGrad" cx=".35" cy=".3">
        <stop offset="0" style="stop-color:var(--gold-hi)"/>
        <stop offset=".6" style="stop-color:var(--gold)"/>
        <stop offset="1" style="stop-color:var(--gold-lo)"/>
      </radialGradient>
    </defs>`;
  d.body.prepend(defs);

  /* ─────────────────────────────────────────────
     2. CIEL PROCÉDURAL (montagnes + îles flottantes)
     ───────────────────────────────────────────── */
  const ridge = (seed, minY, maxY, w = 1600, h = 400) => {
    const r = rng(seed);
    const p = [r() * 6, r() * 6, r() * 6];
    let path = `M0 ${h} `;
    for (let x = 0; x <= w; x += 20) {
      const n = Math.sin(x * 0.0042 + p[0]) * 0.5
        + Math.sin(x * 0.011 + p[1]) * 0.3
        + Math.sin(x * 0.029 + p[2]) * 0.12
        + (r() - 0.5) * 0.12;
      const y = lerp(maxY, minY, (n + 1) / 2);
      path += `L${x} ${y.toFixed(1)} `;
    }
    return path + `L${w} ${h} Z`;
  };

  const islandSVG = (ruins) => `
    <svg viewBox="0 0 240 260" aria-hidden="true">
      <ellipse cx="120" cy="64" rx="120" ry="30" style="fill:rgba(var(--accent-rgb),.12);filter:blur(14px)"/>
      <path class="rock" d="M8 52 Q30 40 60 44 Q95 34 130 42 Q175 36 205 46 Q228 50 232 58 L214 78 L206 112 L192 98 L178 160 L164 130 L150 214 L136 150 L122 250 L108 168 L94 196 L82 130 L68 150 L56 104 L40 112 L30 80 Z"/>
      <path class="rock-top" d="M8 52 Q30 40 60 44 Q95 34 130 42 Q175 36 205 46 Q228 50 232 58 Q200 68 120 68 Q40 68 8 52Z"/>
      <path class="rim" d="M8 52 Q30 40 60 44 Q95 34 130 42 Q175 36 205 46 Q228 50 232 58"/>
      ${ruins ? `
      <rect class="ruin" x="62" y="12" width="8" height="34"/>
      <rect class="ruin" x="92" y="12" width="8" height="32"/>
      <rect class="ruin" x="56" y="6" width="50" height="7"/>
      <rect class="ruin" x="150" y="20" width="7" height="22"/>
      <path class="ruin" d="M168 44 l6 -26 l6 26z"/>` : ''}
      <path class="crystal" d="M122 252 l-6 -16 6 -12 6 12z"/>
      <path class="crystal" d="M150 216 l-4 -10 4 -8 4 8z" style="animation-delay:-1s"/>
    </svg>`;

  const buildSky = (el) => {
    el.innerHTML = `
      <div class="horizon"></div>
      <div class="rays"></div>
      <div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div>
      <svg class="layer mtn-far" data-depth=".18" viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true"><path d="${ridge(7, 60, 300)}"/></svg>
      <div class="island is-4" data-depth=".25">${islandSVG(false)}</div>
      <div class="island is-1" data-depth=".55">${islandSVG(true)}</div>
      <div class="island is-2" data-depth=".4">${islandSVG(true)}</div>
      <div class="island is-3" data-depth=".3">${islandSVG(false)}</div>
      <svg class="layer mtn-near" data-depth=".35" viewBox="0 0 1600 400" preserveAspectRatio="none" aria-hidden="true"><path d="${ridge(21, 120, 340)}"/></svg>
      <div class="mist"></div>`;
  };
  $$('[data-sky]').forEach(buildSky);

  /* ─────────────────────────────────────────────
     3. CERCLE RUNIQUE
     ───────────────────────────────────────────── */
  const runeGlyph = (r) => {
    // Rune procédurale : un fût vertical + 1 à 3 branches
    let p = 'M0 -9 L0 9';
    const n = 1 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) {
      const y = -8 + r() * 12;
      const dir = r() > 0.5 ? 1 : -1;
      const kind = r();
      if (kind < 0.4) p += ` M0 ${y.toFixed(1)} L${5 * dir} ${(y + 5).toFixed(1)}`;
      else if (kind < 0.75) p += ` M0 ${y.toFixed(1)} L${5 * dir} ${(y - 4).toFixed(1)}`;
      else p += ` M0 ${y.toFixed(1)} L${5 * dir} ${(y + 4).toFixed(1)} L0 ${(y + 8).toFixed(1)}`;
    }
    return p;
  };

  const buildRuneCircle = (el) => {
    const r = rng(42);
    const C = 400;
    let ticks = '';
    for (let a = 0; a < 360; a += 5) {
      const long = a % 15 === 0;
      const rad = (a * Math.PI) / 180;
      const r1 = long ? 352 : 358, r2 = 368;
      ticks += `<line x1="${C + Math.cos(rad) * r1}" y1="${C + Math.sin(rad) * r1}" x2="${C + Math.cos(rad) * r2}" y2="${C + Math.sin(rad) * r2}"/>`;
    }
    let runes = '';
    const nR = 28;
    for (let i = 0; i < nR; i++) {
      const a = (i / nR) * 360;
      runes += `<path transform="rotate(${a} ${C} ${C}) translate(${C} ${C - 212})" d="${runeGlyph(r)}"/>`;
    }
    const poly = (n, rad, rot = 0) => Array.from({ length: n }, (_, i) => {
      const a = ((i / n) * 360 + rot - 90) * Math.PI / 180;
      return `${(C + Math.cos(a) * rad).toFixed(1)},${(C + Math.sin(a) * rad).toFixed(1)}`;
    }).join(' ');

    const words = '✦ SQL ✦ POWER BI ✦ PYTHON ✦ DAX ✦ POWER QUERY ✦ ORACLE ✦ PANDAS ✦ SYMFONY ✦ PHP ✦ JAVASCRIPT ✦ DOCKER ✦ GIT ';
    el.innerHTML = `
      <svg viewBox="0 0 800 800" aria-hidden="true">
        <defs>
          <path id="rcPath" d="M${C} ${C} m-336 0 a336 336 0 1 1 672 0 a336 336 0 1 1 -672 0"/>
        </defs>
        <circle class="rc-core" cx="${C}" cy="${C}" r="300"/>
        <g class="rc-spin">
          <circle class="rc-line" cx="${C}" cy="${C}" r="372"/>
          <circle class="rc-faint" cx="${C}" cy="${C}" r="352"/>
          <g class="rc-line">${ticks}</g>
          <text class="rc-text"><textPath href="#rcPath" textLength="2105" lengthAdjust="spacing">${words}</textPath></text>
          <circle class="rc-faint" cx="${C}" cy="${C}" r="318"/>
        </g>
        <g class="rc-spin-rev">
          <circle class="rc-line" cx="${C}" cy="${C}" r="300"/>
          <polygon class="rc-faint" points="${poly(4, 300)}"/>
          <polygon class="rc-faint" points="${poly(4, 300, 45)}"/>
          <polygon class="rc-line" points="${poly(3, 262)}" style="opacity:.3"/>
          <polygon class="rc-line" points="${poly(3, 262, 60)}" style="opacity:.3"/>
        </g>
        <g class="rc-spin-fast">
          <circle class="rc-faint" cx="${C}" cy="${C}" r="232" stroke-dasharray="3 7"/>
          <g class="rc-line" style="stroke:var(--accent-2);stroke-width:1.4;opacity:.6">${runes}</g>
          <circle class="rc-faint" cx="${C}" cy="${C}" r="192"/>
        </g>
      </svg>`;
  };
  $$('[data-rune-circle]').forEach(buildRuneCircle);

  /* ─────────────────────────────────────────────
     4. AILES DE LUMIÈRE (générées plume par plume)
     ───────────────────────────────────────────── */
  const buildWing = () => {
    // Repère : viewBox 560×600, épaule en (10, 432)
    const S = [10, 432], Cp = [190, 250], E = [500, 150];
    const bez = (t) => [
      (1 - t) * (1 - t) * S[0] + 2 * (1 - t) * t * Cp[0] + t * t * E[0],
      (1 - t) * (1 - t) * S[1] + 2 * (1 - t) * t * Cp[1] + t * t * E[1],
    ];
    const layers = [
      { n: 26, from: 0, to: 1, len: 1, ang: 0, fill: 'url(#fA)', delay: 0 },
      { n: 22, from: 0, to: 0.93, len: 0.6, ang: -4, fill: 'url(#fB)', delay: 0.25 },
      { n: 18, from: 0, to: 0.82, len: 0.3, ang: -8, fill: 'url(#fC)', delay: 0.5 },
    ];
    let out = '';
    layers.forEach((L) => {
      for (let i = 0; i < L.n; i++) {
        const t = lerp(L.from, L.to, i / (L.n - 1));
        const [x, y] = bez(t);
        const theta = lerp(98, -16, Math.pow(t, 0.95)) + L.ang;
        let len = (150 + 210 * Math.pow(t, 0.8)) * L.len;
        if (t > 0.86) len *= 1 - (t - 0.86) * 1.6;
        const w = len * 0.15;
        const delay = (0.35 + t * 0.9 + L.delay).toFixed(2);
        const f = `M0 0 C${(len * .25).toFixed(1)} ${(-w).toFixed(1)} ${(len * .75).toFixed(1)} ${(-w * .9).toFixed(1)} ${len.toFixed(1)} 0 C${(len * .75).toFixed(1)} ${(w * .55).toFixed(1)} ${(len * .25).toFixed(1)} ${(w * .8).toFixed(1)} 0 0Z`;
        out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${theta.toFixed(1)})">
          <path class="feather-in" style="animation-delay:${delay}s;stroke:var(--wing-a)" d="${f}" fill="${L.fill}" stroke-opacity=".28" stroke-width=".6"/>
          <path class="feather-in" style="animation-delay:${delay}s;stroke:var(--wing-a)" d="M0 0 L${(len * .9).toFixed(1)} 0" stroke-opacity=".35" stroke-width=".7"/>
        </g>`;
      }
    });
    const arm = `M${S[0]} ${S[1]} Q${Cp[0]} ${Cp[1]} ${E[0]} ${E[1]}`;
    out += `<path d="${arm}" fill="none" stroke-width="2.4" stroke-linecap="round" opacity=".85" class="feather-in" style="animation-delay:.3s;stroke:var(--wing-a)"/>`;
    return `<svg viewBox="0 0 560 600" aria-hidden="true">${out}</svg>`;
  };
  $$('[data-wings]').forEach((el) => {
    const wing = buildWing();
    el.innerHTML = `<div class="wing wing-l">${wing}</div><div class="wing wing-r">${wing}</div>`;
  });

  /* ─────────────────────────────────────────────
     5. TEXTE DÉCOUPÉ EN LETTRES
     ───────────────────────────────────────────── */
  let charIndex = 0;
  $$('[data-split]').forEach((el) => {
    if (el.hasAttribute('data-split-reset')) charIndex = 0;
    const text = el.textContent;
    el.setAttribute('aria-hidden', 'true');
    el.textContent = '';
    for (const ch of text) {
      if (ch === ' ') { el.append(' '); continue; }
      const s = d.createElement('span');
      s.className = 'char';
      s.style.setProperty('--i', charIndex++);
      s.textContent = ch;
      el.append(s);
    }
  });

  /* ─────────────────────────────────────────────
     6. INTRO « ÉVEIL »
     ───────────────────────────────────────────── */
  const intro = $('#intro');
  if (intro && root.classList.contains('intro-on')) {
    let ended = false;
    const end = () => {
      if (ended) return;
      ended = true;
      intro.classList.add('done');
      root.classList.remove('intro-on');
      try { sessionStorage.setItem('eveil', '1'); } catch (e) { /* stockage indisponible */ }
      setTimeout(() => intro.remove(), 1000);
    };
    intro.addEventListener('click', end);
    d.addEventListener('keydown', end, { once: true });
    setTimeout(end, 2600);
  } else if (intro) {
    intro.remove();
  }

  /* ─────────────────────────────────────────────
     7. NAVIGATION, PROGRESSION, MENU MOBILE
     ───────────────────────────────────────────── */
  const navbar = $('#navbar');
  const progress = $('#scroll-progress');
  const onScrollUI = () => {
    const y = window.scrollY;
    navbar && navbar.classList.toggle('scrolled', y > 30);
    if (progress) {
      const h = root.scrollHeight - root.clientHeight;
      progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    }
  };
  window.addEventListener('scroll', onScrollUI, { passive: true });
  onScrollUI();

  const burger = $('#hamburger');
  if (burger) {
    const setMenu = (open) => {
      root.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      d.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    $$('.mobile-nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ─────────────────────────────────────────────
     8. FACTIONS : Lumière ✦ / Ombre ☾
     ───────────────────────────────────────────── */
  const factionBtn = $('.faction-toggle');
  const applyFaction = (f) => {
    if (f === 'ombre') root.dataset.faction = 'ombre';
    else delete root.dataset.faction;
    try { localStorage.setItem('faction', f); } catch (e) { /* stockage indisponible */ }
    if (factionBtn) {
      factionBtn.setAttribute('aria-pressed', String(f === 'ombre'));
      factionBtn.title = f === 'ombre' ? 'Passer en faction Lumière' : 'Passer en faction Ombre';
    }
    d.dispatchEvent(new CustomEvent('faction'));
  };
  if (factionBtn) {
    applyFaction(root.dataset.faction === 'ombre' ? 'ombre' : 'lumiere');
    factionBtn.addEventListener('click', (e) => {
      const next = root.dataset.faction === 'ombre' ? 'lumiere' : 'ombre';
      if (!d.startViewTransition || RM) { applyFaction(next); return; }
      const rect = factionBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
      const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.classList.add('vt-faction');
      const t = d.startViewTransition(() => applyFaction(next));
      t.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
          { duration: 1000, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
      t.finished.finally(() => root.classList.remove('vt-faction'));
    });
  }

  /* ─────────────────────────────────────────────
     9. RÉVÉLATIONS AU SCROLL
     ───────────────────────────────────────────── */
  $$('[data-stagger]').forEach((group) => {
    $$(':scope > .reveal', group).forEach((el, i) => el.style.setProperty('--d', i));
  });

  const onVisible = (el) => {
    el.classList.add('visible');
    $$('.gauge-fill[data-w]', el).forEach((b) => { b.style.width = b.dataset.w + '%'; });
    $$('[data-count]', el).forEach(countUp);
  };

  const countUp = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix ? `<small>${el.dataset.suffix}</small>` : '';
    if (RM) { el.innerHTML = target + suffix; return; }
    const t0 = performance.now(), dur = 1800;
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.innerHTML = Math.round(e * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { onVisible(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, [data-observe]').forEach((el) => io.observe(el));

  /* ─────────────────────────────────────────────
     10. CHRONIQUES : ligne qui se remplit
     ───────────────────────────────────────────── */
  const timelines = $$('.timeline');
  const updateTimelines = () => {
    const vh = innerHeight;
    timelines.forEach((tl) => {
      const r = tl.getBoundingClientRect();
      const p = clamp((vh * 0.62 - r.top) / r.height, 0, 1);
      tl.style.setProperty('--p', p.toFixed(3));
      $$('.tl-item', tl).forEach((it) => {
        const gem = $('.tl-gem', it).getBoundingClientRect();
        it.classList.toggle('lit', gem.top < vh * 0.62);
      });
    });
  };
  if (timelines.length) {
    window.addEventListener('scroll', updateTimelines, { passive: true });
    window.addEventListener('resize', updateTimelines);
    updateTimelines();
  }

  /* ─────────────────────────────────────────────
     11. INCLINAISON 3D + LUEUR DES CADRES
     ───────────────────────────────────────────── */
  if (FINE && !RM) {
    $$('.frame').forEach((card) => {
      const tilt = card.hasAttribute('data-tilt');
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        if (tilt && card.classList.contains('visible')) {
          const rx = ((y / r.height) - 0.5) * -7;
          const ry = ((x / r.width) - 0.5) * 7;
          card.style.transition = 'transform .15s ease-out, border-color .5s, box-shadow .5s';
          card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
        }
      });
      card.addEventListener('pointerleave', () => {
        if (!tilt) return;
        card.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), border-color .5s, box-shadow .5s';
        card.style.transform = '';
      });
    });
  }

  /* ─────────────────────────────────────────────
     12. PARALLAXE DU CIEL (souris + scroll)
     ───────────────────────────────────────────── */
  const heroes = $$('#hero, .page-hero');
  if (heroes.length && !RM) {
    const items = [];
    heroes.forEach((h) => {
      $$('[data-depth]', h).forEach((el) => items.push({ el, depth: parseFloat(el.dataset.depth), hero: h }));
    });
    const heroContent = $('#hero .hero-content');
    let mx = 0, my = 0, cx = 0, cy = 0, raf = 0;
    if (FINE) {
      window.addEventListener('pointermove', (e) => {
        mx = (e.clientX / innerWidth) * 2 - 1;
        my = (e.clientY / innerHeight) * 2 - 1;
        if (!raf) raf = requestAnimationFrame(tick);
      }, { passive: true });
    }
    const tick = () => {
      raf = 0;
      cx = lerp(cx, mx, 0.06);
      cy = lerp(cy, my, 0.06);
      const sy = window.scrollY;
      if (sy < innerHeight * 1.3) {
        items.forEach(({ el, depth }) => {
          el.style.transform = `translate3d(${(-cx * depth * 40).toFixed(2)}px, ${(-cy * depth * 22 + sy * depth * 0.5).toFixed(2)}px, 0)`;
        });
        if (heroContent) {
          const k = clamp(sy / (innerHeight * 0.75), 0, 1);
          heroContent.style.transform = `translate3d(0, ${(sy * 0.28).toFixed(1)}px, 0)`;
          heroContent.style.opacity = (1 - k).toFixed(3);
        }
      }
      if (Math.abs(cx - mx) > 0.001 || Math.abs(cy - my) > 0.001) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
    tick();
  }

  /* ─────────────────────────────────────────────
     13. PARTICULES D'ÉTHER (canvas d'arrière-plan)
     ───────────────────────────────────────────── */
  const canvas = $('#aether');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, motes = [], stars = [], sprites = {}, running = true;
    let pointer = { x: -9999, y: -9999 };

    const sprite = (color) => {
      const s = d.createElement('canvas');
      s.width = s.height = 64;
      const g = s.getContext('2d');
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, '#ffffff');
      grd.addColorStop(0.18, color);
      grd.addColorStop(0.45, color + '55');
      grd.addColorStop(1, color + '00');
      g.fillStyle = grd;
      g.fillRect(0, 0, 64, 64);
      return s;
    };
    const toHex = (c) => {
      if (c.startsWith('#') && c.length === 7) return c;
      const tmp = d.createElement('canvas').getContext('2d');
      tmp.fillStyle = c;
      return tmp.fillStyle.length === 7 ? tmp.fillStyle : '#ffffff';
    };
    const refreshColors = () => {
      sprites = {
        gold: sprite(toHex(cssVar('--gold-hi') || '#fbe7b4')),
        accent: sprite(toHex(cssVar('--accent-2') || '#b8e8ff')),
        hot: sprite(toHex(cssVar('--accent') || '#6cc4ff')),
      };
    };

    const spawn = (anywhere) => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 20,
      r: 0.6 + Math.random() * 2.2,
      vy: 0.12 + Math.random() * 0.45,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.004 + Math.random() * 0.01,
      amp: 0.2 + Math.random() * 0.6,
      tw: Math.random() * Math.PI * 2,
      vx: 0,
      kind: Math.random() < 0.55 ? 'gold' : (Math.random() < 0.7 ? 'accent' : 'hot'),
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = innerWidth; H = innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = RM ? 20 : Math.round(clamp((W * H) / 13000, 30, 120));
      motes = Array.from({ length: count }, () => spawn(true));
      stars = Array.from({ length: Math.round(count * 1.2) }, () => ({
        x: Math.random() * W, y: Math.random() * H * 0.7,
        r: Math.random() * 1.1 + 0.2, tw: Math.random() * 6, s: 0.01 + Math.random() * 0.03,
      }));
    };

    let shooting = null;
    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const scrollFade = clamp(1 - window.scrollY / (H * 0.9), 0, 1);
      const moteFade = clamp(1 - window.scrollY / (H * 1.5), 0.45, 1);

      // Étoiles (s'estompent en descendant)
      ctx.fillStyle = '#ffffff';
      stars.forEach((s) => {
        s.tw += s.s;
        ctx.globalAlpha = (0.25 + Math.sin(s.tw) * 0.25 + 0.25) * scrollFade;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      });

      // Étoile filante occasionnelle
      if (!shooting && !RM && Math.random() < 0.0035) {
        shooting = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.3, vx: 9 + Math.random() * 6, vy: 3 + Math.random() * 2, life: 1 };
      }
      if (shooting) {
        const s = shooting;
        const grd = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12);
        grd.addColorStop(0, 'rgba(255,255,255,.9)');
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.globalAlpha = s.life * scrollFade;
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12);
        ctx.stroke();
        s.x += s.vx; s.y += s.vy; s.life -= 0.018;
        if (s.life <= 0 || s.x > W + 100) shooting = null;
      }

      // Motes d'éther
      ctx.globalCompositeOperation = 'lighter';
      motes.forEach((m, i) => {
        m.sway += m.swaySpeed;
        m.tw += 0.03;
        const dx = m.x - pointer.x, dy = m.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 16000) {
          const f = (1 - dist2 / 16000) * 0.6;
          m.vx += (dx / Math.sqrt(dist2 + 1)) * f;
        }
        m.vx *= 0.94;
        m.x += Math.sin(m.sway) * m.amp + m.vx;
        m.y -= m.vy;
        if (m.y < -20 || m.x < -40 || m.x > W + 40) motes[i] = spawn(false);
        const a = 0.35 + Math.sin(m.tw) * 0.3 + 0.3;
        const size = m.r * 7;
        ctx.globalAlpha = clamp(a, 0, 1) * moteFade;
        ctx.drawImage(sprites[m.kind], m.x - size / 2, m.y - size / 2, size, size);
      });
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    };

    refreshColors();
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
    d.addEventListener('faction', refreshColors);
    d.addEventListener('visibilitychange', () => {
      if (RM) return;
      running = !d.hidden;
      if (running) requestAnimationFrame(frame);
    });
    if (RM) {
      // Une seule image fixe
      running = false;
      requestAnimationFrame(() => { running = true; frame(); running = false; });
    } else {
      requestAnimationFrame(frame);
    }
  }

  /* ─────────────────────────────────────────────
     14. CURSEUR + TRAÎNÉE D'ÉTINCELLES
     ───────────────────────────────────────────── */
  if (FINE && !RM) {
    const orb = d.createElement('div'); orb.className = 'cursor-orb';
    const ring = d.createElement('div'); ring.className = 'cursor-ring';
    const trail = d.createElement('canvas'); trail.id = 'cursor-trail';
    d.body.append(trail, ring, orb);
    const tctx = trail.getContext('2d');
    let tw = 0, th = 0;
    const tResize = () => {
      const r = Math.min(window.devicePixelRatio || 1, 2);
      tw = innerWidth; th = innerHeight;
      trail.width = tw * r; trail.height = th * r;
      tctx.setTransform(r, 0, 0, r, 0, 0);
    };
    tResize();
    window.addEventListener('resize', tResize);

    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, lx = x, ly = y;
    const sparks = [];
    let gold = cssVar('--gold-hi'), acc = cssVar('--accent-2');
    d.addEventListener('faction', () => { gold = cssVar('--gold-hi'); acc = cssVar('--accent-2'); });

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      root.classList.add('has-cursor');
      const dist = Math.hypot(x - lx, y - ly);
      const n = Math.min(4, Math.floor(dist / 9));
      for (let i = 0; i < n; i++) {
        const t = i / n;
        sparks.push({
          x: lerp(lx, x, t), y: lerp(ly, y, t),
          vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8 + 0.3,
          life: 1, r: 0.6 + Math.random() * 1.6, c: Math.random() < 0.7 ? gold : acc,
        });
      }
      if (sparks.length > 160) sparks.splice(0, sparks.length - 160);
      lx = x; ly = y;
    }, { passive: true });
    d.addEventListener('pointerleave', () => root.classList.remove('has-cursor'));

    const hoverSel = 'a, button, [data-hover], input, label';
    d.addEventListener('pointerover', (e) => {
      ring.classList.toggle('is-hover', !!e.target.closest(hoverSel));
    });

    const loop = () => {
      rx = lerp(rx, x, 0.18); ry = lerp(ry, y, 0.18);
      orb.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      tctx.clearRect(0, 0, tw, th);
      if (sparks.length) {
        tctx.globalCompositeOperation = 'lighter';
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx; s.y += s.vy; s.vy += 0.02; s.life -= 0.028;
          if (s.life <= 0) { sparks.splice(i, 1); continue; }
          tctx.globalAlpha = s.life;
          tctx.fillStyle = s.c;
          tctx.shadowColor = s.c;
          tctx.shadowBlur = 8;
          tctx.beginPath();
          tctx.arc(s.x, s.y, s.r * s.life + 0.3, 0, Math.PI * 2);
          tctx.fill();
        }
        tctx.shadowBlur = 0;
        tctx.globalAlpha = 1;
        tctx.globalCompositeOperation = 'source-over';
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────────────
     15. FILTRES DES QUÊTES (projets)
     ───────────────────────────────────────────── */
  const filterBtns = $$('.filter-btn');
  const quests = $$('.quest[data-category]');
  if (filterBtns.length && quests.length) {
    filterBtns.forEach((b) => {
      const f = b.dataset.filter;
      const n = f === 'all' ? quests.length : quests.filter((q) => q.dataset.category.split(' ').includes(f)).length;
      const c = $('.count', b);
      if (c) c.textContent = n;
    });
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
        const f = btn.dataset.filter;
        quests.forEach((q) => {
          const show = f === 'all' || q.dataset.category.split(' ').includes(f);
          if (show) {
            q.classList.remove('is-hidden');
            q.classList.add('visible');
            requestAnimationFrame(() => requestAnimationFrame(() => q.classList.remove('is-filtering')));
          } else {
            q.classList.add('is-filtering');
            setTimeout(() => { if (q.classList.contains('is-filtering')) q.classList.add('is-hidden'); }, 380);
          }
        });
      });
    });
  }

  // Détails dépliables
  $$('.toggle-more').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.closest('.quest');
      const open = q.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      $('span', btn).textContent = open ? 'Refermer' : 'Détails de la quête';
    });
  });

  /* ─────────────────────────────────────────────
     16. COPIER L'E-MAIL
     ───────────────────────────────────────────── */
  $$('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const txt = btn.dataset.copy;
      const label = btn.innerHTML;
      try {
        await navigator.clipboard.writeText(txt);
        btn.classList.add('copied');
        btn.textContent = '✓ Copié !';
      } catch (e) {
        btn.textContent = txt;
      }
      setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = label; }, 2200);
    });
  });

  /* ─────────────────────────────────────────────
     17. SÉLECTEUR DE CV (Stage / Alternance)
     ───────────────────────────────────────────── */
  const cvBtns = $$('.scroll-btn[data-cv]');
  const cvFrame = $('#cvIframe');
  if (cvBtns.length && cvFrame) {
    const CV = {
      stage: {
        file: 'CV_Yanis_Dutilleul_Stage.pdf',
        label: 'Télécharger le CV Stage',
        profil: 'Stage Data / BI — janv. 2027',
        extraK: 'Durée', extraV: '14 à 16 semaines',
        title: 'CV Yanis Dutilleul — version Stage',
      },
      alternance: {
        file: 'CV_Yanis_Dutilleul_Alternance.pdf',
        label: 'Télécharger le CV Alternance',
        profil: 'Alternance Data / BI',
        extraK: 'Formation', extraV: 'BUT 3 Informatique',
        title: 'CV Yanis Dutilleul — version Alternance',
      },
    };
    const set = (type) => {
      const c = CV[type];
      if (!c) return;
      cvBtns.forEach((b) => {
        const on = b.dataset.cv === type;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      cvFrame.style.opacity = '0';
      setTimeout(() => { cvFrame.src = c.file + '#view=FitH&navpanes=0'; cvFrame.title = c.title; cvFrame.style.opacity = '1'; }, 300);
      $$('[data-cv-link]').forEach((a) => { a.href = c.file; });
      const dl = $('#cvDownload');
      if (dl) { dl.setAttribute('download', c.file); $('.lbl', dl).textContent = c.label; }
      const p = $('#cvProfil'); if (p) p.textContent = c.profil;
      const k = $('#cvExtraK'); if (k) k.textContent = c.extraK;
      const v = $('#cvExtraV'); if (v) v.textContent = c.extraV;
    };
    cvBtns.forEach((b) => b.addEventListener('click', () => set(b.dataset.cv)));
    if (location.hash.toLowerCase().includes('alternance')) set('alternance');
  }

  /* ─────────────────────────────────────────────
     18. DIVERS
     ───────────────────────────────────────────── */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
