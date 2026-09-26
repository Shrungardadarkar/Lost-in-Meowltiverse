# Lost in Meowltiverse: pinball systems and adaptive level plan

Status: **local implementation through contact-point shot fans, soft-catch/release feedback, swept contacts, bounded adaptation, seeded validation, and replay-stability tests; full room library and agent/fuzz gates remain future work**  
Working mode: **local-first**. Play and test at `http://localhost:4173/` in the Codex browser. Do not push to GitHub automatically; request a publish/review decision after a locally accepted milestone.

## Local integration note — 2026-09-26

Before this slice, `origin/main` was fast-forwarded from `cb288a4` to merge commit `c1b22b7`. The incoming `5e90a5c` work made two three-hit cat rescues the adventure objective and added Portal Pulse. The local implementation now includes ordinary bumper reflection, a linked optional bridge in Chrome Root, contact-point shot fans, soft-catch/release posture, swept circular contacts, bounded skill adaptation, seeded module metadata, geometry validation, replay-stability checks, and repeated-cycle generation checks. It does **not** yet implement a full room library, compatibility graph, agent playthroughs, or broad fuzz/property gate. The current suite covers these invariants; human playability of the rescue route still needs local observation.

## 1. Design thesis

Make the orb's route feel *chosen*, not merely witnessed. Two flippers remain the only controls. A player reads an incoming ball, decides when and which flipper to use, commits to a visible shot, observes its physical return, and either recovers or loses one of seven collar bells. The climb is endless, but each room has a small comprehensible goal and each biome offers a satisfying stopping point. Psychedelic transformations change what a shot *means* without making basic contact unpredictable.

“Engaging” here means rising competence, expressive decisions, coherent surprise, and curiosity about the dog and new worlds. It does **not** mean maximizing session length, distress, variable rewards, or retention.

## 2. Current build: evidence and gaps

The prototype already has a 120 Hz simulation, two flippers, a center drain, side guards, three biomes, portals, temporary room physics, mandalas, seven bells, checkpoints, and 20 passing tests. Its current strengths are an approachable input scheme and clear overall fantasy. Its limitations are structural:

| System | Current behavior | Consequence | Needed change |
| --- | --- | --- | --- |
| Shot control | A recent press produces a largely preset upward impulse; idle contact produces a weak bounce. | Tap timing changes power but gives little precision or ball control. | Contact-point-dependent shot fan, predictable feeds, and controlled catches/transfers using the same two buttons. |
| Playfield | Bumpers, rails, and mandalas often give strong upward velocity on contact. | The environment can do the climbing for the player. | Make assists route or rescue the ball, not complete mastery shots. Require deliberate flipper shots for key progress. |
| Room grammar | Ten object patterns are selected from biome arrays in a five-module cycle. | Endless distance repeats a small set of arrangements and demands. | More authored room cards, route metadata, compatibility constraints, and novelty limits. |
| Portals | Touch enters a side room; room contents are mostly a repeated stack. | Branching is physical but not always a meaningful choice. | Portals become readable shot targets with optional challenge, alternate return feeds, and discoveries. |
| Physics | Discrete collision checks and several velocity assignments override incoming momentum. | High-speed misses may tunnel; varied surfaces can feel like hidden launchers. | Continuous/swept collision for fast motion; impulse response, restitution, and explicit powered devices. |
| Camera and effects | Simple follow, zoom/flash, and event effects. | Dramatic moments can obscure anticipation or feel generic. | Anticipatory framing and short stylized accent shots, with ball/flippers always legible and reduced-motion equivalents. |
| Validation | Unit tests cover invariants; one timed-tap bot reaches >800 altitude. | No proof that generated routes to a summit are completable, fair, or diverse. | Seeded replay, agent playthroughs, reachability/property tests, human playtest gates. |

These are observations from `engine.js`, `game.js`, and `tests/engine.test.mjs`, not claims that the present game is broken. The full game still needs human playtesting to establish which faults are most noticeable.

## 3. Pinball fundamentals translated to an endless vertical climb

### 3.1 The shot loop

Traditional pinball gets depth from a cycle: **feed → control → aim → shot → result → return**. A ramp or orbit is valuable not just because it scores; its exit gives the player a new flipper opportunity. In this game, every major room should have a visible input feed, at least one skilled shot, an understandable return, and an escape or recovery path. The camera can scroll, but the lower flippers remain the stable decision anchor.

### 3.2 Ball control without adding buttons

- **On-the-run shot:** tap as the ball reaches a flipper; early/late timing and contact position alter angle, not merely power.
- **Soft catch:** hold a flipper before contact to bleed energy and settle the orb briefly. The held state must not launch it high or grant free progress.
- **Release shot:** release and tap again to strike from the controlled position. A short, readable window; no perfect-frame requirement.
- **Transfer/pass:** choose not to shoot and let a safe bank or low-angle nudge cross to the other flipper. This creates left/right decisions without a third input.
- **Dead bounce:** if the orb arrives safely, leaving a flipper down can rebound or cross-feed it. This must be a deliberate low-risk option, not an idle autoplay climb.
- **Recovery shot:** a late tap can save the ball but should usually return to a low lane rather than receive the strongest route impulse.

We should prototype each in an isolated local test board before redesigning many rooms. The exact timings and coefficients are tuning values, not promises. Avoid “hold both” as a dominant strategy by making held flippers catch/settle, not climb, while preserving fair safety.

### 3.3 Physics contract

Main-climb gravity, ball mass, surface friction/restitution, flipper torque, and wall bounces remain consistent. Momentum is conserved/redirected where possible; powered bumpers, launch rails, and magic surfaces are visually and audibly distinct. The orb never teleports through solid geometry without a marked portal. Fast motion uses swept collision or substeps so the ball cannot miss thin surfaces. The screen-side boundaries feed back inward; only the center drain is a life-losing fall. When a portal changes gravity, scale, time, or dimension, preview that rule before entry, preserve it for the entire pocket room, then restore normal main-climb behavior on exit.

### 3.4 Shot vocabulary and player agency

Start with five teachable shot families, each with a readable target, a return path, and at least two outcomes:

1. **Catch and choose:** settle an incoming feed, then shoot either a safe main lane or a riskier portal lane.
2. **Bank transfer:** strike a marked angled surface to transfer across the board; wrong angle returns to a recoverable flipper.
3. **Timed gate:** read a visible opening cycle, choose whether to shoot now or hold for one cycle; misses return, rather than disappear randomly.
4. **Orbit/rail:** a precise shot circles upward then delivers a satisfying return feed to the opposite flipper for a combo.
5. **Rescue shot:** a threatened cat or falling fragment can be saved with a challenging, explicitly optional shot that yields story or a bounded reward.

The main route needs actual input. Side targets and scenic rebounds may create momentum and surprise, but no room should be fully solvable by repeated wall/bumper impulses with both buttons idle or held.

## 4. Level and pacing architecture

### 4.1 A room is a question

Each module answers one design question: “Can I catch?”, “Which route do I choose?”, “Can I time this gate?”, “Can I recover from a miss?” Do not combine multiple new physics rules in the same first exposure. Use **preview → safe practice → variation → mastery shot → release/return**. One room can occupy several beats, but the player should know what it asks before committing a bell.

Create 8–12 authored cards per biome before expecting procedural assembly to carry an endless climb. Cards specify input feed, geometry, expected ball-speed envelope, controllable flipper, target windows, miss routes, portal branch, reward, story fragment, and exit state. The procedural system composes and parameterizes these cards; it does not invent arbitrary obstacle soup.

### 4.2 Three layers of routes

- **Main route:** reliable, visible, requires one or two intentional shots, returns the orb to a readable feed on a miss. A novice can make progress with practice.
- **Express route:** harder angle/timing, faster climb, score or collectible, but never required for story or basic progress.
- **Discovery route:** optional portal or cat-spirit shot; a different physical space and clue, not an obligation. Entry occurs only on ball contact.

The player should recognize a portal before they can accidentally enter it. Use target silhouette, aim chevrons, and a stable approach lane, not text popups. A portal preview hints at the one rule that will change. On return, re-enter at a known feed and tempo.

### 4.3 Difficulty rhythm

Within a ~1–2 minute play attempt, alternate high-focus shots with brief low-pressure return feeds and one visual reveal. Across a biome, introduce a mechanic, remix it, combine it with one previously learned skill, then offer a climax and a genuine pause. Failure should usually identify the missed skill and re-enter at the previous saved elevation quickly. Seven bells are a cap, not a target to deplete. Recovery bells must have explicit, deterministic conditions and no random/drop-rate schedule.

Across cycles after a false summit, vary room ordering, optional routes, geometry parameters, art language, and surprise punctuation, while preserving shot grammar and story coherence. Give each cycle a chapter-like ending and the option to stop; do not pressure immediate continuation.

### 4.4 Living psychedelic world

Environment motion should communicate forces. Currents bend particles and ball trails in the direction they actually push; mandala petals indicate rotation and likely tangential deflection; gravity wells curve nearby motifs before affecting the ball. Different biomes can be chromatic and surreal, but the orb, flippers, target windows, hazards, and center drain keep consistent luminance/shape roles. Reserve intense color shifts for transitions; do not use continuous visual noise behind the shot line.

Japanese-stylized action cues can include one or two anticipation frames, a short impact smear, held pose, snap to a new palette, and a brief camera whip to reveal a shot's destination. These accents must be bounded and earned by player action. During live input, camera movement should preserve a stable flipper zone and visible incoming trajectories. Reduced motion replaces whip/zoom/flash with cuts, outlines, and directional markers. No strobe.

## 5. Constrained procedural generation, adaptation, and “self-learning”

The recommended meaning is **authored, validated generation with bounded local adaptation**, followed by **human-reviewed learning from opt-in playtests**. A live model inventing arbitrary geometry or secretly optimizing playtime would undermine fairness and the recreational charter.

### 5.1 Module contract

Represent each authored room as data plus optional scripted behavior. Required metadata:

- Unique ID, biome, version, motif, shot family, difficulty tier, novelty tags.
- Entry envelope: position, velocity direction/speed, flipper feed, maximum camera offset.
- Valid exits: position/velocity envelope, destination handoff, safe return, optional portal and recovery route.
- Required mechanics, physics rule compatibility, target/hazard geometry, minimum clearance, readable preview distance.
- Main and optional goals, deterministic bell/story conditions, maximum expected decision time.
- Behavioral feature-review answers and reduced-motion cues.
- Test fixture seeds, solver policy assumptions, known forbidden combinations.

The generator first chooses a pacing beat and room family, then finds an entry/exit-compatible card, then samples only tested parameter ranges. It rejects invalid geometry/physics and falls back to a safe handcrafted card. Keep generation independent of rendering and sound randomness.

### 5.2 Generator stages

1. **Seed:** deterministic world seed + generator version + current biome/cycle + module index; record them for exact replay.
2. **Plan:** choose a short skill arc (orientation, practice, remix, challenge, rest) and optional story beat; enforce novelty and repetition bounds.
3. **Connect:** use a compatibility graph of exit feeds and next entries; reserve safe main route and recovery lanes.
4. **Parameterize:** vary position, slant, gate phase, color/motif, optional targets only inside approved envelopes.
5. **Validate:** static geometry checks, simulated trajectories, agent playthrough, camera/visibility checks, and performance budget.
6. **Commit or fallback:** instantiate only a passing candidate; log failure reason locally for developer inspection.

Generate ahead of the camera and keep a stable committed segment. Do not rewrite an upcoming room after the player has seen it or fire live “surprise” obstacles in response to success/failure.

### 5.3 Bounded adaptation

Observe only in-game, local signals needed to adjust *challenge*: shot family attempted, intended target reached, rescue needed, repeated drain at the same demand, and whether a portal was voluntarily chosen. Do not infer mood, manipulate frustration, or optimize dwell time. Keep an ephemeral/session-level skill estimate per shot family with low confidence initially. Adapt at module boundaries, slowly: offer a clearer feed or practice variant after repeated misses; offer a more expressive optional route after consistent mastery. Never silently alter the physics of an already visible shot. Keep main-route fairness constant and let players opt out or reset adaptation.

Recommended staged implementation:

- **Stage A:** deterministic fixed difficulty arcs and seed replay, no learning. Validate shot physics and authored rooms first.
- **Stage B:** transparent, bounded local adaptation among already validated room variants. No account, remote analytics, or personal profile required.
- **Stage C:** voluntary, anonymized local playtest export for development review, if the team and players explicitly opt in. Designers update cards/weights in version control after reviewing evidence. No automatic remote behavioral collection.

This provides a genuine improvement loop without allowing an uncontrolled online learner to compromise level quality or the project's anti-compulsion rules.

### 5.4 Regression and playability suite

Use multiple layers, because “the test bot climbed once” is not a playability proof:

- **Physics unit tests:** deterministic fixed-step replay; flipper timing/contact-angle monotonicity; soft catch, pass, and release behavior; collision tunneling stress; powered-surface clarity; seven-bell cap; portal rule restoration; side-guard/center-drain separation.
- **Module contract tests:** every authored room has a valid entry, reachable main target, reachable miss return, compatible exit, clearance for every ball size, and reduced-motion cue data.
- **Seed fuzz tests:** large deterministic sample across biomes/cycles; no blocked exits, softlocks, overlaps, unreachable portals, camera blind shots, or invalid transitions. Save failing seeds as regression fixtures.
- **Agent gradient:** no-input and hold-both agents should not summit; simple reactive novice should progress but make mistakes; timing/aim agent should reach summits on nearly all validated seeds under a reasonable simulation budget. Agents are probes, not substitutes for human fun.
- **Counterfactual route tests:** alternative decisions at a feed lead to meaningfully distinct safe/main/discovery outcomes; a wrong shot produces a learnable miss, not arbitrary death.
- **Performance tests:** generation and validation stay off the input-critical frame budget; bounded memory/object counts; stable behavior on mobile viewport and reduced-motion mode.
- **Human playtests:** short observed sessions answer: Can players predict ball response? Can they name the shot they chose? Can they tell why a bell was lost? Is a portal a choice? Do they feel free to stop? Do they describe the world as alive but readable?

Quantitative thresholds should be set after a local baseline and small human sample; we should not invent success percentages now. Record baseline metrics per seed and compare each change. A failing seed is a bug report with seed, generator version, input trace, video/screenshot if available, and room IDs.

## 6. Implementation order and local acceptance gates

**This section is a plan, not approval to implement.** Each milestone should be playable locally in the Codex browser before proceeding.

| Milestone | Build | Acceptance gate |
| --- | --- | --- |
| 0. Baseline and instrumentation | Seed/replay harness, diagnostic overlay only in developer mode, local screen recording/checklist. No player-facing clutter. | Current 20 tests pass; baseline playthrough and known failure seeds documented. |
| 1. Pinball feel | Contact-angle shot fan, controllable soft catch/release/pass, swept collision, tuned return feeds. | No-input/hold-both do not progress; deliberate shots feel distinct; contact remains readable on mobile. |
| 2. Three vertical room slices | One card each for catch/choose, bank transfer, and timed gate, with safe/express/discovery routes. | Humans can identify goal/choice/failure; every miss has a predictable return or clearly signaled drain. |
| 3. Living world + camera | Force-linked environmental motion and bounded stylized accents, reduced motion. | Ball/flipper/target never hidden at decision time; effects clarify rather than replace feedback. |
| 4. Authored card library | Expand each biome with 8–12 cards and a consistent return/portal grammar. | Distinct shot demands, biome cadence, story beats, and stopping points verified in local play. |
| 5. Deterministic composer | Module contracts, compatibility graph, seeded assembly, validation and fallback. | Fixed-seed regression, fuzz suite, summit-reaching agent, no softlocks across tested samples. |
| 6. Local adaptation | Bounded skill estimates and selection among validated variants; visible off/reset option. | Adaptation improves clarity/challenge match without hidden physics changes, score gates, or session-length optimization. |
| 7. Review and release | Human playtest iteration, documentation, accessibility audit, local sign-off. | User plays and accepts locally; only then decide whether to commit/push/deploy. |

Prioritize milestone 1 and a three-room slice before producing a large procedural library: the generator cannot rescue weak shot physics. Keep each stage reversible with seed fixtures and explicit before/after observations.

## 7. Decisions requested before implementation

1. Confirm whether “self-learning” means the staged local adaptation + opt-in development learning above, or a different model.
2. Confirm how much catch/hold control is desired. Recommendation: short, physical soft catch that still uses only left/right tap/hold; no extra control.
3. Confirm whether the first implementation slice should favor **precise tactical pinball** or **faster kinetic arcade**. Recommendation: tactical at the decision feed, kinetic after the shot; both can coexist.
4. Confirm local milestone review before any GitHub push or Pages deployment. This is the working assumption from the current request.

## 8. Source and design references

- Stern Pinball, *High Roller Casino* operator manual: defines combinations and transfer shots. https://sternpinball.com/wp-content/uploads/2020/01/High_Roller_Casino_Manual.pdf
- Stern Pinball, *The Munsters* rule sheet: describes a short plunge feeding a flipper for a subsequent ramp shot. https://sternpinball.com/wp-content/uploads/2019/02/Munsters-Rule-Sheet.pdf
- The Professional and Amateur Pinball Association's game guides include descriptions of flipper passes, traps, and dead bounces in play. https://www.pinball.org/rules/banzairun2.html and https://www.pinball.org/rules/supermarioworld.html
- Shu, Liu, and Yannakakis, “Experience-Driven PCG via Reinforcement Learning” (2021): segment composition, diversity, repair, and agent playability checks. https://arxiv.org/abs/2106.15877
- Beukman, James, and Cleghorn, “Towards Objective Metrics for Procedurally Generated Video Game Levels” (2022): behavior-based rather than purely visual comparison. https://arxiv.org/abs/2201.10334
- Repository behavioral constraints and room template: `docs/BEHAVIORAL_DESIGN.md`, `docs/ROOM_CARD_TEMPLATE.md`.
