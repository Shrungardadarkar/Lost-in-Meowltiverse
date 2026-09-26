export const W = 420, H = 760;
export const BIOMES = [
  { name: 'CHROME ROOT', color: '#b8f8d8', accent: '#c39cff', bg: '#15152b', mid: '#20324a', low: '#111124', story: 'A golden pawprint. He was here.', rhythm: 'catch' },
  { name: 'TIDE CATHEDRAL', color: '#79e9e3', accent: '#ff9dca', bg: '#092e42', mid: '#135264', low: '#071c34', story: 'A familiar bark echoes through the water.', rhythm: 'flow' },
  { name: 'CLOCKWORK BLOOM', color: '#f6d28c', accent: '#fa9db9', bg: '#38213f', mid: '#5a3049', low: '#20152f', story: 'His favorite ball, caught between seconds.', rhythm: 'rhythm' }
];

const SAVE_KEY = 'lost-in-meowltiverse.checkpoint.v1';
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const segmentHit = (p, a, b) => {
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy), 0, 1);
  const x = a.x + t * dx, y = a.y + t * dy;
  return { x, y, t, dist: Math.hypot(p.x - x, p.y - y) };
};
function random(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

export class Game {
  constructor(onEvent = () => {}) { this.onEvent = onEvent; this.reset(); }
  emit(type, text, value) { this.onEvent({ type, text, value }); }

  readSavedCheckpoint() {
    try {
      const saved = JSON.parse(globalThis.localStorage?.getItem(SAVE_KEY) || 'null');
      return Number.isFinite(saved?.checkpoint) && saved.checkpoint > 0 ? saved : null;
    } catch { return null; }
  }

  persistCheckpoint() {
    try { globalThis.localStorage?.setItem(SAVE_KEY, JSON.stringify({ checkpoint: this.checkpoint, cycle: this.cycle })); } catch { /* local progress is optional */ }
  }

  reset() {
    this.state = 'ready'; this.camera = 0; this.maxHeight = 0; this.lives = 7; this.score = 0; this.freed = 0;
    this.checkpoint = 0; this.safePoint = 0; this.cycle = 0; this.biome = 0; this.adventure = 0; this.rescuedInAdventure = 0; this.rescueTarget = 2; this.rescueBoost = 0;
    this.time = 0; this.room = null; this.seen = new Set(); this.shield = 0; this.recovering = false;
    this.input = [false, false]; this.previousInput = [false, false]; this.tapWindow = [0, 0]; this.flips = [0, 0];
    this.strikeLock = 0; this.guardLock = 0; this.railRescues = 0; this.catching = null; this.particles = []; this.reboundCue = null; this.shake = 0; this.lesson = 0; this.perfects = 0;
    this.skillProfile = { contacts: 0, perfects: 0, falls: 0, portalChoices: 0, rescueHits: 0 };
    this.modules = []; this.generationIssues = []; this.generatorVersion = 2;
    this.savedCheckpoint = this.readSavedCheckpoint();
    this.objects = []; this.generated = 0; this.generate(6000);
    this.ball = { x: 210, y: 145, vx: 0, vy: 0, r: 13, trail: [] };
  }

  start() {
    if (this.savedCheckpoint) {
      this.checkpoint = this.savedCheckpoint.checkpoint; this.cycle = this.savedCheckpoint.cycle || 0;
      this.maxHeight = this.checkpoint; this.safePoint = this.checkpoint; this.adventure = Math.floor(this.checkpoint / 1500); this.biome = this.adventure % 3;
      this.camera = Math.max(0, this.checkpoint - 220);
      this.emit('story', 'Your quiet checkpoint is waiting. The trail continues when you are ready.');
    } else this.emit('tutorial', 'Tap a flipper as the spirit falls. A quick tap makes the strong save.');
    this.state = 'playing'; this.launch();
  }

  launch() { this.catching = null; this.ball = { x: 210, y: this.camera + 146, vx: this.time % 2 > 1 ? -65 : 65, vy: 560, r: 13, trail: [] }; this.strikeLock = .3; this.recovering = false; }
  resumeFromRecovery() { this.catching = null; this.ball = { x: 210, y: this.camera + H - 72, vx: this.time % 2 > 1 ? -65 : 65, vy: -110, r: 13, trail: [] }; this.strikeLock = .3; this.recovering = true; }

  buildModule(kind, y, r) {
    const star = (x, offset = 70) => this.objects.push({ type: 'star', x, y: y + offset, r: 9 });
    const bumper = (x, offset = 0, radius = 25) => this.objects.push({ type: 'bumper', x, y: y + offset, r: radius, cool: 0 });
    const rail = (x, offset, w, slant, aim) => this.objects.push({ type: 'rail', x, y: y + offset, w, slant, aim, cool: 0 });
    if (kind === 'catch-garden') {
      bumper(145, 0, 24); bumper(275, 20, 24); this.objects.push({ type: 'gate', x: 210, y: y + 78, r: 22, phase: r() * Math.PI * 2, cool: 0 });
      star(145, 45); star(275, 72); rail(58, 135, 78, 1, 1); rail(284, 165, 78, -1, -1);
    } else if (kind === 'silver-bank') {
      const link = 'chrome-bridge-' + y;
      rail(42, 18, 116, 1, 1);
      this.objects.push({ type: 'rail', x: 262, y: y + 118, w: 116, slant: -1, aim: -1, link, active: false, cool: 0 });
      this.objects.push({ type: 'bumper', x: 210, y: y + 100, r: 27, role: 'resonance', link, active: false, cool: 0 });
      star(108, 95); star(312, 185);
    } else if (kind === 'pawprint-gate') {
      this.objects.push({ type: 'gate', x: 210, y: y + 72, r: 27, phase: r() * Math.PI * 2, cool: 0 });
      const route = r() > .5 ? 1 : -1;
      bumper(102, 142, 23); bumper(318, 170, 23); star(210, 150); star(210, 198); rail(162, 220, 96, route, route);
      this.objects.push({ type: 'portal', x: 328, y: y + 95, r: 30, kind: 'tide', cool: 0 });
    } else if (kind === 'tide-channel') {
      this.objects.push({ type: 'flow', x: 65, y: y + 15, w: 290, h: 175, dir: r() > .5 ? 1 : -1, strength: 250 });
      bumper(120, 55, 24); bumper(300, 135, 24); star(205, 80); star(255, 154); rail(55, 205, 90, 1, 1);
    } else if (kind === 'tide-choir') {
      this.objects.push({ type: 'flow', x: 40, y: y + 25, w: 340, h: 125, dir: -1, strength: 190 });
      bumper(210, 75, 30); star(125, 145); star(210, 175); star(295, 145); rail(286, 210, 85, -1, -1);
    } else if (kind === 'moon-door') {
      this.objects.push({ type: 'portal', x: r() > .5 ? 92 : 328, y: y + 95, r: 34, kind: 'tide', cool: 0 });
      this.objects.push({ type: 'flow', x: 62, y: y + 155, w: 296, h: 64, dir: r() > .5 ? -1 : 1, strength: 160 });
      bumper(210, 160, 25); star(210, 215); rail(50, 245, 104, 1, 1);
    } else if (kind === 'mandala-bloom') {
      this.objects.push({ type: 'mandala', x: 210, y: y + 88, r: 40, phase: r() * Math.PI * 2, cool: 0 });
      star(125, 75); star(295, 75); rail(42, 175, 90, 1, 1); rail(288, 175, 90, -1, -1);
    } else if (kind === 'clock-gate') {
      this.objects.push({ type: 'gate', x: 210, y: y + 60, r: 30, phase: r() * Math.PI * 2, cool: 0 });
      this.objects.push({ type: 'mandala', x: 120, y: y + 165, r: 30, phase: r() * Math.PI * 2, cool: 0 });
      star(300, 120); star(210, 210); rail(280, 215, 86, -1, -1);
    } else if (kind === 'time-door') {
      this.objects.push({ type: 'portal', x: r() > .5 ? 92 : 328, y: y + 95, r: 34, kind: 'time', cool: 0 });
      this.objects.push({ type: 'gate', x: 210, y: y + 185, r: 25, phase: r() * Math.PI * 2, cool: 0 }); star(210, 145);
    } else if (kind === 'spirit-rescue') {
      this.objects.push({ type: 'cat', x: 210 + (r() - .5) * 150, y: y + 76, r: 25, hits: 0, requiredHits: 3, adventure: Math.floor((y - 330) / 1500), cool: 0 });
      bumper(92, 150, 23); bumper(328, 150, 23); rail(42, 42, 104, 1, 1); rail(274, 42, 104, -1, -1); star(210, 160); star(210, 210);
    } else {
      bumper(210, 60, 27); star(160, 120); star(260, 150); rail(52, 185, 86, 1, 1);
    }
  }

  choosePlan(plans, biome, slot) {
    const base = plans[biome][slot];
    if (this.adventure < 1) return base;
    const struggle = this.skillProfile.falls > this.skillProfile.perfects + 2;
    const mastery = this.skillProfile.perfects > this.skillProfile.falls + 5;
    if (struggle && slot === 3) return ['pawprint-gate', 'tide-channel', 'clock-gate'][biome];
    if (mastery && slot === 1) return ['silver-bank', 'tide-choir', 'mandala-bloom'][biome];
    return base;
  }

  validateModule(kind, biome, y, startIndex) {
    const segment = this.objects.slice(startIndex);
    const inBounds = segment.every(o => Number.isFinite(o.x) && Number.isFinite(o.y) && o.y >= y - 1 && o.y <= y + 310);
    const circles = segment.filter(o => Number.isFinite(o.r));
    const overlap = circles.some((a, i) => circles.slice(i + 1).some(b => Math.hypot(a.x - b.x, a.y - b.y) < (a.r + b.r) * .35));
    if (inBounds && !overlap) return true;
    this.generationIssues.push({ kind, biome, y, reason: inBounds ? 'overlap' : 'out-of-bounds' });
    this.objects.splice(startIndex);
    this.buildModule(['catch-garden', 'tide-channel', 'mandala-bloom'][biome], y, random(y + this.generatorVersion));
    return false;
  }

  generationReport() {
    return { version: this.generatorVersion, cycle: this.cycle, modules: this.modules.map(module => ({ ...module })), issues: this.generationIssues.map(issue => ({ ...issue })) };
  }

  generate(top) {
    const plans = [
      ['catch-garden', 'spirit-rescue', 'silver-bank', 'pawprint-gate', 'spirit-rescue'],
      ['tide-channel', 'spirit-rescue', 'tide-choir', 'moon-door', 'spirit-rescue'],
      ['mandala-bloom', 'spirit-rescue', 'clock-gate', 'time-door', 'spirit-rescue']
    ];
    while (this.generated < top) {
      const index = Math.floor(this.generated / 300), y = this.generated + 330;
      const biome = Math.floor(this.generated / 1500) % 3, slot = Math.floor((this.generated % 1500) / 300), plan = this.choosePlan(plans, biome, slot), startIndex = this.objects.length;
      this.buildModule(plan, y, random(index + 17 + this.cycle * 71));
      this.validateModule(plan, biome, y, startIndex);
      this.modules.push({ index, kind: plan, biome, y, slot, seed: (index + 17 + this.cycle * 71) >>> 0, difficulty: slot === 0 ? 1 : slot === 1 || slot === 4 ? 2 : 3 });
      if (index % 7 === 6) this.objects.push({ type: 'bell', x: 210, y: y + 235, r: 12 });
      this.generated += 300;
    }
  }

  gainLife(reason) { if (this.lives < 7) { this.lives++; this.emit('bell', reason + ' · +1 collar bell'); } else this.emit('bell', 'Your seven collar bells are already whole.'); }
  addScore(n) { this.score += n; }
  burst(x, y, color, n = 14) { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; this.particles.push({ x, y, vx: Math.cos(a) * (40 + Math.random() * 100), vy: Math.sin(a) * 120, life: 1, color }); } }
  completeAdventure() {
    const completed = BIOMES[this.biome].name;
    this.checkpoint = (this.adventure + 1) * 1500; this.safePoint = this.checkpoint; this.maxHeight = Math.max(this.maxHeight, this.checkpoint); this.persistCheckpoint();
    this.adventure++;
    if (this.adventure >= (this.cycle + 1) * BIOMES.length) { this.state = 'summit'; this.emit('summit'); return; }
    this.biome = this.adventure % BIOMES.length; this.rescuedInAdventure = 0; this.state = 'adventure-complete';
    this.emit('adventure', completed + ' healed · two cat spirits are free. Next adventure: ' + BIOMES[this.biome].name + '.');
  }
  beginAdventure() { this.camera = Math.max(0, this.adventure * 1500 - (H - 226)); this.state = 'playing'; this.resumeFromRecovery(); this.emit('checkpoint', BIOMES[this.biome].name + ' adventure begins · rescue ' + this.rescueTarget + ' cat spirits.'); }
  rescueCat(cat, x) {
    const marks = this.rescueBoost ? 2 : 1;
    if (this.rescueBoost) { this.rescueBoost = 0; this.emit('booster', 'Portal pulse used · two rescue marks.'); }
    cat.hits = Math.min(cat.requiredHits || 3, cat.hits + marks); this.skillProfile.rescueHits += marks;
    if (cat.hits < (cat.requiredHits || 3)) { this.emit('rescue', 'Rescue pulse · ' + cat.hits + '/' + (cat.requiredHits || 3)); return false; }
    cat.dead = true; this.freed++; this.rescuedInAdventure++; this.addScore(200); this.emit('spirit', 'A cat spirit is free. “The trail is brighter now.”'); this.burst(x, cat.y, '#b8f8d8', 30);
    if (this.rescuedInAdventure >= this.rescueTarget) { this.completeAdventure(); return true; }
    return false;
  }

  enterRoom(portal) {
    if (this.room) return;
    portal.used = true; this.skillProfile.portalChoices++;
    this.room = { kind: portal.kind, returnY: this.ball.y + 120, camera: this.camera, objects: this.objects, elapsed: 0, collected: 0, entranceSafePoint: this.safePoint };
    this.objects = [];
    for (let i = 0; i < 5; i++) {
      const x = portal.kind === 'tide' ? (i % 2 ? 292 : 128) : (i % 2 ? 255 : 165);
      this.objects.push({ type: portal.kind === 'tide' ? 'bumper' : 'mandala', x, y: 260 + i * 160, r: portal.kind === 'tide' ? 27 : 25, phase: i, cool: 0 });
      this.objects.push({ type: 'star', x: 420 - x, y: 300 + i * 160, r: 12 });
      if (portal.kind === 'tide') this.objects.push({ type: 'flow', x: 45, y: 235 + i * 160, w: 330, h: 90, dir: i % 2 ? 1 : -1, strength: 180 });
      else this.objects.push({ type: 'gate', x: 210, y: 340 + i * 160, r: 18, phase: i, cool: 0 });
    }
    this.objects.push({ type: 'exit', x: 210, y: 1050, r: 38 });
    this.camera = 0; this.launch(); this.seen.add(portal.kind);
    this.emit('portal', portal.kind === 'tide' ? 'LIQUID MOON · follow visible currents · 3 stardust earns a bell + Spirit Shield' : 'THE HOURS BETWEEN · wait for each gate · 3 stardust earns a bell + Spirit Shield');
  }

  exitRoom() {
    const room = this.room; if (!room) return;
    this.objects = room.objects; this.camera = Math.max(room.camera, room.returnY - 420); this.room = null;
    this.ball = { x: 210, y: room.returnY, vx: 0, vy: 600, r: 13, trail: [] };
    if (room.collected >= 3) { this.gainLife('You completed the pocket world'); this.shield = 1; this.rescueBoost = 1; this.emit('shield', 'Spirit Shield gained · it protects your next fall.'); this.emit('booster', 'Portal pulse gained · your next cat strike adds two rescue marks.'); }
    this.addScore(250); this.emit('story', 'Another world discovered. The trail continues.');
  }

  loseLife() {
    const fromRoom = !!this.room;
    if (this.room) { this.objects = this.room.objects; this.camera = this.room.camera; this.safePoint = this.room.entranceSafePoint; this.room = null; }
    this.camera = Math.max(0, this.safePoint - (H - 226));
    if (this.shield) { this.shield = 0; this.resumeFromRecovery(); this.emit('shield', 'Spirit Shield held the fall · returning to your last safe point.'); return; }
    this.lives--; this.skillProfile.falls++; this.shake = 12;
    if (this.lives <= 0) { this.lives = 0; this.state = 'gameover'; this.emit('gameover', 'Even little spirits need a second chance.'); return; }
    this.resumeFromRecovery(); this.emit('lost', (fromRoom ? 'Portal room ended · ' : 'Center drain crossed · ') + 'one bell fades. Returning from above the last safe point.');
  }

  continueCheckpoint() { this.lives = 7; this.safePoint = this.checkpoint; this.camera = Math.max(0, this.checkpoint - 220); this.maxHeight = this.checkpoint; this.biome = Math.floor(this.checkpoint / 1500) % 3; this.state = 'playing'; this.launch(); this.emit('checkpoint', 'Returning to ' + BIOMES[this.biome].name + ' checkpoint.'); }
  continueEndless() { this.cycle++; this.adventure = this.cycle * BIOMES.length; this.biome = this.adventure % BIOMES.length; this.rescuedInAdventure = 0; this.state = 'playing'; this.generate(this.maxHeight + 6000); this.beginAdventure(); this.emit('story', 'Universe ' + (this.cycle + 1) + ' · More cat spirits need your help.'); }

  flipper(side) {
    const f = this.flips[side], angle = -.36 + f * .88, sign = side === 0 ? 1 : -1;
    const x = side === 0 ? 105 : 315, y = this.camera + 106;
    return { x, y, ex: x + sign * Math.cos(angle) * 80, ey: y + Math.sin(angle) * 80 };
  }

  guards() {
    return [
      { side: 0, a: { x: 63, y: this.camera + 70 }, b: { x: 25, y: this.camera + 242 } },
      { side: 1, a: { x: 357, y: this.camera + 70 }, b: { x: 395, y: this.camera + 242 } }
    ];
  }

  applyGuardRails(b) {
    if (this.guardLock > 0) return;
    for (const guard of this.guards()) {
      const hit = segmentHit(b, guard.a, guard.b), inward = guard.side === 0 ? 1 : -1;
      const isInside = guard.side === 0 ? b.x > hit.x : b.x < hit.x;
      if (isInside && hit.dist < b.r + 8 && b.vy < 120) {
        if (this.railRescues >= 1) {
          b.x = 210; b.y = this.camera + 78; b.vx = 0; b.vy = -220; this.railRescues = 0;
          this.guardLock = .18; this.emit('rail'); return;
        }
        b.x = hit.x + inward * (b.r + 9); b.y = hit.y;
        b.vx = inward * Math.max(110, Math.abs(b.vx) * .38 + 75); b.vy = Math.max(45, b.vy * .12 + 55);
        this.railRescues++; this.guardLock = .12; this.addScore(10); this.emit('rail'); this.burst(hit.x, hit.y, BIOMES[this.biome].color, 8); return;
      }
    }
  }

  applyEnvironments(b, h) {
    for (const o of this.objects) {
      if (o.type !== 'flow' || b.x < o.x || b.x > o.x + o.w || b.y < o.y || b.y > o.y + o.h) continue;
      b.vx += (o.dir * o.strength + Math.sin(this.time * 1.7 + b.y / 105) * 42) * h;
      b.vy += Math.cos(this.time * 1.3 + b.x / 85) * 24 * h;
    }
  }

  step(dt) {
    if (this.state !== 'playing') return;
    this.time += dt; this.shake *= .9; this.strikeLock = Math.max(0, this.strikeLock - dt); this.guardLock = Math.max(0, this.guardLock - dt);
    if (this.reboundCue) { this.reboundCue.life -= dt; if (this.reboundCue.life <= 0) this.reboundCue = null; }
    for (let i = 0; i < 2; i++) {
      if (this.input[i] && !this.previousInput[i]) this.tapWindow[i] = .16;
      else this.tapWindow[i] = Math.max(0, this.tapWindow[i] - dt);
      this.previousInput[i] = this.input[i];
      this.flips[i] += ((this.input[i] ? 1 : 0) - this.flips[i]) * Math.min(1, dt * 24);
    }
    const b = this.ball;
    if (this.catching !== null && !this.input[this.catching]) {
      const released = this.catching;
      this.catching = null;
      this.emit('release', '', { side: released, x: b.x, y: b.y });
    }
    if (this.room) { this.room.elapsed += dt; if (this.room.elapsed > 30) { this.exitRoom(); return; } }
    const speed = this.room?.kind === 'time' ? .58 : 1, h = dt * speed;
    b.vy -= (this.room?.kind === 'tide' ? 370 : 620) * h; this.applyEnvironments(b, h);
    b.vx *= Math.pow(.998, h * 120); b.vx = clamp(b.vx, -440, 440); b.vy = clamp(b.vy, -1000, 1050);
    const previousPosition = { x: b.x, y: b.y };
    b.x += b.vx * h; b.y += b.vy * h;
    if (b.x < b.r + 18) { b.x = b.r + 18; b.vx = Math.abs(b.vx) * .83; }
    if (b.x > W - b.r - 18) { b.x = W - b.r - 18; b.vx = -Math.abs(b.vx) * .83; }
    this.applyGuardRails(b);

    for (let i = 0; i < 2; i++) {
      const f = this.flipper(i), hit = segmentHit(b, f, { x: f.ex, y: f.ey });
      if (hit.dist < b.r + 9 && b.y > hit.y - 10 && b.vy < 200 && this.strikeLock === 0) {
        if (this.recovering) this.recovering = false;
        this.skillProfile.contacts++;
        const quality = this.tapWindow[i] > 0 ? clamp((this.tapWindow[i] - .025) / .135, 0, 1) : 0, perfect = quality > .72;
        b.y = hit.y + b.r + 10;
        b.vy = quality ? 540 + quality * 410 : Math.max(80, Math.min(130, Math.abs(b.vy) * .18 + 55));
        const sign = i === 0 ? 1 : -1, fan = (hit.t - .5) * 2;
        const lateral = quality ? 70 + quality * (90 + hit.t * 210) + fan * quality * 80 : 36;
        b.vx = sign * Math.max(28, lateral);
        this.reboundCue = { x: b.x, y: b.y, vx: b.vx, vy: b.vy, life: .22 };
        this.tapWindow[i] = 0; this.railRescues = quality ? 0 : this.railRescues; this.catching = quality ? null : i; this.strikeLock = .13;
        this.emit(perfect ? 'perfect' : quality ? 'flip' : 'catch', '', { x: b.x, y: b.y, side: i, quality, fan }); this.burst(b.x, b.y, BIOMES[this.biome].color, perfect ? 16 : quality ? 7 : 3);
        if (perfect) { this.perfects++; this.skillProfile.perfects++; this.shake = 4; }
        if (quality > .4 && this.lesson === 0) { this.lesson = 1; this.emit('tutorial', 'Good save. Release, then tap again just before contact to choose a stronger route.'); }
      }
    }

    for (const o of this.objects) {
      o.cool = Math.max(0, (o.cool || 0) - dt);
      if (o.dead || o.used || Math.abs(o.y - b.y) > 145) continue;
      let x = o.x; if (o.type === 'cat') x += Math.sin(this.time * 1.3 + o.y) * 28;
      let dx = b.x - x, dy = b.y - o.y, dist = Math.hypot(dx, dy);
      const swept = segmentHit({ x, y: o.y }, previousPosition, b);
      if (swept.dist < dist) { dx = swept.x - x; dy = swept.y - o.y; dist = swept.dist; }
      if (o.type === 'rail' || o.type === 'break') {
        if (o.type === 'rail' && o.link && !o.active) continue;
        const end = o.x + o.w, surface = o.y + (o.type === 'rail' ? (b.x - o.x) * o.slant * .28 : 0);
        if (b.x > o.x - 8 && b.x < end + 8 && Math.abs(b.y - surface) < b.r + 9 && o.cool === 0) {
          if (o.type === 'break') { o.dead = true; this.addScore(75); this.burst(b.x, o.y, '#e4b4ff', 18); b.vy = 650; this.emit('hit'); }
          else {
            const aimed = o.aim === undefined || Math.sign(b.vx || o.aim) === o.aim;
            b.y = surface + b.r + 10; b.vy = aimed ? 720 : 360; b.vx = o.slant * (aimed ? 245 : 115); o.cool = .25;
            this.emit(aimed ? 'route' : 'hit', '', { x: b.x, y: o.y, aimed }); if (aimed) this.shake = 5;
          }
        }
      } else if (dist < b.r + o.r) {
        if (o.type === 'star') { o.dead = true; this.addScore(35); if (this.room) this.room.collected++; this.burst(x, o.y, '#f7d68b', 6); this.emit('collect'); }
        if (o.type === 'bell') { o.dead = true; this.gainLife('You found a marked bell'); this.burst(x, o.y, '#f7d68b'); }
        if (o.type === 'portal') { this.enterRoom(o); return; }
        if (o.type === 'exit') { this.exitRoom(); return; }
        if ((o.type === 'bumper' || o.type === 'cat' || o.type === 'mandala' || o.type === 'gate') && o.cool === 0) {
          const nx = dx / (dist || 1), ny = dy / (dist || 1), gateOpen = o.type !== 'gate' || Math.sin(this.time * 3.2 + o.phase) > .05;
          if (o.type === 'gate' && gateOpen) { o.cool = .08; continue; }
          b.x = x + nx * (b.r + o.r + 1); b.y = o.y + ny * (b.r + o.r + 1);
          if (o.type === 'mandala') {
            const spin = Math.sin(this.time * 1.8 + o.phase) > 0 ? 1 : -1;
            b.vx = nx * 250 - ny * 140 * spin; b.vy = Math.max(410, b.vy * .26 + 250);
          } else if (o.type === 'gate' && !gateOpen) {
            b.vx = nx * 160; b.vy = Math.max(260, b.vy * .18 + 185); this.emit('gate-wait');
          } else if (o.type === 'bumper') {
            const incoming = b.vx * nx + b.vy * ny;
            if (incoming < 0) {
              b.vx -= (1 + .86) * incoming * nx;
              b.vy -= (1 + .86) * incoming * ny;
            }
            this.reboundCue = { x, y: o.y, vx: b.vx, vy: b.vy, life: .32 };
            if (o.role === 'resonance' && !o.active) {
              o.active = true;
              const bridge = this.objects.find(candidate => candidate.type === 'rail' && candidate.link === o.link);
              if (bridge) bridge.active = true;
              this.emit('resonance', '', { x, y: o.y });
            }
          } else {
            b.vx = nx * 260 + (b.x < 210 ? 50 : -50); b.vy = Math.max(300, b.vy * .22 + 175);
          }
          o.cool = .22; this.addScore(o.type === 'gate' && gateOpen ? 45 : 20); this.burst(x, o.y, BIOMES[this.biome].color); this.emit(o.type === 'mandala' ? 'mandala' : 'hit'); this.shake = 3;
          if (o.type === 'cat' && o.adventure === this.adventure && this.rescueCat(o, x)) return;
        }
      }
    }
    if (!this.recovering) this.camera += (Math.max(this.camera, b.y - 470) - this.camera) * Math.min(1, dt * 6);
    if (!this.room) {
      const measuredHeight = b.y - 146;
      if (this.recovering && measuredHeight <= this.safePoint) this.recovering = false;
      if (!this.recovering) this.maxHeight = Math.max(this.maxHeight, measuredHeight);
      this.safePoint = Math.max(this.safePoint, Math.floor(this.maxHeight / 250) * 250);
      this.generate(this.camera + 1800);
    }
    const crossedCenterDrain = !this.room && b.y < this.camera + 78 && b.x > 158 && b.x < 262;
    if (crossedCenterDrain || b.y < this.camera - 45) this.loseLife();
    b.trail.unshift({ x: b.x, y: b.y }); if (b.trail.length > 22) b.trail.pop();
    for (const p of this.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 1.6; }
    this.particles = this.particles.filter(p => p.life > 0);
  }
}
