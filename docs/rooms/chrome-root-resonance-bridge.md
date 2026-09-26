# Room card: Chrome Root Resonance Bridge

## Intent

- **Biome / world rule:** Chrome Root; ordinary main-climb gravity and a two-shot optional bridge.
- **Player fantasy:** Wake a chrome flower with a deliberate bank, then use the newly solid bridge to reach a higher route.
- **Skill practiced:** Angle an earned flipper shot into a target, read the return, then aim a second shot. Bumper impact itself must not generate an automatic climb.
- **Expected session placement:** After the initial catch garden, before the second cat rescue.
- **Natural stopping relation:** This is an optional expressive route; the safe rail continues the adventure without it.

## Flow sequence

| Stage | Layout and behavior | Player feedback | Failure and recovery |
| --- | --- | --- | --- |
| Preview | A small chrome resonance target is linked by a visible line to a translucent upper bridge; a lower ordinary rail remains available. | Target and bridge share an accent shape and color. | The lower rail is a safe route. |
| Practice | Ordinary round bumpers reflect the incoming velocity about their contact normal instead of assigning free upward speed. | A directional impact ring shows the actual exit vector. | Rebounds fall toward the flippers or side guides. |
| Mastery shot | Hit the resonance target to solidify the bridge; then bank into the bridge from the marked approach side. | The link line steadies and bridge changes from dashed/translucent to solid. | Wrong approach gives a weaker bank; no arbitrary drain. |
| Release | The bridge's bank points into the next module. | One short directional accent, then quiet. | The main route remains open and is not score-gated. |

## Routes and rewards

- **Main route:** Existing lower silver-bank rail; always solid and traversable.
- **Optional route:** Resonance target activates the high bridge for the rest of this room. A correctly aimed hit gains extra altitude and a small cosmetic score award.
- **Portal behavior:** None. The next portal remains a physical, voluntary ball target.
- **Deterministic reward condition:** No bell reward. Activating the bridge always makes it solid; the aimed bridge shot always produces the same response for the same entry state.
- **Story / spirit discovery:** The flower's opened geometry points toward the next rescue; no story is locked behind the optional bridge.

## Sensory cue sheet

| Event | Visual / animation | Sound | Reduced-motion alternative | Information conveyed |
| --- | --- | --- | --- | --- |
| Bumper contact | Short ring stretched along the outgoing vector | Soft wood/glass knock | Static directional mark | Rebound direction is physical. |
| Target activated | Linked line brightens; bridge becomes solid | Two-note chime | Instant state/color change plus solid outline | The bridge is usable now. |
| Correct bridge shot | Brief speed line in exit direction | Crisp rail note | Static chevrons | The player matched the approach. |

## Behavioral review

1. **Skill:** shot aiming and two-shot planning.
2. **Choice:** take the safe rail or activate the optional bridge.
3. **Goal and feedback:** strike the marked target to make the bridge solid; visible link changes immediately.
4. **Flow:** a safe first shot precedes the more precise second shot.
5. **Recovery:** misses return toward flippers or protected side rails; only the existing center drain costs a bell.
6. **Compulsion guard:** no random reward, timer, streak, or score gate.
7. **Reduced motion:** persistent shape, outline, and chevrons communicate target, state, and direction.
8. **Rest:** adventure completion remains the next natural pause; this optional challenge can be skipped.

## Implementation and validation

- **Module / object changes:** reflective bumper response; `resonance` target and `bridge` rail in `silver-bank`; render bridge states and link.
- **Tests:** bumper response depends on incoming vector; no-input bumper chain cannot climb indefinitely; resonance activation is deterministic; inactive bridge is non-solid; active bridge rewards the matching approach; existing rescue progression remains intact.
- **Documentation:** `docs/DECISIONS.md`, `docs/PROJECT_CONTEXT.md`, `CHANGELOG.md`.
