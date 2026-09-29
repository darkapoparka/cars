# Showroom home and navigation pass

Scope: local App candidate in `L:/CODEX/cars/templates/app`. No dealer release, deployment, generator integration or template-lock change.

## Changes

- Added `lib/showroom.ts` for the home identity, location destination, search prompt, editable promotion, four service shortcuts and four dock destinations.
- Replaced the home return-guarantee image with selectable text, a retained local cutout and an inventory CTA. Preserved the violet visual treatment.
- Used Buy / Sell / Finance / Services above search; Home / Cars / Saved / More in a floating dock, including inventory. Location remains accessible from the header.
- Replaced home claim-based offers with showroom discovery cards. Removed the home login and simulated WhatsApp overlays, plus the inventory login bar that would conflict with its new dock.
- Preserved inventory fixtures, reference assets, detail flows and unrelated source work.

## Verification

- Node 22.23.2; `npm run check` passed (ESLint, TypeScript, production build, 205 generated pages).
- Production preview on port 6473; inspected home at 320×740, 390×844, 768×1024 and 1440×1000. No page-wide horizontal overflow observed.
- At 320px while scrolled, the compact discovery header ends at y=164 and the sticky filters start at y=164.
- Clicked Cars, Saved, More, Home, Sell, Finance, Services, Visit showroom and the promotion CTA. Verified destinations, active styling and inventory filter open/Escape dismissal.
- Fresh production browser session reported no console errors during those journeys.
- Screenshots: `runtime/app-showroom-qa/home-320.png`, `home-390.png`, `home-1440.png` under the Cars root. Production logs are in the same ignored folder.

## Remaining boundaries

The App import was untracked in the parent repository at the start of this task. Parent main was `31aab0f8a`, 28 commits behind fetched origin/main, with unrelated staged and unstaged work and an existing index lock (which later cleared). No staging, commit, integration or push was attempted. The preserved `L:/cars-app` copies of the five edited existing source files matched the import manifest hashes and were used to review the scoped differences.

Inventory, metadata, location fixtures, reference badges/claims and deeper login/finance/service journeys still need client adaptation. The home boundary is not a complete dealer configuration. Drive24 is the demo identity; no client business facts or approved financial terms are implied. Owner visual acceptance is pending.
