# Mobile PDP drawer correction

3 October 2026. Scope: the Mobile showroom candidate, its existing GitHub mirror
and the existing `cars-template-mobile.vercel.app` test deployment.

The owner rejected the first PDP layout: it presented separate rounded cards
and placed the information tabs after the title, price, finance and contact
blocks. Functional tab and popup checks did not establish the intended drawer
composition. In the live in-app browser at 390 × 568, the tab rail began at
601.30px and ended at 654.30px, entirely below the viewport.

## Correction

One white sheet now starts directly beneath the vehicle photo, overlapping it
by 20px, with rounded top corners, a restrained shadow and a small handle.
The three equal-width Details / Photos / Features underline tabs sit at the
sheet entrance before the title and price. The handle and tabs pin below the
60px vehicle header while the information content scrolls.

Details contains the retained title, price, financing, contact actions, summary
facts, technical data and description on one continuous white surface. Dividers
replace the individual rounded boxes. Photos and Features replace this content
within the same sheet. The compact price/enquiry action stays available in those
two views; in Details it appears after the main actions pass the pinned rail.
The contact observer measures the rail and responds to changes in its height.

The sheet uses the browser's normal page scroll. There is no separate nested
scroller or draggable modal. The existing photo viewer, technical-data dialog,
URL section state, inventory Back behavior and financing/contact actions remain.
Home, Services and Contact retain their tab styling; only the PDP uses the flush
rail variation. Non-showroom reference sections retain their existing cards.

## Source checks

- TypeScript and ESLint across `src` with zero warnings: passed.
- All 86 domain tests: passed.
- Scoped Prettier and whitespace checks: passed.
- Existing browser QA source adds 320/390 × 568 entry checks for photo overlap,
  visible tabs and flat summary facts. Script syntax passes; the complete suite
  has not been executed.
- Production build: passed, all 50 static pages generated. Build ID:
  `5Q4hGn9VsSHy75_ZyK1c1`.
- The generated-configuration guard verified and restored only expected Next
  TypeScript additions. Existing runtime/reference files were preserved.
- `workspace-doctor.mjs --fetch`: Cars had no fetched main drift; unrelated
  template/client drafts and independent Admin divergence were preserved.

## Hosted verification

The corrected source is being exported through the existing Cars source utilities
to the same private `darkapoparka/cars-template-mobile` publishing mirror. Its
Git push supplies one new production build to the existing Vercel project.
The source/deployment identities and the after renders will be recorded here
after the provider reports READY and live inspection finishes.

Before screenshots and local check logs are retained under
`runtime/mobile-pdp-drawer-20261003/`. The earlier local-browser restriction
still applies; hosted checks use the public HTTPS deployment. Real-device
Safari, keyboard/touch gestures and owner visual acceptance remain pending.

No template release lock, dealer copy, other Vercel project or outreach changed.
