# Modern desktop refresh — 1 October 2026

## Audit and implementation

Reviewed the live preview in Codex Browser at http://127.0.0.1:6462/bg.
The original desktop homepage and inventory repeated a twelve-control search panel;
list rows used small photos with excessive empty space, and grid titles truncated.

- Replaced the homepage masthead with a split introduction and a vehicle from the existing inventory search data. No separate featured dataset or provider dependency.
- Kept make, model, price and year immediately visible. Other filters use an accessible disclosure with a stable control ID; collapsing it preserves the draft. The existing dialogs and URL search state remain authoritative.
- Standardized the desktop content width through the existing layout token, including header, results, service pages, vehicle detail and footer.
- Used three larger desktop card columns, wrapped titles, a separated price/facts hierarchy and image sizes matching the rendered cards. Retained grid/list preference and carousel behavior.
- Simplified service mastheads and vehicle-detail heading/back navigation. Updated the discovery loading skeleton to match the new introduction and three-column inventory.
- Kept styling below 1024px in its existing owners. Preserved the mobile edits present at task start; those were committed independently during this work.

## Verification

- Node 22.23.2; existing listener on 6462 preserved.
- `pnpm --filter web typecheck`: passed.
- `pnpm --filter web --filter @repo/marketplace-ui test`: 55 files, 271 tests passed on the final source.
- `pnpm --filter web build`: passed after the loading-state update, with the documented static-demo environment. The build includes TypeScript and route generation.
- Scoped Biome check and `git diff --check`: passed.
- Browser visual review: BG home at 1024, 1440 and 1920; BG inventory and detail at desktop; detail at 1024; English inventory at 1280; BG import, sell, financing and contact at 1440; contact at 1024.
- Mobile regression: BG inventory at 320 and 390, detail at 320. No horizontal overflow in the measured views. These are browser viewport checks, not native device or complete accessibility certification.
- Diesel filter: expand controls, choose diesel, apply, collapse controls, submit; URL becomes `/bg/cars?fuel=diesel` with seven results.
- Grid/list controls, listing navigation, full-screen gallery and Escape dismissal worked. Back to search retained the diesel query.
- Financing picker selected BMW M4 Competition; the resulting CTA was a `tel:` link. No enquiry or phone call was sent.
- Transient Turbopack stylesheet HMR messages occurred during edits. A final reload rendered correctly with no newly logged browser errors.

## Review evidence

- `home-1440.jpg`: complete homepage, including inventory, service links and footer.
- `home-1440-viewport.jpg`: first viewport.
- `inventory-1440.jpg`: inventory grid.

This is local template implementation and verification. Owner visual acceptance,
immutable release selection, dealer propagation and hosted verification are separate.
No dealer was deployed and no live provider delivery was enabled.
