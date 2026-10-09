/* 10차시 · 안녕! 진짜 세금 내는 세상 */
(function () {
  const { h, W, E, fmt, shuffle } = S;

  S.sessions[10] = {
    title: '안녕! 진짜 세금 내는 세상', sub: '세금의 역사, 재미있는 세금, 미래의 세금', e: '🌏', color: '#5B6EE1',
    story: [
      { who: '세심이', img: 'bee-hello', t: '이제 세심마을 여행도 끝이 보여! 마지막 시간에는 <b>진짜 세상의 세금</b> 이야기를 들려줄게.' },
      { who: '무출이', img: 'kid-boy', t: '옛날 사람들은 세금을 어떻게 냈어? <b>웃기고 신기한 세금</b>도 있었다던데!' },
      { who: '세연이', img: 'kid-girl', t: '앞으로 우리가 어른이 되면 어떤 세금이 생길까? 같이 상상해 보자!' },
    ],
    goals: ['세금의 역사를 시간 순서로 알아요.', '세상에 있었던 재미있는 세금 이야기를 알아요.', '세금과 미래 사회를 연결해 생각해 보고, 세심교실을 돌아봐요.'],
    recap: {
      term: '세금과 우리의 미래', def: '세금은 오랜 역사 속에서 사회 문제를 해결하며 모양을 바꾸어 왔고, 앞으로도 새로운 세금이 생겨날 수 있어요.',
      points: ['세금은 문자가 만들어질 때부터 있었고, 시대와 사회의 문제를 해결하며 <b>계속 바뀌어 왔어요</b>.', '세종대왕은 땅의 <b>비옥도(6등급)</b>와 그해 농사의 <b>풍흉(9등급)</b>을 고려해 세금을 정했어요.', '우리나라는 1966년 <b>국세청</b>, 1993년 <b>금융실명제</b>로 더 공정한 조세제도를 만들어 왔어요.', '내가 낸 세금이 <b>낭비되지 않는지 지켜보는 일</b>도 성실한 납세자의 몫이에요.'],
    },
    task: '세심교실을 마무리하며 공부한 내용을 되돌아봐요. 세금에 대해 알게 된 점이나 소감을 글 또는 그림으로 나타내고, 세심교실 교육활동 인증서를 받아요!',
    next: '세심마을 여행을 마쳤어요. 정직한 세금으로 우리 마을을 지키는 시민이 되어요! 🌟',
    activities: [
      /* ---------- 1 세금의 역사 ---------- */
      { id: 'history', t: '세금의 역사 여행', e: '⏳', kind: '탐험', d: '옛날부터 지금까지 세금은 어떻게 변했을까요?',
        run(root, ctx) {
          const ev = [
            { y: '아주 먼 옛날', e: '🏺', t: '수메르의 점토판', b: '글자가 만들어진 초기에, 사람들은 점토판에 <b>세금으로 걷은 곡식과 가축</b>을 기록했다고 해요. 문자와 세금은 함께 시작되었어요.' },
            { y: '서기 70년경', e: '🏛️', t: '로마의 오줌세', b: '세금에 진심이었던 나라, 로마! 황제가 <b>오줌을 모아 파는 사람들에게 세금</b>을 걷고, 그 돈으로 길과 공공시설을 만들었어요.' },
            { y: '삼국~고려', e: '🌾', t: '조·용·조 (租庸調)', b: '우리나라 첫 조세제도예요. <b>조(租)</b>는 농사짓는 땅, <b>용(庸)</b>은 병역의 의무가 있는 어른 남자, <b>조(調)</b>는 가족이 사는 집을 기준으로 세금을 걷었어요.' },
            { y: '1444년', e: '👑', t: '세종대왕의 공법', b: '세종대왕은 백성 여론조사를 거쳐 <b>공법</b>을 정했어요. 땅이 좋은지 나쁜지(전분 6등법), 풍년인지 흉년인지(연분 9등법)를 고려했어요.' },
            { y: '1773년', e: '🍵', t: '보스턴 차 사건', b: '영국이 식민지 미국에 차 세금을 부과하자, 사람들이 <b>"대표 없이 세금 없다"</b>며 차 상자를 바다에 던졌어요. 이 일은 미국이 탄생하는 계기가 되었어요.' },
            { y: '1966년', e: '🏢', t: '국세청의 탄생', b: '우리나라의 모든 세금을 관리하는 <b>국세청</b>이 생기면서 조세제도가 체계적으로 발전했어요. (한국조세재정연구원은 1992년부터 연구를 이어가고 있어요.)' },
            { y: '1993년', e: '🪪', t: '금융실명제', b: '모든 금융거래를 <b>실명으로</b> 하도록 한 제도예요. 가짜 이름 거래로는 소득을 알 수 없어 세금이 불공평해졌는데, 금융실명제 덕분에 공정한 조세 의무가 널리 자리 잡았어요.' },
          ];
          root.append(W.bee('시간 여행을 떠나요! 카드를 눌러 <b>세금의 역사</b>를 읽어 봐요.', 'bee-read'),
            h('div.timeline', ev.map(x => { const c = h('div.tl', { onclick: () => { c.classList.toggle('open'); S.sfx('pop'); } }, h('div.tl-y', x.y), h('div.tl-b', h('div.tl-h', h('span.tl-e', x.e), h('b', x.t)), h('div.tl-t', { html: x.b }))); return c; })));
          // 연분구등법 체험
          const grades = ['상상', '상중', '상하', '중상', '중중', '중하', '하상', '하중', '하하']; let g = 0;
          const out = h('div.k-out'), btns = h('div.chips');
          const show = () => { const tax = 20 - g * 2; out.innerHTML = `올해 농사는 <b>${grades[g]}년</b> ${g === 0 ? '(완전 대박!)' : g === 8 ? '(망함 ㅠㅠ)' : ''} → 땅 1결당 세금 <b>${tax}말</b>`; S.$$('.chip', btns).forEach((b, i) => b.classList.toggle('on', i === g)); };
          grades.forEach((n, i) => btns.append(h('button.chip', { onclick: () => { g = i; show(); S.sfx('pop'); } }, n)));
          root.append(h('div.card', h('h3', '🌾 연분구등법 체험'), h('p.sm', '풍년과 흉년의 정도를 9등급으로 나누어 세금을 걷는 제도예요. 풍년엔 더 걷고 흉년엔 덜 걷었어요. 하나씩 눌러 보세요!'), btns, out));
          show();
          root.append(h('h3.sec', '🔢 순서 맞히기'), W.order({ prompt: '오래된 일부터 순서대로 눌러 보세요.', steps: ['로마의 오줌세', '조·용·조 제도', '세종대왕의 공법(1444년)', '보스턴 차 사건(1773년)', '국세청 탄생(1966년)', '금융실명제(1993년)'], onDone: () => ctx.finish(null, '세금의 역사를 순서대로 알았어요!') }));
        } },

      /* ---------- 2 이런 세금 진짜? ---------- */
      { id: 'funny', t: '이런 세금, 진짜?', e: '🤪', kind: 'OX 퀴즈', d: '세상의 신기하고 재미있는 세금을 맞혀요',
        run(root, ctx) {
          root.append(W.cards([{ e: '🤹', t: '세상에는 이런 세금도 있었어요', body: '강아지세, 창문세, 모자세, 수염세, 벽돌세, 헤어파우더세, 소금세, 양초세... 시대마다 나라마다 정말 다양하고 재미있는 세금이 있었어요!' }]));
          const Q = [
            ['창문이 많으면 세금을 더 내야 했다.', true, '영국에서 1696년부터 창문 개수에 따라 세금을 걷는 창문세가 있었어요.'],
            ['모자를 사는 사람은 세금을 더 내야 했다.', true, '영국에서 한때 모자에 세금(모자세)을 매겼어요.'],
            ['웃으면 세금을 내야 했다.', false, '웃음에 세금을 걷은 적은 없어요. 😄'],
            ['강아지를 키우면 세금을 내야 했다.', true, '영국에는 개세(강아지세)가 있었고, 독일에는 지금도 있어요.'],
            ['수염을 기르면 세금을 내야 했던 나라가 있었다.', true, '러시아의 표트르 1세는 1698년 수염세를 만들었어요.'],
            ['옛날에는 소금을 사고팔 때 세금을 냈다.', true, '소금은 생활필수품이라 소금세가 있었어요.'],
            ['집을 지을 때 벽돌 개수에 따라 세금을 낸 적이 있다.', true, '영국에서 한때 벽돌세를 걷었어요.'],
            ['머리를 감지 않아 냄새가 나면 세금을 냈다.', false, '그런 세금은 없었어요.'],
            ['음식에 설탕이 많이 들어가면 세금을 내는 나라가 있다.', true, '노르웨이 등 여러 나라에 설탕세가 있어요.'],
            ['비 오는 날 우산을 안 쓰면 세금을 내야 한다.', false, '그런 세금은 없어요. ☔'],
            ['공원이나 도서관을 이용할 수 있는 것은 세금 덕분이다.', true, '공공시설은 세금으로 만들고 운영해요.'],
            ['친구랑 장난을 치면 세금을 내야 한다.', false, '그런 세금은 없어요. 장난은 적당히만 해요 😉'],
            ['로마에는 오줌에도 세금이 있었다.', true, '오줌세! 황제 베스파시아누스 때 유명해졌어요.'],
            ['소의 방귀·트림(메탄가스)에 세금을 매기기로 한 나라가 있다.', true, '덴마크는 가축의 온실가스에 세금을 매기기로 했어요.'],
          ];
          root.append(h('h3.sec', '🤪 진짜일까? 가짜일까?'), W.ox({ items: shuffle(Q).slice(0, 10).map(q => ({ q: q[0], a: q[1], why: q[2] })), onDone: (s, t) => ctx.finish(null, `${t}문제 중 ${s}문제! 세금 이야기 박사!`) }));
        } },

      /* ---------- 3 오줌세와 창문세 ---------- */
      { id: 'tales', t: '오줌세와 창문세 이야기', e: '🚽', kind: '이야기·게임', d: '세금이 도시를 어떻게 바꿨을까요?',
        run(root, ctx) {
          const done = { quiz: false, game: false }; const chk = () => { if (done.quiz && done.game) ctx.finish(null, '세금이 세상을 바꾸는 이야기였어요!'); };
          root.append(W.cards([
            { e: '🧺', t: '오줌세 이야기 (로마)', body: '로마 사람들은 오줌으로 양털을 깨끗하게 씻는 데 썼어요. 오줌을 모아 파는 사람이 생기자 황제가 <b>오줌세</b>를 만들었고, 모은 세금으로 <b>화장실을 깨끗이 하고 낡은 길을 고쳤어요</b>.' },
            { e: '🪟', t: '창문세 이야기 (영국)', body: '영국에서는 창문 수가 많은 집이 부자라고 보고 <b>창문세</b>를 걷었어요. 사람들은 세금을 아끼려고 창문을 막아 버렸고, 집이 어둡고 답답해져 <b>건강이 나빠졌다</b>고 해요. 창문세는 지금은 없어요.' },
          ]));
          const Q = [
            { q: '로마 사람들은 양털을 깨끗이 하는 데 오줌을 사용했다.', a: true, why: '오줌은 양털을 씻는 데 쓰였어요.' },
            { q: '오줌세는 오줌을 마시는 사람에게 내는 돈이다.', a: false, why: '오줌을 모아 파는 사람에게 걷었어요.' },
            { q: '오줌세로 모은 돈은 화장실과 낡은 길을 고치는 데 쓰였다.', a: true, why: '공공시설을 위해 쓰였어요.' },
            { q: '창문세가 생기자 사람들이 창문을 막아 버리기도 했다.', a: true, why: '세금을 아끼려고 창문을 막았어요.' },
            { q: '창문세는 지금도 영국에서 내고 있다.', a: false, why: '지금은 없어졌어요.' },
          ];
          root.append(W.ox({ items: Q, onDone: () => { done.quiz = true; chk(); } }));
          root.append(h('h3.sec', '🏺 오줌세 게임: 항아리를 모아라!'), h('p.sm', '30초 동안 나타나는 항아리를 눌러요. 4개마다 세금 납부증 1장! 납부증으로 로마 시민을 위한 시설을 지어요.'));
          const gbox = h('div.moleg'); root.append(gbox);
          (function game() {
            let score = 0, time = 30, tm = null, sp = null;
            const info = h('div.center', '⏱️ 30초 · 항아리 0개'), grid = h('div.mgrid'), cells = Array.from({ length: 9 }, (_, i) => h('button.mcell', { onclick: () => hit(i) }, ''));
            cells.forEach(c => grid.append(c));
            const start = h('button.btn.primary.big', { onclick: () => run() }, '▶ 시작!');
            gbox.append(info, grid, h('div.nextrow', start));
            const clear = () => { clearInterval(tm); clearInterval(sp); S.cleanup = null; };
            function hit(i) { if (!cells[i].dataset.on) return; cells[i].dataset.on = ''; cells[i].textContent = ''; score++; S.sfx('coin'); info.textContent = `⏱️ ${time}초 · 항아리 ${score}개`; }
            function run() {
              start.remove(); score = 0; time = 30; S.cleanup = clear;
              tm = setInterval(() => { time--; info.textContent = `⏱️ ${time}초 · 항아리 ${score}개`; if (time <= 0) { clear(); cells.forEach(c => { c.textContent = ''; c.dataset.on = ''; }); end(); } }, 1000);
              sp = setInterval(() => { const c = S.pick(cells); c.dataset.on = '1'; c.textContent = '🏺'; setTimeout(() => { c.dataset.on = ''; c.textContent = ''; }, 900); }, 650);
            }
            function end() {
              const pap = Math.floor(score / 4), bl = ['🚽 깨끗한 화장실', '🏛️ 시민 건물', '🛣️ 튼튼한 도로', '🌳 시민 공원', '⛲ 분수대', '🏟️ 경기장'];
              gbox.append(h('div.card.center', h('h3', `항아리 ${score}개 → 세금 납부증 ${pap}장!`), h('p', pap ? '로마 시민을 위해 이런 것을 만들었어요:' : '아쉽지만 한 번 더 도전해 봐요!'), h('div.made', bl.slice(0, pap).map(x => h('span.made-i.pop', x))), h('button.btn.primary', { onclick: () => { S.clear(gbox); game(); } }, '🔁 다시'), pap >= 1 ? '' : ''));
              if (pap >= 2) { done.game = true; chk(); }
            }
          })();
        } },

      /* ---------- 4 로봇세와 미래의 세금 ---------- */
      { id: 'future', t: '로봇세, 미래의 세금?', e: '🤖', kind: '토론·상상', d: '미래에는 어떤 세금이 생겨날까요?',
        run(root, ctx) {
          const d = { side: null };
          const wiz = W.wizard([
            next => h('div.step', W.bee('로봇이 사람 대신 일하는 세상이 오고 있어요. 로봇이 일해서 번 돈에도 <b>세금</b>을 걷어야 할까요? 이것이 <b>로봇세</b> 이야기예요.', 'bee-look'),
              W.cards([{ e: '🤖', t: '로봇세란?', body: '로봇이나 인공지능이 일을 대신하게 되면 사람의 일자리와 소득이 줄어 세금도 줄 수 있어요. 그래서 <b>로봇을 쓰는 이익에 세금을 걷자</b>는 주장이 나왔어요. 마이크로소프트의 빌 게이츠도 2017년에 이런 의견을 말했어요.' },
                { e: '👍', t: '찬성하는 의견', body: '일자리를 잃은 사람을 돕고, 교육과 복지에 쓸 돈을 마련할 수 있어요.' }, { e: '👎', t: '반대하는 의견', body: '세금이 부담되어 기술 개발이나 투자가 줄어들 수 있어요.' }]), W.next('내 생각 말하기 ▶', next)),
            next => {
              const ch = W.chips({ options: ['로봇세에 찬성해요', '로봇세에 반대해요', '더 생각해 볼래요'], onChange: v => (d.side = v[0]) });
              const ta = h('textarea', { rows: 2, placeholder: '그렇게 생각한 이유를 써 주세요.' });
              return h('div.step', h('div.card', h('h3', '🗳️ 질문 하나: 로봇세 도입에 대한 내 생각은?'), ch, ta), W.next('다음 ▶', () => { if (!d.side || ta.value.trim().length < 6) { S.toast('생각과 이유를 써 주세요', 'bad'); return; } E.diary('10차시 로봇세 내 생각', `${d.side} — ${ta.value.trim()}`); next(); }));
            },
            () => {
              const nm = h('input', { type: 'text', maxlength: 12, placeholder: '예) 우주여행세, 인공지능세' }), ta = h('textarea', { rows: 2, placeholder: '어떤 문제를 해결하려는 세금인가요? 누가, 어떻게 내나요?' });
              return h('div.step', W.bee('질문 둘! 다가올 미래에는 또 어떤 세금이 생겨날 수 있을까요? <b>미래의 세금 카드</b>를 만들어 봐요!', 'bee-paper'), h('div.card', h('label', '세금 이름 ', nm), ta),
                W.next('미래 세금 카드 만들기 🃏', () => {
                  if (nm.value.trim().length < 2 || ta.value.trim().length < 6) { S.toast('이름과 설명을 써 주세요', 'bad'); return; }
                  S.addLaw({ name: '미래의 세금: ' + nm.value.trim(), how: ta.value.trim(), why: '10차시 상상 활동' }); E.diary('10차시 미래의 세금', nm.value.trim() + ' — ' + ta.value.trim()); E.badge('future', '미래 세금 설계자', '🔮');
                  wiz.append(h('div.herocard.pop', h('div.hc-e', '🔮'), h('b', nm.value.trim()), h('p', ta.value.trim()))); ctx.finish(null, '상상한 미래의 세금이 세법전에 기록됐어요!');
                }));
            },
          ]);
          root.append(wiz);
        } },

      /* ---------- 5 세금 낭비 감시 ---------- */
      { id: 'waste', t: '우리의 세금, 우리가 지켜요', e: '🔦', kind: '분류·글쓰기', d: '세금이 잘 쓰이는지 살펴보는 눈을 길러요',
        run(root, ctx) {
          root.append(W.bee('내가 낸 세금이 <b>낭비</b>되지 않는지 지켜보는 것도 시민의 몫이에요. 다음 사례는 어떨까?', 'bee-magnify'));
          const it = (t, e, b, why) => ({ t, e, b, why, hint: '꼭 필요한 일인지, 모두에게 도움이 되는지 생각해 봐요.' });
          root.append(W.sort({ buckets: [{ id: 'good', label: '세금이 잘 쓰였어요', emoji: '👍', cls: 'green' }, { id: 'waste', label: '세금이 낭비됐어요', emoji: '💸', cls: 'red' }],
            items: shuffle([
              it('비 오는 날 물이 넘치지 않게 배수 시설을 정비했어요', '🌧️', 'good', '재난을 예방하는 꼭 필요한 일이에요'), it('아무도 쓰지 않는 건물을 계속 새로 짓고 있어요', '🏗️', 'waste', '필요 없는 곳에 쓰면 낭비예요'),
              it('낮에도 가로등이 하루 종일 켜져 있어요', '💡', 'waste', '전기와 세금이 낭비돼요'), it('도서관에 어린이 책을 새로 사 놓았어요', '📚', 'good'), it('고장 나지 않은 멀쩡한 보도블록을 자꾸 새로 깔아요', '🧱', 'waste'),
              it('소방차를 새로 사서 화재에 대비했어요', '🚒', 'good'), it('사용하지 않는 수도꼭지를 계속 틀어 놓았어요', '🚰', 'waste'), it('학교에 안전한 놀이터를 만들었어요', '🛝', 'good'),
            ]).slice(0, 8), onDone: () => {
              root.append(W.note({ prompt: '🔦 <b>내가 발견한 세금 낭비</b>(또는 세금이 잘 쓰인 모습)을 포스트잇에 쓰듯 써 보세요.', placeholder: '예) 우리 학교 복도 불이 아무도 없는데도 켜져 있다. 끄면 전기 세금을 아낄 수 있다.', key: 'k10.waste', diaryTitle: '10차시 세금 지킴이 발견', min: 10, onDone: () => { E.badge('guard', '세금 지킴이', '🔦'); ctx.finish(null, '세금을 지키는 눈을 가졌어요!'); } }));
            } }));
        } },

      /* ---------- 6 졸업 ---------- */
      { id: 'finale', t: '굿바이 세심교실', e: '🎓', kind: '돌아보기', d: '배움을 되돌아보고 그림일기를 써요',
        run(root, ctx) {
          const p = S.me;
          root.append(W.bee('세심마을 여행이 끝나 가요. 내가 해낸 일을 돌아볼까요?', 'bee-hello'),
            h('div.card.statgrid', [['💰', E.money(E.totalTax()), '지금까지 낸 세금'], ['🏅', Object.keys(p.badges).length + '개', '모은 배지'], ['🧾', (p.receipts || []).length + '장', '납부확인증'], ['📜', (p.laws || []).length + '개', '내가 제안한 세금']].map(x => h('div.st', h('div.st-e', x[0]), h('b', x[1]), h('div.sm', x[2])))));
          // 그림일기
          const cv = h('canvas.drawpad', { width: 360, height: 220 }), ctx2 = cv.getContext('2d'); ctx2.fillStyle = '#fffdf3'; ctx2.fillRect(0, 0, 360, 220);
          let col = '#3B6FD4', sz = 4, dr = false; ctx2.lineCap = 'round'; ctx2.lineJoin = 'round';
          const pos = e => { const r = cv.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; return [(t.clientX - r.left) * 360 / r.width, (t.clientY - r.top) * 220 / r.height]; };
          const st = e => { dr = true; const [x, y] = pos(e); ctx2.beginPath(); ctx2.moveTo(x, y); ctx2.strokeStyle = col; ctx2.lineWidth = sz; ctx2.lineTo(x + .1, y + .1); ctx2.stroke(); e.preventDefault(); };
          const mv = e => { if (!dr) return; const [x, y] = pos(e); ctx2.lineTo(x, y); ctx2.stroke(); e.preventDefault(); };
          cv.addEventListener('mousedown', st); cv.addEventListener('mousemove', mv); window.addEventListener('mouseup', () => (dr = false));
          cv.addEventListener('touchstart', st, { passive: false }); cv.addEventListener('touchmove', mv, { passive: false }); cv.addEventListener('touchend', () => (dr = false));
          const cols = ['#3B6FD4', '#E5484D', '#2FA66E', '#E0A100', '#B07CE8', '#3a2e1f'];
          const tools = h('div.inline.cc', cols.map(c => h('button.colbtn', { style: { background: c }, onclick: () => { col = c; sz = 4; } })), h('button.btn.sm', { onclick: () => { col = '#fffdf3'; sz = 18; } }, '🧽 지우개'), h('button.btn.sm', { onclick: () => { ctx2.fillStyle = '#fffdf3'; ctx2.fillRect(0, 0, 360, 220); } }, '🗑️ 전부 지우기'));
          const ta = h('textarea', { rows: 3, placeholder: '세심교실에서 가장 인상 깊었던 활동과 세금에 대해 알게 된 점을 써 보세요.' });
          root.append(h('div.card', h('h3', '🎨 그림일기: 가장 인상 깊었던 활동'), cv, tools, ta,
            h('div.nextrow', h('button.btn.primary.big', { onclick: () => {
              if (ta.value.trim().length < 10) { S.toast('소감을 조금 더 써 주세요', 'bad'); return; }
              try { E.note('k10.draw', cv.toDataURL('image/png')); } catch (e) { }
              E.diary('10차시 졸업 소감', ta.value.trim()); S.confetti(80); S.sfx('win');
              root.append(h('div.card.center', h('div.big-emoji', '🎓'), h('h3', '세심교실 졸업을 축하해요!'), h('p', '모든 차시를 마치면 수료증을 받을 수 있어요.'), h('a.btn.primary.big', { href: '#/cert' }, '🏅 수료증 보러 가기')));
              ctx.finish(null, '세심교실의 모든 활동을 마무리했어요!');
            } }, '졸업 소감 제출'))));
        } },
    ],
  };
})();
