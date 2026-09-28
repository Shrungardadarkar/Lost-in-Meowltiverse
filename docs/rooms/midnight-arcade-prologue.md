# Room card: Midnight Arcade prologue

## Intent

- **Biome / world rule:** A compact, gravity-down classic pinball machine; three mechanical targets unlock its ceiling.
- **Player fantasy:** A cat spirit wakes an old arcade cabinet and breaks through the world that contained it.
- **Skill practiced:** Fresh flipper timing and choosing a directional bank.
- **Expected session placement:** The first 20–40 seconds of a new local run only; resumed checkpoint runs skip it.
- **Natural stopping relation:** Pause remains available immediately. The release lands directly in the first Chrome Root table and its ordinary checkpoint structure.

## Flow sequence

| Stage | Layout and behavior | Player feedback | Failure and recovery |
| --- | --- | --- | --- |
| Preview | Three coral targets form a visible triangle under a sealed roof. | Warm target color and physical bumper form show the immediate goal. | Side guards return misses; the center drain is visibly marked. |
| Practice | A lower left or right bank feeds the target triangle. | Each hit is a brief 120 ms ring and target glow. | A weak or wrong bank returns toward the flippers. |
| Mastery shot | With all three targets gold, the ceiling becomes a cracked, physical target. | A short anticipatory hold, then shatter, pull, and color inversion confirm the exit shot. | Before all three are lit, the ceiling gives a safe downward return. |
| Release | The cracked ceiling implodes into a portal, revealing Chrome Root's first full table. | A 1.42 s directional transition carries the ball upward without a modal. | No input is needed during the controlled transition; play resumes on the standard feed. |

## Routes and rewards

- Main route: Light all three targets and break the ceiling.
- Optional route: Either bank can set the next target; no side is objectively superior.
- Portal behavior, if any: The ceiling becomes a one-way transition into the same first Chrome Root table every time.
- Deterministic reward condition: Three distinct target impacts followed by the ceiling impact.
- Story / spirit discovery: The machine's cabinet was only the first small world; the bark is now somewhere above.

## Sensory cue sheet

| Event | Visual / animation | Sound | Reduced-motion alternative | Information conveyed |
| --- | --- | --- | --- | --- |
| Target impact | 120 ms gold ring and small rebound arrow. | Short mechanical chime. | Static gold fill and chime. | This target is permanently lit. |
| Third target | Ceiling seams become visibly cracked; 160 ms warm halo. | Two-note confirmation. | Cracked roof silhouette and color change. | The ceiling is now the intended shot. |
| Ceiling impact | 1.42 s hold, bounded cabinet vibration, outward shards, then inward violet vortex. | Descending impact that resolves upward. | One smooth violet wash and expanding portal ring. | The machine has broken; play is moving to the multiverse. |
| Arrival | Chrome Root palette replaces cabinet felt as the ball takes a standard feed. | Soft arrival tone. | Palette change and stable new frame. | Normal table rules now apply. |

## Behavioral review

- Autonomy: Left/right setup remains a real geometry choice; pause is always available.
- Competence: One deterministic goal is present at a time and all active targets persist visibly.
- Relatedness: The transition turns the cat's search into a hopeful escape rather than an urgency cue.
- Sensory load: The ball and flippers remain visible; shake is short, bounded, and never used in reduced motion.
- Compulsion-risk check: No timer, score gate, streak, random reward, or repeated celebration loop.
- Playtest question: Can a new player say what must be hit after lighting the third target?

## Implementation and validation

- Module / object changes: Prologue-only target bumpers and ceiling; first multiverse table is hidden until the break completes.
- Tests to add or revise: Target count, locked-ceiling return, deterministic completion, checkpoint skip, and replay stability.
- Documentation to update: Changelog, decisions, project context, and this room card.
