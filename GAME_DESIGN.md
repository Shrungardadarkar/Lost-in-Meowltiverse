# Lost in Meowltiverse

## Game Design Document — Prototype v0.1

### High concept

*Lost in Meowltiverse* is a portrait-oriented, physics-driven vertical pinball adventure for the web and mobile. Players use only two floating flippers to launch a reactive cat-spirit orb through an upward-scrolling, surreal multiverse. Each world has its own art language and temporary physics rules. The cat spirit is climbing toward a false summit to find its lost dog friend—and frees possessed cats along the way.

The game combines the precise, readable skill of classic pinball with short, dreamlike branching spaces inspired by pipes into secret worlds. It is a solo discovery game first. Score and collectible chains are present but secondary in the initial experience; they will become more important in a later multiplayer mode.

### Player promise

Every 1–2 minute ascent should provide a satisfying sequence of accurate flipper saves, surprising portal discoveries, and a new piece of a strange world that appears to have no end.

## Design pillars

1. **Flipper skill is the only direct control.** The ball is physical, weighty, and readable. Winning comes from timing, positioning, and learning the level—not character movement abilities.
2. **Reliable home, strange destinations.** Main climbs use stable, learnable pinball physics. Portal rooms deliberately bend a single clearly signaled rule.
3. **Discovery is the reward.** New biomes, hidden rooms, environmental story fragments, freed spirits, and clues about the missing dog motivate continued ascent.
4. **Surrealism has rules.** Each biome shifts its own visual language and physics motif, but players are always warned about changes before a risky interaction.
5. **Failure preserves flow.** Falling costs a life, but restarts the player at the previous meaningful altitude instead of sending them to the bottom.

## Narrative premise

A small cat spirit awakens as a heavy, expressive orb in a fractured vertical cosmos. Its dog friend has vanished beyond the false summit, leaving faint traces scattered across worlds that no longer agree on gravity, scale, or time.

The route upward is guarded by cats possessed by a multiversal distortion. A defeated possessed cat is not destroyed: it is released as a friendly spirit. These freed spirits reveal lore, point toward secrets, or become visible evidence that the climb is healing the worlds.

The first prototype ends at a glorious apparent summit. Reaching it reveals that the summit is only a doorway into another, larger universe, giving closure to the prototype while preserving the feeling of infinite ascent.

## Core loop

1. Enter or resume a vertical climb at the latest biome checkpoint.
2. Time left and right flippers to keep the orb ascending.
3. Hit themed pinball devices, avoid hazards, and find optional routes.
4. Strike a portal to enter a short pocket dimension with one altered physics rule.
5. Return to the main climb at a higher altitude with a story discovery, collectible, route advantage, or bonus.
6. Reach the biome summit and save progress at a checkpoint.
7. Eventually reach the false summit and reveal the next universe.

### Attempt structure

- A meaningful ascent segment lasts roughly **1–2 minutes**.
- The run begins with **seven lives**, shown as collar bells.
- Falling below the active recovery threshold removes one bell and respawns the flippers and orb at the previous safe elevation.
- Extra bells are surprise rewards, earned through score thresholds, hidden discoveries, and difficult room completions.
- The counter can never exceed seven bells.
- A full loss returns the player to the current biome checkpoint rather than erasing all campaign progress.

## Controls and camera

| Input | Action |
|---|---|
| Tap / hold left half of portrait screen | Actuate left flipper |
| Tap / hold right half of portrait screen | Actuate right flipper |
| Left arrow | Actuate left flipper (web prototype) |
| Right arrow | Actuate right flipper (web prototype) |

The two flippers remain near the lower center of the visible screen. They are not fixed in world coordinates: when the player reaches a safe elevation, the flipper rig advances upward with the camera. This keeps the game feeling like a climb rather than a conventional table.

The camera scrolls upward with the player once momentum and elevation demand it. A clearly framed fall boundary remains below the flippers. On a fall, the view re-centers at the prior recovery altitude.

## Player object: cat-spirit orb

The playable orb has recognizable cat features—a face, ears implied in silhouette or light, and a small collar/bell motif—but maintains the mass and collision behavior of a pinball.

Its material responds to the active world:

- polished chrome in the stable home climb;
- glass/prism in scale worlds;
- ember or plasma in heat/time worlds;
- liquid light in current worlds;
- moss, stone, or soft cosmic matter in organic worlds.

These changes are expressive feedback only unless a portal explicitly states a gameplay effect. The orb’s core mass and collision readability remain consistent in the main climb.

## Pinball systems

### Devices

Each biome remixes these core devices to match its visual language:

- bumpers and pop targets;
- angled kick surfaces and one-way launch rails;
- breakable blocks that reveal pathways;
- moving platforms and rotating mechanical structures;
- wind/current channels and gravity wells;
- pinball gates, lanes, and score chains;
- environmental hazards and enemy-like obstacles.

### Possessed cats

Possessed cats function as themed pinball encounters, not platform-combat characters. They may block lanes, emit hazards, move through a room, or require a sequence of hits. Successful completion turns them into free cat spirits. The transformation should be immediately joyful and nonviolent in tone: dark distortion peels away, the cat becomes luminous, and a clue or small reward appears.

### Scoring and collectibles

Single-player prioritizes discoveries over leaderboard optimization. Score still rewards precision, device chains, collections, secret-room completions, and extra-life opportunities.

Score design must never make an unskilled player unable to reach the story path. It primarily creates optional mastery goals for replay and becomes a major competitive/resource system in the future multiplayer expansion.

## Worlds, portals, and physics

### Main climb

The main climb uses the familiar rules of pinball: stable downward gravity, predictable bounce behavior, clear collision surfaces, and consistent flipper response. Its level content is procedurally arranged from tested handcrafted modules, keeping every layout playable while sustaining an endless climb.

### Pocket dimensions

Portals are physical, hittable doors in the level. If the orb hits one, it enters a branching pocket dimension, much like entering a pipe in a platform game. Some portals are obvious and naturally placed; optional ones reward sharp shots and exploration. A portal should never steal control with no warning.

Each pocket dimension lasts around 20–45 seconds and introduces only one primary altered rule. It returns the orb to the main climb higher than where it entered.

| Dimension type | Rule change | Readability cue |
|---|---|---|
| Sidefall | Gravity rotates 90° | The entire room is visibly sideways; particles and water show the new down direction. |
| Giant / tiny | Orb scale or surrounding geometry shifts | An oversized familiar object appears at the entrance. |
| Time bloom | Physics is slowed, sped up, or rhythmically pulsed | Clocks, motion trails, and an audible tempo change. |
| Current dream | Drag, buoyancy, and directional flow reshape travel | Flowing light ribbons and animated currents. |
| Mirror fold | Space mirrors, route geometry flips, or shots echo | Symmetrical reflections with a visible axis. |
| Probability garden | Temporary routes appear and disappear on a readable beat | Faint ghost platforms solidify before becoming active. |

Effects are temporary: leaving a pocket dimension returns the player to the baseline main-climb physics. This maintains skill fairness while letting each portal feel dramatic.

### Science-informed inspiration

The game treats the multiverse as imaginative fiction, not a literal visualization of settled science. Its visual framework draws on speculative ideas such as bubble-like regions with different effective conditions and brane-like surfaces embedded in a larger space. This supports worlds that feel locally coherent but fundamentally unlike one another.

## Level structure

### Hybrid authored/procedural model

The campaign is an endless-feeling journey assembled from two sources:

- **Handcrafted biome anchors:** openings, possessed-cat encounters, portals, story discoveries, escape routes, and summits.
- **Procedural climb modules:** tested arrangements of ramps, bumpers, hazards, and routing choices between anchors.

The procedural system should select from authored modules with declared inputs, exits, difficulty rating, device density, and physics compatibility. It should not freely generate raw collision geometry. That approach keeps the physics readable and avoids unwinnable layouts.

### Biome cadence

Each biome consists of a welcoming entry segment, several procedural ascent modules, 1–3 portal opportunities, a signature possessed-cat encounter, a story discovery, and a summit checkpoint. Completing the summit advances the player to the next visual universe.

Prototype example:

1. **Chrome Root:** a stable, luminous pinball ruin where the cat spirit wakes.
2. **Tide Cathedral:** organic architecture, liquid-light currents, and sideways waterfalls.
3. **Clockwork Bloom:** a garden of time loops and rhythmic launch rails.
4. **False Summit:** a radiant mountain-table that opens into the next universe.

## Visual and audio direction

Every biome uses its own art language: neon abstraction, painterly organic forms, collage-like ordinary objects, cosmic geometry, or impossible machinery. The player orb and flippers are the constants that maintain visual continuity.

Portal changes should be announced through three channels:

1. an unmistakable visual motif;
2. a brief environmental animation that demonstrates the rule;
3. a matching sound change—tempo, reverb, or instrument palette.

Pinball impacts should be tactile and musical. A successful chain can build a biome-specific rhythmic motif. Portal transitions should feel wondrous, not noisy enough to obscure critical impact audio.

## Prototype scope: web-first mobile format

### Target

A portrait web game playable with touch and left/right arrow keys. The prototype proves the core flipper feel, upward camera behavior, checkpoint/life flow, portal transition, and one complete false-summit arc.

### In scope

- one cat-spirit orb with material swaps;
- two responsive floating flippers;
- stable pinball physics and upward-scrolling camera;
- seven-bell life system, recovery altitude, and one biome checkpoint;
- one baseline climb biome with 6–10 modular room pieces;
- two portal pocket dimensions with distinct temporary rules;
- one possessed-cat encounter that transforms into a free spirit;
- score, a small collectible set, and one surprise extra-life condition;
- a false-summit ending sequence;
- keyboard and touch controls.

### Out of scope for the first prototype

- online multiplayer, shared worlds, combat between players, and resource economy;
- unlimited biome generation;
- more than two portal physics types;
- save-account systems, leaderboards, cosmetics, and monetization;
- a fully produced narrative or final art for every world.

## Future multiplayer direction

Multiplayer should build on—not dilute—the single-player physics skill. Potential mode: several cat spirits inhabit a shared vertical world, race for routes and score resources, trigger portals that alter the shared geometry, and choose whether to cooperate against possessed-cat encounters or compete for scarce rewards. This is intentionally deferred until the solo prototype’s controls, collision behavior, camera, and portal readability are proven.

## Success criteria for the prototype

The prototype is ready for playtests when new players can:

1. understand left/right flipper control without written instruction;
2. reliably save the orb at least sometimes through skill;
3. recognize a physics change before entering a portal room;
4. understand why they lost a bell and where they will restart;
5. reach the false summit in a short session and want to see the next universe.

## Open decisions for later

- Exact personality and visual design of the lost dog friend.
- Whether freed cat spirits grant hints, cosmetic changes, optional challenges, or all three.
- The player’s long-term motivation after the false summit.
- Target age rating and the desired intensity of horror/distortion in possessed-cat imagery.
- Final engine and physics technology after the browser proof of concept.
