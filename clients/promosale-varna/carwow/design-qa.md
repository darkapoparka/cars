# Historical design QA: superseded desktop home hero

> Source-era evidence only. The blue-glass hero, port, test path and completion claims below do not describe the current template. Follow `AGENTS.md`, `DESIGN.md`, `DESKTOP_STYLE_GUIDE.md` and `docs/QA.md` for current work.

## Scope

- Page: `http://localhost:5178/`
- State: desktop home, first viewport, default search state
- Visual target: layered professional reseller hero with realistic showroom background, two transparent vehicle cutouts framing a brand-blue glass buy box, brand-led hero title, and inventory search.
- Reference assets:
  - `static/brand/daynight-hero-showroom-empty-v1.png`
  - `static/brand/daynight-hero-showroom-empty-v2.png`
  - `static/brand/daynight-hero-cutout-suv-v1.png`
  - `static/brand/daynight-hero-cutout-wagon-left-v1.png`
- Implementation evidence: `tmp/hero-audit/5178-desktop-1920-v10-full-header-logo-compact.png`

## Decision Notes

- Replaced the generic dark banner with a realistic showroom/forecourt image so the first viewport feels more like a real reseller site.
- Added transparent foreground SUV and wagon cutouts so the cars point attention toward the buy/search box instead of sitting as one centered placeholder image.
- Removed the fake showroom text/sign overlay after visual review; the building image now stays clean with no generated or CSS-applied branding.
- Changed the hero headline to use the actual light DayNight wordmark asset, with accessible `DAY NIGHT AUTO GROUP` text, a compact `София, България` map-pin line above, and buyer-useful support text below.
- Removed the old badge/trust chips and kept the hero focused on the headline, cars, and search action.
- Kept the existing search controls and submit flow intact, with the search card restyled as a compact translucent DayNight-blue dealer search module centered between the two cars.
- Let the header bands and desktop header content use the full viewport width with consistent side padding, so the logo and action buttons sit closer to the real page edges on wide screens.
- Added missing hide/show CSS for the phone contact popover so header helper content is not visible by default.

## Findings

- P0: none.
- P1: none.
- P2: none.
- P3: The foreground vehicles are generated and credible enough for the prototype, but real DayNight inventory cutouts from client photos would be more authentic.
- P3: The background is generated; if the client can provide real showroom/lot photos, use those as the source of truth and keep the same layered layout.

## Verification

- `npm run check`: passed, 0 Svelte errors/warnings.
- `npx playwright test src/routes/project1.e2e.ts`: passed, 9/9 tests.
- `npx @sveltejs/mcp svelte-autofixer src/lib/components/home/desktop/DesktopHomeHero.svelte --svelte-version 5`: no issues.
- `npx @sveltejs/mcp svelte-autofixer src/lib/components/home/HomePage.svelte --svelte-version 5`: no issues.

## Result

- Final result: passed
