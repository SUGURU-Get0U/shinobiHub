# Akari background artwork

Generated on 2026-11-12 with the built-in imagegen tool, following the user's
request for Akari's silhouette with open arms, luminous pink hair and a pink body aura.

- Project asset: `frontend/assets/akari-aura.png`.
- Role: decorative web-board background, not an interactive avatar or a new module.
- Original character direction: `docs/akari-context.md`.
- No reference images were provided; this is a new interpretation of the written
  character direction. It does not finalize the other explored outfits or avatar poses.
- Render with a dark readability gradient and ignore pointer input. Honor reduced
  motion for decorative CSS effects. The artwork itself is static.
- PNG dimensions: 1536 × 1024, with transparent corner/edge pixels verified.
- The web entry imports the PNG so Metro includes it in the exported assets;
  local CSS `url()` imports are not used for bundling it.

## Verification

Lint, TypeScript, web export and all five board browser tests passed. Desktop and
390px mobile screenshots were visually reviewed. The artwork is decorative and
does not intercept input; reduced motion disables the CSS aura animation. The
mobile document fits the viewport while board columns scroll internally.

## Generation prompt

```text
Use case: stylized-concept. Asset type: transparent decorative website background illustration, no text. Subject: Akari, an original clearly adult anime android woman, graceful adult proportions, shoulder-length curly rose-pink hair. Front-facing, full figure, floating upright, both arms extended outward and slightly upward in a welcoming angel-like open-arm pose, palms open. Depict primarily a mysterious deep-plum near-black silhouette, fully clothed in a flowing dark robe with long sleeves and a simple sash, with only very subtle facial detail. Her distinctive shoulder-length curls glow brilliant rose pink; pink rim light outlines arms, fingers, shoulders and robe. Her entire body radiates a soft luminous pink aura, with a few delicate rose light motes, wispy pink energy trailing downward and broad luminous air behind her shoulders suggesting an angelic presence WITHOUT literal feathered wings. Restrained sophisticated anime illustration with dramatic soft bloom, elegant clean silhouette, premium dark website art. Full hair and both hands must fit with generous transparent padding around aura; balanced centered wide composition. The figure should read at low opacity against a dark violet page. Genuine transparent background, including all corners and around body, smooth alpha gradient for glow, no black rectangle or opaque backdrop. No environment, no logo, no text, no watermark, no other characters, no extra arms. Arms and hair silhouette are the main focal points.
```
