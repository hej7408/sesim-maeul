/* 4차시 · 세금, 어디에 쓰일까요? */
(function () {
  const { h, W, E, fmt, shuffle } = S;

  const SECTORS = {
    edu: { n: '교육', e: '📚', c: '#4B8BD6' }, safe: { n: '안전·국방', e: '🛡️', c: '#E5484D' }, wel: { n: '복지·보건', e: '❤️', c: '#E96AA0' },
    cul: { n: '문화·여가', e: '🎨', c: '#B07CE8' }, env: { n: '환경·교통', e: '🚌', c: '#2FA66E' },
  };
  const USES = [
    ['학교 급식', '🍱', 'edu'], ['교과서와 학교 건물', '🏫', 'edu'], ['도서관 책', '📚', 'edu'],
    ['소방차와 소방관', '🚒', 'safe'], ['경찰관 월급', '👮', 'safe'], ['우리나라를 지키는 군인', '🪖', 'safe'],
    ['아이들을 위한 돌봄·지원', '🧸', 'wel'], ['어르신 일자리', '👵', 'wel'], ['보건소·병원 지원', '🏥', 'wel'],
    ['박물관과 미술관', '🖼️', 'cul'], ['공연장·축제', '🎪', 'cul'], ['놀이터·공원', '🛝', 'cul'],
    ['환경미화와 재활용센터', '♻️', 'env'], ['버스와 지하철', '🚇', 'env'], ['도로와 다리', '🛣️', 'env'],
  ];

  S.sessions[4] = {
    title: '세금, 어디에 쓰일까요?', sub: '세금 사용 과정, 예산 짜기, 보통세와 목적세', e: '🏗️', color: '#2FA66E',
    story: [
      { who: '세연이', img: 'kid-girl', t: '세금으로 가로등도 만들고 학교도 짓는다고 했잖아. 그럼 <b>누가 어디에 쓸지 정하는 거야?</b>' },
      { who: '무출이', img: 'kid-boy', t: '대통령이 마음대로 쓰면 어떡해? 😨' },
      { who: '세심이', img: 'bee-paper', t: '걱정 마! 세금을 걷을 때처럼 <b>쓸 때도 국회의 허락</b>을 받아야 해. 오늘은 우리가 <b>예산</b>을 직접 짜 볼 거야!' },
    ],
    goals: ['세금이 쓰이는 분야를 알아요.', '세금을 쓰는 과정(예산 편성)을 순서대로 말할 수 있어요.', '보통세와 목적세의 차이를 알아요.', '우리 반 예산안을 직접 만들어 봐요.'],
    recap: {
      term: '예산', def: '정부가 한 해 동안 거두어들일 돈(수입)과 쓸 돈(지출)을 미리 계획한 것',
      points: ['세금을 거둘 때뿐 아니라 <b>세금을 쓸 때에도 국회의 심의</b>를 거쳐야 해요.', '정부 기관이 계획을 세우고 → 기획재정부가 조정하고 → 국회가 점검·승인한 뒤 → 각 기관이 계획대로 써요.', '쓰임이 정해진 세금은 <b>목적세</b>, 어디에든 쓸 수 있는 세금은 <b>보통세</b>예요.', '세금을 걷는 주체에 따라 <b>국세</b>(중앙정부)와 <b>지방세</b>(지방자치단체)로 나뉘어요.'],
    },
    task: '세심교실 속 세금이 가장 먼저 투입되어야 할 사업을 찾고, 부서별 사업계획을 모아 예산안을 완성해 발표해요. 필요한 세금을 계산해 부족한 세수를 어떻게 마련할지 토의해요.',
    next: '다음 시간에는 "물건을 살 때 내는 세금"에 대해 알아봐요!',
    activities: [
      /* ---------- 1 분야 분류 ---------- */
      { id: 'sector', t: '우리의 세금은 이렇게 쓰여요', e: '🗂️', kind: '분류 게임', d: '세금이 쓰이는 일을 분야별로 나눠요',
        run(root, ctx) {
          root.append(W.bee('세금이 쓰이는 곳은 정말 많아요! 카드를 보고 <b>어느 분야</b>에 쓰이는지 골라 봐!', 'bee-read'));
          root.append(W.sort({
            buckets: Object.entries(SECTORS).map(([id, s]) => ({ id, label: s.n, emoji: s.e })),
            items: shuffle(USES).slice(0, 12).map(([t, e, b]) => ({ t, e, b, hint: '이 일이 주로 누구를 위한 일인지 생각해 봐요.', why: SECTORS[b].n + ' 분야' })),
            onDone: () => ctx.finish(null, '세금은 교육, 안전, 복지, 문화, 환경 등 여러 곳에 골고루 쓰여요.'),
          }));
        } },

      /* ---------- 2 쓰는 과정 ---------- */
      { id: 'process', t: '세금은 어떻게 쓰일까?', e: '🔢', kind: '순서 퍼즐', d: '세금 쓸 곳이 정해지는 과정을 맞혀요',
        run(root, ctx) {
          root.append(W.cards([{ e: '🏛️', t: '세금을 쓸 때에도!', body: '세금을 걷을 때처럼 세금을 <b>사용할 때에도 국회의 허락</b>을 받아야 해요. 이것이 조세법률주의의 정신이에요.' }]));
          root.append(h('h3.sec', '🔢 순서대로 눌러 보세요'));
          root.append(W.order({ steps: [
            '정부 여러 기관이 필요한 세금 사용 계획을 작성해요',
            '기획재정부가 회의를 통해 계획을 수정하고 대통령에게 보고해요',
            '정부가 예산안을 국회에 제출해요',
            '국회가 정부 여러 기관의 계획을 점검하고 승인해요',
            '각 정부 기관이 계획에 따라 예산을 사용해요',
            '다 쓰고 나면 얼마를 걷고 썼는지 결산해요',
          ], onDone: () => ctx.finish(null, '예산 편성 과정을 순서대로 알았어요!') }));
        } },

      /* ---------- 3 예산 짜기 ---------- */
      { id: 'budget', t: '세심교실 예산안 만들기', e: '💼', kind: '정책 설계', d: '한정된 세금으로 부서별 사업을 골라요',
        run(root, ctx) {
          const TOTAL = 10000;
          const depts = [
            { n: '교육부', e: '📚', p: [['골든벨 대회', 3000], ['독서 퀴즈 대회', 2000], ['자격증 제도 운영', 4000], ['친구 공부 도우미', 2000]] },
            { n: '환경부', e: '🌱', p: [['교실 화분 가꾸기', 1500], ['재활용 분리함 설치', 2500], ['쓰레기 줍기 캠페인', 1000], ['급식 잔반 줄이기 앱', 3000]] },
            { n: '보건복지부', e: '❤️', p: [['건강 스트레칭 시간', 1000], ['도움이 필요한 친구 돕기', 2500], ['교실 응급상자 마련', 1500], ['우리 반 칭찬 우체통', 2000]] },
            { n: '문화체육부', e: '🎨', p: [['학급 체육대회', 3500], ['교실 영화관의 날', 2500], ['학급 벽화 꾸미기', 2000], ['장기자랑 무대', 1500]] },
            { n: '안전행정부', e: '🛡️', p: [['교실 안전 지킴이', 1000], ['복도 질서 신호등', 2000], ['안전 교육 체험', 2500], ['학급 규칙 게시판', 500]] },
          ];
          const sel = new Set();
          const sumEl = h('div.budget-sum'), grid = h('div.dgrid');
          const total = () => [...sel].reduce((a, k) => { const [d, p] = k.split('-').map(Number); return a + depts[d].p[p][1]; }, 0);
          const upd = () => {
            const t = total(), left = TOTAL - t;
            sumEl.innerHTML = `총 예산 <b>${fmt(TOTAL)}</b> · 쓴 돈 <b>${fmt(t)}</b> · 남은 돈 <b class="${left < 0 ? 'neg' : ''}">${fmt(left)}</b>`;
            sumEl.nextSibling && 0; S.$$('.pj', grid).forEach(b => b.classList.toggle('on', sel.has(b.dataset.k)));
          };
          depts.forEach((d, di) => grid.append(h('div.dept', h('h4', d.e + ' ' + d.n),
            d.p.map((p, pi) => h('button.pj', { 'data-k': di + '-' + pi, onclick: () => { const k = di + '-' + pi; if (sel.has(k)) sel.delete(k); else sel.add(k); S.sfx('pop'); upd(); } }, h('span', p[0]), h('b', fmt(p[1])))))));
          const submit = h('button.btn.primary.big', { onclick: () => {
            const t = total();
            const empty = depts.filter((d, di) => ![...sel].some(k => +k.split('-')[0] === di));
            if (t > TOTAL) { S.toast('예산을 넘었어요! 사업을 줄여 보세요', 'bad'); S.sfx('bad'); return; }
            if (empty.length) { S.toast(`${empty.map(e => e.n).join(', ')}에도 사업이 하나는 있어야 해요`, 'bad'); S.sfx('bad'); return; }
            const picked = [...sel].map(k => { const [d, p] = k.split('-').map(Number); return depts[d].p[p][0]; });
            E.diary('4차시 우리 반 예산안', `총 ${fmt(t)}${E.cur()} · ` + picked.join(', '));
            const per = Math.ceil(TOTAL / 20);
            S.modal({ title: '🏛️ 국회 심의 결과', body: h('div.center', h('div.big-emoji', '✅'), h('h3', '예산안이 통과되었어요!'), h('p', `선택한 사업 ${picked.length}개, 쓰는 돈 ${E.money(t)}`), h('p.sm', { html: `이 예산을 마련하려면 학급 20명이 <b>1인당 약 ${per}${E.cur()}</b>의 세금을 내야 해요. 어떤 세금을 걷으면 좋을지 친구들과 이야기해 봐요!` })), actions: [{ label: '좋아요', cls: 'primary', fn: () => ctx.finish(null, '예산안을 직접 짜 보았어요!') }] });
          } }, '📤 예산안 국회에 내기');
          root.append(W.bee(`세심교실 예산은 <b>${fmt(TOTAL)}${E.cur()}</b>! 5개 부서마다 사업을 하나 이상 골라야 해요. 예산을 넘으면 안 돼요!`, 'bee-paper2'), sumEl, grid, h('div.nextrow', submit));
          upd();
        } },

      /* ---------- 4 놀이 ---------- */
      { id: 'play', t: '세금 사용 놀이 2가지', e: '🃏', kind: '게임', d: '같은 분야 카드 찾기 · 몸으로 말해요',
        run(root, ctx) {
          let memDone = false, chaDone = false;
          const chk = () => { if (memDone && chaDone) ctx.finish(null, '두 가지 놀이를 모두 해 봤어요!'); };
          const tabs = h('div.tabs'), body = h('div');
          const show = id => { S.clear(body); (id === 'm' ? memory : charade)(body); S.$$('.tab', tabs).forEach((t, i) => t.classList.toggle('on', (i === 0) === (id === 'm'))); };
          tabs.append(h('button.tab.on', { onclick: () => show('m') }, '🃏 같은 분야 찾기'), h('button.tab', { onclick: () => show('c') }, '🕺 몸으로 말해요'));
          root.append(tabs, body); show('m');

          function memory(box) {
            const secs = shuffle(Object.keys(SECTORS)).slice(0, 3);
            const cards = shuffle(secs.flatMap(s => shuffle(USES.filter(u => u[2] === s)).slice(0, 4).map(u => ({ t: u[0], e: u[1], s }))));
            let first = null, lock = false, moves = 0, got = 0;
            const info = h('div.center', '짝 맞춘 카드 0 / 12 · 시도 0번');
            const grid = h('div.memgrid');
            cards.forEach(c => {
              const el = h('button.memcard', { onclick: () => {
                if (lock || el.classList.contains('open') || el.classList.contains('done')) return;
                el.classList.add('open'); S.sfx('pop');
                if (!first) { first = { c, el }; return; }
                moves++; const a = first; first = null;
                if (a.c.s === c.s) {
                  S.sfx('ok'); [a.el, el].forEach(x => { x.classList.add('done'); x.style.setProperty('--c', SECTORS[c.s].c); }); got += 2;
                  // 같은 분야 카드는 2장씩 모아지면 사라지지 않고 분야 색으로 표시
                  S.floatText(el, SECTORS[c.s].n);
                } else { lock = true; S.sfx('bad'); setTimeout(() => { a.el.classList.remove('open'); el.classList.remove('open'); lock = false; }, 900); }
                info.textContent = `짝 맞춘 카드 ${got} / 12 · 시도 ${moves}번`;
                if (got === 12) { S.confetti(40); S.toast('🎉 모든 카드를 맞혔어요!', 'good'); memDone = true; chk(); }
              } }, h('div.mc-back', '❓'), h('div.mc-front', h('div.mc-e', c.e), h('div.mc-t', c.t)));
              grid.append(el);
            });
            box.append(h('p.center', '카드 2장을 뒤집어 <b>세금이 쓰이는 분야가 같으면</b> 성공!'.replace(/<\/?b>/g, '')), info, grid);
          }

          function charade(box) {
            const deck = shuffle(['소방관이 불을 끄는 모습', '환경미화원이 길을 청소하는 모습', '경찰관이 교통정리를 하는 모습', '도서관에서 책 읽기', '병원에서 진찰받기', '군인이 경례하기', '버스를 타고 가기', '박물관에서 작품 감상하기', '놀이터에서 그네 타기', '선생님이 수업하기', '신호등을 보고 횡단보도 건너기', '도로를 공사하는 모습']);
            let i = 0, ok = 0, t = 30, timer = null;
            const card = h('div.charcard'), tm = h('div.chartime'), res = h('div.center');
            const stop = () => { clearInterval(timer); timer = null; };
            const draw = () => { card.textContent = deck[i] || '끝!'; tm.textContent = `⏱️ ${t}초`; res.textContent = `맞힌 카드 ${ok}장`; };
            const startT = () => { stop(); t = 30; draw(); timer = setInterval(() => { t--; tm.textContent = `⏱️ ${t}초`; if (t <= 0) { stop(); S.sfx('bad'); S.toast('시간 끝! 다음 카드로'); nextCard(false); } }, 1000); };
            const nextCard = good => { if (good) { ok++; S.sfx('ok'); } i++; if (ok >= 3 && !chaDone) { chaDone = true; chk(); } if (i >= deck.length) { stop(); card.textContent = '🎉 모든 카드를 했어요!'; return; } startT(); };
            S.cleanup = stop;
            box.append(h('p.center', '카드에 적힌 <b>세금 사용 모습</b>을 <b>몸으로만</b> 표현해요. 친구가 맞히면 "맞혔어요!"'.replace(/<\/?b>/g, '')), tm, card, res,
              h('div.center.inline.cc', h('button.btn.green.big', { onclick: () => nextCard(true) }, '⭕ 맞혔어요!'), h('button.btn.big', { onclick: () => nextCard(false) }, '⏭️ 넘어가요')), h('p.sm.center', '3장 이상 맞히면 활동 완료! (소리내면 안 돼요 🤫)'));
            startT();
          }
        } },

      /* ---------- 4-2 세금통 게임 ---------- */
      { id: 'taxtong', t: '세금통 카드 게임', e: '🪣', kind: '카드 게임', d: '세금이 쓰이는 곳 카드로 짝을 찾아요',
        run(root, ctx) {
          root.append(W.bee('세금이 쓰이는 곳 카드 <b>40장</b>으로 하는 <b>세금통 게임</b>이에요! 컴퓨터 친구들과 한 판 하고 나면 놀이터에서도 언제든 할 수 있어요.', 'bee-hello'));
          const box = h('div'); root.append(box);
          S.TaxTong.menu(box, { onEnd: () => ctx.finish(null, '세금이 쓰이는 곳 카드를 모아 봤어요!') });
        } },

      /* ---------- 5 보통세 목적세 ---------- */
      { id: 'taxtype', t: '세금 분류 왕: 국세·지방세, 보통세·목적세', e: '🧩', kind: '분류 게임', d: '세금 이름표를 알맞은 상자에 넣어요',
        run(root, ctx) {
          root.append(W.cards([{ e: '🧭', t: '어떻게 구분할까?', body: '<b>중앙정부</b>가 걷으면 <b>국세</b>, <b>지방자치단체</b>가 걷으면 <b>지방세</b>예요.<br><b>보통세</b>는 쓰임이 정해지지 않았고, <b>목적세</b>는 쓰임이 미리 정해진 세금이에요.' }]));
          const T = (t, b, why) => ({ t, b, why, hint: '국세인지 지방세인지, 쓰임이 정해졌는지 생각해 봐요.' });
          const all = [
            T('소득세', 'cn', '소득세: 번 돈에 매기는 중앙정부의 보통세'), T('법인세', 'cn', '법인세: 회사의 이익에 매기는 국세(보통세)'), T('상속세', 'cn', '상속세: 국세(보통세)'), T('부가가치세', 'cn', '부가가치세: 소비에 매기는 국세(보통세)'), T('종합부동산세', 'cn'), T('주세', 'cn', '주세: 술에 매기는 국세(보통세)'), T('증권거래세', 'cn'),
            T('취득세', 'ln', '취득세: 지방자치단체가 걷는 지방세(보통세)'), T('등록면허세', 'ln'), T('레저세', 'ln'), T('지방소비세', 'ln'),
            T('교육세', 'cp', '교육세: 교육 발전을 위해 쓰는 국세(목적세)'), T('교통에너지환경세', 'cp', '교통시설·환경보전을 위해 쓰는 국세(목적세)'), T('농어촌특별세', 'cp', '농어촌 발전을 위해 쓰는 국세(목적세)'),
            T('지방교육세', 'lp', '지역 교육기관을 위해 쓰는 지방세(목적세)'), T('지역자원시설세', 'lp', '지역 발전을 위해 쓰는 지방세(목적세)'),
          ];
          root.append(W.sort({ buckets: [{ id: 'cn', label: '국세·보통세', emoji: '🏛️', cls: 'blue', sub: '중앙정부 / 쓰임 자유' }, { id: 'ln', label: '지방세·보통세', emoji: '🏘️', cls: 'green', sub: '지자체 / 쓰임 자유' }, { id: 'cp', label: '국세·목적세', emoji: '🎯', cls: 'honey', sub: '중앙정부 / 쓰임 정해짐' }, { id: 'lp', label: '지방세·목적세', emoji: '📍', cls: 'purple', sub: '지자체 / 쓰임 정해짐' }],
            items: shuffle(all).slice(0, 10), onDone: () => ctx.finish(null, '국세·지방세, 보통세·목적세를 구분할 수 있어요!') }));
        } },

      /* ---------- 6 나라 살림 한눈에 ---------- */
      { id: 'nation', t: '나라 살림 한눈에 보기', e: '📊', kind: '자료 읽기', d: '정부 예산은 어떤 분야에 많이 쓰일까요?',
        run(root, ctx) {
          const D = [['보건·복지·고용', 289.0, '#E96AA0', '연금, 건강보험, 일자리, 아이 돌봄 지원 등'], ['일반·지방행정', 149.0, '#4B8BD6', '지방자치단체에 나눠 주는 돈과 나라 살림을 꾸리는 비용'], ['교육', 110.7, '#2FA66E', '학교와 선생님, 급식, 교육 지원'], ['국방', 73.3, '#E5484D', '우리나라를 지키는 군대와 장비'], ['산업·중소기업·에너지', 41.2, '#E0A100', '기업과 가게, 에너지 지원'], ['R&D (연구개발)', 39.5, '#B07CE8', '미래 기술을 연구하는 비용'], ['그 밖의 분야', 118.2, '#8a7d68', '도로·철도, 문화, 환경, 외교 등']];
          const total = 820.9; let sel = null;
          const info = h('div.card', '막대를 눌러 보세요 👆');
          const chart = h('div.hbars');
          D.forEach(d => chart.append(h('button.hb', { onclick: () => { info.innerHTML = `<b>${d[0]}</b> · ${d[1]}조 원 (전체의 ${(d[1] / total * 100).toFixed(1)}%)<br><span class="sm">${d[3]}</span>`; S.sfx('pop'); } },
            h('span.hb-n', d[0]), h('div.hb-bar', h('i', { style: { width: (d[1] / 289 * 100) + '%', background: d[2] } })), h('b', d[1]))));
          root.append(W.bee('2027년 정부가 계획한 <b>나라 살림(예산) 총 820.9조 원</b>이에요! 분야별로 얼마나 쓸 계획일까?', 'bee-money'), chart, info,
            h('p.sm', '※ 2027년 정부 예산안(2026년 9월 발표) 주요 분야, 단위 조 원. 언론 보도 기준 어림 자료이며 "그 밖의 분야"는 총지출에서 위 분야를 뺀 값이에요.'));
          root.append(h('h3.sec', '🧠 퀴즈'), W.quiz({ items: [
            { q: '가장 많은 예산이 쓰이는 분야는?', opts: ['국방', '보건·복지·고용', '교육'], a: 1, why: '289조 원으로 가장 커요. 국민의 건강과 생활을 돕는 일에 가장 많이 써요.' },
            { q: '우리 학교와 관련 깊은 "교육" 분야 예산은 약 몇 조 원일까요?', opts: ['약 10조 원', '약 110조 원', '약 1,100조 원'], a: 1, why: '약 110.7조 원이에요.' },
            { q: '세금은 어디에 쓰일지 어떻게 정해질까요?', opts: ['대통령 마음대로', '국회의 심의를 거쳐 법에 따라', '가장 부자인 사람이 정해요'], a: 1, why: '쓸 때에도 국회의 허락을 받아요.' },
          ], onDone: () => ctx.finish(null, '나라 살림은 복지·교육·국방 등에 쓰여요.') }));
        } },
    ],
  };
})();
