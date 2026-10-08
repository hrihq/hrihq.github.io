'use strict';
/* ===================== REPO DATA ===================== */
const CAT_RULES = [
  ['Kernel',  n => /kernel|anykernel|sm6150|positron/i.test(n)],
  ['Android', n => /^my-absen$|kasir|absen|presensi|android/i.test(n)],
  ['Web',     () => true]
];
function categorize(r){
  const n = r.name || '';
  for (const [cat, test] of CAT_RULES) if (test(n)) return cat;
  return 'Web';
}
const LANG_COLOR = {
  C:'#555e7a', Shell:'#89e051', JavaScript:'#f1e05a', HTML:'#e34c26',
  Kotlin:'#A97BFF', TypeScript:'#3178c6', CSS:'#563d7c', Python:'#3572A5'
};
function langDot(lang){
  const c = LANG_COLOR[lang] || '#8b93a1';
  return `<span class="lang-dot" style="background:${c}" aria-hidden="true"></span>`;
}
const STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5 9.5 9H2.6l5.6 4.2-2.2 6.8L12 15.8l6 4.2-2.2-6.8L21.4 9h-6.9L12 2.5Z"/></svg>';
const FORK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="20" r="2.4"/><path d="M6 8.4v3.2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8.4M12 13.6V18"/></svg>';

function repoDesc(r){
  const d = (r.description && r.description.trim()) || (r.desc && r.desc.trim());
  if (d) return d;
  const fallback = {
    'hrihq':'Repo profil GitHub — berkas README profil.',
    'my-absen':"My Absen — presensi wajah offline. ML Kit face detection dengan React Native/Expo.",
    'rasa-nusantara':'Proyek web resep dan kuliner Nusantara.'
  };
  return fallback[r.name] || 'Proyek publik di GitHub.';
}
function toRepo(r){
  return {
    name: r.name,
    desc: repoDesc(r),
    lang: r.language || '—',
    stars: r.stargazers_count ?? r.stars ?? 0,
    forks: r.forks_count ?? r.forks ?? 0,
    updated: (r.pushed_at || r.updated || '').slice(0,10),
    url: r.html_url || r.url || ('https://github.com/hrihq/'+r.name),
    cat: categorize(r)
  };
}

let REPOS = FALLBACK_REPOS.map(toRepo);
let activeFilter = 'Semua';

function loadRepos(){
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9000);
  return fetch('https://api.github.com/users/hrihq/repos?per_page=100&sort=updated', {signal: ctrl.signal})
    .then(res => { clearTimeout(t); return res.ok ? res.json() : null; })
    .then(d => {
      if (!Array.isArray(d) || !d.length) return;
      const byName = new Map(FALLBACK_REPOS.map(r => [r.name, r]));
      REPOS = d.map(r => {
        const fb = byName.get(r.name);
        if (fb && (!r.description || !r.description.trim())) r.description = fb.desc;
        return toRepo(r);
      });
    })
    .catch(() => {});
}

/* ===================== RENDER: STATS ===================== */
function renderStats(){
  const el = document.getElementById('stats');
  if (!el) return;
  const data = [
    ['repoPublik', REPOS.length, 'repo publik'],
    ['tahunKernel', 2, 'tahun ngulik kernel'],
    ['rilisKernel', REPOS.filter(r => r.cat==='Kernel').length, 'repo kernel'],
    ['deviceFisik', 1, 'device utama']
  ];
  el.innerHTML = data.map(([id,n,label]) =>
    `<div class="stat"><b data-count="${n}">0</b><span>${label}</span></div>`
  ).join('');
}

/* ===================== RENDER: WORK GRID ===================== */
const ORDER = { Kernel: 0, Android: 1, Web: 2 };
function renderFilters(){
  const el = document.getElementById('filters');
  if (!el) return;
  const cats = ['Semua','Kernel','Android','Web'];
  el.innerHTML = cats.map(c => {
    const n = c === 'Semua' ? REPOS.length : REPOS.filter(r => r.cat === c).length;
    return `<button class="chip" data-f="${c}" aria-pressed="${c===activeFilter}">${c}<span class="n">${n}</span></button>`;
  }).join('');
  el.querySelectorAll('.chip').forEach(ch => {
    ch.addEventListener('click', () => {
      activeFilter = ch.dataset.f;
      el.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.f === activeFilter)));
      renderGrid();
      const c = document.getElementById('count');
      if (c) c.innerHTML = `menampilkan <b>${visible().length}</b> dari ${REPOS.length} repo`;
    });
  });
}
function visible(){
  const list = activeFilter === 'Semua' ? REPOS : REPOS.filter(r => r.cat === activeFilter);
  return list.slice().sort((a,b) => (ORDER[a.cat] - ORDER[b.cat]) || b.updated.localeCompare(a.updated));
}
function cardHTML(r){
  const d = new Date(r.updated + 'T00:00:00Z');
  const ago = isNaN(d) ? r.updated : new Intl.DateTimeFormat('id-ID',{dateStyle:'medium',timeZone:'UTC'}).format(d);
  return `<a class="card" href="${r.url}" target="_blank" rel="noopener" aria-label="${r.name}">
    <span class="tag-cat">${r.cat}</span>
    <div class="card-top">${langDot(r.lang)}<h3>${r.name}</h3></div>
    <p class="desc">${r.desc}</p>
    <div class="card-meta">
      <span>${ago}</span>
      <span class="right">
        <span>${STAR}${r.stars}</span>
        <span>${FORK}${r.forks}</span>
      </span>
    </div>
  </a>`;
}
function renderGrid(){
  const el = document.getElementById('grid');
  if (!el) return;
  const list = visible();
  el.innerHTML = list.length
    ? list.map(cardHTML).join('')
    : `<div class="empty">tidak ada repo di kategori ini.</div>`;
  el.querySelectorAll('.card').forEach(attachTilt);
}
function attachTilt(card){
  if (matchMedia('(pointer: coarse)').matches) return;
  card.addEventListener('pointermove', e => {
    const rx = e.currentTarget.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - rx.left)/rx.width*100)+'%');
    card.style.setProperty('--my', ((e.clientY - rx.top)/rx.height*100)+'%');
  });
  card.addEventListener('pointerleave', () => {
    card.style.removeProperty('--mx'); card.style.removeProperty('--my');
  });
}

/* ===================== RENDER: STACK ===================== */
function renderStack(){
  const el = document.getElementById('stackGrid');
  if (!el) return;
  el.innerHTML = STACK.map(s =>
    `<div class="stack-card">
      <h3>${s.t}</h3>
      <p class="sub">${s.sub}</p>
      <ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`
  ).join('');
}

/* ===================== MARQUEE ===================== */
function renderMarquee(){
  const el = document.getElementById('marq');
  if (!el) return;
  const one = MARQUEE.map(m => `<span>${m}</span>`).join('');
  el.innerHTML = `${one}${one}`;
}

/* ===================== TERMINAL ===================== */
const TERM_LINES = [
  ['pr',  'heri@sweet2'],
  ['dim', ':~$ '],
  ['',    'cat /proc/version'],
  ['dim', '# Linux version 4.14.355-openela'],
  ['',    'make -j$(nproc) O=out ARCH=arm64 CC=clang'],
  ['ok',  'Build complete'],
  ['',    'ls out/arch/arm64/boot/ | grep -i kernel'],
  ['acc', 'Image.gz-dtb  →  AnyKernel3'],
  ['',    'zip -r9 Glade-Kernel-sweet_k6a-$(date +%Y%m%d).zip . -x .git'],
  ['ok',  'Flashable zip ready'],
  ['hl',  'fastboot flash boot boot.img'],
  ['ok',  'OKAY [  0.234s]'],
  ['dim', '# device: Redmi Note 12 Pro 4G (sweet_k6a)'],
  ['',    'git push origin main'],
  ['ok',  'pushed → github.com/hrihq'],
  ['',    '']
];
function renderTerm(){
  const el = document.getElementById('term');
  if (!el) return;
  let li = 0, ci = 0, out = '';
  const TOTAL = TERM_LINES.reduce((n,l) => n + l[1].length, 0);
  let started = false;
  function tick(){
    if (!started){ started = true; el.textContent = ''; }
    if (li >= TERM_LINES.length){
      el.innerHTML = out + '<span class="caret"></span>';
      return;
    }
    const [cls, txt] = TERM_LINES[li];
    ci++;
    if (ci > txt.length){ li++; ci = 0; out += lineHTML(cls, txt) + '\n'; setTimeout(tick, 300); return; }
    el.innerHTML = out + lineHTML(cls, txt.slice(0, ci)) + '<span class="caret"></span>';
    const delay = txt[ci-1] === '\n' ? 260 : (cls === 'dim' ? 8 : 16);
    setTimeout(tick, delay);
  }
  function lineHTML(cls, txt){
    if (!txt) return '';
    const esc = txt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return cls ? `<span class="${cls}">${esc}</span>` : esc;
  }
  setTimeout(tick, 500);
}

/* ===================== COUNT UP ===================== */
function countUp(el, to, dur = 1100){
  const t0 = performance.now();
  function frame(t){
    const p = Math.min((t - t0)/dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1-p, 3)));
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ===================== THEME ===================== */
function initTheme(){
  const btn = document.getElementById('themeBtn');
  const key = 'heri-theme';
  let theme = localStorage.getItem(key);
  if (!theme) theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  if (btn) btn.addEventListener('click', () => {
    theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(key, theme);
  });
}

/* ===================== MISC ===================== */
function initScrollProgress(){
  const p = document.getElementById('prog');
  if (!p) return;
  addEventListener('scroll', () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    p.style.width = max > 0 ? (scrollY/max*100)+'%' : '0%';
  }, {passive: true});
}
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)){ els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold: .12, rootMargin: '0px 0px -8% 0px'});
  els.forEach(e => io.observe(e));
}
function initCounters(){
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const to = +e.target.dataset.count;
      if (to > 0) countUp(e.target, to); else e.target.textContent = '0';
      io.unobserve(e.target);
    });
  }, {threshold: .5});
  els.forEach(e => io.observe(e));
}
function initGlow(){
  const g = document.getElementById('glow');
  if (!g || matchMedia('(pointer: coarse)').matches) return;
  let raf = 0;
  addEventListener('pointermove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      g.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      g.style.opacity = '1';
      raf = 0;
    });
  });
}
function initYr(){
  const y = document.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();
}

/* ===================== BOOT ===================== */
function boot(){
  initTheme();
  initYr();
  renderMarquee();
  renderTerm();
  renderStack();
  renderStats();
  renderFilters();
  renderGrid();
  const c = document.getElementById('count');
  if (c) c.innerHTML = `menampilkan <b>${REPOS.length}</b> dari ${REPOS.length} repo`;
  initScrollProgress();
  initReveal();
  initCounters();
  initGlow();
}
boot();
loadRepos().finally(() => {
  renderStats();
  renderFilters();
  renderGrid();
  const c = document.getElementById('count');
  if (c) c.innerHTML = `menampilkan <b>${visible().length}</b> dari ${REPOS.length} repo`;
});
