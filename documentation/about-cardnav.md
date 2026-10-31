# About navigation

The web About page uses React Bits `CardNav-JS-CSS` as a floating dark-glass
navbar. The Shinobi HUB text logo and the single Home menu link lead to `/`
through Expo Router's `Link`, passed as `linkComponent`. There are no placeholder
destinations or extra calls to action. OptionWheel remains a future increment.

The bar sits 24px from the top with at least 16px side margins and an 800px
maximum width. It scrolls with the page. Its expanded panel overlays LaserFlow;
About overflow is visible so the menu is not clipped. Native About is unchanged.

Source: https://reactbits.dev/r/CardNav-JS-CSS.json

Files are under `frontend/src/components/react-bits/`, with the existing
React Bits license. A declaration file describes the properties used by the
TypeScript route. Local adaptations move render-time ref updates to layout
effects, synchronize visibility on an open-state transition instead of setting
state inside a layout effect, and use an inline SVG for decorative arrows. Installing the
upstream Hugeicons dependencies failed npm peer resolution against the existing
React version; no dependency changes were forced or left behind.

Run `npm run web:poll` in `frontend/` and open `/about`. Check the menu on narrow
and wide screens, Home navigation, keyboard focus, Escape dismissal and reduced
motion. Browser-level checks remain pending if Chromium is unavailable.
