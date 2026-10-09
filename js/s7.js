/* 7차시 · 집을 살 때, 갖고 있을 때 내는 세금 (취득세와 재산세) */
(function () {
  const { h, W, E, fmt } = S;
  const acqR = () => E.settings().rates.acq, propR = () => E.settings().rates.prop;
  const TRAN = 20; // 양도소득세율(%) — 연습용 고정값

  S.sessions[7] = {
    title: '집을 살 때, 갖고 있을 때 내는 세금', sub: '취득세, 재산세, 양도소득세와 세금왕 게임', e: '🏠', color: '#16A5A5',
    story: [
      { who: '무택이', img: '😢', t: '집을 살 돈을 다 모았는데... 계약하러 갔더니 <b>돈이 모자라다</b>고 해! 왜 그럴까?' },
      { who: '세연이', img: 'kid-girl', t: '아! 집값 말고 <b>세금</b>도 내야 하는 거 아닐까?' },
      { who: '세심이', img: 'bee-read', t: '맞아! 집을 <b>살 때</b>는 취득세, <b>갖고 있을 때</b>는 매년 재산세를 내. 오늘은 이 세금들을 직접 체험해 보자! 🏡' },
    ],
    goals: ['취득세와 재산세의 뜻과 차이를 알아요.', '세율(%)을 계산할 수 있어요.', '세금왕 게임으로 재산과 세금의 관계를 체험해요.'],
    recap: {
      term: '취득세와 재산세', def: '재산을 얻을 때 내는 세금을 취득세, 재산을 가지고 있을 때 매년 정기적으로 내는 세금을 재산세라고 해요.',
      points: ['<b>취득</b>은 어떤 재산을 자기 것으로 갖는다는 뜻이에요. (사기, 상속, 증여, 새로 짓기…)', '재산을 <b>얻을 때</b> 한 번 내는 <b>취득세</b>, <b>가지고 있는 동안</b> 매년 내는 <b>재산세</b>가 있어요.', '재산을 <b>팔아서 이익</b>이 생기면 <b>양도소득세</b>를 내요.', '취득세와 재산세는 우리 지역의 공공시설·서비스를 위해 쓰이는 <b>지방세</b>예요.'],
    },
    task: '이제 세심교실에서 집(자리)을 살 수 있어요. 학급 친구들과 논의해 집값과 취득세·재산세를 정하고 세법전에 기록한 뒤, 세율을 확인하고 납부확인증을 받아요.',
    next: '다음 시간에는 "탈세와 절세"에 대해 알아봐요!',
    activities: [
      /* ---------- 1 무택이 이야기 ---------- */
      { id: 'why', t: '무택이는 왜 집을 못 샀을까?', e: '🏚️', kind: '이야기·계산', d: '집값 말고 또 필요한 돈을 찾아봐요',
        run(root, ctx) {
          const wiz = W.wizard([
            next => {
              let save = 5000; const price = 5000, tax = Math.round(price * acqR() / 100);
              const out = h('div.k-out'); const sl = h('input', { type: 'range', min: 4000, max: 6000, step: 50, value: save });
              const upd = () => { save = +sl.value; const need = price + tax; out.innerHTML = `내 저금 <b>${fmt(save)}</b> / 집값 <b>${fmt(price)}</b> + 취득세 <b>${fmt(tax)}</b> = 필요한 돈 <b>${fmt(need)}</b><br>${save >= need ? '✅ 집을 살 수 있어요!' : `😢 <b class="neg">${fmt(need - save)}${E.cur()}</b>이 모자라요!`}`; };
              sl.addEventListener('input', upd); upd();
              return h('div.step', W.bee('무택이는 집값 <b>5,000심</b>을 정확히 모았어요. 무택이의 저금을 바꿔 보면서 집을 살 수 있는지 확인해 봐!', 'bee-paper'),
                h('div.card', h('label.sl', '💰 무택이의 저금', sl), out), W.next('이유를 알겠어요 ▶', next));
            },
            next => h('div.step', W.bee('집을 <b>살 때</b>와 <b>가지고 있을 때</b> 내는 세금이 달라요!', 'bee-read'),
              W.cards([
                { e: '🤲', t: '취득이란?', body: '어떤 재산을 <b>자신의 것으로 가진다</b>는 뜻이에요. 사기, 상속(물려받기), 증여(선물받기), 새로 짓기 등이 있어요.' },
                { e: '🧾', t: '취득세', body: '재산을 <b>취득할 때</b> 내는 세금이에요. 살 때 한 번 내요.' },
                { e: '📅', t: '재산세', body: '재산을 <b>가지고 있을 때 매년 정기적으로</b> 내는 세금이에요. 우리나라에서는 6월 1일을 기준으로 집을 가진 사람이 내요.' },
                { e: '🏘️', t: '재산의 종류', body: '집, 건물, 땅, 자동차, 배, 비행기 등이 재산이에요.' },
                { e: '🏗️', t: '이 세금은 어디에 쓰일까?', body: '취득세와 재산세는 우리가 사는 지역의 주된 세금 수입이에요. 지역의 <b>공공시설과 공공서비스</b>를 위해 쓰여요.' },
              ]), W.next('퀴즈 풀기 ▶', next)),
            next => W.quiz({ items: [
              { q: '집을 새로 사서 <u>내 것이 될 때</u> 한 번 내는 세금은?', opts: ['취득세', '재산세', '소비세'], a: 0, why: '취득할 때 내는 세금이 취득세예요.' },
              { q: '집을 <u>가지고 있는 동안</u> 해마다 내는 세금은?', opts: ['취득세', '재산세', '법인세'], a: 1, why: '재산을 보유하는 동안 매년 정기적으로 내요.' },
              { q: '다음 중 "재산"이 아닌 것은?', opts: ['땅', '자동차', '오늘 먹은 점심 식사 맛'], a: 2, why: '재산은 돈으로 가치를 매길 수 있는 물건이에요.' },
              { q: '취득세와 재산세가 주로 쓰이는 곳은?', opts: ['우리 지역의 공공시설·서비스', '외국 정부', '세금 낸 사람 개인'], a: 0, why: '지방세로서 지역 발전에 쓰여요.' },
            ], onDone: () => ctx.finish(null, '집을 살 때는 집값 외에 취득세를 준비해야 해요!') }),
          ]);
          root.append(wiz);
        } },

      /* ---------- 2 내 재산 마련 ---------- */
      { id: 'buy', t: '내 재산 마련하고 세금 내기', e: '🔑', kind: '체험', d: '재산을 사고, 한 해를 보내고, 되팔아 보아요',
        run(root, ctx) {
          const p = S.me; p.assets = p.assets || [];
          const box = h('div.assetbox');
          const state = () => { p.notes.years = p.notes.years || 0; return p.notes; };
          const draw = () => {
            S.clear(box); const n = state();
            box.append(h('div.card.balance', h('div.sm', '내 지갑'), h('div.big-num', E.money(p.money)), h('div.sm', `지금까지 ${n.years}년이 지났어요 (최대 3년)`)));
            // 가게
            box.append(h('h3.sec', '🏪 재산 사기'), h('div.shop-grid', S.ASSETS.map(a => {
              const tax = Math.round(a.price * acqR() / 100), mine = p.assets.filter(x => x.id === a.id).length;
              return h('div.shop-item', h('div.si-e', a.e), h('b', a.n), h('div.sm', `가격 ${fmt(a.price)}`), h('div.sm', `취득세 ${acqR()}% = ${fmt(tax)}`), h('div.sm', `매년 재산세 ${propR()}% = ${fmt(Math.round(a.price * propR() / 100))}`), mine ? h('div.own', `보유 ${mine}`) : null,
                h('button.btn.primary.sm', { onclick: () => {
                  if (p.money < a.price + tax) { S.toast('돈이 모자라요! 집값 + 취득세가 필요해요', 'bad'); S.sfx('bad'); return; }
                  if (!E.pay(a.price, a.n + ' 구입')) return;
                  E.payTax('acq', tax, a.n + ' 취득세'); p.assets.push({ id: a.id, price: a.price, value: a.price, years: 0 }); E.save(); setTimeout(draw, 100);
                } }, '사기'));
            })));
            // 보유
            box.append(h('h3.sec', '🏠 내 재산'));
            if (!p.assets.length) box.append(h('p.sm', '아직 재산이 없어요. 위에서 하나 사 보세요!'));
            else {
              box.append(h('div.assets', p.assets.map((as, i) => { const a = S.ASSETS.find(x => x.id === as.id); const gain = as.value - as.price;
                return h('div.asset', h('span.as-e', a.e), h('div', h('b', a.n), h('div.sm', `산 값 ${fmt(as.price)} → 지금 값 ${fmt(as.value)} (${gain >= 0 ? '+' : ''}${fmt(gain)})`)),
                  h('button.btn.sm', { onclick: () => {
                    const tran = gain > 0 ? Math.round(gain * TRAN / 100) : 0;
                    S.modal({ title: `${a.e} ${a.n} 팔기`, body: h('div.payslip', h('div.ps-row', h('span', '파는 값'), h('b', E.money(as.value))), h('div.ps-row', h('span', '번 이익'), h('b', E.money(Math.max(0, gain)))), h('div.ps-row.tax', h('span', `양도소득세 (${TRAN}%)`), h('b', '- ' + E.money(tran))), h('p.sm', '재산을 팔아서 이익이 생기면 양도소득세를 내요. 손해가 났다면 내지 않아요.')),
                      actions: [{ label: '팔기', cls: 'primary', fn: () => { p.assets.splice(i, 1); p.money += as.value; E.addLedger({ kind: 'in', type: 'sell', amt: as.value, memo: a.n + ' 판매' }); E.save(); if (tran) E.payTax('tran', tran, a.n + ' 양도소득세'); else { S.updateWallet(true); draw(); } setTimeout(draw, 150); } }, { label: '안 팔래요' }] });
                  } }, '팔기'));
              })));
              box.append(h('div.center', h('button.btn.blue.big', { onclick: () => {
                if (n.years >= 3) { S.toast('이번 체험에서는 3년까지만 보낼 수 있어요'); return; }
                n.years++; let tot = 0;
                p.assets.forEach(as => { const t = Math.round(as.price * propR() / 100); tot += t; as.value = Math.round(as.value * (1 + S.rnd(-3, 10) / 100)); });
                E.save();
                if (tot) { if (E.payTax('prop', Math.min(tot, p.money), '재산세 (' + n.years + '년째)')) { E.complete && 0; check(); } } else S.toast('재산이 없어서 재산세도 없어요');
                setTimeout(draw, 200);
              } }, '⏩ 한 해가 지났어요! (재산세 내기)')));
            }
          };
          const check = () => {
            const n = state(), did = p.ledger.some(l => l.type === 'prop') && p.ledger.some(l => l.type === 'acq');
            if (did) { E.badge('owner', '내 집 마련', '🏠'); ctx.finish(null, '취득세와 재산세를 모두 내 봤어요!'); }
          };
          root.append(W.bee('이제 진짜 지갑으로 <b>재산</b>을 사 볼까요? 사면 <b>취득세</b>, 한 해가 지나면 <b>재산세</b>를 내요. 재산값은 해마다 조금씩 변해요. 팔아서 이익이 나면 <b>양도소득세</b>도 내요!', 'bee-bags'), box);
          draw(); if (p.ledger.some(l => l.type === 'prop') && p.ledger.some(l => l.type === 'acq')) setTimeout(check, 50);
        } },

      /* ---------- 3 세율 계산 ---------- */
      { id: 'rate', t: '세율 계산하고 우리 반 세율 정하기', e: '📐', kind: '계산·정책', d: '취득세율, 재산세율을 구하고 정해 봐요',
        run(root, ctx) {
          const wiz = W.wizard([
            next => h('div.step', W.bee('<b>세율</b> = 세금 ÷ 가격 × 100 (%) 예를 들어 집이 1,000심인데 취득세가 100심이면 세율은 <b>10%</b>예요!', 'bee-paper'),
              W.quiz({ items: [
                { q: '집이 1,000심, 취득세 100심이면 취득세율은?', opts: ['1%', '10%', '100%'], a: 1, why: '100 ÷ 1,000 × 100 = 10%' },
                { q: '집이 1,000심, 재산세가 50심이면 재산세율은?', opts: ['5%', '50%', '0.5%'], a: 0, why: '50 ÷ 1,000 × 100 = 5%' },
                { q: '집이 5,000심, 취득세가 150심이면 취득세율은?', opts: ['3%', '30%', '15%'], a: 0, why: '150 ÷ 5,000 × 100 = 3%' },
                { q: '땅이 2,000심이고 재산세율이 2%이면 재산세는?', opts: ['4심', '40심', '400심'], a: 1, why: '2,000 × 0.02 = 40심' },
              ], onDone: () => { S.$('.nextrow', root).style.display = ''; } }), (() => { const n = W.next('다음 ▶', next); n.style.display = 'none'; return n; })()),
            next => {
              const a = h('input', { type: 'number', min: 0, max: 30, step: .5, value: 3, inputmode: 'decimal' }), b = h('input', { type: 'number', min: 0, max: 10, step: .5, value: 1, inputmode: 'decimal' });
              const price = 5000, view = h('div.k-out'); const upd = () => { view.innerHTML = `집 ${fmt(price)}${E.cur()}이면 → 취득세 <b>${fmt(price * a.value / 100)}</b> · 해마다 재산세 <b>${fmt(price * b.value / 100)}</b>`; };
              [a, b].forEach(x => x.addEventListener('input', upd)); upd();
              const why = h('textarea', { rows: 2, placeholder: '그렇게 정한 까닭을 써 주세요. 예) 집은 값이 크니까 취득세는 조금 낮은 3%, 재산세는 1%가 알맞다.' });
              return h('div.step', W.bee('세심교실에서도 집(자리)을 살 수 있어요! 우리 반의 <b>취득세율</b>과 <b>재산세율</b>은 얼마가 좋을까요?', 'bee-paper'),
                h('div.lawbook', h('div.law-title', '세심교실 세법전'), h('label', '취득세율 (%) ', a), h('label', '재산세율 (%) ', b), view, why),
                W.next('세법전에 기록 ✍️', () => { if (why.value.trim().length < 6) { S.toast('까닭을 써 주세요', 'bad'); return; }
                  S.addLaw({ name: '취득세·재산세 제안', how: `취득세 ${a.value}% / 재산세 ${b.value}%`, why: why.value.trim() }); E.diary('7차시 취득세·재산세 제안', `취득세 ${a.value}%, 재산세 ${b.value}% — ${why.value.trim()}`);
                  ctx.finish(null, '우리 반 취득세율과 재산세율을 제안했어요!'); }));
            },
          ]);
          root.append(wiz);
        } },

      /* ---------- 4 세금 종류 짝짓기 ---------- */
      { id: 'pairs', t: '재산 세금 짝짓기', e: '🧩', kind: '게임', d: '세금 이름과 설명을 이어요',
        run(root, ctx) {
          root.append(W.bee('취득세, 재산세, 양도소득세! 헷갈리지 않게 설명과 이어 보자.', 'bee-hello'),
            W.pairs({ pairs: [['취득세', '재산을 얻을 때 내는 세금'], ['재산세', '재산을 가지고 있는 동안 해마다 내는 세금'], ['양도소득세', '재산을 팔아서 이익이 생기면 내는 세금'], ['상속세', '재산을 가진 사람이 사망한 후 재산을 받을 때 내는 세금'], ['증여세', '재산을 가진 사람이 살아 있을 때 재산을 받을 때 내는 세금']], leftTitle: '세금', rightTitle: '설명', onDone: () => ctx.finish(null, '재산과 관련된 세금을 구분할 수 있어요!') }));
        } },

      /* ---------- 5 세금왕 게임 ---------- */
      { id: 'king', t: '세금왕 게임', e: '👑', kind: '보드게임', d: '취득세와 재산세를 가장 많이 낸 사람이 세금왕!',
        run(root, ctx) {
          root.append(W.bee('드디어 <b>세금왕 게임</b>이에요! 컴퓨터 친구 3명과 한 판 해 볼까? 게임머니는 지갑과 상관없는 놀이용이에요.', 'bee-hello'));
          const box = h('div'); root.append(box);
          S.TaxKing.start(box, { onEnd: r => ctx.finish(null, r.king ? '👑 세금왕이 되었어요!' : '세금왕에 도전했어요!') });
        } },
    ],
  };
})();
