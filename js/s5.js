/* 5차시 · 물건을 살 때도 세금을 내요! */
(function () {
  const { h, W, E, fmt, shuffle } = S;
  const vatRate = () => E.settings().rates.vat;

  S.sessions[5] = {
    title: '물건을 살 때도 세금을 내요!', sub: '소비세(부가가치세)와 교정적 조세', e: '🛒', color: '#D6558B',
    story: [
      { who: '세연이', img: 'kid-girl', t: '세금은 어른들이 월급 받을 때만 내는 거 아니야?' },
      { who: '세심이', img: 'bee-money', t: '아니야! 우리가 <b>과자를 살 때</b>도 가격 속에 세금이 들어 있어. 영수증을 한번 볼래? 🧾' },
      { who: '무출이', img: 'kid-boy', t: '세금으로 사람들 행동도 바꿀 수 있다던데... 진짜야?' },
    ],
    goals: ['영수증에서 부가가치세(소비세)를 찾을 수 있어요.', '세금으로 사람들의 행동이 바뀌는 "교정적 조세"를 알아요.', '더 나은 세심교실을 위한 새로운 세금을 제안해 봐요.'],
    recap: {
      term: '교정적 조세', def: '부정적인 영향을 미치는 상품 등에 세금을 부과하여 부정적인 행위나 효과를 줄이도록 하는 세금',
      points: ['돈을 벌 때 내는 <b>소득세</b>가 있다면, 돈을 쓸 때 내는 <b>소비세</b>도 있어요. 대표적인 것이 <b>부가가치세</b>예요.', '우리가 내는 가격에는 물건 가격의 <b>10%</b>인 부가가치세가 포함되어 있어요.', '<b>설탕세, 탄소세</b>처럼 세금으로 나쁜 행동을 줄이는 것을 <b>교정적 조세</b>라고 해요.', '새로운 세금을 통해 문제를 해결하고 더 나은 생활을 만들 수 있어요.'],
    },
    task: '더 나은 세심교실을 위해 교정이 필요한 경우를 찾고, 학급 친구들과 논의해 만든 새로운 세금을 세법전에 기록해요. 앞으로 교정이 필요할 땐 세금 제안서(세심 신문고)로 제안해요.',
    next: '다음 시간에는 "회사가 내는 세금"에 대해 알아봐요!',
    activities: [
      /* ---------- 1 마트 영수증 ---------- */
      { id: 'receipt', t: '마트 영수증 속 세금 찾기', e: '🧾', kind: '체험', d: '장바구니를 채우고 영수증에서 세금을 찾아요',
        run(root, ctx) {
          const goods = [['🍪', '과자', 1500], ['🥛', '우유', 2000], ['🍙', '삼각김밥', 1200], ['✏️', '연필 세트', 3000], ['📒', '공책', 2500], ['🧃', '주스', 1800], ['🍎', '사과 봉지', 4000], ['🎈', '풍선', 1000]];
          const cart = new Map();
          const list = h('div.goods'), cartEl = h('div.cartline');
          const upd = () => { cartEl.textContent = cart.size ? '🛒 ' + [...cart].map(([k, n]) => goods[k][1] + '×' + n).join(', ') : '🛒 장바구니가 비어 있어요'; };
          goods.forEach((g, k) => list.append(h('button.good', { onclick: () => { cart.set(k, (cart.get(k) || 0) + 1); S.sfx('pop'); upd(); } }, h('div.g-e2', g[0]), h('b', g[1]), h('div.sm', fmt(g[2]) + '원'))));
          const go = h('button.btn.primary.big', { onclick: () => {
            if (cart.size < 2) { S.toast('물건을 2가지 이상 담아 보세요', 'bad'); return; }
            checkout();
          } }, '💳 계산하기');
          root.append(W.bee('마트에 왔어요! 사고 싶은 물건을 <b>2가지 이상</b> 담아서 계산해 보자. (가격은 세금 빼기 전 가격이에요)', 'bee-hello'), list, cartEl, h('div.center', go));
          upd();
          function checkout() {
            S.clear(root);
            const lines = [...cart].map(([k, n]) => [goods[k][1], n, goods[k][2] * n]);
            const sup = lines.reduce((a, l) => a + l[2], 0), vat = Math.round(sup * vatRate() / 100), tot = sup + vat;
            let got = false;
            const rc = h('div.receipt.shop', h('div.rc-title', 'SESIM MART'),
              lines.map(l => h('div.rc-row', h('span', `${l[0]} × ${l[1]}`), h('b', fmt(l[2])))),
              h('div.rc-row', h('span', '물건 가격 합계'), h('b', fmt(sup))),
              h('button.rc-row.vat.tapme', { onclick: e => { got = true; e.currentTarget.classList.add('found'); S.sfx('ok'); S.toast('🎉 찾았어요! 이게 소비세(부가가치세)예요', 'good'); if (!root.q) { root.q = 1; quiz(); } } }, h('span', `부가가치세 (${vatRate()}%) 👈`), h('b', fmt(vat))),
              h('div.rc-row.big', h('span', '최종 지불 금액'), h('b', fmt(tot) + '원')));
            root.append(W.bee('영수증이 나왔어요! 이 중에서 <b>세금</b>이 어디에 있는지 눌러 볼래? (힌트: 부 ○ ○ ○ 세)', 'bee-magnify'), rc);
            function quiz() {
              const dis = (v) => shuffle([v, v + Math.round(v * .1) + 100, Math.max(0, v - Math.round(v * .2) - 100)]).map(x => fmt(x) + '원');
              const opt3 = (v, a) => { const o = dis(v); return { opts: o, a: o.indexOf(fmt(v) + '원') }; };
              const q1 = opt3(vat), q2 = opt3(tot);
              root.append(h('h3.sec', '✏️ 계산해 볼까요?'), W.quiz({ items: [
                Object.assign({ q: `물건 가격 합계는 ${fmt(sup)}원이에요. 부가가치세 ${vatRate()}%는 얼마일까요?`, why: `${fmt(sup)} × ${vatRate()}% = ${fmt(vat)}원!` }, q1),
                Object.assign({ q: `그럼 내가 최종으로 내야 하는 돈은?`, why: `${fmt(sup)} + ${fmt(vat)} = ${fmt(tot)}원! 물건 가격 + 부가가치세` }, q2),
                { q: '우리 어린이가 과자를 살 때 가격에 들어 있는 세금은?', opts: ['소득세', '부가가치세', '재산세'], a: 1, why: '물건을 살 때 내는 대표적인 소비세는 부가가치세예요.' },
              ], shuffleOpts: false, onDone: () => ctx.finish(null, '우리도 물건을 살 때마다 세금을 내고 있었어요!') }));
            }
          }
        } },

      /* ---------- 2 진짜 소비 ---------- */
      { id: 'shop', t: '내 돈으로 물건 사 보기', e: '🛍️', kind: '체험', d: '세심시장에서 물건을 사고 영수증을 확인해요',
        run(root, ctx) {
          root.append(W.bee('이번에는 <b>내 지갑의 돈</b>으로 세심시장에서 물건을 사 볼 거예요. 영수증에서 세금이 얼마인지 꼭 확인해요!', 'bee-money'),
            h('div.card.center', h('p', '1️⃣ 시장에서 마음에 드는 물건을 사요'), h('p', '2️⃣ 영수증의 초록색 줄(세금)을 확인해요'), h('p', '3️⃣ 돌아와서 아래 버튼을 눌러요'),
              h('a.btn.primary.big', { href: '#/market' }, '🛒 세심시장 가기')));
          const chk = () => {
            const p = S.me, bought = p.ledger.filter(l => l.type === 'buy');
            if (!bought.length) { S.toast('아직 물건을 사지 않았어요. 시장에 다녀와요!', 'bad'); return; }
            const last = bought[bought.length - 1];
            root.append(W.quiz({ items: [{ q: `"${last.memo}"을(를) 사면서 낸 부가가치세는 얼마였나요?`, opts: [fmt(last.vat) + E.cur(), fmt(last.price) + E.cur(), '0' + E.cur()], a: 0, why: `물건 값 ${fmt(last.price)} 중 ${vatRate()}%인 ${fmt(last.vat)}${E.cur()}이 세금이었어요.` }], shuffleOpts: false, onDone: () => ctx.finish(null, '내 돈으로 물건을 사며 소비세를 직접 냈어요!') }));
          };
          root.append(h('div.center', h('button.btn.green.big', { onclick: chk }, '✅ 물건을 샀어요!')));
        } },

      /* ---------- 3 교정적 조세 시뮬 ---------- */
      { id: 'correct', t: '세금으로 행동을 바꿀 수 있을까?', e: '🧪', kind: '실험', d: '세금 크기를 바꿔 보며 변화를 관찰해요',
        run(root, ctx) {
          const sc = {
            sugar: { n: '설탕세', e: '🥤', unit: '병', what: '단 음료', base: 100, goodLab: '😁 건강', badLab: '단 음료 마신 양', why: '설탕이 많은 음료에 세금을 매겨 건강을 지켜요.' },
            carbon: { n: '탄소세', e: '🏭', unit: '톤', what: '이산화탄소', base: 100, goodLab: '🌍 깨끗한 공기', badLab: '이산화탄소 배출', why: '온실가스를 많이 내보낼수록 세금을 더 내요.' },
            cup: { n: '일회용컵세', e: '🥡', unit: '개', what: '일회용컵', base: 100, goodLab: '🐢 깨끗한 바다', badLab: '일회용컵 사용', why: '일회용컵을 쓸 때 세금을 내면 쓰레기가 줄어요.' },
          };
          let key = 'sugar', t = 0, seen = new Set([0]);
          const qOf = tx => Math.max(8, Math.round(sc[key].base * (1 - tx / 600)));
          const tabs = h('div.tabs'), out = h('div.exp'), slider = h('input', { type: 'range', min: 0, max: 500, step: 25, value: 0 });
          const draw = () => {
            const s = sc[key], q = qOf(t), rev = Math.round(t * q / 10), good = 100 - q;
            S.clear(out);
            out.append(h('div.exp-top', h('div.exp-e', s.e), h('b', `${s.n}: 한 개당 ${t}${E.cur()}`)),
              meter('📦 ' + s.badLab, q, 100, '#E5484D'), meter(s.goodLab, Math.min(100, good + 10), 100, '#2FA66E'), meter('💰 걷힌 세금', rev, 100, '#E0A100'),
              h('p.sm.center', t === 0 ? '세금이 없으면 사람들은 예전처럼 사요.' : t < 250 ? '조금 줄었어요. 세금이 사람들의 선택을 바꾸기 시작해요!' : t < 400 ? '꽤 줄었어요! 건강·환경은 좋아졌지만 걷히는 세금은 어떻게 변했나요?' : '너무 높은 세금은 부담이 커서 사람들이 크게 반발할 수 있어요.'));
            seen.add(t);
            if (seen.size >= 5 && !draw.d) { draw.d = 1; done(); }
          };
          const meter = (l, v, max, c) => h('div.meter', h('span', l), h('div.mt', h('i', { style: { width: Math.min(100, v / max * 100) + '%', background: c } })), h('b', Math.round(v)));
          Object.keys(sc).forEach(k => tabs.append(h('button.tab', { class: k === key ? 'on' : '', onclick: e => { key = k; S.$$('.tab', tabs).forEach(x => x.classList.remove('on')); e.currentTarget.classList.add('on'); draw(); } }, sc[k].e + ' ' + sc[k].n)));
          slider.addEventListener('input', () => { t = +slider.value; draw(); });
          root.append(W.bee('세금을 올리면 사람들이 어떻게 행동할까? <b>슬라이더</b>를 움직여 <b>다섯 가지 이상 세금</b>을 실험해 봐!', 'bee-look'), tabs, out, h('label.sl', '세금 크기', slider));
          draw();
          function done() {
            root.append(h('div.card.def', h('b', '📌 알게 된 점'), h('p', { html: '세금이 오르면 <b>나쁜 영향을 주는 행동</b>이 줄고, 너무 높으면 사람들이 부담을 느껴요. 걷은 세금은 문제를 해결하는 데 쓸 수 있어요.' })));
            root.append(W.word({ answer: '교정적조세', choices: ['교육적조세', '교환적조세', '교통적조세'], desc: '부정적인 행위나 효과를 줄이도록 <b>고쳐 바로잡는</b> 세금은?', hint: '고칠 교(矯) + 바를 정(正)', onDone: () => {
              root.append(W.word({ answer: '소비세', choices: ['소득세', '소유세', '수입세'], desc: '재화나 서비스를 <b>쓸 때</b> 내는 세금은?', onDone: () => ctx.finish(null, '교정적 조세로 세상을 더 좋게 바꿀 수 있어요!') }));
            } }));
          }
        } },

      /* ---------- 4 세금 이름 맞히기 ---------- */
      { id: 'names', t: '세계의 환경세 이름 맞히기', e: '🌏', kind: '퀴즈', d: '설명을 읽고 세금 이름을 짐작해요',
        run(root, ctx) {
          const Q = [
            { q: '🏝️ <b>제주도</b>는 섬을 찾는 사람들 때문에 생기는 쓰레기·하수 처리 비용을 관광객에게 받기 위해 모든 관광객에게 부과하는 세금을 추진하고 있어요. 이름은?', o: ['입도세', '숙박세', '항공환경세'], a: 0, why: '섬에 들어오는 사람에게 부과해서 "입도세"라고 불러요.' },
            { q: '🏛️ <b>로마</b>는 관광객이 버리는 쓰레기 때문에 고심하다가, 시내 호텔에 머무는 관광객에게 호텔 등급에 따라 1~7유로를 부과해요. 이름은?', o: ['입도세', '숙박세', '탄소세'], a: 1, why: '호텔 등에 묵을 때 내는 세금이라 숙박세예요.' },
            { q: '✈️ 온실가스를 내뿜는 <b>항공기 이용을 줄이기</b> 위해 공항을 이용하는 승객에게 부과하는 세금은?', o: ['항공환경세', '설탕세', '숙박세'], a: 0, why: '항공 + 환경을 위한 세금이에요.' },
            { q: '🏭 화석연료를 쓸 때 <b>탄소 함유량</b>에 따라 부과하여 이산화탄소 배출을 줄이는 세금은?', o: ['탄소세', '설탕세', '입도세'], a: 0, why: '탄소 배출을 줄이려는 대표적인 환경세예요.' },
            { q: '🍬 설탕 등 <b>당류가 들어간 식품</b>에 부과해 당뇨병, 비만 같은 질병을 줄이려는 세금은?', o: ['소금세', '설탕세', '탄소세'], a: 1, why: '노르웨이 등 여러 나라가 시행하고 있어요.' },
          ];
          root.append(W.bee('세계 곳곳에는 <b>환경과 건강</b>을 지키는 세금이 있어요. 설명을 읽고 이름을 맞혀 볼까?', 'bee-read'),
            W.quiz({ items: Q.map(x => ({ q: x.q, opts: x.o, a: x.a, why: x.why })), shuffleOpts: false, onDone: () => ctx.finish(null, '환경세는 지구와 우리 건강을 지켜요!') }));
        } },

      /* ---------- 5 새로운 세금 만들기 ---------- */
      { id: 'newtax', t: '새로운 세금 제안서 내기', e: '📮', kind: '정책 설계', d: '세심교실의 문제를 해결할 세금을 만들어요',
        run(root, ctx) {
          const probs = [
            ['🍚', '급식을 남겨서 음식물 쓰레기가 많아요', '환경부'], ['🏃', '복도에서 뛰어서 다치는 친구가 있어요', '안전행정부'], ['🗑️', '교실에 쓰레기가 자꾸 떨어져 있어요', '환경부'],
            ['📱', '쉬는 시간에 게임만 해서 운동 부족이에요', '보건복지부'], ['🔊', '시끄러워서 수업에 집중이 어려워요', '교육부'], ['✏️', '쓰고 버리는 물건이 너무 많아요', '환경부'],
          ];
          const d = { p: null, how: '', amt: 50 };
          const wiz = W.wizard([
            next => h('div.step', W.bee('먼저 우리 교실에서 <b>고치고 싶은 문제</b>를 하나 골라 봐요.', 'bee-paper'),
              h('div.prob-grid', probs.map((p, i) => h('button.prob', { onclick: e => { d.p = i; S.$$('.prob', wiz).forEach(x => x.classList.remove('on')); e.currentTarget.classList.add('on'); S.sfx('pop'); } }, h('div.pe', p[0]), h('div', p[1]), h('div.sm', '담당: ' + p[2])))),
              W.next('다음 ▶', () => { if (d.p == null) { S.toast('문제를 골라 주세요', 'bad'); return; } next(); })),
            next => {
              const ta = h('textarea', { rows: 2, placeholder: '예) 음식을 남긴 급식판의 칸이 3칸 이상이면 세금을 낸다.' });
              const amt = h('input', { type: 'number', min: 10, max: 200, value: 50, inputmode: 'numeric' });
              return h('div.step', W.bee('어떤 방법으로 세금을 정하면 좋을까요? <b>얼마</b>가 알맞을까요? (너무 크면 불공평해요!)', 'bee-paper'),
                h('div.card', h('p', h('b', probs[d.p][0] + ' ' + probs[d.p][1])), h('p', '1️⃣ 어떤 방법으로 세금을 낼까?'), ta, h('p', '2️⃣ 얼마를 내야 할까?'), h('div.inline', amt, h('b', E.cur() + ' (한 번에)'))),
                W.next('제안서 완성 ▶', () => { if (ta.value.trim().length < 6) { S.toast('방법을 조금 더 써 주세요', 'bad'); return; } d.how = ta.value.trim(); d.amt = S.clamp(Math.round(+amt.value) || 10, 10, 200); next(); }));
            },
            next => {
              const p = probs[d.p];
              return h('div.step', h('div.petition', h('div.pt-h', '📮 세심 신문고 · 세금 제안서'), h('div.pt-r', h('span', '제안자'), h('b', S.me.name)), h('div.pt-r', h('span', '교정이 필요한 상황'), h('b', p[1])),
                h('div.pt-r', h('span', '제안하는 내용'), h('b', d.how + ' (' + d.amt + E.cur() + ')')), h('div.pt-r', h('span', '관련부서'), h('b', p[2])), h('div.pt-stamp', '접수')),
                W.next('세법전에 기록하고 제출 📤', () => {
                  S.addLaw({ name: '새 세금 제안: ' + p[1].slice(0, 12), how: d.how, amount: d.amt + E.cur(), why: p[1] + ' (' + p[2] + ')' });
                  E.diary('5차시 새로운 세금 제안', p[1] + ' → ' + d.how + ' (' + d.amt + E.cur() + ')'); E.badge('newtax', '세금 제안왕', '📮');
                  ctx.finish(null, '문제를 해결하는 새로운 세금을 제안했어요!');
                }));
            },
          ]);
          root.append(wiz);
        } },
    ],
  };
})();
