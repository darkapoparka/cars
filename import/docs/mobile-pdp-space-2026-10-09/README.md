# Mobile navbar and PDP reading space

Local Import master refinement on 9 October 2026, on Cars `main`. The source changes remain uncommitted; no template release or dealer deployment was performed.

## Result

- The mobile navbar is 52px high, down from 58px, before the device's bottom safe area. Icons are 22px instead of 24px. Labels retain their existing size and the original icon family. The five controls have fully contained 51px-high tap areas; safe-area padding and menu/navigation behavior remain intact.
- The PDP gives its title the full drawer width and a single line, followed by a quieter price/monthly-estimate row. Title type remains 22px/600; the price changes from weight 600 to 400. The monthly estimate is also visible at 320px. Long titles use an ellipsis while retaining their complete text in the heading and title attribute.
- On the captured Audi A7, the drawer heading shrinks from 95px to 68px. Each Info, Specs and Features panel gains 27px: 326px to 353px at 390×844. Tab labels remain 18px, body copy remains 16px, and actions/tabs retain at least 44px tap targets. Existing resting/expanded snap points and content scrolling remain unchanged.

Task-owned source changes:

- `src/lib/components/detail/AuxeroVehicleMobilePdp.svelte`
- `src/lib/components/layout/MobileBottomNav.svelte`

Other source, identity, inventory, artwork, interactions and local work were preserved.

## Before and after

Matched EN/BG captures cover Home, PDP Info, Specs and Features at 320×844 and 390×844, plus Home/PDP at 1440×1000. Before images come from the unchanged canonical development source; final after images come from the isolated production build, without injected styles. Fonts and visible images were awaited.

- [Navbar comparison](navbar-before-after-390.png)
- [Info comparison](pdp-info-before-after-390.png)
- [Specs comparison](pdp-specs-before-after-390.png)
- [Features comparison](pdp-features-before-after-390.png)
- [Before measurements](before-metrics.json), [after measurements](after-metrics.json), [comparison](comparison.json)

The earlier matched development captures were pixel-identical on desktop. In the final development-to-production comparison, both desktop PDPs remain pixel-identical. Home differs by seven EN pixels and ten BG pixels on artwork edges, with a maximum channel difference of four; the layout is preserved. Source style changes are scoped below 768px.

## Verification

The frozen QA build lives at `L:/CODEX/cars/runtime/import-mobile-pdp-20261009/frozen`, with its own retained-lockfile npm installation and Node 24.21.0. QA used synthetic preview mode with provider credentials disabled and a separate CMS fixture directory. [Source hashes](source.json) match the canonical files to the final build. [The scoped patch](task.patch) records the change.

- Svelte check: zero errors and warnings.
- Final production build: passed, including the Vercel adapter and retained-assets step.
- Scoped Prettier, ESLint and Git whitespace checks: passed.
- Architecture check: passed, 57 native routes and 261 reachable modules.
- Image signature check: passed, 1,007 local images.
- Existing focused browser tests: 11 mobile and three desktop cases passed. Coverage includes gallery/specs/features, demo enquiry, no-JS PDP, menu focus/Back dismissal and Sell/Import navigation at 320/390px.
- Chromium/WebKit geometry and interaction checks cover EN/BG at 320/390px, at both 540px and 844px heights: title/price hierarchy, full tap-area containment, readable tabs, reachability of the last content item, drawer expansion, overflow and runtime errors. Results are in [mobile verification](mobile-verification.json).
- Svelte autofixer was run on both components. Its findings concern pre-existing localized link-wrapper detection and effect suggestions; this task adds no navigation/state logic.

These are standalone local browser checks, with no real-device or hosted-release acceptance claim. The full portfolio workflow and full E2E suite were outside this mobile layout change.
