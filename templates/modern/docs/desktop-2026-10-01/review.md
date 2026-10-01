# Modern desktop review — 1 October 2026

Preview: <http://127.0.0.1:6462/bg/>. Scope: the reusable Modern master, desktop frontend. Existing dealer copies and template release selection are separate from this implementation.

## Audit and resulting changes

The original home page gave twelve filter controls most of the first screen, with little vehicle imagery or introduction to the dealership. Its lower content was a compact inventory carousel and small service links. Inventory and vehicle detail pages repeated small panels without a strong visual hierarchy.

- The home now opens with a two-column showroom introduction and a featured vehicle drawn from the existing catalog. The heading, inventory and contact actions, catalog count and location establish the page hierarchy.
- Search retains the existing draft, query and picker contracts. Make, model, price and year remain immediately available; eight additional controls sit in a keyboard-accessible native disclosure. Active advanced criteria open that disclosure on arrival.
- Inventory uses larger showroom cards, complete title/subtitle and vehicle facts, clearer pricing, and a three-column grid through ordinary desktop widths. Wide screens gain a fourth column. The existing list view, sorting, filters and return state still work.
- The detail page gives the gallery more room, exposes key specifications beneath it, and emphasizes the price and phone/finance actions in a dark purchase panel. Existing gallery and tab behavior remains intact.
- Service pages use a concise heading and their actual action panel. The home adds capability-driven import, financing and sell cards, followed by the configured showroom contact details.
- Desktop loading placeholders follow the new home and service composition. Navigation, focus treatment, reduced-motion behavior and responsive gutters remain shared.

No new provider, dependency, listing claim, generated image or enquiry-delivery integration was added. Identity, photos, inventory facts and contact details use the existing public-site contracts. Desktop styling begins at 1024px; the mobile card, search and request flows retain their existing composition.

## Verification

Runtime: Node 22.23.2 and pnpm 11.4.0. The preview on port 6462 was verified as the existing Modern web process. Build output was isolated from that running preview.

| Check | Result |
| --- | --- |
| `pnpm --filter @repo/marketplace-ui typecheck` | Passed |
| `pnpm --filter web typecheck` | Passed |
| `pnpm --filter @repo/marketplace-ui test` | 85 tests passed |
| `pnpm --filter web test` | 186 tests passed |
| Scoped Biome check of the 23 changed TS/TSX/CSS files | Passed |
| Scoped `git diff --check` | Passed |
| `pnpm --filter web build` with the documented static-demo environment and isolated E2E output | Passed, including TypeScript and page generation |
| Desktop Playwright suite | All 12 cases passed across the initial run and the focused rerun |
| Chromium mobile completion and architecture suites | All 29 cases passed |

The desktop suite covers home, cars, the BMW X5 listing, imports, sell, lease, contact and guides in Bulgarian and English at 1024, 1280, 1440 and 1920px: 64 route/width/locale combinations. Each checks HTTP response, one visible primary heading, horizontal reflow, navigation bounds and page errors. The remaining cases exercise draft make/model/fuel search and reset, sorting and view persistence, spotlight navigation, gallery dismissal, keyboard tabs, return navigation and the home/inventory axe gate. Two test-script errors were corrected: applying the fuel dialog before proceeding, and using the existing `price_asc` sort value. Both cases passed in the focused rerun.

Commands with the preview already running:

```powershell
$env:E2E_BASE_URL='http://127.0.0.1:6462'
pnpm --filter e2e exec playwright test --config=playwright.desktop.config.ts
pnpm --filter e2e exec playwright test --config=playwright.desktop.config.ts --grep 'search submits|inventory preserves' --output=test-results/modern-desktop-interactions
pnpm --filter e2e exec playwright test modern-mobile-completion.spec.ts modern-mobile-architecture.spec.ts --config=playwright.modern.config.ts --project=modern-mobile-chromium
```

The optimized build used `AUTOMARKET_PUBLIC_E2E=true` and `E2E_PUBLIC_RUN_ID=desktop-20261001`, producing `apps/web/.next-public-e2e-desktop-20261001-demo` without replacing the preview's `.next`.

Manual review in the Codex Browser covered the baseline and final home, inventory, vehicle detail and service composition, including the 1024px leasing layout and a 320px mobile view. Enquiry requests were blocked in automated checks; no messages were delivered.

## Rendered evidence

- [Home, 1440px](home-1440.png)
- [Full home, 1440px](home-full-1440.png)
- [Vehicle detail, 1440px](listing-1440.png)

## Preservation and limits

Work stayed on the existing Cars `main` checkout. Unrelated staged, unstaged and untracked work, including concurrent mobile refinements, was preserved. The pinned runtime, lockfiles, content, provider boundaries and public URLs remain in place.

Abandoned Git index locks initially blocked staging. Their ages and physical paths were verified, exclusive file probes passed, and no active Git writer was present. An empty lock was preserved in the ignored `runtime/git-lock-recovery/modern-desktop-20261001-090013-index.lock` recovery pair. A background refresh then left an unreadable replacement index; its complete bytes and metadata were preserved as `modern-desktop-20261001-pending-index.lock` in the same directory. The canonical index was readable and had no staged changes before recovery. Recovery did not replace that canonical index.

This is verified local static-demo implementation. Owner visual acceptance, a reviewed immutable template release, dealer refreshes and hosted verification remain separate. No deployment or outreach was performed. The focused axe result is not a complete WCAG certification, and mobile evidence is Chromium browser evidence rather than native-device acceptance.
