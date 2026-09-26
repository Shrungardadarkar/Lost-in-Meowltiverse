# Room card: Chrome Root Catch Garden

## Intent

- **Biome / world rule:** Chrome Root main-climb module; stable gravity with one clearly reachable catch-bank route.
- **Player fantasy:** The cat spirit wakes a garden of chrome petals, then chooses a high bank into the next path.
- **Skill practiced:** Release and tap a flipper as the orb meets it; use the resulting angle to choose left or right.
- **Expected session placement:** First climb module, before a portal or difficult rescue.
- **Natural stopping relation:** A wide, quiet exit lane leads toward the biome checkpoint.

## Flow sequence

| Stage | Layout and behavior | Player feedback | Failure and recovery |
| --- | --- | --- | --- |
| Preview | Two low bumpers frame a cycling center gate; two slanted chrome rails show the left/right release banks. | Gate opening, rail lines, warm impact pulse, and lower guide-rail signage. | Near-misses enter side guide rails rather than an immediate drain. |
| Practice | One bumper creates a repeatable medium arc back to a flipper. Idle flippers catch it with a soft inward bounce; a fresh tap turns that contact into a strong route shot. | A small directional burst follows the bounce, while the centre gap is visibly labelled. | Repeated idle catches lose height until the center drain removes one bell and respawns at the safe elevation. |
| Choice | The player can thread the center gate when open for a clean setup, or let the orb fall into either directional bank. | The gate gives a gentle closed bounce; matching rail arrows show the stronger left/right route. | A missed gate or wrong-way bank remains recoverable and does not erase the next route. |
| Release | A broad rail feeds the next authored module. | Sound resolves and motion quiets briefly. | No countdown, streak, or forced continuation. |

## Behavioral review

- Autonomy: the bank direction is a meaningful but non-punishing choice.
- Competence: the core release-and-tap rhythm is taught in stable physics before any portal changes it.
- Relatedness: a pawprint route hints that the dog can be followed.
- Compulsion-risk check: no variable payout, score gate, or time-limited route.

## Implementation and validation

- Module / object changes: `catch-garden`, `silver-bank`, and `pawprint-gate` in `engine.js`.
- Tests: idle-flipper collision, fresh-tap collision, named centre-drain fall, one-bell drain loss, timing-aware ascent, and lower-rail return.
- Documentation to update: this card, `CHANGELOG.md`, and the playtest protocol when layout changes.
