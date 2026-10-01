# Cars24-inspired identity and emblem polish

Main source: L:/CODEX/cars/templates/app. Master preview: http://127.0.0.1:6483/bg. Navara comparison: http://127.0.0.1:6475/variant-4/bg.

The master now uses generated Drive24 image assets through the same DealerBrand component as clients, replacing its text/icon fallback. Silver and graphite versions retain transparency and are chosen for dark/light surfaces. Navara retains its configured original logo and contacts.

Manufacturer emblems retain original image bytes. Source dimensions and symbol view boxes normalize transparent padding, preserving original framed Cars24 badges and centering other sourced symbols at similar optical sizes. Each make keeps one circle and one label; manufacturer artwork is not generated.

The larger 44%-width mobile card photo and deliberate two-row facts on the right remain in place. Search stays 44px tall. No additional page sections, marketplace claims, fake contacts or campaign copy were added.

Agent handoff standards: ../../../../docs/APP-ASSET-STANDARDS.md. Generated logo prompts and originals are recorded in PROMPTS.md.

## Runtime storage recovery

L: reached zero free bytes during concurrent validation. A deletion request for old webpack caches was blocked by automatic review. Instead, four explicitly inspected, inactive cache folders were preserved by moving them to C:/Users/radev/.codex/tmp/cars-app-cache-2026-10-01-01a0f62d/. The master-card-check-webpack, master-card-word-webpack, navara-card-check-webpack and navara-card-word-webpack folders contain the previous cache bytes. Source, generated assets, screenshots, build server/static outputs and Git data were preserved. This freed about 695 MB on L: immediately after the move.

## Final verification

- Master and Navara: npm run check executed with Node 22.20.0; ESLint and TypeScript passed. The first production builds failed on ENOSPC, then passed after the cache move. Final focused ESLint checks and both final production builds also passed.
- Master: no page overflow at 320px, 390px or 1440px. Manufacturer circles are uniformly 72px on phones and 108px on desktop. Original framed assets use cover fitting to remove their transparent side gutters; cropped SVG symbols preserve their view-box aspect ratio so embedded wordmark fragments cannot leak into the visible square.
- The silver banner and graphite desktop-header logos both loaded with transparency. The master no longer bypasses image rendering in template mode.
- All 19 stocked master makes are mapped. Clicking Toyota returns nine Toyota listings. Navara retains its original logo URL, verified call destination and all eight stocked manufacturer makes, including balanced Tesla, Peugeot, Opel and Smart emblems.
- Final screenshots and verification.json are retained in this directory. Related card geometry evidence is in ../card-right-column-2026-10-01/.
- Active preview builds: master .next-card-right-check on 6483; Navara .next-card-layout-check on 6475. No Vercel dealer deployment was made.

## Source delivery

The branding pass saved changes in the canonical master working tree and mirrored relevant components into the local Navara preview. Its initial commit attempt was blocked by the existing zero-byte L:/CODEX/cars/.git/index.lock (last modified October 1 at 11:50:12). The lock was neither removed nor bypassed. During the later compact-card pass the lock was absent, allowing these changes to be staged with the scoped App update. See ../card-compact-2026-10-01/ for the superseding mobile card layout; that later card change was not mirrored into Navara.
