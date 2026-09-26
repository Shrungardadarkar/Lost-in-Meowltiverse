# Room card: Clockwork Mandala Bloom

## Intent

- **Biome / world rule:** Clockwork Bloom main-climb module; mandalas redirect the orb and gates cycle between visibly open and closed states.
- **Player fantasy:** Bounce through a blooming clock face whose petals point toward impossible routes.
- **Skill practiced:** Observe the mandala's visible spin and gate rhythm, then choose a safe timed shot.
- **Expected session placement:** After the player has already learned stable flipper timing and one Tide Cathedral current.
- **Natural stopping relation:** The gate's waiting posture creates a small observation breath rather than an urgency spike.

## Flow sequence

| Stage | Layout and behavior | Player feedback | Failure and recovery |
| --- | --- | --- | --- |
| Preview | A rotating mandala and its outgoing petals appear before the collision line. | Persistent color sectors and a slow spin; reduced-motion uses static directional sectors. | A direct route around the mandala remains visible. |
| Practice | One mandala creates a consistent lateral redirect into a large rail. | Tangential particle spiral and a distinct chime. | A missed redirect falls back to the regular flipper zone. |
| Choice | A rhythm gate opens and closes on a calm, repeating cycle. | Open gap, color change, and soft wait sound when closed. | A closed gate gives a gentle bounce, never a hidden failure. |
| Release | A spirit or portal can sit beyond the open route. | The reward is visible before the required shot. | No countdown; the gate repeats predictably. |

## Behavioral review

- Autonomy: routes around the mandala and gate remain valid.
- Competence: state is communicated with shape, color, animation, and sound—not surprise.
- Sensory load: visual movement freezes into still directional cues under reduced motion.
- Compulsion-risk check: timing tests understanding, not reaction-speed escalation or random reward.

## Implementation and validation

- Module / object changes: `mandala-bloom` and `clock-gate` in `engine.js`; canvas symbols in `game.js`.
- Tests: a mandala changes the orb trajectory; time-gate behavior must retain a safe bounce when closed.
- Documentation to update: this card and `docs/DECISIONS.md` for any rule change.
