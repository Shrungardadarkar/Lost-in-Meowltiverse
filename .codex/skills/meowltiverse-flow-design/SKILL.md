---
name: meowltiverse-flow-design
description: Design or review Lost in Meowltiverse mechanics, rewards, progression, and difficulty using the project’s recreational flow and anti-compulsion rules.
---

# Meowltiverse flow design

Use this skill for a mechanic, reward, progression, difficulty, or session-loop change. Read `AGENTS.md`, `docs/PROJECT_CONTEXT.md`, `docs/BEHAVIORAL_DESIGN.md`, and `docs/DECISIONS.md` first.

Preserve the game’s four outcomes: autonomy, competence, relatedness, and rest. Main-climb physics remain dependable; a portal changes one clear temporary rule.

Before implementation, produce a concise feature review card answering the eight questions in `docs/BEHAVIORAL_DESIGN.md`. Define the skill being practiced, the player’s meaningful choice, feedback, recovery, reduced-motion cue, and natural stopping point.

Reject or revise features that depend on opaque variable rewards, score-gated survival or story, streaks, scarcity, re-entry pressure, autoplay, or punishment for leaving. A reward condition must be explicit and deterministic.

Update `docs/DECISIONS.md` when a durable rule changes and `CHANGELOG.md` when a player-visible behavior changes. Add or revise focused simulation tests for changed rules.
