# Mobile Home correction — 3 October 2026

The owner's latest correction centers the original proportional Drive24 logo above search inside the dark Home panel. The mobile location/contact row and the Available cars / View all row immediately beneath the panel are removed. The make strip, promotional carousel and car feed follow. The illustrated service tabs retain their current artwork and geometry.

This supersedes the mobile inline logo/contact row and inventory navigation row in [the previous Home pass](../mobile-home-polish-2026-10-03/README.md). Wider screens retain the configured contact action, separate search and inventory heading. The panel keeps the existing gutters and rounded corners.

## Rendered evidence

| View | Before | After |
| --- | --- | --- |
| Bulgarian Home, 390 × 844 | [Before](before/bg-home-390.jpg) | [After](after/bg-home-390.jpg) |
| Bulgarian Home, 320 × 760 | Previous pass retained above | [After](after/bg-home-320.jpg) |
| Bulgarian Home, 1440 × 1000 | [Before](before/bg-home-1440.jpg) | [After](after/bg-home-1440.jpg) |

The in-app Chromium preview uses a 15px vertical scrollbar, so available document widths are 305px and 375px at the two phone viewports. Both document widths equal their scroll widths. The logo is 204 × 68px, centered exactly within the 150px-high mobile panel, with one visible 44px search target inside it. No mobile contact pill or inventory navigation row is visible. The search action opens `/bg/search` by keyboard and exposes its editable make/model combobox.

At 1440px, measured banner, logo, contact, search and inventory-heading positions and dimensions match the baseline. No browser errors or warnings were captured. [Measured checks](results.json).

## Source and build

Canonical checkout: `L:/CODEX/cars/templates/app` on Cars `main`, based on `db65c48c89e3c5e0bf1252957ab31114d057e633`. Changes affect `components/DealerHomeBanner.tsx`, `app/[locale]/page.tsx` and the current Home instruction in `TEMPLATE.md`.

`npm run check` passed using Node 22.20.0: ESLint, TypeScript and the Next.js webpack production build, with 407 static pages generated. The build used `.next-build-check` separately from the live `.next` development output. The generated `next-env.d.ts` imports were returned to their existing development paths.

The preview remains available on `http://127.0.0.1:6483/bg`. The existing Git index lock was preserved until its owner released it. Unrelated quick-filter edits remain untouched. This receipt establishes local implementation and visual checks; the scoped source commit is reported in the task handoff, and owner acceptance and dealer publishing remain separate.
