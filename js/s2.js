/* 2차시 · 세금을 어떻게 정할까? */
(function () {
  const { h, W, E, fmt } = S;

  S.sessions[2] = {
    title: '세금을 어떻게 정할까?', sub: '조세법률주의와 우리 반 첫 세금', e: '📜', color: '#E8743B',
    story: [
      { who: '세심이', img: 'bee-paper', t: '세심교실에도 <b>세금</b>이 필요하대! 그런데... 세금은 <b>누가, 어떻게</b> 정하는 걸까?' },
      { who: '무출이', img: 'kid-boy', t: '선생님이 마음대로 정하면 되지 않을까?' },
      { who: '세연이', img: 'kid-girl', t: '옛날 왕들은 마음대로 세금을 걷기도 했대. 그건 너무 불안한데...' },
    ],
    goals: ['세금을 마음대로 정하면 왜 위험한지 알아요.', '조세법률주의의 뜻을 말할 수 있어요.', '우리 반의 첫 세금을 직접 정하고 납부해 봐요.'],
    recap: {
      term: '조세법률주의', def: '국민이 어떤 세금을 얼마나 내야 하는지는 국민의 대표가 모인 국회에서 법률로 정한다는 원칙',
      points: ['세금은 <b>마음대로</b> 정할 수 없고, <b>법</b>에 맞추어 정해져요.', '우리나라 헌법에는 모든 국민이 세금을 내야 하며 <b>어떤 세금을 얼마나 낼지 법률로 정한다</b>고 쓰여 있어요.', '세심교실도 학급 친구들과 의논해서 <b>세법전</b>에 적고 확인해요.', '세금을 냈다면 <b>납부확인증</b>을 받아요!'],
    },
    task: '세심회의에서 우리 반의 첫 세금을 정하고 세법전에 기록해요. 세금을 낸 뒤에는 납부확인증에 도장을 받아 세심기입장에 붙여요.',
    next: '다음 시간에는 "공평한 세금"에 대해 알아봐요!',
    activities: [
      /* ---------- 1 내가 왕이라면 ---------- */
      { id: 'king', t: '내가 왕이라면?', e: '👑', kind: '시뮬레이션', d: '세금을 마음대로 정하면 어떻게 될까요?',
        run(root, ctx) {
          const rounds = [
            { e: '🌾', t: '흉년이 들어 백성이 굶고 있어요. 구휼미(나눠 줄 곡식)가 필요해요!', need: 25 },
            { e: '⚔️', t: '이웃 나라가 쳐들어와요! 군사를 모아야 해요.', need: 40 },
            { e: '🌉', t: '큰 강에 다리를 놓아 백성이 편히 다니게 하고 싶어요.', need: 30 },
          ];
          let i = 0, joy = 70; const log = [];
          const box = h('div.kingsim');
          function show() {
            S.clear(box);
            if (i >= rounds.length) return end();
            const r = rounds[i]; let rate = 30;
            const out = h('div.k-out');
            const sl = h('input', { type: 'range', min: 0, max: 100, value: rate, oninput: () => { rate = +sl.value; lab.textContent = rate + '%'; prev(); } });
            const lab = h('b.big-num', rate + '%');
            const prev = () => { const gold = Math.round(rate * .9); out.innerHTML = `📦 나라 곳간에 들어올 곡식 <b>${gold}</b> (필요 ${r.need})<br>😊 백성 마음 <b>${joy}</b> → <b>${S.clamp(joy + Math.round((30 - rate) * 1.5), 0, 100)}</b>`; };
            prev();
            box.append(h('div.k-stat', h('span', `${i + 1}/3 라운드`), h('span', `😊 백성 마음 ${joy}`)),
              h('div.k-event', h('div.k-e', r.e), h('p', r.t)),
              h('p', '백성이 거둔 곡식의 <b>몇 %</b>를 세금으로 걷을까요?'.replace(/<b>|<\/b>/g, '')), h('div.center', lab), sl, out,
              h('div.nextrow', h('button.btn.primary', { onclick: () => {
                const gold = Math.round(rate * .9), dj = Math.round((30 - rate) * 1.5);
                joy = S.clamp(joy + dj, 0, 100);
                log.push({ ok: gold >= r.need, rate });
                if (gold < r.need) { S.sfx('bad'); return crash('나라 곳간이 비어 ' + r.t.split('!')[0] + ' 문제를 해결하지 못했어요 😢'); }
                if (joy <= 0) { S.sfx('bad'); return crash('백성들의 불만이 폭발했어요! 😡 세금이 너무 무거웠어요.'); }
                S.sfx('ok'); i++; show();
              } }, '세금 정하기 ✅')));
          }
          function crash(msg) {
            S.clear(box);
            box.append(h('div.card.center', h('div.big-emoji', '💥'), h('h3', msg), h('p', '왕 혼자 마음대로 정하니 균형 잡기가 참 어렵죠?'), h('button.btn.primary', { onclick: () => { i = 0; joy = 70; show(); } }, '🔁 다시 도전')));
          }
          function end() {
            box.append(h('div.card.center', h('div.big-emoji', '🏰'), h('h3', '성공! 나라도 지키고 백성도 지켰어요'), h('p', '그런데 왕이 욕심쟁이였다면? 세금을 마음대로 걷는 왕도 있었어요.')),
              W.cards([{ e: '😊', t: '백성을 생각한 왕', body: '백성의 형편을 살펴 세금을 알맞게 정하는 훌륭한 왕도 있었어요.' }, { e: '😡', t: '마음대로 걷는 왕', body: '백성을 생각하지 않고 마음대로 많은 세금을 걷는 왕도 있었어요. 그래서 사람들은 <b>세금을 정하는 약속(법)</b>을 만들었어요.' }]),
              h('p.center', { html: '👉 세금은 <b>마음대로</b>가 아니라 <b>법</b>으로 정해야 모두가 안심할 수 있어요!' }));
            ctx.finish(null, '세금은 법으로 정해야 해요.');
          }
          root.append(W.bee('지금부터 <b>임금님</b>이 되어 세금을 정해 볼까? 너무 많이 걷으면 백성이 화내고, 너무 적게 걷으면 나라가 어려워져요!', 'bee-paper'), box);
          show();
        } },

      /* ---------- 2 세법에서 숨은 세금 찾기 ---------- */
      { id: 'lawfind', t: '세심나라 세금을 찾아라!', e: '🔎', kind: '탐정', d: '세법에 숨은 세금을 찾고 고쳐 봐요',
        run(root, ctx) {
          const arts = [
            { n: '1', t: '세심나라의 국민들은 법에 따라 세금을 낸다.', tax: 0 },
            { n: '2', t: '세금의 종류와 크기는 법으로 정한다.', tax: 0 },
            { n: '2-1', t: '<b>통행세</b>: 시청으로 들어오는 모든 국민은 통행세로 200심을 낸다.', tax: 1, name: '통행세' },
            { n: '2-2', t: '<b>소비세</b>: 물건을 사거나 서비스를 이용할 때 물건 값의 10%를 세금으로 낸다.', tax: 1, name: '소비세' },
            { n: '2-3', t: '<b>교육세</b>: 학교와 학원에 다니는 모든 국민은 300심을 낸다.', tax: 1, name: '교육세' },
            { n: '2-4', t: '<b>소득세</b>: 내가 버는 돈의 10%를 세금으로 낸다.', tax: 1, name: '소득세' },
            { n: '2-5', t: '<b>화장실세</b>: 화장실을 이용하려면 100심을 세금으로 낸다.', tax: 1, name: '화장실세' },
            { n: '3', t: '국민의 과반수가 동의하면 세법을 개정할 수 있다.', tax: 0 },
          ];
          let found = 0; const need = 5;
          const cnt = h('div.counter', `찾은 세금 0 / ${need}`);
          const list = h('div.lawlist');
          const rest = h('div');
          arts.forEach(a => {
            const b = h('button.art', { onclick: () => {
              if (b.classList.contains('hit')) return;
              if (a.tax) { b.classList.add('hit'); found++; S.sfx('ok'); cnt.textContent = `찾은 세금 ${found} / ${need}`; if (found === need) fix(); }
              else { S.sfx('bad'); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); S.toast('이 조항은 세금의 이름이 아니라 세법의 약속이에요'); }
            } }, h('span.an', '제' + a.n + '조'), h('span', { html: a.t }));
            list.append(b);
          });
          root.append(W.bee('여기는 <b>세심나라 세법</b>이에요. 법 조항 속에 숨은 <b>세금 5개</b>를 찾아 눌러 보세요!', 'bee-magnify'), cnt, h('div.lawbook.small', list), rest);
          function fix() {
            S.confetti(30);
            const taxes = arts.filter(a => a.tax);
            let pick = null, reasons = [];
            const chips = W.chips({ options: taxes.map(t => t.name), onChange: v => (pick = v[0]) });
            const rch = W.chips({ options: ['금액이 너무 커요', '세금을 낼 이유가 없어요', '공평하지 않아요', '이용하기 불편해져요', '모두에게 똑같아 부담이 달라요'], multi: true, max: 2, onChange: v => (reasons = v) });
            const ta = h('textarea', { rows: 2, placeholder: '어떻게 고치면 좋을까요? 예) 통행세를 없애고, 시청 이용은 무료로 한다.' });
            rest.append(h('h3.sec', '✏️ 수정이 필요한 세금 하나를 골라 고쳐 봐요'), h('p', '1️⃣ 고칠 세금'), chips, h('p', '2️⃣ 왜 고쳐야 할까요? (2개까지)'), rch, h('p', '3️⃣ 어떻게 고칠까요?'), ta,
              h('div.nextrow', h('button.btn.primary', { onclick: () => {
                if (!pick || !reasons.length || ta.value.trim().length < 5) { S.toast('세금, 이유, 고칠 내용을 모두 채워 주세요', 'bad'); return; }
                S.addLaw({ name: pick + ' 수정 제안', how: ta.value.trim(), why: reasons.join(', ') });
                E.diary('2차시 세법 수정 제안', `${pick}: ${ta.value.trim()} (이유: ${reasons.join(', ')})`);
                vote();
              } }, '📝 세법 수정 제안서 내기')));
          }
          function vote() {
            S.clear(rest);
            const n = 20, yes = S.rnd(12, 16);
            rest.append(h('div.card.center', h('h3', '🗳️ 세법 개정 투표 (모의)'), h('p', `제3조: 국민의 <b>과반수</b>가 동의하면 세법을 고칠 수 있어요. 20명 중 과반수는 11명 이상!`.replace(/<[^>]+>/g, '')),
              h('div.votebar', h('i', { style: { width: (yes / n * 100) + '%' } }, `찬성 ${yes}`), h('em', `반대 ${n - yes}`)), h('p', '✅ 과반수가 찬성해서 세법이 고쳐졌어요!'), h('p.sm', '※ 연습용 투표예요. 진짜 우리 반 투표는 선생님과 함께 해 봐요.')));
            ctx.finish(null, '세법도 약속대로(과반수 동의) 고칠 수 있어요.');
          }
        } },

      /* ---------- 3 세심회의 첫 세금 ---------- */
      { id: 'council', t: '세심회의로 첫 세금 정하기', e: '🏛️', kind: '토의·납부', d: '친구들의 의견을 따져 보고 첫 세금을 내요',
        run(root, ctx) {
          const props = [
            { who: '세종', e: '👑', t: '지금 우리가 받은 돈은 모두 똑같으니까, 세금도 모두가 <b>똑같이</b> 내자!', a: 0 },
            { who: '야미', e: '🍰', t: '칠판은 공부 잘하는 사람이 많이 보니까, <b>시험 성적순</b>으로 세금을 많이 내자!', a: 1 },
            { who: '소인', e: '📏', t: '키가 크면 에어컨이 가까워 더 시원하니까, <b>키 큰 사람</b>이 세금을 많이 내자!', a: 1 },
            { who: '무출', e: '🍚', t: '급식도 세금이 쓰이니까 <b>급식을 많이 먹는 친구</b>가 세금을 더 내자!', a: 1 },
          ];
          const data = { name: '', mode: 'flat', val: 50, when: '한 번만' };
          const wiz = W.wizard([
            next => { const nx = W.next('다음 ▶', next); nx.style.display = 'none'; return h('div.step', W.bee('친구들이 <b>세심회의</b>에서 의견을 냈어요. 각 의견이 세금을 정하는 방법으로 알맞은지 판단해 볼까?', 'bee-paper2'),
              W.quiz({ items: props.map(p => ({ q: `${p.e} <b>${p.who}</b>: "${p.t}"<br><br>이 의견은 세금을 정하는 방법으로 알맞을까요?`, opts: ['알맞아요', '알맞지 않아요'], a: p.a === 0 ? 0 : 1,
                why: p.a === 0 ? '지금은 모두 같은 돈을 받아서 똑같이 내도 크게 문제가 없어요. 하지만 나중에 버는 돈이 달라지면 어떨까요? (3차시)' : '성적, 키, 급식량은 세금을 낼 능력과 상관이 없어요. 세금의 기준은 합리적이고 모두가 납득할 수 있어야 해요.' })), shuffleOpts: false, onDone: () => { nx.style.display = ''; } }), nx); },
            next => {
              const nm = h('input', { type: 'text', maxlength: 10, placeholder: '예) 학급 운영세', value: data.name });
              const valIn = h('input', { type: 'number', min: 1, max: 100, value: data.val, inputmode: 'numeric' });
              const unit = h('b', E.cur());
              const modes = W.chips({ options: ['똑같은 금액', '번 돈의 몇 %'], selected: ['똑같은 금액'], onChange: v => { data.mode = v[0] === '똑같은 금액' ? 'flat' : 'pct'; unit.textContent = data.mode === 'flat' ? E.cur() : '%'; if (data.mode === 'pct') valIn.value = 10; else valIn.value = 50; } });
              const whens = W.chips({ options: ['한 번만', '매주', '매달', '월급 받을 때'], selected: ['한 번만'], onChange: v => (data.when = v[0]) });
              return h('div.step', W.bee('이제 우리 반 <b>첫 세금</b>을 <b>세법전</b>에 적어 볼까요? 세금의 이름, 얼마, 어떤 방법, 언제 내는지 정해요.', 'bee-paper'),
                h('div.lawbook', h('div.law-title', '세심교실 세법전'), h('label', '세금의 이름은? ', nm), h('p', '얼마를 내야 할까?'), modes, h('div.inline', valIn, unit), h('p', '언제 내야 할까?'), whens),
                W.next('세법전에 적기 ✍️', () => {
                  if (nm.value.trim().length < 2) { S.toast('세금 이름을 지어 주세요', 'bad'); return; }
                  data.name = nm.value.trim(); data.val = Math.max(1, Math.min(100, Math.round(+valIn.value) || 1));
                  S.addLaw({ name: data.name, how: data.mode === 'flat' ? '모두 똑같이' : '번 돈의 일정 비율', amount: data.mode === 'flat' ? data.val + E.cur() : data.val + '%', why: '2차시 세심회의에서 정한 첫 세금 (' + data.when + ')' });
                  S.sfx('ok'); next();
                }));
            },
            next => {
              const amt = data.mode === 'flat' ? data.val : Math.max(1, Math.round(S.me.money * data.val / 100));
              const pay = Math.min(amt, 100);
              return h('div.step', W.bee(`회의에서 정해진 세금을 <b>직접 정부에 납부</b>해 볼까요? (연습이라 최대 ${E.money(100)}까지만 내요)`, 'bee-money'),
                h('div.card.center', h('h3', `🏛️ ${data.name}`), h('div.big-num', E.money(pay)), h('p.sm', `납부 주기: ${data.when}`),
                  h('button.btn.primary.big', { onclick: () => {
                    if (E.payTax('first', pay, data.name)) { E.badge('firstTax', '첫 세금 납부', '🧾'); setTimeout(next, 600); }
                  } }, '💸 세금 내기')));
            },
            next => h('div.step', W.note({ prompt: '첫 세금을 내 보니 어땠나요? 이 세금은 앞으로 <b>어떻게 쓰면 좋을지</b>도 함께 써 보세요.', placeholder: '예) 생각보다 아깝지 않았다. 교실 책꽂이를 사면 좋겠다.', key: 'k2.first', diaryTitle: '2차시 첫 세금 소감', min: 8, onDone: () => ctx.finish(null, '우리 반의 첫 세금을 직접 정하고 냈어요!') })),
          ]);
          root.append(wiz);
        } },

      /* ---------- 4 세종대왕의 공법과 인두세 ---------- */
      { id: 'history', t: '세종대왕의 공법과 인두세', e: '🏯', kind: '알아보기', d: '옛날에는 세금을 어떻게 정했을까요?',
        run(root, ctx) {
          root.append(W.cards([
            { e: '👑', t: '세종대왕의 공법', body: '세종대왕은 더 공평한 세법을 만들기 위해 대신들과 의논하고, <b>백성이 참여하는 여론조사</b>를 통해 "<b>공법</b>"을 정했어요. 그리고 <b>법에 따라</b> 세금을 걷었답니다.' },
            { e: '🙋', t: '인두세란?', body: '<b>머릿수</b>(사람 수)에 따라 세금을 걷는 방법이에요. 모두가 <b>똑같은 금액</b>을 내요. 지금도 쓰이는 방법이에요.' },
          ]));
          root.append(h('h3.sec', '🧠 확인 퀴즈'), W.quiz({ items: [
            { q: '세종대왕이 공법을 정할 때 백성의 의견을 들은 방법은?', opts: ['여론조사', '제비뽑기', '왕이 혼자 결정'], a: 0, why: '백성이 참여하는 여론조사를 했어요.' },
            { q: '인두세는 어떤 세금일까요?', opts: ['번 돈에 따라 다르게 내는 세금', '사람 수(머릿수)에 따라 똑같이 내는 세금', '물건을 살 때 내는 세금'], a: 1, why: '모두가 동일한 금액을 내는 방법이에요.' },
            { q: '세종대왕은 세금을 어떻게 걷도록 했나요?', opts: ['법에 따라', '관리 마음대로', '기분에 따라'], a: 0, why: '"공법"이라는 법에 따라 걷었어요.' },
          ], onDone: () => ctx.finish(null, '세종대왕도 법과 백성의 의견으로 세금을 정했어요.') }));
        } },

      /* ---------- 5 초성 퀴즈 ---------- */
      { id: 'word', t: '초성 퀴즈: ㅈㅅㅂㄹㅈㅇ', e: '🔤', kind: '퀴즈', d: '오늘의 핵심 낱말을 맞혀요',
        run(root, ctx) {
          root.append(W.cards([{ e: '📖', t: '우리나라 헌법에서는?', body: '모든 국민은 세금을 내야 하며, <b>어떤 세금을 얼마나 내는지는 법률로 정한다</b>고 나타내고 있어요.' }]));
          root.append(W.word({ answer: '조세법률주의', choices: ['조세공평주의', '조세평등주의', '세금마음주의'], desc: '국민이 어떤 세금을 얼마나 내야 하는지 <b>법률</b>에 따라 정해진다는 뜻의 낱말은?', hint: '세금(조세) + 법률', onDone: () => {
            root.append(h('div.card.def', h('b', '📌 조세법률주의'), h('p', '국민이 어떤 세금을 얼마나 내야 하는지는 국민의 대표로 이루어진 국회에서 <b>법률</b>로 결정해요.')));
            ctx.finish(null, '조세법률주의를 알게 되었어요!');
          } }));
        } },
    ],
  };
})();
