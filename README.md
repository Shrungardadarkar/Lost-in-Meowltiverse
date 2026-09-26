# Lost in Meowltiverse

A focused, phone-sized portrait pinball adventure about a cat spirit searching for its lost dog friend. Seven collar-bell lives, floating flippers, strange pocket dimensions, and a summit that is only the beginning.

**[Play in your browser](https://shrungardadarkar.github.io/Lost-in-Meowltiverse/)** · [Game design document](GAME_DESIGN.md) · [Contributing](CONTRIBUTING.md)

## Play

- Use **left/right arrows** or **A/D** to operate the flippers. Release, then tap as the orb meets a flipper: a timed tap creates the strong shot. Holding a key is deliberately not a substitute for timing.
- On mobile, tap either half of the playfield. Both sides support simultaneous touches.
- The lower side lanes are protected by inward guide rails; the center drain is the only bell-costing route at the base.
- Press **P** or **Escape** to pause. Enable optional sound with the music button.
- Hit glowing portals to enter low-gravity/current or slow-time rooms. Living currents push the orb, Clockwork mandalas redirect it, and rhythm gates make their open state visible. Collect three visible stardust in a room to restore one bell, then exit through the return ring or automatically after 30 seconds.
- Hit possessed cats twice to free them. Marked bells restore a life; lives never exceed seven.
- Each 150 displayed meters reaches a biome checkpoint. At zero bells, continue from that checkpoint. A voluntary local checkpoint save lets a player leave without losing their place. The false summit is at 450 meters, followed by another universe.

## Develop locally

Install Node.js 22 or newer. This game has no npm dependencies and no build step.

```sh
git clone https://github.com/Shrungardadarkar/Lost-in-Meowltiverse.git
cd Lost-in-Meowltiverse
npm start
```

Open http://localhost:4173. The local server is for development only. To check the simulation:

```sh
npm test
```

## Project map

| File | Purpose |
| --- | --- |
| `engine.js` | Fixed-step physics, timed flippers, authored module decks, living environments, portals, lives, checkpoints |
| `game.js` | Canvas artwork, input, audio, HUD, game loop |
| `style.css` / `index.html` | Responsive portrait game shell |
| `tests/engine.test.mjs` | Simulation and progression regression tests |
| `GAME_DESIGN.md` | Original game design and longer-term direction |

`window.meowltiverse` exposes the simulation for local debugging. Art is drawn in canvas; sound is synthesized. Fonts use Google Fonts with system fallbacks.

## Publishing

Pushes to `main` run the tests and deploy the four static game files to GitHub Pages. Pull requests run tests without deploying. The workflow can also be run manually from the Actions tab. No API keys or application backend are needed.

## Prototype status

This is an early solo prototype with three biome art languages, side-rail safety, tap-timing pinball physics, authored climb modules, living current and mandala interactions, two portal rule sets, spirit rescues, local checkpoint recovery, and endless continuation. More room cards, final narrative art, observational playtests, accessibility improvements, and multiplayer remain future work.

Contributions and playtest reports are welcome. Code and original project artwork are available under the [MIT license](LICENSE). Third-party fonts retain their own licenses.
