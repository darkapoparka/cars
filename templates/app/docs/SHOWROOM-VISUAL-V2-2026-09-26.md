# Showroom visual revision v2

Local App candidate only. No template release, dealer deployment or template-lock changes.

## Changes

- Charcoal and white identity with restrained red accents, neutral surfaces and a red active navigation state.
- Generated transparent Finance and Services illustrations and a studio-car hero. Full prompts and generation details are in `public/showroom/ASSET-PROVENANCE.md`; the tool did not expose model/version selection.
- Replaced the previous floating cutout hero with a complete studio scene, editable heading and inventory CTA. Responsive masks blend the artwork into its surrounding surface.
- Reduced the mobile dock to 212 by 56 pixels with four icon-only links, accessible names, active state and 44 by 44 pixel targets.
- Preserved the four top shortcuts, configuration boundary, inventory fixtures and reference assets.

## Verification

- Browser inspection at 320x740, 390x844, 768x1024 and 1440x1000; no page-wide horizontal overflow.
- Confirmed all five home images loaded successfully in the production preview.
- Clicked Finance and Services, each of the four dock links, and the hero inventory CTA; confirmed expected destinations.
- Saved production screenshots in Cars `runtime/app-showroom-qa/v2-home-320.png`, `v2-home-390.png` and `v2-home-desktop.png`.
- Node 22.23.2: final `npm run check` passed (ESLint, TypeScript and production build; 205 pages generated).
- Rechecked the final intersected banner masks at tablet and desktop widths; no hard image edges remained. Also saved `v2-home-tablet.png`.
- No browser console errors were recorded in the production verification tab. Production preview was restored on port 6473 and left running.

## Boundaries

The imported App folder remains untracked in the shared parent checkout. Unrelated staged work and an intermittent Git index lock were preserved; no staging, commit or push was performed. Deeper reference finance, service, inventory and account copy still requires dealer adaptation before release. Synthetic artwork does not represent actual dealer inventory or financial terms. Owner visual acceptance remains pending.
