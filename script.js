(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms)), rnd = (a, b) => Math.random() * (b - a) + a;
const pop = (el, c = 'pop') => { el.classList.remove(c); void el.offsetWidth; el.classList.add(c); };
const type = async (el, t, ms = 24) => { el.textContent = ''; for (const c of t) { el.textContent += c; await sleep(ms); } };

let ac, snd = false, eng;
const AC = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch (e) {} };
const tone = (f, d = .15, ty = 'sine', v = .1, sl = 0) => { if (!snd || !ac) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime; o.type = ty; o.frequency.setValueAtTime(f, t); if (sl) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + sl), t + d); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(1e-4, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .02); };
const noise = (d = .12, v = .08) => { if (!snd || !ac) return; const n = ac.sampleRate * d | 0, b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = ac.createBufferSource(), g = ac.createGain(); g.gain.value = v; s.buffer = b; s.connect(g); g.connect(ac.destination); s.start(); };
const blip = () => { noise(.07, .1); tone(1700, .05, 'square', .04); };
const engOn = () => { if (!snd || !ac || eng) return; const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain(); o.type = 'sawtooth'; f.type = 'lowpass'; f.frequency.value = 900; g.gain.value = .035; o.connect(f); f.connect(g); g.connect(ac.destination); o.start(); eng = o; };
const engOff = () => { if (eng) { try { eng.stop(); } catch (e) {} eng = null; } };
const sb = $('#snd'); sb.onclick = () => { snd = !snd; if (snd) AC(); else engOff(); sb.textContent = snd ? '🔊' : '🔇'; };

let cur = 1; const init = {};
function go(n) {
  const w = $('.wipe'); w.classList.remove('go'); void w.offsetWidth; w.classList.add('go');
  setTimeout(() => { $$('.scr').forEach(s => s.classList.remove('on')); $('#s' + n).classList.add('on'); cur = n; init[n] && init[n](); }, 480);
}

async function lights() {
  const L = [...$('#lights').children];
  for (const l of L) { await sleep(750); l.classList.add('on'); tone(520, .18, 'square', .1); }
  await sleep(900 + Math.random() * 900);
  L.forEach(l => l.classList.remove('on')); tone(980, .7, 'sawtooth', .12); noise(.4, .1);
  $('#gp').textContent = 'LIGHTS OUT AND AWAY WE GO!'; $('#s1').classList.add('go');
  await sleep(900); $('#go1').classList.remove('hid');
}
const enter = s => { snd = s; if (s) AC(); sb.textContent = s ? '🔊' : '🔇'; sb.classList.remove('hid'); $('#enter').classList.add('hid'); lights(); };
$('#e1').onclick = () => enter(true); $('#e0').onclick = () => enter(false);
$('#go1').onclick = () => go(2);

const ACC = 'Após uma investigação minuciosa, os comissários da FIA identificaram uma série de irregularidades envolvendo uma piloto da Scuderia Ferrari.';
init[2] = async () => {
  if (init[2].d) return; init[2].d = 1;
  await type($('#acc'), ACC, 16);
  for (const li of $$('#inf li')) { li.classList.add('show'); await sleep(350); }
};
$$('#inf li').forEach(li => li.onclick = () => {
  if (!li.classList.contains('show') || li.classList.contains('done')) return;
  li.classList.add('done'); noise(.15, .25); tone(90, .2, 'square', .2);
  if ($$('#inf li.done').length === 4) { $('#go2').disabled = false; $('#h2').textContent = 'Todas as infrações confirmadas. Processo encaminhado.'; tone(660, .3, 'triangle', .1); }
});
$('#go2').onclick = () => go(3);

const TM = ['A Ferrari pode até ter tradição, mas aqui quem manda é a McLaren.', 'Papaya é a cor de quem sempre larga na frente.', 'Vermelho é bonito, mas laranja é inesquecível.'];
const TF = ['Tradição não se discute, se admira. E se encanta também. 😌', 'Pode vir, laranjinha. Na Ferrari até o azar é elegante.', 'Vermelho combina com tudo… inclusive com a minha vitória.'];
const SW = ['Os comissários informam que a piloto da Ferrari está vencendo uma disputa que nem sabia que estava participando.', 'Os comissários notam um nível suspeito de charme em ambas as equipes.', 'Atenção: a rivalidade está sendo julgada como crime de fofura.'];
let tm = 0, tf = 0;
const stew = () => { const s = $('#stw'); s.classList.remove('hid'); s.textContent = SW[(tm + tf) % 3]; pop(s, 'pop'); };
const chk = () => { if (tm && tf) $('#go3').disabled = false; };
$('#pM').onclick = () => { const b = $('#bM'); b.textContent = TM[tm++ % 3]; pop(b); blip(); stew(); chk(); };
$('#pF').onclick = () => { const b = $('#bF'); b.textContent = TF[tf++ % 3]; pop(b); blip(); stew(); chk(); };
$('#go3').onclick = () => go(4);

const CP = [[120,400],[120,260],[130,190],[190,150],[250,185],[290,270],[340,370],[385,430],[425,455],[465,430],[505,385],[590,335],[720,265],[840,205],[905,165],[945,185],[925,225],[955,265],[975,330],[960,395],[900,430],[820,425],[740,455],[670,500],[610,515],[560,545],[510,580],[450,605],[370,610],[290,600],[230,590],[195,570],[165,585],[120,540]];
const NAMES = [[2, 'LA SOURCE'], [8, 'EAU ROUGE · RAIDILLON'], [12, 'KEMMEL'], [15, 'LES COMBES'], [19, 'RIVAGE'], [23, 'POUHON'], [27, 'STAVELOT'], [29, 'BLANCHIMONT'], [31, 'BUS STOP']];
const cv = $('#cv'), cx = cv.getContext('2d'), T = document.createElement('canvas'), tx = T.getContext('2d');
const iM = new Image(), iF = new Image(); iM.src = 'assets/car-mclaren.png'; iF.src = 'assets/car-ferrari.png';
let W, H, dpr, X = [], Y = [], C = [], tot = 1, tw = 16, carW = 44;
function build() {
  dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  cv.width = T.width = W * dpr; cv.height = T.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); tx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const por = H > W * 1.05;
  let pts = CP.map(([x, y]) => por ? [700 - y, x] : [x, y]);
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), mnx = Math.min(...xs), mxx = Math.max(...xs), mny = Math.min(...ys), mxy = Math.max(...ys);
  const tp = por ? 170 : 120, bp = por ? 190 : 140, sx = por ? 34 : 60;
  const sc = Math.min((W - sx * 2) / (mxx - mnx), (H - tp - bp) / (mxy - mny)), ox = (W - (mxx - mnx) * sc) / 2, oy = tp + (H - tp - bp - (mxy - mny) * sc) / 2;
  pts = pts.map(([x, y]) => [ox + (x - mnx) * sc, oy + (y - mny) * sc]);
  tw = Math.max(15, sc * 21); carW = Math.max(40, sc * 58);
  X = []; Y = []; const n = pts.length, S = 22;
  for (let i = 0; i < n; i++) {
    const a = pts[(i + n - 1) % n], b = pts[i], c = pts[(i + 1) % n], d = pts[(i + 2) % n];
    for (let k = 0; k < S; k++) { const t = k / S, t2 = t * t, t3 = t2 * t, f = (p, q, r, s) => .5 * (2 * q + (-p + r) * t + (2 * p - 5 * q + 4 * r - s) * t2 + (-p + 3 * q - 3 * r + s) * t3); X.push(f(a[0], b[0], c[0], d[0])); Y.push(f(a[1], b[1], c[1], d[1])); }
  }
  C = [0]; for (let i = 1; i < X.length; i++) C.push(C[i - 1] + Math.hypot(X[i] - X[i - 1], Y[i] - Y[i - 1]));
  tot = C[C.length - 1] + Math.hypot(X[0] - X[X.length - 1], Y[0] - Y[Y.length - 1]);
  paint(pts);
}
function paint(pts) {
  const g = tx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * .7); g.addColorStop(0, '#0a2230'); g.addColorStop(1, '#02050a'); tx.fillStyle = g; tx.fillRect(0, 0, W, H);
  [['rgba(255,43,214,.12)', .15, .2], ['rgba(0,240,255,.1)', .85, .8]].forEach(([c, a, b]) => { const r = tx.createRadialGradient(W * a, H * b, 0, W * a, H * b, Math.max(W, H) * .5); r.addColorStop(0, c); r.addColorStop(1, 'transparent'); tx.fillStyle = r; tx.fillRect(0, 0, W, H); });
  tx.strokeStyle = 'rgba(0,240,255,.05)'; tx.lineWidth = 1;
  for (let x = 0; x < W; x += 44) { tx.beginPath(); tx.moveTo(x, 0); tx.lineTo(x, H); tx.stroke(); }
  for (let y = 0; y < H; y += 44) { tx.beginPath(); tx.moveTo(0, y); tx.lineTo(W, y); tx.stroke(); }
  let s = 7; const r = () => (s = s * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < 320; i++) { tx.fillStyle = ['rgba(12,70,52,.5)', 'rgba(8,50,40,.55)', 'rgba(20,100,70,.35)'][i % 3]; tx.beginPath(); tx.arc(r() * W, r() * H, r() * 14 + 5, 0, 6.283); tx.fill(); }
  const N = X.length, cols = ['#00f0ff', '#ff2bd6', '#ffe600'];
  tx.lineCap = tx.lineJoin = 'round';
  const path = (a, b) => { tx.beginPath(); for (let i = a; i <= b; i++) { const j = i % N; i === a ? tx.moveTo(X[j], Y[j]) : tx.lineTo(X[j], Y[j]); } };
  for (let k = 0; k < 3; k++) { path(Math.floor(N * k / 3), Math.floor(N * (k + 1) / 3) + 1); tx.strokeStyle = tx.shadowColor = cols[k]; tx.shadowBlur = 22; tx.lineWidth = tw + 7; tx.stroke(); }
  tx.shadowBlur = 0; path(0, N); tx.strokeStyle = '#0d1018'; tx.lineWidth = tw; tx.stroke();
  tx.setLineDash([9, 12]); tx.strokeStyle = 'rgba(255,255,255,.3)'; tx.lineWidth = 1.5; tx.stroke(); tx.setLineDash([]);
  const a = Math.atan2(Y[1] - Y[N - 1], X[1] - X[N - 1]), q = tw / 6; tx.save(); tx.translate(X[0], Y[0]); tx.rotate(a);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { tx.fillStyle = (i + j) % 2 ? '#fff' : '#111'; tx.fillRect(j * q - q, -tw / 2 + i * q, q, q); } tx.restore();
  const mx = pts.reduce((a, p) => a + p[0], 0) / pts.length, my = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  tx.font = '600 11px "Chakra Petch",sans-serif'; tx.textAlign = 'center'; tx.fillStyle = 'rgba(255,255,255,.8)';
  [[0, 'START / FINISH'], ...NAMES].forEach(([i, nm]) => { const p = pts[i], dx = p[0] - mx, dy = p[1] - my, d = Math.hypot(dx, dy) || 1; tx.fillText(nm, p[0] + dx / d * (tw + 30), p[1] + dy / d * (tw + 22)); });
}
function posAt(s) {
  s = (s % tot + tot) % tot; let lo = 0, hi = C.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; C[m] <= s ? lo = m : hi = m - 1; }
  const k = (lo + 1) % X.length, seg = (k === 0 ? tot : C[k]) - C[lo], t = seg ? (s - C[lo]) / seg : 0;
  return [X[lo] + (X[k] - X[lo]) * t, Y[lo] + (Y[k] - Y[lo]) * t];
}
const ang = s => { const a = posAt(s - 5), b = posAt(s + 5); return Math.atan2(b[1] - a[1], b[0] - a[0]); };
const gl = {}; const glow = col => gl[col] || (gl[col] = (() => { const o = document.createElement('canvas'); o.width = o.height = 64; const x = o.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, col); g.addColorStop(1, 'transparent'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return o; })());
function car(p, img, col, off, h) {
  const a = ang(p * tot), [x, y] = posAt(p * tot), px = x - Math.sin(a) * off, py = y + Math.cos(a) * off;
  h.push([px, py]); if (h.length > 18) h.shift(); cx.lineCap = 'round'; cx.strokeStyle = col;
  for (let i = 1; i < h.length; i++) { cx.globalAlpha = i / h.length * .55; cx.lineWidth = carW * .2 * i / h.length + 1; cx.beginPath(); cx.moveTo(h[i - 1][0], h[i - 1][1]); cx.lineTo(h[i][0], h[i][1]); cx.stroke(); }
  cx.globalAlpha = .6; cx.drawImage(glow(col), px - carW, py - carW, carW * 2, carW * 2); cx.globalAlpha = 1;
  cx.save(); cx.translate(px, py); cx.rotate(a); cx.drawImage(img, -carW / 2, -carW * .266, carW, carW * .532); cx.restore();
}
const L = 3, V = 1 / 15;
const fresh = () => ({ p1: -.004, p2: 0, t: 0, boostEnd: 0, ready: 0, fb: 0, run: false, last: 0, lap: 0, lead: 2, spd: 120, n: 0, h1: [], h2: [], tw: 0, end: false });
let R = fresh(), cmT;
function say(m) { const c = $('#comm'); c.textContent = m; c.classList.add('on'); clearTimeout(cmT); cmT = setTimeout(() => c.classList.remove('on'), 2800); }
function draw() {
  cx.clearRect(0, 0, W, H); cx.drawImage(T, 0, 0, W, H);
  const o = tw * .22; car(R.p2, iF, '#e8002d', -o, R.h2); car(R.p1, iM, '#ff8000', o, R.h1); cx.globalAlpha = 1;
}
function frame(ts) {
  if (!R.run) return;
  const dt = Math.min(.05, (ts - R.last) / 1e3 || .016); R.last = ts; R.t += dt;
  const boost = R.t < R.boostEnd ? .14 : 0, fer = R.t < R.fb ? .05 : 0;
  R.p1 += V * (1 + .03 * Math.sin(R.t * .9 + 2.2) + boost) * dt; R.p2 += V * (1 + .03 * Math.sin(R.t * .9) + fer) * dt;
  if (R.p1 - R.p2 > .012 && R.t > R.fb + 3) { R.fb = R.t + 1.4; say('FERRARI RESPONDE! ❤️'); }
  if (Math.max(R.p1, R.p2) > L - .2) { const k = Math.min(1, dt * 3.2), mid = (R.p1 + R.p2) / 2; R.p1 += (mid - R.p1) * k; R.p2 += (mid - R.p2) * k; }
  const lead = R.p1 > R.p2 ? 1 : 2, lap = Math.min(L, Math.floor(Math.max(R.p1, R.p2)) + 1);
  if (lead !== R.lead && Math.abs(R.p1 - R.p2) > .003) { R.lead = lead; say(lead === 1 ? 'ULTRAPASSAGEM! McLaren na frente 🧡' : 'Ferrari retoma a liderança ❤️'); tone(700, .15, 'square', .06); }
  if (lap !== R.lap) { R.lap = lap; $('#lap').textContent = lap; if (lap > 1) say(lap === L ? 'ÚLTIMA VOLTA! 🔥 Vai ser na fotografia' : 'VOLTA ' + lap + ' · disputa roda a roda'); }
  if (++R.n % 4 === 0) {
    const s = (R.p1 < 0 ? 0 : R.p1) * tot, d = tw * 1.4, cur = Math.abs(Math.atan2(Math.sin(ang(s + d) - ang(s - d)), Math.cos(ang(s + d) - ang(s - d))));
    R.spd += (Math.max(90, 335 - cur * 260) * (boost ? 1.04 : 1) - R.spd) * .3; const sp = Math.round(R.spd);
    $('#spd').textContent = sp; $('#gear').textContent = sp < 110 ? 2 : sp < 150 ? 3 : sp < 190 ? 4 : sp < 230 ? 5 : sp < 270 ? 6 : sp < 305 ? 7 : 8;
    $('#rpm').style.width = (45 + 55 * ((sp % 38) / 38)) + '%'; eng && eng.frequency.setTargetAtTime(60 + sp * .9, ac.currentTime, .1);
    const p = R.t < R.boostEnd ? (R.boostEnd - R.t) / 2.2 * 100 : R.t < R.ready ? (1 - (R.ready - R.t) / 4.8) * 100 : 100; $('#drs').style.setProperty('--p', Math.max(0, p) + '%');
  }
  if (ts - R.tw > 150) {
    R.tw = ts; const gap = (Math.abs(R.p1 - R.p2) * 15).toFixed(2), a = R.p1 > R.p2;
    $('#r1').style.order = a ? 0 : 1; $('#r2').style.order = a ? 1 : 0; $('#p1').textContent = a ? 1 : 2; $('#p2').textContent = a ? 2 : 1;
    $('#g1').textContent = a ? 'LÍDER' : '+' + gap; $('#g2').textContent = a ? '+' + gap : 'LÍDER';
  }
  draw();
  if (R.p1 >= L && R.p2 >= L) finish(); else requestAnimationFrame(frame);
}
async function finish() {
  R.run = false; engOff(); noise(.5, .2); tone(1200, .5, 'sawtooth', .1); $('#photo').classList.add('show'); await sleep(2400); $('#go4').classList.remove('hid');
}
function drs() {
  if (!R.run || R.t < R.ready) return;
  R.boostEnd = R.t + 2.2; R.ready = R.t + 7; tone(300, .5, 'sawtooth', .1, 600); say('DRS ABERTO! 🧡 McLaren ataca');
}
$('#drs').onclick = drs; cv.addEventListener('pointerdown', drs);
addEventListener('keydown', e => { if (e.code === 'Space' && cur === 4) { e.preventDefault(); drs(); } });
addEventListener('resize', () => { if (cur === 4) { build(); draw(); } });
init[4] = async () => {
  build(); R = fresh(); $('#photo').classList.remove('show'); $('#go4').classList.add('hid'); $('#lap').textContent = 1; draw();
  const cd = $('#cd');
  for (const t of ['3', '2', '1', 'GO!']) { cd.textContent = t; pop(cd); tone(t === 'GO!' ? 900 : 500, t === 'GO!' ? .5 : .15, 'square', .1); await sleep(800); }
  cd.textContent = ''; R.run = true; R.last = performance.now(); R.lap = 1; engOn(); say('LARGADA! 🏁 Toque na tela ou no DRS para atacar'); requestAnimationFrame(frame);
};
$('#go4').onclick = () => go(5);

const VT = 'Após analisar todas as evidências, a FIA decidiu que a piloto da Ferrari deverá cumprir uma penalidade obrigatória: receber uma mensagem de boa noite extremamente especial de um piloto da McLaren.';
$('#go5a').onclick = async () => {
  $('#go5a').classList.add('hid'); $('#vt').textContent = 'DECISÃO EM INSTANTES…'; const c = $('#count');
  for (let i = 5; i >= 1; i--) { c.textContent = i; pop(c); pop($('#s5'), 'shake'); noise(.1, .12); tone(300 + (5 - i) * 90, .25, 'square', .12); await sleep(950); }
  c.textContent = ''; $('#vt').textContent = 'VEREDITO'; noise(.5, .2); tone(150, .6, 'sawtooth', .15);
  $('#vc').classList.remove('hid'); await type($('#vp'), VT, 22); $('#go5').classList.remove('hid');
};
$('#go5').onclick = () => go(6);

const bars = $('#bars'); for (let i = 0; i < 16; i++) { const b = document.createElement('i'); b.style.animationDelay = (-i * .07) + 's'; b.style.animationDuration = (.3 + (i % 5) * .08) + 's'; bars.appendChild(b); }
const RS = [['E', 'Piloto, está na escuta?'], ['P', 'Na escuta.'], ['E', 'Temos uma última missão antes de encerrar o expediente.'], ['P', 'Qual seria?'], ['E', 'Desejar uma boa noite à piloto mais bonita de todo o grid.']];
const ptt = $('#ptt'), wait = lb => new Promise(r => { ptt.textContent = lb; ptt.classList.remove('hid'); ptt.onclick = () => { ptt.classList.add('hid'); blip(); r(); }; });
async function speak(w, t) {
  const log = $('#log'), m = document.createElement('div'); m.className = 'm ' + w; m.innerHTML = '<small>' + (w === 'E' ? 'ENGENHEIRO' : 'PILOTO · McLAREN') + '</small><span></span>'; log.appendChild(m);
  $('#radio').classList.add('talk'); blip(); await type(m.lastChild, t, 32); blip(); $('#radio').classList.remove('talk'); log.scrollTop = 1e5;
}
init[6] = async () => {
  if (init[6].d) return; init[6].d = 1; await sleep(700);
  for (const [w, t] of RS) { if (w === 'P') await wait('🎙️ PUSH TO TALK · responder'); else await sleep(600); await speak(w, t); }
  await sleep(500); await wait('🎙️ TRANSMITIR BOA NOITE'); go(7);
};

const FL = ['Antes de encerrar o expediente…', 'eu precisava te contar uma coisa:', 'você foi a minha melhor volta rápida do dia.', 'Hoje eu abro mão da pole, da vitória e até do pódio,', 'só pra ter a chance de te desejar uma boa noite.', 'Bom descanso, e amanhã eu apareço pra te pertubar um tekinho maiskkk. 🧡'];
init[7] = async () => {
  if (init[7].d) return; init[7].d = 1; const fm = $('#fm'); await sleep(900);
  for (const t of FL) { $$('#fm p').forEach(p => p.classList.add('old')); const p = document.createElement('p'); p.textContent = t; fm.appendChild(p); await sleep(60); p.classList.add('on'); tone(520 + Math.random() * 300, .6, 'sine', .05); await sleep(2300); }
  const b = document.createElement('p'); b.className = 'big'; b.textContent = 'Boa noite, gatonaaaaaa. ❤️🏎️'; fm.appendChild(b); await sleep(60); b.classList.add('on'); $('#road').classList.add('on');
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 1.4, 'sine', .08), i * 160)); await sleep(2500); $('#re').classList.remove('hid');
};
$('#re').onclick = () => location.reload();
(() => {
  const c = $('#fc'), x = c.getContext('2d'); let w, h; const P = [], col = ['#ff8000', '#e8002d', '#ffffff', '#ffb066'];
  const rs = () => { w = c.width = innerWidth; h = c.height = innerHeight; }; rs(); addEventListener('resize', rs);
  (function loop() {
    x.clearRect(0, 0, w, h);
    if (cur === 7) {
      if (Math.random() < .25 && P.length < 90) P.push({ x: rnd(0, w), y: h + 10, vy: -rnd(.6, 1.8), vx: rnd(-.3, .3), s: rnd(10, 26), c: col[Math.random() * 4 | 0], ch: Math.random() < .7 ? '♥' : '✦' });
      for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.x += p.vx + Math.sin(p.y / 40) * .3; p.y += p.vy; if (p.y < -20) { P.splice(i, 1); continue; } x.globalAlpha = .7; x.fillStyle = p.c; x.font = p.s + 'px sans-serif'; x.fillText(p.ch, p.x, p.y); }
    }
    requestAnimationFrame(loop);
  })();
})();
})();
