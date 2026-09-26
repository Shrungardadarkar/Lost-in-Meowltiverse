# Room card: Liquid Moon

## Intent

- **Biome / world rule:** Tide Cathedral portal; low gravity and a visible flowing current.
- **Player fantasy:** Drift through a luminous pocket ocean and guide the cat spirit home by reading its current.
- **Skill practiced:** Hold a controlled flipper shot long enough to redirect a low-gravity arc.
- **Expected session placement:** First portal room in a biome, after a stable main-climb bumper sequence.
- **Natural stopping relation:** Exit returns to a calm main-climb lane near the next checkpoint; completion can support a satisfied pause.

## Flow sequence

| Stage | Layout and behavior | Player feedback | Failure and recovery |
| --- | --- | --- | --- |
| Preview | Portal shows horizontal current ribbons and says “Low gravity.” | Color, particle direction, portal label, and brief sound change. | Player remains on the main route if the portal is missed. |
| Practice | First bumper sits in the current’s center, creating a gentle high arc. | Long trail and slow ball fall make the changed rule visible. | A missed shot drops to the normal bell recovery system. |
| Mastery shot | Three stardust targets alternate left and right in the current. | Each target lights the next; HUD says “collect 3 stardust for a bell.” | Targets remain available; no countdown or rare outcome. |
| Release | Return ring sits above the final target. | Warm gold ring and homeward sound motif. | Automatic 30-second return exists only as an anti-stuck safety exit. |

## Routes and rewards

- Main route: skip the portal and continue climbing.
- Optional route: enter Liquid Moon for a short lower-gravity skill variation.
- Portal behavior: temporarily lowers gravity and applies a visible flowing force.
- Deterministic reward condition: collect three stardust targets in one visit to restore one collar bell, capped at seven.
- Story / spirit discovery: a distant bark in the current confirms that the dog’s trail crosses worlds.

## Sensory cue sheet

| Event | Visual / animation | Sound | Reduced-motion alternative | Information conveyed |
| --- | --- | --- | --- | --- |
| Portal preview | Slow sideways current ribbons | Soft left-right swell | Static directional ribbons and “Low gravity” label | The room has lateral flow and weaker downward pull. |
| Stardust hit | Target brightens, then stays lit | One clear bell tone | Color state remains after the hit | Progress is persistent and counted. |
| Return | Ring warms from aqua to gold | Descending homeward chord | Color/shape change only | The player returns to the stable climb. |

## Behavioral review

- Autonomy: entering the portal is a chosen shot; skipping it keeps the story route open.
- Competence: one changed rule, previewed before the player commits.
- Relatedness: a calm dog-trail sound deepens hope without urgency.
- Sensory load: the current, label, and ball trail communicate the rule through separate channels.
- Compulsion-risk check: there is no timed reward, variable result, streak, or survival gate.
- Playtest question: do players predict the direction and consequence of their first low-gravity shot?

## Implementation and validation

- Module / object changes: existing `tide` portal room in `engine.js`.
- Tests to add or revise: explicit three-stardust bell-recovery test.
- Documentation to update: `CHANGELOG.md`, this card, and `docs/DECISIONS.md` if the reward or rule changes.
