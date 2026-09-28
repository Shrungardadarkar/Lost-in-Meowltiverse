# Feature review: contact-point shot fan

1. **Skill practiced:** Read the orb's approach and choose when to press a flipper so the contact point creates a shallow or wide lateral route.
2. **Player choice:** Tap left or right at contact, with the point along that flipper providing a small, predictable aim fan.
3. **Goal and feedback:** Make the intended save and see a directional arrow, orb trail, and immediate route response; no score gate is involved.
4. **Flow demand:** The opening keeps the timing window generous; later authored rooms place optional targets at different fan angles without changing the core physics.
5. **Recovery:** A late or missed shot remains a soft inward bounce, side guards redirect near-misses, and the centre drain costs one bell before returning to the safe elevation.
6. **Compulsion check:** The mechanic has no streak, timer, variable reward, or re-entry pressure. A player can pause or leave at a checkpoint.
7. **Reduced motion:** The directional arrow, flipper color state, and static orb trail remain; camera punch and particle bursts may be disabled.
8. **Stopping point:** Completing an adventure quietly feeds into its next playable section; the player can pause at any time, and the false summit still requires an intentional fresh flipper tap to continue. The shot fan is a skill tool, not a reason to extend a session.

## Implementation note

The fan is bounded by the flipper contact fraction and only affects a fresh, close tap. Held contact cannot become a launch. The same deterministic rule is used for keyboard and touch input.
