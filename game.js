import { Game, BIOMES, W, H } from './engine.js';

const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let clock = 0, last = 0, accumulator = 0, audio, sound = false;
const bellSVG = '<svg viewBox="0 0 20 24" fill="none" aria-hidden="true"><path d="M7 4a3 3 0 0 1 6 0M4 10a6 6 0 0 1 12 0v5l2 3H2l2-3z" stroke="currentColor" stroke-width="1.5"/><path d="M8 21h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const motion = () => reduced ? 0 : clock;

function tone(kind) {
  if (!sound || !audio) return;
  const osc = audio.createOscillator(), gain = audio.createGain();
  const pitches = { flip: 190, catch: 115, rail: 280, hit: 340, collect: 740, portal: 110, spirit: 880, bell: 1046, lost: 100, shield: 920, checkpoint: 660, mandala: 510, 'gate-wait': 180 };
  const pitch = pitches[kind] || 430;
  osc.frequency.setValueAtTime(pitch, audio.currentTime); osc.frequency.exponentialRampToValueAtTime(pitch * (kind === 'lost' ? .65 : 1.35), audio.currentTime + .16);
  osc.type = kind === 'flip' ? 'triangle' : 'sine'; gain.gain.setValueAtTime(.045, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .27);
  osc.connect(gain); gain.connect(audio.destination); osc.start(); osc.stop(audio.currentTime + .28);
}
function overlay(title, text, button, hint = 'TAP A FLIPPER AT CONTACT') {
  $('overlayTitle').innerHTML = title; $('overlayText').textContent = text;
  $('playButton').innerHTML = button + ' <span>↗</span>'; $('overlayHint').textContent = hint; $('overlay').hidden = false;
}
const game = new Game(event => {
  tone(event.type);
  if (event.type === 'gameover') overlay('Rest, then<br>return.', 'Your checkpoint is safe.', 'Continue');
  if (event.type === 'summit') overlay('Another<br>universe.', 'A familiar bark carries on.', 'Follow it', 'CONTINUE WHEN YOU WANT TO');
});
window.meowltiverse = game;
if (game.savedCheckpoint) overlay('Lost in<br>Meowltiverse', 'Your quiet checkpoint is ready.', 'Continue');
function resize() { const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
resize(); window.addEventListener('resize', resize);

function circle(x, y, r, fill, stroke, width = 1) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); } }
function line(x, y, ex, ey, color, width = 1) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke(); }
function star(x, y, r, color) { ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, radius = i % 2 ? r * .3 : r; ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius); } ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.restore(); }
function paw(x, y, size, color) { ctx.save(); ctx.translate(x, y); ctx.rotate(-.2); ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0, 3 * size, 4 * size, 3 * size, 0, 0, 7); ctx.fill(); for (let i = 0; i < 3; i++) circle((i - 1) * 3.8 * size, -2 * size - Math.sin(i * Math.PI / 2) * 2 * size, 1.7 * size, color); ctx.restore(); }
function cat(x, y, r, evil = false) {
  const bio = BIOMES[game.biome], tide = game.room?.kind === 'tide' || bio.rhythm === 'flow';
  ctx.save(); ctx.translate(x, y); ctx.shadowBlur = evil ? 14 : 20; ctx.shadowColor = evil ? '#e679d7' : bio.color;
  const grad = ctx.createRadialGradient(-r * .4, -r * .5, 1, 0, 0, r); grad.addColorStop(0, evil ? '#bc75cb' : '#effff5'); grad.addColorStop(.55, evil ? '#563263' : tide ? '#76d9e6' : bio.color); grad.addColorStop(1, evil ? '#2c173b' : tide ? '#2e7896' : '#5d8392');
  ctx.beginPath(); ctx.moveTo(-r * .8, -r * .25); ctx.lineTo(-r * .9, -r * 1.1); ctx.lineTo(-r * .28, -r * .8); ctx.quadraticCurveTo(0, -r, r * .32, -r * .8); ctx.lineTo(r * .9, -r * 1.1); ctx.lineTo(r * .8, -r * .25); ctx.arc(0, 0, r, -.25, Math.PI + .25); ctx.closePath(); ctx.fillStyle = grad; ctx.fill(); ctx.strokeStyle = evil ? '#e89cde' : '#d5ffe9'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.shadowBlur = 0;
  ctx.strokeStyle = evil ? '#ffb7db' : '#263e47'; ctx.lineWidth = 1.7; ctx.lineCap = 'round'; for (const sign of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sign * r * .26 - r * .13, -r * .12); ctx.lineTo(sign * r * .26 + r * .13, -r * .12 + (evil ? sign * 2 : 0)); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-2, r * .25); ctx.quadraticCurveTo(0, r * .4, 2, r * .25); ctx.stroke(); if (!evil) circle(0, r + 2, 2.5, '#f4d189'); ctx.restore();
}
function portal(x, y, r, kind) {
  const color = kind === 'tide' ? '#83eee4' : kind === 'exit' ? '#f4d28f' : '#e5a3ff', t = motion();
  ctx.save(); ctx.translate(x, y); ctx.shadowBlur = 20; ctx.shadowColor = color; ctx.scale(.82, 1.1); circle(0, 0, r, '#130d2d', color, 2); ctx.shadowBlur = 0;
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.rotate(t * .35 + i * .5); ctx.beginPath(); ctx.ellipse(0, 0, r * (.28 + i * .16), r * .8, 0, 0, 7); ctx.strokeStyle = color + (i === 3 ? '70' : '35'); ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
  star(0, 0, 10, color); ctx.restore();
}
function mandala(x, y, r, phase = 0) {
  const bio = BIOMES[game.biome], t = motion(); ctx.save(); ctx.translate(x, y); ctx.shadowBlur = 18; ctx.shadowColor = bio.accent;
  for (let ring = 0; ring < 3; ring++) circle(0, 0, r * (1 - ring * .22), null, bio.accent + (ring === 0 ? '90' : '45'), 1.2);
  for (let i = 0; i < 12; i++) { const a = phase + t * .55 + i * Math.PI / 6; ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(r * .55, 0, r * .24, r * .1, 0, 0, 7); ctx.fillStyle = bio.color + '52'; ctx.fill(); ctx.restore(); }
  ctx.shadowBlur = 0; star(0, 0, 8, bio.color); ctx.restore();
}
function gate(x, y, r, phase = 0) {
  const bio = BIOMES[game.biome], open = Math.sin(motion() * 3.2 + phase) > .05, color = open ? bio.color : '#a77daa';
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha = open ? 1 : .55; circle(0, 0, r + 5, null, color + '50', 1);
  for (const side of [-1, 1]) { ctx.beginPath(); ctx.arc(side * r * .45, 0, r * .55, -Math.PI * .65, Math.PI * .65); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke(); } line(-r * .6, 0, r * .6, 0, color, open ? 2 : 5); ctx.restore();
}
function flow(x, y, w, h, dir) {
  const bio = BIOMES[game.biome], t = motion(); ctx.save(); ctx.beginPath(); ctx.roundRect(x, y - h, w, h, 18); ctx.fillStyle = bio.color + '10'; ctx.fill(); ctx.clip();
  for (let row = 0; row < 4; row++) { const yy = y - h + 18 + row * (h - 30) / 3; ctx.beginPath(); for (let px = x - 15; px < x + w + 20; px += 12) ctx.lineTo(px, yy + (reduced ? 0 : Math.sin(px / 34 + t * 2.2 + row) * 8)); ctx.strokeStyle = bio.color + '53'; ctx.lineWidth = row === 1 ? 2 : 1; ctx.stroke(); } ctx.restore();
}
function drawGuards(sy) { const bio = BIOMES[game.biome]; for (const guard of game.guards()) { line(guard.a.x, sy(guard.a.y), guard.b.x, sy(guard.b.y), '#172536', 17); line(guard.a.x, sy(guard.a.y), guard.b.x, sy(guard.b.y), bio.color + 'cc', 5); line(guard.a.x, sy(guard.a.y) - 2, guard.b.x, sy(guard.b.y) - 2, '#f4fff1aa', 1); } }
function background() {
  const bio = BIOMES[game.biome], room = game.room, t = motion(), bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, room?.kind === 'tide' ? '#124b56' : bio.bg); bg.addColorStop(.58, room?.kind === 'time' ? '#4a294c' : bio.mid); bg.addColorStop(1, bio.low); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) { const x = (Math.sin(i * 127.1) * 43758.5453 % 1 + 1) % 1 * W, y = ((i * 97.3 + game.camera * .16) % H); circle(x, H - y, i % 9 === 0 ? 1.4 : .65, 'rgba(235,224,255,' + (.12 + .18 * Math.sin(t * .8 + i)) + ')'); }
  const offset = (game.camera * .23) % 850; for (let i = -1; i < 2; i++) { const y = 180 + i * 850 + offset; ctx.save(); ctx.translate(340, y); ctx.rotate(-.6 + t * .06); ctx.scale(1, .62); for (let ring = 0; ring < 6; ring++) circle(0, 0, 65 + ring * 12, null, bio.accent + '18'); ctx.restore(); circle(334, y, 46, bio.accent + '0b'); }
  for (let side = 0; side < 2; side++) { ctx.save(); if (side) { ctx.translate(W, 0); ctx.scale(-1, 1); } ctx.fillStyle = '#0d102377'; ctx.beginPath(); ctx.moveTo(0, 0); for (let y = 0; y <= H; y += 20) ctx.lineTo(20 + Math.sin(y / 65 + (reduced ? 0 : game.camera / 270)) * 11, y); ctx.lineTo(0, H); ctx.fill(); for (let i = 0; i < 7; i++) { const y = (i * 122 + game.camera * .35) % 900 - 70; ctx.beginPath(); ctx.moveTo(10, y + 95); ctx.bezierCurveTo(75, y + 60, 59, y + 25, 37, y); ctx.bezierCurveTo(32, y + 48, 14, y + 52, 10, y + 95); ctx.fillStyle = bio.accent + '10'; ctx.fill(); ctx.strokeStyle = bio.accent + '2d'; ctx.stroke(); } ctx.restore(); }
  for (let i = 0; i < 5; i++) { const y = H - ((i * 165 + 100 - game.camera) % 825 + 825) % 825; paw(200 + Math.sin(i * 2) * 55, y, .55, '#e5c98d38'); }
}
function draw() {
  ctx.clearRect(0, 0, W, H); ctx.save(); if (!reduced && game.shake > 1) ctx.translate(Math.sin(clock * 120) * game.shake * .4, Math.cos(clock * 95) * game.shake * .3); background();
  const bio = BIOMES[game.biome], sy = y => H - (y - game.camera); drawGuards(sy);
  for (const o of game.objects) {
    const y = sy(o.y); if (o.dead || y < -110 || y > H + 110) continue; let x = o.x, pulse = 1 + Math.sin(motion() * 2 + o.y) * .04;
    if (o.type === 'flow') { flow(o.x, sy(o.y + o.h), o.w, o.h, o.dir); continue; }
    if (o.type === 'bumper') { ctx.save(); ctx.translate(x, y); ctx.rotate(motion() * .12); circle(0, 0, o.r + 8, null, bio.accent + '30'); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; circle(Math.cos(a) * (o.r + 8), Math.sin(a) * (o.r + 8), 2, bio.accent + '99'); } ctx.shadowBlur = o.cool > 0 ? 30 : 10; ctx.shadowColor = bio.color; circle(0, 0, o.r * pulse, bio.color + '16', bio.color + 'aa', 1.5); circle(0, 0, o.r - 7, '#231b39', bio.color + '40'); star(0, 0, 10, bio.color); ctx.restore(); }
    if (o.type === 'mandala') mandala(x, y, o.r, o.phase); if (o.type === 'gate') gate(x, y, o.r, o.phase); if (o.type === 'star') star(x, y, 6 + Math.sin(motion() * 3 + o.y), '#f3d592'); if (o.type === 'portal' && !o.used) portal(x, y, o.r, o.kind); if (o.type === 'exit') portal(x, y, o.r, 'exit');
    if (o.type === 'rail') { ctx.save(); ctx.lineCap = 'round'; line(x, y, x + o.w, y - o.w * o.slant * .28, '#27374c', 15); line(x, y - 2, x + o.w, y - o.w * o.slant * .28 - 2, bio.accent + 'd0', 2); for (let i = 0; i < 3; i++) star(x + 15 + i * 22, y - (15 + i * 22) * o.slant * .28, 3, bio.accent); ctx.restore(); }
    if (o.type === 'cat') { x += Math.sin(game.time * 1.3 + o.y) * 28; circle(x, y, 34, null, '#ef90dd22'); cat(x, y, 21, true); for (let i = 0; i < 2 - o.hits; i++) circle(x - 4 + i * 8, y + 32, 2.3, '#efb8de'); }
    if (o.type === 'bell') { circle(x, y, 17, null, '#f3d59240'); ctx.fillStyle = '#f3d592'; ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.fillText('♧', x, y + 7); }
  }
  for (let side = 0; side < 2; side++) { const f = game.flipper(side), y = sy(f.y), ey = sy(f.ey), charged = game.tapWindow[side] > 0; ctx.lineCap = 'round'; ctx.shadowColor = bio.color; ctx.shadowBlur = game.input[side] ? 24 : 8; line(f.x, y, f.ex, ey, '#3f5d68', 22); line(f.x, y - 2, f.ex, ey - 2, charged ? '#fff5cc' : game.input[side] ? '#dcffe9' : '#b9e8d9', 15); ctx.shadowBlur = 0; line(f.x, y - 5, f.ex, ey - 5, '#f0fff688', 2); circle(f.x, y, 7, '#1c2838', '#ccffea', 1); circle(f.x, y, 2, bio.color); }
  const b = game.ball; for (let i = b.trail.length - 1; i >= 0; i--) { const p = b.trail[i]; circle(p.x, sy(p.y), b.r * (1 - i / 24) * .8, bio.color + Math.floor((1 - i / 23) * 35).toString(16).padStart(2, '0')); } cat(b.x, sy(b.y), b.r);
  for (const p of game.particles) { ctx.globalAlpha = Math.max(0, p.life); star(p.x, sy(p.y), 3 * p.life, p.color); } ctx.globalAlpha = 1; if (game.state === 'ready') { mandala(210, 222, 42, 0); portal(92, 278, 30, 'tide'); cat(295, 206, 19); } ctx.restore();
}
let lastUI = '';
function ui() {
  const signature = [game.lives, Math.floor(game.maxHeight / 10), game.biome, game.room?.kind].join('|'); if (signature === lastUI) return; lastUI = signature;
  $('bells').innerHTML = Array.from({ length: 7 }, (_, i) => '<span class="bell ' + (i >= game.lives ? 'lost' : '') + '">' + bellSVG + '</span>').join(''); $('bells').setAttribute('aria-label', game.lives + ' lives remaining'); $('height').innerHTML = String(Math.floor(game.maxHeight / 10)).padStart(4, '0') + '<span> m</span>';
  $('biomeName').textContent = game.room ? (game.room.kind === 'tide' ? 'LIQUID MOON' : 'THE HOURS BETWEEN') : BIOMES[game.biome].name; $('biomeDot').style.background = BIOMES[game.biome].color;
}
function frame(now) { const dt = Math.min((now - last) / 1000 || 0, .05); last = now; clock += dt; accumulator += dt; while (accumulator >= 1 / 120) { game.step(1 / 120); accumulator -= 1 / 120; } draw(); ui(); requestAnimationFrame(frame); }
requestAnimationFrame(frame);
function clearInput() { game.input = [false, false]; document.querySelectorAll('.touch-controls button').forEach(el => el.classList.remove('active')); }
function pause() { if (game.state === 'playing') { game.state = 'paused'; clearInput(); overlay('Paused', 'Your checkpoint is safe.', 'Resume'); } else if (game.state === 'paused') { game.state = 'playing'; $('overlay').hidden = true; } }
$('playButton').onclick = () => { if (audio?.state === 'suspended') audio.resume(); if (game.state === 'ready') game.start(); else if (game.state === 'gameover') game.continueCheckpoint(); else if (game.state === 'summit') game.continueEndless(); else if (game.state === 'paused') game.state = 'playing'; $('overlay').hidden = true; };
const keys = new Map([['ArrowLeft', 0], ['ArrowRight', 1], ['a', 0], ['d', 1]]);
window.addEventListener('keydown', event => { if (keys.has(event.key)) { event.preventDefault(); game.input[keys.get(event.key)] = true; } if (!event.repeat && (event.key === 'p' || event.key === 'Escape')) pause(); });
window.addEventListener('keyup', event => { if (keys.has(event.key)) game.input[keys.get(event.key)] = false; });
const pointers = new Map(); function syncPointers() { for (let i = 0; i < 2; i++) { game.input[i] = [...pointers.values()].includes(i); $(i ? 'rightControl' : 'leftControl').classList.toggle('active', game.input[i]); } }
$('gameFrame').addEventListener('pointerdown', event => { if (game.state !== 'playing' || event.target.closest('.overlay')) return; event.preventDefault(); const box = canvas.getBoundingClientRect(), side = event.clientX < box.left + box.width / 2 ? 0 : 1; pointers.set(event.pointerId, side); $('gameFrame').setPointerCapture(event.pointerId); syncPointers(); });
for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) $('gameFrame').addEventListener(event, e => { pointers.delete(e.pointerId); syncPointers(); });
window.addEventListener('blur', () => { pointers.clear(); clearInput(); if (game.state === 'playing') pause(); }); document.addEventListener('visibilitychange', () => { if (document.hidden && game.state === 'playing') pause(); });
