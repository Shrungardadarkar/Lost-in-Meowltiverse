# Contributing

Thanks for helping this little cat find its friend.

## Work on a change

1. Fork this repository and clone your fork.
2. Create a branch for your change.
3. Run `npm start` and test at http://localhost:4173 with keyboard and a narrow portrait viewport.
4. Run `npm test` before submitting a pull request. Add a simulation regression test when changing physics or progression rules.
5. Describe the player-visible change, how you tested it, and any known limitations. Include a screenshot or short recording for visual changes when useful.

Keep pull requests focused. Discuss major architecture or multiplayer changes in an issue first. Do not commit credentials, generated dependencies, or unrelated files.

## Design constraints

- The only direct gameplay controls are the two flippers.
- Main-climb physics should be predictable; portal modifiers should be signaled and temporary.
- Lives are collar bells, capped at seven.
- Possessed cats become free spirits when defeated.
- Discovery and the search for the lost dog take priority over score in solo play.
- Touch and keyboard are equally important.

See [the game design](GAME_DESIGN.md) for the broader direction. The current prototype implements only a subset.

## Report a bug or suggest a room

Open a GitHub issue with the browser/device, steps to reproduce, what happened, and what you expected. For physics problems, mention the biome, portal rule, and whether you were tapping or holding. For room ideas, describe the shot or skill the room teaches and how its exit remains reachable.

By submitting a contribution, you agree that it may be distributed under this project's MIT license. Only submit work you have permission to share.
