# Living machine chamber deck — version 7

Current implementation map. Older room cards remain history; [living-machine-chambers.md](rooms/living-machine-chambers.md) is the active authoring specification.

| Sequence | Goal | Optional pocket |
| --- | --- | --- |
| Broken Cabinet | Two distinct orbit completions → roof shot | None |
| Chrome Switchyard | Resonance switch → solidified ramp | Liquid Moon |
| Mandala Loom | Left lane + right lane → threaded ramp | Hours Between |
| Tide Cathedral | Dry orbit opens sluice → current ramp | Sideways Sea |
| Spirit Sanctuary | Two breakable seals → direct spirit shot | Little / Large |
| Clockwork Bloom | Orbit latch → open-phase ramp | Mirror Fold |
| False Summit | Two familiar lanes → final ramp and exit | Echo Garden |

The cat is freed by the local mechanism, not a uniform repeated-hit quota. Sanctuary alone ends with a direct rescue impact. Friendly spirits create an exit bridge; its distinct mouth and the lit upper scoop both permit an earned transfer. Main, mastery and optional portal routes have distinct prerequisites/returns. Score is not a gate.

## Contract

- Stable 420×760 visible playfield; world table stride 900.
- Entry/return feed: x=280 or 140, y=base+190, vx=0, vy=-110. Both feed known flippers.
- Ascending committed shots can enter a visible wireform mouth. Captured travel uses the drawn polyline; ordinary misses remain in free-flight. The track is an elevated constrained rail, so it does not collide with objects underneath.
- Main orbits return to opposite flippers. Ramp returns right (mirrored variant left). Exit bridge carries the orb to the next chamber in a protected 1.2-second camera move.
- Exactly one local cat, mechanism, exit, marked bell, clue and optional pocket per main chamber.
- Validate finite bounds, nonzero track segments, flipper-compatible return endpoints, goal providers and separation between mouths. Runtime fallback uses the same authored role with wider entrances.
- Six first-cycle roles; seeded mirrored variants in later cycles. Assistance changes only future mouth width based on local difficulty observations.
- Ordinary returns/bumper contacts cannot automatically progress objectives. An indefinite cradle is rest, not ascent.

## Evidence and inspiration

The saved input fixture traverses the cabinet and all six first-cycle chambers without state edits. Separate recordings complete all six pocket constellations and return. Geometry checks cover 60 table indices, both orientations and assistance widths. These are reachability and regression evidence, not a substitute for observational playtests or exhaustive trajectory proof.

Reference principles used: continuous pinball exploration from [Yoku’s Island Express](https://www.team17.com/games/yokus-island-express); varied local missions from [Nintendo’s Metroid Prime Pinball overview](https://www.nintendo.com/en-gb/News/2007/Metroid-Prime-Pinball-launches-across-Europe-249816.html); deliberate catches and transfers from [Dead Flip tutorials](https://www.deadflip.com/tutorials/). We do not claim a verified Clash of Critters feature mapping.
