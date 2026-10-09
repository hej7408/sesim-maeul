/* 놀이터 보조 게임: 세금 퀴즈왕, 세금 계산 스피드 */
(function () {
  const { h, W, E, fmt, shuffle } = S;

  /* ---------- 세금 퀴즈왕 (제한시간 + 연속 정답 점수) ---------- */
  function quizking(root) {
    const qs = shuffle(S.REVIEW).slice(0, 10);
    let i = 0, score = 0, streak = 0, best = 0, left = 15, tm = null;
    S.cleanup = () => clearInterval(tm);
    const box = h('div.quiz'); root.append(W.bee('<b>세금 퀴즈왕</b>에 도전! 한 문제당 15초, 빨리 맞힐수록 점수가 높고 연속으로 맞히면 보너스 점수!', 'bee-hold'), box);
    const show = () => {
      clearInterval(tm); S.clear(box);
      if (i >= qs.length) {
        const ok = score >= 800; if (ok) E.badge('quizking', '세금 퀴즈왕', '👑');
        box.append(h('div.result', h('div.big-emoji', ok ? '👑' : '👏'), h('h3', `${score}점! (최고 연속 ${best}문제)`), h('p', ok ? '800점 이상! 세금 퀴즈왕이에요!' : '800점을 넘으면 퀴즈왕! 다시 도전해요.'), h('button.btn.primary', { onclick: () => { S.clear(root); quizking(root); } }, '🔁 다시 도전'))); return;
      }
      const it = qs[i]; left = 15;
      const bar = h('div.tbar', h('i')), fb = h('div.feedback'), list = h('div.opts'); let locked = false;
      const order = shuffle(it.opts.map((o, k) => k));
      const res = ok => {
        if (locked) return; locked = true; clearInterval(tm);
        if (ok) { streak++; best = Math.max(best, streak); const pts = 50 + Math.round(left * 4) + Math.min(streak - 1, 5) * 10; score += pts; S.sfx('ok'); fb.className = 'feedback show good'; fb.innerHTML = `⭕ +${pts}점 ${streak > 1 ? `🔥 ${streak}연속!` : ''} ${it.why}`; }
        else { streak = 0; S.sfx('bad'); fb.className = 'feedback show bad'; fb.innerHTML = '❌ ' + it.why; }
        list.querySelectorAll('button').forEach(b => (b.disabled = true));
        fb.append(h('div', h('button.btn.primary', { onclick: () => { i++; show(); } }, '다음 ▶')));
        S.$('.qk-s', box).textContent = `점수 ${score}`;
      };
      order.forEach(k => list.append(h('button.opt', { onclick: e => { const ok = k === it.a; e.currentTarget.classList.add(ok ? 'right' : 'wrong'); if (!ok) list.children[order.indexOf(it.a)].classList.add('right'); res(ok); } }, it.opts[k])));
      box.append(h('div.inline', { style: { justifyContent: 'space-between' } }, h('span', `${i + 1}/${qs.length}`), h('b.qk-s', `점수 ${score}`), h('span', streak > 1 ? `🔥 ${streak}연속` : '')), bar, h('div.q', it.q), list, fb);
      tm = setInterval(() => { left -= .1; bar.firstChild.style.width = (left / 15 * 100) + '%'; if (left <= 0) { res(false); } }, 100);
    };
    show();
  }
  S.games.quizking = { title: '세금 퀴즈왕', e: '👑', color: '#B07CE8', desc: '10문제! 빨리 맞힐수록 높은 점수', who: '혼자서', run: quizking };

  /* ---------- 세금 계산 스피드 ---------- */
  function vatspeed(root) {
    const rate = E.settings().rates.vat; let i = 0, ok = 0, tm = null, left = 60; const N = 10; S.cleanup = () => clearInterval(tm);
    const box = h('div'); root.append(W.bee(`물건 값이 나오면 <b>부가가치세 ${rate}%</b>를 계산해서 적어요! 60초 안에 10문제! (어려우면 "÷10" 하면 돼요 😉)`, 'bee-money'), box);
    const start = () => {
      S.clear(box); i = 0; ok = 0; left = 60;
      const info = h('div.center', '⏱️ 60초'), card = h('div.charcard'), inp = h('input', { type: 'number', inputmode: 'numeric', placeholder: '세금은?' }), fb = h('div.center.sm');
      let price = 0;
      const nq = () => { if (i >= N) return end(); price = S.pick([500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 9000, 12000, 15000, 20000]); card.innerHTML = `🛍️ 물건 가격 <b>${fmt(price)}원</b><br><span class="sm">부가가치세는 얼마일까요?</span>`; inp.value = ''; inp.focus(); };
      const sub = () => { const v = Math.round(+inp.value); if (inp.value === '') return; const c = Math.round(price * rate / 100); if (v === c) { ok++; S.sfx('ok'); fb.textContent = '⭕ 정답!'; } else { S.sfx('bad'); fb.textContent = `❌ 정답은 ${fmt(c)}원`; } i++; nq(); };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') sub(); });
      box.append(info, card, h('div.center.inline.cc', inp, h('button.btn.primary', { onclick: sub }, '확인')), fb);
      nq(); clearInterval(tm); tm = setInterval(() => { left--; info.textContent = `⏱️ ${left}초 · ${i}/${N}`; if (left <= 0) end(); }, 1000);
      function end() { clearInterval(tm); S.clear(box); const good = ok >= 8; if (good) E.badge('vat', '세금 계산 박사', '🧮'); box.append(h('div.card.center', h('div.big-emoji', good ? '🧮' : '👍'), h('h3', `${N}문제 중 ${ok}문제 정답!`), h('p', good ? '8문제 이상! 세금 계산 박사예요!' : '8문제 이상 맞히면 세금 계산 박사! 다시 도전!'), h('button.btn.primary', { onclick: start }, '🔁 다시'))); }
    };
    box.append(h('div.nextrow', h('button.btn.primary.big', { onclick: start }, '▶ 시작')));
  }
  S.games.vatspeed = { title: '세금 계산 스피드', e: '⚡', color: '#E5484D', desc: '부가가치세를 빠르게 계산해요', who: '혼자서', run: vatspeed };
})();
