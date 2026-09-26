# Full game review — 2026-09-26

## Scope and evidence

This review covers the published prototype’s UX, systems, level structure, pacing, visual language, pinball identity, accessibility, and fit with the recreational-flow charter. Evidence comes from source review, browser inspection, and deterministic simulation. It is not a substitute for player research.

### Simulation baseline

| Input condition | Result | What it indicates |
| --- | --- | --- |
| No input | Game over at 153 m | Falling and bell recovery work, but the opening can be unforgiving without immediate understanding. |
| Both flippers held | False summit at 450 m in 32.2 seconds, five bells remaining, no portal entered | Holding is an unintended viable strategy; the game does not yet demand intentional shot selection. |
| Simple follow-ball bot | Same result as holding both | The current playfield does not distinguish timing, anticipation, and route choice enough. |

The generator also follows a recurring six-module pattern. Biome data currently changes palette and story text more than geometry or behavior. Portal rooms share the same five-bumper / five-stardust layout regardless of their physics rule.

## Assessment

| Area | Current strength | Main gap | Priority |
| --- | --- | --- | --- |
| Core control | Two flippers, immediate inputs, visible ball, and upward camera form a clear hook. | Holding both flippers can solve the whole prototype. | P0 |
| Pinball identity | Momentum, flippers, bumpers, rails, drains, and a weighted orb read as pinball. | There are few deliberate shot types, catches, banks, lanes, or risk/reward table decisions. | P0 |
| Level design | Portals and moving cat targets suggest variety. | The climb is a repeated object sequence, not a progression of taught skills or authored spaces. | P0 |
| Pacing | The opening overlay is calm and the summit is a clear end. | The summit arrives in about 32 seconds under a simple hold strategy; checkpoints do not create a rest beat. | P1 |
| UX | Onboarding language, visible bells, pause, and touch targets are present. | Rules, goal, score, and safe route compete in small text; there is no playable first lesson. | P1 |
| Visual identity | Dark violet, mint, gold, and glowing line art feel polished, magical, and multiversal. | The three biomes mostly share the same visual grammar; the look is mystical editorial science fiction more than psychedelic spatial transformation. | P1 |
| Animation and sound | Gentle ambient motion, trails, glow, and optional audio give the game life. | Effects do not yet teach mechanics or distinguish worlds strongly; reduced motion only limits some effects. | P1 |
| Recreational flow | Explicit recovery, pause, deterministic bell objectives, and an optional post-summit continuation are healthy foundations. | No local checkpoint save or designed biome rest means leaving after a checkpoint is not yet a real, satisfying stop. | P1 |

## Recommended direction

### P0 — Make each ascent a sequence of meaningful shots

Do not merely weaken the flippers. Retain the satisfying ability to hold a flipper for a catch, but shape geometry so holding both is safe only in the opening and cannot create every required ascent.

Build a compact vocabulary of deliberate shots:

1. **Catch and choose:** cradle the orb briefly, then release to send it to a left or right route.
2. **Bank transfer:** use a side rail to move from one side of the climb to the other.
3. **Timed gate:** strike a visible rhythm gate after a preparatory bounce.
4. **Orbit lane:** loop a side lane to charge a portal or reveal a memory.
5. **Rescue shot:** hit a possessed cat from a marked safe angle, then guide its freed spirit to a release route.

Set a testable target: a hold-both simulation may reach the first checkpoint, but it should not reach a biome summit. A timing-aware input sequence should reach it reliably. This is a skill test, not a play-time target.

### P0 — Replace the repeating generator with authored module decks

Create 8–12 small room cards for each biome before broadening generation. A module declares entry vector, exits, primary skill, danger, reward, visual cue, and compatible neighboring modules. The selector should create an arc rather than choose objects by a repeating index.

Each biome needs a different cognitive rhythm:

| Biome | Emotional role | Pinball skill | World rule / visual grammar |
| --- | --- | --- | --- |
| Chrome Root | Settle and learn control | Catch, safe transfer, simple bank | Graphite, moon-mint, thin silver rails, stable symmetric space |
| Tide Cathedral | Surrender then steer | Read currents, redirect slow arcs | Deep cyan, coral, bioluminescent flow, organic asymmetry |
| Clockwork Bloom | Plan and commit | Rhythm gates and delayed returns | Warm gold, rose, oxidized green, petals and orbiting mechanisms |
| False Summit | Integrate learned skills | One short sequence combining all three | White-gold void, broken horizon, geometry folding outward |

### P0 — Turn portal rooms into distinct play, not recolored reward rooms

Liquid Moon should teach a current redirection shot. The Hours Between should teach a deliberate slow-time rhythm where players can observe a future bounce, commit, and see the effect. Their geometry, target order, exit condition, sound tempo, and story discovery should differ.

Portals need a preview shot, an explicit promise, a low-risk first use, an optional mastery route, and a clear return. A portal should feel like entering a different physical thought, not a bonus chamber.

## P1 — Improve pace and session shape

Use this 6–8 minute solo session arc:

| Time | Purpose | Player experience |
| --- | --- | --- |
| 0:00–0:45 | Orientation | A gentle launch teaches the first save and a single visible goal. |
| 0:45–2:30 | Skill expansion | Two authored modules introduce route choice and a first portal preview. |
| 2:30–4:30 | Voluntary stretch | A portal room, possessed-cat rescue, or harder alternate route provides a self-chosen challenge. |
| 4:30–6:00 | Integration | A familiar sequence remixes the learned skill and leads to the biome summit. |
| 6:00–8:00 | Rest | A quiet checkpoint scene, saved progress, story fragment, and clear “continue” or “leave safely” choice. |

Add a short biome-rest overlay after a summit. It should not interrupt a ball in motion. It should acknowledge the player’s discovery, show what was learned, save locally, and offer a neutral exit. The false summit remains a larger session close.

## P1 — Improve first-time UX

- Replace the static opening with a 15–20 second playable lesson: one slow falling arc, highlighted flipper, first safe catch, then a single bumper shot.
- Keep the main objective visible as a simple trail: “Follow the golden pawprints upward.”
- Replace or de-emphasize the live score in solo mode. “Memories found” and “spirits freed” better support the intended discovery motivation.
- Increase minimum critical text size in the playfield, especially portal rule labels and recovery instructions. Use icon + short phrase + persistent world cue.
- Show why a bell was lost: “fell below the flipper rig,” plus a ghosted previous safe elevation during respawn.
- Add local checkpoint save before presenting the biome rest. Saving supports voluntary stopping; it must never create re-entry pressure.

## P1 — Make the multiverse visibly psychedelic while preserving precision

The current palette has a strong violet/mint/gold identity, but it repeats across the whole experience. Psychedelia should arrive through shifts in spatial logic, material behavior, sound, and motion—not simply more glow or saturation.

Give each biome a bounded palette and material system. Keep the cat orb and flippers as the stable anchors. Change one world dimension at a time:

- **Chrome Root:** chrome reflections bend toward routes; familiar pinball geometry remains stable.
- **Tide Cathedral:** current ribbons bend collision trails; surfaces look wet, translucent, and living.
- **Clockwork Bloom:** time creates echo-orbs that show a likely future arc; flowers open on the beat.
- **False Summit:** the horizon folds while collision rules remain clear; the world feels impossible, the shot does not.

Use contrast deliberately: ball, flipper tips, collision rails, active target, and current “down” direction should always be the highest-priority visual layer. Limit high-luminance effects near precision shots.

## P1 — Give every animation a job

Every motion should answer one of four questions: what can I act on, what just happened, what changed, or how can I recover?

| Event | Proposed motion | Information |
| --- | --- | --- |
| Flipper input | 80–120 ms anticipatory flex, then crisp stop | The player’s timing was registered. |
| Bumper hit | Outward pulse and short directional particle burst | The ball gained energy and where it goes next. |
| Portal preview | Slow vector field before entry | Which physical rule changes. |
| Possessed cat | Two-beat pre-attack twitch | When a safe hit window opens. |
| Spirit release | Distortion peels away, then a calm orbit to the exit | Tension resolved; the route is safe. |
| Checkpoint | Motion settles into a still tableau | This is a legitimate place to stop. |

The current reduced-motion implementation suppresses CSS transitions and camera shake, but canvas elements still rotate, pulse, and drift because the render clock runs continuously. Make a true reduced-motion mode that freezes decorative loops, shortens transitions, and preserves rule cues through static direction markers, shape, contrast, and optional sound.

## P2 — Measure quality without optimizing compulsion

Playtest for comprehension and voluntary satisfaction:

- Can a new player explain the active world rule before entering a portal?
- Can they name a shot they meant to make, rather than describe random bouncing?
- Do they understand a bell loss and restart location?
- Do they choose to take an optional risk after understanding it?
- Do they feel comfortable stopping after the biome rest?

Do not track or optimize session length, retention streaks, re-entry, or repeated failure as success metrics. The useful measures are successful intentional shots, portal-rule comprehension, voluntary route choice, reported control, sensory comfort, and satisfaction with stopping.

## First implementation loop

Build one complete Chrome Root arc before adding more visual worlds:

1. Create three Chrome Root room cards: Catch Garden, Silver Bank, and Pawprint Gate.
2. Implement their geometry and change the generator to use the cards in a teach → test → release order.
3. Add a hold-both regression test that fails before the biome summit and a timing-sequence test that succeeds.
4. Add the 20-second playable opening lesson and a local checkpoint save.
5. Playtest with three people using `docs/PLAYTEST_PROTOCOL.md`.
6. Use their evidence to revise one room, then build Tide Cathedral.

This smallest loop will prove that the game is becoming a vertical pinball adventure with intentional flow, rather than a visually strong bounce prototype.
