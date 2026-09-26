# Project context

## Current product

*Lost in Meowltiverse* is a browser-first, portrait pinball climb. A reactive cat-spirit orb searches a strange vertical multiverse for its lost dog friend. The player has only two inputs: left and right flippers. The prototype uses hand-authored object types assembled into a deterministic procedural climb.

The current playable scope includes Chrome Root, Tide Cathedral, Clockwork Bloom, two pocket-dimension rules, possessed cats that become friendly spirits, seven collar bells, biome checkpoints, and a false summit that can continue into another universe.

## Current truth in code

| Concern | Location |
| --- | --- |
| Simulation and progression | `engine.js` |
| Drawing, animation, input, audio, UI | `game.js` |
| Page structure and accessible labels | `index.html` |
| Responsive presentation and reduced motion | `style.css` |
| Rules regression suite | `tests/engine.test.mjs` |
| Long-form original design | `GAME_DESIGN.md` |

## Product decisions already made

- Discovery is the primary solo reward; score is secondary and does not gate progress.
- A fall removes one bell and restarts at the previous safe elevation. A full loss restores the current biome checkpoint.
- Every portal changes one local rule for a short pocket world and returns the player to stable main-climb physics.
- The game is surreal and psychedelic, but visual anomaly must clarify rather than disguise the active physics rule.
- The dog trail and released cat spirits create the emotional through-line.

## Near-term roadmap

1. Replace broad procedural repetition with authored room cards and tested module selection.
2. Add a natural biome-rest beat and an intentional session close.
3. Improve portal teaching, animation readability, and reduced-motion variants.
4. Run short observational playtests and tune challenge from evidence.
5. Add persistent save only after the session loop is proven.

Multiplayer, shared worlds, resource competition, accounts, analytics, monetization, and social systems are explicitly out of scope for this phase.
