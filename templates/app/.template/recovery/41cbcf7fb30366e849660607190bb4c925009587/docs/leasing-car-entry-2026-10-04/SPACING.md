# Mobile discovery spacing — 4 October 2026

The country and service pills sat 27px below the dealer panel because 6px banner padding, a 16px section margin, 3px rail padding and 2px inside the pill's touch target accumulated. The tabs-to-banner gap was already 12px. Country pills-to-cards measured 17px; Services measured 19px; Sell's banner-to-card gap was 20px.

The corrected phone layout uses 12px visible gaps between related discovery groups. Shared StyleX variables account for the invisible touch/focus padding: section gap 12px, pill section margin 10px with its 2px inset, and Home make-strip margin 8px with its 4px focus padding. The banner wrapper no longer adds bottom padding on phones. Pill targets remain 44px and their visible surface remains 40px, with the inset keyboard ring. All flags, names, searches and actions remain available.

Leasing and Services now measure 12px from tabs to banner, banner to visible pills, pills to cards, between cards and from the last card to the lower campaign. Sell's first two cards follow the same rhythm, including the process panel. Home measures 12px from banner to makes, makes to the promotional carousel, the complete carousel group to the feed and between feed cards. Cars measures 12px from search to visible pills, pills to results and between result cards. The promotional pager stays part of its carousel group; larger spacing around standalone text sections remains intentional.

## Verification

- 20 phone renders: Home, Sell, Leasing, Services and Cars in BG/EN at 320px and 390px. Every asserted discovery gap measures 12px, with no horizontal document overflow.
- Five 1440px English before/after comparisons preserve the measured desktop banner, pill-row, first-card geometry and gaps exactly.
- Keyboard Enter still selects a country; its target remains 44px and its focus ring remains inset.
- All 26 assertions pass. No browser warning/error appeared during the spacing review.
- `npm run check` passed: lint, TypeScript and the production build with 407 generated pages, using Node 22.20.0. Isolated `.next-build-check` output preserved the live preview; generated type imports were restored to `.next/dev` afterward.

[Leasing before](spacing-before-bg-390.jpg) · [Leasing after](spacing-after-bg-390.jpg) · [Services before](spacing-service-before-bg-390.jpg) · [Services after](spacing-service-after-bg-390.jpg) · [Recorded geometry and assertions](spacing-verification.json)

## Source and handoff

Canonical source: `L:/CODEX/cars/templates/app` on Cars main at `6c92fdc2758d5d5b985a9c8a9004c7bb969d313a`. This correction edits `app/tokens.stylex.ts`, `app/[locale]/page.tsx`, `components/ShowroomBannerFrame.tsx`, `components/ImportCountryPicker.tsx`, `components/ServiceCatalogue.tsx`, `components/FeatureContent.tsx`, `components/BrandCampaign.tsx`, `components/ReferenceUI.tsx` and `components/InventoryClient.tsx`, plus the template contract and this evidence. `ImportCountryPicker.tsx` already belongs to the preceding Leasing changes; the other eight paths extend that scope.

At the original local check, the shared index lock blocked commit/push and no paths were staged. The later preview-publication request confirmed that unchanged empty lock was orphaned and preserved it and the previous index before recovering scoped commits. Unrelated drafts remain preserved. Local source/build/browser evidence does not establish a hosted deployment or physical-device acceptance.
