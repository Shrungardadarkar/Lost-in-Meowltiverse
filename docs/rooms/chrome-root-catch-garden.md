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
| Preview | A low bumper and two slanted chrome rails show the available return angles. | Rail lines, warm impact pulse, and lower guide-rail signage. | Near-misses enter side guide rails rather than an immediate drain. |
| Practice | One bumper creates a repeatable medium arc back to a flipper. | A small directional burst follows the bounce. | The center drain still removes one bell and respawns at the safe elevation. |
| Choice | A left and right bank each lead to a visible pawprint or spirit route. | Both routes stay visible; neither is score-gated. | The unchosen route remains a later discovery, not a lost reward. |
| Release | A broad rail feeds the next authored module. | Sound resolves and motion quiets briefly. | No countdown, streak, or forced continuation. |

## Behavioral review

- Autonomy: the bank direction is a meaningful but non-punishing choice.
- Competence: the core release-and-tap rhythm is taught in stable physics before any portal changes it.
- Relatedness: a pawprint route hints that the dog can be followed.
- Compulsion-risk check: no variable payout, score gate, or time-limited route.

## Implementation and validation

- Module / object changes: `catch-garden`, `silver-bank`, and `pawprint-gate` in `engine.js`.
- Tests: timing-aware ascent reaches the summit; held inputs cannot replace timing; lower rails return a descending orb inward.
- Documentation to update: this card, `CHANGELOG.md`, and the playtest protocol when layout changes.
