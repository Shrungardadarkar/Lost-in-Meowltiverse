# Project context — current baseline

Lost in Meowltiverse is a local-first, browser/mobile-format solo pinball prototype. Two flippers guide a weighted cat spirit searching for a lost dog. Recreational agency, competence, discovery and voluntary stopping take precedence over retention.

## Current architecture and product

Read [FEATURE_REGISTER.md](FEATURE_REGISTER.md) for implemented scope, evidence and limits, and [the living-machine room cards](rooms/living-machine-chambers.md) for active level design. Those supersede the earlier scrolling modules, rescue-boundary tables and repeated three-hit objectives.

The opening has two orbit lanes and a roof escape. The first universe contains Chrome Switchyard, Mandala Loom, Tide Cathedral, Spirit Sanctuary, Clockwork Bloom and False Summit. Each role has a mirrored later-cycle variant. The lower flipper field stays stable; earned transfers relocate the same rig while the orb travels safely. Physical side guides never count contacts or teleport the orb into a drain. Held catches do not expire; fresh timing determines a directional shot. Shot credit does not use a hidden timeout.

Each chamber has a local transformative goal, friendly rescue/exit, visible bell and optional dimension. Pockets fit in one screen, have a return ring and never expire. The six pocket rules are buoyant current, slow time, sideways/local gravity, scale, mirror fold and delayed echo. Material silhouettes encode the active rule. Freed spirits link to a bridge and one of six dog clues; the journal appears only on intentional pause.

Checkpoints occur every two 900-unit chambers (180 displayed metres). The first false summit is 540 metres and requires a deliberate continuation input. Seven bells are the cap. Rewards are deterministic; score cannot buy progress. Ordinary chamber changes never open a modal.

## Contributor map

- engine.js: deterministic simulation, goals/progression, pocket rules and replay version 7.
- chambers.js: authored geometry, prerequisites, return contracts and shared moving-surface poses.
- game.js + living-art.js: input, audio, state cues and rendering.
- tests/*.test.mjs: rules and actual input-only progression witnesses.
- scripts/route-probe.mjs: developer-only bounded search, not live autoplay or self-training.
- docs/feature-review-living-machine.md: behavioral approval contract.
- docs/rooms/living-machine-chambers.md: current authoring/cue baseline.

## Non-negotiable decisions

Local work is not permission to commit, push or deploy. Preserve collaborator changes. Keep docs current in the same local change. No third control, mid-air steering, score gates, surprise timers, random recovery rewards, telemetry or compulsive incentives. Main physics remain stable; a pocket signals a temporary rule in shape/direction and color/text. Honor reduced motion and keep collisions/ball/flippers legible.

Generation is seeded authored composition, not free-form geometry or machine learning. Assistance is opt-in, records local role attempts/routes/falls and can widen future mouths. It cannot change existing geometry, physics or objectives. Do not describe this as autonomous self-learning.

## Acceptance still requiring people

Run the first-universe and pocket regressions, then observe aiming comprehension, recovery, route choice, pacing and sensory comfort with humans. Structural tests cannot certify world-class design. Physical-device multitouch and broader accessibility remain production acceptance tasks. Multiplayer and shared resource systems remain outside this solo phase.
