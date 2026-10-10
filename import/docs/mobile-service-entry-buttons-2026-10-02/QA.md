# Mobile Services access and compact card actions — 2 October 2026

Services was absent from the mobile menu. It now appears as the first link in the existing dealer section, before About, using the existing menu-row component and localized navigation behavior. Both Bulgarian and English menu links open the Services page and close the drawer. The desktop header already has a Services destination.

The mobile card action uses the existing 36px compact-height token, 12px horizontal padding and a 16px arrow. Its text uses the same mobile label token as the quick filters. At normal text size both use 16px type; the card action is now 36px tall while the quick filters remain 44px. The first Bulgarian action at 320px decreased from approximately 141px to 131px wide. All six cards retain their 162px height, and the entire card remains the link and tap target. The label can grow naturally with enlarged text.

Changed implementation:

- `src/lib/components/layout/MobileNavigationMenu.svelte`
- `src/lib/components/services/ServiceCard.svelte`
- `tests/mobile-secondary.e2e.ts`: the existing service-filter case now reaches Services through the mobile menu from Inventory in both locales.

## Visual evidence

Before screenshots came from the development server on port 6790 before edits. After screenshots came from the frozen production preview on port 6795. Card views show the page top at the same viewport; menu views show the lower part of the drawer, where the added Services row is visible.

| View                         | Before                            | After                           |
| ---------------------------- | --------------------------------- | ------------------------------- |
| Menu, BG, 390 × 844          | [Before](before/menu-390.jpg)     | [After](after/menu-390.jpg)     |
| Service cards, BG, 320 × 844 | [Before](before/services-320.jpg) | [After](after/services-320.jpg) |

Additional checks: [Bulgarian at 390px](after/services-390.jpg), [English at 320px](after/services-en-320.jpg), [desktop at 1440 × 960](after/services-desktop.jpg).

The desktop spot check confirms the existing Services header link and transparent card actions with 18px arrows and 44px height. The card sizing changes apply only below 768px. No horizontal overflow was observed in the checked views.

## Verification

Using Node 24.21.0 and the retained npm lockfile in the frozen QA candidate:

- Scoped Prettier and ESLint: passed for the three changed source/test files.
- `npm run check`: passed with zero errors and zero warnings.
- `npm run build`: passed.
- Existing focused Playwright cases: **8 passed, 4 skipped**. The four skips are the existing desktop exclusions for mobile menu and service-filter cases. Coverage includes Menu → Services in both locales, drawer closure, Back/Escape and focus restoration, scroll-lock recovery, search/filter behavior, service destinations, single-line titles and summaries at 320/360/375/390px, and 200% root-font reflow.
- Browser verification at 320px: all six card actions measured 36px high and all six cards measured 162px high. The same 36px action height was observed in English. The new Bulgarian menu link was followed successfully from Inventory in the production preview.
- `node scripts/workspace-doctor.mjs --fetch`: completed; unrelated working changes were preserved.

Focused browser command:

```text
PLAYWRIGHT_SKIP_WEBSERVER=1
PLAYWRIGHT_BASE_URL=http://127.0.0.1:6795
node node_modules/@playwright/test/cli.js test tests/mobile-secondary.e2e.ts tests/account-hydration.e2e.ts tests/mobile-navigation.e2e.ts --grep "service filters|contact and account pages reflow|menu restores focus|navigation from the menu" --workers=1 --reporter=list
```

`source-snapshot.json` identifies the complete working-source snapshot used for the build. `verified-files.json` records the three task-owned file hashes, checked against that passing candidate before saving evidence. This is local template verification; no template promotion or dealer deployment was performed.
