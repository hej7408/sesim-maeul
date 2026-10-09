/* 세금통 게임 — 「세금이 쓰이는 곳」 카드 40장(20종×2장)으로 하는 짝 찾기
   규칙(게임 설명서): 4장씩 나눠 갖기 → 차례에 다른 사람에게 "OO 카드 있어요?" → 있으면 받아 짝을 내려놓고 계속,
   없으면 "세금통!" 하고 세금통에서 1장 뽑고 차례 넘김 → 손이 빈 사람이 생기면 끝, 내려놓은 카드의 별이 가장 많은 사람이 승리 */
(function () {
  const { h, W, E, shuffle } = S;
  const STAR = { env: '#2FA66E', safe: '#E5484D', cul: '#B07CE8', edu: '#3B6FD4', trf: '#8E5BE0', wel: '#F2994A' };
  // [id, 이름, 이모지, 설명, 분류, 별 개수]
  const PLACES = [
    ['clean', '환경미화원', '🧹', '거리와 공원을 깨끗하게 해요.', 'env', 1], ['art', '예술의 전당', '🎭', '멋진 공연을 볼 수 있어요.', 'cul', 3], ['lib', '도서관', '📚', '책을 빌리고 공부할 수 있어요.', 'edu', 2], ['sign', '신호등', '🚦', '차와 사람이 안전하게 다녀요.', 'trf', 1],
    ['fire', '소방서', '🚒', '불을 끄고 사람을 구해요.', 'safe', 2], ['police', '경찰서', '🚓', '범죄로부터 우리를 지켜요.', 'safe', 2], ['school', '학교', '🏫', '친구들과 배우고 자라요.', 'edu', 3], ['park', '공원', '🌳', '쉬고 놀 수 있는 초록 쉼터예요.', 'env', 1],
    ['clinic', '보건소', '🏥', '아플 때 도움을 받아요.', 'wel', 2], ['road', '도로', '🛣️', '자동차와 사람이 다닐 수 있어요.', 'trf', 1], ['subway', '지하철', '🚇', '빠르고 편하게 이동해요.', 'trf', 3], ['museum', '박물관', '🏛️', '옛날 이야기를 만나요.', 'cul', 2],
    ['play', '놀이터', '🛝', '안전하게 신나게 놀아요.', 'wel', 1], ['lamp', '가로등', '💡', '밤길을 환하게 밝혀요.', 'safe', 1], ['bridge', '다리', '🌉', '강을 건너 이웃을 만나요.', 'trf', 2], ['army', '군인', '🪖', '우리나라를 지켜요.', 'safe', 3],
    ['water', '상수도', '🚰', '깨끗한 물을 마실 수 있어요.', 'env', 2], ['sewer', '하수처리장', '♻️', '더러운 물을 깨끗하게 해요.', 'env', 3], ['center', '주민센터', '🏢', '필요한 서류를 떼어 줘요.', 'wel', 1], ['gym', '공공체육관', '🏟️', '운동을 마음껏 즐겨요.', 'cul', 3],
  ].map(a => ({ id: a[0], n: a[1], e: a[2], d: a[3], cat: a[4], star: a[5] }));
  const PL = id => PLACES.find(p => p.id === id);

  function cardEl(c, cls = '', onclick) {
    const p = c.p;
    return h('button.ttcard', { class: cls, onclick, style: { '--sc': STAR[p.cat] } }, h('div.tt-stars', '★'.repeat(p.star)), h('div.tt-e', p.e), h('div.tt-n', p.n), h('div.tt-d', p.d));
  }

  function start(root, { bots = 3, onEnd } = {}) {
    S.clear(root);
    const names = [S.me ? S.me.name : '나', '세종', '야미', '소인', '무출'], emos = [S.me && S.me.avatar && !S.me.avatar.startsWith('img:') ? S.me.avatar : '🐝', '👑', '🍰', '📏', '🍚'];
    const N = bots + 1;
    const pl = Array.from({ length: N }, (_, i) => ({ i, n: names[i], e: emos[i], human: i === 0, hand: [], pairs: [], stars: 0 }));
    let pile = shuffle(PLACES.flatMap(p => [{ p, u: p.id + 'a' }, { p, u: p.id + 'b' }]));
    pl.forEach(p => { p.hand = pile.splice(0, 4); });
    const mem = pl.map(() => ({})); // mem[i][placeId] = 그 카드를 갖고 있다고 생각하는 사람
    let logs = [], msg = '', sel = null, over = false, alive = true, turnI = 0, waitPick = null;
    S.cleanup = () => { alive = false; };
    const log = t => { logs.unshift(t); if (logs.length > 14) logs.pop(); };
    const wrap = h('div.tt'); root.append(wrap);

    function layPairs(p, quiet) {
      let found = true;
      while (found) {
        found = false;
        for (let a = 0; a < p.hand.length && !found; a++) for (let b = a + 1; b < p.hand.length; b++) if (p.hand[a].p.id === p.hand[b].p.id) {
          const c = p.hand[a].p; p.hand.splice(b, 1); p.hand.splice(a, 1); p.pairs.push(c); p.stars += c.star * 2; found = true; if (!quiet) log(`${p.n}: ${c.e} ${c.n} 짝을 내려놓았어요 (★${c.star * 2})`); break;
        }
      }
    }
    pl.forEach(p => layPairs(p, true));

    function render() {
      S.clear(wrap);
      const opp = h('div.tt-opps');
      pl.slice(1).forEach(p => opp.append(h('button.tt-opp', { class: (sel && p.hand.length ? 'can ' : '') + (turnI === p.i ? 'turn' : ''), onclick: () => { if (waitPick && sel && p.hand.length) { const c = sel; sel = null; waitPick({ card: c, target: p }); waitPick = null; } else if (waitPick && !sel) S.toast('먼저 내 카드를 하나 골라요', 'bad'); } },
        h('div.to-e', p.e), h('b', p.n), h('div.sm', `손 ${p.hand.length}장 · 짝 ${p.pairs.length}`), h('div.to-s', '★ ' + p.stars))));
      const me = pl[0];
      wrap.append(opp,
        h('div.tt-mid', h('div.tt-pile', h('div.tp-e', '🪣'), h('b', '세금통'), h('div.sm', pile.length + '장')), h('div.tt-msg', msg), h('div.tt-log', logs.slice(0, 5).map(l => h('div', l)))),
        h('div.tt-mine', h('div.tt-me-h', h('b', `${me.e} 내 카드`), h('span', `★ ${me.stars}`)), h('div.tt-hand', me.hand.map(c => cardEl(c, sel && sel.u === c.u ? 'sel' : '', () => { if (!waitPick) return; sel = c; S.sfx('pop'); render(); }))),
          h('div.tt-lay', h('span.sm', '내려놓은 짝: '), me.pairs.map(p => h('span.tt-pc', { title: p.n, style: { background: STAR[p.cat] } }, p.e)))));
    }

    async function ask(p, t, place) {
      log(`${p.n} → ${t.n}: "${place.n} 카드 있어요?"`); msg = `${p.e} ${p.n}: "${t.n}, ${place.n} 카드 있어요?"`; render(); await S.wait(p.human ? 500 : 900);
      pl.forEach(q => { if (q.i !== p.i) mem[q.i][place.id] = p.i; });
      const k = t.hand.findIndex(c => c.p.id === place.id);
      if (k >= 0) {
        const c = t.hand.splice(k, 1)[0]; p.hand.push(c); layPairs(p, true); // 방금 받은 카드 + 내 카드 = 짝
        msg = `✅ ${t.n}: "네, 있어요!" ${place.e} ${place.n} 짝 성공!`; log(`${t.n}: 네, 있어요! → ${p.n} 짝 성공 (★${place.star * 2})`); S.sfx('ok'); render(); await S.wait(900); mem.forEach(m => delete m[place.id]); return true;
      }
      mem[p.i] && (mem[p.i][place.id] = null);
      msg = `🪣 ${t.n}: "세금통!"`; log(`${t.n}: 세금통!`); S.sfx('bad'); render(); await S.wait(800); return false;
    }
    function draw(p) {
      if (!pile.length) { log(`${p.n}: 세금통이 비었어요`); return; }
      p.hand.push(pile.shift()); log(`${p.n}: 세금통에서 1장 뽑았어요`); layPairs(p);
    }
    async function humanTurn(p) {
      while (alive && !over) {
        if (!p.hand.length) return;
        msg = '🙋 내 차례! 내 카드를 하나 고르고, 물어볼 친구를 눌러요'; sel = null; render();
        const { card, target } = await new Promise(res => { waitPick = res; });
        const ok = await ask(p, target, card.p);
        if (ok) { if (!p.hand.length) return; continue; }
        draw(p); render(); await S.wait(500); return;
      }
    }
    async function botTurn(p) {
      while (alive && !over) {
        if (!p.hand.length) return;
        const others = pl.filter(q => q.i !== p.i && q.hand.length);
        if (!others.length) return;
        let card = null, target = null;
        for (const c of S.shuffle(p.hand)) { const who = mem[p.i][c.p.id]; if (who != null && who !== p.i && pl[who].hand.length) { card = c; target = pl[who]; break; } }
        if (!card) { card = S.pick(p.hand); target = S.pick(others); }
        msg = `${p.e} ${p.n}의 차례`; render(); await S.wait(600);
        const ok = await ask(p, target, card.p);
        if (ok) { if (!p.hand.length) return; if (pl.some(q => !q.hand.length)) return; continue; }
        draw(p); render(); await S.wait(400); return;
      }
    }
    async function loop() {
      render();
      while (alive && !over) {
        for (const p of pl) {
          if (!alive) return; turnI = p.i;
          if (p.human) await humanTurn(p); else await botTurn(p);
          if (pl.some(q => !q.hand.length)) { over = true; break; }
        }
      }
      if (alive) finish();
    }
    function finish() {
      const rank = pl.slice().sort((a, b) => b.stars - a.stars), win = rank[0], me = pl[0];
      S.clear(root);
      const iWin = rank[0].stars === me.stars;
      root.append(h('div.card.center', h('div.big-emoji', iWin ? '🏆' : '🎉'), h('h2', iWin ? '내가 세금통 달인이에요!' : `${win.n}이(가) 이겼어요!`),
        h('table.law-table', h('thead', h('tr', ['순위', '이름', '짝', '별'].map(x => h('th', x)))), h('tbody', rank.map((p, k) => h('tr', h('td', ['🥇', '🥈', '🥉', '4', '5'][k]), h('td', p.e + ' ' + p.n), h('td', p.pairs.length), h('td', '★ ' + p.stars))))),
        h('h3.sec', '내가 찾은 세금이 쓰이는 곳'), h('div.tt-found', me.pairs.length ? me.pairs.map(p => h('div.tt-f', h('span', p.e), h('div', h('b', p.n), h('div.sm', p.d)))) : h('p.sm', '다음엔 더 많이 찾아봐요!')),
        h('p', { html: '우리 주변의 이 모든 곳이 <b>우리가 낸 세금</b>으로 만들어지고 운영돼요. 💛' }), h('button.btn.primary', { onclick: () => start(root, { bots, onEnd }) }, '🔁 한 판 더')));
      if (iWin) E.badge('taxtong', '세금통 달인', '🪣');
      S.me && me.pairs.length >= 4 && E.badge('taxtong2', '세금 쓰임 수집가', '🗂️');
      onEnd && onEnd({ win: iWin, pairs: me.pairs.length, stars: me.stars });
    }
    loop();
  }

  /* 메모리(기억력) 모드 — 게임 설명서의 "게임 포인트: 메모리 게임으로도 활용" */
  function memory(root, { onEnd } = {}) {
    S.clear(root);
    const picks = shuffle(PLACES).slice(0, 10);
    const cards = shuffle(picks.flatMap(p => [{ p, u: p.id + 'a' }, { p, u: p.id + 'b' }]));
    let first = null, lock = false, moves = 0, got = 0, stars = 0;
    const info = h('div.center', '짝 0/10 · 시도 0번 · ★ 0'), grid = h('div.memgrid.m5');
    cards.forEach(c => {
      const el = h('button.memcard', { onclick: () => {
        if (lock || el.classList.contains('open') || el.classList.contains('done')) return; el.classList.add('open'); S.sfx('pop');
        if (!first) { first = { c, el }; return; }
        moves++; const a = first; first = null;
        if (a.c.p.id === c.p.id) { got++; stars += c.p.star * 2; [a.el, el].forEach(x => x.classList.add('done')); S.sfx('ok'); S.toast(`${c.p.e} ${c.p.n}: ${c.p.d}`, 'good'); }
        else { lock = true; S.sfx('bad'); setTimeout(() => { a.el.classList.remove('open'); el.classList.remove('open'); lock = false; }, 900); }
        info.textContent = `짝 ${got}/10 · 시도 ${moves}번 · ★ ${stars}`;
        if (got === 10) { S.confetti(50); E.badge('memory', '세금 기억왕', '🧠'); root.append(h('div.card.center', h('h3', `🎉 ${moves}번 만에 모두 찾았어요! 별 ${stars}개`), h('p.sm', '시도 횟수가 적을수록 기억력이 좋아요.'), h('button.btn.primary', { onclick: () => memory(root, { onEnd }) }, '🔁 다시'))); onEnd && onEnd({ moves, stars }); }
      } }, h('div.mc-back', '🪣'), h('div.mc-front', h('div.mc-e', c.p.e), h('div.mc-t', c.p.n)));
      grid.append(el);
    });
    root.append(W.bee('같은 카드 2장을 찾아 <b>짝</b>을 맞춰요! 짝을 찾으면 카드에 그려진 <b>별</b>을 모아요. (20종 중 10종)', 'bee-look'), info, grid);
  }

  function menu(root, opts = {}) {
    S.clear(root);
    let bots = 3;
    const nsel = W.chips({ options: ['2명 (총 3명)', '3명 (총 4명)', '4명 (총 5명)'], selected: ['3명 (총 4명)'], onChange: v => (bots = parseInt(v[0], 10)) });
    root.append(
      h('div.card', h('h3', '🪣 세금통 게임'), h('div.tt-guide', h('img.pic', { src: 'img/taxtong-guide.png', alt: '세금통 게임 설명서' })),
        h('p', { html: '<b>목표</b> 같은 짝의 카드를 찾고, 내가 찾은 카드에 그려진 <b>별</b>이 가장 많은 사람이 이겨요.' }),
        h('ol.sm', ['카드를 4장씩 나눠 가져요. 남은 카드는 가운데 <b>세금통</b>에 놓여요.', '내 차례에 친구 한 명에게 <b>내가 가진 카드</b>를 말하며 "OO 있어요?" 하고 물어봐요.', '친구가 가지고 있다면 나에게 주고, 짝이 되어 내려놓아요. 성공하면 계속 물어볼 수 있어요.', '없다면 "<b>세금통!</b>" — 세금통에서 1장을 뽑고 차례가 넘어가요.', '손에 든 카드를 모두 내려놓은 사람이 생기면 끝! 별이 가장 많은 사람이 승리해요.'].map(t => h('li', { html: t }))),
        h('p.sm', '※ 앱 도움 규칙: 내 손에 같은 카드 2장이 생기면 바로 내려놓아요. 카드의 별 개수(1~3개)는 앱에서 정했어요.')),
      h('div.card', h('h3', '컴퓨터 친구 수'), nsel,
        h('div.nextrow.cc', h('button.btn.primary.big', { onclick: () => start(root, { bots: Math.max(2, Math.min(4, bots)), onEnd: opts.onEnd }) }, '▶ 세금통 게임 시작'), h('button.btn.big', { onclick: () => memory(root, { onEnd: opts.onEnd }) }, '🧠 메모리 게임으로 하기'))));
  }

  S.TaxTong = { start, memory, menu, PLACES };
  S.games.taxtong = { title: '세금통 게임', e: '🪣', color: '#2FA66E', desc: '세금이 쓰이는 곳 카드 40장 · 별이 가장 많은 사람이 승리!', who: '나 + 컴퓨터 2~4명 / 메모리 모드', run: root => menu(root, {}) };
})();
