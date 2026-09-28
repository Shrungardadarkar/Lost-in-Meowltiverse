import { POCKETS, CHAMBER_NAMES } from './chambers.js';
import { drawLivingObject, drawMaterial } from './living-art.js';
import { Game, BIOMES, W, H, gateIsOpen, mandalaSpin } from './engine.js';

const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('reduced');
let clock = 0, last = 0, accumulator = 0, audio, sound = false, pausedState = 'playing', lastTone = -1;
const query = new URLSearchParams(location.search);
let cinema = { punch: 0, flash: 0, kind: '', x: 210, y: 380, side: 0 };
const bellSVG = '<svg viewBox="0 0 20 24" fill="none" aria-hidden="true"><path d="M7 4a3 3 0 0 1 6 0M4 10a6 6 0 0 1 12 0v5l2 3H2l2-3z" stroke="currentColor" stroke-width="1.5"/><path d="M8 21h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const motion = () => reduced ? 0 : clock;

function tone(kind, value) {
  if (!sound || !audio) return;
  if (audio.currentTime - lastTone < .035) return;
  lastTone = audio.currentTime;
  if (kind === 'chain' || kind === 'spirit' || kind === 'multiverse') {
    const roots = [220, 196, 246.94], scale = [0, 3, 7, 10, 12];
    const count = Math.min(4, value?.count ?? 3);
    for (let i = 0; i < count; i++) { const osc = audio.createOscillator(), gain = audio.createGain(), at = audio.currentTime + i * .11; osc.type = game.biome === 1 ? 'sine' : 'triangle'; osc.frequency.value = roots[game.biome] * 2 ** (scale[i] / 12); gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(.025, at + .012); gain.gain.exponentialRampToValueAtTime(.001, at + .3); osc.connect(gain); gain.connect(audio.destination); osc.start(at); osc.stop(at + .32); }
    return;
  }
  const osc = audio.createOscillator(), gain = audio.createGain();
  const pitches = { flip: 190, catch: 115, release: 250, pass: 330, rail: 280, hit: 340, resonance: 570, 'rescue-boundary': 205, collect: 740, portal: 110, spirit: 880, rescue: 610, booster: 960, bell: 1046, lost: 100, shield: 920, checkpoint: 660, mandala: 510, 'gate-wait': 180, 'prologue-target': 480, 'ceiling-ready': 720, 'ceiling-break': 92, multiverse: 660 };
  const pitch = pitches[kind] || 430;
  osc.frequency.setValueAtTime(pitch, audio.currentTime); osc.frequency.exponentialRampToValueAtTime(pitch * (kind === 'lost' ? .65 : 1.35), audio.currentTime + .16);
  osc.type = kind === 'flip' ? 'triangle' : 'sine'; gain.gain.setValueAtTime(.045, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .27);
  osc.connect(gain); gain.connect(audio.destination); osc.start(); osc.stop(audio.currentTime + .28);
}
function overlay(title, text, button, hint = 'TAP A FLIPPER AT CONTACT') {
  $('overlayTitle').innerHTML = title; $('overlayText').textContent = text;
  $('playButton').innerHTML = button + ' <span>↗</span>'; $('overlayHint').textContent = hint; $('pauseOptions').hidden = true; $('overlay').hidden = false; $('playButton').focus();
}
function cue(event) {
  if (reduced) return;
  const kinetic = { perfect: .18, route: .15, resonance: .11, mandala: .13, portal: .25, transfer: .22, spirit: .2, hit: .08, 'prologue-target': .1, 'ceiling-ready': .16, 'ceiling-break': .24, multiverse: .18 }[event.type];
  if (!kinetic) return;
  cinema = { punch: kinetic, flash: event.type === 'portal' ? .28 : kinetic * .45, kind: event.type, x: event.value?.x ?? game?.ball.x ?? 210, y: event.value?.y ?? game?.ball.y ?? 380, side: event.value?.side ?? 0 };
}
let savedAdaptation = false;
try { savedAdaptation = localStorage.getItem('lost-in-meowltiverse.adaptation.v1') === 'on'; } catch { /* optional local setting */ }
const freshPreview = new URLSearchParams(location.search).has('fresh');
const game = new Game(event => {
  tone(event.type, event.value);
  cue(event);
  if (event.type === 'gameover') overlay('Rest, then<br>return.', 'Your checkpoint is safe.', 'Continue');
}, { adaptationEnabled: savedAdaptation, ignoreSave: freshPreview || query.has('dev'), previewTable: query.has('dev') && query.has('table') ? Number(query.get('table')) : null, previewPocket: query.has('dev') ? query.get('pocket') : null });
window.meowltiverse = game;
const debugTrace = new URLSearchParams(location.search).has('dev') ? [] : null;
if (debugTrace) window.meowltiverseDebug = { getReplay: () => ({ seed: game.worldSeed, version: game.generatorVersion, checkpoint: game.savedCheckpoint, previewTable: game.previewTable, previewPocket: game.previewPocket, adaptationEnabled: savedAdaptation, inputs: [...debugTrace] }) };
if (game.savedCheckpoint) overlay('Lost in<br>Meowltiverse', 'Your quiet checkpoint is ready.', 'Continue');
function resize() { const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
resize(); window.addEventListener('resize', resize);

function circle(x, y, r, fill, stroke, width = 1) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); } }
function line(x, y, ex, ey, color, width = 1) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke(); }
function star(x, y, r, color) { ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, radius = i % 2 ? r * .3 : r; ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius); } ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.restore(); }
function paw(x, y, size, color) { ctx.save(); ctx.translate(x, y); ctx.rotate(-.2); ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0, 3 * size, 4 * size, 3 * size, 0, 0, 7); ctx.fill(); for (let i = 0; i < 3; i++) circle((i - 1) * 3.8 * size, -2 * size - Math.sin(i * Math.PI / 2) * 2 * size, 1.7 * size, color); ctx.restore(); }
function cat(x, y, r, evil = false, stretch = 1) {
  const bio = BIOMES[game.biome], tide = game.room?.kind === 'tide' || bio.rhythm === 'flow';
  ctx.save(); ctx.translate(x, y); ctx.scale(1 / stretch, stretch); ctx.shadowBlur = evil ? 14 : 20; ctx.shadowColor = evil ? '#e679d7' : bio.color;
  const grad = ctx.createRadialGradient(-r * .4, -r * .5, 1, 0, 0, r); grad.addColorStop(0, evil ? '#bc75cb' : '#effff5'); grad.addColorStop(.55, evil ? '#563263' : tide ? '#76d9e6' : bio.color); grad.addColorStop(1, evil ? '#2c173b' : tide ? '#2e7896' : '#5d8392');
  ctx.beginPath(); ctx.moveTo(-r * .8, -r * .25); ctx.lineTo(-r * .9, -r * 1.1); ctx.lineTo(-r * .28, -r * .8); ctx.quadraticCurveTo(0, -r, r * .32, -r * .8); ctx.lineTo(r * .9, -r * 1.1); ctx.lineTo(r * .8, -r * .25); ctx.arc(0, 0, r, -.25, Math.PI + .25); ctx.closePath(); ctx.fillStyle = grad; ctx.fill(); ctx.strokeStyle = evil ? '#e89cde' : '#d5ffe9'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.shadowBlur = 0;
  ctx.strokeStyle = evil ? '#ffb7db' : '#263e47'; ctx.lineWidth = 1.7; ctx.lineCap = 'round'; for (const sign of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sign * r * .26 - r * .13, -r * .12); ctx.lineTo(sign * r * .26 + r * .13, -r * .12 + (evil ? sign * 2 : 0)); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-2, r * .25); ctx.quadraticCurveTo(0, r * .4, 2, r * .25); ctx.stroke(); if (!evil) circle(0, r + 2, 2.5, '#f4d189'); ctx.restore();
}
function portal(x, y, r, kind) {
  const color = kind === 'tide' ? '#83eee4' : kind === 'exit' ? '#f4d28f' : '#e5a3ff', t = motion();
  ctx.save(); ctx.translate(x, y); ctx.shadowBlur = 20; ctx.shadowColor = color; ctx.scale(.82, 1.1); circle(0, 0, r, '#130d2d', color, 2); ctx.shadowBlur = 0;
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.rotate(t * .35 + i * .5); ctx.beginPath(); ctx.ellipse(0, 0, r * (.28 + i * .16), r * .8, 0, 0, 7); ctx.strokeStyle = color + (i === 3 ? '70' : '35'); ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
  star(0, 0, 10, color);
  if (POCKETS[kind]) { ctx.font = '600 8px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = color; ctx.fillText(POCKETS[kind].cue, 0, r + 15); }
  if (kind === 'tide') { for (const offset of [-12, 0, 12]) line(-r + 9, offset, -r + 20, offset - 4, color, 1.5); }
  if (kind === 'time') { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; line(Math.cos(a) * (r - 4), Math.sin(a) * (r - 4), Math.cos(a) * (r + 3), Math.sin(a) * (r + 3), color, 1.5); } }
  ctx.restore();
}
function transferScoop(x, y, r, open) {
  const bio = BIOMES[game.biome], color = open ? bio.color : '#786379';
  ctx.save(); ctx.translate(x, y); ctx.shadowBlur = open ? 24 : 0; ctx.shadowColor = color;
  circle(0, 0, r + 8, open ? color + '22' : '#171226aa', color + (open ? 'dd' : '68'), 2);
  circle(0, 0, r, open ? '#10182a' : '#1b1426', color + (open ? 'ff' : '88'), 2);
  if (open) { for (let i = 0; i < 5; i++) { const a = motion() * .8 + i * Math.PI * .4; line(Math.cos(a) * 7, Math.sin(a) * 7, Math.cos(a) * (r - 6), Math.sin(a) * (r - 6), color, 1.5); } star(0, 0, 9, color); }
  else { line(-11, -2, 11, -2, color, 2); line(-8, 7, 8, 7, color, 2); }
  ctx.restore();
}
function mandala(x, y, r, phase = 0) {
  const bio = BIOMES[game.biome], t = motion(); ctx.save(); ctx.translate(x, y); ctx.shadowBlur = 18; ctx.shadowColor = bio.accent;
  for (let ring = 0; ring < 3; ring++) circle(0, 0, r * (1 - ring * .22), null, bio.accent + (ring === 0 ? '90' : '45'), 1.2);
  for (let i = 0; i < 12; i++) { const a = phase + t * .55 + i * Math.PI / 6; ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(r * .55, 0, r * .24, r * .1, 0, 0, 7); ctx.fillStyle = bio.color + '52'; ctx.fill(); ctx.restore(); }
  ctx.shadowBlur = 0; star(0, 0, 8, bio.color); const direction = mandalaSpin(game.time, phase); line(-8, r * .58, 8, r * .58, bio.color, 2); line(direction * 8, r * .58, direction * 2, r * .58 - 5, bio.color, 2); ctx.restore();
}
function gate(x, y, r, phase = 0) {
  const bio = BIOMES[game.biome], open = gateIsOpen(game.time, phase), color = open ? bio.color : '#a77daa';
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha = open ? 1 : .55; circle(0, 0, r + 5, null, color + '50', 1);
  for (const side of [-1, 1]) { ctx.beginPath(); ctx.arc(side * r * .45, 0, r * .55, -Math.PI * .65, Math.PI * .65); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke(); } line(-r * .6, 0, r * .6, 0, color, open ? 2 : 5); ctx.restore();
}
function flow(x, y, w, h, dir) {
  const bio = BIOMES[game.biome], t = motion(); ctx.save(); ctx.beginPath(); ctx.roundRect(x, y - h, w, h, 18); ctx.fillStyle = bio.color + '10'; ctx.fill(); ctx.clip();
  for (let row = 0; row < 4; row++) { const yy = y - h + 18 + row * (h - 30) / 3; ctx.beginPath(); for (let px = x - 15; px < x + w + 20; px += 12) ctx.lineTo(px, yy + (reduced ? 0 : Math.sin(px / 34 + t * 2.2 + row) * 8)); ctx.strokeStyle = bio.color + '53'; ctx.lineWidth = row === 1 ? 2 : 1; ctx.stroke(); }
  for (let px = x + 45; px < x + w - 20; px += 82) { const tip = px + dir * 12; line(px - dir * 10, y - h * .5, tip, y - h * .5, bio.color + 'b0', 1.5); line(tip, y - h * .5, tip - dir * 6, y - h * .5 - 5, bio.color + 'b0', 1.5); line(tip, y - h * .5, tip - dir * 6, y - h * .5 + 5, bio.color + 'b0', 1.5); }
  ctx.restore();
}
function drawGuards(sy) { for (const side of [0, 1]) { const mirror = x => side ? W - x : x; line(mirror(63), sy(game.camera + 70), mirror(105), sy(game.camera + 94), '#9bdcc7', 5); } const bio = BIOMES[game.biome]; for (const guard of game.guards()) { line(guard.a.x, sy(guard.a.y), guard.b.x, sy(guard.b.y), '#172536', 17); line(guard.a.x, sy(guard.a.y), guard.b.x, sy(guard.b.y), bio.color + 'cc', 5); line(guard.a.x, sy(guard.a.y) - 2, guard.b.x, sy(guard.b.y) - 2, '#f4fff1aa', 1); } }
function drawDrain(sy) { const y = sy(game.camera + 42); ctx.save(); ctx.beginPath(); ctx.moveTo(158, y); ctx.lineTo(262, y); ctx.lineTo(242, y + 37); ctx.lineTo(178, y + 37); ctx.closePath(); ctx.fillStyle = '#060817aa'; ctx.fill(); ctx.strokeStyle = '#f3d59272'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.fillStyle = '#f3d592b8'; ctx.textAlign = 'center'; ctx.font = '8px "DM Sans", sans-serif'; ctx.fillText('CENTER DRAIN ↓', 210, y + 17); ctx.restore(); }
function drawTableFrame(sy) { const bio = BIOMES[game.biome], top = sy(game.camera + 742); ctx.save(); ctx.strokeStyle = bio.accent + '38'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(18, top + 60); ctx.quadraticCurveTo(28, top + 8, 82, top + 8); ctx.moveTo(W - 18, top + 60); ctx.quadraticCurveTo(W - 28, top + 8, W - 82, top + 8); ctx.stroke(); ctx.setLineDash([3, 8]); line(28, top + 34, W - 28, top + 34, bio.accent + '48', 1); ctx.setLineDash([]); ctx.restore(); }
function arcadeMode() { return game.prologue && !game.room; }
function classicCabinet() {
  const bg = ctx.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#180d19'); bg.addColorStop(.48, '#552544'); bg.addColorStop(1, '#120d20'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 18; i++) { const y = 25 + i * 48; line(24, y, W - 24, y - 24, '#f7bd9c12', 1); }
  ctx.save(); ctx.strokeStyle = '#f5ca8b65'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(20, H - 12); ctx.quadraticCurveTo(26, H * .5, 56, 22); ctx.moveTo(W - 20, H - 12); ctx.quadraticCurveTo(W - 26, H * .5, W - 56, 22); ctx.stroke(); ctx.strokeStyle = '#52233f'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(9, H); ctx.quadraticCurveTo(22, H * .47, 40, 0); ctx.moveTo(W - 9, H); ctx.quadraticCurveTo(W - 22, H * .47, W - 40, 0); ctx.stroke(); ctx.restore();
}
function background() {
  if (arcadeMode()) { classicCabinet(); return; }
  const bio = BIOMES[game.biome], room = game.room, t = motion(), bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, room?.kind === 'tide' ? '#124b56' : bio.bg); bg.addColorStop(.58, room?.kind === 'time' ? '#4a294c' : bio.mid); bg.addColorStop(1, bio.low); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) { const x = (Math.sin(i * 127.1) * 43758.5453 % 1 + 1) % 1 * W, y = ((i * 97.3 + game.camera * .16) % H); circle(x, H - y, i % 9 === 0 ? 1.4 : .65, 'rgba(235,224,255,' + (.12 + .18 * Math.sin(t * .8 + i)) + ')'); }
  const offset = (game.camera * .23) % 850; for (let i = -1; i < 2; i++) { const y = 180 + i * 850 + offset; ctx.save(); ctx.translate(340, y); ctx.rotate(-.6 + t * .06); ctx.scale(1, .62); for (let ring = 0; ring < 6; ring++) circle(0, 0, 65 + ring * 12, null, bio.accent + '18'); ctx.restore(); circle(334, y, 46, bio.accent + '0b'); }
  for (let side = 0; side < 2; side++) { ctx.save(); if (side) { ctx.translate(W, 0); ctx.scale(-1, 1); } ctx.fillStyle = '#0d102377'; ctx.beginPath(); ctx.moveTo(0, 0); for (let y = 0; y <= H; y += 20) ctx.lineTo(20 + Math.sin(y / 65 + (reduced ? 0 : game.camera / 270)) * 11, y); ctx.lineTo(0, H); ctx.fill(); for (let i = 0; i < 7; i++) { const y = (i * 122 + game.camera * .35) % 900 - 70; ctx.beginPath(); ctx.moveTo(10, y + 95); ctx.bezierCurveTo(75, y + 60, 59, y + 25, 37, y); ctx.bezierCurveTo(32, y + 48, 14, y + 52, 10, y + 95); ctx.fillStyle = bio.accent + '10'; ctx.fill(); ctx.strokeStyle = bio.accent + '2d'; ctx.stroke(); } ctx.restore(); }
  for (let i = 0; i < 5; i++) { const y = H - ((i * 165 + 100 - game.camera) % 825 + 825) % 825; paw(200 + Math.sin(i * 2) * 55, y, .55, '#e5c98d38'); }
}
function ceiling(x, y, r, ready) {
  const color = ready ? '#ffe08a' : '#c98378'; ctx.save(); ctx.translate(x, y); ctx.shadowBlur = ready ? 22 : 8; ctx.shadowColor = color;
  ctx.beginPath(); ctx.arc(0, 0, r, Math.PI * 1.08, Math.PI * 1.92); ctx.lineTo(r * .72, 24); ctx.quadraticCurveTo(0, 54, -r * .72, 24); ctx.closePath(); ctx.fillStyle = '#211425'; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = ready ? 3 : 2; ctx.stroke();
  for (let i = -2; i <= 2; i++) { const fromX = i * 22; line(fromX, 8, fromX + (i % 2 ? 14 : -12), 30, color + (ready ? 'dd' : '66'), ready ? 2 : 1); if (ready) line(fromX + (i % 2 ? 14 : -12), 30, fromX + i * 5, 45, color + '99', 1); }
  ctx.shadowBlur = 0; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.font = '700 10px "DM Sans", sans-serif'; ctx.fillText(ready ? 'BREAK THROUGH' : 'MIDNIGHT ARCADE', 0, 9); ctx.restore();
}
function transitionFx(sy) {
  const tr = game.transition; if (!tr || tr.kind !== 'cabinet') return; const p = Math.min(1, tr.elapsed / tr.duration), x = tr.x, y = sy(tr.y), burst = Math.max(0, Math.min(1, (p - .14) / .38));
  if (!reduced) {
    ctx.save(); ctx.globalAlpha = Math.min(1, burst * 1.4);
    for (let i = 0; i < 20; i++) { const a = i * Math.PI * 2 / 20 + .17, distance = 18 + burst * (64 + (i % 4) * 18); const sx = x + Math.cos(a) * distance, syy = y + Math.sin(a) * distance; ctx.save(); ctx.translate(sx, syy); ctx.rotate(a + burst * 2); ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(5, 7); ctx.lineTo(-5, 4); ctx.closePath(); ctx.fillStyle = i % 2 ? '#ffd59e' : '#d4a2ff'; ctx.fill(); ctx.restore(); }
    const vortex = Math.max(0, (p - .42) / .58); ctx.globalAlpha = vortex * .7; for (let ring = 0; ring < 5; ring++) circle(x, y, 28 + ring * 18 + vortex * 160, null, ring % 2 ? '#e9b9ff' : '#aef7d6', 2); ctx.restore();
  }
  const wash = Math.max(0, (p - .52) / .48); if (wash) { const grad = ctx.createRadialGradient(x, y, 4, x, y, Math.max(W, H) * wash); grad.addColorStop(0, '#d8b3ff' + Math.floor((reduced ? .36 : .18) * 255).toString(16).padStart(2, '0')); grad.addColorStop(1, '#21163f' + Math.floor(wash * .92 * 255).toString(16).padStart(2, '0')); ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H); }
}
function draw() {
  ctx.clearRect(0, 0, W, H); ctx.save(); const punch = cinema.punch;
  if (!reduced && punch > .001) { ctx.translate(W / 2, H / 2); ctx.rotate(Math.sin(clock * 95) * punch * .085); ctx.scale(1 + punch * .12, 1 + punch * .12); ctx.translate(-W / 2, -H / 2); }
  if (!reduced && game.shake > 1) ctx.translate(Math.sin(clock * 120) * game.shake * .4, Math.cos(clock * 95) * game.shake * .3);
  if (!reduced && game.transition) { const p = game.transition.elapsed / game.transition.duration, tremor = Math.sin(Math.min(1, p) * Math.PI) * 3.8; ctx.translate(Math.sin(clock * 72) * tremor, Math.cos(clock * 91) * tremor * .65); }
  background();
  const bio = BIOMES[game.biome], sy = y => H - (y - game.camera); drawGuards(sy); drawDrain(sy); drawTableFrame(sy);
  const rescueBoundary = game.activeRescueBoundary();
  if (rescueBoundary) { const y = sy(rescueBoundary.y); if (y > -20 && y < H + 20) { ctx.save(); ctx.setLineDash([9, 8]); line(28, y, W - 28, y, bio.accent + 'a8', 2); ctx.setLineDash([]); for (let i = 0; i < rescueBoundary.requiredHits - rescueBoundary.hits; i++) star(194 + i * 16, y, 4, bio.accent); ctx.restore(); } }
  for (const o of game.objects) {
    const y = sy(o.y); if (o.dead || o.hidden || (o.table !== undefined && o.table !== game.tableIndex && !game.transition) || (game.prologue && o.introPhase === 'multiverse') || (!game.prologue && o.introPhase === 'prologue') || y < -110 || y > H + 110) continue; let x = o.x, pulse = 1 + Math.sin(motion() * 2 + o.y) * .04;
    if (drawLivingObject(ctx, game, o, sy, reduced, bio.color)) continue;
    if (o.type === 'flow') { if (!(o.sluice && game.mechanism()?.done.includes('ramp'))) flow(o.x, sy(o.y), o.w, o.h, o.dir); continue; }
    if (o.type === 'bumper') { const classic = o.role === 'prologue-target', color = classic ? (o.active ? '#ffe08a' : '#d77b76') : bio.color, accent = classic ? '#ffd3a2' : bio.accent; ctx.save(); if (o.link) { const bridge = game.objects.find(candidate => candidate.type === 'rail' && candidate.link === o.link); if (bridge) { ctx.setLineDash(o.active ? [] : [4, 7]); line(x, y, bridge.x + bridge.w / 2, sy(bridge.y - bridge.w * bridge.slant * .14), o.active ? bio.color + 'a0' : bio.accent + '55', o.active ? 2 : 1); ctx.setLineDash([]); } } ctx.translate(x, y); ctx.rotate(classic ? 0 : motion() * .12); circle(0, 0, o.r + 8, null, accent + (o.active ? 'bb' : '58')); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; circle(Math.cos(a) * (o.r + 8), Math.sin(a) * (o.r + 8), 2, accent + '99'); } ctx.shadowBlur = o.cool > 0 || o.active ? 24 : 10; ctx.shadowColor = color; circle(0, 0, o.r * pulse, color + (o.active ? '42' : '1c'), color + 'dd', 1.5); circle(0, 0, o.r - 7, '#26152a', color + '55'); star(0, 0, 10, classic ? (o.active ? '#fff2bb' : '#f4bd9d') : o.role === 'resonance' && !o.active ? bio.accent : bio.color); ctx.restore(); }
    if (o.type === 'ceiling') ceiling(x, y, o.r, game.prologueHits >= (o.requiredHits || 2));
    if (o.type === 'mandala') mandala(x, y, o.r, o.phase); if (o.type === 'gate') gate(x, y, o.r, o.phase); if (o.type === 'star') star(x, y, 6 + Math.sin(motion() * 3 + o.y), '#f3d592'); if (o.type === 'portal' && !o.used) portal(x, y, o.r, o.kind); if (o.type === 'transfer') transferScoop(x, y, o.r, game.transferIsOpen(o)); if (o.type === 'exit') portal(x, y, o.r, 'exit');
    if (o.type === 'rail') { ctx.save(); ctx.lineCap = 'round'; const ghost = o.link && !o.active; ctx.setLineDash(ghost ? [7, 8] : []); line(x, y, x + o.w, y - o.w * o.slant * .28, ghost ? '#283344' : '#27374c', ghost ? 8 : 15); line(x, y - 2, x + o.w, y - o.w * o.slant * .28 - 2, bio.accent + (ghost ? '70' : 'd0'), 2); ctx.setLineDash([]); for (let i = 0; i < 3; i++) { const rx = x + 20 + i * 25, ry = y - (20 + i * 25) * o.slant * .28; ctx.save(); ctx.translate(rx, ry); ctx.rotate(o.aim > 0 ? -.18 : Math.PI + .18); ctx.beginPath(); ctx.moveTo(-5, -4); ctx.lineTo(5, 0); ctx.lineTo(-5, 4); ctx.strokeStyle = bio.color + (ghost ? '70' : 'ff'); ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore(); } ctx.restore(); }
    if (o.type === 'cat') { if (!o.stationary) x += Math.sin(game.time * 1.3 + o.y) * 28; circle(x, y, 34, null, '#ef90dd22'); cat(x, y, 21, true); for (let i = 0; i < (o.requiredHits || 3) - o.hits; i++) circle(x + (i - 1) * 8, y + 32, 2.3, '#efb8de'); }
    if (o.type === 'bell') { circle(x, y, 17, null, '#f3d59240'); ctx.fillStyle = '#f3d592'; ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.fillText('♧', x, y + 7); }
  }
  if (game.reboundCue) { const cue = game.reboundCue, speed = Math.hypot(cue.vx, cue.vy) || 1, dx = cue.vx / speed * 28, dy = -cue.vy / speed * 28, cy = sy(cue.y); ctx.save(); ctx.globalAlpha = Math.min(1, cue.life * 4); ctx.lineCap = 'round'; line(cue.x, cy, cue.x + dx, cy + dy, bio.color, 2.5); line(cue.x + dx, cy + dy, cue.x + dx - dx * .26 - dy * .22, cy + dy - dy * .26 + dx * .22, bio.color, 2); line(cue.x + dx, cy + dy, cue.x + dx - dx * .26 + dy * .22, cy + dy - dy * .26 - dx * .22, bio.color, 2); ctx.restore(); }
  for (let side = 0; side < 2; side++) { const f = game.flipper(side), y = sy(f.y), ey = sy(f.ey), charged = game.tapWindow[side] > 0, catching = game.catching === side; ctx.lineCap = 'round'; ctx.shadowColor = bio.color; ctx.shadowBlur = catching ? 30 : game.input[side] ? 24 : 8; line(f.x, y, f.ex, ey, '#3f5d68', 22); line(f.x, y - 2, f.ex, ey - 2, charged ? '#fff5cc' : catching ? '#f7e4a5' : game.input[side] ? '#dcffe9' : '#b9e8d9', 15); ctx.shadowBlur = 0; line(f.x, y - 5, f.ex, ey - 5, '#f0fff688', 2); circle(f.x, y, 7, '#1c2838', '#ccffea', 1); circle(f.x, y, 2, bio.color); }
  const b = game.ball, ballY = sy(b.y); for (let i = b.trail.length - 1; i >= 0; i--) { const p = b.trail[i]; circle(p.x, sy(p.y), b.r * (1 - i / 24) * .8, bio.color + Math.floor((1 - i / 23) * 35).toString(16).padStart(2, '0')); }
  if (!reduced && (Math.abs(b.vy) > 600 || punch > .05)) { ctx.save(); ctx.translate(b.x, ballY); ctx.rotate(Math.atan2(-b.vy, b.vx)); ctx.globalAlpha = .26 + punch; ctx.strokeStyle = bio.color; for (let i = -2; i <= 2; i++) line(-40 - Math.abs(b.vy) / 45, i * 8, -10, i * 5, bio.color, i === 0 ? 2 : 1); ctx.restore(); }
  const stretch = reduced ? 1 : 1 + Math.min(.24, Math.abs(b.vy) / 2100) + punch * .18; cat(b.x, ballY, b.r, false, stretch);
  drawMaterial(ctx, game, sy, reduced);
  if (game.shield) circle(b.x, ballY, b.r + 7, null, '#f3d28a90', 1.3);
  if (game.rescueBoost) { ctx.save(); ctx.setLineDash([2, 5]); circle(b.x, ballY, b.r + 11, null, '#e4b9ff', 1); ctx.restore(); }
  if (game.state === 'summit') { ctx.save(); ctx.fillStyle = '#caffdf'; ctx.font = '12px system-ui'; ctx.textAlign = 'center'; ctx.fillText('A new sky. Stay a while, or tap to continue.', 210, 420); ctx.restore(); }
  for (const p of game.particles) { ctx.globalAlpha = Math.max(0, p.life); star(p.x, sy(p.y), 3 * p.life, p.color); } ctx.globalAlpha = 1;
  transitionFx(sy);
  if (!reduced && cinema.flash > .01) { ctx.globalAlpha = cinema.flash; ctx.fillStyle = cinema.kind === 'portal' ? '#e7b4ff' : bio.color; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (game.state === 'ready') { mandala(210, 222, 42, 0); portal(92, 278, 30, 'tide'); cat(295, 206, 19); } ctx.restore();
}
let lastUI = '';
function ui() {
  const signature = [game.lives, Math.floor(game.maxHeight / 10), game.biome, game.rescuedInAdventure, game.rescueTarget, game.rescueBoost, game.room?.kind, game.prologue, game.prologueHits, game.tableIndex, game.room?.collected, game.state, !!game.transition].join('|'); if (signature === lastUI) return; lastUI = signature;
  $('bells').innerHTML = Array.from({ length: 7 }, (_, i) => '<span class="bell ' + (i >= game.lives ? 'lost' : '') + '">' + bellSVG + '</span>').join(''); $('bells').setAttribute('aria-label', game.lives + ' lives remaining'); $('height').innerHTML = String(Math.floor(game.maxHeight / 10)).padStart(4, '0') + '<span> m</span>';
  $('biomeName').textContent = game.transition ? (game.prologue ? 'THE CABINET OPENS' : 'FOLLOW THE SPIRIT') : game.prologue ? 'MIDNIGHT ARCADE · ' + game.prologueHits + '/2' : game.room ? POCKETS[game.room.kind].cue + ' · ' + game.room.collected + '/3 ✦' : CHAMBER_NAMES[game.tableIndex % 6].toUpperCase();
  $('biomeDot').style.background = arcadeMode() ? '#f3bd8c' : BIOMES[game.biome].color;
}
function frame(now) { const dt = Math.min((now - last) / 1000 || 0, .05); last = now; clock += dt; cinema.punch = Math.max(0, cinema.punch - dt * 2.8); cinema.flash = Math.max(0, cinema.flash - dt * 4.8); accumulator += dt; while (accumulator >= 1 / 120) { if (debugTrace && (game.state === 'playing' || game.state === 'transition')) debugTrace.push((game.input[0] ? 1 : 0) | (game.input[1] ? 2 : 0)); game.step(1 / 120); accumulator -= 1 / 120; } draw(); ui(); requestAnimationFrame(frame); }
requestAnimationFrame(frame);
function clearInput() { pointers.clear(); game.input = [false, false]; document.querySelectorAll('.touch-controls button').forEach(el => el.classList.remove('active')); }
function continueFromSummit() {
  if (game.state !== 'summit') return false;
  if (debugTrace) debugTrace.push(5);
  game.continueEndless();
  return true;
}
function updateAdaptationButton() { $('adaptationButton').textContent = 'Room adaptation: ' + (game.adaptationEnabled ? 'On' : 'Off'); }
function pause() { if (['playing', 'transition', 'summit'].includes(game.state)) { pausedState = game.state; game.state = 'paused'; clearInput(); overlay('Paused', 'Your checkpoint is safe.', 'Resume', 'PAUSE OR LEAVE WHENEVER YOU LIKE'); $('pauseOptions').hidden = false; updateAdaptationButton(); $('soundButton').textContent = 'Sound: ' + (sound ? 'On' : 'Off'); $('resetAdaptationButton').textContent = 'Reset room learning'; } else if (game.state === 'paused') { game.state = pausedState; $('overlay').hidden = true; } }
$('soundButton').onclick = () => { if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === 'suspended') audio.resume(); sound = !sound; $('soundButton').textContent = 'Sound: ' + (sound ? 'On' : 'Off'); if (sound) tone('flip'); };
$('adaptationButton').onclick = () => { game.setAdaptation(!game.adaptationEnabled); if (debugTrace) debugTrace.push(game.adaptationEnabled ? 7 : 8); updateAdaptationButton(); try { localStorage.setItem('lost-in-meowltiverse.adaptation.v1', game.adaptationEnabled ? 'on' : 'off'); } catch { /* optional local setting */ } };
$('resetAdaptationButton').onclick = () => { game.setAdaptation(game.adaptationEnabled); if (debugTrace) debugTrace.push(9); $('resetAdaptationButton').textContent = 'Room learning reset'; };
$('playButton').onclick = () => { if (audio?.state === 'suspended') audio.resume(); if (game.state === 'ready') game.start(); else if (game.state === 'gameover') { if (debugTrace) debugTrace.push(4); game.continueCheckpoint(); } else if (game.state === 'paused') game.state = pausedState; $('overlay').hidden = true; };
const keys = new Map([['ArrowLeft', 0], ['ArrowRight', 1], ['a', 0], ['d', 1]]);
window.addEventListener('keydown', event => { if (['SELECT', 'INPUT', 'TEXTAREA'].includes(event.target.tagName)) return; if (keys.has(event.key)) { event.preventDefault(); if (!event.repeat) continueFromSummit(); if (game.state === 'playing') game.input[keys.get(event.key)] = true; } if (!event.repeat && (event.key === 'p' || event.key === 'Escape')) pause(); });
window.addEventListener('keyup', event => { if (keys.has(event.key)) game.input[keys.get(event.key)] = false; });
const pointers = new Map(); function syncPointers() { for (let i = 0; i < 2; i++) { game.input[i] = [...pointers.values()].includes(i); $(i ? 'rightControl' : 'leftControl').classList.toggle('active', game.input[i]); } }
$('gameFrame').addEventListener('pointerdown', event => { if (event.target.closest('.overlay, .pause-toggle')) return; continueFromSummit(); if (game.state !== 'playing') return; event.preventDefault(); const box = canvas.getBoundingClientRect(), side = event.clientX < box.left + box.width / 2 ? 0 : 1; pointers.set(event.pointerId, side); $('gameFrame').setPointerCapture(event.pointerId); syncPointers(); });
for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) $('gameFrame').addEventListener(event, e => { pointers.delete(e.pointerId); syncPointers(); });
window.addEventListener('blur', () => { pointers.clear(); clearInput(); if (['playing', 'transition'].includes(game.state)) pause(); }); document.addEventListener('visibilitychange', () => { if (document.hidden && ['playing', 'transition'].includes(game.state)) pause(); });

$('pauseToggle').onclick = pause;
function journal() {
  $('journalText').textContent = game.discoveries.length ? game.discoveries.map(d => d.text).join('\n\n') : 'Follow the golden paws. Free spirits remember your friend.';
}
$('journal').addEventListener('toggle', journal);
if (query.has('dev')) {
  $('devTools').hidden = false;
  $('roomPreview').innerHTML = '<option value="">Broken Cabinet</option>' + CHAMBER_NAMES.map((name, i) => '<option value="table=' + i + '">' + name + '</option>').join('') + Object.entries(POCKETS).map(([kind, p]) => '<option value="pocket=' + kind + '">' + p.name + '</option>').join('');
  $('previewButton').onclick = () => { location.search = '?fresh=1&dev=1&' + $('roomPreview').value + (reduced ? '&reduced=1' : ''); };
}

for (const [id, side] of [['leftControl', 0], ['rightControl', 1]]) {
  $(id).addEventListener('keydown', event => { if (event.code === 'Space' || event.code === 'Enter') { event.preventDefault(); if (game.state === 'playing') game.input[side] = true; } });
  $(id).addEventListener('keyup', event => { if (event.code === 'Space' || event.code === 'Enter') game.input[side] = false; });
}
