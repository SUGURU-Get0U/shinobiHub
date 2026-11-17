# Figma welcome homepage

Implemented from [frame 2:2](https://www.figma.com/design/LX92TzzhJ87NVwk1INgvIi/?node-id=2-2)
on 2026-11-17, using the Figma plugin's high-fidelity design context and screenshot.
The screenshot is a comparison reference, not an implementation asset.

## Behavior

- Início is the default screen: white navigation, dark canvas, Japanese welcome,
  the exact moon image and Akari artwork from the design.
- Meu foco opens the existing task board. Card state survives switching between
  these two views in memory; refreshing still resets fictional task data.
- Projetos, Estudos and Caderno retain their design slots but are disabled with
  an Em breve tooltip. No project/study/notebook backend was added.
- The existing intro plays on every load/reload, with Skip, Escape and natural
  completion preserved. Reduced-motion preferences continue to bypass animation.
- Mobile adapts the supplied desktop frame into a horizontal navigation and an
  uncluttered illustration without page-wide horizontal overflow.

## Assets and typography

| Design slot | Local file | Source geometry at 1440 × 900 |
| --- | --- | --- |
| Moon, node 2:3 | `frontend/assets/figma-welcome-moon.png` | x798, y95; 630 × 630; circular cover; opacity 0.78 |
| Akari, node 2:11 | `frontend/assets/figma-welcome-akari.png` | frame x431, y135; 1070.977 × 717; image contain, rotation 0.39° |

These are the PNG assets supplied by Figma, not substituted illustrations. Their
temporary download URLs are not used at runtime. Metro bundles the local imports.

`SiteFonts.tsx` declares local font faces resolved through Metro. Inter comes from
[Google Fonts' Inter sources](https://github.com/google/fonts/tree/main/ofl/inter).
M PLUS 1 comes from [Google Fonts' M PLUS 1 sources](https://github.com/google/fonts/tree/main/ofl/mplus1),
with Google's font API providing a 6.5 KB bold subset for the design's Japanese
characters instead of the full 4 MB font. Both OFL licenses are included under
`frontend/assets/fonts/`. No font service is contacted at runtime.

## Implementation and checks

`WelcomePage.tsx` contains the reusable sidebar, header and welcome scene.
`welcome.css` translates the frame's layout into the existing plain-CSS frontend.
`App.web.tsx` preserves task state, editing and the existing intro component.
No backend, navigation-library migration or new npm dependency is required.

Run `npm run lint`, `npm run typecheck` and `npm run test:e2e` from `frontend/`.
The home tests verify local image loading, desktop asset geometry, mobile width
and preserving task edits across navigation. Intro tests verify replay on reload,
including when a legacy session marker exists.

Final validation: lint, TypeScript and web export passed; 12 browser tests passed,
with the optional live-API test skipped. Both image assets and both font files
returned HTTP 200 in the browser; the font faces loaded successfully. Desktop
1440 × 900 and mobile 390px captures were visually compared with the design.
The desktop image geometry matched the source coordinates and the mobile document
width remained 390px. No temporary Figma/font-service URLs occur in runtime code.
