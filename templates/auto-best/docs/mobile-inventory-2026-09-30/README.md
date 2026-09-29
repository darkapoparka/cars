# Mobile inventory revision — 30 September 2026

The compact split layout cropped away much of each car and squeezed the model names into a narrow column. Mobile inventory now uses a full-width landscape photograph above the vehicle information. These comparisons use **normal text size**, the same 320×844 and 390×844 viewports, and the same scroll position in the in-app browser at `http://127.0.0.1:5173/en/listing-grid`.

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

This changes the reusable Auto Best master. It does not promote a template release or deploy a dealer. The working preview includes the pre-existing body/brand artwork, locale and vehicle-finance drafts; these are preserved outside this commit. The shared Cars index also retains other tasks' staged changes. The asset-count guard is committed only for the five derivatives owned by this revision.

Automated axe and layout checks provide bounded evidence, not a claim of complete WCAG conformance. Physical-device and screen-reader acceptance remain separate from these browser checks.
