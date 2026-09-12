# Mobile visual audit

Baseline: current working tree on 12 September 2026. Screenshots and browser measurements are in `evidence/`. Confirmed functional defects use C-identifiers from [CODEBASE-AUDIT.md](CODEBASE-AUDIT.md). Recommendations below are design decisions, not invented failing tests.

## Overall direction

Keep the existing Onest typography, restrained red/ink actions, pale mobile canvas, white cards, and automotive artwork. The strongest parts are the compact listing rows, clear price hierarchy, and short Sell/Import entry journeys. The weakest parts are the inconsistency between discovery tiles, repetitive actions/location blocks, variable artwork framing, and the number of independently styled controls. Finalization should make the current design coherent, not replace it with a new theme.

Adopt one mobile container/gutter rhythm, one heading scale, one ordinary 44px action/input treatment, one card-radius family, and a shared overlay surface contract. Controls must grow when text enlargement requires it; do not clip text to enforce a 44px maximum. Keep route titles inside the route's content/hero, not the global header. Reduce explanatory copy where the label and next action already explain the flow. Do not add decorative underlines, badges, icons, or separators without a purpose.

## Homepage — `/`

The 320px and 390px full-page captures show a coherent top search area but a long sequence of repeated entry points: quick chips, purchase/sale cards, budgets, featured vehicles, body types, brands, import/leasing banners, articles, videos, help cards, and a full footer. Preserve the primary search and inventory discovery. Consolidate the lower repeated service/help links and define a compact mobile footer rather than keeping multiple versions of the same navigation.

**Fix first:** body tiles crop at narrow widths and use a different visual/text treatment from brands. Baked images have fixed 180px width; SUV and wagon visibly spill/crop inside the 320px two-column grid. The All Types accessible name is duplicated, and its hidden-label utility is wrong. Keep one approved expansion pattern for types and brands; use exactly one label and one clear expanded/collapsed state. Do not change a working button into a link just to satisfy a stale count assertion. C05/C06/C09.

Featured inventory and articles intentionally show the next card partially inside horizontal rails; this is not document overflow. Preserve the swipe affordance while giving each visible card adequate text width and ensuring the last card is reachable. The homepage quick-search overlay needs the scroll-lock repair C02. Optimize the heavy service artwork C08 before judging loading placeholders as a visual defect.

Evidence: `screenshots/390-_.png`, `narrow-1.jpg`, `screenshots/edge-320-dn-body-types.png`, `screenshots/edge-1440-dn-body-types.png`.

## Inventory — `/listing-grid`

The compact image-left rows are usable and fit the tested phones. Keep the title/price/spec hierarchy and make the whole card a single predictable destination. Do not add a large mobile hero above the results. Improve the search label contrast, preserve the visible active-filter state, and agree a small result-count treatment that does not compete with the controls. A meaningful heading exists in the markup; lack of a large visible hero is not an accessibility defect by itself.

Filters and sorting must use the same picker rhythm, close affordance, draft/apply semantics, and bottom safe-area handling as home search. Existing nested-filter functionality passed its dedicated suite. Do not replace it with native-looking white boxes mixed into dark overlay chrome. Recheck the actual open states after hydration, not a screenshot taken before the click attached. Empty results must retain clear reset/recovery actions.

Evidence: `core-1.jpg`, `narrow-1.jpg`, `mobile-filter-smoke/`, `browser-routes.json`; C07 is the measured listing contrast issue.

## Vehicle detail — `/listing-detail-v1/:id`

All eight vehicle pages were captured and reviewed. The vehicle photo, title, price, specifications, equipment, finance illustration, seller, location, related cars, and fixed contact dock are present. Main issues are density and repetition, not a missing route or JavaScript crash. The calculator and seller area are conventional components; the previously discussed generated financing/seller banners are not wired into this PDP.

Recommended mobile order: vehicle media → title/price/key facts → description/equipment → one financing entry → seller/location → related stock, with a stable two-action inspection/call dock. Avoid repeating the same two CTAs in several adjacent blocks. Keep one useful location presentation instead of repeating the full address in multiple cards. Fix the overview/calculator text contrast before cosmetic changes. Preserve vehicle context and return-to-filtered-list behavior.

For financing artwork, use a compact approved banner as an entry to an interactive calculation/enquiry surface rather than turning numeric controls into a picture. Baked campaign lettering may be part of approved art, but keep changing prices, phone numbers, vehicle details, calculated values, and real actions in typed data and semantic HTML. A seller banner is optional, not a reason to bake contact information permanently into an image. Give any artwork one semantic accessible name; do not layer a second visible heading over text already in the image. This reconciles the prior artwork direction with the current no-hardcoding requirement.

Evidence: `details-1.jpg` through `details-3.jpg`, `narrow-2.jpg`, `edge-checks.json` finance handoff; C07 and finance-context section of the code audit.

## Sell and Import — `/contact?topic=trade-in|import`

The shared red artwork stage and floating white entry card are close enough to finalize together. Sell currently uses a large primary button while Import uses a link field/submit treatment. Make the entry row heights, card padding, title baseline, and secondary call placement agree without forcing unrelated content into artificial fixed heights. Keep the no-link path directly beneath the import entry. The local stepper remains appropriate: identify car, optional details/photos, review/copy/share.

Use the same dark drawer surface, readable fields, clear header/back/close controls, and action placement across both journeys. Preserve the truthful local-photo/local-draft explanation, but express it once at the relevant step rather than repeating demo prose everywhere. Required whitespace is a real blocker (C03). Actual phone keyboard, file picker, and OS share-sheet behavior require the device pass; mocked sharing tests are not delivery verification.

Evidence: `screenshots/390-_contact_topic_trade_in.png`, `screenshots/390-_contact_topic_import.png`, `narrow-1.jpg`, `narrow-2.jpg`, `enquiry-smoke/`.

## Contact, Leasing, Inspection, About

These routes load with the correct topic/selected-vehicle context. Keep a short purpose heading and one primary contact action. Remove repeated address/appointment copy where the same information immediately appears above the map. Contact and About should share a white content heading area and a consistently framed map, not invent another hero/header layout. The settled Contact map really renders: the earlier blank captures were loading timing, not evidence of a broken map. Keep the fallback directions link and ensure its floating button does not cover required map attribution or essential map controls.

About's service explanations and actual source-backed business details are enough; do not enable demo team/testimonial/partner sections to fill space. Do not invent trust claims. Evidence: `core-1.jpg`, `core-2.jpg`, `screenshots/map-_contact.png`.

## Blog and all nine article pages

The editorial pages have a deliberate yellow accent and readable article hierarchy. Keep that distinction unless the overall brand direction changes. Standardize search/chip dimensions and article-card framing with the rest of mobile, but do not add a large stock-style search hero. Article title wrapping and body sections were reviewed for all nine current posts; preserve the filtered return URL and related-article navigation. Additional long-title, long-word, and 200% text fixtures belong in sign-off because the current nine posts do not cover every content shape.

Evidence: `core-2.jpg`, `articles-1.jpg` through `articles-3.jpg`; empty/missing route behavior is in `browser-routes.json`.

## Visual sign-off contract

Approve route screenshots at 320, 390, and 430px plus a short landscape viewport. Review initial, loading, expanded, invalid, empty, and focused states; do not sign off from a single full-page image. A fixed dock can appear partway down a full-page stitched screenshot because it belongs to the capture viewport; verify docking in a normal viewport before diagnosing it as a layout error. See the explicit coverage limitations in [QA-COVERAGE.md](QA-COVERAGE.md).
