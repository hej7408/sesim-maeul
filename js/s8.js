/* 8차시 · 세금을 안 내려 한다고? (탈세와 절세, 성실납세) */
(function () {
  const { h, W, E, fmt, shuffle } = S;

  S.sessions[8] = {
    title: '세금을 안 내려 한다고?', sub: '탈세와 절세, 성실납세자 되기', e: '🕵️', color: '#C0447A',
    story: [
      { who: '무출이', img: 'kid-boy', t: '세금 내는 건 너무 <b>아깝고 억울해!</b> 몰래 안 내면 안 될까?' },
      { who: '세연이', img: 'kid-girl', t: '난 세금 내는 건 <b>자랑스럽고 뿌듯하던데?</b> 우리 마을이 좋아지니까!' },
      { who: '세심이', img: 'bee-magnify', t: '세금을 덜 내려는 마음, 모두 같은 걸까? 법을 어기는 <b>탈세</b>와 법 안에서 아끼는 <b>절세</b>는 완전히 달라! 🔍' },
    ],
    goals: ['탈세와 절세의 차이를 설명할 수 있어요.', '탈세가 우리 모두에게 어떤 문제를 만드는지 알아요.', '성실한 납세자가 되겠다는 다짐을 해요.'],
    recap: {
      term: '탈세와 절세', def: '탈세는 세금을 내지 않기 위해 법을 어기는 행위, 절세는 법의 테두리 안에서 내야 할 세금을 절약하는 현명한 행동',
      points: ['<b>탈세</b>는 마땅히 내야 할 세금을 덜 내거나 안 내려고 <b>법을 어기는</b> 행동이에요.', '<b>절세</b>는 법을 지키며 정확히 내야 할 만큼만 내려는 <b>현명한 납세자의 권리</b>예요. (현금영수증, 가족카드, 세금혜택 저축)', '탈세는 성실한 납세자의 <b>납세 의욕</b>을 떨어뜨리고, 안전하고 편리한 시설을 만들 <b>세금을 줄어들게</b> 해요.', '성실한 납세자가 되는 것은 <b>우리 모두의 안전하고 편리한 생활</b>을 위한 첫걸음이에요.'],
    },
    task: '성실납세서약서의 각 조항을 꼼꼼히 읽고 날짜와 이름을 써요. 선창할 어린이를 정해 제목·본문·조항을 읽으면, 후창하는 어린이들이 각 조항의 뒷부분을 따라 읽으며 선서해요.',
    next: '다음 시간에는 "한 해 동안 걷고 쓴 세금의 결산"에 대해 알아봐요!',
    activities: [
      /* ---------- 1 두 마음 ---------- */
      { id: 'mind', t: '세금을 내지 않으려는 사람들', e: '🙈', kind: '토론', d: '탈세란 무엇이고 어떻게 막을까요?',
        run(root, ctx) {
          const d = {};
          const wiz = W.wizard([
            next => h('div.step', W.bee('무출이와 세연이의 생각이 달라요. 나는 어느 쪽일까?', 'bee-hello'),
              h('div.opts', ['😫 세금 내는 건 아깝고 억울해!', '😊 세금 내는 건 자랑스럽고 뿌듯해!'].map((t, i) => h('button.opt', { onclick: e => { d.a = i; S.$$('.opt', wiz).forEach(x => x.classList.remove('right')); e.currentTarget.classList.add('right'); S.sfx('pop'); } }, t))),
              W.next('다음 ▶', () => { if (d.a == null) { S.toast('하나를 골라 주세요', 'bad'); return; } next(); })),
            next => h('div.step', W.bee('세금을 내지 않으려고 일부러 법을 어기는 사람들이 실제로 있어요.', 'bee-look'),
              W.cards([
                { e: '📰', t: '숨긴 재산, 호화 생활', body: '수억 원을 번 유명 인터넷 방송인이 친척 이름의 계좌에 재산을 숨겨 놓고 세금을 내지 않다가 <b>상습 체납자</b>로 알려진 일이 있었어요. (2023년 뉴스)' },
                { e: '🎰', t: '큰돈을 받고도?', body: '복권 1등에 당첨되고도 세금을 내지 않은 사람 이야기도 있어요. 큰돈을 벌었다면 그만큼 <b>세금도 책임져야</b> 해요.' },
              ]), W.next('다음 ▶', next)),
            next => h('div.step', h('div.card.def', h('h3', '🚫 탈세'), h('p', '마땅히 내야 할 세금을 <b>덜 내거나 내지 않기 위해 법을 어기는 행위</b>')), W.word({ answer: '탈세', choices: ['절세', '납세', '감세'], desc: '법을 어기며 세금을 내지 않는 행위는?', onDone: () => S.$('.nextrow', wiz).style.display = '' }), (() => { const n = W.next('다음 ▶', next); n.style.display = 'none'; return n; })()),
            next => h('div.step', W.bee('나라에서는 탈세를 가만두지 않아요! <b>끝까지 추적해서 반드시 징수</b>해요.', 'bee-magnify'),
              h('div.chase', ['🔍 국세청이 수상한 거래를 찾아요', '🕵️ 숨긴 재산을 끝까지 추적해요', '⚖️ 밀린 세금과 벌금을 모두 받아요'].map(t => h('div.chase-s', t))),
              W.next('알겠어요! ▶', next)),
            () => h('div.step', h('div.card.center', h('div.big-emoji', '🏆'), h('h3', '탈세는 정말 위험한 선택이에요'), h('p', '숨기면 더 큰 벌금과 신뢰의 손해를 입어요.')), W.note({ prompt: '탈세를 막으려면 어떻게 해야 할지, 또는 나는 어떤 납세자가 되고 싶은지 써 보세요.', placeholder: '예) 나는 영수증을 꼭 받고, 세금을 정직하게 내는 사람이 될 거예요.', key: 'k8.mind', diaryTitle: '8차시 내가 되고 싶은 납세자', min: 8, onDone: () => ctx.finish(null, '탈세는 법을 어기는 일! 정직한 납세자가 되어요.') })),
          ]);
          root.append(wiz);
        } },

      /* ---------- 2 탈세 vs 절세 ---------- */
      { id: 'sort', t: '탈세일까? 절세일까?', e: '⚖️', kind: '분류 게임', d: '법을 어겼는지, 지켰는지 판단해요',
        run(root, ctx) {
          root.append(W.cards([{ e: '💡', t: '절세란?', body: '세금을 덜 내려는 노력이 <b>모두 나쁜 것은 아니에요!</b> 법의 테두리 안에서 내야 할 세금을 절약하는 건 현명한 납세자의 권리예요. 현금영수증 받기, 가족카드 쓰기, 세금혜택 저축 가입하기가 대표적이에요.' }]));
          const it = (t, e, b, why) => ({ t, e, b, why, hint: '법을 어겼는지, 법이 허용한 방법인지 생각해 봐요.' });
          root.append(W.sort({ buckets: [{ id: 'evade', label: '탈세', emoji: '🚫', cls: 'red', sub: '법을 어겨요' }, { id: 'save', label: '절세', emoji: '💡', cls: 'green', sub: '법 안에서 아껴요' }],
            items: shuffle([
              it('현금으로 사고 현금영수증 받기', '🧾', 'save', '현금영수증은 소득공제로 이어져요'), it('가족카드를 만들어 함께 쓰기', '💳', 'save'), it('세금 혜택이 있는 저축 가입하기', '🐷', 'save', '이자 세금을 아낄 수 있어요'),
              it('번 돈을 숨기고 신고하지 않기', '🙈', 'evade'), it('가짜 영수증으로 비용 부풀리기', '📄', 'evade', '거짓 서류는 불법이에요'), it('친척 이름의 통장에 재산 숨기기', '🏦', 'evade'),
              it('기부하고 기부금 영수증 받아 공제 신청하기', '💝', 'save'), it('거짓으로 장부 쓰기', '📓', 'evade'), it('세무사에게 물어 법이 허용한 공제 챙기기', '🧑‍💼', 'save'),
            ]), onDone: () => {
              root.append(h('div.card.def', h('b', '💡 한 걸음 더!'), h('p', '세심은행의 <b>세금우대 저축</b>은 이자에 세금이 붙지 않아요. 실제로 해 보면 절세 효과를 느낄 수 있어요.'), h('a.btn.green', { href: '#/bank' }, '🏦 은행에 가 보기')));
              ctx.finish(null, '법을 지키며 아끼는 절세는 현명한 방법이에요!');
            } }));
        } },

      /* ---------- 3 세금공무원 ---------- */
      { id: 'inspector', t: '도와줘요, 세금공무원!', e: '🚨', kind: '반응 게임', d: '시민 카드를 보고 단속할지 판단해요',
        run(root, ctx) {
          const bad = ['가게 주인이 현금으로 받은 돈을 장부에 적지 않고 숨겼어요.', '"영수증을 안 끊어 주면 깎아 줄게요"라며 영수증을 발급하지 않았어요.', '가짜 영수증을 만들어 비용을 부풀렸어요.', '돈 번 사실을 숨기려고 남의 이름 통장을 사용했어요.', '수입이 많은데 일부러 신고를 하지 않았어요.', '손님에게 부가가치세를 받고도 나라에 내지 않았어요.', '재산을 물려받고도 상속세 신고를 하지 않았어요.', '세금 낼 돈이 있는데도 재산을 숨기고 계속 안 냈어요.'];
          const ok = ['현금으로 물건을 사고 현금영수증을 받았어요.', '가족카드를 만들어 가족이 함께 사용해요.', '세금 혜택이 있는 저축 상품에 가입했어요.', '기부를 하고 기부금 영수증을 받아 세금 공제를 신청했어요.', '월급 명세서를 확인하고 세금이 맞는지 살펴봤어요.', '세무사의 도움을 받아 세금을 신고했어요.', '가게에서 영수증을 꼭 발급하고 장부를 정확히 썼어요.', '세금 낼 날짜 전에 미리 납부했어요.', '법에서 정한 공제 항목을 꼼꼼히 챙겨 신고했어요.', '내야 할 세금을 한 푼도 빠짐없이 신고하고 냈어요.'];
          const deck = shuffle([...shuffle(bad).slice(0, 6).map(t => ({ t, bad: true })), ...shuffle(ok).slice(0, 8).map(t => ({ t, bad: false }))]);
          let i = 0, chips = 5, right = 0, locked = false, timer = null, left = 10;
          const box = h('div.inspect');
          S.cleanup = () => clearInterval(timer);
          const show = () => {
            clearInterval(timer); S.clear(box); locked = false;
            if (i >= deck.length) return end();
            const c = deck[i]; left = 10;
            const bar = h('div.tbar', h('i')), fb = h('div.feedback');
            const ans = guess => {
              if (locked) return; locked = true; clearInterval(timer);
              const okk = guess === c.bad;
              if (okk) { chips += 1; right++; S.sfx('ok'); } else { chips = Math.max(0, chips - 2); S.sfx('bad'); }
              fb.className = 'feedback show ' + (okk ? 'good' : 'bad');
              fb.innerHTML = (guess === null ? '⏰ 시간 초과! ' : okk ? '⭕ 맞아요! ' : '❌ 아니에요. ') + (c.bad ? '이건 <b>단속 대상</b>이에요. 법을 어기고 세금을 피하려 했어요.' : '이건 <b>문제없는 행동</b>이에요. 법을 지키는 성실한 모습이에요.');
              fb.append(h('div', h('button.btn.primary', { onclick: () => { i++; show(); } }, '다음 ▶')));
              S.$('.chipcnt', box).textContent = '세심칩 ' + '🪙'.repeat(chips);
            };
            box.append(h('div.inline.spread', h('span', `${i + 1}/${deck.length}`), h('b.chipcnt', '세심칩 ' + '🪙'.repeat(chips))), bar,
              h('div.citizen', h('div.cz-e', '🧑'), h('p', c.t)),
              h('div.oxrow', h('button.bigact.catch', { onclick: () => ans(true) }, h('div', '🚫'), '단속!'), h('button.bigact.fine', { onclick: () => ans(false) }, h('div', '✅'), '문제없음')), fb);
            timer = setInterval(() => { left -= .1; bar.firstChild.style.width = (left * 10) + '%'; if (left <= 0) ans(null); }, 100);
          };
          const end = () => {
            const win = chips >= 8; if (win) E.badge('inspector', '세금공무원', '🚨');
            box.append(h('div.card.center', h('div.big-emoji', win ? '🏅' : '👍'), h('h3', win ? '훌륭한 세금공무원이에요!' : '수고했어요! 다시 도전해 볼까요?'), h('p', `맞힌 카드 ${right}/${deck.length} · 세심칩 ${chips}개`),
              win ? null : h('button.btn.primary', { onclick: () => { i = 0; chips = 5; right = 0; deck.splice(0, deck.length, ...shuffle(deck)); show(); } }, '🔁 다시 도전')));
            if (win || right >= deck.length * .6) ctx.finish(null, '탈세를 가려내는 눈을 길렀어요!');
          };
          root.append(W.bee('세금공무원이 되어 <b>탈세를 단속</b>하고 성실한 시민은 도와줘요! 카드가 나오면 10초 안에 판단해요. 맞히면 🪙+1, 틀리면 🪙−2! (처음 5개)', 'bee-magnify'), box);
          show();
        } },

      /* ---------- 4 정직한 세금 이야기 ---------- */
      { id: 'story', t: '정직한 세금이 진짜 보물이야!', e: '🐝', kind: '이야기', d: '꿀벌 마을 이야기를 읽고 내 선택을 해요',
        run(root, ctx) {
          const pages = [
            ['🌲🍯', '깊고 푸른 숲에는 꿀을 사랑하는 동물들이 살았어요. 숲의 규칙은 하나! <b>모은 꿀의 일부를 꿀벌 마을에 세금으로 내는 것</b>이에요. 꿀벌들은 그 꿀로 숲을 돌보고 꽃을 피웠어요.'],
            ['🐜', '어느 날 개미는 세금이 아깝다고 생각했어요. "조금만 숨기면 아무도 모를 거야." 개미는 땅굴에 꿀을 숨기고, 세금 걷는 벌꿀오소리에게 "이게 전부야"라고 말했어요.'],
            ['🐝', '정직한 꿀벌 세심이는 땀 흘려 모은 꿀을 바구니에 담아 오소리에게 냈어요. "숲을 지키려면 내가 낼 건 꼭 내야 해."'],
          ];
          const wiz = W.wizard([
            ...pages.map(pg => next => h('div.step', h('div.storypg', h('div.sp-big', pg[0]), h('p', { html: pg[1] })), h('div.center', h('button.btn.sm', { onclick: () => S.speak(pg[1].replace(/<[^>]+>/g, '')) }, '🔊 읽어 주기')), W.next('다음 ▶', next))),
            next => h('div.step', h('div.storypg', h('div.sp-big', '🐻🦋'), h('p', { html: '개미가 꿀을 숨긴다는 소문이 퍼졌어요. 곰도, 나비도 "나도 조금만 숨겨도 되겠지?" 하며 꿀을 몰래 숨기기 시작했어요.' })),
              h('h3.center', '🤔 너라면 어떻게 할래?'), h('div.opts', ['나도 조금만 숨긴다', '그래도 정직하게 낸다'].map((t, i) => h('button.opt', { onclick: e => { S.$$('.opt', wiz).forEach(x => x.disabled = true); e.currentTarget.classList.add(i ? 'right' : 'wrong'); S.sfx(i ? 'ok' : 'bad'); wiz.append(h('div.feedback.show.' + (i ? 'good' : 'bad'), i ? '🌟 세심이처럼 정직하게! 모두가 그러면 숲이 건강해져요.' : '😬 모두가 조금씩 숨기면 어떻게 될까요? 다음 이야기를 읽어 봐요.', h('div', h('button.btn.primary', { onclick: next }, '다음 이야기 ▶')))); } }, t)))),
            next => h('div.step', h('div.storypg', h('div.sp-big', '🌧️🏚️'), h('p', { html: '모두가 꿀을 조금씩만 내자 꿀벌 마을에 꿀이 부족해졌어요. 꽃이 피지 않고 나무가 병들었죠. 그러다 큰비가 내려 나무가 쓰러지고 집이 무너지기 시작했어요!' })), W.next('다음 ▶', next)),
            next => h('div.step', h('div.storypg', h('div.sp-big', '😭🕳️'), h('p', { html: '개미는 숨겨 둔 꿀로 집을 지키려 땅굴로 달려갔지만, 꿀은 흙 속으로 사라진 뒤였어요. "그때 정직하게 세금을 냈더라면..."' })), W.next('다음 ▶', next)),
            next => h('div.step', h('div.storypg', h('div.sp-big', '🌸🍯'), h('p', { html: '동물들은 마음을 고쳐먹고 힘을 모아 꿀을 냈어요. 숲은 다시 푸르게 살아났죠. 오소리는 정직했던 세심이에게 황금 열매를 주었어요. <br><b>"정직한 세금이 진짜 보물이야."</b>' })), W.next('인터뷰 퀴즈 ▶', next)),
            next => W.quiz({ items: [
              { q: '🐜 개미 인터뷰: 꿀을 숨기면 어떤 나쁜 점이 있을까요?', opts: ['내가 더 많이 먹을 수 있다', '큰비에 집이 떠내려가도 지킬 수 없다', '꿀이 상하지 않는다'], a: 1, why: '모두의 세금이 줄면 위기에 대비하지 못해요.' },
              { q: '🐝 세심이 인터뷰: 꿀을 계속 내면 어떤 점이 좋을까요?', opts: ['숲을 지킬 수 있다', '혼자 다 쓸 수 있다', '아무 일도 일어나지 않는다'], a: 0, why: '세금은 모두의 숲을 지켜요.' },
              { q: '🦡 벌꿀오소리 인터뷰: 꿀을 걷는 일 중 가장 어려운 순간은?', opts: ['꿀이 달콤할 때', '꿀이 너무 많을 때', '동물들이 꿀을 숨길 때'], a: 2, why: '정직하게 내지 않으면 걷는 일이 어려워져요.' },
              { q: '🐻 곰 인터뷰: 곰이 꿀을 안 낸 이유로 알맞은 것은?', opts: ['아까워서', '털에 붙어서', '깜빡해서'], a: 0, why: '"아깝다"는 마음이 탈세로 이어졌어요.' },
              { q: '🦋 나비 인터뷰: 꿀을 정직하게 낸 친구를 보면 어떤 마음이 들까요?', opts: ['멋지다', '무섭다', '피곤하다'], a: 0, why: '정직한 납세자는 모두의 본보기가 돼요.' },
            ], onDone: () => { const b = W.next('다음 ▶', next); wiz.append(b); } }),
            () => {
              const animals = ['개미', '세심이', '벌꿀오소리', '곰', '나비']; let a = null, act = null;
              const ach = W.chips({ options: animals, onChange: v => (a = v[0]) });
              const dch = W.chips({ options: ['꿀을 걷을 거예요', '꿀을 다 줄 거예요', '꿀을 숨길 거예요', '꿀을 조금만 줄 거예요', '꿀을 나눠 줄 거예요'], onChange: v => (act = v[0]) });
              const ta = h('textarea', { rows: 2, placeholder: '왜 그렇게 할 건가요? 그러면 어떤 일이 생길까요?' });
              return h('div.step', W.bee('내가 동화 속 동물이 된다면? 골라 보세요!', 'bee-paper2'), h('div.card', h('p', '나는 ______이(가) 되었어요.'), ach, h('p', '나는 ______.'), dch, ta),
                W.next('제출 ▶', () => { if (!a || !act || ta.value.trim().length < 5) { S.toast('모두 채워 주세요', 'bad'); return; } E.diary('8차시 내가 동화 속 동물이라면', `나는 ${a}, ${act}. ${ta.value.trim()}`); ctx.finish(null, '정직한 세금이 진짜 보물이에요!'); }));
            },
          ]);
          root.append(wiz);
        } },

      /* ---------- 5 세금 히어로 ---------- */
      { id: 'hero', t: '세금을 지키는 히어로들', e: '🦸', kind: '만들기', d: '세금과 관련된 직업을 알고 나만의 히어로를 만들어요',
        run(root, ctx) {
          root.append(W.bee('세금을 지키는 사람들이 있어요! 직업과 별명을 이어 보세요.', 'bee-hello'),
            W.pairs({ pairs: [['🔍 국세청 직원', '세금 탐정 — 세금을 정직하게 내지 않은 사람을 찾아요'], ['🧑‍💼 세무사', '숫자 마법사 — 가게 주인이 세금을 정확하게 계산하도록 도와요'], ['🔬 한국조세재정연구원 연구원', '세금 과학자 — 세금을 어떻게 쓰면 좋을지 연구해요'], ['🏛️ 국회의원', '세금 설계자 — 세금과 관련된 법을 만들어요'], ['👮 경찰관·소방관', '세금 히어로 — 세금으로 안전하게 우리를 지켜 줘요']], onDone: () => hero() }));
          function hero() {
            const d = { name: '', power: '', tool: '🧮', emo: '🦸' };
            const nm = h('input', { type: 'text', maxlength: 12, placeholder: '예) 정의의 저울맨' }), pw = h('textarea', { rows: 2, placeholder: '어떤 능력이 있나요? 예) 사람을 저울에 올리면 세금을 제대로 냈는지 알 수 있어요.' });
            const emo = W.chips({ options: ['🦸', '🦸‍♀️', '🧙', '🦊', '🐝', '🤖'], selected: ['🦸'], onChange: v => (d.emo = v[0]) }), tool = W.chips({ options: ['⚖️', '🧮', '🔦', '🧾', '🛡️', '🪄'], selected: ['🧮'], onChange: v => (d.tool = v[0]) });
            root.append(h('h3.sec', '🦸 나만의 세금 히어로 만들기'), h('div.card', h('label', '이름', nm), h('p', '모습'), emo, h('p', '도구'), tool, h('p', '능력'), pw),
              h('div.nextrow', h('button.btn.primary', { onclick: () => {
                if (nm.value.trim().length < 2 || pw.value.trim().length < 5) { S.toast('이름과 능력을 써 주세요', 'bad'); return; }
                const card = h('div.herocard.pop', h('div.hc-e', d.emo), h('b', nm.value.trim()), h('div.hc-t', d.tool), h('p', pw.value.trim()));
                root.append(card); E.diary('8차시 세금 히어로', `${nm.value.trim()} ${d.emo}${d.tool}: ${pw.value.trim()}`); E.badge('hero', '세금 히어로 제작자', '🦸'); ctx.finish(null, '멋진 세금 히어로가 탄생했어요!');
              } }, '히어로 완성!')));
          }
        } },

      /* ---------- 6 서약서 ---------- */
      { id: 'oath', t: '성실납세 서약하기', e: '✍️', kind: '다짐', d: '조항을 함께 읽고 서명해요',
        run(root, ctx) {
          const claims = [['나는 납세의 의무를 다하는 시민으로서의', '자부심을 가진다.'], ['나는 정당하지 않은 방법으로 내야 할 세금을', '회피하지 않는다.'], ['나는 자랑스러운 납세자로서 납부한 세금이 올바른 곳에 쓰이는지 확인할 의무를', '소홀히 하지 않는다.']];
          let read = 0;
          const list = h('div.claims'), sign = W.signpad({}), signBox = h('div.card.center', { style: { display: 'none' } }, h('p', '이름 쓰는 곳에 서명해 주세요 ✍️'), sign, h('div', h('button.btn.sm', { onclick: () => sign.clearPad() }, '지우기')));
          claims.forEach((c, i) => {
            const b = h('div.claim', h('span.cl-n', '하나,'), h('div', h('span', c[0] + ' '), h('b.cl-b', c[1])), h('button.btn.sm', { onclick: e => { e.currentTarget.disabled = true; e.currentTarget.textContent = '✅ 읽었어요'; read++; S.sfx('ok'); S.speak(c[0] + ' ' + c[1]); if (read === claims.length) signBox.style.display = ''; } }, '📣 함께 읽기'));
            list.append(b);
          });
          const d = new Date();
          root.append(W.bee('우리 모두 <b>성실한 납세자</b>가 되기로 약속해요. 선창하는 사람이 앞부분을 읽으면, 나머지는 <b>굵은 글씨(뒷부분)</b>를 따라 읽어요!', 'bee-paper'),
            h('div.oathpaper', h('div.op-t', '성실납세 서약서'), h('p', '나는 안전하고 편리한 사회를 만들기 위해 성실한 납세자가 될 것을 굳게 다짐하며, 다음과 같이 서약합니다.'), list, h('p.center', `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`), h('p.center', `성실 납세자 ${S.me.name}`)),
            signBox, h('div.nextrow', h('button.btn.primary.big', { onclick: () => {
              if (read < claims.length) { S.toast('세 조항을 모두 읽어 주세요', 'bad'); return; } if (!sign.hasInk()) { S.toast('서명을 해 주세요', 'bad'); return; }
              S.sfx('stamp'); E.badge('oath', '성실 납세자', '🌟'); S.confetti(); E.diary('8차시 성실납세 서약', '성실납세 서약서에 서명했어요.');
              ctx.finish(null, '성실납세자가 되겠다고 약속했어요! 🌟');
            } }, '🖋️ 서약하기')));
        } },
    ],
  };
})();
