# Changelog

All notable player-facing and contributor-facing changes are recorded here. This project follows a lightweight Keep a Changelog format.

## Unreleased

### 2026-09-28 — Living machine redesign (local)

- Replaced uniform three-hit rescues and launch rails with six transforming chamber goals and visible orbit/ramp/exit tracks with known flipper returns.
- Rebuilt the classic opening around two distinct orbit lanes and a final roof shot. The orb now travels through the shatter/suction transition instead of freezing and relaunching from the drain.
- Added sustained cradles, a wider timing-driven aim fan, physical side returns, permanent shot provenance until recovery, and pause-safe animated ascent.
- Placed and rendered breakable rescue seals, marked bells, moving/rotating collision surfaces, friendly spirit bridges and a six-clue dog trail with a pause-only journal.
- Added six accessible, untimed pocket dimensions: current, time, sideways/local gravity, size, mirror and delayed echo. Material silhouettes expose the local rule; time previews and echo-only targets support timing play.
- Added biome/route musical phrases, selected-return cues, reduced-motion alternatives, mobile pause access and aspect-correct scaling.
- Added authored route contracts, local opt-in role-based assistance, versioned replay controls, a developer room selector, and input-only regression witnesses for the full first universe and all six pockets.
- Current prototype scope and limitations are maintained in `docs/FEATURE_REGISTER.md`. The entries below are chronological design history and include superseded behaviors.

### Changed

- New runs now begin in **Midnight Arcade**, a compact classic pinball table. Lighting three physical targets makes the ceiling a deliberate escape shot, which shatters into a short, bounded pull-through to Chrome Root without covering play with a modal. Checkpoint resumes skip the prologue; reduced-motion mode uses persistent target/ceiling states and a calm color transition.
- Replaced the old stacked 300-unit climb-module generator with an authored endless table deck: two complete tables per biome, each with a local cat, return rails, a lit-on-rescue scoop, and a deterministic transfer feed. Chrome Root teaches banks, Tide Cathedral adds currents, and Clockwork Bloom adds readable gate/mandala timing.
- Reworked the main climb into an endless chain of fixed-height pinball tables. The camera stays with a complete flipper playfield; freeing its local cat lights an upper scoop, and a deliberate scoop shot feeds the next table from above.
- Cat rescues now require a recent committed flipper shot, preventing passive bumper or held-input contact from progressing the objective.
- Removed biome-completion and false-summit modal cards. Ordinary chapter changes now feed directly into the next playable biome; the false summit waits for a fresh flipper tap on the unobstructed playfield before another universe begins.
- Added eight authored module variants per biome, distinct Tide and Time portal spaces, a short physical cradle and cross-flipper pass, and visible rescue boundaries that keep required cats in view until freed.
- Made mismatched bank shots return toward a flipper and let upward shots pass through rail undersides, preventing a repeatable bumper/rail loop.
- Locked gate visuals to the same simulation clock as gate collision. Currents, mandalas, and portal rims now retain directional rule cues in reduced motion.
- Constrained generation to preserve two rescues and one portal per adventure, added role-aware fallback and seeded replay capture for local development, and exposed room adaptation off/reset controls only on pause.
- Restored the optional sound control inside the pause screen, keeping the live playfield free of extra buttons.
- Pruned obsolete objects after biome checkpoints and resumed saved endless runs directly in the correct universe, keeping long climbs bounded and avoiding an old-world rebuild.
- Made ordinary bumpers reflect the orb's incoming momentum rather than supply automatic upward speed; added a marked Chrome Root resonance target that activates one optional high bridge while preserving a safe main route.
- Kept fall recovery anchored to the saved section until the orb reaches a flipper, preventing recovery camera drift and restoring climb tracking on the next deliberate shot.
- Added a visible soft-catch posture for held flippers; holding settles a contact but cannot create a launch.
- Added swept contact checks for fast orb motion so targets cannot be skipped between simulation frames.
- Added a release event and tone when a soft catch is let go, plus seeded generation reports, bounded skill adaptation, and module geometry validation for future authored/procedural expansion.
- Added a bounded contact-point shot fan: fresh taps now produce visibly different lateral routes depending on where the orb meets the flipper, with a directional cue for both touch and keyboard play.
- Reworked the opening Chrome Root and rescue modules into authored decision spaces: a readable center gate, two directional release banks, and side rescue approach rails now create choices before the next objective.
- Rebalanced the climb around agency: only a close, fresh flipper tap creates a full launch; ordinary bumpers and guide rails now recover the ball rather than automatically advance it.
- Added chevron bank rails whose full launch requires entering with the matching lateral direction, creating readable route choices.
- Added stylized kinetic punctuation for perfect flips, route rails, mandalas, and portals: squash-and-stretch, speed lines, manga-like impact zooms, camera kicks, and brief color flashes. Reduced-motion mode keeps these cues calm.
- Simplified the presentation to one centered phone-sized playfield and removed the surrounding editorial panels, score display, journey map, toolbar, and touch labels.
- Removed routine in-game toast messages, room-rule banners, and canvas text labels; moment-to-moment feedback now lives in the ball, geometry, color, sound, and motion. Pause, a full loss, and the false summit retain a minimal intentional screen.
- Reworked the ascent around deliberate release-and-tap flipper timing; held inputs no longer create repeated launch energy.
- Made idle flippers solid with low-energy inward catches, added an immediate centre-gap drain and visible marker, and clarified the centre-drain bell-loss message.
- Changed bell-loss recovery so the camera returns to the lower edge of the safe section and the orb visibly falls in from above.
- Made two three-hit cat rescues the objective for each adventure, added a Portal Pulse booster, and added a calm next-adventure transition.
- Added protected lower side rails so only the center drain costs a collar bell.
- Replaced the repeated fixed climb pattern with authored biome module decks: catch gardens, banks, pawprint gates, living tide channels, mandala blooms, and rhythm gates.
- Added interactive fluid currents, rotating mandalas, and readable time gates, plus distinct living visual language for every biome.
- Added voluntary local checkpoint continuity and updated player-facing guidance to emphasize pause-and-return rather than pressure.
- Clarified last-safe-point and portal-entry recovery, and added the optional one-use Spirit Shield to portal completion rewards.
- Replaced score-threshold life rewards with explicit, deterministic recovery rewards.
- Added project context, behavioral-design rules, room and playtest templates, agent orchestration, contributor PR guidance, and repository-local agent skills.

## 0.1.0 — 2026-09-25

### Added

- Portrait web prototype with two floating flippers, touch and keyboard support, seven collar-bell lives, checkpoints, portals, pocket dimensions, cat-spirit rescues, three visual biomes, and the false summit.
