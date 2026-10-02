# Boxcar copy and return navigation

Completed locally on 2 October 2026 in `templates/boxcar-updated`, preview [port 6455](http://127.0.0.1:6455/vehicle/volvo-xc90-recharge/).

The later [inventory polish](INVENTORY-POLISH.md) updates the inventory rules in `src/inner-pages.css` and supplies its own source hashes and browser receipt. This record describes the earlier copy/navigation state.

The PDP's Back action now has a white button surface, an 18 px arrow and a 44 px minimum target. It sits 16 px above the title card, outside that card and aligned with its left edge. This preserves the compact title and Save/Compare row, the gallery-width frame and the purchase card's top alignment. Its existing destination remains a real navigation link: filtered inventory, saved cars and home return URLs are retained.

Repeated sample labels were removed from the photo gallery, price card, vehicle description, curated stock caption, About photographs, Contact photographs/details and comparison. The generic location is empty instead of displaying “Demo showroom”; Contact provides a visiting-information prompt when no address is configured, and the footer only displays a configured location. One small footer note retains the sample/preview modes. The enquiry form retains its Preview enquiry action and explicitly reports that no message was sent after a local preview; its extra static demo caption is removed. No mail service, booking or finance approval was introduced.

## Verification

- Svelte check: zero errors and zero warnings. Vite production build: passed, 161 modules.
- Chromium and WebKit: 30 PDP states covering 1440, 1024, 768, 390 and 320 px, selected Save/Compare labels, multi-photo vehicles and 320 px with 200% root text. Button surface/target, left-edge alignment, 16 px spacing, title/gallery width, purchase alignment and document containment passed.
- Filtered-results Back navigation passed in four desktop/phone journeys. Home and saved return URLs passed keyboard activation in both engines at desktop and phone widths; their longer phone labels also fit enlarged text.
- Four enquiry journeys passed correct vehicle identity, local preview response, dialog dismissal and focus restoration, plus calculator price and showroom viewing intent. Enlarged phone finance results fit.
- Four multi-photo checks passed next-photo selection, keyboard thumbnail selection/scrolling, visible focus and selected-photo viewer/Escape dismissal.
- Sixteen home/About/Contact/comparison checks passed desktop and phone document width, absence of decorative demo/sample captions and one footer disclosure. The Contact form retains its Preview enquiry action.
- No JavaScript errors were observed. The curated home differs from its retained pre-cleanup source only in the stock caption. Service components/artwork and all ten preserved homepage sources match their earlier hashes. Screenshots use fresh browser contexts so saved comparison state does not cover the thumbnail tray.

[Full browser results and current source hashes](copy-navigation-results.json) · [Desktop](pdp-clean-gallery-1440.png) · [320 px](pdp-clean-gallery-320.png).

The follow-up verifier initially wrote its passed result to the preceding compact-PDP filename. The complete current result was preserved under the correct filename, and the verifier was fixed. The preceding compact-PDP JSON is explicitly marked as a reconstructed historical summary using its original reported counts, screenshots and retained source files; its original per-route measurements are no longer available. This limitation does not affect the complete current receipt.

## Source handoff

The combined Boxcar polish owns 56 explicit paths, recorded in the ignored `runtime/boxcar-copy-navigation/owned-paths.json`. Retained recovery files contain individual source files only. The existing main checkout, other template writers, existing releases, dealers and deployments are preserved. `workspace-doctor --fetch` confirmed Cars was level with fetched main at the start of this pass; it separately flagged other workspaces without changing their files.

During final inspection another writer had advanced main to `6be4023c510b04212f8c86f667e2b619a20c7899` and the shared index contained 132 unrelated staged paths. Zero Boxcar-owned paths were staged; no Boxcar staging, commit or push was attempted over that work. Current application hashes still match the completed browser receipt. Once that writer releases the index, inspect main/remote and staged state, stage only the 56-file allowlist, review, commit and push without force. Source handoff remains pending independently of the verified local preview.
