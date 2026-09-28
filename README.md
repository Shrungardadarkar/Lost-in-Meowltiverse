# Lost in Meowltiverse

A portrait, two-flipper pinball adventure about a cat spirit searching for its lost dog friend. Begin inside a classic machine, break its ceiling, then reshape an endless psychedelic machine through deliberate shots.

[Published build](https://shrungardadarkar.github.io/Lost-in-Meowltiverse/) · [Current feature register](docs/FEATURE_REGISTER.md) · [Contributor context](AGENTS.md)

The local version may be ahead of the published build. Development is local-first; publishing requires the owner's explicit request.

## Play locally

Node.js 22 or newer; no dependencies or build step:

```sh
npm start
```

Open http://localhost:4173/?fresh=1 for a new run without changing a saved checkpoint.

- Left/right arrows, A/D, or the corresponding half of the playfield operate the flippers.
- Tap near contact to shoot. Timing and contact position change the shot angle. Hold a soft contact to cradle indefinitely; release then tap to shoot again. Release while pressing the opposite flipper for a pass.
- Light both numbered cabinet orbits, then shoot the cracked roof.
- Chamber mechanisms change real routes: switch → ramp, two lane petals → opening, sluice → current route, seals → rescued spirit, latch → timed gate. Lit tracks show their return; dashed tracks are not yet available.
- A freed spirit opens the exit bridge. Score never gates progress. Misses return to the flippers; the marked drain costs one of seven collar bells.
- Optional doors advertise their rule before entry. Each of six pocket types has three stars and an available return ring. Three stars grant a bell (capped at seven), shield and pulse; no countdown or forced exit.
- The gold shield outline protects one fall. The violet pulse outline catches one marginal route shot; its extra reach is drawn around open mouths.
- P, Escape, or Ⅱ pauses. Sound, assistance and the dog-trail journal are in pause only. No routine popups interrupt play.
- Every two chambers saves a biome checkpoint (180 displayed metres). The six-chamber false summit is at 540 metres; it waits for a fresh flipper input before another universe.

## Test and preview

```sh
npm test
npm run test:routes
node --check game.js
```

- `?fresh=1&dev=1`: pause contains a room-preview selector for the cabinet, all chambers and six pockets.
- `?fresh=1&dev=1&table=0` through `table=5`: direct chamber previews.
- `?fresh=1&dev=1&pocket=echo`: pocket preview; kinds are tide, time, side, scale, mirror, echo.
- Add `&reduced=1` to exercise reduced-motion rendering; the OS preference is also honored.
- Developer input capture: `window.meowltiverseDebug.getReplay()`. Replay with `replayTrace(recording)` from the engine. Captures include transitions and assistance setting changes. No data leaves the browser.

The developer route probe searches bounded input sequences on cloned simulations. It never changes the production game or substitutes objectives. The regression fixtures include a complete cabinet-to-summit journey and all pocket constellations. Human playtesting is still required for quality and comfort.

## Project map

| File | Responsibility |
| --- | --- |
| `engine.js` | Fixed-step physics, routes, goals, lives, progression, pockets, replay |
| `chambers.js` | Authored chambers, pocket contracts, geometry validation, moving-surface poses |
| `game.js` / `living-art.js` | Rendering, input, animation, audio and clean HUD |
| `index.html` / `style.css` / `options.css` | Responsive, aspect-correct phone shell and intentional pause UI |
| `tests/` / `scripts/route-probe.mjs` | Unit/contract regression, input-only witnesses, developer search |
| `docs/FEATURE_REGISTER.md` | Current implemented scope, evidence and honest limits |
| `docs/rooms/living-machine-chambers.md` | Current chamber/pocket authoring cards and cue sheet |

## Publish and contribute

An authorized push to main runs tests and publishes the static files through GitHub Pages; PRs only test. No backend, analytics or API keys. Follow [CONTRIBUTING.md](CONTRIBUTING.md), maintain the feature register, and separate prototype implementation from human acceptance. The original [GDD](GAME_DESIGN.md) and older reviews are historical proposals where they conflict with the current register.

Code and original artwork: [MIT](LICENSE). Third-party fonts retain their own licences.
