# Compact desktop Inventory — 5 October 2026

Inventory now puts the available vehicle types in the discovery panel header, directly above the Make, Model, Price, Mileage, Fuel, Type and All filters row. The large keyword field and Search button are removed. The panel follows its content height; the existing hero artwork, white controls, dialogs and results grid retain their owners.

At 1440 × 1000, the panel falls from 251px to 175px. The first car row moves from approximately 628px to 586px. Both Bulgarian and English retain a readable two-row filter layout at 768px, with no horizontal overflow.

Keyword search uses the existing desktop header icon and `VehicleSearchDialog`. Opening it restores the applied keyword and canonical inventory filters from the URL. Preview and native GET submission preserve make, model, type, ranges, sort, view, layout and locale. Reopening after cancelling discards the draft. Clear removes filters while preserving display settings. Vehicle-type shortcuts retain the existing native links and multi-selection Type picker.

## Matched screenshots

The before capture uses the retained production snapshot. Its application sources were checked against the working master; only the two task-owned components differ after this change. The after captures use the newly built production preview through the in-app browser.

| View                           | Before                                 | After                                |
| ------------------------------ | -------------------------------------- | ------------------------------------ |
| Bulgarian desktop, 1440 × 1000 | [Before](inventory-bg-1440-before.png) | [After](inventory-bg-1440-after.jpg) |
| English desktop, 1440 × 1000   | [Before](inventory-en-1440-before.png) | [After](inventory-en-1440-after.jpg) |
| Bulgarian mobile, 320 × 844    | [Before](inventory-bg-320-before.png)  | [After](inventory-bg-320-after.jpg)  |
| Bulgarian mobile, 390 × 844    | [Before](inventory-bg-390-before.png)  | [After](inventory-bg-390-after.jpg)  |
| English mobile, 320 × 844      | [Before](inventory-en-320-before.png)  | [After](inventory-en-320-after.jpg)  |
| English mobile, 390 × 844      | [Before](inventory-en-390-before.png)  | [After](inventory-en-390-after.jpg)  |

Additional captures: [Bulgarian at 768px](inventory-bg-768-after.jpg), [English at 768px](inventory-en-768-after.jpg), [header search with the applied keyword](inventory-search-after.jpg).

Mobile inventory and the mobile app bar keep their independent components and styles. The four mobile pairs preserve the visible composition and matching capture dimensions. Before captures are PNG and after captures are JPEG; this receipt does not claim a zero-pixel comparison between those encodings. Measured desktop changes and the capture matrix are recorded in [comparison.json](comparison.json).

## Verification and source boundary

- Node 24.21.0 and the retained npm lockfile; no dependency changes.
- Svelte checks: 0 errors and 0 warnings.
- Architecture: 57 native routes, 231 reachable modules, one Tailwind entry.
- Asset signatures: 976 local images.
- Scoped Prettier and ESLint checks pass.
- Final production build passes, including the retained Vercel adapter and public-asset packaging. Existing Lightning CSS `@reference` warnings remain.
- All 19 focused desktop browser cases have passing results across `desktop-search`, `style-parity` and `storefront-controls`. The first run passed 17 cases and hit cold-start navigation timeouts in two Home cases; both passed when rerun against the warm preview without changing the implementation.
- In-app captures cover BG/EN at 1440px and 768px, plus 320px and 390px mobile. No horizontal overflow or new console errors were observed during those captures.

Task sources are `InventoryPage.svelte`, `PublicHeader.svelte` and the existing desktop-search browser suite. Architecture/style references now describe this composition. The frozen input hashes are retained in [verification-inputs.json](verification-inputs.json).

The local review URL is `http://127.0.0.1:6790/bg/inventory`, served from the tested production snapshot after the canonical Vite dev server hit module-loading timeouts. QA snapshots and logs remain outside the editable master in the task runtime and temporary QA folder. Generated deployment-package regular files were archived into the task runtime to recover disk capacity; their junctions were preserved. This is local template polish. No template lock, dealer release or hosted deployment was changed.

Existing `.gitignore`, `.prettierignore`, earlier screenshot folders and the unrelated about-editorial artwork remain outside this task's commit.
