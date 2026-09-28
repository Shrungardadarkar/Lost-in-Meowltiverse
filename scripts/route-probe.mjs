// Developer-only bounded input search. Never runs in the shipped game.
// It manipulates inputs on cloned simulations, not objectives or ball positions.
import { Game, replayTrace } from '../engine.js';

function copy(game) {
  const data = Object.fromEntries(Object.entries(game).filter(([, value]) => typeof value !== 'function'));
  return Object.assign(new Game(() => {}, { ignoreSave: true }), structuredClone(data));
}
function progress(g) { return (!g.prologue ? 100 : g.prologueHits * 20) + g.tableIndex * 100 + g.freed * 15 + (g.mechanism()?.done.length || 0) * 5 + (g.room?.collected || 0) * 20; }
export function action(source, delay, side) {
  const g = copy(source), inputs = [], table = g.tableIndex, prologue = g.prologue;
  let inTrack = false;
  for (let i = 0; i < 660; i++) {
    const input = i < delay ? 0 : i < delay + 12 ? 1 << side : i > delay + 50 ? 3 : 0;
    inputs.push(input); g.input = [!!(input & 1), !!(input & 2)]; g.step(1 / 120);
    if ((!source.room && g.room) || g.lives < source.lives || g.state === 'gameover') return null;
    if (source.room && !g.room) return g.shield ? { g, inputs } : null;
    if (g.state === 'summit' || g.tableIndex !== table || g.prologue !== prologue) return { g, inputs };
    if (g.transit) inTrack = true;
    if (inTrack && !g.transit && g.state === 'playing') return { g, inputs };
    if (g.catching !== null && i > delay + 15) return { g, inputs };
  }
  return null;
}

export function findSequence(initial, goal, depth = 12) {
  let beam = [{ g: initial, inputs: [] }];
  const seen = new Set();
  for (let d = 0; d < depth; d++) {
    const next = [];
    for (const node of beam) for (const side of [0, 1]) for (let delay = 2; delay <= 62; delay += 2) {
      const result = action(node.g, delay, side); if (!result) continue;
      const inputs = [...node.inputs, ...result.inputs];
      if (goal(result.g)) return { g: result.g, inputs };
      const key = [progress(result.g), result.g.catching, Math.round(result.g.ball.x / 10), Math.round(result.g.ball.y / 10), Math.round(result.g.time % 2 * 2), result.g.mechanism()?.done.join(','), result.g.objects.filter(o => o.type === 'star').map(o => +!!o.dead).join('')].join('|');
      if (seen.has(key)) continue; seen.add(key); next.push({ g: result.g, inputs });
    }
    next.sort((a, b) => progress(b.g) - progress(a.g) || a.inputs.length - b.inputs.length);
    beam = next.slice(0, 10);
    if (!beam.length) break;
  }
  return null;
}

if (process.argv[1]?.endsWith('route-probe.mjs')) {
  const g = new Game(() => {}, { ignoreSave: true }); g.start();
  let current = g, trace = [];
  for (let stage = -1; stage < 6; stage++) {
    const result = findSequence(current, next => stage < 0 ? !next.prologue : next.tableIndex > stage || next.state === 'summit');
    if (!result) { console.log(JSON.stringify({ stage, reachable: false, note: 'Bounded search did not find a sequence; this is not proof of impossibility.' })); process.exitCode = 1; break; }
    current = result.g; trace.push(...result.inputs);
    console.log(JSON.stringify({ stage, reachable: true, frames: result.inputs.length, lives: current.lives, state: current.state }));
  }
  if (!process.exitCode) {
    const recording = { seed: 17, version: 7, inputs: trace, adaptationEnabled: false };
    const replay = replayTrace(recording);
    console.log(JSON.stringify({ replay: replay.snapshot, frames: trace.length }));
    if (process.argv.includes('--trace')) {
      const runs = []; for (const input of trace) { const last = runs.at(-1); if (last && last[0] === input) last[1]++; else runs.push([input, 1]); }
      console.log(JSON.stringify({ seed: 17, version: 7, adaptationEnabled: false, runs }));
    }
    if (replay.snapshot.state !== 'summit') process.exitCode = 1;
  }
}
