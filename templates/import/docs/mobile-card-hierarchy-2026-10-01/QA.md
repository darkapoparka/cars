# Import mobile card hierarchy — 1 October 2026

Canonical source: `L:/CODEX/cars/templates/import`, Cars `main`. This is reusable template polish. Dealer configuration, inventory data, desktop card composition, release pins and dealer deployments were preserved.

## Changes

- Homepage: larger photo, two-line title, title/price before quieter 24px specification chips, and an outlined details action with a 44px touch target.
- Inventory: approximately 42/58 photo/body split, compact mileage over the photo, year/fuel chips and a plain transmission line. Larger text stacks the photo above the body.
- Import recommendations: year and mileage are the visible specification priorities.
- Card-only labels shorten petrol/LPG combinations to `LPG`, English `Automatic` to `Auto`, and mileage to thousands, for example `125,9k км`. Complete values remain available to assistive technology and in title attributes; source values remain unchanged.
- Menu: existing configured logo above the location and phone in a contained banner. The language control follows the links in the scrolling content. The Sell destination remains available as a menu link.
- Bottom navigation: quiet inactive controls, red active icon/indicator and room for enlarged, wrapped captions.

## Verification

Node `24.21.0`, retained npm lockfile. A complete temporary source copy had its own `npm ci` and build output; the active dev output was preserved. Its 1,772 source/asset/configuration files matched the canonical source byte for byte before the documentation receipt was added. SHA-256 manifest digest: `2a6bcd74777ab9233f13b4f0207823d1de2d75307656ed627274db482c061ca1`. Dependencies, generated output, local runtime artifacts, Git and environment files were excluded; retained legacy `.template-ref` sources were included.

- `npm run check`: zero errors and warnings.
- Prettier and ESLint for the ten changed source/test files: passed. `git diff --check`: passed.
- `npm run check:architecture`: passed, 57 native routes and 195 reachable modules.
- `npm run check:assets`: passed, 855 image signatures.
- `npm run test:unit -- --run`: 124 tests passed across 18 files.
- `npm run build`: passed with the Vercel adapter. Existing non-fatal legacy `@reference` warnings remain.
- Chromium card geometry: 16 checks passed across BG/EN homepage, inventory and import at 320/390px, plus 200% text at 320px. Photos loaded, titles exceeded badge text size, and cards/navigation had no horizontal overflow or clipped labels. No page errors.

- Frozen production preview: `tests/commerce-banners.e2e.ts`, `tests/inventory.e2e.ts` and `tests/mobile-navigation.e2e.ts`, desktop/mobile with one worker: 17 passed, 11 viewport-specific skips, zero failures. Coverage includes eight menu banner size/language combinations, the scrolling locale control, homepage actions, Contact/Sell/Import navigation, focus/back dismissal, SSR inventory, filters and detail return.
- Targeted `tests/mobile-final.e2e.ts` automated accessibility/reflow scans of `/en`, `/en/inventory` and `/en/import` at 320px: three passed, zero detected WCAG-tagged violations. The four EN/BG menu scans also passed.

Final captures: [homepage](home-320.png), [inventory](inventory-320.png), [import](import-320.png), [menu](menu-320.png) and [200% inventory/navigation](inventory-320-large-text.png). [Card geometry](card-geometry.json) and [source manifest](source-manifest.json) preserve the measurements and digest. The temporary frozen build is retired after verification; the canonical dev preview remains on port 6790.

## Limits and preservation

The repository-wide `npm run verify` gate is blocked by existing formatting differences in `docs/mobile-service-cards-2026-09-30/metrics.json` and six ignored recovery scripts under `runtime/banner-nav-20260930`. Repository-wide ESLint also rejects three existing `runtime/mobile-polish/source-after-*.svelte` recovery files outside its TypeScript project. Those files were preserved; scoped checks passed.

Earlier mutable-dev navigation checks encountered a Rolldown out-of-memory error on cold routes. The final production run uses independent, immutable build output. Historical screenshot files briefly written by old test paths were restored to their original bytes; the tests now write captures to their own Playwright output directory.

This local pass does not verify mounted `/variant-2`, physical devices, a public alias, real form delivery, an immutable template release or dealer rollout. Owner visual acceptance remains separate.
