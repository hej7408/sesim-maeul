/* 교사용: 학급 설정, 학생 현황, 데이터 관리, 사용 안내 */
(function () {
  const { h, W, E, fmt } = S;
  const TOTAL = 10;

  S.route('/teacher', () => {
    const st = E.settings();
    const root = h('div.page');
    S.view(root);
    if (!st.pin) return setup(root);
    if (!S.sess.get('teacher', false)) return gate(root, st);
    dash(root);
  });

  function setup(root) {
    const pin = h('input', { type: 'password', inputmode: 'numeric', maxlength: 8, placeholder: '숫자 4자리 이상' });
    root.append(h('h2.pagetitle', '👩‍🏫 선생님 메뉴'), S.W.bee('처음 오셨네요! 학생들이 열어 보지 못하도록 <b>선생님 비밀번호(숫자)</b>를 만들어 주세요.', 'bee-hello'),
      h('div.card.form', h('label', '비밀번호 만들기', pin), h('button.btn.primary', { onclick: () => {
        if (!/^\d{4,8}$/.test(pin.value)) { S.toast('숫자 4~8자리로 만들어 주세요', 'bad'); return; }
        const s = E.settings(); s.pin = pin.value; E.saveSettings(s); S.sess.set('teacher', true); S.render();
      } }, '만들기')), h('p.sm', '※ 비밀번호는 이 기기(브라우저)에만 저장돼요. 잊으셨다면 브라우저 저장소를 비워야 해요.'));
  }
  function gate(root, st) {
    const pin = h('input', { type: 'password', inputmode: 'numeric', placeholder: '비밀번호' });
    const go = () => { if (pin.value === st.pin) { S.sess.set('teacher', true); S.render(); } else { S.toast('비밀번호가 달라요', 'bad'); S.sfx('bad'); } };
    pin.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    root.append(h('h2.pagetitle', '👩‍🏫 선생님 메뉴'), h('div.card.form', h('label', '비밀번호', pin), h('button.btn.primary', { onclick: go }, '들어가기')), h('a.btn', { href: '#/' }, '◀ 마을로'));
  }

  function dash(root) {
    let tab = 'status';
    const body = h('div');
    const tabs = h('div.tabs', [['status', '📋 학생 현황'], ['set', '⚙️ 학급 설정'], ['data', '💾 데이터'], ['guide', '📖 수업 안내']].map(([id, t]) => h('button.tab', { class: id === tab ? 'on' : '', onclick: e => { tab = id; S.$$('.tab', tabs).forEach(x => x.classList.remove('on')); e.currentTarget.classList.add('on'); show(); } }, t)));
    root.append(h('div.act-top', h('h2.pagetitle', '👩‍🏫 선생님 메뉴'), h('button.btn.sm', { onclick: () => { S.sess.del('teacher'); S.go('/'); } }, '나가기')), tabs, body);
    const show = () => { S.clear(body); ({ status, set: settings, data, guide })[tab](body); };
    show();
  }

  const profs = () => Object.values(E.profiles()).sort((a, b) => a.no - b.no);
  const prog = p => { let f = 0, a = 0; for (let n = 1; n <= TOTAL; n++) { if (p.done['s' + n + '.fin']) f++; a += Object.keys(p.done).filter(k => k.startsWith('s' + n + '.') && !k.endsWith('.fin')).length; } return { f, a }; };

  /* ---------- 학생 현황 ---------- */
  function status(box) {
    const list = profs(), st = E.settings();
    if (!list.length) { box.append(h('div.card', '아직 입주한 학생이 없어요. 학생들이 "처음이에요! 입주하기"로 시작해요.')); return; }
    const sum = {}; list.forEach(p => Object.entries(p.taxes).forEach(([k, v]) => (sum[k] = (sum[k] || 0) + v)));
    const tot = Object.values(sum).reduce((a, b) => a + b, 0), T = S.townState();
    box.append(h('div.card', h('h3', '🏛️ 우리 반 결산 (이 기기)'), h('p', `입주 ${list.length}명 · 걷힌 세금 총 ${E.money(tot)} · 지은 시설 ${T.built.length}/${S.FACILITIES.length}개`),
      h('div.taxbars', Object.entries(sum).sort((a, b) => b[1] - a[1]).map(([k, v]) => h('div.tb-row', h('span.tb-n', E.TAXNAME[k] || k), h('div.tb-bar', h('i', { style: { width: (v / tot * 100) + '%', background: S.TAXCOLOR[k] || '#888' } })), h('b', fmt(v)))))));
    const sel = new Set();
    const tbl = h('table.law-table.stu', h('thead', h('tr', ['', '번호', '이름', '직업', '완료 차시', '활동', '지갑', '낸 세금', '배지'].map(x => h('th', x)))),
      h('tbody', list.map(p => { const g = prog(p); return h('tr', { onclick: ev => { if (ev.target.tagName !== 'INPUT') detail(p); } },
        h('td', h('input', { type: 'checkbox', onchange: e => (e.target.checked ? sel.add(p.id) : sel.delete(p.id)) })), h('td', p.no), h('td', p.avatar && !p.avatar.startsWith('img:') ? p.avatar + ' ' + p.name : p.name), h('td', S.job(p.job).e + S.job(p.job).n), h('td', g.f + '/' + TOTAL), h('td', g.a), h('td', fmt(p.money)), h('td', fmt(E.totalTax(p))), h('td', Object.keys(p.badges || {}).length)); })));
    const mid = h('div.inline', { style: { margin: '8px 0' } },
      h('button.btn.sm', { onclick: () => act('bonus') }, '💰 선택한 학생에게 급여(기타소득) 주기'), h('button.btn.sm.danger', { onclick: () => act('fine') }, '🚨 범칙금 부과'));
    const act = kind => {
      if (!sel.size) { S.toast('학생을 먼저 체크해 주세요'); return; }
      const a = h('input', { type: 'number', value: kind === 'bonus' ? 200 : 50, min: 1 }), m = h('input', { type: 'text', value: kind === 'bonus' ? '선생님 칭찬 보너스' : '규칙 위반 범칙금' });
      S.modal({ title: kind === 'bonus' ? '💰 급여 주기' : '🚨 범칙금 부과', body: h('div.form', h('label', '내용', m), h('label', '금액', a), kind === 'bonus' ? h('p.sm', '소득세를 뗀 뒤 지급돼요.') : h('p.sm', '범칙금은 세금 현황에 반영돼요. 학급 안에서는 신중하게 사용해요.')),
        actions: [{ label: '확인', cls: 'primary', fn: () => {
          const all = E.profiles(), amt = Math.max(1, Math.round(+a.value));
          sel.forEach(id => { const p = all[id]; if (!p) return; const ts = Date.now();
            if (kind === 'bonus') { const tax = E.incomeTax(amt); p.money += amt - tax; p.taxes.income = (p.taxes.income || 0) + tax; p.ledger.push({ ts, kind: 'in', type: 'wage', amt: amt - tax, gross: amt, tax, memo: m.value }); if (tax) p.ledger.push({ ts, kind: 'tax', type: 'income', amt: tax, memo: m.value + ' - 원천징수' }); }
            else { const f = Math.min(amt, Math.max(0, p.money)); p.money -= f; p.taxes.fine = (p.taxes.fine || 0) + f; p.ledger.push({ ts, kind: 'tax', type: 'fine', amt: f, memo: m.value }); } });
          S.store.set('profiles', all); S.toast('적용했어요', 'good'); S.render(); } }, { label: '취소' }] });
    };
    box.append(mid, h('div.tablewrap', tbl), h('p.sm', '학생 줄을 누르면 자세히 볼 수 있어요.'));
  }
  function detail(p) {
    const g = prog(p);
    S.modal({ title: `${p.no}번 ${p.name} · ${p.town} 마을`, wide: true, body: h('div',
      h('p', `${S.job(p.job).e} ${S.job(p.job).n} · 완료 ${g.f}/${TOTAL}차시 · 활동 ${g.a}개 · 지갑 ${E.money(p.money)}`),
      h('h4', '낸 세금'), h('div', Object.entries(p.taxes).filter(([, v]) => v > 0).map(([k, v]) => h('span.chip', `${E.TAXNAME[k] || k} ${fmt(v)}`)) ),
      h('h4', '제안한 세법'), (p.laws || []).length ? p.laws.map(l => h('div.law-mine', h('b', l.name), h('div.sm', `${l.how || ''} ${l.amount || ''} — ${l.why || ''}`))) : h('p.sm', '없음'),
      h('h4', '최근 쓴 글'), (p.diary || []).slice(-5).reverse().map(d => h('div.diary.card', h('b', d.title), h('p', d.text))),
      h('h4', '배지'), h('div', Object.values(p.badges || {}).map(b => h('span.chip', b.emoji + ' ' + b.label)))),
      actions: [{ label: '비밀번호 없이 이 친구로 보기', fn: () => { E.login(p.id); S.go('/'); } }, { label: '닫기', cls: 'primary' }] });
  }

  /* ---------- 학급 설정 ---------- */
  function settings(box) {
    const st = E.settings(), f = {};
    const inp = (k, lab, val, type = 'text', extra = {}) => { f[k] = h('input', Object.assign({ type, value: val }, extra)); return h('label', lab, f[k]); };
    const mode = h('select', h('option', { value: 'flat', selected: st.incomeMode === 'flat' }, '비례세 (모두 같은 비율)'), h('option', { value: 'progressive', selected: st.incomeMode === 'progressive' }, '누진세 (많이 벌수록 높은 비율)'));
    const op = h('select', Array.from({ length: 11 }, (_, i) => h('option', { value: i, selected: (st.openUpTo == null ? 10 : st.openUpTo) === i }, i === 10 ? '10차시까지 모두 열기' : i + '차시까지 열기')));
    const br = st.brackets.map((b, i) => [h('input', { type: 'number', value: b[0] > 1e8 ? '' : b[0], placeholder: '그 이상', disabled: b[0] > 1e8 }), h('input', { type: 'number', value: b[1] })]);
    box.append(h('div.card.form', h('h3', '🏘️ 우리 반 기본 설정'),
      inp('classCode', '학급 코드 (같은 반끼리 같은 코드)', st.classCode), inp('townName', '마을 이름 기본값 (선택)', st.townName, 'text', { placeholder: '예) 별빛' }), inp('currency', '화폐 단위', st.currency, 'text', { maxlength: 3 }),
      h('label', '열어 줄 차시', op), inp('welcome', '입주 환영 지급액', st.welcome, 'number'), inp('activityPay', '활동 1개당 급여', st.activityPay, 'number')),
      h('div.card.form', h('h3', '⚖️ 세법 (세심회의에서 정한 값으로 바꿔요)'), h('label', '소득세 방식', mode),
        inp('income', '소득세율 (%) — 비례세일 때', st.rates.income, 'number'), inp('vat', '부가가치세율 (%)', st.rates.vat, 'number'), inp('corp', '법인세율 (%)', st.rates.corp, 'number'), inp('div', '배당소득세율 (%)', st.rates.div, 'number'), inp('acq', '취득세율 (%)', st.rates.acq, 'number'), inp('prop', '재산세율 (%, 한 해마다)', st.rates.prop, 'number'),
        h('p.sm', '누진세 구간 (월급 기준: ~까지 몇 %)'), br.map((r, i) => h('div.inline', i < br.length - 1 ? ['월급 ', r[0], '까지 '] : ['그 이상 '], r[1], '%'))),
      h('div.card.form', h('h3', '🔑 비밀번호 변경'), inp('pin', '새 비밀번호(숫자)', '', 'password', { placeholder: '바꾸려면 입력' })),
      h('div.nextrow', h('button.btn.primary.big', { onclick: () => {
        const n = k => Math.max(0, +f[k].value || 0);
        const s = { classCode: f.classCode.value.trim() || '우리반', townName: f.townName.value.trim(), currency: f.currency.value.trim() || '심', pin: f.pin.value && /^\d{4,8}$/.test(f.pin.value) ? f.pin.value : st.pin,
          openUpTo: +op.value, welcome: n('welcome'), activityPay: n('activityPay'), incomeMode: mode.value,
          rates: { income: n('income'), vat: n('vat'), corp: n('corp'), div: n('div'), acq: n('acq'), prop: n('prop') },
          brackets: br.map((r, i) => [i < br.length - 1 ? (+r[0].value || st.brackets[i][0]) : 1e9, +r[1].value || 0]) };
        E.saveSettings(s); S.toast('저장했어요 ✅', 'good');
      } }, '💾 저장하기')));
  }

  /* ---------- 데이터 ---------- */
  function data(box) {
    const dl = (name, text, type) => { const a = h('a', { href: URL.createObjectURL(new Blob([text], { type })), download: name }); document.body.append(a); a.click(); a.remove(); };
    const csv = () => {
      const rows = [['번호', '이름', '직업', '완료차시', '활동수', '지갑', '낸세금합계', '소득세', '부가가치세', '법인세', '배당소득세', '취득세', '재산세', '양도소득세', '범칙금', '배지수']];
      profs().forEach(p => { const g = prog(p), t = p.taxes || {}; rows.push([p.no, p.name, S.job(p.job).n, g.f, g.a, p.money, E.totalTax(p), t.income || 0, t.vat || 0, t.corp || 0, t.div || 0, t.acq || 0, t.prop || 0, t.tran || 0, t.fine || 0, Object.keys(p.badges || {}).length]); });
      dl('세심마을_학생현황.csv', '﻿' + rows.map(r => r.join(',')).join('\n'), 'text/csv');
    };
    const fileIn = h('input', { type: 'file', accept: '.json', onchange: e => {
      const f = e.target.files[0]; if (!f) return; const r = new FileReader();
      r.onload = () => { try { const d = JSON.parse(r.result); const all = E.profiles(); let n = 0; Object.entries(d.profiles || {}).forEach(([id, p]) => { if (!all[id] || (p.ledger || []).length >= (all[id].ledger || []).length) { all[id] = p; n++; } }); S.store.set('profiles', all); S.toast(`${n}명의 기록을 가져왔어요`, 'good'); S.render(); } catch (err) { S.toast('파일을 읽을 수 없어요', 'bad'); } };
      r.readAsText(f);
    } });
    box.append(h('div.card', h('h3', '📤 내보내기'), h('p.sm', '학생 현황은 엑셀(CSV)로, 전체 기록은 JSON 백업으로 저장해요.'),
      h('div.inline', h('button.btn.green', { onclick: csv }, '📊 학생 현황 CSV'), h('button.btn.blue', { onclick: () => dl('세심마을_백업_' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify({ v: 1, settings: E.settings(), profiles: E.profiles() }), 'application/json') }, '💾 전체 백업(JSON)'))),
      h('div.card', h('h3', '📥 가져오기 (다른 기기와 합치기)'), h('p.sm', '다른 기기에서 저장한 백업(JSON)을 불러오면 같은 번호의 기록 중 더 많이 쌓인 쪽으로 합쳐요.'), fileIn),
      h('div.card', h('h3', '🧹 정리'), h('p.sm', '조심해서 사용해요. 지운 기록은 되돌릴 수 없어요.'),
        h('div.inline', h('button.btn.danger', { onclick: () => { const nm = prompt('지울 학생의 번호를 입력하세요'); if (!nm) return; const all = E.profiles(); const id = Object.keys(all).find(k => all[k].no === +nm); if (id && confirm(all[id].name + ' 학생 기록을 지울까요?')) { delete all[id]; S.store.set('profiles', all); S.toast('지웠어요'); S.render(); } } }, '학생 한 명 지우기'),
          h('button.btn.danger', { onclick: () => { if (prompt('모든 학생 기록을 지우려면 "삭제"라고 입력하세요') === '삭제') { S.store.del('profiles'); E.logout(); S.toast('모두 지웠어요'); S.go('/'); } } }, '전체 초기화'))));
  }

  /* ---------- 수업 안내 ---------- */
  function guide(box) {
    const rows = [
      [1, '세금이 필요해', '마을 지도 탐험, 세금 브이로그, 보물상자 세금 내기, OX 퀴즈', '(선택) 보물상자 만들기'],
      [2, '세금을 어떻게 정할까', '왕 시뮬레이션, 세법 찾기·수정, 세심회의 → 세법전 → 첫 세금 납부', '세법전, 납부확인증, 세심기입장'],
      [3, '공평한 세금', '상자 나누기, 정액세·비례세 계산, 세율 정하기, 소득재분배', '포스트잇(생각 나누기)'],
      [4, '세금은 어디에', '분야 분류, 예산 과정, 예산안 짜기, 세금통 게임, 세금 분류', '세금통 카드(선택)'],
      [5, '물건 살 때 세금', '마트 영수증, 시장에서 구매, 교정적 조세 실험, 새 세금 제안', '영수증 붙이기'],
      [6, '회사도 세금', '법인 개념, 돈의 흐름, 가게 창업 시뮬(법인세·배당·근로소득세)', '(선택) 시장놀이 물품'],
      [7, '집을 살 때·가질 때', '무택이 이야기, 내 재산 마련(취득세·재산세·양도소득세), 세금왕 게임', '세금왕 교구(선택)'],
      [8, '세금을 안 내려 한다고', '탈세·절세 분류, 세금공무원 게임, 이야기, 히어로, 성실납세 서약', '서약서 인쇄(선택)'],
      [9, '결산', '결산 개념, 세금 예측, 내 세금 결산서, 나라 살림, 복습 퀴즈', '세금내역서'],
      [10, '진짜 세금 세상', '세금의 역사, 이런 세금 진짜?, 오줌세 게임, 로봇세 토론, 졸업', '인증서 인쇄'],
    ];
    box.append(h('div.card', h('h3', '📖 이렇게 수업해 보세요'), h('ol', [
      '학급 설정에서 <b>학급 코드·마을 이름·세율</b>을 정해요. (세심회의에서 정한 값으로 수업 중 바꿔도 돼요)',
      '학생은 <b>처음이에요! 입주하기</b>로 번호·이름·직업을 정해요. 같은 기기에서 여러 명이 써도 이름을 눌러 다시 들어올 수 있어요.',
      '차시마다 <b>이야기 → 체험 활동 → 쏙쏙 개념정리 → 월급</b> 순서로 진행해요. 활동은 개별/짝/모둠 어느 쪽으로 해도 좋아요.',
      '교과서 활동(세법전, 포스트잇, 납부확인증 도장)과 병행하면 효과가 커요. 앱은 <b>체험·계산·게임</b>을 맡고, 교실 토의는 직접 하면 좋아요.',
      '여러 기기를 쓴다면 <b>백업(JSON)</b>을 서로 가져오기로 합칠 수 있어요.'].map(t => h('li', { html: t })))),
      h('div.card', h('h3', '🗓️ 차시별 구성'), h('div.tablewrap', h('table.law-table', h('thead', h('tr', ['차시', '주제', '앱 활동', '교실 준비물'].map(x => h('th', x)))), h('tbody', rows.map(r => h('tr', r.map(c => h('td', c)))))))),
      h('div.card', h('h3', '🔒 개인정보'), h('p.sm', '이 앱은 서버가 없어요. 모든 기록은 학생이 쓰는 기기의 브라우저에만 저장돼요. 이름과 번호 외에는 수집하지 않아요.')));
  }
})();
