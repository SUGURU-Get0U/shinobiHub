# Akari welcome intro

Applied from the user's `akari-intro-feat-agents.patch` on 2026-11-17 to
`feat/agents`. The supplied patch includes the face and hand WebP artwork;
these assets were not regenerated during integration.

## Behavior

- A short GSAP sequence shows Akari's face, hand and the existing full-body aura
  artwork before revealing the welcome homepage. Meu foco opens the personal board.
- Skip intro and Escape dismiss the sequence. It also finishes automatically.
- The intro starts on every page load or reload. It does not read or write a
  session-storage marker; markers left by the previous version are ignored.
- Replay controls remain available in the Meu foco view on desktop and mobile.
- Reduced-motion preferences bypass the animated intro, including when changed
  during playback. Replay is disabled while reduced motion is active. The board
  remains usable without animation.
- The board is inert while the intro is open, and body scrolling is restored
  on dismissal. Keyboard focus returns to the board or the replay control.

## Files

- `frontend/src/components/AkariIntro.tsx`: GSAP sequence, skip/Escape and cleanup.
- `frontend/akari-intro.css`: responsive scene styling.
- `frontend/App.web.tsx`: session state, replay and board integration.
- `frontend/assets/akari-intro-face.webp` and `akari-intro-hand.webp`: supplied artwork.
- `frontend/styles.d.ts`: WebP module declaration for bundled image imports.

## Validation

Run from `frontend/`: `npm run lint`, `npm run typecheck`, then
`npm run test:e2e`. The browser tests mock health responses; this intro does not
change the backend or the task data model.

Integration checks on 2026-11-17: lint, TypeScript and web export passed;
10 browser tests passed and the optional live-API test was skipped. Browser
coverage included the original session behavior, blocked storage, skip/Escape, automatic finish,
replay focus, mobile behavior, reduced-motion changes and the existing board flows.
The live-API test now bypasses animation with reduced-motion emulation and still
uses real Django responses when explicitly enabled.

Desktop and 390px mobile captures were visually reviewed. Integration also fixes
the original timeline's vertical translation overriding CSS centering, which had
cropped the full-body shot on desktop. The rise animation now retains its centered
baseline so the complete figure fits in the wide scene.

The later Figma homepage implementation changes the reload behavior as described
above and keeps the board under Meu foco. See [homepage-figma.md](homepage-figma.md)
for the current implementation and verification.
