# Changelog

All notable player-facing and contributor-facing changes are recorded here. This project follows a lightweight Keep a Changelog format.

## Unreleased

### Changed

- Simplified the presentation to one centered phone-sized playfield and removed the surrounding editorial panels, score display, journey map, toolbar, and touch labels.
- Removed routine in-game toast messages, room-rule banners, and canvas text labels; moment-to-moment feedback now lives in the ball, geometry, color, sound, and motion. Pause, a full loss, and the false summit retain a minimal intentional screen.
- Reworked the ascent around deliberate release-and-tap flipper timing; held inputs no longer create repeated launch energy.
- Made idle flippers solid with low-energy inward catches, added an immediate centre-gap drain and visible marker, and clarified the centre-drain bell-loss message.
- Changed bell-loss recovery so the camera returns to the lower edge of the safe section and the orb visibly falls in from above.
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
