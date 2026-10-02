(() => {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, attrs) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (attrs) for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  };
  const svgEl = (tag, attrs) => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pct = (v, of) => (v / of * 100).toFixed(2) + '%';

  /* ------------------------------------------------------------------
   * Themes
   * ------------------------------------------------------------------ */
  const ASSETS = 'assets/';
  const PATTERN_IMG = {
    kikko: ['kikko.svg', 72], kawung: ['kawung.svg', 72], treillage: ['treillage.svg', 60],
    jogakbo: ['jogakbo.svg', 120], fairisle: ['fairisle.svg', 48], coinLattice: ['coin-lattice.svg', 96]
  };
  const stripes = (a, b) => 'repeating-linear-gradient(-45deg, ' + a + ' 0 10px, ' + b + ' 10px 20px)';
  const THEMES = {
    siewlan: { label: 'Siew Lan · white', swatch: '#ffffff', cls: 'hop', cfg: { size: 96, speed: 90, native: -1 },
      c: { body: '#ddeee4', alt: '#add6be', panel: '#fbfdfb', muted: '#3a674d' }, stripes: stripes('#ffffff', '#cfe7d8'),
      pattern: 'radial-gradient(circle, #3b4a42 0 8px, transparent 10px) 0 0 / 40px 40px, radial-gradient(circle, transparent 0 20px, #3b4a42 20px 26px, transparent 28px) 20px 20px / 80px 80px, transparent' },
    cailleach: { label: 'The Cailleach Bheur · black', swatch: '#0f1110', cls: 'flap', cfg: { size: 96, speed: 120, native: 1 }, patternImg: 'fairisle',
      c: { body: '#d3d7d3', alt: '#a4a9a4', panel: '#e9ece9', muted: '#3a403c' }, stripes: stripes('#0f1110', '#4e6152') },
    amaterasu: { label: 'Amaterasu · red', swatch: '#c8312b', cls: 'flap', cfg: { size: 96, speed: 120, native: -1 }, patternImg: 'kikko',
      c: { body: '#f2cdc9', alt: '#e18c86', panel: '#fae9e7', muted: '#743630' }, stripes: stripes('#c8312b', '#f2c9c3') },
    dewisri: { label: 'Dewi Sri · orange', swatch: '#f28c28', cls: 'hop', cfg: { size: 130, speed: 70, native: 1 }, patternImg: 'kawung',
      c: { body: '#fad3ab', alt: '#f5a351', panel: '#fdf0df', muted: '#564b32' }, stripes: stripes('#f28c28', '#fbd9b0') },
    aurore: { label: 'Aurore · yellow', swatch: '#f2c230', cls: 'flap', cfg: { size: 96, speed: 120, native: 1 },
      c: { body: '#fae6aa', alt: '#f4cd53', panel: '#fdf5db', muted: '#605d33' }, stripes: stripes('#f2c230', '#f9e7a6'),
      pattern: 'linear-gradient(135deg, #3b4a42 25%, transparent 25%) -36px 0 / 72px 72px, linear-gradient(225deg, #3b4a42 25%, transparent 25%) -36px 0 / 72px 72px, linear-gradient(315deg, #3b4a42 25%, transparent 25%) 0 0 / 72px 72px, linear-gradient(45deg, #3b4a42 25%, transparent 25%) 0 0 / 72px 72px, transparent' },
    amelie: { label: 'Amélie · green', swatch: '#9cc58a', cls: 'hop', cfg: { size: 96, speed: 90, native: -1 }, patternImg: 'treillage',
      c: { body: '#d4e7cb', alt: '#abcf9b', panel: '#ecf5e7', muted: '#455745' }, stripes: stripes('#9cc58a', '#cfe5c2') },
    hafdis: { label: 'Hafdís · blue', swatch: '#3f78b5', cls: 'hop', cfg: { size: 96, speed: 90, native: -1 },
      c: { body: '#c4d8ec', alt: '#7ea6d2', panel: '#e4eef8', muted: '#344d5b' }, stripes: stripes('#3f78b5', '#bcd5ee'),
      pattern: 'linear-gradient(45deg, #3b4a42 25%, transparent 25%) 0 0 / 56px 56px, linear-gradient(-45deg, #3b4a42 25%, transparent 25%) 0 0 / 56px 56px, transparent' },
    yeonhwa: { label: 'Yeon-hwa · purple', swatch: '#8a5bb8', cls: 'hop', cfg: { size: 96, speed: 90, native: -1 }, patternImg: 'jogakbo',
      c: { body: '#e0d3ef', alt: '#bb9ed9', panel: '#f1eaf9', muted: '#4f4662' }, stripes: stripes('#8a5bb8', '#dccbef') },
    odette: { label: 'Odette · pink', swatch: '#e27aa0', cls: 'hop', cfg: { size: 96, speed: 90, native: 1 },
      c: { body: '#f5cddb', alt: '#e995b3', panel: '#fcedf3', muted: '#53484a' }, stripes: stripes('#e27aa0', '#f8d3e0'),
      pattern: 'radial-gradient(circle at 50% 100%, #3b4a42 0 24px, transparent 26px) 0 0 / 56px 48px, radial-gradient(circle, #3b4a42 0 6.4px, transparent 8px) 28px 12px / 56px 48px, transparent' },
    tevy: { label: 'Tevy · brown', swatch: '#8a5a3b', cls: 'hop', cfg: { size: 130, speed: 70, native: -1 },
      c: { body: '#e5d4c6', alt: '#c3a489', panel: '#f1e7dd', muted: '#584937' }, stripes: stripes('#8a5a3b', '#dcc3ab'),
      pattern: 'linear-gradient(90deg, #3b4a4299 50%, transparent 50%) 0 0 / 64px 64px, linear-gradient(#3b4a4299 50%, transparent 50%) 0 0 / 64px 64px, transparent' },
    longxi: { label: 'Empress Longxi · gold', swatch: '#d4a72c', cls: 'hop', cfg: { size: 130, speed: 70, native: -1 }, patternImg: 'coinLattice',
      c: { body: '#efdca7', alt: '#ddb84f', panel: '#faf2d9', muted: '#505132' }, stripes: stripes('#d4a72c', '#f3dea0') },
    manasa: { label: 'Manasa Devi · silver', swatch: '#b8c0c8', cls: 'hop', cfg: { size: 96, speed: 90, native: 1 },
      c: { body: '#e3e6e9', alt: '#c5ccd2', panel: '#f4f5f7', muted: '#525c65' }, stripes: stripes('#b8c0c8', '#e3e7ea'),
      pattern: 'radial-gradient(circle at 50% 100%, transparent 0 20px, #3b4a42 22px 28px, transparent 30px) 0 0 / 56px 40px, radial-gradient(circle at 50% 100%, transparent 0 20px, #3b4a42 22px 28px, transparent 30px) 28px 20px / 56px 40px, transparent' },
    boba: { label: 'boba tea', swatch: '#e9d5c3', special: true,
      c: { body: '#f2e6db', alt: '#c9a585', panel: '#fcf7f2', muted: '#6a4430', bar: '#2b1d17', barGrid: '#3f2c23' }, stripes: stripes('#2b1d17', '#c9a585') }
  };
  for (const id in THEMES) {
    const th = THEMES[id];
    th.flower = th.special ? null : ASSETS + 'flowers/' + id + '.png';
    th.animal = th.special ? null : ASSETS + 'animals/' + id + '.png';
  }
  const DEFAULT_THEME = 'amelie';
  const darken = (hex, k) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');

  let themeId = THEMES[store.get('theme')] && !THEMES[store.get('theme')].special ? store.get('theme') : DEFAULT_THEME;
  const pal = () => THEMES[themeId];

  /* ------------------------------------------------------------------
   * Scenery builders
   * ------------------------------------------------------------------ */
  const W0 = 1440, H0 = 900; // the design's reference canvas

  function buildStars() {
    const box = $('#stars');
    for (let i = 0; i < 40; i++) {
      const size = 7 + (i * 7) % 9;
      const s = svgEl('svg', { class: 'star', viewBox: '0 0 12 12', width: size, height: size });
      s.style.left = pct((i * 197 + 53) % 1420, W0);
      s.style.top = pct(((i * 131 + 29) % 560) + 10, H0);
      s.style.animationDuration = (2.2 + (i % 5) * 0.7) + 's';
      s.style.animationDelay = (-(i % 7) * 0.6) + 's';
      s.appendChild(svgEl('path', { d: 'M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z', fill: '#fff3cf', stroke: '#2f3b34', 'stroke-width': '0.6' }));
      box.appendChild(s);
    }
  }

  const CLOUDS = [
    { top: 250, w: 200, dur: 90, delay: -20 }, { top: 120, w: 150, dur: 120, delay: -75 },
    { top: 470, w: 240, dur: 150, delay: -100 }, { top: 370, w: 120, dur: 105, delay: -40 },
    { top: 60, w: 210, dur: 110, delay: -60 }, { top: 180, w: 170, dur: 95, delay: -10 }
  ];
  const cloudEls = [];
  function buildClouds() {
    const box = $('#clouds');
    CLOUDS.forEach((c) => {
      const s = svgEl('svg', { class: 'cloud', viewBox: '0 0 200 90', width: c.w, height: Math.round(c.w * 0.45) });
      s.style.top = pct(c.top, H0);
      s.style.animationDuration = c.dur + 's';
      s.style.animationDelay = c.delay + 's';
      s.appendChild(svgEl('path', { d: 'M40 82 H165 A25 25 0 0 0 160 34 A38 38 0 0 0 88 24 A30 30 0 0 0 40 47 A18 18 0 0 0 40 82 Z' }));
      box.appendChild(s);
      cloudEls.push(s);
    });
  }

  function buildRain() {
    const box = $('#rain');
    for (let i = 0; i < 60; i++) {
      const d = el('div', 'drop');
      d.style.left = pct((i * 89 + 17) % 1500, W0);
      d.style.height = (16 + (i * 7) % 18) + 'px';
      d.style.animationDuration = (0.7 + (i % 5) * 0.12).toFixed(2) + 's';
      d.style.animationDelay = (-((i * 0.137) % 1.2)).toFixed(2) + 's';
      box.appendChild(d);
    }
    box.appendChild(el('div', 'flash'));
  }

  const FLOWER_SIZES = [22, 48, 30, 60, 26, 40, 54, 20, 36, 58, 28, 44, 32, 50];
  const FLOWER_FALLS = [11, 24, 15, 30, 9, 19, 27, 13, 22, 33, 10, 17, 25, 14];
  const flowerImgs = [];
  function buildFlowers() {
    const box = $('#flowers');
    for (let i = 0; i < 14; i++) {
      const f = el('span', 'flower');
      f.style.left = pct(6 + i * 102 + (i * 37) % 40, W0);
      f.style.width = f.style.height = FLOWER_SIZES[i] + 'px';
      f.style.animationDuration = FLOWER_FALLS[i] + 's';
      f.style.animationDelay = (-((i * 7.3) % FLOWER_FALLS[i])).toFixed(1) + 's';
      const spin = el('span');
      spin.style.animationDuration = (17 + (i * 5) % 12) + 's';
      const img = el('img', '', { alt: '', decoding: 'async' });
      spin.appendChild(img);
      f.appendChild(spin);
      box.appendChild(f);
      flowerImgs.push(img);
    }
  }

  function wavePath(segments) {
    let d = 'M0 32';
    for (let k = 0; k < segments; k++) d += ' Q' + (k * 240 + 120) + ' ' + (k % 2 ? 60 : 4) + ' ' + ((k + 1) * 240) + ' 32';
    return d + ' V64 H0 Z';
  }
  const WAVE = wavePath(14);
  function waveSvg(fill, cls) {
    const s = svgEl('svg', { class: 'wave' + (cls ? ' ' + cls : ''), viewBox: '0 0 3360 64', preserveAspectRatio: 'none' });
    s.appendChild(svgEl('path', { d: WAVE, fill }));
    return s;
  }

  function buildBobaScene() {
    const box = $('#bobaScene');
    box.textContent = '';
    for (let i = 0; i < 28; i++) {
      const p = el('span', 'tiny-pearl');
      const size = 8 + (i * 5) % 7;
      p.style.left = pct(10 + i * 51 + (i * 23) % 30, W0);
      p.style.width = p.style.height = size + 'px';
      p.style.animationDuration = (9 + (i * 7) % 9) + 's';
      p.style.animationDelay = (-((i * 1.7) % 16)).toFixed(1) + 's';
      box.appendChild(p);
    }
    const fill = el('div', 'fill-up');
    [['#e3c9b0', 'slosh-a'], ['#fbf3e6', 'slosh-b']].forEach(([color]) => {
      const swell = el('div', 'swell');
      const w = waveSvg(color);
      swell.appendChild(w);
      const body = el('div');
      body.style.backgroundColor = color;
      swell.appendChild(body);
      fill.appendChild(swell);
    });
    fill.children[0].querySelector('.wave').style.animation = 'slosh 3.4s linear infinite reverse';
    fill.children[1].querySelector('.wave').style.animation = 'slosh 2.4s linear infinite';
    box.appendChild(fill);
  }

  /* ------------------------------------------------------------------
   * Theme application
   * ------------------------------------------------------------------ */
  const swatchBtns = {};
  function buildSwatches() {
    const box = $('#swatches');
    Object.keys(THEMES).filter((id) => !THEMES[id].special).forEach((id) => {
      const th = THEMES[id];
      const b = el('button', 'btn swatch', { type: 'button', 'aria-label': th.label + ' theme', title: th.label, 'aria-pressed': 'false' });
      const dot = el('span');
      dot.style.backgroundColor = th.swatch;
      b.appendChild(dot);
      b.addEventListener('click', () => {
        if (id === themeId) return;
        cancelMilk();
        bobaReturn = null;
        setTheme(id, true);
        store.set('theme', id);
      });
      box.appendChild(b);
      swatchBtns[id] = b;
    });
  }

  function setPattern(th, animate) {
    const box = $('#patterns');
    const old = Array.from(box.children);
    const layer = el('div', animate ? 'pattern-in' : '');
    const bg = el('div');
    bg.style.background = th.pattern || 'transparent';
    layer.appendChild(bg);
    if (th.patternImg) {
      const [file, size] = PATTERN_IMG[th.patternImg];
      const img = el('div');
      img.style.backgroundImage = 'url(' + ASSETS + 'patterns/' + file + ')';
      img.style.backgroundSize = size + 'px auto';
      img.style.backgroundRepeat = 'repeat';
      layer.appendChild(img);
    }
    box.appendChild(layer);
    old.forEach((o) => {
      if (!animate) { o.remove(); return; }
      o.className = 'pattern-out';
      setTimeout(() => o.remove(), 850);
    });
  }

  function setFlowers(th) {
    $('#flowers').hidden = !th.flower;
    if (!th.flower) return;
    flowerImgs.forEach((img) => {
      if (!img.getAttribute('src')) { img.src = th.flower; return; }
      img.classList.add('swap');
      setTimeout(() => { img.src = th.flower; img.classList.remove('swap'); }, 400);
    });
  }

  function setTheme(id, animate) {
    themeId = id;
    const th = THEMES[id];
    const root = document.documentElement.style;
    root.setProperty('--body', th.c.body);
    root.setProperty('--alt', th.c.alt);
    root.setProperty('--panel', th.c.panel);
    root.setProperty('--muted', th.c.muted);
    root.setProperty('--bar', th.c.bar || '#3b4a42');
    root.setProperty('--bar-grid', th.c.barGrid || '#4e6152');
    root.setProperty('--ground', darken(th.c.body, 0.92));
    root.setProperty('--stripes', th.stripes);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', darken(th.c.body, 0.92));

    setPattern(th, animate);
    setFlowers(th);
    critters.retheme(th);

    for (const k in swatchBtns) swatchBtns[k].setAttribute('aria-pressed', String(k === id));
    $('#themeName').textContent = th.label;
    $('#surprise').setAttribute('aria-pressed', String(id === 'boba'));

    const boba = $('#bobaScene');
    if (id === 'boba') {
      if (boba.hidden) { buildBobaScene(); boba.hidden = false; }
    } else {
      boba.hidden = true;
      boba.textContent = '';
    }
    updateSky();
  }

  /* ------------------------------------------------------------------
   * Wandering animals (one follows the pointer)
   * ------------------------------------------------------------------ */
  const critters = (() => {
    const box = $('#critters');
    const rand = (a, b) => a + Math.random() * (b - a);
    let list = [];
    let mouse = null;
    let prev = performance.now();
    let nextSpawn = 0;
    let cur = null;

    function makeEl(a) {
      const wrap = el('div', 'critter');
      const img = el('img', cur.cls, { alt: '', src: cur.animal, decoding: 'async' });
      wrap.style.width = wrap.style.height = Math.round(a.s) + 'px';
      wrap.appendChild(img);
      box.appendChild(wrap);
      a.el = wrap;
      a.img = img;
    }

    function spawn(follower) {
      const W = window.innerWidth, H = window.innerHeight;
      const s = follower ? 120 : rand(50, 120);
      const fromLeft = Math.random() < 0.5;
      const sp = follower ? cur.cfg.speed * 1.2 : rand(40, 190) * Math.pow(85 / s, 0.3);
      const a = {
        follower: !!follower, s, sp,
        x: fromLeft ? -s - 10 : W + 10,
        y: follower ? rand(H * 0.22, H * 0.67) : rand(60, Math.max(80, H - s - 20)),
        vx: fromLeft ? sp : -sp, vy: 0, face: fromLeft ? 1 : -1, bob: Math.random() * 6.28
      };
      makeEl(a);
      list.push(a);
    }

    function tick(now) {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (cur) {
        const W = window.innerWidth, H = window.innerHeight;
        if (!list.some((a) => a.follower)) spawn(true);
        if (list.length < 10 && now > nextSpawn) { spawn(false); nextSpawn = now + rand(900, 2600); }
        const keep = [];
        for (const a of list) {
          if (a.follower) {
            if (mouse) {
              const dx = mouse.x + 24 - a.x, dy = mouse.y + 18 - a.y, d = Math.hypot(dx, dy);
              const sp = Math.min(a.sp * 2.2, d * 3);
              a.vx = d > 1 ? dx / d * sp : 0;
              a.vy = d > 1 ? dy / d * sp : 0;
              const fx = mouse.x - (a.x + a.s / 2);
              if (Math.abs(fx) > 8) a.face = fx > 0 ? 1 : -1;
            } else {
              if (Math.hypot(a.vx, a.vy) < a.sp * 0.5) { const ang = Math.random() * Math.PI * 2; a.vx = Math.cos(ang) * a.sp; a.vy = Math.sin(ang) * a.sp; }
              if (a.x < 0 && a.vx < 0) a.vx = -a.vx;
              if (a.x > W - a.s && a.vx > 0) a.vx = -a.vx;
              if (a.y < 0 && a.vy < 0) a.vy = -a.vy;
              if (a.y > H - a.s && a.vy > 0) a.vy = -a.vy;
              if (Math.abs(a.vx) > 4) a.face = a.vx >= 0 ? 1 : -1;
            }
            a.x += a.vx * dt;
            a.y += a.vy * dt;
            keep.push(a);
          } else {
            a.bob += dt * 3;
            a.x += a.vx * dt;
            a.y += Math.sin(a.bob) * 0.3;
            if (a.x > -a.s - 40 && a.x < W + 40) keep.push(a); else a.el.remove();
          }
        }
        list = keep;
        for (const a of list) {
          a.el.style.transform = 'translate(' + a.x.toFixed(1) + 'px, ' + a.y.toFixed(1) + 'px) scaleX(' + (a.face * cur.cfg.native) + ')';
        }
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
    document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) mouse = null; });

    return {
      start() { if (!reduceMotion) requestAnimationFrame(tick); },
      retheme(th) {
        if (!th.animal) {
          cur = null;
          list.forEach((a) => a.el.remove());
          list = [];
          return;
        }
        cur = th;
        list.forEach((a) => { a.img.src = th.animal; a.img.className = th.cls; });
      },
      current: () => cur
    };
  })();

  /* ------------------------------------------------------------------
   * Cities, clock, sky and weather
   * ------------------------------------------------------------------ */
  const CITIES = {
    paris: { host: 'paris.local', tz: 'Europe/Paris', lat: 48.8566, lon: 2.3522 },
    'phnom-penh': { host: 'phnom_penh.local', tz: 'Asia/Phnom_Penh', lat: 11.5564, lon: 104.9282 }
  };
  let cityId = CITIES[store.get('city')] ? store.get('city') : 'paris';
  const weather = {}; // cityId -> { temp, cond, rainy, at }

  function sunTimes(date, lat, lon) {
    const rad = Math.PI / 180, dayMs = 86400000, J1970 = 2440588, J2000 = 2451545;
    const d = date.valueOf() / dayMs - 0.5 + J1970 - J2000;
    const lw = rad * -lon, phi = rad * lat;
    const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
    const ds = 0.0009 + lw / (2 * Math.PI) + n;
    const M = rad * (357.5291 + 0.98560028 * ds);
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const L = M + C + rad * 102.9372 + Math.PI;
    const dec = Math.asin(Math.sin(rad * 23.4397) * Math.sin(L));
    const Jnoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    const w = Math.acos((Math.sin(-0.833 * rad) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
    const a = 0.0009 + (w + lw) / (2 * Math.PI) + n;
    const Jset = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    const Jrise = Jnoon - (Jset - Jnoon);
    const toDate = (j) => new Date((j + 0.5 - J1970) * dayMs);
    return { rise: toDate(Jrise), set: toDate(Jset) };
  }

  function localMinutes(date, tz) {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(date);
      const h = Number(parts.find((x) => x.type === 'hour').value) % 24;
      const m = Number(parts.find((x) => x.type === 'minute').value);
      return h * 60 + m;
    } catch (e) { return date.getHours() * 60 + date.getMinutes(); }
  }
  const fmtM = (x) => String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');

  function updateSky() {
    const city = CITIES[cityId];
    const now = new Date();
    try {
      $('#time').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: city.tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
      $('#date').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: city.tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now);
    } catch (e) { /* very old browser: leave placeholders */ }

    const times = sunTimes(now, city.lat, city.lon);
    const riseM = localMinutes(times.rise, city.tz), setM = localMinutes(times.set, city.tz);
    const m = localMinutes(now, city.tz);
    const isDay = m >= riseM && m < setM;
    const dayLen = setM - riseM, nightLen = 1440 - dayLen;
    let into, left, prog;
    if (isDay) { into = m - riseM; left = setM - m; prog = into / dayLen; }
    else { into = m >= setM ? m - setM : m + 1440 - setM; left = nightLen - into; prog = into / nightLen; }
    const edge = Math.min(into, left);
    const twilight = Math.max(0, 1 - edge / 50);
    const deep = isDay ? 0 : Math.min(1, edge / 60);

    const W = window.innerWidth, H = window.innerHeight;
    const wide = W >= 900;
    const body = $('#skyBody');
    body.style.left = (prog < 0.5 ? (wide ? W - 210 : W - 115) : (wide ? 110 : 15)) + 'px';
    body.style.top = Math.round(H * (prog < 0.5 ? 0.8 - prog / 0.5 * 0.556 : 0.244 + (prog - 0.5) / 0.5 * 0.556)) + 'px';
    $('#sun').toggleAttribute('hidden', !isDay);
    $('#moon').toggleAttribute('hidden', isDay);
    document.documentElement.style.setProperty('--sun', twilight > 0.3 ? '#f2a65a' : '#f2d27a');

    const tint = $('#skyTint');
    tint.style.backgroundColor = isDay ? '#f28c5a' : (twilight > 0.5 ? '#c96a5a' : '#1b2550');
    tint.style.opacity = isDay ? (twilight * 0.28).toFixed(2) : (0.22 + deep * 0.38).toFixed(2);
    $('#skyDim').style.opacity = (deep * 0.28).toFixed(2);
    const stars = $('#stars');
    stars.hidden = isDay;
    stars.style.opacity = (0.3 + deep * 0.7).toFixed(2);

    $('#sunLine').textContent = isDay
      ? 'sunrise ' + fmtM(riseM) + ' · sunset ' + fmtM(setM)
      : 'moonrise ' + fmtM(setM) + ' · moonset ' + fmtM(riseM);

    const wx = weather[cityId];
    const rainy = !!(wx && wx.rainy);
    $('#rain').hidden = !rainy;
    cloudEls.forEach((c, i) => {
      c.style.display = i < (rainy ? 6 : 4) ? '' : 'none';
      c.style.opacity = isDay ? 1 : 0.8;
    });
    document.documentElement.style.setProperty('--cloud-fill', rainy ? (isDay ? '#aeb8b4' : '#5d6863') : (isDay ? THEMES[themeId].c.panel : '#8b9590'));
    $('#wxRain').toggleAttribute('hidden', !rainy);
    $('#wxDay').toggleAttribute('hidden', rainy || !isDay);
    $('#wxNight').toggleAttribute('hidden', rainy || isDay);
  }

  // WMO weather interpretation codes, as returned by Open-Meteo
  function describe(code) {
    if (code === 0) return ['Clear sky', false];
    if (code === 1) return ['Mostly clear', false];
    if (code === 2) return ['Partly cloudy', false];
    if (code === 3) return ['Overcast', false];
    if (code === 45 || code === 48) return ['Foggy', false];
    if (code >= 51 && code <= 57) return ['Drizzle', true];
    if (code >= 61 && code <= 67) return ['Rain', true];
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return ['Snow', false];
    if (code >= 80 && code <= 82) return ['Rain showers', true];
    if (code >= 95) return ['Thunderstorms', true];
    return ['—', false];
  }

  function renderWeather() {
    const wx = weather[cityId];
    $('#temp').textContent = wx ? wx.temp : '--°';
    $('#cond').textContent = wx ? wx.cond : ' ';
    updateSky();
  }

  function loadWeather(id) {
    const cached = weather[id];
    if (cached && Date.now() - cached.at < 15 * 60 * 1000) return;
    const c = CITIES[id];
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + c.lat + '&longitude=' + c.lon + '&current=temperature_2m,weather_code&timezone=auto';
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        const [cond, rainy] = describe(data.current.weather_code);
        weather[id] = { temp: Math.round(data.current.temperature_2m) + '°', cond, rainy, at: Date.now() };
        if (id === cityId) renderWeather();
      })
      .catch(() => { /* offline or blocked: keep the placeholder */ });
  }

  function setCity(id) {
    cityId = id;
    store.set('city', id);
    document.querySelectorAll('.seg').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.city === id)));
    $('#cityHost').textContent = CITIES[id].host;
    $('#cityKhmer').hidden = id !== 'phnom-penh';
    renderWeather();
    loadWeather(id);
  }

  /* ------------------------------------------------------------------
   * "surprise me": milk tea pour, 20 s of boba, then back
   * ------------------------------------------------------------------ */
  let milkTimers = [];
  let bobaReturn = null;
  const milkLayer = $('#milkLayer');

  function showMilk() {
    milkLayer.textContent = '';
    const milk = el('div', 'milk');
    milk.appendChild(waveSvg('#fbf3e6'));
    milkLayer.appendChild(milk);
    for (let i = 0; i < 30; i++) {
      const p = el('div', 'milk-pearl');
      const size = 26 + (i * 11) % 18;
      p.style.left = pct((i * 173 + 41) % 1400, W0);
      p.style.width = p.style.height = size + 'px';
      p.style.animationName = i % 2 ? 'pearlA' : 'pearlB';
      p.style.animationDuration = (1.8 + (i % 5) * 0.25) + 's';
      p.style.animationDelay = (0.1 + (i * 0.13) % 1.3).toFixed(2) + 's';
      milkLayer.appendChild(p);
    }
    milkLayer.hidden = false;
  }
  function hideMilk() { milkLayer.hidden = true; milkLayer.textContent = ''; }
  function cancelMilk() { milkTimers.forEach(clearTimeout); milkTimers = []; hideMilk(); }

  function pourBoba() {
    cancelMilk();
    const back = themeId === 'boba' ? (bobaReturn || DEFAULT_THEME) : themeId;
    bobaReturn = back;
    if (reduceMotion) {
      setTheme('boba', true);
      milkTimers = [setTimeout(() => setTheme(back, true), 20000)];
      return;
    }
    milkTimers = [
      setTimeout(showMilk, 30),
      setTimeout(() => setTheme('boba', false), 1550),
      setTimeout(hideMilk, 3450),
      setTimeout(showMilk, 20000),
      setTimeout(() => setTheme(back, false), 21550),
      setTimeout(hideMilk, 23450)
    ];
  }

  /* ------------------------------------------------------------------
   * App tiles: a little burst of flowers and animals on hover
   * ------------------------------------------------------------------ */
  function burst(tile) {
    if (reduceMotion) return;
    const old = tile.querySelector('.burst-wrap');
    if (old) old.remove();
    const th = THEMES[themeId];
    const wrap = el('span', 'burst-wrap', { 'aria-hidden': 'true' });
    for (let k = 0; k < 12; k++) {
      const isAnimal = k % 2 === 1 && !!th.animal;
      const src = isAnimal ? th.animal : th.flower;
      const sz = isAnimal ? 30 + (k * 5) % 12 : 20 + (k * 7) % 14;
      const bit = el('span');
      bit.style.width = bit.style.height = sz + 'px';
      bit.style.left = bit.style.top = (-sz / 2) + 'px';
      bit.style.animation = 'burst' + k + ' .95s cubic-bezier(.2,.7,.3,1) both';
      bit.appendChild(src ? el('img', '', { src, alt: '' }) : el('span', 'pearl'));
      wrap.appendChild(bit);
    }
    tile.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1000);
  }

  /* ------------------------------------------------------------------
   * Music player (visual only)
   * ------------------------------------------------------------------ */
  const TRACKS = [
    { title: '[Track title 1]', artist: '[Artist]', dur: 204 },
    { title: '[Track title 2]', artist: '[Artist]', dur: 178 },
    { title: '[Track title 3]', artist: '[Artist]', dur: 245 }
  ];
  let track = 0, pos = 0;
  const fmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  function renderTrack() {
    const t = TRACKS[track];
    $('#trackTitle').textContent = t.title;
    $('#trackArtist').textContent = t.artist;
    $('#elapsed').textContent = fmt(pos);
    $('#duration').textContent = fmt(t.dur);
    $('#barFill').style.width = (pos / t.dur * 100).toFixed(1) + '%';
  }
  function stepTrack() {
    pos += 1;
    if (pos >= TRACKS[track].dur) { track = (track + 1) % TRACKS.length; pos = 0; }
    renderTrack();
  }

  /* ------------------------------------------------------------------
   * Boot
   * ------------------------------------------------------------------ */
  buildStars();
  buildClouds();
  buildRain();
  buildFlowers();
  buildSwatches();
  critters.start();
  setTheme(themeId, false);
  setCity(cityId);
  renderTrack();

  document.querySelectorAll('.seg').forEach((b) => b.addEventListener('click', () => setCity(b.dataset.city)));
  $('#surprise').addEventListener('click', pourBoba);
  document.querySelectorAll('.tile').forEach((t) => {
    t.addEventListener('mouseenter', () => burst(t));
    t.addEventListener('focus', () => burst(t));
  });

  setInterval(() => { updateSky(); stepTrack(); }, 1000);
  setInterval(() => loadWeather(cityId), 15 * 60 * 1000);
  window.addEventListener('resize', updateSky);
})();
