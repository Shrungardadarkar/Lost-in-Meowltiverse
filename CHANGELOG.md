# Changelog

All notable player-facing and contributor-facing changes are recorded here. This project follows a lightweight Keep a Changelog format.

## Unreleased

### Changed

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
