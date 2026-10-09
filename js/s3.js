/* 3차시 · 세금, 공평하게 내려면? */
(function () {
  const { h, W, E, fmt } = S;

  S.sessions[3] = {
    title: '세금, 공평하게 내려면?', sub: '공평의 뜻과 조세공평주의, 정액세·비례세', e: '⚖️', color: '#4B8BD6',
    story: [
      { who: '소인이', img: '🥺', t: '난 아침도 못 먹어서 배가 너무 고파... 피자 한 조각만 더 주면 안 될까?' },
      { who: '무출이', img: '😋', t: '난 이미 배불러! 그래도 피자는 <b>똑같이</b> 나눠야 공평하지!' },
      { who: '세심이', img: 'bee-read', t: '음... 정말 똑같이 나누는 게 <b>공평</b>일까? 오늘은 <b>공평한 세금</b>이 무엇인지 알아보자!' },
    ],
    goals: ['"똑같이"와 "공평"이 어떻게 다른지 말할 수 있어요.', '정액세와 비례세의 차이를 계산으로 확인해요.', '공평한 우리 마을 세율을 직접 정해 봐요.'],
    recap: {
      term: '조세공평주의', def: '세금이 만들어지고 걷히는 과정이 모든 사람에게 공평해야 한다는 원칙. 경제적 부담능력이 같으면 세금도 같게, 부담능력이 크면 세금도 더 많이 내요.',
      points: ['<b>공평</b>은 사람마다 다른 상황과 처지(개인차)를 고려하는 것이에요.', '<b>정액세</b>는 모두 같은 금액, <b>비례세</b>는 모두 같은 비율로 걷는 세금이에요.', '같은 금액이라도 소득이 적은 사람에게는 훨씬 큰 부담이 될 수 있어요.', '세금으로 소득을 다시 나누는 것을 <b>소득재분배</b>라고 해요.'],
    },
    task: '공평한 세금을 위해 세심교실의 세율을 정해요. 추가로 만들 수 있는 세금(예: 급식을 남긴 만큼 내는 환경 보호세)도 회의로 정해 세법전에 적고 교실에 게시해요.',
    next: '다음 시간에는 "세금이 어디에 쓰일까?"에 대해 알아봐요!',
    activities: [
      /* ---------- 1 상자 나누기 ---------- */
      { id: 'boxes', t: '울타리 너머로 야구 보기', e: '📦', kind: '실험', d: '상자를 어떻게 나누면 모두가 경기를 볼 수 있을까요?',
        run(root, ctx) {
          const kids = [{ n: '작은 친구', base: 2, e: '🧒' }, { n: '보통 친구', base: 3, e: '🧑' }, { n: '큰 친구', base: 4, e: '👦' }];
          const FENCE = 5, U = 30; let alloc = [0, 0, 0]; const TOTAL = 6;
          const stage = h('div.stage'), info = h('div.stage-info'), ctl = h('div.stage-ctl');
          const draw = () => {
            S.clear(stage);
            stage.append(h('div.fence', { style: { bottom: FENCE * U + 'px' } }, h('span', '울타리 (야구장이 보여요)')));
            kids.forEach((k, i) => {
              const top = k.base + alloc[i], sees = top >= FENCE;
              const col = h('div.kidcol',
                ...Array.from({ length: alloc[i] }, () => h('div.boxu', '📦')),
                h('div.kid-body', { style: { height: k.base * U + 'px' } }, k.e));
              stage.append(h('div.kidwrap', col, h('div.kid-n', k.n + ' ' + (sees ? '😄 보여요' : '😢 안 보여요'))));
            });
            const left = TOTAL - alloc.reduce((a, b) => a + b, 0);
            const all = kids.every((k, i) => k.base + alloc[i] >= FENCE);
            info.innerHTML = `남은 상자 <b>${left}</b>개 · ` + (all ? '🎉 모두 경기를 볼 수 있어요!' : '아직 못 보는 친구가 있어요');
            S.clear(ctl);
            kids.forEach((k, i) => ctl.append(h('div.kc', h('b', k.n), h('div.inline', h('button.btn.sm', { onclick: () => { if (alloc[i] > 0) { alloc[i]--; draw(); } } }, '－'), h('b', alloc[i] + '개'), h('button.btn.sm', { onclick: () => { if (left > 0) { alloc[i]++; draw(); } else S.toast('상자를 다 썼어요'); } }, '＋')))));
            if (all && left >= 0 && !draw.done && draw.mine) { draw.done = true; S.sfx('win'); S.confetti(40); done(); }
          };
          draw.mine = false;
          const eq = h('button.btn.blue', { onclick: () => { alloc = [2, 2, 2]; draw.mine = false; draw(); } }, '① 똑같이 2개씩 나누기');
          const own = h('button.btn.green', { onclick: () => { alloc = [0, 0, 0]; draw.mine = true; draw(); S.toast('각자 꼭 필요한 만큼 나눠 보세요!'); } }, '② 내가 직접 나누기');
          root.append(W.bee('울타리 너머 야구 경기를 보려면 <b>눈높이가 울타리(5칸)</b> 이상이어야 해요. 상자는 모두 <b>6개</b>! 어떻게 나누면 좋을까?', 'bee-look'), h('div.center.inline.cc', eq, own), stage, info, ctl);
          draw();
          function done() {
            root.append(h('div.card', h('h3', '💡 알게 된 점'), h('p', { html: '<b>똑같이</b> 나누면 작은 친구는 경기를 볼 수 없었어요. 큰 친구는 상자가 없어도 볼 수 있는데 말이죠!' }), h('p', { html: '<b>공평</b>은 사람마다의 <b>키(처지)가 다른 점</b>을 고려해 필요한 만큼 나누는 거예요.' })));
            root.append(W.quiz({ items: [
              { q: '배가 고픈 소인이와 배부른 무출이에게 피자를 똑같이 나눠 주었어요. 이것은 "공평"한 걸까요?', opts: ['네, 똑같이 나눴으니 공평해요', '아니요, 사람의 상황을 고려해야 공평해요'], a: 1, why: '공평은 개인차를 고려해 함께 더 나은 결과를 만들려는 거예요.' },
              { q: '"평등(똑같이)"과 "공평"의 차이로 알맞은 것은?', opts: ['공평은 사람마다 다른 처지를 고려해요', '공평은 무조건 모두에게 같은 양을 줘요', '공평과 평등은 완전히 같아요'], a: 0, why: '누구에게나 똑같이 나누는 것이 아니라, 사람의 차이를 고려해요.' },
            ], onDone: () => ctx.finish(null, '공평은 모두가 함께 더 나은 결과를 만드는 거예요!') }));
          }
        } },

      /* ---------- 2 정액세 vs 비례세 ---------- */
      { id: 'calc', t: '정액세 vs 비례세 계산기', e: '🧮', kind: '계산', d: '같은 세금, 다른 부담! 직접 계산해 봐요',
        run(root, ctx) {
          const A = 9500, B = 500; let mode = 'flat';
          const calc = { flat: v => 500, prop: v => Math.round(v * .10), prog: v => { let t = 0; const br = [[1000, .05], [5000, .10], [1e9, .20]]; let prev = 0; for (const [lim, r] of br) { if (v > prev) t += (Math.min(v, lim) - prev) * r; prev = lim; } return Math.round(t); } };
          const names = { flat: '정액세 (모두 500만 심)', prop: '비례세 (모두 10%)', prog: '누진세 (많이 벌수록 높은 비율)' };
          const view = h('div.calcview'), tabs = h('div.tabs');
          Object.keys(names).forEach(k => tabs.append(h('button.tab', { class: k === mode ? 'on' : '', onclick: e => { mode = k; S.$$('.tab', tabs).forEach(x => x.classList.remove('on')); e.currentTarget.classList.add('on'); S.sfx('pop'); draw(); } }, names[k].split(' ')[0])));
          const draw = () => {
            S.clear(view);
            view.append(h('p.center', h('b', names[mode])));
            [['A', A, '🧑‍💼'], ['B', B, '🧒']].forEach(([n, v, e]) => {
              const t = calc[mode](v), rest = v - t, pr = (t / v * 100);
              view.append(h('div.cv-card', h('div.cv-h', h('span', `${e} ${n}씨 연소득`), h('b', fmt(v) + '만 심')),
                h('div.cv-bar', h('i.rest', { style: { width: (rest / v * 100) + '%' } }, rest > 0 ? '남은 돈 ' + fmt(rest) : ''), h('i.tx', { style: { width: (t / v * 100) + '%' } }, t / v > .08 ? '세금 ' + fmt(t) : '')),
                h('div.cv-r', h('span', `세금 ${fmt(t)}만 심`), h('span', `남은 돈 ${fmt(rest)}만 심`), h('b', `부담률 ${pr.toFixed(pr % 1 ? 1 : 0)}%`))));
            });
            view.append(h('p.sm.center', mode === 'flat' ? '😮 B씨는 번 돈을 모두 세금으로 내야 해요! 부담이 너무 커요.' : mode === 'prop' ? '👍 같은 비율이라 부담률은 같고, 많이 번 A씨가 세금도 더 많이 내요.' : '🌟 많이 번 사람이 더 높은 비율을 내서, 소득이 적은 B씨의 부담이 더 가벼워요.'));
          };
          root.append(W.bee('A씨는 연소득 <b>9,500만 심</b>, B씨는 <b>500만 심</b>이에요. 세금을 걷는 방법을 바꿔 가며 부담이 어떻게 달라지는지 살펴봐요!', 'bee-paper'), tabs, view);
          draw();
          const qs = [
            { q: '정액세(모두 500만 심)일 때 B씨가 세금을 내고 남은 돈은?', opts: ['0심', '450만 심', '500만 심'], a: 0, why: '500 − 500 = 0! B씨는 하나도 남지 않아요.' },
            { q: '정액세일 때 A씨의 세금 부담률은 약 몇 %일까요? (500 ÷ 9,500 × 100)', opts: ['약 5.3%', '10%', '100%'], a: 0, why: '5.263…% 예요. B씨는 100%라 훨씬 큰 부담이죠.' },
            { q: '비례세(10%)일 때 A씨가 내는 세금은?', opts: ['50만 심', '500만 심', '950만 심'], a: 2, why: '9,500 × 0.1 = 950만 심!' },
            { q: '비례세(10%)일 때 B씨의 남은 돈은?', opts: ['450만 심', '500만 심', '0심'], a: 0, why: '500 − 50 = 450만 심이에요.' },
            { q: '두 방법 중 소득이 적은 사람에게 더 부담이 큰 것은?', opts: ['정액세', '비례세'], a: 0, why: '정액세는 소득이 적을수록 부담률이 커져요.' },
          ];
          root.append(h('h3.sec', '✏️ 직접 풀어 볼까요?'), W.quiz({ items: qs, onDone: () => { E.badge('calc', '세금 계산왕', '🧮'); ctx.finish(null, '정액세는 같은 금액, 비례세는 같은 비율! 부담이 달라져요.'); } }));
        } },

      /* ---------- 3 우리 마을 세율 정하기 ---------- */
      { id: 'rate', t: '우리 마을 소득세율 정하기', e: '🎚️', kind: '정책 설계', d: '직업별 월급으로 공평한 세율을 찾아요',
        run(root, ctx) {
          const jobs = ['farmer', 'police', 'teacher', 'doctor'].map(S.job);
          let mode = 'prop', flat = 60, pct = 10, br = [5, 10, 20];
          const view = h('div.ratebox'), ctrl = h('div.card');
          const tx = (v) => mode === 'flat' ? flat : mode === 'prop' ? Math.round(v * pct / 100) : Math.round(Math.min(v, 500) * br[0] / 100 + Math.max(0, Math.min(v, 800) - 500) * br[1] / 100 + Math.max(0, v - 800) * br[2] / 100);
          const redraw = () => {
            S.clear(view);
            const rows = jobs.map(j => { const t = tx(j.pay); return { j, t, r: j.pay - t, pr: t / j.pay * 100 }; });
            view.append(h('table.law-table.ratetable', h('thead', h('tr', ['직업', '월급', '세금', '남은 돈', '부담률'].map(x => h('th', x)))),
              h('tbody', rows.map(x => h('tr', h('td', x.j.e + ' ' + x.j.n), h('td', fmt(x.j.pay)), h('td', fmt(x.t)), h('td', fmt(x.r)), h('td', x.pr.toFixed(1) + '%'))))));
            const inc = rows.every((x, i) => i === 0 || x.t >= rows[i - 1].t), lowOk = rows[0].pr <= 20, hiOk = rows[rows.length - 1].r < rows[rows.length - 1].j.pay;
            const ratioUp = rows[3].pr >= rows[0].pr;
            const score = (inc ? 1 : 0) + (lowOk ? 1 : 0) + (ratioUp ? 1 : 0) + (rows[3].pr <= 40 ? 1 : 0);
            view.append(h('div.score', `공평 점수 ${'⭐'.repeat(score)}${'☆'.repeat(4 - score)}`), h('ul.sm', h('li', (inc ? '✅' : '❌') + ' 월급이 많은 사람이 세금도 더 많이 내요'), h('li', (lowOk ? '✅' : '❌') + ' 월급이 가장 적은 사람의 부담률이 20% 이하예요'), h('li', (ratioUp ? '✅' : '❌') + ' 더 잘 버는 사람의 부담률이 같거나 더 높아요'), h('li', (rows[3].pr <= 40 ? '✅' : '❌') + ' 너무 높은 세율(40% 초과)이 없어요')));
            view.score = score;
          };
          const modes = W.chips({ options: ['정액세', '비례세', '누진세'], selected: ['비례세'], onChange: v => { mode = { '정액세': 'flat', '비례세': 'prop', '누진세': 'prog' }[v[0]]; drawCtrl(); } });
          const slot = h('div');
          const drawCtrl = () => {
            S.clear(slot);
            const mk = (lab, val, min, max, fn, unit) => { const o = h('b', val + unit); slot.append(h('label.sl', lab, h('div.inline', h('input', { type: 'range', min, max, value: val, oninput: e => { fn(+e.target.value); o.textContent = e.target.value + unit; redraw(); } }), o))); };
            if (mode === 'flat') mk('모두 내는 금액', flat, 0, 300, v => (flat = v), E.cur());
            else if (mode === 'prop') mk('모두 같은 세율', pct, 0, 60, v => (pct = v), '%');
            else { mk('500까지 세율', br[0], 0, 60, v => (br[0] = v), '%'); mk('501~800 세율', br[1], 0, 60, v => (br[1] = v), '%'); mk('800 초과 세율', br[2], 0, 60, v => (br[2] = v), '%'); }
            redraw();
          };
          ctrl.append(h('h3', '🎚️ 세금 방법과 세율'), modes, slot);
          root.append(W.bee('세심마을 직업들의 <b>월급</b>이에요. 세율을 조절해서 <b>공평 점수 ⭐⭐⭐⭐</b>을 받아 봐요!', 'bee-hold'), ctrl, view);
          drawCtrl();
          const why = h('textarea', { rows: 2, placeholder: '이렇게 정한 까닭을 써 보세요. 예) 월급이 많은 사람이 더 많이 내야 공평하기 때문이다.' });
          root.append(h('div.card', h('h3', '📝 이 세율을 세법전에 제안하기'), why, h('div.nextrow', h('button.btn.primary', { onclick: () => {
            if (why.value.trim().length < 6) { S.toast('까닭을 조금 더 써 주세요', 'bad'); return; }
            if (view.score < 3) { S.toast('공평 점수 ⭐ 3개 이상이 되도록 조절해 보세요!', 'bad'); return; }
            const how = mode === 'flat' ? `모두 ${flat}${E.cur()}` : mode === 'prop' ? `번 돈의 ${pct}%` : `누진: ${br.join('% / ')}%`;
            S.addLaw({ name: '소득세 제안', how, why: why.value.trim() }); E.diary('3차시 공평한 소득세', `${how} — ${why.value.trim()}`);
            E.badge('rate', '공평한 세율 설계자', '⚖️'); S.sfx('ok');
            ctx.finish(null, '우리 반 소득세 제안이 세법전에 기록됐어요!');
          } }, '세법전에 제안하기'))));
        } },

      /* ---------- 4 소득재분배 ---------- */
      { id: 'redis', t: '소득재분배 마법', e: '🔄', kind: '시뮬레이션', d: '세금을 걷어 함께 쓰면 격차가 어떻게 달라질까요?',
        run(root, ctx) {
          const fam = [{ n: '새싹네', e: '🌱', inc: 300 }, { n: '나무네', e: '🌳', inc: 800 }, { n: '숲네', e: '🌲', inc: 1500 }];
          const RATE = .2, pool = fam.reduce((a, f) => a + f.inc * RATE, 0), share = Math.round(pool / 3);
          let step = 0;
          const board = h('div.redis'), bt = h('div.nextrow');
          const draw = () => {
            S.clear(board); const max = 1600;
            fam.forEach(f => {
              const tax = Math.round(f.inc * RATE);
              const v = step === 0 ? f.inc : f.inc - tax + (step === 2 ? share : 0);
              board.append(h('div.rd-row', h('span.rd-n', f.e + ' ' + f.n), h('div.rd-bar', h('i', { style: { width: (v / max * 100) + '%' } }, fmt(v))), step ? h('span.sm', `세금 -${tax}` + (step === 2 ? ` · 혜택 +${share}` : '')) : null));
            });
            const vals = fam.map(f => step === 0 ? f.inc : f.inc - Math.round(f.inc * RATE) + (step === 2 ? share : 0));
            board.append(h('p.center', `가장 많은 집 ÷ 가장 적은 집 = <b>${(Math.max(...vals) / Math.min(...vals)).toFixed(1)}배</b>`.replace(/<\/?b>/g, '') ));
            S.clear(bt);
            if (step === 0) bt.append(h('button.btn.primary.big', { onclick: () => { step = 1; S.sfx('coin'); draw(); } }, '① 소득의 20% 세금 걷기'));
            else if (step === 1) bt.append(h('div.sm', `걷은 세금 합계 ${fmt(pool)} 심 → 도서관, 병원, 학교처럼 모두가 쓰는 곳에 사용`), h('button.btn.primary.big', { onclick: () => { step = 2; S.sfx('ok'); draw(); } }, '② 모두를 위해 똑같이 쓰기'));
            else { bt.append(h('div.card', h('p', { html: '세금을 걷어 모두를 위한 서비스(혜택 ' + share + '심씩)로 쓰니, 가장 많은 집과 가장 적은 집의 <b>차이가 줄었어요!</b>' }), h('b', '👉 이것이 세금의 또 다른 중요한 기능, 소득재분배예요.'))); if (!draw.d) { draw.d = 1; root.append(W.word({ answer: '소득재분배', choices: ['소득재분리', '소득재배달', '소득다시쓰기'], desc: '소득을 <b>다시 나누는</b> 세금의 기능은?', onDone: () => ctx.finish(null, '세금은 소득의 차이를 줄이는 역할도 해요!') })); } }
          };
          root.append(W.bee('세 가족의 한 달 소득이에요. 세금을 걷어 함께 쓰면 어떻게 달라질까?', 'bee-money'), board, bt);
          draw();
        } },

      /* ---------- 5 공평 사례 + 초성 ---------- */
      { id: 'cases', t: '공평 사례 찾기', e: '🪑', kind: '게임', d: '우리 주변의 공평한 배려를 찾아요',
        run(root, ctx) {
          root.append(W.bee('우리 주변에는 <b>사람의 처지를 고려한 공평</b>한 모습이 많아요. 카드를 보고 알맞은 곳에 넣어 봐!', 'bee-hello'));
          const it = (t, e, b, why) => ({ t, e, b, why, hint: b === 'fair' ? '사람의 차이를 고려했나요?' : '모두에게 같은 것을 준 경우예요.' });
          root.append(W.sort({
            buckets: [{ id: 'fair', label: '공평해요', emoji: '⚖️', cls: 'green', sub: '차이를 고려' }, { id: 'same', label: '똑같이만', emoji: '🟰', cls: 'honey', sub: '차이를 무시' }],
            items: [it('임산부·아이 동반 가족 좌석', '🤰', 'fair', '꼭 필요한 사람을 배려했어요'), it('장애인·노약자·임산부가 먼저 나가는 출구', '🚪', 'fair', '이동이 불편한 분을 배려했어요'), it('키가 다른 모두에게 같은 크기의 신발 주기', '👟', 'same'), it('휠체어 경사로 설치', '♿', 'fair', '계단을 오르기 어려운 사람을 배려했어요'), it('모두에게 똑같은 크기의 옷 나눠 주기', '👕', 'same'), it('시력이 나쁜 친구는 앞자리에 앉기', '👓', 'fair', '칠판이 잘 보이도록 배려했어요'), it('배가 고픈 사람도 부른 사람도 피자 한 조각씩', '🍕', 'same')],
            onDone: () => {
              root.append(W.word({ answer: '조세공평주의', choices: ['조세법률주의', '조세평등주의', '세금공짜주의'], desc: '세금이 만들어지고 걷히는 과정이 모든 사람에게 <b>공평</b>해야 한다는 원칙은?', hint: '경제적 부담능력이 크면 세금도 많이!', onDone: () => ctx.finish(null, '조세공평주의: 경제적 부담능력에 맞게!') }));
            },
          }));
        } },
    ],
  };
})();
