// Authored shot contracts. Coordinates use upward-positive world space.
export const POCKETS = {
  tide: { name: 'LIQUID MOON', cue: 'CURRENT →', material: 'water', color: '#79e9e3' },
  time: { name: 'HOURS BETWEEN', cue: 'SLOW TIME', material: 'glass', color: '#d4b5ff' },
  side: { name: 'SIDEWAYS SEA', cue: 'GRAVITY →', material: 'ember', color: '#ffb27d' },
  scale: { name: 'LITTLE / LARGE', cue: 'SIZE ◇ / ◯', material: 'opal', color: '#c8ef95' },
  mirror: { name: 'MIRROR FOLD', cue: 'FOLD ↔', material: 'chrome', color: '#b5dcff' },
  echo: { name: 'ECHO GARDEN', cue: 'ECHO ···', material: 'echo', color: '#efa6ee' }
};
export const CHAMBER_NAMES = ['Chrome Switchyard', 'Mandala Loom', 'Tide Cathedral', 'Spirit Sanctuary', 'Clockwork Bloom', 'False Summit'];
export const CONTRACT = { entry: { x: 280, y: 190, vx: 0, vy: -110 }, returnY: 190, minY: 170, maxY: 680, aperture: 28 };

function track(id, side, base, extra = {}) {
  const pts = [[154, 320], [60, 420], [54, 555], [94, 628], [210, 657], [335, 620], [369, 520], [365, 280], [312, 222], [280, 190]];
  if (side) for (const p of pts) p[0] = 420 - p[0];
  return { type: 'track', id, x: pts[0][0], y: base + pts[0][1], r: CONTRACT.aperture, points: pts.map(([x, y]) => ({ x, y: base + y })), returnSide: side ? 0 : 1, speed: 560, ...extra };
}

export function buildLivingTable(table, base, variant = false, assist = false) {
  const role = table % 6, objects = [], phase = table === 0 ? 'multiverse' : undefined;
  const add = (type, x, y, extra = {}) => { const o = { type, x, y: base + y, table, cool: 0, introPhase: phase, ...extra }; objects.push(o); return o; };
  const goals = [['switch', 'ramp'], ['left', 'right', 'ramp'], ['sluice', 'ramp'], ['seal-left', 'seal-right'], ['latch', 'ramp'], ['left', 'right', 'ramp']][role];
  add('mechanism', 210, 546, { kind: CHAMBER_NAMES[role], required: goals, done: [], r: 0, role });
  for (const side of [0, 1]) {
    const id = side ? 'right' : 'left';
    const goal = role === 2 ? 'sluice' : role === 4 ? 'latch' : id;
    objects.push({ ...track(id, side, base, { goal, label: side ? 'R' : 'L', r: assist ? 34 : 28 }), table, introPhase: phase });
  }
  add('track', 210, 428, { id: 'ramp', label: '↑', r: assist ? 30 : 23, goal: 'ramp', requires: goals.filter(g => g !== 'ramp'), timed: role === 4,
    points: [[210, 428], [210, 510], [262, 568], [305, 575], [342, 540], [344, 270], [294, 220], [280, 190]].map(([x, y]) => ({ x, y: base + y })), speed: 490, returnSide: 1 });
  add('cat', 210, 578, { r: 23, hits: 0, requiredHits: 1, adventure: Math.floor(table / 2), stationary: true });
  add('transfer', 210, 650, { r: 28 });
  // The freed spirit creates this final bridge. Its mouth is a distinct earned shot.
  add('track', 300, 390, { id: 'exit-bridge', label: '↗', r: 22, needsSpirit: true, exit: true, speed: 520,
    points: [[300, 390], [350, 460], [318, 577], [270, 623], [210, 650]].map(([x, y]) => ({ x, y: base + y })) });
  add('portal', 77, 536, { r: 22, kind: Object.keys(POCKETS)[role] });
  add('bell', 330, 460, { r: 12 });
  add('clue', 210, 612, { r: 12, clue: role, hidden: true });
  if (role === 0) add('switch', 210, 334, { r: 24, goal: 'switch' });
  if (role === 1 || role === 5) add('loom', 210, 516, { r: 56 });
  if (role === 2) add('flow', 242, 290, { w: 106, h: 180, dir: -1, strength: 180, sluice: true });
  if (role === 3) {
    add('break', 153, 362, { w: 46, r: 23, goal: 'seal-left' });
    add('break', 267, 406, { w: 46, r: 23, goal: 'seal-right' });
  }
  if (role === 4) {
    add('moving', 285, 378, { length: 72, amplitude: 24, frequency: .8, phase: 0, angle: .3 });
    add('rotor', 127, 526, { length: 75, phase: 0, frequency: .4 });
  }
  // Passive slings and solid inlanes; no invisible launch rails.
  for (const side of [0, 1]) {
    const sign = side ? -1 : 1, x = side ? 350 : 70;
    add('surface', x, 220, { ex: x + sign * 38, ey: base + 164, restitution: .8 });
  }
  if (variant) for (const o of objects) {
    o.x = 420 - o.x;
    if (o.ex !== undefined) o.ex = 420 - o.ex;
    if (o.points) { o.points = o.points.map(p => ({ ...p, x: 420 - p.x })); if (o.returnSide !== undefined) o.returnSide = 1 - o.returnSide; }
    if (o.type === 'flow') { o.x -= o.w; o.dir *= -1; }
  }
  return objects;
}

export function buildCabinet() {
  const objects = [track('cabinet-left', 0, 0, { goal: 'cabinet-left', label: 'I' }), track('cabinet-right', 1, 0, { goal: 'cabinet-right', label: 'II' }),
    { type: 'ceiling', x: 210, y: 635, r: 60, requiredHits: 2 },
    { type: 'bumper', x: 160, y: 466, r: 22 }, { type: 'bumper', x: 260, y: 466, r: 22 },
    { type: 'surface', x: 70, y: 220, ex: 108, ey: 164, restitution: .8 }, { type: 'surface', x: 350, y: 220, ex: 312, ey: 164, restitution: .8 }];
  return objects.map(o => ({ cool: 0, ...o, introPhase: 'prologue' }));
}

export function buildPocket(kind) {
  const objects = [track('pocket-left', 0, 0, { label: '↶' }), track('pocket-right', 1, 0, { label: '↷' }),
    { type: 'exit', x: 210, y: 620, r: 32 },
    ...[[147, 355], [275, 437], [210, 548]].map(([x, y], i) => ({ type: 'star', x, y, r: 16, echoable: true, echoOnly: kind === 'echo' && i === 1 }))];
  if (kind === 'tide') objects.push({ type: 'flow', x: 100, y: 280, w: 220, h: 200, dir: 1, strength: 200 });
  if (kind === 'time') objects.push({ type: 'gate', x: 210, y: 465, r: 24, phase: 0 });
  if (kind === 'side') objects.push({ type: 'well', x: 300, y: 450, r: 86, strength: 160, sideways: true });
  if (kind === 'scale') objects.push({ type: 'size-zone', x: 210, y: 440, r: 125 });
  if (kind === 'mirror') objects.push({ type: 'fold', x: 210, y: 410, r: 8 });
  if (kind === 'echo') objects.push({ type: 'echo-mark', x: 210, y: 470, r: 40 });
  return objects.map(o => ({ cool: 0, ...o }));
}

export function validateChamber(objects, base) {
  const errors = [];
  for (const o of objects) {
    if (!Number.isFinite(o.x + o.y) || o.x < 18 || o.x > 402 || o.y < base + 160 || o.y > base + 700) errors.push('bounds:' + o.type);
    if (o.points) {
      if (o.points.some(p => !Number.isFinite(p.x + p.y) || p.x < 31 || p.x > 389 || p.y < base + 170 || p.y > base + 700)) errors.push('track-bounds:' + o.id);
      const end = o.points.at(-1);
      if (!o.exit && (end.y !== base + CONTRACT.returnY || ![140, 280].includes(end.x))) errors.push('return:' + o.id);
      if (o.points.some((p, i) => i && Math.hypot(p.x - o.points[i - 1].x, p.y - o.points[i - 1].y) < 1)) errors.push('zero-segment:' + o.id);
    }
  }
  const mechanism = objects.find(o => o.type === 'mechanism');
  const mouths = objects.filter(o => o.type === 'track');
  for (let i = 0; i < mouths.length; i++) for (const b of mouths.slice(i + 1)) {
    const a = mouths[i]; if (Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r + 8) errors.push('overlapping-mouths:' + a.id + '/' + b.id);
  }
  if (!mechanism || !objects.some(o => o.type === 'cat') || !objects.some(o => o.type === 'transfer')) errors.push('missing-objective');
  if (mechanism) for (const goal of mechanism.required) if (!objects.some(o => o.goal === goal)) errors.push('missing-goal:' + goal);
  return errors;
}

export function movingSegment(o, time) {
  const angle = o.type === 'rotor' ? time * o.frequency + o.phase : o.angle;
  const x = o.x + (o.type === 'moving' ? Math.sin(time * o.frequency) * o.amplitude : 0);
  return { a: { x: x - Math.cos(angle) * o.length / 2, y: o.y - Math.sin(angle) * o.length / 2 }, b: { x: x + Math.cos(angle) * o.length / 2, y: o.y + Math.sin(angle) * o.length / 2 } };
}
