# Neutral landing banners — 2026-09-27

All four landing banners now share neutral grey and charcoal colour tokens. Sell, Finance and Services retain their reviewed two-column composition, with monochrome photos and charcoal CTAs. Home retains its studio-car artwork and now has the same 44px action treatment.

Home order is now service shortcuts, banner, search/Saved, quick filters. The search row was extracted from DiscoveryHeader; the sticky filters now account for the shared 156px expanded / 112px compact phone header.

Validation: npm run check passed with Node 22.23.2 (lint, typecheck, production build). Inspected all four routes at 320px and 390px, Home and Sell at 1440px, and Home at 768px. Search opens and Toyota suggestions respond. Verified compact header and quick-filter placement during scrolling. Evidence: Cars runtime/app-showroom-qa/neutral-home-390.png and neutral-sell-390.png.

Local preview is running at http://127.0.0.1:6473/. No release or deployment. App remains an untracked candidate in the shared Cars checkout; the existing Git index lock and unrelated staged changes were left untouched. No commit/push attempted.
