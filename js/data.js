/* 공통 데이터: 직업, 아바타, 시장 물건, 마을 시설, 마을 규칙 단어 */
(function () {
  S.sessions = {};

  S.JOBS = [
    { id: 'doctor', e: '🧑‍⚕️', n: '의사', pay: 900, d: '아픈 사람을 치료해요' },
    { id: 'astro', e: '🚀', n: '우주비행사', pay: 900, d: '우주를 여행하며 연구해요' },
    { id: 'soccer', e: '⚽', n: '축구선수', pay: 800, d: '멋진 경기를 보여줘요' },
    { id: 'youtuber', e: '📹', n: '유튜버', pay: 800, d: '영상을 만들어 소통해요' },
    { id: 'teacher', e: '🧑‍🏫', n: '선생님', pay: 700, d: '학생들을 가르쳐요' },
    { id: 'vet', e: '🐶', n: '수의사', pay: 700, d: '아픈 동물을 고쳐요' },
    { id: 'singer', e: '🎤', n: '가수', pay: 700, d: '노래로 마음을 전해요' },
    { id: 'police', e: '👮', n: '경찰관', pay: 650, d: '우리 마을을 지켜요' },
    { id: 'fire', e: '🧑‍🚒', n: '소방관', pay: 650, d: '불을 끄고 사람을 구해요' },
    { id: 'cook', e: '👩‍🍳', n: '요리사', pay: 600, d: '맛있는 음식을 만들어요' },
    { id: 'cafe', e: '☕', n: '카페 사장님', pay: 600, d: '커피를 만들어 팔아요' },
    { id: 'photo', e: '📸', n: '사진사', pay: 550, d: '멋진 사진을 찍어줘요' },
    { id: 'zoo', e: '🦁', n: '사육사', pay: 500, d: '동물을 키우고 돌봐요' },
    { id: 'clean', e: '🧹', n: '환경미화원', pay: 500, d: '마을을 깨끗하게 치워요' },
    { id: 'farmer', e: '🧑‍🌾', n: '농부', pay: 450, d: '농작물을 키워요' },
  ];
  S.job = id => S.JOBS.find(j => j.id === id) || S.JOBS[4];

  S.AVATARS = ['img:kid-girl', 'img:kid-boy', 'img:kid-girl2', '🐱', '🐶', '🦊', '🐰', '🐻', '🐼', '🐯', '🦄', '🐸', '🐥', '🐧'];
  S.ava = function (p, cls = '') {
    const a = (p && p.avatar) || '🐝';
    return a.startsWith('img:') ? S.h('img.ava', { class: cls, src: 'img/' + a.slice(4) + '.png', alt: '' }) : S.h('span.ava.emo', { class: cls }, a);
  };

  S.RULEWORDS = ['배려', '존중', '정리', '우정', '책임', '다정함', '사과', '인사', '약속'];

  /* 시장 */
  S.ITEMS = [
    { id: 'pencil', e: '✏️', n: '꿀벌 연필', price: 100 },
    { id: 'eraser', e: '🧽', n: '말랑 지우개', price: 150 },
    { id: 'sticker', e: '⭐', n: '반짝 스티커 팩', price: 300 },
    { id: 'cookie', e: '🍪', n: '꿀 쿠키', price: 400 },
    { id: 'pouch', e: '🎒', n: '스마트 필통', price: 800 },
    { id: 'bookmark', e: '🔖', n: '세심이 책갈피', price: 250 },
    { id: 'tree', e: '🌳', n: '마을 가로수 (내 마당용)', price: 600 },
    { id: 'fountain', e: '⛲', n: '마을 분수대 (내 마당용)', price: 1200 },
  ];

  /* 세금으로 짓는 공공시설: 한 사람당 낸 세금 기준 */
  S.FACILITIES = [
    { id: 'lamp', e: '💡', n: '가로등', need: 100 },
    { id: 'park', e: '🌳', n: '공원', need: 300 },
    { id: 'lib', e: '📚', n: '도서관', need: 600 },
    { id: 'fire', e: '🚒', n: '소방서', need: 1000 },
    { id: 'school', e: '🏫', n: '학교', need: 1500 },
    { id: 'play', e: '🛝', n: '놀이터', need: 2100 },
    { id: 'police', e: '🚓', n: '경찰서', need: 2800 },
    { id: 'clinic', e: '🏥', n: '보건소', need: 3600 },
  ];

  /* 재산(7차시 내 집 마련) */
  S.ASSETS = [
    { id: 'car', e: '🚗', n: '승용차', price: 900 },
    { id: 'land', e: '🌾', n: '땅', price: 1500 },
    { id: 'house', e: '🏠', n: '집', price: 2500 },
    { id: 'building', e: '🏢', n: '건물', price: 4000 },
  ];

  S.TAXCOLOR = { income: '#3B6FD4', vat: '#FF7A59', corp: '#5BAE7B', div: '#B07CE8', acq: '#E0A100', prop: '#16A5A5', tran: '#C0447A', fine: '#888' };
})();
