/* 세금왕 게임 (7차시 교구 '세금왕 게임'의 디지털 버전)
   규칙: 모두 8,000심 → 주사위로 말판을 돌며 재산(주사위 눈별 종류)을 사요 → 취득세·재산세를 가장 많이 낸 사람이 세금왕 */
(function () {
  const { h, W, E, fmt, shuffle } = S;
  const TYPE = { 1: '차', 2: '집', 3: '땅', 4: '건물', 5: '배', 6: '항공기' };
  const PROPS = [
    { id: 'car1', t: 1, n: '승용차', e: '🚗', price: 9000, acq: 500, prop: 100, fee: 1000 },
    { id: 'car2', t: 1, n: '스포츠카', e: '🏎️', price: 16000, acq: 900, prop: 200, fee: 2000 },
    { id: 'home1', t: 2, n: '아파트', e: '🏢', price: 13000, acq: 400, prop: 100, fee: 3000 },
    { id: 'home2', t: 2, n: '전원주택', e: '🏡', price: 20000, acq: 700, prop: 200, fee: 4000 },
    { id: 'land1', t: 3, n: '땅 100평', e: '🌾', price: 7000, acq: 300, prop: 100, fee: 1000 },
    { id: 'land2', t: 3, n: '땅 300평', e: '🌳', price: 15000, acq: 600, prop: 200, fee: 2000 },
    { id: 'bld1', t: 4, n: '3층 건물', e: '🏬', price: 18000, acq: 800, prop: 250, fee: 3500 },
    { id: 'bld2', t: 4, n: '10층 빌딩', e: '🏙️', price: 30000, acq: 1200, prop: 400, fee: 6000 },
    { id: 'boat1', t: 5, n: '모터보트', e: '🚤', price: 8000, acq: 350, prop: 100, fee: 1200 },
    { id: 'boat2', t: 5, n: '요트', e: '⛵', price: 22000, acq: 900, prop: 300, fee: 4500 },
    { id: 'air1', t: 6, n: '경비행기', e: '🛩️', price: 25000, acq: 1000, prop: 350, fee: 5000 },
    { id: 'air2', t: 6, n: '헬리콥터', e: '🚁', price: 35000, acq: 1400, prop: 500, fee: 7000 },
  ];
  const P = id => PROPS.find(x => x.id === id);
  const TILES = [
    { k: 'start', t: '시작', e: '🏁' }, { k: 'fee', p: 'car1' }, { k: 'bonus', t: '보너스 게임', c: '3보다 큰 눈 → +3,000', f: d => d > 3, amt: 3000 }, { k: 'gain', t: '성과급', amt: 3000, e: '🎁' },
    { k: 'fee', p: 'land1' }, { k: 'fee', p: 'home1' }, { k: 'rest', t: '휴직', e: '😴' }, { k: 'fee', p: 'boat1' },
    { k: 'loss', t: '해외여행', amt: 2000, e: '✈️' }, { k: 'bonus', t: '보너스 게임', c: '5보다 큰 눈 → +5,000', f: d => d > 5, amt: 5000 }, { k: 'fee', p: 'bld1' }, { k: 'gain', t: '장사 대박', amt: 3000, e: '🏪' },
    { k: 'fee', p: 'car2' }, { k: 'fee', p: 'home2' }, { k: 'rest', t: '휴직', e: '😴' }, { k: 'gain', t: '복권 당첨', amt: 5000, e: '🎟️' },
    { k: 'fee', p: 'land2' }, { k: 'bonus', t: '보너스 게임', c: '2보다 작은 눈 → +5,000', f: d => d < 2, amt: 5000 }, { k: 'loss', t: '기부', amt: 4000, e: '💝' }, { k: 'fee', p: 'boat2' },
    { k: 'fee', p: 'bld2' }, { k: 'fee', p: 'air2' }, { k: 'bonus', t: '보너스 게임', c: '3 또는 4 → +5,000', f: d => d === 3 || d === 4, amt: 5000 }, { k: 'fee', p: 'air1' },
  ];
  const CELL = i => i <= 6 ? [0, i] : i <= 12 ? [i - 6, 6] : i <= 18 ? [6, 18 - i] : [24 - i, 0];
  const COLORS = ['#E5484D', '#3B6FD4', '#2FA66E', '#B07CE8', '#E0A100'];

  function start(root, { onEnd, bots = 3 } = {}) {
    const names = [S.me ? S.me.name : '나', '세종', '야미', '소인', '무출'];
    const emos = [S.me && S.me.avatar && !S.me.avatar.startsWith('img:') ? S.me.avatar : '🐝', '👑', '🍰', '📏', '🍚'];
    const pl = Array.from({ length: bots + 1 }, (_, i) => ({ i, n: names[i], e: emos[i], c: COLORS[i], money: 8000, steps: 0, acq: 0, prop: 0, own: [], rest: 0, human: i === 0, earn: 0, spend: 0, fee: 0 }));
    const owner = {}; let year = 0, over = false, logs = [], dice = null, msg = '주사위를 굴려 보세요!';
    const wrap = h('div.tk'); const board = h('div.tk-board'), side = h('div.tk-side'); wrap.append(board, side); root.append(wrap);
    let alive = true; S.cleanup = () => { alive = false; };

    const log = t => { logs.unshift(t); if (logs.length > 30) logs.pop(); };
    const pos = p => p.steps % 24;
    const lap = p => Math.floor(p.steps / 24);

    function render() {
      S.clear(board);
      TILES.forEach((t, i) => {
        const [r, c] = CELL(i);
        const pr = t.k === 'fee' ? P(t.p) : null; const o = pr ? owner[pr.id] : null;
        const cell = h('div.tk-cell', { class: t.k + (o != null ? ' owned' : ''), style: { gridRow: r + 1, gridColumn: c + 1, '--o': o != null ? pl[o].c : 'transparent' } },
          h('div.tc-e', pr ? pr.e : t.e || '🎲'), h('div.tc-t', pr ? pr.n + ' 사용료' : t.t), h('div.tc-s', pr ? fmt(pr.fee) : t.amt ? (t.k === 'loss' ? '-' : '+') + fmt(t.amt) : ''));
        const toks = h('div.tc-toks'); pl.filter(p => pos(p) === i).forEach(p => toks.append(h('span.tok', { style: { background: p.c } }, p.e)));
        cell.append(toks); board.append(cell);
      });
      board.append(h('div.tk-center', h('div.tk-year', `📅 ${year}년째 · ${lap(pl[0]) + 1}바퀴째`), dice ? h('div.tk-dice', ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][dice]) : null, h('div.tk-msg', msg)));
      S.clear(side);
      pl.forEach(p => side.append(h('div.tk-pl', { class: p.human ? 'me' : '', style: { '--c': p.c } }, h('div.tp-h', h('span', p.e + ' ' + p.n), h('b', fmt(p.money) + '심')),
        h('div.sm', `낸 세금 ${fmt(p.acq + p.prop)} (취득 ${fmt(p.acq)} · 재산 ${fmt(p.prop)})`), h('div.tp-own', p.own.map(id => h('span', P(id).e))))));
      side.append(h('div.tk-log', logs.slice(0, 8).map(l => h('div', l))));
    }
    const pay = (p, amt) => { p.money -= amt; p.spend += amt; };
    const gain = (p, amt) => { p.money += amt; p.earn += amt; };
    function ensureMoney(p) {
      while (p.money < 0 && p.own.length) { const id = p.own[p.own.length - 1]; const pr = P(id); p.own.pop(); delete owner[id]; gain(p, Math.round(pr.price / 2)); log(`${p.n}: 돈이 모자라 ${pr.n}을(를) 반값에 팔았어요`); }
    }
    async function roll(p, label) {
      if (p.human) {
        await new Promise(res => { msg = label || '🎲 주사위를 굴리세요'; render(); const b = h('button.btn.primary.big', { onclick: () => { b.remove(); res(); } }, '🎲 굴리기'); S.$('.tk-center', board).append(b); });
      } else await S.wait(650);
      for (let k = 0; k < 6; k++) { dice = S.rnd(1, 6); render(); S.sfx('pop'); await S.wait(70); }
      dice = S.rnd(1, 6); render(); await S.wait(450);
      return dice;
    }
    async function turn(p) {
      if (p.rest > 0) { p.rest--; log(`${p.n}: 휴직 중이라 쉬어요 😴`); msg = `${p.n}은(는) 쉬는 중`; render(); await S.wait(600); return; }
      msg = `${p.e} ${p.n} 차례`; render();
      const d = await roll(p);
      log(`${p.n}: 주사위 ${d}`);
      for (let s = 0; s < d; s++) { p.steps++; if (pos(p) === 0) { gain(p, 3000); log(`${p.n}: 한 바퀴! +3,000`); } render(); await S.wait(150); }
      if (!alive) return;
      await resolve(p, d);
      ensureMoney(p);
      await maybeBuy(p, d);
      ensureMoney(p);
      render();
    }
    async function resolve(p, d) {
      const t = TILES[pos(p)];
      if (t.k === 'fee') {
        const pr = P(t.p), o = owner[pr.id];
        if (o === p.i) { msg = `내 ${pr.n}이라 사용료 무료!`; log(`${p.n}: 내 ${pr.n}이라 사용료 없음`); }
        else { pay(p, pr.fee); if (o != null) { gain(pl[o], pr.fee); pl[o].fee += pr.fee; msg = `${pr.n} 사용료 ${fmt(pr.fee)} → ${pl[o].n}에게`; log(`${p.n}: ${pr.n} 사용료 ${fmt(pr.fee)}을 ${pl[o].n}에게 냄`); } else { msg = `${pr.n} 사용료 ${fmt(pr.fee)}`; log(`${p.n}: ${pr.n} 사용료 ${fmt(pr.fee)}`); } }
      } else if (t.k === 'gain') { gain(p, t.amt); msg = `${t.t}! +${fmt(t.amt)}`; log(`${p.n}: ${t.t} +${fmt(t.amt)}`); S.sfx('coin'); }
      else if (t.k === 'loss') { pay(p, t.amt); msg = `${t.t}... -${fmt(t.amt)}`; log(`${p.n}: ${t.t} -${fmt(t.amt)}`); }
      else if (t.k === 'rest') { p.rest = 1; msg = '휴직! 한 번 쉬어요'; log(`${p.n}: 휴직`); }
      else if (t.k === 'bonus') {
        msg = `보너스 게임! ${t.c}`; render(); await S.wait(500);
        const d2 = await roll(p, `보너스 게임: ${t.c}`);
        if (t.f(d2)) { gain(p, t.amt); msg = `성공! +${fmt(t.amt)}`; log(`${p.n}: 보너스 성공 +${fmt(t.amt)}`); S.sfx('win'); } else { msg = '아쉽게 실패'; log(`${p.n}: 보너스 실패`); }
      }
      render(); await S.wait(700);
    }
    async function maybeBuy(p, d) {
      const opts = PROPS.filter(x => x.t === d && owner[x.id] == null && p.money >= x.price + x.acq);
      if (!opts.length) { if (p.human && PROPS.some(x => x.t === d && owner[x.id] == null)) { log('돈이 모자라 살 수 있는 ' + TYPE[d] + '이(가) 없어요'); } return; }
      let choice = null;
      if (p.human) {
        choice = await new Promise(res => {
          const m = S.modal({ title: `🛒 주사위 ${d}! ${TYPE[d]}을(를) 살 수 있어요`, body: h('div', h('p.sm', '재산을 사면 가격과 함께 <b>취득세</b>를 내요. 해마다 <b>재산세</b>도 내요. 사용료는 다른 사람이 내 재산 칸에 오면 받아요.'.replace(/<\/?b>/g, '')),
            opts.map(o => h('button.btn.wide', { onclick: () => { m.close(); res(o); } }, `${o.e} ${o.n} — ${fmt(o.price)} + 취득세 ${fmt(o.acq)} (매년 재산세 ${fmt(o.prop)})`))), actions: [{ label: '안 살래요', fn: () => res(null) }] });
        });
      } else if (Math.random() > .25) { const aff = opts.filter(o => p.money - o.price - o.acq >= 1500).sort((a, b) => a.price - b.price); choice = aff[0] || null; }
      if (choice) {
        pay(p, choice.price + choice.acq); p.acq += choice.acq; p.own.push(choice.id); owner[choice.id] = p.i;
        log(`${p.n}: ${choice.n} 구입! (취득세 ${fmt(choice.acq)})`); msg = `${p.n}이(가) ${choice.n} 구입! 취득세 ${fmt(choice.acq)}`; S.sfx('stamp'); render(); await S.wait(800);
      }
    }
    function yearEnd() {
      year++; log(`📅 ${year}년이 지났어요! 연봉 +3,000, 재산세 납부`);
      pl.forEach(p => { gain(p, 3000); const t = p.own.reduce((a, id) => a + P(id).prop, 0); if (t) { pay(p, t); p.prop += t; log(`${p.n}: 재산세 ${fmt(t)} 납부`); } ensureMoney(p); });
      msg = `📅 ${year}년이 지났어요! 연봉 3,000을 받고, 재산이 있으면 재산세를 내요.`; S.sfx('coin'); render();
    }
    async function loop() {
      while (alive && !over) {
        for (const p of pl) { if (!alive) return; await turn(p); if (pl.some(q => lap(q) >= 2)) { over = true; break; } }
        if (over) break;
        yearEnd(); await S.wait(1200);
      }
      if (alive) finish();
    }
    function finish() {
      const rank = pl.slice().sort((a, b) => (b.acq + b.prop) - (a.acq + a.prop));
      const king = rank[0];
      S.clear(root);
      const rows = rank.map((p, k) => h('tr', h('td', ['🥇', '🥈', '🥉', '4', '5'][k]), h('td', p.e + ' ' + p.n), h('td', fmt(p.acq)), h('td', fmt(p.prop)), h('td', h('b', fmt(p.acq + p.prop))), h('td', fmt(p.money))));
      root.append(h('div.card.center', h('div.big-emoji', king.human ? '👑' : '🏁'), h('h2', king.human ? '축하해요! 내가 세금왕이에요!' : `${king.n}이(가) 세금왕이에요!`), h('div.cert.mini', h('div.cert-in', h('div.cert-t', '세금왕 증서'), h('p', `${king.n} — 취득세와 재산세를 합쳐 ${fmt(king.acq + king.prop)}심`), h('p.sm', '가장 많은 세금을 낸 사람이에요. 세금은 우리 마을을 위해 쓰여요!'))),
        h('table.law-table', h('thead', h('tr', ['순위', '이름', '취득세', '재산세', '낸 세금', '남은 돈'].map(x => h('th', x)))), h('tbody', rows)),
        h('p', { html: '💡 재산이 많을수록 <b>세금도 많이</b> 내요. 세금왕은 그만큼 재산이 많은 사람이기도 해요. 세금은 경제적 능력이 큰 사람이 더 많이 내는 거예요 (조세공평주의).' }), h('button.btn.primary', { onclick: () => { S.clear(root); start(root, { onEnd, bots }); } }, '🔁 한 판 더')));
      const me = pl[0]; S.me && E.badge('king', king.human ? '세금왕' : '세금왕 도전', king.human ? '👑' : '🎲');
      onEnd && onEnd({ king: king.human, taxes: me.acq + me.prop });
    }
    root.insertBefore(h('div.card', h('b', '📜 규칙'), h('p.sm', '1) 모두 8,000심으로 시작해요. 2) 주사위를 굴려 말판을 돌아요. 3) 주사위 눈에 따라 재산을 살 수 있어요 (1=차 2=집 3=땅 4=건물 5=배 6=항공기). 사면 <b>취득세</b>를 내요. 4) 모두 한 번씩 굴리면 1년! 연봉 3,000을 받고 재산이 있으면 <b>재산세</b>를 내요. 5) 누군가 2바퀴를 먼저 돌면 끝! 취득세+재산세를 <b>가장 많이</b> 낸 사람이 세금왕!'.replace(/<\/?b>/g, ''))), wrap);
    render(); loop();
  }

  S.TaxKing = { start, PROPS };
  S.games.taxking = { title: '세금왕 게임', e: '👑', color: '#E0A100', desc: '취득세·재산세를 가장 많이 낸 사람이 세금왕!', who: '나 + 친구 3명(컴퓨터)', run: root => start(root, {}) };
})();
