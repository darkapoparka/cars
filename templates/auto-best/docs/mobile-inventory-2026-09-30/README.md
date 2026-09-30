# Mobile inventory revision — 30 September 2026

The original split layout cropped away much of each car and squeezed the model names into a narrow column. The first revision, `e9d021f8c`, replaced it with a full-width landscape photograph above the vehicle information. The comparisons below record that first revision at **normal text size**, the same 320×844 and 390×844 viewports, and the same scroll position in the in-app browser at `http://127.0.0.1:5173/en/listing-grid`. Subsequent revisions and the current compact list appear at the end of this record.

| Normal text size | Before | After |
| --- | --- | --- |
| 320px | ![Original 320px inventory](before-320.jpg) | ![Revised 320px inventory](after-320.jpg) |
| 390px | ![Original 390px inventory](before-390.jpg) | ![Revised 390px inventory](after-390.jpg) |

## Implementation

- Mobile listing cards use a 16:9 image frame, 16px content padding and 16px separation between cards. Model names wrap completely. The make, specifications and price share a consistent left edge; specifications use restrained dividers rather than four separate chips. The 24px price uses the control line-height role so currency and amount can wrap comfortably at enlarged text sizes.
- The bottom dock shows icons when its available content width is at most 20rem, including normal 320px layouts and enlarged text on typical phones. The clipped label remains the accessible name. Wider normal-text layouts retain labels. All five controls retain at least 44×44px targets, current-page indication, keyboard focus and menu focus return.
- The mobile image `sizes` hint now matches the full-width frame. Only the first inventory image requests high fetch priority; subsequent images use browser lazy loading. Five 960px derivatives bridge the existing 640px and 1600px sources. A personalized photograph without a registered derivative still uses its own original.

The original desktop/tablet composition, inventory records, link destinations and source photographs remain in use. The mobile image frame trims background above/below the car instead of cropping its sides into a narrow thumbnail.

At enlarged desktop text sizes, the header's two action buttons can stack within their existing column so they do not cover the navigation links. Normal desktop text keeps the existing row.

## Responsive image delivery

The new files are faithful 960×640px resizes of the retained photographs, encoded with Sharp/libvips at WebP quality 82, effort 6. Their combined size is 293,068 bytes, versus 1,098,162 bytes for the five originals (73% smaller). This is an asset-size comparison, not a page-load-time measurement. A 390px viewport at 2× pixel density selects the new 960px source.

| Photograph | Original bytes | 960px bytes |
| --- | ---: | ---: |
| Stock 01 | 278,312 | 68,160 |
| Stock 02 | 248,390 | 65,538 |
| Stock 03 | 181,070 | 55,378 |
| Stock 04 | 182,452 | 46,414 |
| Stock 06 | 207,938 | 57,578 |

## Verification

The owned production preview at `http://127.0.0.1:5185` served the final build. The live in-app browser supplied the comparisons above and verified inventory → vehicle 1 → inventory `#vehicle-1` at 320px.

| Check | Result |
| --- | --- |
| `npm run validate` | Passed architecture, CSS, token, typography, asset, domain, locale, Svelte/type and build checks |
| Final CSS/Svelte checks and production rebuild | Passed; 0 Svelte errors and 0 warnings, Node 22.20.0 |
| `scripts/mobile-polish-smoke.mjs` | 8/8 passed: EN/BG at 320, 390, 430 and 1440px; full card titles, landscape frames, accessible icon names, first-image priority and existing actions |
| `scripts/mobile-final-smoke.mjs` | 6/6 passed: enlarged dock, reduced motion, menu focus return, hidden dock inertness and image loading |
| `scripts/mobile-reflow-smoke.mjs` | 66/66 Chromium and 66/66 WebKit cases passed, including text spacing, 200% root text and short dialogs |
| axe-core 4.13.0 and card text bounds | 42/42 inventory states passed with zero violations, overflow or clipped mobile copy; EN/BG, 320/360/390/430/767/768/1440px, normal/spacing/enlarged text |

The axe run includes `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa`. A 390px viewport at 2× density selected the 960px image. Detailed states are in [audit-report.json](audit-report.json); suite counts, timestamps and verified source blob IDs are in [checks.json](checks.json). Those blob IDs are checked against the scoped staged source before committing.

Initial concurrent runs encountered two navigation timeouts and a WebKit geometry sample before paint had settled. Final runs used two browser processes at most; the reflow harness now waits for paint after fonts are ready, consistent with its existing text-override sampling. The closer text bounds check also identified the price line-height and enlarged desktop action overlap addressed above. All final runs passed.

320 CSS pixels also represents a 1280px viewport at 400% zoom; its relevance extends beyond the physical width of a phone. See [W3C's reflow explanation](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

## Scope and preserved work

### Badge follow-up

The badge revision, `de074faf1`, kept the photograph on top and grouped all four specifications into centered pill badges in two equal columns. At card widths of 15rem or less it used one badge column. Content had 12px vertical padding and a separate right-aligned price row. This layout was superseded by the compact revision below; [Styling](../STYLING.md#mobile-listing-cards) describes the current component contract.

The initial screenshots and full matrix above record the first revision, `e9d021f8c`. These are the updated cards at normal text size and the same scroll position:

| Width | Previous details | Centered badges |
| --- | --- | --- |
| 320px | ![Previous details at 320px](after-320.jpg) | ![Centered badges at 320px](../mobile-card-badges-2026-09-30/after-320.jpg) |
| 390px | ![Previous details at 390px](after-390.jpg) | ![Centered badges at 390px](../mobile-card-badges-2026-09-30/after-390.jpg) |

The badge revision passed `npm run validate` (0 Svelte errors and warnings), all 8 mobile polish cases, all 66 WebKit reflow cases, and all 42 Chromium inventory accessibility/text-bounds states with no violations or clipping. The tested `VehicleCard.svelte` blob is `e846e371bd1edcc9bc833507fbf1c0b455915bef`; the prior JSON matrices remain evidence for the first revision. Both languages were also inspected in the live in-app browser.

### Compact details follow-up

The separate price row and full-width badge grid made the cards unnecessarily tall. The model and price now share a row, with 18px and 20px type respectively. Specifications use small intrinsic-width badges in year/mileage and fuel/transmission pairs, wrapping as pairs when space is limited. The details panel uses 8px vertical and 12px horizontal padding, an 8px row gap and 2px gaps between badges. At narrow container widths or enlarged text, the identity and price stack without clipping. The full-width 16:9 photograph stays in place.

These screenshots compare the tall badge revision with the compact revision at **normal 16px root text**, identical CSS viewport sizes, and scroll position 0. In the in-app browser, the first card measures 251.5px high at 320px and 290.9px at 390px; its details panel is 93.4px in both views. Longer model names and translated badges grow naturally.

| Width | Tall badge revision | Compact details |
| --- | --- | --- |
| 320px | ![Tall card at 320px](../mobile-card-badges-2026-09-30/after-320.jpg) | ![Compact card at 320px](../mobile-card-density-2026-09-30/after-320.jpg) |
| 390px | ![Tall card at 390px](../mobile-card-badges-2026-09-30/after-390.jpg) | ![Compact card at 390px](../mobile-card-density-2026-09-30/after-390.jpg) |

The compact revision passed `npm run validate` (0 Svelte errors and warnings), all 8 mobile polish cases, all 66 WebKit reflow cases, and all 42 Chromium inventory accessibility/text-bounds states with no violations, overflow or clipped copy. These checks ran on the final production build at `http://127.0.0.1:5185`, using Node 22.20.0. The tested `VehicleCard.svelte` blob is `86e06b202903b9014852cd40624854cee66539c7`; earlier JSON matrices remain evidence for their respective revisions. Both languages were visually checked at 320px, and long titles at 390px. The detached development server runs at `http://127.0.0.1:5173`.

### Compact list follow-up

The compact list revision, `8709bb3f0`, used a landscape thumbnail beside a single details column. Price follows the model in both the markup and mobile layout. Year/mileage form a quiet text row; fuel/transmission use two badges with more internal space and separation. The photograph retains its source proportions so the vehicle stays visible. Narrow containers and enlarged text stack the photo above the information, while normal desktop and carousel composition remain intact. [Styling](../STYLING.md#mobile-listing-cards) owns the current contract.

At normal 16px root text, the first card is 143.4px high in both in-app browser views, compared with 251.5px at 320px and 290.9px at 390px in the previous revision. Four complete cards fit in each viewport. These comparisons retain the same viewport and scroll position 0:

| Width | Previous photo-on-top card | Compact list |
| --- | --- | --- |
| 320px | ![Previous card at 320px](../mobile-card-density-2026-09-30/after-320.jpg) | ![Compact list at 320px](../mobile-list-cards-2026-09-30/after-320.jpg) |
| 390px | ![Previous card at 390px](../mobile-card-density-2026-09-30/after-390.jpg) | ![Compact list at 390px](../mobile-list-cards-2026-09-30/after-390.jpg) |

The final build passed `npm run validate` with 0 Svelte errors and warnings, all 8 mobile polish cases, all 42 Chromium inventory accessibility/text-bounds states, and all 66 WebKit reflow cases. No violations, overflow or clipped copy were found in those states. The checks ran against the production preview on port 5185 with Node 22.20.0. Both languages were visually checked at 320px; the live 390px list → vehicle 1 → anchored list return also passed. Desktop card prices remain below their specifications with exactly one price per card. The mobile image hint now matches the thumbnail; a 390px retina viewport selects the existing 640px source, with first-image priority and subsequent lazy loading retained.

Tested source blobs: `VehicleCard.svelte` — `9f43221a78816f731ffcd2cfb72eaed457dbcc28`; `ListingResults.svelte` — `c67e5482d798d68996f2704031dffcf22025be0b`; `mobile-polish-smoke.mjs` — `5843fe05cb44372e79db3ee8b23fc7d55fa9d0e9`. Earlier JSON matrices remain evidence for their respective revisions.

### Larger list photograph follow-up

The photograph now takes 53% of the main row, with the model and price together in the remaining column. Specifications span the full card below that row and wrap by group when translated or enlarged. This gives the photograph 32.5% more width and approximately 76% more area while preserving the whole car. The mobile image hint follows the new width and still selects the existing 640px source at 390px and 2× density.

At normal 16px root text and scroll position 0 in the in-app browser, the first photo is 136.2px wide at 320px and 173.3px at 390px, up from 102.8px and 130.8px. The first card is 138.8px and 163.5px high respectively; the prior compact list was 143.4px at both widths. Longer names and Bulgarian specifications grow naturally.

| Width | Previous compact list | Larger photograph |
| --- | --- | --- |
| 320px | ![Previous list at 320px](../mobile-list-cards-2026-09-30/after-320.jpg) | ![Larger photograph at 320px](../mobile-list-photo-2026-09-30/after-320.jpg) |
| 390px | ![Previous list at 390px](../mobile-list-cards-2026-09-30/after-390.jpg) | ![Larger photograph at 390px](../mobile-list-photo-2026-09-30/after-390.jpg) |

The final production build passed `npm run validate` with 0 Svelte errors and warnings, all 8 mobile polish cases, all 42 Chromium inventory accessibility/text-bounds states and all 66 WebKit reflow cases. No violations, overflow or clipped copy were found in those states, including both languages, increased text spacing and 200% root text. The live 390px list → vehicle 1 → anchored list return passed, and desktop cards retain one price below their specifications. Tested source blobs: `VehicleCard.svelte` — `879e0e9a6fda7ec0ab670a79ab09ea0d9f886de9`; `mobile-polish-smoke.mjs` — `2798f6ddcb7bdd7bbeae8689ffd1dc470dcad4c6`. Earlier matrices record their respective revisions.

### Badge hierarchy and navigation follow-up

The compact list keeps the larger landscape photograph. Model titles now use 20px semibold type, while the price uses a quieter 16px medium badge below the identity. Year, mileage, fuel and transmission share its background and pill shape; the specifications wrap as two pairs, including Bulgarian at 320px. At normal 16px root text, the first card is 142.8px high at 320px and 167.5px at 390px, with the same 136.2px and 173.3px photographs as the preceding revision.

The main dock uses locally embedded Phosphor duotone icons and keeps all five labels visible at normal phone widths, including 320px. Home, inventory, Sell and Import retain the same destinations and order; labels do not disappear on a timer. Enlarged text retains the accessible icon-only fallback below 15rem of available width. Vehicle detail pages retain their contextual Call and Viewing actions. The discovery toolbar now orders Search, Sort and Filters, with Filters at the far right. Sort and Filters share a neutral 40px painted circle within a 44px target and expose an applied state in red.

These in-app-browser screenshots use normal text size, matching 320×844 and 390×844 viewports, and scroll position 0:

| Width | Previous hierarchy and controls | Updated badges and controls |
| --- | --- | --- |
| 320px | ![Previous list and controls at 320px](../mobile-list-photo-2026-09-30/after-320.jpg) | ![Updated badges and controls at 320px](../mobile-controls-badges-2026-09-30/after-320.jpg) |
| 390px | ![Previous list and controls at 390px](../mobile-list-photo-2026-09-30/after-390.jpg) | ![Updated badges and controls at 390px](../mobile-controls-badges-2026-09-30/after-390.jpg) |

The final production build passed `npm run validate` with 0 Svelte errors and warnings, 8 mobile polish cases, 6 enlarged-text/focus/loading cases, 42 Chromium inventory accessibility/text-bounds states, and 66 WebKit reflow cases. No violations, overflow or clipped copy were found in the inventory matrix. Manual checks also verified filter/sort focus return, applied-filter emphasis, the 390px list → detail → anchored list return, and one desktop price below the specifications. [Checks and verified source blobs](../mobile-controls-badges-2026-09-30/checks.json) record this revision; earlier matrices belong to their respective revisions.

This revision changes the reusable Auto Best master. It does not promote a template release or deploy a dealer. The working preview includes the pre-existing body/brand artwork, locale and vehicle-finance drafts; these are preserved outside this commit. The shared Cars index also retains other tasks' staged changes. The first revision's asset guard covered its five image derivatives; the subsequent card revisions introduce no new public assets or runtime dependencies. Dock icon sources and the retained MIT license are recorded in [Phosphor provenance](../../provenance/phosphor-icons.md).

Automated axe and layout checks provide bounded evidence, not a claim of complete WCAG conformance. Physical-device and screen-reader acceptance remain separate from these browser checks.
