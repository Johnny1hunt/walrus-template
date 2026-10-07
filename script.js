/* ==========================================================
   WALRUS LANDING TEMPLATE — script.js
   Sections: 1 Load + nav  2 Hero network canvas  3 Mascot tilt
             4 Resilience demo  5 Terminal  6 Counters  7 Copy
   ========================================================== */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);

/* ---------- 1. Load sequence + nav ---------- */
window.addEventListener('load', () => requestAnimationFrame(() => document.body.classList.add('is-loaded')));
// Safety net in case the load event is slow
setTimeout(() => document.body.classList.add('is-loaded'), 1800);

const nav = $('#nav');
const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- 2. Hero network canvas ---------- */
(function heroNetwork() {
  const canvas = $('#net');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, nodes = [], packets = [], raf, visible = true;

  const ICE = '151,240,229';

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(70, Math.max(26, (w * h) / 22000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
      r: Math.random() * 1.6 + .8
    }));
    packets = [];
  }

  function spawnPacket() {
    const a = nodes[(Math.random() * nodes.length) | 0];
    let best = null, bd = 1e9;
    for (const b of nodes) {
      if (b === a) continue;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 170 && d > 40 && Math.random() < .35 && d < bd) { best = b; bd = d; }
    }
    if (best) packets.push({ a, b: best, t: 0, s: .008 + Math.random() * .01 });
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 150) {
          ctx.strokeStyle = `rgba(${ICE},${(1 - d / 150) * .22})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = `rgba(${ICE},.55)`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.283); ctx.fill();
    }
    if (Math.random() < .08 && packets.length < 12) spawnPacket();
    packets = packets.filter(p => p.t < 1);
    for (const p of packets) {
      p.t += p.s;
      const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 12);
      g.addColorStop(0, `rgba(${ICE},.95)`); g.addColorStop(1, `rgba(${ICE},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 12, 0, 6.283); ctx.fill();
    }
    if (visible && !reduceMotion) raf = requestAnimationFrame(frame);
  }

  resize(); frame();
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduceMotion) frame(); }, 150); });
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !reduceMotion) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
  }).observe(canvas);
})();

/* ---------- 3. Mascot tilt (follows the pointer, desktop only) ---------- */
(function tilt() {
  const art = $('.hero__art'), img = $('#walrus');
  if (!art || !img || reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
  let tx = 0, ty = 0, cx = 0, cy = 0, active = false;
  window.addEventListener('pointermove', e => {
    tx = (e.clientX / innerWidth - .5) * 2;
    ty = (e.clientY / innerHeight - .5) * 2;
    if (!active) { active = true; loop(); }
  });
  function loop() {
    cx += (tx - cx) * .07; cy += (ty - cy) * .07;
    if (document.body.classList.contains('is-loaded') && getComputedStyle(img).opacity > .95) {
      img.style.transition = 'none';
      img.style.transform = `translate(${cx * 12}px, ${cy * 8}px) rotate(${cx * 1.6}deg)`;
    }
    requestAnimationFrame(loop);
  }
})();

/* ---------- 4. Resilience demo ---------- */
(function demo() {
  const svg = $('#d-svg');
  if (!svg) return;

  const N = 16;                       // nodes in the simplified model
  const NEED = Math.ceil(N / 3);      // rebuild threshold: 1/3 of nodes
  const NS = 'http://www.w3.org/2000/svg';
  const C = 300, R = 228;

  const el = (name, attrs = {}, parent) => {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };

  const linkG = el('g', {}, svg);
  const nodeG = el('g', {}, svg);
  const fileG = el('g', { class: 'd-file' }, svg);
  el('rect', { x: C - 46, y: C - 56, width: 92, height: 112, rx: 14 }, fileG);
  el('path', { class: 'd-file-fold', d: `M${C + 20} ${C - 56} v26 a4 4 0 0 0 4 4 h22` }, fileG);
  const fileLabel = el('text', { x: C, y: C + 6 }, fileG);
  fileLabel.textContent = 'file.png';
  const fileSub = el('text', { x: C, y: C + 28 }, fileG);
  fileSub.textContent = 'whole';
  fileSub.style.fontSize = '11px';
  fileSub.style.opacity = '.6';

  const state = { stored: false, off: new Set() };
  const nodes = [], links = [];

  for (let i = 0; i < N; i++) {
    const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
    const x = C + Math.cos(ang) * R, y = C + Math.sin(ang) * R;

    const link = el('line', { class: 'd-link', x1: C, y1: C, x2: x, y2: y }, linkG);
    links.push(link);

    const g = el('g', { class: 'd-node', tabindex: 0, role: 'button', 'aria-pressed': 'false', 'aria-label': `Node ${i + 1}, online` }, nodeG);
    el('rect', { x: x - 20, y: y - 20, width: 40, height: 40, rx: 10, transform: `rotate(45 ${x} ${y})` }, g);
    el('path', { class: 'd-glyph', d: `M${x} ${y - 7} L${x + 7} ${y} L${x} ${y + 7} L${x - 7} ${y} Z` }, g);
    g.addEventListener('click', () => toggle(i));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } });
    nodes.push(g);
  }

  const bStore = $('#d-store'), bKill = $('#d-kill'), bReset = $('#d-reset');
  const fill = $('#d-fill'), needMark = $('#d-need'), meter = $('.meter');
  const status = $('#d-status'), onlineEl = $('#d-online'), neededEl = $('#d-needed');
  $('#d-total').textContent = N;
  neededEl.textContent = NEED;
  needMark.style.left = (NEED / N * 100) + '%';

  function render() {
    const online = N - state.off.size;
    onlineEl.textContent = online;
    fill.style.width = (online / N * 100) + '%';

    nodes.forEach((g, i) => {
      const off = state.off.has(i);
      g.classList.toggle('is-off', off);
      g.classList.toggle('has-data', state.stored && !off);
      g.setAttribute('aria-pressed', String(off));
      g.setAttribute('aria-label', `Node ${i + 1}, ${off ? 'offline' : 'online'}`);
      links[i].classList.toggle('is-off', state.stored && off);
    });

    if (!state.stored) {
      fileG.classList.remove('ok', 'lost');
      fileSub.textContent = 'whole';
      meter.classList.remove('is-lost');
      status.className = 'demo__status';
      status.textContent = 'Press “Store file” to split it across 16 nodes.';
      return;
    }
    const ok = online >= NEED;
    fileG.classList.toggle('ok', ok);
    fileG.classList.toggle('lost', !ok);
    meter.classList.toggle('is-lost', !ok);
    fileSub.textContent = ok ? 'rebuilt' : 'lost';
    status.className = 'demo__status ' + (ok ? 'ok' : 'lost');
    status.textContent = ok
      ? (state.off.size === 0
          ? 'Stored. Every node holds a piece. Now try knocking some out.'
          : `${state.off.size} offline. Your file is still safe and can be rebuilt.`)
      : `${state.off.size} offline. Too few pieces left to rebuild the file.`;
  }

  function store() {
    if (state.stored) return;
    state.stored = true;
    links.forEach((l, i) => {
      l.classList.add('is-live');
      l.style.animationDelay = (i * 45) + 'ms';
      setTimeout(() => l.classList.add('is-settled'), 1400 + i * 45);
    });
    nodes.forEach((g, i) => setTimeout(() => {
      g.classList.add('is-pop');
      setTimeout(() => g.classList.remove('is-pop'), 520);
    }, 500 + i * 45));
    bStore.disabled = true; bKill.disabled = false;
    render();
  }

  function toggle(i) {
    if (!state.stored) store();
    state.off.has(i) ? state.off.delete(i) : state.off.add(i);
    render();
  }

  function kill() {
    const alive = [...Array(N).keys()].filter(i => !state.off.has(i));
    for (let k = 0; k < 4 && alive.length; k++) state.off.add(alive.splice((Math.random() * alive.length) | 0, 1)[0]);
    render();
  }

  function reset() {
    state.stored = false; state.off.clear();
    links.forEach(l => { l.classList.remove('is-live', 'is-settled', 'is-off'); l.style.animationDelay = ''; });
    bStore.disabled = false; bKill.disabled = true;
    render();
  }

  bStore.addEventListener('click', store);
  bKill.addEventListener('click', kill);
  bReset.addEventListener('click', reset);
  render();
})();

/* ---------- 5. Terminal ---------- */
(function terminal() {
  const body = $('#term-body'), replay = $('#term-replay'), term = $('#term');
  if (!body) return;

  // Example session. Edit the lines below to change what the terminal shows.
  const script = [
    { t: '<span class="t-prompt">$</span> <span class="t-cmd">walrus store hero.png --epochs 5</span>', typed: true },
    { t: '<span class="t-dim">Encoding blob into slivers…</span>', d: 700 },
    { t: '<span class="t-dim">Sending slivers to storage nodes…</span>', d: 800 },
    { t: '<span class="t-ok">✓</span> Certified on Sui', d: 700 },
    { t: '<span class="t-key">Blob ID</span>    <span class="t-dim">&lt;your-blob-id&gt;</span>', d: 200 },
    { t: '<span class="t-key">Stored for</span> 5 epochs', d: 150 },
    { t: '', d: 300 },
    { t: '<span class="t-prompt">$</span> <span class="t-cmd">walrus read &lt;your-blob-id&gt; --out copy.png</span>', typed: true, d: 400 },
    { t: '<span class="t-ok">✓</span> Rebuilt from healthy nodes', d: 800 },
    { t: '<span class="t-prompt">$</span> <span class="t-cursor"></span>', d: 300 }
  ];

  const strip = s => s.replace(/<[^>]+>/g, '');
  let run = 0;

  async function play() {
    const id = ++run;
    body.innerHTML = '';
    for (const line of script) {
      if (id !== run) return;
      await new Promise(r => setTimeout(r, reduceMotion ? 0 : (line.d || 200)));
      if (line.typed && !reduceMotion) {
        // type the visible text, then swap in the colored markup
        const plain = strip(line.t);
        const row = document.createElement('div');
        body.appendChild(row);
        for (let i = 1; i <= plain.length; i++) {
          if (id !== run) return;
          row.textContent = plain.slice(0, i);
          await new Promise(r => setTimeout(r, 22));
        }
        row.innerHTML = line.t;
      } else {
        const row = document.createElement('div');
        row.innerHTML = line.t || '&nbsp;';
        body.appendChild(row);
      }
    }
  }

  let started = false;
  new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { started = true; play(); } }, { threshold: .35 }).observe(term);
  replay.addEventListener('click', play);
})();

/* ---------- 6. Counters ---------- */
(function counters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const run = el => {
    const end = +el.dataset.count;
    if (reduceMotion) { el.textContent = end.toLocaleString('en-US'); return; }
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: .6 });
  els.forEach(el => io.observe(el));
})();

/* ---------- 7. Copy command ---------- */
(function copy() {
  const btn = $('#cmd-copy'), label = $('#cmd-label'), text = $('#cmd-text');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(text.textContent); label.textContent = 'Copied'; }
    catch { label.textContent = 'Press Ctrl+C'; }
    setTimeout(() => (label.textContent = 'Copy'), 1800);
  });
})();
