/* 6차시 · 회사도 세금을 낸다고?! */
(function () {
  const { h, W, E, fmt, shuffle } = S;
  const corpRate = () => E.settings().rates.corp, divRate = () => E.settings().rates.div;

  S.sessions[6] = {
    title: '회사도 세금을 낸다고?!', sub: '법인과 법인세, 배당소득세와 근로소득세', e: '🏭', color: '#7B6CD9',
    story: [
      { who: '세연이', img: 'kid-girl', t: '나 세심문구점을 열었어! 내가 문구점에서 번 돈에는 <b>내가 소득세</b>를 내는 거지?' },
      { who: '무출이', img: 'kid-boy', t: '음... 문구점도 <b>회사</b>니까 세금을 내야 하는 거 아닐까?' },
      { who: '세심이', img: 'bee-paper2', t: '좋은 질문이야! 회사는 <b>"법인"</b>이라서 <b>법인세</b>를 내. 직접 가게를 열어 보면서 알아볼까? 🏪' },
    ],
    goals: ['법인이 무엇인지, 법인도 세금을 낸다는 것을 알아요.', '회사의 이익이 법인세, 배당소득세, 근로소득세로 이어지는 흐름을 이해해요.', '세심문구점을 직접 운영하며 사업보고서를 써 봐요.'],
    recap: {
      term: '법인세', def: '법인(회사)이 영업을 해서 이익이 생기면 내는 세금',
      points: ['<b>법인</b>은 법에 의해 사람의 자격을 인정받은 단체예요. 우리가 아는 회사는 대부분 법인이에요.', '회사의 이익은 사장 개인의 것이 아니라 <b>법인의 것</b>이어서, 법인이 <b>법인세</b>를 내요.', '회사가 사장님에게 이익을 나누어 주는 것을 <b>배당</b>이라 하고, 배당에 대한 세금은 <b>배당소득세</b>, 일하고 받는 임금에 대한 세금은 <b>근로소득세</b>예요.', '손해가 났을 땐 법인세를 내지 않아요.'],
    },
    task: '학급에서 토의해 창업 전 우리 교실의 법인세율을 정하고, 개인 또는 모둠으로 사업계획서를 써서 창업 활동을 한 뒤 사업보고서를 쓰고 법인세를 납부해요.',
    next: '다음 시간에는 "집을 살 때, 갖고 있을 때 내는 세금"에 대해 알아봐요!',
    activities: [
      /* ---------- 1 회사도 세금을 낼까? ---------- */
      { id: 'corp', t: '회사도 세금을 낼까요?', e: '🏢', kind: '토론', d: '법인이 무엇인지 알아보고 내 생각을 바꿔 봐요',
        run(root, ctx) {
          const d = { pre: null, post: null };
          const wiz = W.wizard([
            next => h('div.step', W.bee('세연이의 문구점도 세금을 내야 할까? 먼저 <b>내 생각</b>을 골라 봐!', 'bee-hello'),
              h('div.opts', ['회사도 세금을 내야 한다고 생각해요', '회사는 세금을 내지 않아도 된다고 생각해요'].map((t, i) => h('button.opt', { onclick: e => { d.pre = i; S.$$('.opt', wiz).forEach(x => x.classList.remove('right')); e.currentTarget.classList.add('right'); S.sfx('pop'); } }, t))),
              W.next('다음 ▶', () => { if (d.pre == null) { S.toast('생각을 골라 주세요', 'bad'); return; } next(); })),
            next => h('div.step', W.bee('먼저 <b>법인</b>이 뭔지 알아보자!', 'bee-read'),
              W.cards([
                { e: '🏛️', t: '법인이란?', body: '<b>법에 의해 사람의 자격을 인정받은 단체</b>예요. 우리가 알고 있는 삼성, 현대 같은 회사들은 대부분 법인이에요.' },
                { e: '🏦', t: '법인은 사람처럼!', body: '법인은 <b>일을 해서 돈을 벌 수 있고</b>, 은행에서 <b>금융 거래</b>도 할 수 있어요. 그래서 법인도 사람처럼 세금을 내요.' },
                { e: '✏️', t: '세심문구점 이야기', body: '세심문구점이 번 돈은 세연이가 번 돈이 아니라 <b>세심문구점(법인)이 일해서 번 돈</b>이에요. 그래서 이익은 세심문구점의 것이고, 세심문구점이 <b>법인세</b>를 내요.' },
              ]), W.next('다음 ▶', next)),
            next => h('div.step', W.bee('그런데 <b>법인이 세금을 내면 손해</b> 아닐까? 그렇지 않대!', 'bee-money'),
              W.cards([
                { e: '📊', t: '소득세와 법인세는 세율이 달라요', body: '개인이 내는 소득세와 법인이 내는 법인세는 <b>세율이 서로 달라요</b>. 법인이 되면 더 유리한 경우도 있어요. (예: OECD 평균 법인세율 약 21%, 한국 24% — 교재 예시)' },
                { e: '🏦', t: '대출·금리 우대', body: '비용이 들긴 하지만 법인은 개인보다 <b>대출과 금리에서 우대</b>를 받을 수 있어요.' },
              ]), W.next('다음 ▶', next)),
            next => h('div.step', W.bee('이제 다시 한 번! 지금 내 생각은?', 'bee-hello'),
              h('div.opts', ['회사도 세금을 내야 한다고 생각해요', '회사는 세금을 내지 않아도 된다고 생각해요'].map((t, i) => h('button.opt', { onclick: e => { d.post = i; S.$$('.opt', wiz).forEach(x => x.classList.remove('right')); e.currentTarget.classList.add('right'); S.sfx('pop'); } }, t))),
              W.next('결과 보기', () => { if (d.post == null) { S.toast('생각을 골라 주세요', 'bad'); return; } next(); })),
            () => h('div.step', h('div.card.center', h('div.big-emoji', d.post === 0 ? '🎉' : '🤔'), h('h3', d.pre === d.post ? '생각이 그대로예요' : '생각이 바뀌었어요!'), h('p', d.post === 0 ? '맞아요! 법인(회사)도 이익이 생기면 법인세를 내요.' : '다시 생각해 보세요. 법인도 일해서 돈을 벌고, 이익이 생기면 법인세를 내야 해요.')),
              W.word({ answer: '법인', choices: ['개인', '단체', '회사원'], desc: '법에 의해 사람의 자격을 인정받은 단체는?', onDone: () => ctx.finish(null, '법인도 법인세를 내요!') })),
          ]);
          root.append(wiz);
        } },

      /* ---------- 2 돈의 흐름 ---------- */
      { id: 'flow', t: '회사 이익, 어디로 갈까?', e: '🌊', kind: '시뮬레이션', d: '매출에서 세금까지 돈의 흐름을 따라가요',
        run(root, ctx) {
          const sales = 10000, cost = 6000, profit = sales - cost, ct = Math.round(profit * corpRate() / 100), net = profit - ct, div = Math.round(net / 2), dt = Math.round(div * divRate() / 100), wage = 1000, wt = E.incomeTax(wage);
          const steps = [
            ['💰', '매출 (회사가 번 돈)', fmt(sales), '세심문구점이 물건을 팔아서 번 돈이에요.'],
            ['➖', '비용 (재료비·인건비)', '− ' + fmt(cost), '물건을 만드는 재료비와 직원 월급 등을 빼요.'],
            ['📈', '이익', fmt(profit), '매출 − 비용 = 이익!'],
            ['🏛️', `법인세 (${corpRate()}%)`, '− ' + fmt(ct), '이익에 대해 법인(회사)이 내는 세금이에요.'],
            ['✅', '순이익', fmt(net), '법인세를 낸 뒤 회사에 남은 돈이에요.'],
            ['🎁', '배당 (사장님에게 나눠 줌: 절반)', fmt(div), '세연이에게 이익을 나누어 주는 것을 배당이라고 해요.'],
            ['🧾', `배당소득세 (${divRate()}%)`, '− ' + fmt(dt), '배당을 받은 세연이가 내는 세금이에요.'],
            ['🧑‍💼', `직원 월급 ${fmt(wage)} → 근로소득세`, '− ' + fmt(wt), '일해서 임금을 받을 때 내는 세금이에요.'],
          ];
          let i = 0; const board = h('div.flowlist'), nx = h('button.btn.primary.big', { onclick: () => {
            if (i < steps.length) { const s = steps[i++]; board.append(h('div.fl-row.pop', h('span.fl-e', s[0]), h('div.fl-t', h('b', s[1]), h('div.sm', s[3])), h('b.fl-v', s[2]))); S.sfx('pop'); nx.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
            if (i >= steps.length) { nx.remove(); quiz(); }
          } }, '다음 단계 ▶');
          root.append(W.bee('세심문구점이 <b>1만 심</b>어치를 팔았어요! 이 돈이 어디로 가는지 한 단계씩 따라가 봐.', 'bee-money'), board, h('div.nextrow', nx));
          function quiz() {
            root.append(h('h3.sec', '🧠 세금 이름 맞히기'), W.quiz({ items: [
              { q: '세심문구점(법인)이 이익을 내고 나서 내는 세금은?', opts: ['법인세', '근로소득세', '배당소득세'], a: 0, why: '법인의 이익에 대한 세금이에요.' },
              { q: '세연이가 문구점에서 일하고 월급을 받을 때 내는 세금은?', opts: ['배당소득세', '근로소득세', '재산세'], a: 1, why: '일하고 받는 임금에는 근로소득세예요.' },
              { q: '문구점이 이익을 세연이에게 나눠 준 것(배당)에 대한 세금은?', opts: ['배당소득세', '부가가치세', '법인세'], a: 0, why: '배당에 대한 세금은 배당소득세예요.' },
            ], onDone: () => ctx.finish(null, '법인세 → 배당소득세 / 근로소득세로 이어지는 흐름을 알았어요!') }));
          }
        } },

      /* ---------- 3 창업 시뮬 ---------- */
      { id: 'startup', t: '세심 가게 창업하기', e: '🏪', kind: '창업 체험', d: '5일 동안 가게를 운영하고 사업보고서를 써요',
        run(root, ctx) {
          const biz = {
            stationery: { n: '문구점', e: '✏️', p: [['연필', 40, 100], ['공책', 80, 200], ['스티커', 30, 90]] },
            cookie: { n: '꿀 쿠키 가게', e: '🍪', p: [['쿠키', 60, 150], ['주스', 50, 120], ['마카롱', 100, 250]] },
            flower: { n: '꽃가게', e: '🌷', p: [['꽃다발', 150, 400], ['화분', 100, 260], ['씨앗 봉투', 20, 60]] },
          };
          const paid = E.isDone('s6.paid');
          const st = { b: 'stationery', name: '', price: [1, 1, 1], units: [20, 20, 20] };
          const wiz = W.wizard([
            next => {
              const nm = h('input', { type: 'text', maxlength: 10, placeholder: '예) 세심문구점', value: st.name });
              return h('div.step', W.bee('어떤 가게를 열까요? 가게 이름도 지어 줘! (창업 지원금 <b>3,000</b> 심을 마을에서 빌려줘요)', 'bee-paper'),
                h('div.job-grid', Object.entries(biz).map(([k, v]) => h('button.job', { class: st.b === k ? 'on' : '', onclick: e => { st.b = k; S.$$('.job', wiz).forEach(x => x.classList.remove('on')); e.currentTarget.classList.add('on'); S.sfx('pop'); } }, h('div.j-e', v.e), h('b', v.n), h('div.j-d', v.p.map(p => p[0]).join(', '))))),
                h('div.card.form', h('label', '가게 이름', nm)),
                W.next('다음 ▶', () => { if (nm.value.trim().length < 2) { S.toast('가게 이름을 지어 주세요', 'bad'); return; } st.name = nm.value.trim(); next(); }));
            },
            next => {
              const B = biz[st.b], out = h('div.k-out');
              const def = Math.min(20, Math.floor(3000 / B.p.reduce((a, p) => a + p[1], 0)));
              st.units = B.p.map(() => def); st.price = [1, 1, 1];
              const calc = () => { const cost = B.p.reduce((a, p, i) => a + p[1] * st.units[i], 0); out.innerHTML = `재료비 합계 <b>${fmt(cost)}</b> / 창업 지원금 <b>3,000</b>${cost > 3000 ? ' <span class="neg">(창업 지원금을 넘었어요!)</span>' : ''}`; return cost; };
              const rows = B.p.map((p, i) => {
                const pv = h('b', fmt(Math.round(p[2] * st.price[i]))), uv = h('b', st.units[i] + '개');
                return h('div.card.prod', h('b', p[0]), h('div.sm', `만드는 값(재료비) ${p[1]} · 보통 가격 ${p[2]}`),
                  h('label.sl', '💲 판매 가격', h('div.inline', h('input', { type: 'range', min: .5, max: 2, step: .1, value: 1, oninput: e => { st.price[i] = +e.target.value; pv.textContent = fmt(Math.round(p[2] * st.price[i])); } }), pv)),
                  h('label.sl', '📦 만들 개수', h('div.inline', h('input', { type: 'range', min: 0, max: 40, step: 1, value: st.units[i], oninput: e => { st.units[i] = +e.target.value; uv.textContent = st.units[i] + '개'; calc(); } }), uv)));
              });
              calc();
              return h('div.step', W.bee(`<b>${st.name}</b> 사업계획서! 상품마다 <b>가격</b>과 <b>만들 개수</b>를 정해요. 너무 비싸면 안 팔리고, 너무 많이 만들면 남아요!`, 'bee-paper'), rows, out,
                W.next('🏪 5일 동안 장사하기!', () => { if (calc() > 3000) { S.toast('창업 지원금(3,000)을 넘었어요. 개수를 줄여요', 'bad'); return; } next(); }));
            },
            next => {
              const B = biz[st.b]; let sold = [0, 0, 0], day = 0;
              const rem = st.units.slice();
              const log = h('div.daylog'), hdr = h('div.center', '🕐 장사 준비 중...');
              const run = h('button.btn.primary.big', { onclick: () => {
                if (day >= 5) return; day++;
                const line = [];
                B.p.forEach((p, i) => {
                  const dem = Math.max(0, Math.round(6 * S.clamp(1.5 - .7 * st.price[i], 0, 1.3) + S.rnd(-1, 1)));
                  const s = Math.min(dem, rem[i]); rem[i] -= s; sold[i] += s; line.push(`${p[0]} ${s}개`);
                });
                log.append(h('div.fl-row.pop', h('b', `${day}일차`), h('span', line.join(' · ')))); S.sfx('coin');
                if (day >= 5) { run.remove(); setTimeout(next, 800); }
              } }, '▶ 하루 장사하기');
              st.sold = sold;
              return h('div.step', W.bee('가게 문을 열었어요! 손님이 오고 있어요. 5일 동안 장사해 봐요!', 'bee-hold'), hdr, log, h('div.nextrow', run));
            },
            next => {
              const B = biz[st.b];
              const revenue = B.p.reduce((a, p, i) => a + st.sold[i] * Math.round(p[2] * st.price[i]), 0);
              const mat = B.p.reduce((a, p, i) => a + p[1] * st.units[i], 0), wage = 100, cost = mat + wage;
              const profit = revenue - cost, ct = profit > 0 ? Math.round(profit * corpRate() / 100) : 0, net = profit - ct;
              const report = h('div.report', h('div.rp-h', `📑 ${st.name} 사업보고서`),
                h('table.law-table', h('tbody',
                  h('tr', h('th', '사업체 이름'), h('td', st.name)), h('tr', h('th', '직원'), h('td', S.me.name + ' (1명)')),
                  h('tr', h('th', '매출액'), h('td', fmt(revenue) + E.cur())), h('tr', h('th', '재료비'), h('td', '− ' + fmt(mat))), h('tr', h('th', '판매비와 관리비(인건비)'), h('td', '− ' + fmt(wage))),
                  h('tr', h('th', '이익 (수입−비용)'), h('td', h('b', fmt(profit) + E.cur()))), h('tr', h('th', `법인세 (${corpRate()}%)`), h('td', profit > 0 ? '− ' + fmt(ct) : '0 (손해라 내지 않아요)')),
                  h('tr', h('th', '순이익'), h('td', h('b', fmt(net) + E.cur()))))));
              const divv = { pct: 50 };
              const box = h('div.step', W.bee(profit > 0 ? '와! 이익이 났어요 🎉 이제 <b>법인세</b>를 내고 사업보고서를 마무리해요.' : '이번엔 손해가 났어요 😢 손해가 나면 법인세는 내지 않아요. 가격과 개수를 바꿔 다시 도전해 봐요!', profit > 0 ? 'bee-money' : 'bee-look'), report);
              if (profit > 0) {
                const dv = h('b', Math.round(net * .5) + E.cur());
                box.append(h('div.card', h('h3', '🎁 배당 정하기'), h('p.sm', '순이익 중 사장님(나)에게 나눠 줄 몫을 정해요. 배당을 받으면 배당소득세도 내요. (이번에는 최대 600심까지 받을 수 있고, 나머지는 회사에 남겨 둬요)'),
                  h('div.inline', h('input', { type: 'range', min: 0, max: 100, step: 10, value: 50, oninput: e => { divv.pct = +e.target.value; dv.textContent = Math.round(net * divv.pct / 100) + E.cur() + ` (${divv.pct}%)`; } }), dv)));
                box.append(W.next(paid ? '📤 법인세 내기 (연습)' : '📤 법인세 내고 월급·배당 받기', () => {
                  if (paid) { S.toast('이미 한 번 정산했어요. 연습 모드에서는 돈이 오가지 않아요.'); ctx.finish(null, '사업 연습을 마쳤어요!'); return; }
                  const rc = E.recordTax('corp', ct, st.name + ' 법인세'); E.showReceipt(rc);
                  E.complete('s6.paid', 0);
                  setTimeout(() => {
                    E.earn(wage, st.name + ' 월급(근로소득)', { quiet: false });
                    const dg = Math.min(600, Math.round(net * divv.pct / 100)); if (dg > 0) setTimeout(() => E.earn(dg, st.name + ' 배당', { type: 'div' }), 500);
                    E.diary('6차시 사업보고서', `${st.name}: 매출 ${fmt(revenue)}, 이익 ${fmt(profit)}, 법인세 ${fmt(ct)}, 순이익 ${fmt(net)}`);
                    E.badge('ceo', '세심 사장님', '🏪');
                    ctx.finish(null, '법인세를 내고 사업보고서를 완성했어요!');
                  }, 700);
                }));
              } else {
                box.append(W.next('🔁 다시 운영해 보기', () => S.render()));
              }
              return box;
            },
          ]);
          root.append(wiz);
        } },

      /* ---------- 4 세제 혜택 ---------- */
      { id: 'perk', t: '어떤 기업에게 세금을 깎아 줄까?', e: '🎁', kind: '토의', d: '법인세 감면 혜택을 줄 기업을 골라요',
        run(root, ctx) {
          const opts = ['🌱 환경 보호에 앞장서는 기업', '♿ 장애인을 많이 고용하는 기업', '👶 육아휴직을 잘 지켜 저출생 극복에 힘쓰는 기업', '🧑‍💼 청년 일자리를 늘리는 기업', '🌏 다문화 가정을 돕는 기업', '🔬 새로운 기술을 연구하는 기업'];
          let sel = [];
          const ch = W.chips({ options: opts, multi: true, max: 2, onChange: v => (sel = v) });
          root.append(W.bee('나라는 사회에 도움이 되는 기업에게 <b>법인세를 깎아 주기</b>도 해요. 여러분이라면 어떤 기업에게 혜택을 주고 싶나요? (2개)', 'bee-hold'), h('div.card', ch),
            W.note({ prompt: '선택한 이유를 써 주세요. <b>왜 그 기업에게 혜택을 주어야 할까요?</b>', placeholder: '예) 환경을 지키는 기업이 많아지면 우리 모두 깨끗한 공기를 마실 수 있기 때문이다.', key: 'k6.perk', diaryTitle: '6차시 법인세 혜택', min: 10, btn: '제출하기', onDone: () => {
              if (!sel.length) { S.toast('기업을 골라 주세요', 'bad'); return; }
              root.append(h('div.card.def', h('b', '📌 실제로도!'), h('p', '정부는 연구·개발에 투자하거나 일자리를 늘리는 기업에게 세금을 깎아 주는 제도(세액공제 등)를 운영해요. 세금으로 사회에 좋은 일을 하도록 이끄는 거예요.')));
              ctx.finish(null, '세금은 걷는 것뿐 아니라 사회를 이끄는 역할도 해요.');
            } }));
        } },
    ],
  };
})();
