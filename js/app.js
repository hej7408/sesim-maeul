/* 세심마을 앱 셸: 입주(로그인), 홈, 차시/활동 프레임, 은행·시장·국세청·세법전·기입장·수료증 */
(function () {
  const { h, fmt, E } = S;
  S.games = {};
  const TOTAL = 10;

  /* ================= 공통 UI ================= */
  function build() {
    const root = S.$('#root');
    S.clear(root);
    root.append(
      h('header#top',
        h('a.brand', { href: '#/' }, S.img('bee-hello', 'brand-bee'), h('span', '세심마을')),
        h('div.top-right',
          h('button#wallet.wallet', { onclick: () => S.go('/bank'), title: '내 지갑' }, h('span.coin', '💰'), h('b#walletAmt', '0'), h('span.cur', E.cur())),
          h('button#meBtn.me-btn', { onclick: meMenu }))),
      h('main#app'),
      h('nav#tabbar',
        [['/', '🏘️', '마을'], ['/bank', '🏦', '은행'], ['/market', '🛒', '시장'], ['/nts', '🏛️', '국세청'], ['/diary', '📒', '기입장']]
          .map(([p, e, t]) => h('a', { href: '#' + p, 'data-p': p }, h('span.t-e', e), h('span.t-t', t)))));
    S.updateWallet();
  }
  S.updateWallet = function (bump) {
    const a = S.$('#walletAmt'), me = S.$('#meBtn');
    if (!a) return;
    const p = S.me;
    a.textContent = p ? fmt(p.money) : '0';
    S.$('#wallet').style.display = p ? '' : 'none';
    me.style.display = p ? '' : 'none';
    if (p) { S.clear(me); me.append(S.ava(p), h('span.me-name', p.name)); }
    if (bump) { const w = S.$('#wallet'); w.classList.remove('bump'); void w.offsetWidth; w.classList.add('bump'); }
  };
  S.afterRender = function (path) {
    S.$$('#tabbar a').forEach(a => {
      const p = a.dataset.p;
      a.classList.toggle('on', p === '/' ? path === '/' : path.startsWith(p));
    });
    const tb = S.$('#tabbar'); if (tb) tb.style.display = S.me && !path.startsWith('/welcome') && !path.startsWith('/teacher') ? '' : 'none';
    S.updateWallet();
  };

  function meMenu() {
    const p = S.me;
    S.modal({
      title: `${p.name} 이장님`,
      body: h('div.menu',
        h('div.menu-me', S.ava(p, 'big'), h('div', h('b', p.town + ' 마을'), h('div.sm', `${S.job(p.job).e} ${S.job(p.job).n} · ${p.no}번`))),
        h('button.btn.wide', { onclick: () => { S.muted = !S.muted; S.store.set('muted', S.muted); S.toast(S.muted ? '소리 끔 🔇' : '소리 켬 🔊'); } }, '🔊 소리 켜기/끄기'),
        h('button.btn.wide', { onclick: () => { document.querySelector('.modal-back').remove(); document.body.classList.remove('noscroll'); S.go('/cert'); } }, '🏅 내 수료증 보기'),
        h('button.btn.wide', { onclick: () => { document.querySelector('.modal-back').remove(); document.body.classList.remove('noscroll'); S.go('/teacher'); } }, '👩‍🏫 선생님 메뉴'),
        h('button.btn.wide.danger', { onclick: () => { E.logout(); document.querySelector('.modal-back').remove(); document.body.classList.remove('noscroll'); S.go('/welcome'); } }, '🚪 다른 친구로 바꾸기 (로그아웃)')),
      actions: [{ label: '닫기' }],
    });
  }

  S.payslip = function (gross, tax, net, title = '월급명세서') {
    const rate = gross ? Math.round(tax / gross * 100) : 0;
    S.modal({
      title: '🧾 ' + title,
      body: h('div.payslip',
        h('div.ps-row', h('span', '받을 돈 (급여)'), h('b', E.money(gross))),
        h('div.ps-row.tax', h('span', `소득세 (${rate}%) — 나라에 내는 돈`), h('b', '- ' + E.money(tax))),
        h('div.ps-row.net', h('span', '내가 받는 돈'), h('b', E.money(net))),
        h('p.sm', '일하고 번 돈에는 세금이 붙어요. 월급을 줄 때 미리 떼어서 나라에 내는 것을 "원천징수"라고 해요.')),
      actions: [{ label: '좋아요!', cls: 'primary' }],
    });
  };

  /* 현재 마을 시설 단계 */
  S.townState = function () {
    const profs = Object.values(E.profiles());
    const n = Math.max(1, profs.length);
    const per = E.villageTax() / n;
    const built = S.FACILITIES.filter(f => per >= f.need);
    const next = S.FACILITIES.find(f => per < f.need);
    return { per, built, next, n };
  };

  /* ================= 입주(로그인) ================= */
  S.route('/welcome', () => {
    const st = E.settings();
    const data = { no: '', name: '', avatar: S.AVATARS[0], town: '', job: 'teacher', rules: [] };
    const existing = Object.values(E.profiles()).filter(p => p.cls === st.classCode).sort((a, b) => a.no - b.no);
    const root = h('div.page.welcome');
    const wiz = S.W.wizard([
      next => h('div.step',
        S.W.bee(`안녕! 나는 <b>세심이</b>야 🐝<br>${st.townName ? `<b>${st.townName}</b>` : '우리 반'} <b>세심마을</b>에 온 걸 환영해!<br>여기서는 <b>직접 일하고, 돈을 벌고, 세금을 내면서</b> 마을을 만들어 갈 거야.`, 'bee-hello'),
        existing.length ? h('div.card', h('h3', '🔑 이미 입주했나요?'), h('p.sm', '내 이름을 눌러 다시 들어와요'),
          h('div.chips', existing.map(p => h('button.chip', { onclick: () => { E.login(p.id); S.sfx('ok'); S.go('/'); } }, S.ava(p), ` ${p.no}번 ${p.name}`)))) : null,
        h('div.nextrow', h('button.btn.primary.big', { onclick: next }, '🏡 처음이에요! 입주하기'))),
      next => {
        const no = h('input', { type: 'number', min: 1, max: 60, placeholder: '번호', value: data.no, inputmode: 'numeric' });
        const nm = h('input', { type: 'text', maxlength: 8, placeholder: '이름', value: data.name });
        return h('div.step', S.W.bee('먼저 <b>입주 신청서</b>를 써 볼까?', 'bee-paper'),
          h('div.card.form', h('label', '번호', no), h('label', '이름', nm), h('p.sm', `학급: ${st.classCode}`)),
          h('div.nextrow', h('button.btn.primary.big', { onclick: () => {
            const n = parseInt(no.value, 10), name = nm.value.trim();
            if (!(n > 0) || !name) { S.toast('번호와 이름을 써 주세요', 'bad'); return; }
            const ex = E.profiles()[st.classCode + '-' + n];
            if (ex) {
              if (ex.name === name) { E.login(ex.id); S.toast('다시 만나서 반가워요! 👋', 'good'); S.go('/'); return; }
              S.toast('이미 다른 친구가 쓰는 번호예요. 선생님께 물어봐요', 'bad'); return;
            }
            data.no = n; data.name = name; next();
          } }, '다음 ▶')));
      },
      next => h('div.step', S.W.bee('나를 나타낼 <b>캐릭터</b>를 골라 봐!', 'bee-look'),
        h('div.avatar-grid', S.AVATARS.map(a => {
          const el = h('button.ava-opt', { class: data.avatar === a ? 'on' : '', onclick: () => { data.avatar = a; S.$$('.ava-opt', root).forEach(x => x.classList.remove('on')); el.classList.add('on'); S.sfx('pop'); } }, S.ava({ avatar: a }, 'big'));
          return el;
        })), S.W.next('다음 ▶', next)),
      next => {
        const t = h('input', { type: 'text', maxlength: 8, placeholder: '예) 별빛, 꿀벌, 무지개', value: data.town || (st.townName || '') });
        return h('div.step', S.W.bee('우리 마을 이름을 지어 줄래? <br>"<b>OO 마을</b>"처럼 원하는 단어를 넣어 봐!', 'bee-paper'),
          h('div.card.form', h('label', '마을 이름', h('div.inline', t, h('b', ' 마을')))),
          S.W.next('다음 ▶', () => { const v = t.value.trim(); if (!v) { S.toast('마을 이름을 지어 주세요', 'bad'); return; } data.town = v; next(); }));
      },
      next => h('div.step', S.W.bee('마을에서 할 <b>직업</b>을 골라 봐! 직업마다 <b>월급</b>이 달라. 나중에 "공평한 세금"을 배울 때 아주 중요하게 쓰일 거야 😉', 'bee-hold'),
        h('div.job-grid', S.JOBS.map(j => {
          const el = h('button.job', { class: data.job === j.id ? 'on' : '', onclick: () => { data.job = j.id; S.$$('.job', root).forEach(x => x.classList.remove('on')); el.classList.add('on'); S.sfx('pop'); } },
            h('div.j-e', j.e), h('b', j.n), h('div.j-d', j.d), h('div.j-p', '월급 ' + fmt(j.pay) + st.currency));
          return el;
        })), S.W.next('다음 ▶', next)),
      next => {
        const chips = S.W.chips({ options: S.RULEWORDS, multi: true, max: 3, onChange: v => (data.rules = v) });
        return h('div.step', S.W.bee('행복한 마을이 되려면 <b>마을 규칙</b>이 필요해. 규칙에 넣고 싶은 단어를 <b>3개</b> 골라 봐!', 'bee-paper2'),
          h('div.card', chips), S.W.next('다음 ▶', () => { if (data.rules.length < 3) { S.toast('3개를 골라 주세요', 'bad'); return; } next(); }));
      },
      next => {
        const sign = S.W.signpad({});
        return h('div.step', S.W.bee('마지막! 아래에 <b>서명</b>하면 입주 완료야. 입주 선물로 <b>' + E.money(st.welcome) + '</b>을 줄게 🎁', 'bee-money'),
          h('div.card.oath', h('h3', '🏡 마을 주민 약속'),
            h('p', `우리 마을의 규칙 <b>${data.rules.join(', ')}</b>을(를) 지키며, 함께 만드는 마을을 소중히 여기겠습니다.`),
            h('p.sm', `${data.town} 마을 이장 ${data.name}`), sign,
            h('button.btn.sm', { onclick: () => sign.clearPad() }, '지우기')),
          S.W.next('🎉 입주 완료!', () => {
            if (!sign.hasInk()) { S.toast('서명을 해 주세요 ✍️', 'bad'); return; }
            E.create(data);
            S.me.rules = data.rules; E.save();
            E.badge('welcome', '마을 주민', '🏡');
            S.confetti(); S.sfx('win'); S.go('/');
          }));
      },
    ]);
    root.append(h('h2.pagetitle', '🏡 0차시 · 세심마을 입주'), wiz);
    S.view(root);
  });

  /* ================= 홈 ================= */
  function guard(fn) { return p => { if (!S.me) { S.go('/welcome'); return; } fn(p); }; }
  S.guard = guard;

  S.route('/', guard(() => {
    const p = S.me, st = E.settings();
    const open = st.openUpTo == null ? TOTAL : st.openUpTo;
    const T = S.townState();
    let nextN = null;
    for (let n = 1; n <= TOTAL; n++) { const s = S.sessions[n]; if (s && E.doneCount(n) < s.activities.length) { nextN = n; break; } }
    const badges = Object.keys(p.badges || {}).length;
    const hero = h('section.hero',
      h('div.hero-sun', '☀️'), h('div.hero-cloud.c1', '☁️'), h('div.hero-cloud.c2', '☁️'),
      S.img('bee-hello', 'hero-bee'),
      h('div.hero-t', h('h2', `${p.town} 마을 ${p.name} 이장님,`),
        h('div.hero-stats', h('span', `💰 ${fmt(p.money)}${st.currency}`), h('span', `🏅 배지 ${badges}개`), h('span', `🧾 낸 세금 ${fmt(E.totalTax())}`)), h('p', nextN ? `오늘은 ${nextN}차시 "${S.sessions[nextN].title}"를 해 볼까요?` : '모든 차시를 마쳤어요! 수료증을 받으러 가요 🏅'),
        nextN ? h('button.btn.primary.big', { onclick: () => S.go('/s/' + nextN) }, '▶ 오늘의 미션 시작') : h('button.btn.primary.big', { onclick: () => S.go('/cert') }, '🏅 수료증 보기')));

    const strip = h('section.card.townstrip',
      h('div.ts-head', h('h3', '🏗️ 세금으로 짓는 우리 마을'), h('span.sm', T.next ? `다음 시설: ${T.next.e} ${T.next.n}` : '모든 시설 완공!')),
      h('div.fac-row', S.FACILITIES.map(f => h('div.fac', { class: T.per >= f.need ? 'on' : '', title: f.n + ' (필요한 세금 ' + f.need + ')' }, h('div.f-e', f.e), h('div.f-n', f.n)))),
      T.next ? h('div.bar', h('i', { style: { width: S.clamp(T.per / T.next.need * 100, 2, 100) + '%' } })) : null,
      h('p.sm', `우리 마을 주민이 낸 세금: 1인 평균 ${fmt(T.per)}${st.currency} (이 기기 ${T.n}명 기준)`));

    const path = h('section.path');
    for (let n = 1; n <= TOTAL; n++) {
      const s = S.sessions[n]; if (!s) continue;
      const dn = E.doneCount(n), tot = s.activities.length, fin = E.isDone('s' + n + '.fin');
      const locked = n > open;
      path.append(h('button.node', { class: (n % 2 ? 'l ' : 'r ') + (fin ? 'fin ' : '') + (locked ? 'lock ' : '') + (nextN === n ? 'cur' : ''), onclick: () => { if (locked) { S.toast('선생님이 아직 열지 않았어요 🔒'); return; } S.go('/s/' + n); } },
        h('div.n-circle', { style: { '--c': s.color } }, h('span.n-e', locked ? '🔒' : s.e), h('span.n-no', n + '차시')),
        h('div.n-info', h('b', s.title), h('div.n-sub', s.sub), h('div.n-prog', h('div.bar', h('i', { style: { width: (dn / tot * 100) + '%' } })), h('span', fin ? '✅ 완료' : `${dn}/${tot}`)))));
    }

    const places = h('section.places',
      [['/bank', '🏦', '은행', '내 지갑·저축'], ['/market', '🛒', '시장', '물건 사기'], ['/nts', '🏛️', '국세청', '내 세금 보기'],
      ['/law', '📜', '세법전', '우리 마을 세법'], ['/diary', '📒', '세심기입장', '기록·영수증'], ['/games', '🎮', '놀이터', '세금 게임'],
      ['/words', '📖', '용어사전', '모르는 낱말 찾기'], ['/cert', '🏅', '수료증', '졸업 인증서']]
        .map(([r, e, t, d], i) => h('a.place', { href: '#' + r, class: 'pl' + (i % 4) }, h('div.pl-e', e), h('b', t), h('div.sm', d))));

    S.view(hero, strip, h('h3.sec', '📍 차시별 마을 지도'), path, h('h3.sec', '🏘️ 마을 곳곳'), places,
      h('footer.foot', '세심마을은 한국조세재정연구원 「함께하는 세심교실」 교재를 바탕으로 만들었어요.'));
  }));

  /* ================= 차시 페이지 ================= */
  S.route('/s/:n', guard(({ n }) => {
    n = +n; const s = S.sessions[n];
    if (!s) { S.go('/'); return; }
    const st = E.settings();
    if (n > (st.openUpTo == null ? TOTAL : st.openUpTo)) { S.toast('선생님이 아직 열지 않았어요 🔒'); S.go('/'); return; }
    const dn = E.doneCount(n), tot = s.activities.length;
    const fin = E.isDone('s' + n + '.fin');
    const head = h('section.s-head', { style: { '--c': s.color } },
      h('button.back', { onclick: () => S.go('/') }, '◀ 마을'),
      h('div.s-water', s.e), h('div.s-no', n + '차시'), h('h2', s.e + ' ' + s.title), h('p', s.sub));
    const lk = s.activities.findIndex(a => a.id === 'learn');
    const stepbar = h('div.stepbar', [['📖', '이야기'], ['📘', '개념 배우기'], ['🕹️', '체험 활동'], ['💰', '정리·월급']].map(([e, t], i) => h('div.stp', { class: (i === 1 && lk >= 0 && E.isDone('s' + n + '.learn')) || (i === 3 && fin) ? 'ok' : '' }, h('span.stp-e', e), h('span', t))));
    const learnCard = lk >= 0 ? h('section.learn-promo', { onclick: () => S.go(`/s/${n}/${lk}`) }, S.img('bee-read', 'lp-bee'), h('div', h('b', '📘 먼저 개념을 배워요!'), h('div.sm', E.isDone('s' + n + '.learn') ? '배운 내용은 언제든 다시 볼 수 있어요' : '그림과 쉬운 비유로 오늘의 낱말을 알아봐요 (약 3분)')), h('span.lp-go', E.isDone('s' + n + '.learn') ? '다시 ▶' : '시작 ▶')) : null;
    const story = h('section.card.story', h('h3', '📖 이야기로 시작해요'),
      s.story.map(l => S.W.say(l.who, l.img, l.t)),
      h('button.btn.sm', { onclick: () => S.speak(s.story.map(l => l.t.replace(/<[^>]+>/g, '')).join(' ')) }, '🔊 읽어 주기'));
    const goals = h('section.card', h('h3', '🎯 오늘의 목표'), h('ul.goals', s.goals.map(g => h('li', g))));
    const acts = h('section', h('h3.sec', '🕹️ 체험 활동'),
      h('div.act-grid', s.activities.map((a, k) => {
        const d = E.isDone('s' + n + '.' + a.id);
        return h('button.act', { class: (d ? 'done ' : '') + (a.id === 'learn' ? 'learn' : ''), onclick: () => S.go(`/s/${n}/${k}`) },
          h('div.a-e', a.e), h('div.a-t', h('b', a.t), h('div.a-d', a.d)), h('div.a-k', d ? '✅' : h('span.kind', a.kind || '체험')));
      })));
    const box = h('section.card.finbox');
    if (dn >= tot) {
      box.append(h('h3', fin ? '🎉 이번 차시를 마쳤어요!' : '🎉 모든 활동을 마쳤어요!'),
        h('p', fin ? '쏙쏙 개념정리를 다시 볼 수 있어요.' : '쏙쏙 개념정리를 보고 월급을 받아요!'),
        h('button.btn.primary.big', { onclick: () => finishSession(n) }, fin ? '📚 쏙쏙 개념정리 다시 보기' : '💰 개념정리 보고 월급 받기'));
    } else box.append(h('p.sm', `활동을 모두 마치면 쏙쏙 개념정리와 월급이 기다려요! (${dn}/${tot})`));
    S.view(head, stepbar, story, learnCard, goals, acts, box, h('p.next-hint', '👉 ' + (s.next || '')));
  }));

  function finishSession(n) {
    const s = S.sessions[n], p = S.me;
    const first = !E.isDone('s' + n + '.fin');
    const r = s.recap;
    S.modal({
      title: '📚 쏙쏙 개념정리',
      wide: true,
      body: h('div.recap', h('div.term', h('small', '오늘의 낱말'), h('h2', r.term), h('p', r.def)),
        h('ol', r.points.map(x => h('li', { html: x }))),
        s.task ? h('div.task', h('b', '🏫 우리 교실에서는'), h('p', s.task)) : null,
        h('a.sm', { href: 'https://www.kipf.re.kr/sesim/', target: '_blank', rel: 'noopener' }, '조세 용어사전 보러가기')),
      actions: [{ label: first ? `월급 받기 (${S.job(p.job).n})` : '닫기', cls: 'primary', fn: () => {
        if (first) {
          E.complete('s' + n + '.fin', 0);
          const gross = S.job(p.job).pay; const r2 = E.earn(gross, n + '차시 월급', { quiet: true });
          S.confetti(); setTimeout(() => S.payslip(r2.gross, r2.tax, r2.net, n + '차시 월급명세서'), 200);
          if (n === TOTAL) E.badge('finish', '세심마을 졸업', '🎓');
          E.badge('s' + n, n + '차시 완료', s.e);
          S.render();
        }
      } }],
    });
  }

  /* ================= 활동 페이지 ================= */
  S.route('/s/:n/:k', guard(({ n, k }) => {
    n = +n; k = +k; const s = S.sessions[n]; if (!s || !s.activities[k]) { S.go('/'); return; }
    const a = s.activities[k], key = 's' + n + '.' + a.id;
    const root = h('div.actbody');
    let shown = false;
    const ctx = {
      n, k, key, session: s,
      finish(reward, msg) {
        if (shown) return; shown = true;
        const first = E.complete(key, reward);
        if (first) { S.confetti(40); }
        const nextK = k + 1 < s.activities.length ? k + 1 : null;
        const banner = h('div.finish-banner',
          h('div.fb-e', first ? '🎉' : '👍'), h('h3', first ? '활동 완료!' : '다시 해 봤어요!'), msg ? h('p', msg) : null,
          first ? h('p.sm', `급여 ${E.money(reward == null ? E.settings().activityPay : reward)}를 받았어요 (소득세 떼고 지갑에 쏙!)`) : null,
          h('div.fb-btns', nextK != null ? h('button.btn.primary', { onclick: () => S.go(`/s/${n}/${nextK}`) }, '다음 활동 ▶') : null,
            h('button.btn', { onclick: () => S.go('/s/' + n) }, '차시로 돌아가기')));
        root.append(banner); banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
    };
    const wrap = h('div.page.act-page',
      h('div.act-top', h('button.back', { onclick: () => S.go('/s/' + n) }, '◀ ' + n + '차시'),
        h('div.inline', a.id !== 'learn' && S.LEARN && S.LEARN[n] ? h('button.btn.sm.help', { onclick: () => S.openLearn(n) }, '📘 개념 다시 보기') : null, h('span.chip.kind', a.kind || '체험'))),
      h('div.act-banner', { style: { '--c': s.color } }, h('div.ab-e', a.e), h('div', h('div.ab-s', `${n}차시 · ${s.title}`), h('h2', a.t), h('p', a.d))), root);
    S.view(wrap);
    a.run(root, ctx);
  }));

  /* ================= 은행 ================= */
  S.route('/bank', guard(() => {
    const p = S.me, st = E.settings();
    const cur = st.currency;
    const sav = p.savings = p.savings || [];
    const total = sav.reduce((a, s) => a + s.amt, 0);
    const box = h('div.page');
    box.append(h('h2.pagetitle', '🏦 세심은행'),
      h('div.card.balance', h('div.sm', '내 지갑 잔액'), h('div.big-num', E.money(p.money)), h('div.sm', `저축통장 ${E.money(total)}`)));
    // 저축
    const amt = h('input', { type: 'number', min: 100, step: 100, value: 100, inputmode: 'numeric' });
    let kind = 'normal';
    const kinds = h('div.chips', [['normal', '일반 저축', '1년 뒤 이자 10% (이자에 세금 15%)'], ['free', '세금우대 저축', '1년 뒤 이자 8% (이자 세금 0%)']].map(([id, t, d]) =>
      h('button.chip', { class: id === kind ? 'on' : '', onclick: e => { kind = id; S.$$('.chip', kinds).forEach(c => c.classList.remove('on')); e.currentTarget.classList.add('on'); desc.textContent = d; } }, t)));
    const desc = h('p.sm', '1년 뒤 이자 10% (이자에 세금 15%)');
    box.append(h('div.card', h('h3', '💰 저축하기'), kinds, desc,
      h('div.inline', amt, h('b', cur), h('button.btn.primary', { onclick: () => {
        const v = Math.round(+amt.value); if (!(v >= 100)) { S.toast('100' + cur + ' 이상부터 저축할 수 있어요'); return; }
        if (!E.pay(v, '저축 (' + (kind === 'normal' ? '일반' : '세금우대') + ')')) return;
        sav.push({ kind, amt: v, ts: Date.now() }); E.save(); S.toast('저축했어요! 🐷', 'good'); S.render();
      } }, '맡기기'))));
    if (sav.length) {
      box.append(h('div.card', h('h3', '🐷 내 저축통장'), sav.map((s, i) => {
        const rate = s.kind === 'normal' ? .10 : .08, int = Math.round(s.amt * rate), tax = s.kind === 'normal' ? Math.round(int * .15) : 0;
        return h('div.sav-row', h('span', `${s.kind === 'normal' ? '일반' : '세금우대'} ${E.money(s.amt)}`),
          h('button.btn.sm', { onclick: () => {
            S.modal({ title: '⏩ 1년이 지났어요!', body: h('div.payslip', h('div.ps-row', h('span', '원금'), h('b', E.money(s.amt))), h('div.ps-row', h('span', '이자'), h('b', '+' + E.money(int))), h('div.ps-row.tax', h('span', '이자소득세'), h('b', '- ' + E.money(tax))), h('div.ps-row.net', h('span', '찾는 돈'), h('b', E.money(s.amt + int - tax))), h('p.sm', s.kind === 'free' ? '세금우대 저축은 세금을 아낄 수 있어요. 이런 똑똑한 방법이 바로 "절세"예요!' : '이자에도 세금이 붙어요.')),
              actions: [{ label: '돈 찾기', cls: 'primary', fn: () => {
                sav.splice(i, 1); p.money += s.amt + int - tax;
                E.addLedger({ kind: 'in', type: 'interest', amt: s.amt + int - tax, memo: '저축 만기 (이자 ' + int + ', 세금 ' + tax + ')' });
                if (tax) { p.taxes.div = (p.taxes.div || 0) + tax; E.addLedger({ kind: 'tax', type: 'div', amt: tax, memo: '이자소득세' }); }
                if (s.kind === 'free') E.badge('saver', '똑똑한 절세왕', '🐷');
                E.save(); S.render(); } }] });
          } }, `1년 뒤 찾기 (이자 ${int}${cur})`));
      })));
    }
    // 거래내역
    const led = p.ledger.slice(-40).reverse();
    box.append(h('div.card', h('h3', '📋 거래 내역'), h('div.ledger', led.length ? led.map(l => {
      const d = new Date(l.ts);
      return h('div.lg-row', { class: l.kind + (l.corp ? ' corp' : '') }, h('span.lg-d', `${d.getMonth() + 1}/${d.getDate()}`), h('span.lg-m', (l.corp ? '🏭 ' : '') + l.memo + (l.corp ? ' (회사가 낸 세금)' : '')), h('b.lg-a', l.corp ? fmt(l.amt) : (l.kind === 'in' ? '+' : '-') + fmt(l.amt)));
    }) : h('p.sm', '아직 거래가 없어요'))));
    S.view(box);
  }));

  /* ================= 시장 ================= */
  S.route('/market', guard(() => {
    const p = S.me, st = E.settings();
    const box = h('div.page', h('h2.pagetitle', '🛒 세심시장'),
      S.W.bee(`물건을 사면 가격 안에 <b>부가가치세 ${st.rates.vat}%</b>가 들어 있어요. 영수증에서 찾아봐!`, 'bee-money'));
    const grid = h('div.shop-grid');
    S.ITEMS.forEach(it => {
      const vat = Math.round(it.price * st.rates.vat / 100);
      const own = p.items.filter(x => x === it.id).length;
      grid.append(h('div.shop-item', h('div.si-e', it.e), h('b', it.n), h('div.sm', `물건값 ${fmt(it.price)} + 세금 ${fmt(vat)}`), h('div.si-p', E.money(it.price + vat)),
        own ? h('div.own', `보유 ${own}개`) : null,
        h('button.btn.primary.sm', { onclick: () => {
          const r = E.spend(it.price, it.n); if (!r) return;
          p.items.push(it.id); E.save();
          S.modal({ title: '🧾 영수증', body: h('div.receipt.shop', h('div.rc-title', '세심시장'), h('div.rc-row', h('span', it.n), h('b', fmt(r.price))), h('div.rc-row.vat', h('span', `부가가치세 (${st.rates.vat}%)`), h('b', fmt(r.vat))), h('div.rc-row.big', h('span', '지불금액'), h('b', E.money(r.total))), h('p.sm', '👆 초록 줄이 바로 소비세! 우리도 물건을 살 때 세금을 내고 있었어요.')), actions: [{ label: '잘 쓸게요!', cls: 'primary' }] });
          E.badge('buyer', '첫 소비', '🛍️'); S.render();
        } }, '사기')));
    });
    box.append(grid);
    S.view(box);
  }));

  /* ================= 국세청 ================= */
  S.route('/nts', guard(() => {
    const p = S.me, st = E.settings();
    const tot = E.totalTax(), T = S.townState();
    const types = Object.keys(p.taxes).filter(k => p.taxes[k] > 0);
    const box = h('div.page', h('h2.pagetitle', '🏛️ 세심 국세청'),
      h('div.card.balance', h('div.sm', '지금까지 내가 낸 세금'), h('div.big-num', E.money(tot)), h('div.sm', `번 돈 대비 ${totalIncome() ? Math.round((tot - (p.taxes.corp || 0)) / totalIncome() * 100) : 0}% (회사가 낸 법인세 제외)`)));
    box.append(h('div.card', h('h3', '📊 어떤 세금을 냈을까?'), types.length ? h('div.taxbars', types.map(k => {
      const v = p.taxes[k];
      return h('div.tb-row', h('span.tb-n', E.TAXNAME[k] || k), h('div.tb-bar', h('i', { style: { width: (v / tot * 100) + '%', background: S.TAXCOLOR[k] || '#888' } })), h('b', fmt(v)));
    })) : h('p.sm', '아직 낸 세금이 없어요. 활동을 하면 소득세를 내게 돼요!')));
    box.append(h('div.card', h('h3', '🏗️ 내 세금은 어디에 쓰일까?'),
      h('p', `마을 사람들이 함께 낸 세금으로 공공시설을 지어요. 지금까지 ${T.built.length}개를 지었어요.`),
      h('div.fac-row', S.FACILITIES.map(f => h('div.fac', { class: T.per >= f.need ? 'on' : '' }, h('div.f-e', f.e), h('div.f-n', f.n), h('div.f-need', f.need + st.currency))))));
    const rc = (p.receipts || []).slice().reverse();
    box.append(h('div.card', h('h3', '🧾 납부확인증 모음'), rc.length ? h('div.rc-list', rc.map(r => h('button.rc-mini', { onclick: () => E.showReceipt(r) }, `${E.TAXNAME[r.type] || r.type} ${E.money(r.amt)}`))) : h('p.sm', '직접 세금을 내면 납부확인증이 생겨요 (2차시, 6차시, 7차시)')));
    S.view(box);
  }));
  function totalIncome() { return S.me.ledger.filter(l => l.kind === 'in' && l.type !== 'gift').reduce((a, l) => a + (l.gross || l.amt), 0); }

  /* ================= 세법전 ================= */
  S.route('/law', guard(() => {
    const st = E.settings(), r = st.rates, p = S.me;
    const prog = st.incomeMode === 'progressive';
    const rows = [
      ['소득세', prog ? '번 돈이 많을수록 높은 비율 (누진)' : `번 돈의 ${r.income}%`, '일해서 돈을 벌 때'],
      ['부가가치세 (소비세)', `물건값의 ${r.vat}%`, '물건을 사거나 서비스를 이용할 때'],
      ['법인세', `회사 이익의 ${r.corp}%`, '회사(법인)가 이익을 남길 때'],
      ['배당소득세', `배당금의 ${r.div}%`, '회사에서 이익을 나눠 받을 때'],
      ['취득세', `재산 값의 ${r.acq}%`, '집·땅·차 등을 살 때'],
      ['재산세', `재산 값의 ${r.prop}% (한 해마다)`, '재산을 가지고 있을 때'],
    ];
    const rules = p.rules && p.rules.length && typeof p.rules[0] === 'object' ? p.rules : [];
    const mine = (p.laws = p.laws || []);
    const box = h('div.page', h('h2.pagetitle', '📜 세심마을 세법전'),
      h('div.lawbook', h('div.law-title', '세심나라 조세법전'),
        h('ol.law-list', h('li', '세심마을의 주민은 법에 따라 세금을 낸다. (조세법률주의)'), h('li', '세금의 종류와 크기는 법으로 정한다.'), h('li', '세금은 경제적 능력에 따라 공평하게 낸다. (조세공평주의)'), h('li', '걷은 세금은 모두를 위해 올바르게 쓴다.')),
        h('table.law-table', h('thead', h('tr', h('th', '세금'), h('th', '얼마나'), h('th', '언제'))), h('tbody', rows.map(x => h('tr', x.map(c => h('td', c))))))),
      prog ? h('div.card', h('h3', '소득세 누진 구간'), st.brackets.map(([lim, rt], i) => h('div.sm', `${i ? fmt(st.brackets[i - 1][0]) : 0} ~ ${lim > 1e8 ? '그 이상' : fmt(lim)}${st.currency}: ${rt}%`))) : null,
      h('div.card', h('h3', '✍️ 내가 제안한 우리 반 세금'), mine.length ? mine.map(l => h('div.law-mine', h('b', l.name), h('div.sm', `${l.how || ''} ${l.amount || ''}`), h('div.sm', '이유: ' + (l.why || '')))) : h('p.sm', '2·3·5·7차시 "세심교실" 활동에서 내가 제안한 세금이 여기에 기록돼요.')));
    S.view(box);
  }));
  S.addLaw = function (law) { const p = S.me; p.laws = p.laws || []; law.ts = Date.now(); p.laws.push(law); E.save(); };

  /* ================= 세심기입장 ================= */
  S.route('/diary', guard(() => {
    const p = S.me; let tab = 'diary';
    const body = h('div');
    const tabs = h('div.tabs', [['diary', '✏️ 내 기록'], ['rc', '🧾 납부확인증'], ['badge', '🏅 배지']].map(([id, t]) => h('button.tab', { class: id === tab ? 'on' : '', onclick: e => { tab = id; S.$$('.tab', tabs).forEach(x => x.classList.remove('on')); e.currentTarget.classList.add('on'); show(); } }, t)));
    function show() {
      S.clear(body);
      if (tab === 'diary') {
        const list = p.diary.slice().reverse();
        body.append(list.length ? list.map(d => h('div.card.diary', h('b', d.title), h('div.sm', new Date(d.ts).toLocaleDateString('ko-KR')), h('p', d.text))) : h('p.sm.center', '활동에서 쓴 글이 여기에 모여요 ✏️'));
      } else if (tab === 'rc') {
        const rc = (p.receipts || []).slice().reverse();
        body.append(rc.length ? h('div.rc-list', rc.map(r => h('button.rc-mini', { onclick: () => E.showReceipt(r) }, `${new Date(r.ts).toLocaleDateString('ko-KR')} · ${E.TAXNAME[r.type] || r.type} ${E.money(r.amt)}`))) : h('p.sm.center', '아직 납부확인증이 없어요'));
        const sum = Object.entries(p.taxes).filter(([, v]) => v > 0);
        if (sum.length) body.append(h('div.card', h('h3', '세금내역서'), h('table.law-table', h('tbody', sum.map(([k, v]) => h('tr', h('td', E.TAXNAME[k] || k), h('td', E.money(v))))), h('tfoot', h('tr', h('td', '합계'), h('td', h('b', E.money(E.totalTax()))))))));
      } else {
        const bs = Object.values(p.badges);
        body.append(h('div.badge-grid', bs.length ? bs.map(b => h('div.badge', h('div.b-e', b.emoji), h('b', b.label))) : h('p.sm', '활동을 하면 배지를 모을 수 있어요!')));
      }
    }
    show();
    S.view(h('div.page', h('h2.pagetitle', '📒 세심기입장'), tabs, body));
  }));

  /* ================= 놀이터(게임 목록) ================= */
  S.route('/games', guard(() => {
    S.view(h('div.page', h('h2.pagetitle', '🎮 세심 놀이터'),
      h('div.game-grid', Object.entries(S.games).map(([id, g]) => h('button.game-card', { onclick: () => S.go('/game/' + id), style: { '--c': g.color || '#FFC93C' } }, h('div.g-e', g.e), h('b', g.title), h('div.sm', g.desc), h('div.sm', g.who))))));
  }));
  S.route('/game/:id', guard(({ id }) => {
    const g = S.games[id]; if (!g) { S.go('/games'); return; }
    const root = h('div.page.gamepage', h('div.act-top', h('button.back', { onclick: () => S.go('/games') }, '◀ 놀이터')), h('h2.pagetitle', g.e + ' ' + g.title));
    const box = h('div.gamebox'); root.append(box);
    S.view(root); g.run(box);
  }));

  /* ================= 수료증 ================= */
  S.route('/cert', guard(() => {
    const p = S.me; let fin = 0;
    for (let n = 1; n <= TOTAL; n++) if (E.isDone('s' + n + '.fin')) fin++;
    const ok = fin >= TOTAL;
    const box = h('div.page', h('h2.pagetitle', '🏅 세심마을 수료증'));
    if (!ok) box.append(h('div.card', S.W.bee(`아직 ${fin}/${TOTAL}차시를 마쳤어요. 모든 차시를 마치면 수료증을 받을 수 있어요! (미리보기)`, 'bee-read')));
    const d = new Date();
    const cert = h('div.cert', { class: ok ? '' : 'preview' },
      h('div.cert-in', h('div.cert-t', '세심교실 교육활동 인증서'), S.img('bee-hello', 'cert-bee'),
        h('p.cert-name', `${p.town} 마을 이장 ${p.name}`),
        h('p', '위 어린이는 세심교실의 모든 활동에 참여하여'), h('p', '세금의 의미와 역할을 이해하고'), h('p', '성실한 납세자로 자라날 것을 다짐하였기에 이 인증서를 드립니다.'),
        h('div.cert-stat', h('div', h('b', E.money(E.totalTax())), h('small', '지금까지 낸 세금')), h('div', h('b', Object.keys(p.badges).length + '개'), h('small', '모은 배지')), h('div', h('b', fin + '/' + TOTAL), h('small', '마친 차시'))),
        h('p.cert-date', `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`), h('p.cert-from', '세심마을 · 세심이')));
    box.append(cert, h('div.nextrow', h('button.btn.primary', { onclick: () => window.print() }, '🖨️ 인쇄하기')));
    S.view(box);
    if (ok) { E.badge('cert', '수료증 획득', '🏅'); }
  }));

  /* ================= 시작 ================= */
  window.addEventListener('DOMContentLoaded', () => {
    build(); E.restore(); S.updateWallet();
    if (!location.hash) location.hash = '#/';
    S.render();
  });
})();
