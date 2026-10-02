# Boxcar inventory polish

Completed locally on 2 October 2026 in `L:/CODEX/cars/templates/boxcar-updated`, preview [inventory on port 6455](http://127.0.0.1:6455/inventory/).

Inventory and Saved cars now share a soft grey canvas, a compact centered heading and separate white filter, result-toolbar and vehicle-card surfaces. The sidebar fields use a grey fill and native select arrows inset 16 px. A shorter default value avoids repeating the field label. Sort choices use concise labels, the selected grid/list control is solid blue, and mobile filters open in a white panel. Crossing the desktop breakpoint reopens the sidebar so a filter panel closed on a phone cannot leave an empty desktop column.

Car cards retain the original Boxcar specification glyphs and photography. Their specifications sit in one grey panel instead of between separator lines. Prices sit beside a visible pale blue View Details button; Compare has a neutral button with a distinct selected state. Normal narrow-phone cards retain one row of specification icons. Enlarged text can wrap rather than clip. The redundant Sample inventory caption is removed; the shared footer retains its existing concise sample/preview disclosure.

The route-backed filter, sort, view, pagination, saved and comparison state is preserved. Vehicle detail links retain the complete inventory return URL. No dealer data, release pin, hosted project or deployment was changed.

## Verification

- Node 22.23.2: Svelte check passed with zero errors and zero warnings. Vite production build passed, 161 modules. Scoped Git whitespace checks passed.
- Chromium and WebKit: 72 inventory states at 1440, 1199, 1024, 768, 390, 320 and 305 px, including grid/list, open mobile filters, selected actions, every alternate sort order and phone-to-desktop resizing. The extra 305 px case covers a 320 px browser with a conventional scrollbar. Both narrow widths were also checked with 200% root text.
- Four desktop/phone journeys passed pagination and disabled boundaries, all four alternate sort orders, make/model dependencies, multiple filters, chip removal, Clear all, invalid and valid price ranges, Reset filters, keyword empty-state recovery, saved persistence, comparison and populated/empty Saved cars. Filtered list-view links and PDP Back preserve query/view context.
- Sixteen supporting-route checks passed Home, About, Contact and PDP document width at desktop and 320 px in both engines. Their sources remain unchanged, as do all ten original reference homepages. No JavaScript errors were observed.

[Browser receipt and final application source hashes](inventory-polish-results.json) · [Desktop screenshot](inventory-polished-1440.png) · [320 px screenshot](inventory-polished-320.png).

The complete receipt belongs to this pass; earlier PDP and copy/navigation receipts remain historical evidence with their own source hashes.

## Source scope

The combined outstanding service-art, showroom, PDP, copy/navigation and inventory polish owns 62 explicit paths, recorded in ignored `runtime/boxcar-inventory-polish/owned-paths.json`. The existing main checkout is maintained; no extra editable template copy was created. Recovery files contain individual source files only. The preflight baseline for the final handoff is `3f891e7e59edc607cad0c90d63063252c996a976`; other template writers and their changes are outside this scope. Final commit/push status is reported separately from local browser acceptance. Boxcar remains a curated candidate; no fleet promotion or deployment is implied.
