/* 1차시 · 우리 모두를 위한 세금이 필요해! */
(function () {
  const { h, W, E, fmt } = S;

  S.sessions[1] = {
    title: '우리 모두를 위한 세금이 필요해!', sub: '세금이 뭘까? 어디에 쓰일까?', e: '🏘️', color: '#F2A93B',
    story: [
      { who: '무출이', img: 'kid-boy', t: '우리 마을에는 신호등도 있고 도서관도 있고 공원도 있잖아. <b>이런 건 누가 만들어 준 거야?</b>' },
      { who: '세연이', img: 'kid-girl', t: '나라에서 만들었겠지? 그런데 그 <b>돈</b>은 어디서 났을까?' },
      { who: '세심이', img: 'bee-hello', t: '바로 우리 모두가 낸 <b>세금</b>이야! 오늘은 세금이 뭔지, 어디에 쓰이는지 마을을 돌아보며 찾아보자! 🐝' },
    ],
    goals: ['세금이 무엇인지 말할 수 있어요.', '내 주변에서 세금이 쓰이는 곳을 찾을 수 있어요.', '세금이 없다면 어떤 일이 생길지 알아요.'],
    recap: {
      term: '세금', def: '국가나 지방자치단체가 정부를 운영하기 위해 국민으로부터 법에 따라 걷는 돈',
      points: ['세금은 도로, 학교, 도서관, 신호등 같은 <b>우리 모두의 것</b>을 만들고 지키는 데 쓰여요.', '세금이 있어서 우리는 <b>안전하고 편리하게</b> 살 수 있어요.', '내 것은 사고팔 수 있지만, 우리 모두의 것은 <b>함께 아껴 써야</b> 해요.', '세심마을에서도 일해서 번 돈의 일부를 세금으로 내요.'],
    },
    task: '세심교실에도 신호등·도서관 같은 "우리 모두의 것"이 필요해요. 오늘 낸 세금은 앞으로 우리 반을 위해 쓰일 거예요!',
    next: '다음 시간에는 "세금을 정하는 법"에 대해 알아봐요!',
    activities: [
      /* ---------- 1 숨은 공공시설 찾기 ---------- */
      { id: 'map', t: '마을 속 숨은 공공시설 찾기', e: '🗺️', kind: '탐험', d: '세금으로 만든 곳 10곳을 찾아요',
        run(root, ctx) {
          const items = [
            { e: '🚦', n: '신호등', x: 22, y: 38, pub: 1, f: '신호등은 세금으로 설치하고 전기요금도 세금으로 내요.' },
            { e: '💡', n: '가로등', x: 40, y: 18, pub: 1, f: '밤길을 밝히는 가로등도 세금으로 만들어요.' },
            { e: '🏫', n: '공립학교', x: 12, y: 14, pub: 1, f: '국공립 학교와 급식은 세금의 도움으로 운영돼요.' },
            { e: '📚', n: '도서관', x: 62, y: 14, pub: 1, f: '누구나 책을 빌리고 공부할 수 있어요.' },
            { e: '🚒', n: '소방서', x: 84, y: 20, pub: 1, f: '소방차와 소방관 월급도 세금으로 나와요.' },
            { e: '🚓', n: '경찰서', x: 88, y: 55, pub: 1, f: '경찰서는 우리를 범죄로부터 지켜줘요.' },
            { e: '🌳', n: '공원', x: 52, y: 62, pub: 1, f: '공원은 세금으로 만든 곳도 있고, 아닌 곳도 있어요!' },
            { e: '🧹', n: '환경미화원', x: 30, y: 78, pub: 1, f: '환경미화원 아저씨의 청소도 세금으로 이루어져요.' },
            { e: '🛝', n: '놀이터', x: 70, y: 82, pub: 1, f: '마을 놀이터도 공공시설이에요.' },
            { e: '🚑', n: '구급차', x: 10, y: 60, pub: 1, f: '아플 때 달려오는 구급차도 우리의 세금으로!' },
            { e: '🏪', n: '편의점', x: 40, y: 42, pub: 0, f: '편의점은 주인이 장사하는 개인 가게예요.' },
            { e: '☕', n: '카페', x: 70, y: 40, pub: 0, f: '카페도 개인 가게! 하지만 가게 주인도 번 돈에서 세금을 내요.' },
            { e: '🏢', n: '아파트', x: 90, y: 82, pub: 0, f: '아파트는 주민이 돈을 모아 마련한 개인 재산이에요.' },
            { e: '🍗', n: '치킨집', x: 18, y: 90, pub: 0, f: '치킨집은 개인 가게예요.' },
          ];
          let found = 0; const need = items.filter(i => i.pub).length;
          const counter = h('div.counter', `찾은 곳 0 / ${need}`);
          const note = h('div.map-note', '👆 세금으로 만들어진 곳을 눌러 보세요!');
          const map = h('div.townmap', h('div.road.r1'), h('div.road.r2'));
          items.forEach(it => {
            const b = h('button.spot', { style: { left: it.x + '%', top: it.y + '%' }, onclick: () => {
              if (b.classList.contains('found') || b.classList.contains('nope')) { note.textContent = it.e + ' ' + it.f; return; }
              if (it.pub) {
                b.classList.add('found'); found++; S.sfx('ok'); counter.textContent = `찾은 곳 ${found} / ${need}`;
                note.textContent = '✅ ' + it.n + ': ' + it.f; S.floatText(b, '+세금!');
                if (found === need) { S.confetti(); ctx.finish(null, '마을 속 세금이 쓰이는 곳을 모두 찾았어요!'); }
              } else { b.classList.add('nope'); S.sfx('bad'); note.textContent = '❌ ' + it.n + ': ' + it.f; }
            } }, h('span.sp-e', it.e), h('span.sp-n', it.n));
            map.append(b);
          });
          root.append(W.bee('우리 마을을 한 바퀴 둘러보자! <b>세금으로 만들고 운영하는 곳</b> 10곳을 찾아 눌러 봐.<br>개인 가게는 세금으로 만든 곳이 아니니 조심!', 'bee-magnify'), counter, map, note);
        } },

      /* ---------- 2 세금 브이로그 ---------- */
      { id: 'vlog', t: '세금 브이로그 찍기', e: '🎬', kind: '탐험', d: '세심이의 하루를 따라가며 세금을 찾아요',
        run(root, ctx) {
          const sc = [
            { q: '🌅 <b>아침 등교길.</b> 세심이는 초록불이 켜지자 횡단보도를 건넜어요. 여기서 세금으로 만든 것은?', o: ['신호등과 횡단보도', '세심이의 가방', '친구의 운동화'], a: 0, why: '신호등과 횡단보도는 모두의 안전을 위해 세금으로 설치했어요.' },
            { q: '🏫 <b>학교.</b> 교실에서 공부하고 급식실에서 점심을 먹었어요. 세금이 쓰인 곳은?', o: ['세심이의 필통', '학교 건물과 급식실', '짝꿍의 간식'], a: 1, why: '공립학교 건물, 교실, 급식실은 세금의 도움으로 운영돼요.' },
            { q: '📚 <b>방과 후.</b> 친구와 도서관에서 책을 읽었어요. 도서관의 책은 누구의 것일까요?', o: ['세심이 개인의 것', '우리 모두의 것', '도서관 사서 선생님의 것'], a: 1, why: '공공도서관의 책은 마을 사람 모두가 함께 쓰는 "우리의 것"이에요.' },
            { q: '🧹 <b>집에 가는 길.</b> 환경미화원 아저씨가 도로의 쓰레기를 치우고 계셨어요. 이 일의 비용은?', o: ['세금', '세심이가 낸 용돈', '길 가던 사람이 줌'], a: 0, why: '마을을 깨끗하게 하는 일도 세금으로 이루어져요.' },
            { q: '🚑 <b>저녁.</b> 구급차가 사이렌을 울리며 지나갔어요. 구급차와 소방서는?', o: ['세금으로 운영해요', '부자들만 이용해요', '돈을 내야만 출동해요'], a: 0, why: '위급할 때 누구나 도움을 받을 수 있도록 세금으로 운영해요.' },
            { q: '💡 <b>밤.</b> 어두운 골목을 가로등이 환하게 비춰 주었어요. 가로등의 전기요금은?', o: ['세금으로 내요', '세심이네가 내요', '무료 마법이에요'], a: 0, why: '가로등 설치와 전기요금도 세금으로 해결해요.' },
          ];
          root.append(W.bee('세심이가 <b>세금 브이로그</b>를 찍고 있어! 하루를 따라가며 세금이 쓰인 장면에서 <b>📸찰칵</b> 해 줘!', 'bee-look'));
          const wrap = h('div.vlog');
          root.append(wrap);
          wrap.append(W.quiz({ items: sc.map(s => ({ q: s.q, opts: s.o, a: s.a, why: s.why })), shuffleOpts: false,
            onDone: () => {
              const nb = W.note({ prompt: '🎬 마지막 장면! <b>내가 오늘 이용한 공공시설이나 공공서비스</b> 한 가지와 느낀 점을 써 보세요.', placeholder: '예) 오늘 학교 앞 횡단보도에서 신호등 덕분에 안전하게 건넜다.', key: 'k1.vlog', diaryTitle: '1차시 세금 브이로그', min: 8, onDone: () => { E.badge('vlog', '세금 브이로거', '🎬'); ctx.finish(null, '멋진 브이로그가 완성됐어요!'); } });
              wrap.append(nb);
            } }));
        } },

      /* ---------- 3 내 것 vs 우리 모두의 것 ---------- */
      { id: 'sort', t: '내 것 vs 우리 모두의 것', e: '🤝', kind: '게임', d: '카드를 알맞은 바구니에 넣어요',
        run(root, ctx) {
          root.append(W.bee('<b>내 것</b>은 사고팔거나 남에게 줄 수 있어요. <b>우리 모두의 것</b>은 함께 사용해요. 카드가 어느 쪽일까?', 'bee-paper'));
          const it = (t, e, b, why) => ({ t, e, b, why, hint: b === 'me' ? '나만 쓰거나 사고팔 수 있어요.' : '모두가 함께 쓰는 공공의 것이에요.' });
          root.append(W.sort({
            buckets: [{ id: 'me', label: '내 것', emoji: '🙋', cls: 'honey', sub: '사고팔 수 있어요' }, { id: 'we', label: '우리 모두의 것', emoji: '🤝', cls: 'green', sub: '함께 사용해요' }],
            items: [it('내 필통', '✏️', 'me'), it('신호등', '🚦', 'we'), it('선물 받은 곰인형', '🧸', 'me'), it('가로등', '💡', 'we'), it('공원 의자', '🪑', 'we'), it('내 모자', '🧢', 'me'),
              it('가로수', '🌳', 'we'), it('아빠 노트북', '💻', 'me'), it('학교 축구 골대', '⚽', 'we'), it('금강 다리', '🌉', 'we'), it('내 과자', '🍪', 'me'), it('도서관 책', '📖', 'we'), it('지하철', '🚇', 'we'), it('내 실내화', '👟', 'me'), it('버스 정류장', '🚏', 'we'), it('엄마 핸드폰', '📱', 'me')],
            onDone: (r, t, w) => { ctx.finish(null, `총 ${t}장 중 실수 ${w}번! 우리 모두의 것은 내 것처럼 아껴 써야 해요.`); },
          }));
        } },

      /* ---------- 4 세금이 사라진다면? ---------- */
      { id: 'notax', t: '세금이 사라진 마을', e: '🔌', kind: '실험', d: '세금 스위치를 꺼 보면 어떻게 될까요?',
        run(root, ctx) {
          const fac = [['💡', '가로등', '밤에 길을 찾기 어려워요'], ['🚒', '소방서', '불이 났을 때 우리를 지킬 수 없어요'], ['🚓', '경찰서', '범죄로부터 우리를 지킬 수 없어요'], ['🏫', '학교', '수업을 들을 수 없어요'], ['🛣️', '도로', '자동차와 사람들이 다니기 어려워요'], ['🚸', '횡단보도', '길을 건너기 어려워요']];
          let on = true, flipped = false;
          const row = h('div.facgrid');
          const sw = h('button.taxswitch.on', { onclick: () => {
            on = !on; sw.classList.toggle('on', on); sw.querySelector('.sw-t').textContent = on ? '세금 ON' : '세금 OFF'; S.sfx(on ? 'ok' : 'bad');
            S.$$('.fac-card', row).forEach((c, i) => { c.classList.toggle('off', !on); c.querySelector('.fc-p').textContent = on ? '튼튼하게 일하는 중!' : '💥 ' + fac[i][2]; });
            if (!on && !flipped) { flipped = true; setTimeout(showPairs, 900); }
          } }, h('span.sw-knob'), h('span.sw-t', '세금 ON'));
          fac.forEach(f => row.append(h('div.fac-card', h('div.fc-e', f[0]), h('b', f[1]), h('div.fc-p', '튼튼하게 일하는 중!'))));
          root.append(W.bee('스위치를 눌러 <b>세금이 사라진 마을</b>을 구경해 봐. 어떤 일이 벌어질까?', 'bee-hold'), h('div.center', sw), row);
          const rest = h('div'); root.append(rest);
          function showPairs() {
            rest.append(h('h3.sec', '🔗 시설과 문제를 이어 보세요'), W.pairs({ pairs: fac.map(f => [f[0] + ' ' + f[1], f[2]]), leftTitle: '우리 모두의 것', rightTitle: '세금이 없으면', onDone: () => {
              rest.append(h('div.card.def', h('b', '📌 세금이란?'), h('p', { html: '국가나 지방자치단체가 정부를 운영하기 위해 국민으로부터 <b>법에 따라</b> 걷는 돈이에요.' })));
              ctx.finish(null, '세금이 없으면 우리 모두의 것을 만들고 지킬 수 없어요.');
            } }));
          }
        } },

      /* ---------- 5 보물상자 ---------- */
      { id: 'chest', t: '보물상자에 세금 내기', e: '🎁', kind: '체험', d: '번 돈 3개 중 1개는 세금! 직접 일하며 체험해요',
        run(root, ctx) {
          let earned = 0, tax = 0;
          const coins = h('div.coinrow'), chest = h('div.chest', h('div.ch-e', '🎁'), h('div.ch-c', '세금 0개')), made = h('div.made');
          const wallet = h('div.mini-wallet');
          const upd = () => {
            S.clear(coins); for (let i = 0; i < earned; i++) coins.append(h('span.coin', (i + 1) % 3 === 0 ? '🟢' : '🟡'));
            chest.querySelector('.ch-c').textContent = `세금 ${tax}개`;
            wallet.textContent = `내가 번 돈 ${earned}개 · 세금으로 낸 돈 ${tax}개 · 남은 돈 ${earned - tax}개`;
            const bl = ['💡 가로등', '🌳 공원', '📚 도서관']; S.clear(made); bl.slice(0, tax).forEach(x => made.append(h('span.made-i.pop', x)));
          };
          const btn = h('button.btn.primary.big', { onclick: () => {
            if (earned >= 9) return; earned++; S.sfx('coin');
            if (earned % 3 === 0) { tax++; S.toast('🟢 3개를 벌었으니 1개는 세금! 보물상자로 쏙~', 'coin'); chest.classList.add('shake'); setTimeout(() => chest.classList.remove('shake'), 500); }
            upd();
            if (earned === 9) { btn.disabled = true; setTimeout(ask, 700); }
          } }, '🔨 일해서 돈 벌기');
          root.append(W.bee('세심마을에서는 <b>돈을 3개 벌면 1개를 세금</b>으로 내요. 초록 동전이 세금이에요. 9개를 벌어 보자!', 'bee-money'), h('div.center', btn), coins, h('div.center', chest), wallet, made);
          upd();
          function ask() {
            root.append(W.quiz({ items: [{ q: '9개를 벌었어요. 세금으로 낸 돈은 몇 개일까요?', opts: ['1개', '3개', '6개'], a: 1, why: '3개를 벌 때마다 1개씩, 모두 3개를 냈어요.' }, { q: '세금을 내고 내 지갑에 남은 돈은 몇 개일까요?', opts: ['3개', '6개', '9개'], a: 1, why: '9 − 3 = 6개! 이렇게 세금을 뺀 돈이 내가 쓸 수 있는 돈이에요.' }],
              onDone: () => root.append(W.note({ prompt: '🎁 <b>우리 마을 보물상자</b>의 이름을 지어 주세요!', placeholder: '예) 꿀단지, 행복 저금통', key: 'k1.chest', min: 2, onDone: () => ctx.finish(null, '모은 세금은 가로등, 공원, 도서관처럼 우리 모두를 위해 쓰여요.') })) }));
          }
        } },

      /* ---------- 6 세금 천재 OX ---------- */
      { id: 'ox', t: '세금 천재 OX 퀴즈', e: '🧠', kind: '퀴즈', d: '석송령 이야기와 OX 퀴즈에 도전!',
        run(root, ctx) {
          root.append(W.cards([
            { e: '🌲', t: '세금을 내는 나무가 있다고? — 석송령', body: '경북 예천에는 <b>석송령</b>이라는 소나무가 있어요(천연기념물 제294호). 나무의 주인이 유산을 물려준 덕분에 나무가 재산을 가지게 되었고, 그 재산에 대한 세금을 낸다고 해요.' },
            { e: '🌳', t: '또 한 그루, 황목근', body: '<b>황목근</b>(천연기념물 제400호)은 마을 사람들이 공동재산을 모아 나무에게 주며 해마다 풍년제를 지내기로 약속했어요. 두 나무는 성실하게 세금을 내며 마을을 지켜 주는 나무예요.' },
            { e: '⚖️', t: '지금도 나무에게 재산을 물려줄 수 있을까?', body: '지금은 나무에게 재산을 물려주는 일이 <b>불가능</b>해요. 아주 먼 옛날에만 가능했던 이야기랍니다.' },
          ]));
          const ox = [
            { q: '세금은 나라에서 우리에게 <u>공짜로</u> 주는 돈이다.', a: false, why: '세금은 국민이 법에 따라 나라에 내는 돈이에요.' },
            { q: '나라는 세금을 필요한 곳에만 사용해야 한다.', a: true, why: '세금은 우리 모두를 위해 꼭 필요한 곳에 써야 해요.' },
            { q: '세금은 어른들만 내고 어린이는 낼 필요가 없다.', a: false, why: '물건을 살 때 가격에 세금(부가가치세)이 들어 있어서 어린이도 세금을 내고 있어요.' },
            { q: '세금을 내지 않으면 나라가 어려움을 겪는다.', a: true, why: '세금이 없으면 학교, 소방서, 도로를 만들고 운영하기 어려워요.' },
            { q: '부자들만 세금을 내고, 돈이 적은 사람은 세금을 안 낸다.', a: false, why: '누구나 법에 따라 세금을 내요. 다만 더 많이 버는 사람이 더 많이 내기도 해요.' },
            { q: '세금을 더 많이 내는 사람이 있고, 적게 내는 사람이 있다.', a: true, why: '번 돈이나 재산에 따라 내는 세금이 달라요.' },
            { q: '나라는 세금을 <u>마음대로</u> 써도 된다.', a: false, why: '세금은 법과 국회의 심의에 따라 정해진 곳에 써야 해요.' },
            { q: '내가 매일 다니는 공립학교는 세금으로 지어진 곳이다.', a: true, why: '국공립 학교는 세금으로 짓고 운영해요.' },
            { q: '세금이 없으면 도서관에서 책을 빌려 볼 수 없다.', a: true, why: '공공도서관도 세금으로 운영돼요.' },
            { q: '세금은 내가 <u>내고 싶을 때만</u> 낸다.', a: false, why: '세금은 법에서 정한 대로 꼭 내야 해요.' },
            { q: '석송령은 세금을 내는 나무이다.', a: true, why: '경북 예천의 석송령은 재산이 있어 세금을 내는 나무예요.' },
            { q: '요즘에도 나무에게 재산을 물려줄 수 있다.', a: false, why: '지금은 불가능해요.' },
          ];
          root.append(h('h3.sec', '🧠 세금 천재 카드에 도전!'), W.ox({ items: ox, onDone: (s, t) => {
            if (s >= t * .8) { E.badge('genius1', '세금 천재 카드', '🧠'); ctx.finish(null, `${t}문제 중 ${s}문제! 세금 천재 카드를 받았어요 🧠`); }
            else { root.append(h('div.card', h('p', `${s}/${t}개 맞혔어요. 80% 이상 맞히면 세금 천재 카드를 받아요!`), h('button.btn.primary', { onclick: () => S.render() }, '🔁 다시 도전'))); }
          } }));
        } },
    ],
  };
})();
