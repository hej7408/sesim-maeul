/* 세심마을 core: DOM 헬퍼, 저장소, 라우터, UI 도구 */
(function () {
  const S = (window.S = window.S || {});

  /* ---------- DOM ---------- */
  function add(el, kids) {
    for (const c of kids.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
  }
  S.h = function (spec, attrs, ...kids) {
    const m = spec.match(/^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i) || [];
    const el = document.createElement(m[1] || 'div');
    (m[2] || '').replace(/([.#])([\w-]+)/g, (_, t, n) => {
      if (t === '.') el.classList.add(n); else el.id = n;
    });
    if (attrs && (attrs.nodeType || typeof attrs !== 'object' || Array.isArray(attrs))) {
      kids.unshift(attrs); attrs = null;
    }
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.classList.add(...String(v).split(' ').filter(Boolean));
      else if (k === 'style' && typeof v === 'object') { for (const sk in v) { if (sk.startsWith('--')) el.style.setProperty(sk, v[sk]); else el.style[sk] = v[sk]; } }
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    add(el, kids);
    return el;
  };
  const h = S.h;
  S.$ = (s, r = document) => r.querySelector(s);
  S.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  S.clear = el => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
  S.fmt = n => Math.round(n).toLocaleString('ko-KR');
  S.shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  S.pick = a => a[Math.floor(Math.random() * a.length)];
  S.rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  S.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  S.wait = ms => new Promise(r => setTimeout(r, ms));
  S.img = (name, cls = '', alt = '') => h('img', { src: 'img/' + name + '.png', class: 'pic ' + cls, alt, draggable: 'false' });

  /* ---------- 저장소 ---------- */
  const P = 'sesim.';
  S.store = {
    get(k, d) { try { const v = localStorage.getItem(P + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) { /* 용량/차단 */ } },
    del(k) { try { localStorage.removeItem(P + k); } catch (e) { } },
  };
  S.sess = {
    get(k, d) { try { const v = sessionStorage.getItem(P + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem(P + k, JSON.stringify(v)); } catch (e) { } },
    del(k) { try { sessionStorage.removeItem(P + k); } catch (e) { } },
  };

  /* ---------- 소리 ---------- */
  let actx = null;
  S.muted = S.store.get('muted', false);
  function tone(freq, dur, type = 'sine', vol = 0.12, when = 0) {
    if (S.muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = freq;
      const t = actx.currentTime + when;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur + 0.02);
    } catch (e) { }
  }
  S.sfx = function (n) {
    if (n === 'ok') { tone(660, .12); tone(880, .18, 'sine', .12, .1); }
    else if (n === 'bad') { tone(220, .25, 'sawtooth', .08); }
    else if (n === 'coin') { tone(1200, .08, 'square', .06); tone(1600, .14, 'square', .06, .07); }
    else if (n === 'pop') { tone(500, .06, 'triangle', .1); }
    else if (n === 'win') { [523, 659, 784, 1046].forEach((f, i) => tone(f, .2, 'triangle', .12, i * .12)); }
    else if (n === 'stamp') { tone(120, .15, 'square', .15); tone(90, .2, 'square', .1, .05); }
  };
  S.speak = function (text) {
    try {
      if (!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = 'ko-KR'; u.rate = 0.95;
      speechSynthesis.speak(u);
    } catch (e) { }
  };

  /* ---------- 토스트 / 모달 / 효과 ---------- */
  S.toast = function (msg, kind = '') {
    let box = S.$('#toasts');
    if (!box) { box = h('div#toasts'); document.body.append(box); }
    const t = h('div.toast', { class: kind }, msg);
    box.append(t);
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3100);
  };

  S.modal = function ({ title, body, actions, wide, onclose, cls }) {
    const back = h('div.modal-back');
    const box = h('div.modal', { class: (wide ? 'wide ' : '') + (cls || '') });
    const close = () => { back.remove(); document.body.classList.remove('noscroll'); onclose && onclose(); };
    if (title) box.append(h('h3.modal-title', title));
    const bd = h('div.modal-body');
    if (typeof body === 'string') bd.innerHTML = body; else if (body) add(bd, [body]);
    box.append(bd);
    const ac = h('div.modal-actions');
    (actions || [{ label: '확인', cls: 'primary' }]).forEach(a => {
      ac.append(h('button.btn', { class: a.cls || '', onclick: () => { if (!a.keep) close(); a.fn && a.fn(close); } }, a.label));
    });
    box.append(ac);
    back.append(box);
    back.addEventListener('mousedown', e => { if (e.target === back && !(actions && actions.length > 1 && !actions.some(a => a.dismiss !== false && a.cls === 'primary' && false))) { /* 바깥 클릭은 닫지 않음 */ } });
    document.body.append(back);
    document.body.classList.add('noscroll');
    return { close, el: box };
  };

  S.confetti = function (n = 60) {
    const cv = h('canvas.confetti'); document.body.append(cv);
    const W = (cv.width = innerWidth), H = (cv.height = innerHeight);
    const ctx = cv.getContext('2d');
    const cols = ['#FFC93C', '#5BAE7B', '#3B6FD4', '#FF7A59', '#B07CE8'];
    const ps = Array.from({ length: n }, () => ({ x: Math.random() * W, y: -20 - Math.random() * H * .3, vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 4, s: 6 + Math.random() * 8, c: S.pick(cols), r: Math.random() * 6 }));
    let f = 0;
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += .15; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore(); });
      if (++f < 150) requestAnimationFrame(draw); else cv.remove();
    })();
  };

  S.floatText = function (anchor, text, cls = '') {
    const r = anchor.getBoundingClientRect();
    const t = h('div.floaty', { class: cls, style: { left: r.left + r.width / 2 + 'px', top: r.top + 'px' } }, text);
    document.body.append(t); setTimeout(() => t.remove(), 1200);
  };

  /* ---------- 라우터 ---------- */
  const routes = [];
  S.route = (pattern, fn) => {
    const keys = [];
    const re = new RegExp('^' + pattern.replace(/:([a-z]+)/gi, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
    routes.push({ re, keys, fn });
  };
  S.go = p => { if (location.hash === '#' + p) S.render(); else location.hash = p; };
  S.render = function () {
    const path = (location.hash || '#/').slice(1) || '/';
    S.cleanup && S.cleanup();
    S.cleanup = null;
    for (const r of routes) {
      const m = path.match(r.re);
      if (m) {
        const params = {}; r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
        S.path = path;
        r.fn(params);
        window.scrollTo(0, 0);
        S.afterRender && S.afterRender(path);
        return;
      }
    }
    S.go('/');
  };
  S.main = () => S.$('#app');
  S.view = function (...nodes) { const m = S.main(); S.clear(m); add(m, nodes); return m; };
  window.addEventListener('hashchange', () => S.render());
})();
