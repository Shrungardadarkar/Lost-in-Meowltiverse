# Project context

## Current product

*Lost in Meowltiverse* is a browser-first, portrait pinball climb. A reactive cat-spirit orb searches a strange vertical multiverse for its lost dog friend. The player has only two inputs: left and right flippers. The prototype uses hand-authored object types assembled into a deterministic procedural climb.

The current playable scope includes a single phone-sized playfield, Chrome Root, Tide Cathedral, Clockwork Bloom, authored climb-module decks, directional chevron bank rails, protected lower side rails, graded tap-timing flippers, living currents, interactive mandalas and rhythm gates, two pocket-dimension rules, Japanese-animation-inspired impact punctuation, possessed cats that become friendly spirits, seven collar bells, local biome checkpoint continuity, and a false summit that can continue into another universe.

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
- Chrome Root teaches catch and bank routes; Tide Cathedral's current changes trajectory; Clockwork Bloom uses mandala redirects and clearly cycling gates.
- Lower side rails return a near-miss once, then guide it toward the center; timing a fresh flipper tap at contact is the core climb skill.
- Chevron rails create high-value routes only when the orb enters with the matching lateral direction. Ordinary collisions are recovery, not automatic climb energy.
- Perfect flips, bank shots, and dimensional transitions receive short squash, speed-line, impact-zoom, and color-pulse moments; reduced-motion retains the underlying information without the flourish.
- The game uses only essential HUD information (bells, altitude, biome). Routine prompts and side-panel progression are deliberately absent.
- The game is surreal and psychedelic, but visual anomaly must clarify rather than disguise the active physics rule.
- The dog trail and released cat spirits create the emotional through-line.

## Near-term roadmap

1. Turn the implemented module deck patterns into full reviewed room cards and introduce a natural biome-rest beat.
2. Run short observational playtests and tune tap timing, side-rail safety, and portal readability from evidence.
3. Improve reduced-motion and screen-reader variants while retaining physics clarity.
4. Add final narrative art and more discovery moments before considering multiplayer.

Read the current evidence and priority order in [the full game review](reviews/2026-09-26-full-game-review.md).

Multiplayer, shared worlds, resource competition, accounts, analytics, monetization, and social systems are explicitly out of scope for this phase.
