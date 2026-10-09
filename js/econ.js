/* 세심마을 경제: 설정, 학생 프로필, 지갑, 세금 납부, 진도 */
(function () {
  const { h, fmt } = S;

  const DEFAULT_SETTINGS = {
    townName: '', classCode: '우리반', pin: '', currency: '심',
    rates: { income: 10, vat: 10, corp: 20, div: 15, acq: 5, prop: 2 },
    incomeMode: 'flat', // flat | progressive
    brackets: [[500, 5], [1000, 10], [1e9, 20]],
    welcome: 300, activityPay: 50,
  };

  const E = (S.E = {});

  E.settings = function () {
    const s = S.store.get('settings', null) || {};
    const d = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    return Object.assign(d, s, { rates: Object.assign(d.rates, s.rates || {}) });
  };
  E.saveSettings = s => S.store.set('settings', s);
  E.cur = () => E.settings().currency || '심';
  E.money = n => fmt(n) + E.cur();

  /* ---------- 프로필 ---------- */
  E.profiles = () => S.store.get('profiles', {});
  E.me = () => S.me;
  E.save = function () {
    if (!S.me) return;
    const all = E.profiles(); all[S.me.id] = S.me; S.store.set('profiles', all);
  };
  E.login = function (id) {
    const p = E.profiles()[id]; if (!p) return false;
    S.me = p; S.sess.set('me', id); return true;
  };
  E.logout = function () { S.me = null; S.sess.del('me'); };
  E.create = function ({ no, name, avatar, town, job }) {
    const st = E.settings();
    const id = st.classCode + '-' + no;
    const p = {
      id, cls: st.classCode, no: Number(no), name, avatar: avatar || '🐝', town: town || st.townName || name,
      job: job || null, money: 0, ledger: [], taxes: {}, done: {}, notes: {}, diary: [], badges: {},
      assets: [], items: [], rules: [], stars: 0, created: Date.now(),
    };
    const all = E.profiles(); all[id] = p; S.store.set('profiles', all);
    S.me = p; S.sess.set('me', id);
    E.addLedger({ kind: 'in', type: 'gift', amt: st.welcome, memo: '마을 입주 환영 선물 (비과세)' });
    p.money = st.welcome; E.save();
    return p;
  };

  E.addLedger = function (e) {
    const p = S.me; e.ts = Date.now(); p.ledger.push(e);
    if (p.ledger.length > 400) p.ledger.shift();
  };

  /* ---------- 소득세 ---------- */
  E.incomeTax = function (gross) {
    const st = E.settings();
    if (st.incomeMode === 'progressive') {
      let tax = 0, prev = 0;
      for (const [lim, r] of st.brackets) {
        if (gross > prev) tax += (Math.min(gross, lim) - prev) * r / 100;
        prev = lim;
      }
      return Math.round(tax);
    }
    return Math.round(gross * st.rates.income / 100);
  };

  /* 벌기: type 'wage' → 소득세, 'div' → 배당소득세, 'gift' → 비과세 */
  E.earn = function (gross, memo, opts = {}) {
    const p = S.me; if (!p) return null;
    const type = opts.type || 'wage';
    let tax = 0, taxType = null;
    if (type === 'wage') { tax = E.incomeTax(gross); taxType = 'income'; }
    else if (type === 'div') { tax = Math.round(gross * E.settings().rates.div / 100); taxType = 'div'; }
    const net = gross - tax;
    p.money += net;
    E.addLedger({ kind: 'in', type, amt: net, gross, tax, memo });
    if (tax) { p.taxes[taxType] = (p.taxes[taxType] || 0) + tax; E.addLedger({ kind: 'tax', type: taxType, amt: tax, memo: memo + ' - 원천징수' }); }
    E.save(); S.updateWallet && S.updateWallet(true);
    S.sfx('coin');
    if (!opts.quiet) S.toast(`💰 ${memo}: ${E.money(gross)} 받고 세금 ${E.money(tax)} → 실수령 ${E.money(net)}`, 'coin');
    return { gross, tax, net };
  };

  /* 쓰기(물건): price는 부가가치세 제외 가격 */
  E.spend = function (price, memo, opts = {}) {
    const p = S.me; if (!p) return null;
    const vat = opts.vat === false ? 0 : Math.round(price * E.settings().rates.vat / 100);
    const total = price + vat;
    if (p.money < total) { S.toast('앗, 돈이 부족해요! 활동을 하며 더 벌어봐요 💪', 'bad'); S.sfx('bad'); return null; }
    p.money -= total;
    E.addLedger({ kind: 'out', type: 'buy', amt: total, price, vat, memo });
    if (vat) { p.taxes.vat = (p.taxes.vat || 0) + vat; E.addLedger({ kind: 'tax', type: 'vat', amt: vat, memo: memo + ' - 부가가치세' }); }
    E.save(); S.updateWallet && S.updateWallet(true); S.sfx('coin');
    return { price, vat, total };
  };

  E.pay = function (amt, memo) {
    const p = S.me; if (p.money < amt) { S.toast('돈이 부족해요', 'bad'); return false; }
    p.money -= amt; E.addLedger({ kind: 'out', type: 'pay', amt, memo }); E.save(); S.updateWallet && S.updateWallet(true); return true;
  };

  /* 세금 직접 납부 (취득세·재산세·법인세 등) → 납부확인증 */
  E.TAXNAME = { income: '소득세', vat: '부가가치세', corp: '법인세', div: '배당소득세', acq: '취득세', prop: '재산세', tran: '양도소득세', first: '첫 세금', fine: '과태료' };
  E.payTax = function (type, amt, memo, opts = {}) {
    const p = S.me;
    if (p.money < amt) { S.toast('세금을 낼 돈이 부족해요!', 'bad'); S.sfx('bad'); return false; }
    p.money -= amt;
    p.taxes[type] = (p.taxes[type] || 0) + amt;
    E.addLedger({ kind: 'tax', type, amt, memo });
    p.receipts = p.receipts || [];
    const rc = { ts: Date.now(), type, amt, memo, no: p.receipts.length + 1 };
    p.receipts.push(rc); if (p.receipts.length > 60) p.receipts.shift();
    E.save(); S.updateWallet && S.updateWallet(true);
    if (!opts.quiet) E.showReceipt(rc);
    return true;
  };

  /* 내 지갑에서 빠지지 않고 기록만 하는 세금 (회사가 내는 법인세 등) */
  E.recordTax = function (type, amt, memo) {
    const p = S.me;
    p.taxes[type] = (p.taxes[type] || 0) + amt;
    E.addLedger({ kind: 'tax', type, amt, memo, corp: true });
    p.receipts = p.receipts || [];
    const rc = { ts: Date.now(), type, amt, memo, no: p.receipts.length + 1 };
    p.receipts.push(rc); E.save();
    return rc;
  };

  E.showReceipt = function (rc) {
    const p = S.me;
    const d = new Date(rc.ts);
    const stamp = h('div.stamp', '납부\n확인');
    const body = h('div.receipt',
      h('div.rc-title', '납 부 확 인 증'),
      h('div.rc-row', h('span', '납부자'), h('b', p.name + ' (' + p.no + '번)')),
      h('div.rc-row', h('span', '세금 내용'), h('b', (E.TAXNAME[rc.type] || rc.type) + (rc.memo ? ' · ' + rc.memo : ''))),
      h('div.rc-row', h('span', '납부일자'), h('b', `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`)),
      h('div.rc-row.big', h('span', '납부세액'), h('b', E.money(rc.amt))),
      h('div.rc-foot', '위 금액을 정히 영수합니다.  —  세심마을 국세청'),
      stamp);
    S.modal({ title: '🧾 납부확인증이 나왔어요!', body, actions: [{ label: '내 세심기입장에 붙이기', cls: 'primary' }] });
    setTimeout(() => { stamp.classList.add('on'); S.sfx('stamp'); }, 250);
  };

  E.totalTax = (p = S.me) => Object.values(p.taxes || {}).reduce((a, b) => a + b, 0);

  /* ---------- 진도 ---------- */
  E.isDone = key => !!(S.me && S.me.done[key]);
  E.doneCount = function (n) { return S.me ? Object.keys(S.me.done).filter(k => k.startsWith('s' + n + '.') && !k.endsWith('.fin')).length : 0; };
  /* 활동 완료: 처음이면 급여 지급 */
  E.complete = function (key, reward) {
    const p = S.me; if (!p) return false;
    if (p.done[key]) return false;
    p.done[key] = Date.now();
    const pay = reward == null ? E.settings().activityPay : reward;
    if (pay > 0) E.earn(pay, '활동 급여', { quiet: false });
    E.save(); return true;
  };
  E.note = (k, v) => { S.me.notes[k] = v; E.save(); };
  E.getNote = (k, d) => (S.me && S.me.notes[k] !== undefined ? S.me.notes[k] : d);
  E.diary = function (title, text) {
    S.me.diary.push({ ts: Date.now(), title, text }); if (S.me.diary.length > 200) S.me.diary.shift(); E.save();
  };
  E.badge = function (id, label, emoji) {
    const p = S.me; if (p.badges[id]) return;
    p.badges[id] = { label, emoji, ts: Date.now() }; E.save();
    S.toast(`${emoji} 새 배지! "${label}"`, 'good'); S.sfx('win');
  };

  /* 마을 전체(이 기기) 세금 → 공공시설 건설 */
  E.villageTax = function () {
    const all = Object.values(E.profiles());
    return all.reduce((a, p) => a + E.totalTax(p), 0);
  };

  /* 학생 세션 복구 */
  E.restore = function () {
    const id = S.sess.get('me', null);
    if (id) E.login(id);
  };
})();
