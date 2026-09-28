# Living machine — feature register

Current baseline: September 28, generator/replay version **7**. This register supersedes implementation claims in the original GDD, September 26 system plan and earlier room cards. Those files remain design history, not competing runtime specifications.

## Playable solo prototypes

| Audited feature | Implementation / player consequence | Evidence |
| --- | --- | --- |
| Traditional opening → multiverse | Two distinct orbit lanes light the roof; an earned roof shot triggers fracture, brief suspension, vibration and suction, with continuous orb movement | Full input-only first-universe replay includes opening |
| Pinball control and agency | Sustained cradle, release, opposite-flipper pass, timing/contact-point shot fan | Physics tests and input-driven routes |
| Fair returns | Connected physical side guides; no hidden rail-count teleport; shot credit survives long banks | Guard, drain, cradle and provenance regressions |
| Orbit / ramp / exit routes | Drawn constrained wireforms deliver to a specified flipper or next chamber; misses remain free-flight | Endpoint contracts, mouth separation, completion replay |
| Transforming levels | Switchyard resonance switch; two-lane Mandala Loom; Tide sluice; two-seal Sanctuary; Clockwork latch/timed ramp; combined False Summit | Goal/link tests and all six completed by real simulated inputs |
| Breakable blocks and bells | Seals are rendered and collide; one marked life pickup per table, cap seven | Collision, objective and life-cap tests |
| Moving collision geometry | Clockwork translating bridge and rotating beam share simulation/render poses | Pose/collision regression |
| Physical environments | Current region, local gravity source/side-gravity region, mirror seam and size zones | Force, fold-cooldown and collision-radius tests |
| Six pocket rules | Current/buoyancy, slow time, side gravity, small/large orb, mirror fold, delayed echo; one-screen objectives and immediate return ring, no expiry | Each has an input-only three-star completion + return recording |
| Portal Pulse | One clearly marked extra 8-unit route-edge catch; only consumed when it actually assists a shot. Shield and pulse have distinct orb outlines | Edge-capture and ordinary-entry regression |
| Materials | Water, glass, ember, opal, chrome and echo silhouettes represent the pocket's physical rule; normal spirit restored on every return | Material/scale/shielded-fall tests; no separate elemental combat system |
| Spirits and dog story | Freed spirit stays in the table, stitches exit bridge and reveals one of six clues; pause-only journal; clues saved at biome checkpoints | Objective replay discovers all six; journal render and persistence logic |
| Shot-chain audio | Distinct routes add notes to biome-specific synthesized motifs; optional sound, no score gate | Event-driven implementation; browser smoke check, subjective mix still to test |
| Anticipation / animation | Highlighted selected return, time-room future-flight dots, bounded impact cues and protected transfer camera; reduced-motion alternatives | Transition/pause tests and browser presentation checks |
| Endless generation | Six authored roles, mirrored later-cycle variants, seeded selection, structural contracts and safe fallback | 60-table × mirrored × assisted contract matrix |
| Bounded adaptation | Opt-in, local role attempts/routes/falls; wider future route mouths after difficulty, never live physics changes | Future-geometry immutability and replay-setting tests |
| Regression / learning loop | Versioned input capture, seven replay fixtures, developer-only bounded route search and inspectable generation/skill reports | `npm test`, `npm run test:routes` |
| Clean UX | One aspect-correct phone table; no routine message overlays; intentional start/pause/full-loss only | Browser checks; voluntary in-field summit |

## What this does not claim

- This is a coherent **prototype**, not a human-validated “world-class” level-design result. Human shot readability, feel, challenge and sensory-comfort sessions remain required.
- The generation system is **not autonomous machine learning or reinforcement learning**. It does not modify its own source or maximize time played. The learning loop is observation → reproduction → authored revision → regression.
- Mirrored variants are variations of six chamber roles, not a claim of twelve wholly distinct designed levels. Their structural contracts are checked; the recorded full journey covers the first cycle, not every later-cycle timing combination.
- Material identities express six pocket rules, not an inventory of elemental attacks. The echo is a delayed non-solid trace, not a second controllable ball.
- Final narrative animation, bespoke biome illustrations, professional sound mixing, physical-device multitouch testing and broader accessibility/playtest work remain production polish.
- Multiplayer, accounts, shared resources, monetization and analytics remain outside the approved solo scope.
- No source-backed Clash of Critters mechanic mapping was available in the research notes; do not attribute these implementations to that game.

## Regression discipline

The earlier assertions for three opening bumpers, expiring catches, automatic rail launches, off-screen pocket exits and uniform three-hit rescues were superseded, not silently kept as false specifications. Unchanged core physics/life/checkpoint tests remain in `tests/engine.test.mjs`; the new contracts and input fixtures are in `tests/living-machine.test.mjs`. A fixture is an input-only reachability witness, not a skill estimate or evidence of fun. When geometry deliberately changes, first inspect the old trace failure, then regenerate a witness with the route probe and review the new behavior.

No GitHub push, commit or deployment is part of this local implementation pass.
