# Lost in Meowltiverse: contributor context

This is the shared context for people and agents working on the game. Read this file, [README.md](README.md), [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md), and [docs/BEHAVIORAL_DESIGN.md](docs/BEHAVIORAL_DESIGN.md) before proposing or changing gameplay.

## Source of truth and working agreement

- The GitHub repository is the public source of truth. Work in this repository; do not use sibling prototype folders as a competing source.
- Every meaningful change must update the relevant documentation in the same pull request. Update `CHANGELOG.md` for player-visible changes, `docs/DECISIONS.md` for durable design decisions, and a room card for new or materially changed rooms.
- Keep a pull request focused. Explain player impact, behavioral-design impact, validation, and documentation changes using the PR template.
- Do not add analytics, notification loops, monetization, countdown pressure, streaks, randomized rewards, or social comparison mechanics without an explicit owner decision documented in `docs/DECISIONS.md`.

## Game promise

The player controls only two floating flippers to guide a weighted cat-spirit orb up a surreal multiverse and find its lost dog friend. Solo play is recreational and discovery-led. The game aims for voluntary, satisfying flow—not compulsion or endless engagement.

## Psychological and behavioral design contract

Every mechanic, level, animation, reward, and UI change must support at least one of these needs without undermining another:

1. **Autonomy:** meaningful optional routes, no coercive return pressure.
2. **Competence:** one learnable demand at a time, clear feedback, fair recovery.
3. **Relatedness:** the dog trail, liberated cat spirits, and a compassionate world response.
4. **Rest:** a player can pause or leave without penalty and find a natural stopping point after each biome.

Main-climb physics are reliable. A portal introduces one temporary, telegraphed physics rule. Psychedelic visuals may surprise, but they must never obscure the flippers, collision surfaces, active rule, safe path, or fall boundary.

## Product constraints

- Touch and keyboard controls are equally supported.
- The collar-bell counter is capped at seven; a life is only earned through an explicit, deterministic action.
- Score is optional feedback in solo play. It must not gate story, access, survival, or recovery.
- Possessed cats are freed rather than destroyed.
- The false summit is a satisfying session boundary. Continuing to another universe is a deliberate player choice.
- Honor `prefers-reduced-motion`; avoid strobing, unbounded camera shake, and motion that conceals critical state.

## Architecture

- `engine.js`: deterministic fixed-step simulation, physics, progression, level objects.
- `game.js`: rendering, input, audio, HUD, overlays.
- `index.html` and `style.css`: accessible responsive shell.
- `tests/engine.test.mjs`: regression tests for rules and progression.
- `docs/`: project intent, behavioral rules, orchestration, design decisions, room cards, and playtest materials.
- `.codex/skills/`: reusable skills for agents working in this repository.

No framework, analytics backend, account system, or external runtime dependency is needed for the current prototype.

## Required validation

Run `npm test` and `node --check game.js` before committing. For UI or interaction changes, check keyboard, touch, 390×844 portrait, 768×1024 tablet, 1440×900 desktop, visible focus, and reduced motion. For design changes, complete the behavioral checklist in `docs/BEHAVIORAL_DESIGN.md`.

## Workflow routing

- Mechanic, reward, progression, or difficulty: use `.codex/skills/meowltiverse-flow-design`.
- New or changed level segment: use `.codex/skills/meowltiverse-level-authoring`.
- Animation, VFX, camera, or sound: use `.codex/skills/meowltiverse-motion-language`.
- Playtest data or feedback synthesis: use `.codex/skills/meowltiverse-playtest-review`.
- Preparing a contributor-facing change or release: use `.codex/skills/meowltiverse-release`.

See [docs/ORCHESTRATION.md](docs/ORCHESTRATION.md) for role boundaries and the review loop.
