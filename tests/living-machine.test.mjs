import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Game, replayTrace, TABLE_H } from '../engine.js';
import { buildLivingTable, buildPocket, validateChamber, POCKETS, movingSegment } from '../chambers.js';

const tick = (g, n = 1) => { for (let i = 0; i < n; i++) g.step(1 / 120); };
const make = (table = 0) => { const g = new Game(() => {}, { ignoreSave: true, previewTable: table }); g.start(); return g; };
function cradle(g, side = 0) {
  g.objects = []; g.input[side] = true; g.previousInput[side] = true; g.flips[side] = 1; g.strikeLock = 0;
  const f = g.flipper(side); g.ball = { x: f.x + (f.ex - f.x) * .6, y: f.y + (f.ey - f.y) * .6 + 16, vx: 0, vy: -150, r: 13, trail: [] }; tick(g);
}
function finishTrack(g, track) { g.beginTrack(track); for (let i = 0; i < 900 && g.transit; i++) tick(g); assert.equal(g.transit, null); }

test('authored contracts validate both mirrored variants of every chamber', () => {
  for (let table = 0; table < 60; table++) for (const variant of [false, true]) for (const assist of [false, true]) {
    const objects = buildLivingTable(table, table * TABLE_H, variant, assist);
    assert.deepEqual(validateChamber(objects, table * TABLE_H), []);
  }
});
test('contract rejects unreachable-by-contract endpoints and missing prerequisite providers', () => {
  const objects = buildLivingTable(0, 0); objects.find(o => o.type === 'track').points.at(-1).y = 120;
  objects.splice(objects.findIndex(o => o.type === 'switch'), 1);
  const errors = validateChamber(objects, 0); assert.ok(errors.some(e => e.startsWith('return:'))); assert.ok(errors.includes('missing-goal:switch'));
});
test('every opening chamber contains a real bell, rescue, clue and optional dimension', () => {
  const g = make(); g.generate(5400);
  for (let i = 0; i < 6; i++) for (const type of ['bell', 'cat', 'clue', 'portal', 'transfer', 'mechanism']) assert.equal(g.objects.filter(o => o.table === i && o.type === type).length, 1);
  assert.equal(new Set(g.objects.filter(o => o.type === 'portal').map(o => o.kind)).size, 6);
});
test('opening mechanics include a switch, loom, sluice, breakable seals and moving clock surfaces', () => {
  const roles = [0, 1, 2, 3, 4, 5].map(t => buildLivingTable(t, 0));
  for (const [i, type] of [[0, 'switch'], [1, 'loom'], [2, 'flow'], [3, 'break'], [4, 'moving'], [4, 'rotor'], [5, 'loom']]) assert.ok(roles[i].some(o => o.type === type));
});
test('held cradle is stable for ten seconds, with no life or altitude reward', () => {
  const g = make(); cradle(g); tick(g); const before = { ...g.ball }; tick(g, 1200);
  assert.equal(g.catching, 0); assert.equal(g.ball.vy, 0); assert.equal(g.ball.x, before.x); assert.equal(g.lives, 7); assert.equal(g.tableIndex, 0);
});
test('release plus opposite flipper makes a pass without creating shot credit', () => {
  const g = make(); cradle(g); g.input = [false, true]; tick(g); assert.equal(g.catching, null); assert.ok(g.ball.vx > 200); assert.equal(g.shotCommit, 0);
});
test('repeated side contacts do not teleport the ball into the drain', () => {
  const g = make(); g.objects = []; g.railRescues = 99; g.ball = { x: 68, y: 130, vx: -80, vy: -200, r: 13, trail: [] };
  tick(g); assert.ok(g.ball.x < 100); assert.notEqual(g.ball.y, 78); assert.equal(g.lives, 7);
});
test('drain recovery is a visible deterministic feed to the same table', () => {
  const g = make(2); g.ball.x = 210; g.ball.y = g.camera + 70; g.ball.vy = -200; tick(g);
  assert.equal(g.lives, 6); assert.equal(g.camera, 1800); assert.equal(g.ball.x, 280); assert.equal(g.ball.y, 1990);
});
test('committed shot credit does not disappear after .65 seconds', () => {
  const g = make(); g.objects = []; g.shotCommit = 1; g.ball = { x: 210, y: 620, vx: 0, vy: 0, r: 13, trail: [] }; tick(g, 85); assert.equal(g.shotCommit, 1);
});
test('tracks reject descending or uncommitted entries', () => {
  for (const [vy, credit] of [[-200, 1], [300, 0]]) { const g = make(1), o = g.objects.find(o => o.id === 'left'); g.ball = { x: o.x, y: o.y, vx: 0, vy, r: 13, trail: [] }; g.shotCommit = credit; tick(g); assert.equal(g.transit, null); }
});
test('each completed orbit physically returns to its specified flipper', () => {
  for (const id of ['left', 'right']) { const g = make(1), o = g.objects.find(o => o.id === id); finishTrack(g, o); assert.equal(g.ball.x, o.returnSide ? 280 : 140); assert.equal(g.ball.y, g.camera + 190); assert.equal(g.ball.vy, -110); assert.ok(g.mechanism().done.includes(id)); }
});
test('switch opens its ramp, without opening the spirit exit early', () => {
  const g = make(), ramp = g.objects.find(o => o.id === 'ramp'), exit = g.objects.find(o => o.id === 'exit-bridge');
  assert.equal(g.trackOpen(ramp), false); g.markGoal('switch'); assert.equal(g.trackOpen(ramp), true); assert.equal(g.trackOpen(exit), false);
  finishTrack(g, ramp); assert.equal(g.freed, 1); assert.equal(g.trackOpen(exit), true); assert.ok(g.objects.some(o => o.type === 'spirit')); assert.equal(g.discoveries.length, 1);
});
test('mandala requires two different lanes, not repeated hits on one', () => {
  const g = make(1); g.markGoal('left'); g.markGoal('left'); assert.deepEqual(g.mechanism().done, ['left']); assert.equal(g.trackOpen(g.objects.find(o => o.id === 'ramp')), false);
  g.markGoal('right'); assert.equal(g.trackOpen(g.objects.find(o => o.id === 'ramp')), true);
});
test('sanctuary needs two broken seals followed by a spirit strike', () => {
  const g = make(3); g.markGoal('seal-left'); g.markGoal('seal-right'); assert.equal(g.freed, 0);
  const cat = g.tableCats()[0]; g.shotCommit = 1; g.ball = { x: cat.x, y: cat.y - 30, vx: 0, vy: 400, r: 13, trail: [] }; tick(g); assert.equal(g.freed, 1);
});
test('a fixed seed produces stable plans; assistance never mutates existing geometry', () => {
  const a = make(), b = make(); assert.deepEqual(a.generationReport(), b.generationReport());
  const before = structuredClone(a.objects); a.setAdaptation(true); a.skillProfile.falls = 4; a.skillProfile.contacts = 8; a.generate(5400);
  assert.deepEqual(a.objects.slice(0, before.length), before); assert.ok(a.objects.filter(o => o.table === 2 && o.type === 'track').some(o => o.r === 34));
});
test('moving collision surfaces and rendered poses use the same clock', () => {
  const g = make(4), o = g.objects.find(o => o.type === 'rotor'); assert.notDeepEqual(movingSegment(o, 0), movingSegment(o, 2));
  g.objects = [o]; const pose = movingSegment(o, 0); g.ball = { x: pose.a.x + 20, y: pose.a.y + 10, vx: 0, vy: -200, r: 13, trail: [] }; tick(g); assert.ok(g.ball.vy > 0);
});
test('pocket objectives and exits fit inside the visible field for every rule', () => {
  for (const kind of Object.keys(POCKETS)) { const objects = buildPocket(kind); assert.equal(objects.filter(o => o.type === 'star').length, 3); assert.ok(objects.filter(o => o.type === 'star' || o.type === 'exit').every(o => o.y + o.r < 700 && o.y - o.r > 150)); }
});
test('pockets do not expire while the player rests in a cradle', () => {
  const g = make(); g.enterRoom({ kind: 'time' }); cradle(g); tick(g, 4000); assert.equal(g.room.kind, 'time'); assert.ok(g.room.elapsed >= 0); assert.equal(g.lives, 7);
});
test('all pocket rules return to the original objects, scale and stable material', () => {
  for (const kind of Object.keys(POCKETS)) { const g = make(2), objects = g.objects; g.enterRoom({ kind }); assert.equal(g.material, POCKETS[kind].material); g.exitRoom(); assert.equal(g.objects, objects); assert.equal(g.camera, 1800); assert.equal(g.ball.r, 13); assert.equal(g.material, 'spirit'); }
});
test('size zones change collision radius only above the flippers', () => {
  const g = make(); g.enterRoom({ kind: 'scale' }); Object.assign(g.ball, { x: 140, y: 430 }); g.applyEnvironments(g.ball, .01); assert.equal(g.ball.r, 9);
  g.ball.x = 290; g.applyEnvironments(g.ball, .01); assert.equal(g.ball.r, 19); g.ball.y = 200; g.applyEnvironments(g.ball, .01); assert.equal(g.ball.r, 13);
});
test('mirror crossing has a bounded cooldown and changes horizontal momentum', () => {
  const g = make(); g.enterRoom({ kind: 'mirror' }); Object.assign(g.ball, { x: 209, y: 400, vx: 100 }); g.applyEnvironments(g.ball, .01); assert.equal(g.ball.x, 80); assert.equal(g.ball.vx, -100);
  g.ball.x = 209; g.applyEnvironments(g.ball, .01); assert.equal(g.ball.x, 209);
});
test('a gravity well changes direction locally without affecting the lower table', () => {
  const g = make(); g.enterRoom({ kind: 'side' }); Object.assign(g.ball, { x: 250, y: 430, vx: 0, vy: 0 }); g.applyEnvironments(g.ball, .1); assert.ok(g.ball.vx > 0);
  Object.assign(g.ball, { x: 140, y: 190, vx: 0, vy: 0 }); g.applyEnvironments(g.ball, .1); assert.equal(g.ball.vx, 0);
});
test('marked bells are consumed once and never exceed seven', () => {
  const g = make(), bell = g.objects.find(o => o.type === 'bell'); g.ball = { x: bell.x, y: bell.y, vx: 0, vy: 0, r: 13, trail: [] }; g.lives = 6; tick(g); assert.equal(g.lives, 7); assert.equal(bell.dead, true); tick(g); assert.equal(g.lives, 7);
});
test('ascent transitions can pause and end with a valid playing state', () => {
  const g = make(); g.advanceTable(); tick(g, 20); const camera = g.camera; g.state = 'paused'; tick(g, 100); assert.equal(g.camera, camera);
  g.state = 'transition'; tick(g, 150); assert.equal(g.transition, null); assert.equal(g.state, 'playing'); assert.equal(g.tableIndex, 1);
});
test('checkpoint retry rebuilds objectives rather than mixing old and rescued state', () => {
  const g = make(2); g.checkpoint = 1800; g.tableCats()[0].dead = true; g.rescuedInAdventure = 1; g.continueCheckpoint(); assert.equal(g.rescuedInAdventure, 0); assert.ok(g.tableCats().every(c => !c.dead));
});
test('input-only recording completes cabinet, all six chambers and false summit', () => {
  const recording = JSON.parse(readFileSync(new URL('./fixtures/first-universe.json', import.meta.url)));
  recording.inputs = recording.runs.flatMap(([input, count]) => Array(count).fill(input));
  const a = replayTrace(recording), b = replayTrace(recording); assert.deepEqual(a, b);
  assert.equal(a.snapshot.state, 'summit'); assert.equal(a.snapshot.tableIndex, 6); assert.equal(a.snapshot.prologue, false); assert.equal(a.snapshot.lives, 7); assert.equal(a.generation.issues.length, 0);
});
test('false summit never starts the next universe by elapsed time', () => {
  const g = make(5); g.rescuedInAdventure = 2; g.advanceTable(); tick(g, 150); assert.equal(g.state, 'summit'); tick(g, 1200); assert.equal(g.tableIndex, 6); assert.equal(g.state, 'summit'); g.continueEndless(); assert.equal(g.state, 'playing'); assert.equal(g.cycle, 1);
});

for (const recording of JSON.parse(readFileSync(new URL('./fixtures/pockets.json', import.meta.url)))) {
  test('input-only constellation and return: ' + recording.previewPocket, () => {
    const inputs = recording.runs.flatMap(([input, count]) => Array(count).fill(input));
    const result = replayTrace({ ...recording, inputs });
    assert.equal(result.snapshot.room, null); assert.equal(result.snapshot.lives, 7); assert.equal(result.snapshot.material, 'spirit');
    // Re-run live so the reward, not merely an early exit, is verified.
    const g = new Game(() => {}, { ignoreSave: true, previewTable: 0, previewPocket: recording.previewPocket }); g.start();
    for (const input of inputs) { g.input = [!!(input & 1), !!(input & 2)]; tick(g); }
    assert.equal(g.shield, 1); assert.equal(g.rescueBoost, 1);
  });
}
test('shielded pocket falls restore main-world material and clear the echo', () => {
  const g = make(); g.enterRoom({ kind: 'echo' }); g.shield = 1; g.echo = { x: 1, y: 1 }; g.loseLife();
  assert.equal(g.lives, 7); assert.equal(g.room, null); assert.equal(g.material, 'spirit'); assert.equal(g.echo, null);
});
test('echo-only star waits for the ghost, not the primary orb', () => {
  const g = make(); g.enterRoom({ kind: 'echo' }); const star = g.objects.find(o => o.echoOnly);
  g.ball = { x: star.x, y: star.y, vx: 0, vy: 0, r: 13, trail: [] }; tick(g); assert.ok(!star.dead);
  g.echoHistory = Array.from({ length: 91 }, () => ({ x: star.x, y: star.y })); g.updateEcho(); assert.equal(star.dead, true); assert.equal(g.room.collected, 1);
});
test('replays reject old physics versions and preserve assistance controls', () => {
  assert.throws(() => replayTrace({ version: 6, inputs: [] }), /version mismatch/);
  const result = replayTrace({ version: 7, inputs: [7, 0, 0, 9, 0, 8, 0] }); assert.equal(result.generation.adaptation, false);
});
test('Portal Pulse catches one marked route edge and is not wasted on normal entries', () => {
  for (const offset of [0, 32]) { const g = make(1), track = g.objects.find(o => o.id === 'left'); g.rescueBoost = 1; g.shotCommit = 1;
    g.ball = { x: track.x + offset, y: track.y - 3, vx: 0, vy: 300, r: 13, trail: [] }; tick(g);
    assert.equal(g.transit?.track.id, 'left'); assert.equal(g.rescueBoost, offset ? 0 : 1);
  }
});
test('direct developer pocket previews leave the cabinet state behind', () => {
  const g = new Game(() => {}, { ignoreSave: true, previewPocket: 'side' }); g.start(); assert.equal(g.prologue, false); assert.equal(g.room.kind, 'side'); g.exitRoom(); assert.equal(g.prologue, false); assert.ok(g.mechanism());
});
test('dog discoveries persist at checkpoints and fresh previews do not overwrite them', () => {
  const previous = globalThis.localStorage; let stored = null;
  globalThis.localStorage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };
  try {
    const g = new Game(); g.start(); g.discover(0); g.checkpoint = 1800; g.persistCheckpoint();
    const resumed = new Game(); resumed.start(); assert.equal(resumed.discoveries[0].index, 0); assert.equal(resumed.tableIndex, 2);
    const before = stored, fresh = new Game(() => {}, { ignoreSave: true }); fresh.checkpoint = 3600; fresh.persistCheckpoint(); assert.equal(stored, before);
  } finally { if (previous === undefined) delete globalThis.localStorage; else globalThis.localStorage = previous; }
});
