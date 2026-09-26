# Durable design decisions

Record decisions that future contributors and agents must not rediscover. Add the date, decision, why it matters, and the superseding entry if a decision changes.

## 2026-09-26 — Flow over compulsion

The solo game is recreational and flow-led. It will not use variable or score-threshold life rewards, streaks, re-entry incentives, scarcity, or progression that requires repeated play. Session closure is a design requirement.

## 2026-09-26 — Explicit recovery rewards

A collar bell can only be earned by a visible, deterministic action: a marked bell, a completed room objective, or a clearly disclosed milestone. Score remains cosmetic feedback in the solo prototype.

## 2026-09-26 — One anomalous rule per pocket world

Main-climb physics remain stable. Portal worlds alter one primary rule and communicate it through at least two channels before the player must act.

## 2026-09-26 — Timing, not holding, is the core flipper skill

A flipper receives its strong launch only on a fresh press close to contact. Holding an input is visually allowed for accessibility and catch posture, but cannot repeatedly generate climb energy. This makes the principal skill legible and avoids an autopilot strategy.

Idle flippers remain solid: they catch a descending orb and send it into a soft inward bounce. That bounce deliberately has too little energy to sustain the climb, so waiting leads naturally toward the visible centre drain. A fresh press at contact remains the strong, directional rescue shot.

When the player keeps a flipper held through a soft contact, the engine marks a brief catch posture and visually warms that flipper. The catch never grants climb energy; releasing it returns the orb to play so a later fresh tap remains the meaningful shot.

## 2026-09-26 — Side lanes guide; the center drain decides

The lower side spaces are protected by diagonal guide rails that redirect a descending orb inward. This preserves traditional pinball's readable lower-playfield geometry without making a near-miss feel arbitrarily expensive. The center drain remains the clearly signaled failure route.

## 2026-09-26 — Recovery stays in the saved playfield

After a fall, the camera remains anchored to the saved safe section while the orb visibly drops back into the flippers. Recovery ends on the first flipper contact, so the player can immediately earn a new climb rather than the camera following a recovery ball into an untracked height.

## 2026-09-26 — Living environments are physical, not decorative

Tide flows apply a directional force, Clockwork mandalas alter an exit vector, and rhythm gates visibly open and close. Each effect must be observable before it matters, testable in the simulation, and paired with a calm route around it.

## 2026-09-26 — Checkpoint continuity is voluntary

Safe biome checkpoints can be stored locally as a convenience for a player who chooses to leave. There is no streak, return timer, or penalty for stopping.

## 2026-09-26 — Portal rewards protect without gating progress

Three visible stardust in a portal restores one collar bell when needed and grants one non-stackable Spirit Shield. The shield absorbs one fall-boundary loss, then expires. A normal fall resets the camera to the bottom of the latest 25-metre safe section and returns the orb from the top, visibly falling back into play; a portal-room fall does the same from the safe point recorded at entry. These deterministic recovery aids are optional and never required for story or ordinary progression.

## 2026-09-26 — Rescue is the adventure objective

Each adventure asks for two visible possessed-cat rescues. A cat takes three pinball impacts, visibly shedding one rescue mark per impact before leaving as a free spirit. Completing the target pauses at a calm transition to the next adventure. Portal completion also grants one Portal Pulse: the next cat impact provides two rescue marks, making portal skill directly useful to the rescue loop.

## 2026-09-26 — The playfield is the interface

The prototype presents one phone-sized playfield, not a dashboard. Routine feedback must be embedded in the ball, geometry, color, sound, and motion instead of toast notifications, persistent rule copy, activity feeds, score counters, or side-panel progression. A short overlay is reserved for an intentional start, pause, full loss, or false summit.

## 2026-09-26 — Momentum must be earned through a readable route

A close flipper tap creates a powerful launch, while a late tap is a smaller recovery. Chevron rails advertise a lateral direction: entering on that vector creates a strong bank; entering against it is safe but weak. Bumpers, gates, and lower guide rails preserve play but must not carry the climb by themselves. This protects player agency and gives every high ascent an understandable cause.

## 2026-09-26 — Bumpers redirect; resonance targets change the playfield

Ordinary round bumpers reflect the orb's incoming velocity with energy loss instead of assigning a minimum upward launch. A marked resonance bumper can solidify one linked optional bridge. The main route stays available before activation, so the player chooses whether to set up and take the two-shot route. The target/bridge link and active state remain visible without motion or sound.

## 2026-09-26 — Fast contacts are swept

Moving circular targets use the orb's previous-to-current segment when checking contact, so high-speed shots cannot pass through a bumper, portal, gate, or rescue target between fixed simulation frames. The resolved response remains the same physical rule as a normal contact.

## 2026-09-26 — Generation is seeded, bounded, and self-observing

Every authored module records a deterministic seed, slot, biome, and difficulty tier. New modules validate finite coordinates, vertical bounds, and meaningful circle separation; invalid geometry falls back to a biome-safe module and is reported. After the tutorial adventure, a small bounded selector can favor a recovery variant after repeated falls or a more expressive variant after demonstrated mastery. This is an assistive adaptation, not a hidden difficulty treadmill, and the report makes generated behavior inspectable for future replay and fuzz tests.

## 2026-09-26 — Kinetic animation punctuates commitment

Perfect flips, correctly aimed bank shots, portal crossings, spirit releases, and mandala redirects may use short Japanese-animation-inspired squash-and-stretch, speed lines, impact zoom, and color accents. They must last only long enough to punctuate the action, never obscure the orb or flippers, and reduce to stable visual cues under reduced motion.

## 2026-09-26 — Contact point creates a bounded shot fan

A fresh flipper press now uses the orb's contact fraction along the flipper to vary lateral aim. The fan is deliberately small and deterministic: it gives agency without requiring a new button, while late/held contacts remain recovery bounces. A directional arrow and orb trail communicate the result; reduced motion keeps those static cues.

## 2026-09-26 — Opening rooms must present a choice before a target

The first Chrome Root modules now place a visible center gate or directional bank before the next rescue/portal objective. The player can choose a clean setup through the gate or a left/right release bank; neither route is score-gated or required for survival. Rescue rooms also show side approach rails so repeated cat impacts are shaped by aim rather than passive bumper contact.

## 2026-09-26 — Repository context is part of the product

`AGENTS.md`, `docs/`, room cards, the changelog, and the PR template are maintained with the code. GitHub is the intended public source of truth once repository write access is available.
