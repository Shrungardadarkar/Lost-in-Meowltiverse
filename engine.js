import { buildLivingTable, buildCabinet, buildPocket, validateChamber, movingSegment, CHAMBER_NAMES, POCKETS } from './chambers.js';
export const W = 420, H = 760, TABLE_H = 900;
export const BIOMES = [
  { name: 'CHROME ROOT', color: '#b8f8d8', accent: '#c39cff', bg: '#15152b', mid: '#20324a', low: '#111124', story: 'A golden pawprint. He was here.', rhythm: 'catch' },
  { name: 'TIDE CATHEDRAL', color: '#79e9e3', accent: '#ff9dca', bg: '#092e42', mid: '#135264', low: '#071c34', story: 'A familiar bark echoes through the water.', rhythm: 'flow' },
  { name: 'CLOCKWORK BLOOM', color: '#f6d28c', accent: '#fa9db9', bg: '#38213f', mid: '#5a3049', low: '#20152f', story: 'His favorite ball, caught between seconds.', rhythm: 'rhythm' }
];

export const TABLE_DECKS = [
  [['switchyard', 'switchyard-mirror'], ['mandala-loom', 'mandala-loom-mirror']],
  [['cathedral', 'cathedral-mirror'], ['sanctuary', 'sanctuary-mirror']],
  [['clockwork', 'clockwork-mirror'], ['false-summit', 'false-summit-mirror']]
];
const TABLE_ROLES = ['orientation', 'integration'];

const SAVE_KEY = 'lost-in-meowltiverse.checkpoint.v1';
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export const gateIsOpen = (time, phase = 0) => Math.sin(time * 3.2 + phase) > .05;
export const mandalaSpin = (time, phase = 0) => Math.sin(time * 1.8 + phase) > 0 ? 1 : -1;
const segmentHit = (p, a, b) => {
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1), 0, 1);
  const x = a.x + t * dx, y = a.y + t * dy;
  return { x, y, t, dist: Math.hypot(p.x - x, p.y - y) };
};
function random(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

export class Game {
  constructor(onEvent = () => {}, options = {}) { this.onEvent = onEvent; this.worldSeed = (options.seed ?? 17) >>> 0; this.adaptationEnabled = options.adaptationEnabled ?? false; this.ignoreSave = options.ignoreSave ?? false; this.replayCheckpoint = options.checkpoint ?? null; this.previewTable = options.previewTable ?? null; this.previewPocket = options.previewPocket ?? null; this.reset(); }
  emit(type, text, value) { this.onEvent({ type, text, value }); }

  readSavedCheckpoint() {
    if (this.replayCheckpoint) return this.replayCheckpoint;
    if (this.ignoreSave) return null;
    try {
      const saved = JSON.parse(globalThis.localStorage?.getItem(SAVE_KEY) || 'null');
      return Number.isFinite(saved?.checkpoint) && saved.checkpoint > 0 ? saved : null;
    } catch { return null; }
  }

  persistCheckpoint() {
    if (this.ignoreSave) return;
    try { globalThis.localStorage?.setItem(SAVE_KEY, JSON.stringify({ checkpoint: this.checkpoint, cycle: this.cycle, discoveries: this.discoveries, seen: [...this.seen] })); } catch { /* local progress is optional */ }
  }

  reset() {
    this.state = 'ready'; this.camera = 0; this.tableIndex = 0; this.maxHeight = 0; this.lives = 7; this.score = 0; this.freed = 0;
    this.checkpoint = 0; this.safePoint = 0; this.cycle = 0; this.biome = 0; this.adventure = 0; this.rescuedInAdventure = 0; this.rescueTarget = 2; this.rescueBoost = 0;
    this.time = 0; this.room = null; this.seen = new Set(); this.shield = 0; this.recovering = false;
    this.input = [false, false]; this.previousInput = [false, false]; this.tapWindow = [0, 0]; this.flips = [0, 0];
    this.strikeLock = 0; this.guardLock = 0; this.shotCommit = 0; this.railRescues = 0; this.catching = null; this.catchTime = 0; this.catchPosition = 0; this.particles = []; this.reboundCue = null; this.shake = 0; this.lesson = 0; this.perfects = 0;
    this.skillProfile = { contacts: 0, perfects: 0, falls: 0, portalChoices: 0, rescueHits: 0 };
    this.modules = []; this.generationIssues = []; this.generatorVersion = 7;
    this.transit = null; this.shot = null; this.shotSerial = 0; this.skillByRole = {}; this.chain = []; this.discoveries = []; this.echoHistory = []; this.echo = null; this.foldLock = 0; this.material = 'spirit';
    this.effectRandom = random(this.worldSeed ^ 0x9e3779b9);
    this.savedCheckpoint = this.readSavedCheckpoint();
    this.objects = []; this.generated = 0; this.generate(1800);
    this.prologue = !this.savedCheckpoint; this.prologueHits = 0; this.transition = null;
    if (this.prologue) this.buildPrologue();
    this.ball = { x: 210, y: 145, vx: 0, vy: 0, r: 13, trail: [] };
  }

  start() {
    if (this.savedCheckpoint) {
      this.discoveries = (this.savedCheckpoint.discoveries || []).filter(d => Number.isInteger(d.index) && typeof d.text === 'string').slice(0, 6);
      this.seen = new Set((this.savedCheckpoint.seen || []).filter(k => POCKETS[k]));
      this.checkpoint = this.savedCheckpoint.checkpoint; this.tableIndex = Math.floor(this.checkpoint / TABLE_H); this.adventure = Math.floor(this.tableIndex / 2); this.cycle = Math.max(this.savedCheckpoint.cycle || 0, Math.floor(this.adventure / BIOMES.length));
      this.maxHeight = this.checkpoint; this.safePoint = this.checkpoint; this.biome = this.adventure % BIOMES.length;
      this.camera = this.tableIndex * TABLE_H;
      if (this.checkpoint > this.generated) {
        this.objects = []; this.modules = []; this.generated = this.tableIndex * TABLE_H;
        this.generate(this.camera + 1800);
      }
      this.emit('story', 'Your quiet checkpoint is waiting. The trail continues when you are ready.');
    } else this.emit('tutorial', 'Tap a flipper as the spirit falls. A quick tap makes the strong save.');
    this.state = 'playing'; this.launch();
    if (Number.isInteger(this.previewTable) && this.previewTable >= 0 && this.previewTable < 60) {
      this.prologue = false; this.tableIndex = this.previewTable; this.camera = this.tableIndex * TABLE_H; this.safePoint = this.camera;
      this.adventure = Math.floor(this.tableIndex / 2); this.biome = this.adventure % 3; this.cycle = Math.floor(this.tableIndex / 6);
      this.objects = []; this.modules = []; this.generated = this.camera; this.generate(this.camera + 1800); this.resumeFromRecovery();
    }
    if (this.previewPocket && POCKETS[this.previewPocket]) { this.prologue = false; this.objects = this.objects.filter(o => o.introPhase !== 'prologue'); this.enterRoom({ kind: this.previewPocket }); }
  }

  launch() { this.resumeFromRecovery(); this.recovering = false; }
  resumeFromRecovery(side = 1) {
    this.catching = null; this.transit = null; this.shot = null; this.shotCommit = 0; this.chain = [];
    this.ball = { x: side ? 280 : 140, y: this.camera + 190, vx: 0, vy: -110, r: 13, trail: [] };
    this.strikeLock = 0; this.recovering = true;
  }

  setAdaptation(enabled) { this.skillByRole = {}; this.adaptationEnabled = !!enabled; this.skillProfile = { contacts: 0, perfects: 0, falls: 0, portalChoices: 0, rescueHits: 0 }; }

  buildPrologue() { this.objects.push(...buildCabinet()); }

  beginPrologueBreak() {
    if (!this.prologue || this.transition) return;
    this.transition = { kind: 'cabinet', elapsed: 0, duration: 1.6, x: this.ball.x, y: this.ball.y, fromCamera: this.camera };
    this.transit = null; this.state = 'transition';
    this.emit('ceiling-break', '', { x: 210, y: 635 });
  }

  finishPrologue() {
    this.prologue = false; this.transition = null;
    this.objects = this.objects.filter(o => o.introPhase !== 'prologue');
    this.camera = 0; this.tableIndex = 0; this.state = 'playing'; this.resumeFromRecovery();
    this.emit('multiverse', '', { x: 210, y: 635 });
  }

  chooseTable(biome, slot, table, seed) {
    const deck = TABLE_DECKS[biome][slot];
    if (table < 6 || deck.length === 1) return deck[0];
    if (this.adaptationEnabled && this.skillProfile.falls > this.skillProfile.perfects + 2) return deck[0];
    return deck[random(seed)() > .5 ? 1 : 0];
  }

  buildTable(kind, base, r, table, biome) {
    const variant = table >= 6 && kind === TABLE_DECKS[biome][table % 2][1];
    const skill = this.skillByRole[table % 6];
    const assist = this.adaptationEnabled && (skill ? skill.attempts >= 4 && skill.falls >= 2 && skill.routes / skill.attempts < .35 : this.skillProfile.falls >= 3 && this.skillProfile.contacts >= 4);
    this.objects.push(...buildLivingTable(table, base, variant, assist));
  }

  validateTable(kind, biome, base, startIndex, slot) {
    const errors = validateChamber(this.objects.slice(startIndex), base);
    if (!errors.length) return true;
    this.generationIssues.push({ kind, biome, y: base, reason: errors.join(', ') });
    this.objects.splice(startIndex);
    this.objects.push(...buildLivingTable(Math.floor(base / TABLE_H), base, false, true));
    return false;
  }

  generationReport() {
    return { version: this.generatorVersion, cycle: this.cycle, adaptation: this.adaptationEnabled, skills: structuredClone(this.skillByRole), modules: this.modules.map(module => ({ ...module })), issues: this.generationIssues.map(issue => ({ ...issue })) };
  }

  chapterReport(adventure) {
    const modules = this.modules.filter(module => Math.floor(module.index / 2) === adventure);
    const objects = this.objects.filter(object => object.adventure === adventure || Math.floor((object.table ?? -1) / 2) === adventure);
    return { adventure, modules: modules.length, rescues: objects.filter(object => object.type === 'cat').length, portals: objects.filter(object => object.type === 'portal').length, issues: this.generationIssues.filter(issue => Math.floor((issue.y - 330) / 1500) === adventure) };
  }

  activeRescueBoundary() { return null; }

  mechanism(table = this.tableIndex) { return this.objects.find(o => o.type === 'mechanism' && o.table === table); }
  chamberReady(table = this.tableIndex) { const m = this.mechanism(table); return !!m && m.required.every(g => m.done.includes(g)); }
  markGoal(goal) {
    const m = this.mechanism();
    if (!m || !m.required.includes(goal) || m.done.includes(goal)) return;
    m.done.push(goal); this.emit('resonance', '', { x: this.ball.x, y: this.ball.y });
    if (this.chamberReady() && m.role !== 3) { const cat = this.tableCats()[0]; if (cat && !cat.dead) this.rescueCat(cat, cat.x); }
  }
  trackOpen(o) {
    if (o.needsSpirit) return this.tableCats().some(c => c.dead);
    const m = this.mechanism(o.table);
    return (!o.requires || o.requires.every(g => m?.done.includes(g))) && (!o.timed || m?.done.includes('ramp') || gateIsOpen(this.time));
  }
  roleSkill() { return this.skillByRole[this.tableIndex % 6] ??= { attempts: 0, routes: 0, falls: 0 }; }
  beginTrack(o) {
    this.transit = { track: o, segment: 0, distance: 0, speed: clamp(Math.hypot(this.ball.vx, this.ball.vy), 360, 720) };
    this.ball.x = o.points[0].x; this.ball.y = o.points[0].y;
    this.emit('route', '', { x: o.x, y: o.y });
  }
  stepTrack(dt) {
    const transit = this.transit, o = transit.track, points = o.points, b = this.ball;
    transit.distance += transit.speed * dt;
    while (transit.segment < points.length - 1) {
      const a = points[transit.segment], end = points[transit.segment + 1], length = Math.hypot(end.x - a.x, end.y - a.y);
      if (transit.distance < length) {
        const t = transit.distance / length; b.x = a.x + (end.x - a.x) * t; b.y = a.y + (end.y - a.y) * t;
        b.vx = (end.x - a.x) / length * transit.speed; b.vy = (end.y - a.y) / length * transit.speed;
        this.updateTrail(dt); return;
      }
      transit.distance -= length; transit.segment++;
    }
    this.transit = null; o.cool = .35;
    if (!this.prologue && !this.room) this.roleSkill().routes++;
    if (!this.chain.includes(o.id)) { this.chain.push(o.id); this.emit('chain', '', { count: this.chain.length }); }
    if (this.prologue) {
      if (!o.active) { o.active = true; this.prologueHits++; this.emit('prologue-target'); }
    } else if (!this.room) this.markGoal(o.goal);
    if (o.exit) { this.advanceTable(); return; }
    const end = points.at(-1); b.x = end.x; b.y = end.y; b.vx = 0; b.vy = -110; this.strikeLock = 0; this.shot = null; this.shotCommit = 0;
  }
  updateTrail(dt) {
    const b = this.ball; b.trail.unshift({ x: b.x, y: b.y }); if (b.trail.length > 22) b.trail.pop();
    for (const p of this.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 1.6; }
    this.particles = this.particles.filter(p => p.life > 0);
  }

  updateEcho() {
    if (this.room?.kind !== 'echo') return;
    const b = this.ball;
    this.echoHistory.push({ x: b.x, y: b.y }); this.echo = this.echoHistory.length > 90 ? this.echoHistory.shift() : null;
    if (this.echo) for (const o of this.objects) if (o.echoable && !o.dead && Math.hypot(o.x - this.echo.x, o.y - this.echo.y) < o.r + b.r) {
      o.dead = true; this.room.collected++; this.emit('collect');
    }
  }

  snapshot() {
    return { state: this.state, ball: { x: this.ball.x, y: this.ball.y, vx: this.ball.vx, vy: this.ball.vy }, maxHeight: this.maxHeight, lives: this.lives, adventure: this.adventure, tableIndex: this.tableIndex, rescuedInAdventure: this.rescuedInAdventure, score: this.score, room: this.room?.kind ?? null, material: this.material, goals: [...(this.mechanism()?.done || [])], discoveries: this.discoveries.map(d => d.index), prologue: this.prologue, prologueHits: this.prologueHits, generated: this.generated };
  }

  generate(top) {
    while (this.generated < top) {
      const index = Math.floor(this.generated / TABLE_H), base = this.generated, biome = Math.floor(index / 2) % BIOMES.length, slot = index % 2;
      const seed = (this.worldSeed + Math.imul(index + 1, 2654435761) + Math.imul(this.cycle + 1, 1013904223)) >>> 0;
      const plan = this.chooseTable(biome, slot, index, seed), startIndex = this.objects.length;
      this.buildTable(plan, base, random(seed), index, biome);
      const valid = this.validateTable(plan, biome, base, startIndex, slot);
      this.modules.push({ index, kind: valid ? plan : TABLE_DECKS[biome][slot][0], biome, y: base, slot, role: TABLE_ROLES[slot], seed, difficulty: slot + 1, entry: { x: 280, y: base + 190, vx: 0, vy: -110 }, exit: 'spirit-bridge', name: CHAMBER_NAMES[index % 6], table: index });
      this.generated += TABLE_H;
    }
  }

  gainLife(reason) { if (this.lives < 7) { this.lives++; this.emit('bell', reason + ' · +1 collar bell'); } else this.emit('bell', 'Your seven collar bells are already whole.'); }
  addScore(n) { this.score += n; }
  burst(x, y, color, n = 14) { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; this.particles.push({ x, y, vx: Math.cos(a) * (40 + this.effectRandom() * 100), vy: Math.sin(a) * 120, life: 1, color }); } }
  completeAdventure(nextTableBase) {
    const completed = BIOMES[this.biome].name;
    this.checkpoint = nextTableBase; this.safePoint = this.checkpoint; this.maxHeight = Math.max(this.maxHeight, this.checkpoint); this.persistCheckpoint();
    const keepFrom = this.checkpoint - 600;
    this.objects = this.objects.filter(object => object.y >= keepFrom);
    this.modules = this.modules.filter(module => module.y >= keepFrom);
    this.generationIssues = this.generationIssues.filter(issue => issue.y >= keepFrom);
    this.adventure++;
    this.tableIndex = Math.floor(nextTableBase / TABLE_H); this.camera = nextTableBase;
    if (this.adventure >= (this.cycle + 1) * BIOMES.length) { this.state = 'summit'; this.emit('summit'); return; }
    this.biome = this.adventure % BIOMES.length; this.rescuedInAdventure = 0;
    this.emit('adventure', completed + ' healed · two cat spirits are free. Next adventure: ' + BIOMES[this.biome].name + '.');
    this.beginAdventure(nextTableBase);
  }
  beginAdventure(tableBase = this.tableIndex * TABLE_H) { this.tableIndex = Math.floor(tableBase / TABLE_H); this.camera = this.tableIndex * TABLE_H; this.state = 'playing'; this.resumeFromRecovery(); this.emit('checkpoint', BIOMES[this.biome].name + ' table begins · rescue ' + this.rescueTarget + ' cat spirits.'); }
  rescueCat(cat, x) {
    const boostedRescue = this.rescueBoost && (cat.requiredHits || 3) > 1;
    const marks = boostedRescue ? 2 : 1;
    if (boostedRescue) { this.rescueBoost = 0; this.emit('booster', 'Portal pulse used · two rescue marks.'); }
    cat.hits = Math.min(cat.requiredHits || 3, cat.hits + marks); this.skillProfile.rescueHits += marks;
    if (cat.hits < (cat.requiredHits || 3)) { this.emit('rescue', 'Rescue pulse · ' + cat.hits + '/' + (cat.requiredHits || 3)); return false; }
    cat.dead = true;
    this.objects.push({ type: 'spirit', x, y: cat.y, r: 18, table: cat.table });
    const clue = this.objects.find(o => o.type === 'clue' && o.table === cat.table); if (clue) { clue.hidden = false; this.discover(clue.clue); }
    this.freed++; this.rescuedInAdventure++; this.addScore(200); this.emit('spirit', 'A cat spirit is free. “The trail is brighter now.”'); this.burst(x, cat.y, '#b8f8d8', 30);
    if (this.rescuedInAdventure >= this.rescueTarget) this.emit('table-ready', 'The upper root scoop is open.');
    return false;
  }

  tableCats(base = this.tableIndex * TABLE_H) { return this.objects.filter(object => object.type === 'cat' && object.adventure === this.adventure && object.y >= base && object.y < base + TABLE_H); }
  transferIsOpen(transfer) { const cats = this.tableCats(transfer.table * TABLE_H); return cats.length > 0 && cats.every(cat => cat.dead); }
  advanceTable() {
    if (this.transition) return;
    this.transition = { kind: 'ascent', elapsed: 0, duration: 1.2, x: this.ball.x, y: this.ball.y, fromCamera: this.camera };
    this.transit = null; this.state = 'transition'; this.emit('transfer');
  }
  finishTableTransfer() {
    this.transition = null; this.state = 'playing';
    const nextTableBase = (this.tableIndex + 1) * TABLE_H;
    if (this.rescuedInAdventure >= this.rescueTarget) { this.completeAdventure(nextTableBase); return; }
    this.tableIndex++; this.camera = nextTableBase; this.safePoint = Math.max(this.safePoint, nextTableBase); this.maxHeight = Math.max(this.maxHeight, nextTableBase);
    this.generate(this.camera + 1800); this.resumeFromRecovery(); this.emit('transfer', '', { x: this.ball.x, y: this.ball.y, table: this.tableIndex });
  }

  discover(index) {
    const clues = ['A muddy pawprint on the chrome. He came this way.', 'A red thread from his collar, woven into the petals.', 'A bark ripples through the cathedral water.', 'The freed spirit remembers a dog sharing its shelter.', 'His chewed tennis ball is warm, despite the frozen clock.', 'Beyond this sky: two familiar ears, and another doorway.'];
    if (!this.discoveries.some(d => d.index === index)) { this.discoveries.push({ index, text: clues[index % clues.length] }); this.emit('story', clues[index % clues.length]); }
  }

  enterRoom(portal) {
    if (this.room || !POCKETS[portal.kind]) return;
    portal.used = true; this.skillProfile.portalChoices++;
    this.room = { kind: portal.kind, camera: this.camera, objects: this.objects, elapsed: 0, collected: 0, entranceSafePoint: this.safePoint, returnSide: this.ball.x < 210 ? 0 : 1 };
    this.objects = buildPocket(portal.kind); this.camera = 0; this.material = POCKETS[portal.kind].material;
    this.echoHistory = []; this.echo = null; this.foldLock = 0; this.resumeFromRecovery(); this.seen.add(portal.kind); this.emit('portal');
  }
  exitRoom() {
    const room = this.room; if (!room) return;
    this.objects = room.objects; this.camera = room.camera; this.room = null; this.material = 'spirit'; this.echo = null; this.echoHistory = [];
    this.resumeFromRecovery(room.returnSide);
    if (room.collected >= 3) { this.gainLife('Pocket constellation completed'); this.shield = 1; this.rescueBoost = 1; this.emit('shield'); }
    this.addScore(250); this.emit('story', 'Another world discovered.');
  }

  loseLife() {
    const fromRoom = !!this.room;
    if (this.room) { this.objects = this.room.objects; this.camera = this.room.camera; this.safePoint = this.room.entranceSafePoint; this.room = null; this.material = 'spirit'; this.echo = null; this.echoHistory = []; }
    this.tableIndex = Math.floor(this.safePoint / TABLE_H); this.camera = this.tableIndex * TABLE_H;
    if (this.shield) { this.shield = 0; this.resumeFromRecovery(); this.emit('shield', 'Spirit Shield held the fall · returning to your last safe point.'); return; }
    this.material = 'spirit'; this.echo = null; this.transit = null; this.lives--; this.skillProfile.falls++; this.roleSkill().falls++; this.shake = 12;
    if (this.lives <= 0) { this.lives = 0; this.state = 'gameover'; this.emit('gameover', 'Even little spirits need a second chance.'); return; }
    this.resumeFromRecovery(); this.emit('lost', (fromRoom ? 'Portal room ended · ' : 'Center drain crossed · ') + 'one bell fades. Returning from above the last safe point.');
  }

  continueCheckpoint() {
    this.lives = 7; this.safePoint = this.checkpoint; this.tableIndex = Math.floor(this.checkpoint / TABLE_H); this.camera = this.tableIndex * TABLE_H;
    this.maxHeight = this.checkpoint; this.adventure = Math.floor(this.tableIndex / 2); this.biome = this.adventure % 3; this.rescuedInAdventure = 0;
    this.objects = []; this.modules = []; this.generated = this.camera; this.generate(this.camera + 1800);
    if (this.prologue) { this.prologueHits = 0; this.buildPrologue(); }
    this.state = 'playing'; this.resumeFromRecovery(); this.emit('checkpoint');
  }
  continueEndless() { this.cycle++; this.adventure = this.cycle * BIOMES.length; this.biome = this.adventure % BIOMES.length; this.rescuedInAdventure = 0; this.state = 'playing'; this.generate(this.maxHeight + 1800); this.beginAdventure(this.tableIndex * TABLE_H); this.emit('story', 'Universe ' + (this.cycle + 1) + ' · More cat spirits need your help.'); }

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

  reflectSurface(b, a, end, restitution = .8) {
    const hit = segmentHit(b, a, end), dx = b.x - hit.x, dy = b.y - hit.y, distance = Math.hypot(dx, dy);
    if (distance >= b.r + 6) return false;
    const nx = distance ? dx / distance : 0, ny = distance ? dy / distance : 1, incoming = b.vx * nx + b.vy * ny;
    b.x = hit.x + nx * (b.r + 6.1); b.y = hit.y + ny * (b.r + 6.1);
    if (incoming < 0) { b.vx -= (1 + restitution) * incoming * nx; b.vy -= (1 + restitution) * incoming * ny; }
    return true;
  }
  applyGuardRails(b) {
    for (const guard of this.guards()) if (this.reflectSurface(b, guard.a, guard.b, .65)) this.emit('rail');
    // Connected lower inlanes physically guide both outside gaps to their flipper pivots.
    for (const side of [0, 1]) {
      const mirror = x => side ? W - x : x;
      this.reflectSurface(b, { x: mirror(63), y: this.camera + 70 }, { x: mirror(105), y: this.camera + 94 }, .55);
    }
  }

  applyEnvironments(b, h) {
    for (const o of this.objects) {
      if (o.table !== undefined && o.table !== this.tableIndex || this.prologue && o.introPhase === 'multiverse') continue;
      if (o.type === 'flow' && b.x >= o.x && b.x <= o.x + o.w && b.y >= o.y && b.y <= o.y + o.h) {
        if (o.sluice && this.mechanism()?.done.includes('ramp')) continue;
        b.vx += o.dir * o.strength * h;
      }
      if (o.type === 'well') {
        const dx = o.x - b.x, dy = o.y - b.y, d = Math.hypot(dx, dy);
        if (d < o.r && d > 1) { b.vx += dx / d * o.strength * h; b.vy += dy / d * o.strength * h; }
      }
    }
    if (this.room?.kind === 'side' && b.y > 285) { b.vx += 390 * h; b.vy += 410 * h; }
    if (this.room?.kind === 'scale') b.r = b.y < 280 ? 13 : b.x < 210 ? 9 : 19;
    this.foldLock = Math.max(0, this.foldLock - h);
    if (this.room?.kind === 'mirror' && this.foldLock === 0 && b.y > 285 && Math.abs(b.x - 210) < b.r) {
      b.x = b.vx > 0 ? 80 : 340; b.vx = -b.vx; this.foldLock = .6; this.emit('fold');
    }
  }

  step(dt) {
    if (this.state === 'transition') {
      this.time += dt;
      const tr = this.transition; tr.elapsed += dt;
      const p = clamp(tr.elapsed / tr.duration, 0, 1), smooth = p * p * (3 - 2 * p);
      if (tr.kind === 'ascent') {
        this.camera = tr.fromCamera + TABLE_H * smooth;
        this.ball.x = tr.x + (280 - tr.x) * smooth; this.ball.y = tr.y + (tr.fromCamera + TABLE_H + 190 - tr.y) * smooth;
      } else {
        const pull = clamp((p - .35) / .65, 0, 1);
        this.ball.x = tr.x + (280 - tr.x) * pull + Math.sin(p * Math.PI * 4) * 20 * (1 - p);
        this.ball.y = tr.y + (190 - tr.y) * pull + Math.sin(p * Math.PI) * 75 * (1 - pull);
      }
      this.updateTrail(dt);
      if (p === 1) { if (tr.kind === 'ascent') this.finishTableTransfer(); else this.finishPrologue(); }
      return;
    }
    if (this.state !== 'playing') return;
    this.time += dt; this.shake *= .9; this.strikeLock = Math.max(0, this.strikeLock - dt); this.guardLock = Math.max(0, this.guardLock - dt); /* Shot provenance lasts until the next flipper return, not a hidden timer. */
    if (this.reboundCue) { this.reboundCue.life -= dt; if (this.reboundCue.life <= 0) this.reboundCue = null; }
    for (let i = 0; i < 2; i++) {
      if (this.input[i] && !this.previousInput[i]) this.tapWindow[i] = .16;
      else this.tapWindow[i] = Math.max(0, this.tapWindow[i] - dt);
      this.previousInput[i] = this.input[i];
      this.flips[i] += ((this.input[i] ? 1 : 0) - this.flips[i]) * Math.min(1, dt * 24);
    }
    const b = this.ball;
    this.updateEcho();
    if (this.transit) { this.stepTrack(dt * (this.room?.kind === 'time' ? .58 : 1)); return; }
    if (this.catching !== null) {
      const side = this.catching, f = this.flipper(side);
      if (this.input[side]) {
        b.x = f.x + (f.ex - f.x) * this.catchPosition;
        b.y = f.y + (f.ey - f.y) * this.catchPosition + b.r + 10;
        b.vx = 0; b.vy = 0;
        this.updateTrail(dt);
        return;
      }
      const passing = !this.input[side] && this.input[1 - side];
      this.catching = null; this.strikeLock = .12;
      b.vx = (side === 0 ? 1 : -1) * (passing ? 260 : 105);
      b.vy = passing ? 200 : 35;
      this.emit(passing ? 'pass' : 'release', '', { side, x: b.x, y: b.y });
    }
    if (this.room) this.room.elapsed += dt;
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
        const lateral = quality ? 30 + quality * quality * 420 + fan * 80 : 36;
        b.vx = sign * Math.max(28, lateral);
        this.reboundCue = { x: b.x, y: b.y, vx: b.vx, vy: b.vy, life: .22 };
        this.tapWindow[i] = 0; this.railRescues = quality ? 0 : this.railRescues;
        this.catching = !quality && this.input[i] ? i : null;
        if (this.catching !== null) { this.catchTime = Infinity; this.catchPosition = hit.t; b.vx = 0; b.vy = 0; }
        this.strikeLock = .13;
        this.shotCommit = quality > .4 ? 1 : 0;
        this.shot = quality > .4 ? { id: ++this.shotSerial, side: i } : null;
        if (quality > .4 && !this.room && !this.prologue) this.roleSkill().attempts++;
        if (!quality) this.chain = [];
        this.emit(perfect ? 'perfect' : quality ? 'flip' : 'catch', '', { x: b.x, y: b.y, side: i, quality, fan }); this.burst(b.x, b.y, BIOMES[this.biome].color, perfect ? 16 : quality ? 7 : 3);
        if (perfect) { this.perfects++; this.skillProfile.perfects++; this.shake = 4; }
        if (quality > .4 && this.lesson === 0) { this.lesson = 1; this.emit('tutorial', 'Good save. Release, then tap again just before contact to choose a stronger route.'); }
      }
    }

    for (const o of this.objects) {
      o.cool = Math.max(0, (o.cool || 0) - dt);
      if (o.dead || o.used || o.hidden || (o.table !== undefined && o.table !== this.tableIndex) || (this.prologue && o.introPhase === 'multiverse') || (!this.prologue && o.introPhase === 'prologue') ) continue;
      if (['mechanism', 'loom', 'spirit', 'clue', 'size-zone', 'fold', 'echo-mark', 'flow', 'well'].includes(o.type)) continue;
      if (o.type === 'surface' || o.type === 'moving' || o.type === 'rotor') {
        const surface = o.type === 'surface' ? { a: o, b: { x: o.ex, y: o.ey } } : movingSegment(o, this.time);
        this.reflectSurface(b, surface.a, surface.b, o.restitution ?? .82); continue;
      }
      if (o.type === 'track') {
        const distance = segmentHit(o, previousPosition, b).dist, pulse = this.rescueBoost && !this.room ? 8 : 0;
        if (o.cool === 0 && b.vy > 80 && this.shotCommit && this.trackOpen(o) && distance < o.r + pulse) {
          if (distance >= o.r && pulse) { this.rescueBoost = 0; this.emit('booster', 'Portal pulse caught the edge of the route.'); }
          this.beginTrack(o); return;
        }
        continue;
      }
      let x = o.x; if (o.type === 'cat' && !o.stationary) x += Math.sin(this.time * 1.3 + o.y) * 28;
      let dx = b.x - x, dy = b.y - o.y, dist = Math.hypot(dx, dy);
      const swept = segmentHit({ x, y: o.y }, previousPosition, b);
      if (swept.dist < dist) { dx = swept.x - x; dy = swept.y - o.y; dist = swept.dist; }
      if (o.type === 'rail') {
        if (o.type === 'rail' && o.link && !o.active) continue;
        const end = o.x + o.w, surface = o.y + (o.type === 'rail' ? (b.x - o.x) * o.slant * .28 : 0);
        if (b.x > o.x - 8 && b.x < end + 8 && Math.abs(b.y - surface) < b.r + 9 && b.vy < 0 && o.cool === 0) {
          if (o.type === 'break') { o.dead = true; this.addScore(75); this.burst(b.x, o.y, '#e4b4ff', 18); b.vy = 650; this.emit('hit'); }
          else {
            const aimed = o.aim === undefined || Math.sign(b.vx || o.aim) === o.aim;
            b.y = surface + b.r + 10; b.vy = aimed ? 720 : -Math.max(180, Math.abs(b.vy) * .5); b.vx = o.slant * (aimed ? 245 : 115); o.cool = .25;
            this.emit(aimed ? 'route' : 'hit', '', { x: b.x, y: o.y, aimed }); if (aimed) this.shake = 5;
          }
        }
      } else if (dist < b.r + o.r) {
        if ((o.type === 'switch' || o.type === 'break') && o.cool === 0) {
          if (o.active) continue;
          const nx = dx / (dist || 1), ny = dy / (dist || 1), dot = b.vx * nx + b.vy * ny;
          b.x = x + nx * (b.r + o.r + 1); b.y = o.y + ny * (b.r + o.r + 1);
          if (dot < 0) { b.vx -= 1.8 * dot * nx; b.vy -= 1.8 * dot * ny; }
          o.cool = .18;
          if (this.shotCommit) { o.active = true; if (o.type === 'break') o.dead = true; this.markGoal(o.goal); this.burst(x, o.y, '#c6ffe0', 10); }
          continue;
        }
        if (o.type === 'star' && !o.echoOnly) { o.dead = true; this.addScore(35); if (this.room) this.room.collected++; this.burst(x, o.y, '#f7d68b', 6); this.emit('collect'); }
        if (o.type === 'bell') { o.dead = true; this.gainLife('You found a marked bell'); this.burst(x, o.y, '#f7d68b'); }
        if (o.type === 'portal' && b.vy > 80 && this.shotCommit) { this.enterRoom(o); return; }
        if (o.type === 'transfer') {
          if (this.transferIsOpen(o)) { this.advanceTable(); return; }
          const nx = dx / (dist || 1), ny = dy / (dist || 1);
          b.x = x + nx * (b.r + o.r + 1); b.y = o.y + ny * (b.r + o.r + 1); b.vx = nx * 145; b.vy = -Math.max(210, Math.abs(b.vy) * .42);
          o.cool = .22; this.emit('gate-wait'); continue;
        }
        if (o.type === 'exit') { this.exitRoom(); return; }
        if (o.type === 'ceiling') {
          if (this.prologueHits >= (o.requiredHits || 2) && this.shotCommit) { this.beginPrologueBreak(); return; }
          const nx = dx / (dist || 1), ny = dy / (dist || 1);
          b.x = x + nx * (b.r + o.r + 1); b.y = o.y + ny * (b.r + o.r + 1);
          b.vx = nx * 120; b.vy = -Math.max(260, Math.abs(b.vy) * .48); o.cool = .2;
          this.emit('gate-wait', '', { x, y: o.y }); continue;
        }
        if ((o.type === 'bumper' || o.type === 'cat' || o.type === 'mandala' || o.type === 'gate') && o.cool === 0) {
          const nx = dx / (dist || 1), ny = dy / (dist || 1), gateOpen = o.type !== 'gate' || gateIsOpen(this.time, o.phase);
          if (o.type === 'gate' && gateOpen) { o.cool = .08; continue; }
          b.x = x + nx * (b.r + o.r + 1); b.y = o.y + ny * (b.r + o.r + 1);
          if (o.type === 'mandala') {
            const spin = mandalaSpin(this.time, o.phase);
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
            if (o.role === 'prologue-target' && !o.active) {
              o.active = true; this.prologueHits++;
              this.emit('prologue-target', '', { x, y: o.y, hits: this.prologueHits });
              if (this.prologueHits === 3) this.emit('ceiling-ready', '', { x: 210, y: 660 });
            }
          } else {
            const dot = b.vx * nx + b.vy * ny; if (dot < 0) { b.vx -= 1.8 * dot * nx; b.vy -= 1.8 * dot * ny; }
          }
          o.cool = .22; this.addScore(o.type === 'gate' && gateOpen ? 45 : 20); this.burst(x, o.y, BIOMES[this.biome].color); this.emit(o.type === 'mandala' ? 'mandala' : 'hit'); this.shake = 3;
          if (o.type === 'cat' && o.adventure === this.adventure && this.shotCommit > 0 && (!o.stationary || this.chamberReady())) { this.shotCommit = 0; if (this.rescueCat(o, x)) return; }
        }
      }
    }
    if (b.y > this.camera + 722) { b.y = this.camera + 722; b.vy = -Math.abs(b.vy) * .75; }
    const rescueBoundary = this.activeRescueBoundary();
    if (rescueBoundary && b.y + b.r > rescueBoundary.y && b.vy > 0) {
      b.y = rescueBoundary.y - b.r;
      b.vy = -Math.max(220, Math.abs(b.vy) * .55);
      this.reboundCue = { x: b.x, y: b.y, vx: b.vx, vy: b.vy, life: .32 };
      this.emit('rescue-boundary', '', { x: b.x, y: b.y });
    }
    if (!this.room) {
      if (this.recovering && b.y <= this.camera + H - 90) this.recovering = false;
      if (!this.recovering) this.maxHeight = Math.max(this.maxHeight, this.camera);
      this.safePoint = Math.max(this.safePoint, this.camera);
      this.generate(this.camera + 1800);
    }
    const crossedCenterDrain = !this.room && b.y < this.camera + 78 && b.x > 158 && b.x < 262;
    if (crossedCenterDrain || b.y < this.camera - 45) this.loseLife();
    this.updateTrail(dt);
  }
}

export function replayTrace(recording, options = {}) {
  if (recording.version !== undefined && recording.version !== 7) throw new Error('Replay version mismatch: expected living-machine version 7.');
  const trace = Array.isArray(recording) ? recording : recording.inputs;
  const game = new Game(() => {}, { ...options, seed: options.seed ?? recording.seed ?? 17, checkpoint: options.checkpoint ?? recording.checkpoint ?? null, ignoreSave: true, previewTable: recording.previewTable, previewPocket: recording.previewPocket, adaptationEnabled: recording.adaptationEnabled ?? false });
  game.start();
  for (const frame of trace) {
    if (frame === 7 || frame === 8 || frame === 9) { game.setAdaptation(frame === 9 ? game.adaptationEnabled : frame === 7); continue; }
    if (frame === 4 && game.state === 'gameover') { game.continueCheckpoint(); continue; }
    if (frame === 5 && game.state === 'summit') { game.continueEndless(); continue; }
    if (frame === 6 && game.state === 'adventure-complete') { game.beginAdventure(); continue; }
    if (game.state !== 'playing' && game.state !== 'transition') continue;
    game.input = [!!(frame & 1), !!(frame & 2)];
    game.step(1 / 120);
  }
  return { seed: game.worldSeed, version: game.generatorVersion, frames: trace.length, snapshot: game.snapshot(), generation: game.generationReport() };
}
