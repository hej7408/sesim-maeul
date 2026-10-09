/* 9차시 · 한 해 동안 걷고 쓴 세금을 결산해요! */
(function () {
  const { h, W, E, fmt, shuffle } = S;

  /* 복습 문제 은행 (퀴즈왕 게임에서도 사용) */
  S.REVIEW = [
    { q: '세금이란 무엇일까요?', opts: ['국가나 지방자치단체가 운영을 위해 국민에게 법에 따라 걷는 돈', '친구에게 빌린 돈', '가게에서 파는 물건값'], a: 0, why: '세금은 법에 따라 걷는 돈이에요.' },
    { q: '국민이 어떤 세금을 얼마나 낼지 법률로 정한다는 원칙은?', opts: ['조세법률주의', '조세공평주의', '조세마음주의'], a: 0, why: '조세법률주의예요.' },
    { q: '경제적 부담능력이 크면 세금도 더 많이 내야 한다는 원칙은?', opts: ['조세법률주의', '조세공평주의', '조세평등주의'], a: 1, why: '조세공평주의예요.' },
    { q: '모든 사람에게 같은 금액을 걷는 세금은?', opts: ['정액세', '비례세', '누진세'], a: 0, why: '정액세는 같은 금액이에요.' },
    { q: '모든 사람에게 같은 비율로 걷는 세금은?', opts: ['정액세', '비례세', '인두세'], a: 1, why: '비례세는 같은 비율이에요.' },
    { q: '10,000원짜리 물건에 부가가치세 10%가 붙으면 최종 가격은?', opts: ['10,100원', '11,000원', '20,000원'], a: 1, why: '10,000 + 1,000 = 11,000원' },
    { q: '설탕세, 탄소세처럼 나쁜 행동을 줄이기 위한 세금은?', opts: ['교정적 조세', '소득재분배세', '재산세'], a: 0, why: '교정적 조세예요.' },
    { q: '회사(법인)가 번 이익에 내는 세금은?', opts: ['근로소득세', '법인세', '취득세'], a: 1, why: '법인세예요.' },
    { q: '회사의 이익을 나누어 받는 것(배당)에 내는 세금은?', opts: ['배당소득세', '재산세', '부가가치세'], a: 0, why: '배당소득세예요.' },
    { q: '집을 살 때 한 번 내는 세금은?', opts: ['재산세', '취득세', '소득세'], a: 1, why: '취득세예요.' },
    { q: '집을 가지고 있는 동안 매년 내는 세금은?', opts: ['재산세', '취득세', '양도소득세'], a: 0, why: '재산세예요.' },
    { q: '법을 어겨서 세금을 내지 않으려는 행동은?', opts: ['절세', '탈세', '납세'], a: 1, why: '탈세예요.' },
    { q: '법의 테두리 안에서 내야 할 세금을 절약하는 현명한 방법은?', opts: ['탈세', '절세', '체납'], a: 1, why: '절세예요.' },
    { q: '세금을 걷고 쓴 한 해의 수입과 지출을 계산해 살펴보는 일은?', opts: ['예산', '결산', '예측'], a: 1, why: '결산이에요.' },
    { q: '지방자치단체가 걷는 세금은?', opts: ['국세', '지방세', '관세'], a: 1, why: '재산세·취득세 등이 지방세예요.' },
    { q: '쓰임이 정해져 있는 세금(예: 교육세)은?', opts: ['보통세', '목적세', '인두세'], a: 1, why: '목적세예요.' },
    { q: '세금으로 소득을 다시 나누어 격차를 줄이는 기능은?', opts: ['소득재분배', '소득증식', '소득비밀'], a: 0, why: '소득재분배예요.' },
    { q: '세금을 쓸 때에도 꼭 거쳐야 하는 곳은?', opts: ['국회의 심의', '학교 회의', '은행'], a: 0, why: '예산은 국회의 심의를 거쳐요.' },
    { q: '재산을 팔아서 이익이 생기면 내는 세금은?', opts: ['양도소득세', '취득세', '교육세'], a: 0, why: '양도소득세예요.' },
    { q: '일하고 월급을 받을 때 내는 세금은?', opts: ['근로소득세', '재산세', '법인세'], a: 0, why: '근로소득세예요.' },
    { q: '사람 수(머릿수)에 따라 똑같이 걷는 세금은?', opts: ['인두세', '법인세', '설탕세'], a: 0, why: '인두세예요.' },
    { q: '세금을 정직하게 내는 사람을 뭐라고 부를까요?', opts: ['성실 납세자', '탈세자', '체납자'], a: 0, why: '성실 납세자예요.' },
  ];

  S.sessions[9] = {
    title: '한 해 동안 걷고 쓴 세금을 결산해요!', sub: '결산, 세금 수입 예측, 국세와 지방세, 나라의 빚', e: '📊', color: '#3F8F7A',
    story: [
      { who: '세심이', img: 'bee-paper', t: '한 해가 지났어! 우리 마을은 <b>세금을 얼마나 걷고 어디에 썼을까?</b>' },
      { who: '세연이', img: 'kid-girl', t: '계획한 만큼 잘 걷혔을까? 아니면 더 걷히거나 덜 걷혔을까?' },
      { who: '무출이', img: 'kid-boy', t: '그걸 돌아보는 걸 <b>결산</b>이라고 한대. 우리가 낸 세금도 모아서 정리해 보자!' },
    ],
    goals: ['결산이 무엇이고 왜 필요한지 알아요.', '상황에 따라 세금이 더 걷히거나 덜 걷힐 수 있음을 알아요.', '내가 한 해 동안 낸 세금을 정리하고 돌아봐요.'],
    recap: {
      term: '결산', def: '일정한 기간 동안의 수입과 지출을 계산하여 파악하는 활동',
      points: ['정부는 결산을 통해 <b>과거를 돌아보고 미래를 더 잘 준비</b>해요.', '세금은 <b>계획한 만큼</b>만 걷는 게 아니라, 경기와 소비에 따라 <b>더 걷히거나 덜 걷힐</b> 수 있어요.', '정부도 수입보다 지출이 많으면 <b>빚</b>을 내요. 빚은 잘 갚아야 신용도가 지켜져요.', '세금을 가장 많이 낸 친구를 칭찬하고, 우리 반 활동을 모두 결산해요.'],
    },
    task: '세금내역서를 확인해 내가 얼마나 세금을 냈는지 계산하고, 세금을 가장 많이 낸 친구를 칭찬해요. 우리 반 모두의 세심교실 활동을 결산해 얼마나 많은 세금이 걷히고 쓰였는지 확인해요.',
    next: '다음 시간에는 "안녕! 진짜 세금 내는 세상"에 대해 알아봐요!',
    activities: [
      /* ---------- 1 결산이란 ---------- */
      { id: 'what', t: '결산이 뭐예요?', e: '🧮', kind: '알아보기', d: '결산이 왜 필요한지 알아봐요',
        run(root, ctx) {
          root.append(W.cards([
            { e: '📘', t: '결산이란?', body: '일정한 기간 동안의 <b>수입과 지출을 계산</b>하여 파악하는 활동이에요. 용돈 기입장으로 한 달을 돌아보는 것도 결산이에요.' },
            { e: '🔙', t: '왜 결산해야 할까요?', body: '<b>① 과거를 돌아보고 미래를 더 잘 준비</b>할 수 있어요.<br><b>② 예상처럼 세금이 잘 걷혔는지, 계획한 대로 잘 썼는지, 아쉬운 점은 없는지</b> 점검할 수 있어요.<br><b>③ 잘한 점은 발전시키고 아쉬운 점은 고쳐서</b> 국민의 피와 땀이 담긴 세금이 낭비되지 않도록 해요.' },
          ]));
          root.append(W.word({ answer: '결산', choices: ['예산', '정산', '계산기'], desc: '일정 기간의 수입과 지출을 계산해 파악하는 활동은?', onDone: () => {
            root.append(W.quiz({ items: [{ q: '결산을 하는 가장 중요한 이유는?', opts: ['지난 한 해를 돌아보고 앞으로를 더 잘 준비하려고', '세금을 더 많이 걷으려고', '돈을 숨기려고'], a: 0, why: '결산은 반성과 준비를 위한 활동이에요.' }], onDone: () => ctx.finish(null, '결산으로 세금이 잘 쓰이도록 해요!') }));
          } }));
        } },

      /* ---------- 2 세금이 더 걷힐까 ---------- */
      { id: 'more', t: '세금이 더 걷힐까, 덜 걷힐까?', e: '📈', kind: '추리', d: '상황에 따라 세금이 달라져요',
        run(root, ctx) {
          const Q = [
            { q: '🧑‍💼 <b>소득세</b>: 올해 소득세를 70조 원 걷으려 했는데, 경기가 나빠져 <b>실업자가 예상보다 많았어요.</b>', a: 1, why: '일자리가 줄어 소득이 줄었으니 소득세는 예상보다 적게 걷혀요.' },
            { q: '🛒 <b>부가가치세</b>: 80조 원을 걷으려 했는데, 경기가 좋아져 <b>소비가 크게 늘었어요.</b>', a: 0, why: '물건을 많이 살수록 부가가치세가 늘어서 더 많이 걷혀요.' },
            { q: '🥤 <b>설탕세</b>: 음료를 살 때마다 100원씩 설탕세를 걷어 10조 원을 예상했어요. 그런데 <b>사람들이 단 음료를 덜 마시게 되었어요.</b>', a: 1, why: '세금이 행동을 바꿔 소비가 줄었고, 그래서 세금도 덜 걷혀요. 건강을 지키려는 목적은 이룬 셈이에요!' },
            { q: '🏭 <b>법인세</b>: 올해 회사들이 <b>예상보다 큰 이익</b>을 냈어요.', a: 0, why: '이익이 늘면 법인세도 늘어요.' },
            { q: '🏠 <b>취득세</b>: 집을 사려는 사람이 <b>크게 줄었어요.</b>', a: 1, why: '집을 사는 일이 줄면 취득세도 줄어요.' },
          ];
          root.append(W.cards([{ e: '💡', t: '세금알기 꿀팁', body: '정부가 세금을 무조건 많이 걷으려는 건 아니에요! 세금은 <b>계획한 만큼만</b> 걷어요. 한 해 동안 필요 이상으로 낸 세금이 있다면 <b>환급</b>을 받는답니다.' }]));
          root.append(h('h3.sec', '🔮 예상보다 많이? 적게?'), W.quiz({ items: Q.map(x => ({ q: x.q, opts: ['예상보다 더 많이 걷혔다', '예상보다 더 적게 걷혔다'], a: x.a, why: x.why })), shuffleOpts: false, onDone: () => ctx.finish(null, '세금은 경기와 사람들의 행동에 따라 달라져요!') }));
        } },

      /* ---------- 3 내 세금 결산서 ---------- */
      { id: 'report', t: '내 세금 결산서', e: '🗒️', kind: '결산', d: '한 해 동안 내가 낸 세금을 정리해요',
        run(root, ctx) {
          const p = S.me, st = E.settings();
          const taxes = Object.entries(p.taxes).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
          const total = E.totalTax(), earned = p.ledger.filter(l => l.kind === 'in' && l.type !== 'gift' && l.type !== 'sell').reduce((a, l) => a + (l.gross || l.amt), 0);
          const spent = p.ledger.filter(l => l.kind === 'out').reduce((a, l) => a + l.amt, 0);
          root.append(W.bee('한 해 동안 나는 얼마를 벌고, 쓰고, 세금으로 냈을까? <b>세금 결산서</b>를 열어 볼게!', 'bee-money'));
          root.append(h('div.report', h('div.rp-h', `📑 ${p.town} 마을 ${p.name} 세금 결산서`), h('table.law-table', h('tbody',
            h('tr', h('th', '번 돈(세금 떼기 전)'), h('td', E.money(earned))), h('tr', h('th', '쓴 돈'), h('td', E.money(spent))), h('tr', h('th', '내 지갑에 남은 돈'), h('td', E.money(p.money))),
            ...taxes.map(([k, v]) => h('tr', h('th', E.TAXNAME[k] || k), h('td', E.money(v)))), h('tr', h('th', '세금 합계'), h('td', h('b', E.money(total)))), h('tr', h('th', '번 돈 대비 세금'), h('td', earned ? Math.round((total - (p.taxes.corp || 0)) / earned * 100) + '% (법인세 제외)' : '-'))))));
          const T = S.townState();
          root.append(h('div.card', h('h3', '🏗️ 우리 마을이 세금으로 지은 것'), h('div.fac-row', S.FACILITIES.map(f => h('div.fac', { class: T.per >= f.need ? 'on' : '' }, h('div.f-e', f.e), h('div.f-n', f.n)))), h('p.sm', `1인 평균 ${E.money(T.per)}의 세금으로 ${T.built.length}개 시설을 지었어요 (이 기기 ${T.n}명 기준).`)));
          const profs = Object.values(E.profiles()).map(q => ({ n: q.name, t: E.totalTax(q) })).sort((a, b) => b.t - a.t);
          if (profs.length > 1) root.append(h('div.card', h('h3', '👑 우리 반 세금왕 (이 기기)'), profs.slice(0, 5).map((q, i) => h('div.lg-row', h('span', ['🥇', '🥈', '🥉', '4', '5'][i]), h('span.lg-m', q.n), h('b', E.money(q.t)))), h('p.sm', '세금을 많이 낸 친구를 칭찬해 주세요! 👏')));
          // 세금내역서 분류
          const ent = []; const seen = new Set();
          for (const l of p.ledger.slice().reverse()) { if (l.kind === 'tax' && !seen.has(l.type + l.memo)) { seen.add(l.type + l.memo); ent.push(l); } if (ent.length >= 8) break; }
          const kinds = [...new Set(ent.map(e => e.type))];
          const note = () => root.append(W.note({ prompt: '한 해를 돌아보며 <b>세금에 대해 알게 된 점이나 소감</b>을 써 보세요.', placeholder: '예) 세금은 내 지갑에서 빠져나가지만 우리 마을을 만드는 데 쓰인다는 걸 알았다.', key: 'k9.report', diaryTitle: '9차시 세금 결산 소감', min: 10, onDone: () => { E.badge('settle', '세금 결산왕', '📊'); ctx.finish(null, '한 해 세금을 결산했어요!'); } }));
          if (kinds.length >= 2) {
            root.append(h('h3.sec', '🏷️ 내 세금내역서, 어떤 세금일까?'), W.sort({ buckets: kinds.slice(0, 4).map(k => ({ id: k, label: E.TAXNAME[k] || k, emoji: '🧾', cls: 'honey' })),
              items: ent.filter(e => kinds.slice(0, 4).includes(e.type)).slice(0, 6).map(e => ({ t: `${e.memo} ${fmt(e.amt)}${st.currency}`.replace(' - 원천징수', ' (월급에서 미리 뗌)'), b: e.type, hint: '이 세금을 내게 된 이유를 떠올려 봐요.', why: E.TAXNAME[e.type] || e.type })), onDone: note }));
          } else note();
        } },

      /* ---------- 4 나라 살림 균형 ---------- */
      { id: 'debt', t: '나라 살림 꾸려 보기', e: '🏦', kind: '시뮬레이션', d: '정부도 빚을 내요! 5년 동안 살림을 꾸려요',
        run(root, ctx) {
          let year = 0, debt = 0, trust = 100; const hist = [];
          const box = h('div.debtsim');
          const draw = () => {
            S.clear(box);
            if (year >= 5) return end();
            const rev = [100, 90, 105, 80, 100][year] + S.rnd(-5, 5), interest = Math.round(debt * .08);
            let sp = 100;
            const lab = h('b.big-num', sp);
            const out = h('div.k-out');
            const upd = () => { const need = sp + interest; const def = Math.max(0, need - rev); out.innerHTML = `📥 걷힌 세금 <b>${rev}</b> · 📤 쓸 돈 <b>${sp}</b> + 빚 이자 <b>${interest}</b> = <b>${need}</b><br>${def > 0 ? `⚠️ 부족한 돈 <b class="neg">${def}</b> → 빚을 내야 해요` : '✅ 흑자! 남는 돈으로 빚을 갚아요'}`; };
            const sl = h('input', { type: 'range', min: 60, max: 140, step: 5, value: sp, oninput: e => { sp = +e.target.value; lab.textContent = sp; upd(); } });
            upd();
            box.append(h('div.k-stat', h('span', `${year + 1}년차 / 5`), h('span', `빚 ${debt}`), h('span', `🏅 신용 ${trust}`)), h('p', `올해 걷힌 세금은 <b>${rev}</b> 이에요. 나라 살림에 얼마를 쓸까요?`.replace(/<\/?b>/g, '')), h('div.center', lab), sl, out,
              h('div.nextrow', h('button.btn.primary', { onclick: () => {
                const need = sp + interest, def = need - rev;
                debt = Math.max(0, debt + def); trust = S.clamp(trust - Math.max(0, Math.round(debt / 5)) + (def < 0 ? 5 : 0), 0, 100);
                hist.push({ rev, sp, debt }); year++; S.sfx(def > 0 ? 'bad' : 'ok'); draw();
              } }, '올해 살림 마치기 ✅')));
          };
          const end = () => {
            box.append(h('div.card.center', h('div.big-emoji', trust >= 70 ? '😎' : trust >= 40 ? '😅' : '😰'), h('h3', `5년 뒤 빚 ${debt}, 신용도 ${trust}`), h('p', trust >= 70 ? '살림을 아주 잘 꾸렸어요! 신용도가 높으면 필요할 때 돈을 빌리기 쉬워요.' : '빚이 많아지면 신용도가 낮아져 돈을 빌리고 싶어도 못 빌릴 수 있어요.'),
              W.cards([{ e: '🤔', t: '정부에게도 빚이 있다고?', body: '정부가 써야 할 돈은 늘어나는데 세금이 줄면 돈이 부족해져요. 이럴 때 정부는 <b>빚을 내서</b> 채워요. 빚은 잘 갚아야 해요. 빚을 잘 갚지 않으면 <b>신용도가 낮아져</b> 나중에 돈을 빌리고 싶어도 못 빌릴 수 있어요.' }])));
            ctx.finish(null, '나라 살림도 수입과 지출의 균형이 중요해요!');
          };
          root.append(W.bee('이번에는 <b>정부</b>가 되어 5년 동안 살림을 꾸려요! 걷힌 세금보다 더 쓰면 빚이 생기고, 빚에는 <b>이자</b>도 붙어요.', 'bee-hold'), box);
          draw();
        } },

      /* ---------- 5 리멤버 세심교실 ---------- */
      { id: 'review', t: '리멤버 세심교실 퀴즈', e: '🏆', kind: '퀴즈', d: '지금까지 배운 것을 확인해요',
        run(root, ctx) {
          root.append(W.bee('지금까지 배운 것을 <b>10문제</b>로 복습해요! 8문제 이상 맞히면 <b>세금 박사</b>!', 'bee-read'),
            W.quiz({ items: shuffle(S.REVIEW).slice(0, 10), onDone: (s, t) => { if (s >= 8) { E.badge('doctor', '세금 박사', '🎓'); ctx.finish(null, `${s}/${t} 정답! 세금 박사가 되었어요 🎓`); } else { root.append(h('div.card', h('p', `${s}/${t}개 맞혔어요. 8개 이상이면 세금 박사! 다시 도전해요.`), h('button.btn.primary', { onclick: () => S.render() }, '🔁 다시 도전'))); } } }));
        } },
    ],
  };
})();
