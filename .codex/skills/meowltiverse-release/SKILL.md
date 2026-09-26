---
name: meowltiverse-release
description: Prepare Lost in Meowltiverse contributor-facing changes for review, documentation, testing, and authorized GitHub Pages publication.
---

# Meowltiverse release

Use this skill before committing, opening a pull request, or publishing a release. Read `AGENTS.md`, `CHANGELOG.md`, `docs/DECISIONS.md`, and `.github/pull_request_template.md`.

Confirm the player-facing summary is accurate, the behavioral review is linked where needed, and the changelog, decisions, and room card reflect the final change. Run `npm test` and `node --check game.js`; perform interaction, responsive, focus, and reduced-motion checks when relevant.

Keep GitHub actions within the user’s authorization and repository permissions. Never publish credentials, private data, or unreviewed unrelated work. If repository access blocks a push or Pages configuration, leave the local commit reviewable and report the exact permission needed.
