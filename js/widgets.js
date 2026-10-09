/* 재사용 활동 위젯: 퀴즈, OX, 분류, 초성, 순서, 짝짓기, 마법사 등 */
(function () {
  const { h, shuffle, $ } = S;
  const W = (S.W = {});

  /* 꿀벌 말풍선 */
  W.bee = function (text, pose = 'bee-hello', side = '') {
    const bub = h('div.bubble', typeof text === 'string' ? { html: text } : null, typeof text === 'string' ? null : text);
    return h('div.bee-say', { class: side }, S.img(pose, 'bee-img', '세심이'), bub);
  };
  W.say = function (who, img, text, cls = '') {
    return h('div.chat', { class: cls }, h('div.chat-ava', img.startsWith('kid') || img.startsWith('bee') ? S.img(img) : h('span.emoji', img)), h('div.chat-body', h('b.chat-who', who), h('div.chat-text', { html: text })));
  };

  W.dots = (n, cur, okset = []) => h('div.dots', Array.from({ length: n }, (_, i) => h('i', { class: (i === cur ? 'cur ' : '') + (okset[i] === true ? 'ok' : okset[i] === false ? 'no' : '') })));

  /* 실행 중 한 번만 호출 */
  const once = fn => { let d = false; return (...a) => { if (!d) { d = true; fn && fn(...a); } }; };

  /* ---------- 객관식 퀴즈 ---------- */
  W.quiz = function ({ items, onDone, shuffleOpts = true, title }) {
    let i = 0, score = 0; const res = [];
    const done = once(onDone);
    const box = h('div.quiz');
    function show() {
      S.clear(box);
      if (i >= items.length) {
        box.append(h('div.result', h('div.big-emoji', score === items.length ? '🏆' : '👍'), h('h3', `${items.length}문제 중 ${score}문제 맞혔어요!`)));
        done(score, items.length); return;
      }
      const it = items[i];
      const order = shuffleOpts ? shuffle(it.opts.map((o, k) => k)) : it.opts.map((o, k) => k);
      box.append(W.dots(items.length, i, res));
      if (title) box.append(h('div.q-title', title));
      box.append(h('div.q', { html: it.q }));
      if (it.pic) box.append(h('div.q-pic', it.pic));
      const fb = h('div.feedback');
      const list = h('div.opts');
      let locked = false;
      order.forEach(k => {
        const b = h('button.opt', { onclick: () => {
          if (locked) return; locked = true;
          const ok = k === it.a;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) list.children[order.indexOf(it.a)].classList.add('right');
          if (ok) { score++; S.sfx('ok'); } else S.sfx('bad');
          res[i] = ok;
          fb.className = 'feedback show ' + (ok ? 'good' : 'bad');
          fb.innerHTML = (ok ? '⭕ 정답! ' : '💡 아쉬워요. ') + (it.why || '');
          const nx = h('button.btn.primary', { onclick: () => { i++; show(); } }, i + 1 >= items.length ? '결과 보기' : '다음 문제 ▶');
          fb.append(h('div', nx));
        } }, it.opts[k]);
        list.append(b);
      });
      box.append(list, fb);
    }
    show();
    return box;
  };

  /* ---------- O / X ---------- */
  W.ox = function ({ items, onDone, labels = ['O', 'X'] }) {
    let i = 0, score = 0; const res = [];
    const done = once(onDone);
    const box = h('div.quiz.ox');
    function show() {
      S.clear(box);
      if (i >= items.length) {
        box.append(h('div.result', h('div.big-emoji', score >= items.length * .8 ? '🏆' : '👍'), h('h3', `${items.length}문제 중 ${score}문제 맞혔어요!`)));
        done(score, items.length); return;
      }
      const it = items[i];
      box.append(W.dots(items.length, i, res), h('div.q.big', { html: it.q }));
      const fb = h('div.feedback'); let locked = false;
      const mk = (val, label) => h('button.oxbtn', { class: val ? 'o' : 'x', onclick: () => {
        if (locked) return; locked = true;
        const ok = it.a === val; res[i] = ok; if (ok) { score++; S.sfx('ok'); } else S.sfx('bad');
        fb.className = 'feedback show ' + (ok ? 'good' : 'bad');
        fb.innerHTML = (ok ? '⭕ 맞아요! ' : '❌ 아니에요. ') + (it.why || '');
        fb.append(h('div', h('button.btn.primary', { onclick: () => { i++; show(); } }, i + 1 >= items.length ? '결과 보기' : '다음 ▶')));
      } }, label);
      box.append(h('div.oxrow', mk(true, labels[0]), mk(false, labels[1])), fb);
    }
    show();
    return box;
  };

  /* ---------- 분류 놀이: 카드를 알맞은 바구니에 ---------- */
  W.sort = function ({ buckets, items, onDone, prompt }) {
    const list = shuffle(items);
    let i = 0, wrong = 0, right = 0;
    const done = once(onDone);
    const box = h('div.sortgame');
    const counts = {}; buckets.forEach(b => (counts[b.id] = 0));
    const card = h('div.sortcard');
    const info = h('div.sortinfo');
    const bk = h('div.buckets', { style: { gridTemplateColumns: `repeat(${Math.min(buckets.length, 4)},1fr)` } });
    const cnts = {};
    buckets.forEach(b => {
      const c = h('span.cnt', '0'); cnts[b.id] = c;
      bk.append(h('button.bucket', { class: b.cls || '', onclick: () => choose(b, bk.children[buckets.indexOf(b)]) },
        h('div.b-emoji', b.emoji || ''), h('div.b-label', b.label), b.sub ? h('div.b-sub', b.sub) : null, c));
    });
    function show() {
      info.className = 'sortinfo';
      if (i >= list.length) {
        S.clear(card); card.className = 'sortcard end';
        card.append(h('div.big-emoji', wrong === 0 ? '🏆' : '🎉'), h('b', `모두 분류했어요! 실수 ${wrong}번`));
        info.textContent = ''; done(right, list.length, wrong); return;
      }
      card.className = 'sortcard pop';
      S.clear(card); card.append(h('div.sc-t', list[i].t));
      if (list[i].e) card.prepend(h('div.sc-e', list[i].e));
      info.textContent = `${i + 1} / ${list.length}`;
    }
    function choose(b, el) {
      if (i >= list.length) return;
      const it = list[i];
      if (it.b === b.id) {
        S.sfx('ok'); right++; counts[b.id]++; cnts[b.id].textContent = counts[b.id];
        el.classList.add('flash-ok'); setTimeout(() => el.classList.remove('flash-ok'), 400);
        if (it.why) S.toast('✅ ' + it.why, 'good');
        i++; show();
      } else {
        S.sfx('bad'); wrong++; el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 500);
        info.className = 'sortinfo bad'; info.textContent = '🤔 다시 생각해봐요! ' + (it.hint || '');
      }
    }
    box.append(prompt ? h('p.hint', prompt) : null, info, card, bk);
    show();
    return box;
  };

  /* ---------- 초성 퀴즈 ---------- */
  const CH = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  W.chosung = s => [...s].map(c => { const k = c.charCodeAt(0) - 0xAC00; return k >= 0 && k < 11172 ? CH[Math.floor(k / 588)] : c; }).join('');
  W.word = function ({ answer, choices, desc, hint, onDone }) {
    const done = once(onDone);
    const opts = shuffle([answer, ...choices]);
    const slots = h('div.slots', [...answer].map((c, k) => h('span.slot', c === ' ' ? ' ' : W.chosung(c))));
    const fb = h('div.feedback');
    const box = h('div.wordq', desc ? h('p.q', { html: desc }) : null, slots, hint ? h('p.hint', '💡 ' + hint) : null);
    const list = h('div.opts.wrap');
    let tries = 0;
    opts.forEach(o => {
      const b = h('button.opt', { onclick: () => {
        if (b.disabled) return;
        if (o === answer) {
          S.sfx('ok'); b.classList.add('right'); list.querySelectorAll('button').forEach(x => (x.disabled = true));
          [...answer].forEach((c, k) => (slots.children[k].textContent = c)); slots.classList.add('solved');
          fb.className = 'feedback show good'; fb.textContent = `🎉 맞아요! "${answer}"`;
          done(tries);
        } else { S.sfx('bad'); tries++; b.classList.add('wrong'); b.disabled = true; fb.className = 'feedback show bad'; fb.textContent = '다시 도전! 초성을 잘 보세요 🔍'; }
      } }, o);
      list.append(b);
    });
    box.append(list, fb);
    return box;
  };

  /* ---------- 순서 맞추기 ---------- */
  W.order = function ({ steps, onDone, prompt }) {
    const done = once(onDone);
    const pool = shuffle(steps.map((s, k) => ({ s, k })));
    let next = 0; const placed = h('ol.placed'); const bank = h('div.bank');
    const fb = h('div.feedback');
    pool.forEach(p => {
      const b = h('button.chip.big', { onclick: () => {
        if (p.k === next) {
          S.sfx('ok'); b.remove(); placed.append(h('li.pop', p.s)); next++;
          if (next === steps.length) { fb.className = 'feedback show good'; fb.textContent = '🎉 순서를 모두 맞혔어요!'; done(); }
        } else { S.sfx('bad'); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); fb.className = 'feedback show bad'; fb.textContent = `${next + 1}번째로 일어나는 일이 아니에요. 다시!`; }
      } }, p.s);
      bank.append(b);
    });
    return h('div.ordergame', prompt ? h('p.q', prompt) : null, placed, bank, fb);
  };

  /* ---------- 짝 잇기 ---------- */
  W.pairs = function ({ pairs, onDone, leftTitle, rightTitle }) {
    const done = once(onDone);
    const L = shuffle(pairs.map((p, k) => ({ t: p[0], k }))), R = shuffle(pairs.map((p, k) => ({ t: p[1], k })));
    let sel = null, ok = 0;
    const colL = h('div.pcol', leftTitle ? h('div.ptitle', leftTitle) : null), colR = h('div.pcol', rightTitle ? h('div.ptitle', rightTitle) : null);
    const mk = (it, side) => {
      const b = h('button.pitem', { onclick: () => {
        if (b.classList.contains('matched')) return;
        if (!sel) { sel = { it, side, b }; b.classList.add('sel'); S.sfx('pop'); return; }
        if (sel.side === side) { sel.b.classList.remove('sel'); sel = { it, side, b }; b.classList.add('sel'); return; }
        if (sel.it.k === it.k) {
          S.sfx('ok'); b.classList.add('matched'); sel.b.classList.add('matched'); sel.b.classList.remove('sel'); ok++; sel = null;
          if (ok === pairs.length) { S.toast('🎉 모두 연결했어요!', 'good'); done(); }
        } else { S.sfx('bad'); const o = sel.b; o.classList.remove('sel'); b.classList.add('shake'); o.classList.add('shake'); setTimeout(() => { b.classList.remove('shake'); o.classList.remove('shake'); }, 400); sel = null; }
      } }, it.t);
      return b;
    };
    L.forEach(it => colL.append(mk(it, 'L'))); R.forEach(it => colR.append(mk(it, 'R')));
    return h('div.pairs', colL, colR);
  };

  /* ---------- 글쓰기/메모 ---------- */
  W.note = function ({ prompt, placeholder = '여기에 써 봐요', key, min = 5, rows = 3, onDone, btn = '저장하기', diaryTitle }) {
    const done = once(onDone);
    const ta = h('textarea', { rows, placeholder, value: key ? S.E.getNote(key, '') : '' });
    const b = h('button.btn.primary', { onclick: () => {
      const v = ta.value.trim();
      if (v.length < min) { S.toast(`조금만 더 써 볼까요? (${min}글자 이상)`, 'bad'); return; }
      if (key) S.E.note(key, v);
      if (diaryTitle) S.E.diary(diaryTitle, v);
      S.sfx('ok'); S.toast('저장했어요 ✏️', 'good'); done(v);
    } }, btn);
    return h('div.notebox', prompt ? h('p.q', { html: prompt }) : null, ta, b);
  };

  /* ---------- 칩(선택지) ---------- */
  W.chips = function ({ options, multi = false, max = 3, onChange, selected = [] }) {
    const sel = new Set(selected);
    const box = h('div.chips');
    options.forEach(o => {
      const b = h('button.chip', { class: sel.has(o) ? 'on' : '', onclick: () => {
        if (multi) { if (sel.has(o)) sel.delete(o); else if (sel.size < max) sel.add(o); else { S.toast(`최대 ${max}개까지 고를 수 있어요`); return; } }
        else { sel.clear(); sel.add(o); }
        S.$$('.chip', box).forEach(c => c.classList.toggle('on', sel.has(c.textContent)));
        S.sfx('pop'); onChange && onChange([...sel]);
      } }, o);
      box.append(b);
    });
    box.get = () => [...sel];
    return box;
  };

  /* ---------- 마법사(단계 진행) ---------- */
  W.wizard = function (steps, { onDone } = {}) {
    let i = 0; const box = h('div.wizard');
    const done = once(onDone);
    function show() {
      S.clear(box);
      if (i >= steps.length) { done(); return; }
      const bar = h('div.wiz-bar', h('span', `${i + 1} / ${steps.length}`), h('div.wiz-track', h('i', { style: { width: ((i + 1) / steps.length * 100) + '%' } })));
      const next = () => { i++; show(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
      box.append(bar, steps[i](next, () => { if (i > 0) { i--; show(); } }));
    }
    show();
    return box;
  };

  /* 다음 버튼 */
  W.next = (label, fn, cls = 'primary') => h('div.nextrow', h('button.btn.big', { class: cls, onclick: fn }, label));

  /* 정보 카드 목록 (눌러서 펼치기) */
  W.cards = function (items) {
    return h('div.infocards', items.map(it => {
      const body = h('div.ic-body', { html: it.body });
      const c = h('div.infocard', { onclick: () => { c.classList.toggle('open'); S.sfx('pop'); } },
        h('div.ic-head', h('span.ic-e', it.e || '📌'), h('b', it.t), h('span.ic-arrow', '▾')), body);
      return c;
    }));
  };

  /* 서명 패드 */
  W.signpad = function ({ onSign, w = 320, h: ht = 140 }) {
    const cv = h('canvas.signpad', { width: w, height: ht });
    const ctx = cv.getContext('2d'); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#2b4c9b';
    let draw = false, any = false;
    const pos = e => { const r = cv.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return [(t.clientX - r.left) * w / r.width, (t.clientY - r.top) * ht / r.height]; };
    const st = e => { draw = true; const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(x, y); e.preventDefault(); };
    const mv = e => { if (!draw) return; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); any = true; e.preventDefault(); };
    const en = () => { if (draw && any) onSign && onSign(cv); draw = false; };
    cv.addEventListener('mousedown', st); cv.addEventListener('mousemove', mv); window.addEventListener('mouseup', en);
    cv.addEventListener('touchstart', st, { passive: false }); cv.addEventListener('touchmove', mv, { passive: false }); cv.addEventListener('touchend', en);
    cv.clearPad = () => { ctx.clearRect(0, 0, w, ht); any = false; };
    cv.hasInk = () => any;
    return cv;
  };
})();
