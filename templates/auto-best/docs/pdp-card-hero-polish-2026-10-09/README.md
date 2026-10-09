# PDP price, desktop cards and discovery heroes — 9 October 2026

The mobile PDP keeps a 20px/500 title, an 8px gap and a 24px/600 price below it. The 40px visible overlay circles, 44px tap areas and 20px Fluent icons are retained.

Home and Cars desktop model titles use 20px/500 against 24px/600 prices. Home content padding is 16px; title/specification and specification/price gaps are 8px. Cars retains 16px padding and uses the same 8px gaps. Image sizes, grid columns and gutters are retained. The mobile cards preserve their measured composition: 16px/500 titles, 24px/600 prices, and one facts row with three items on Home and five on Cars.

Desktop discovery scenes use a quiet charcoal gradient using the configured hero surface tokens. Home pairs two Urus cutouts; Cars pairs two G-Class cutouts. Their shared framing normalizes the visible body width instead of transparent margins or body height, mirrors the front positions and aligns the wheel baselines. Natural proportions are preserved. Home no longer overrides the shared sizing. Blog retains its M5/E63 pair in the same discovery framing. The dotted background is removed from those heroes. Mobile hero artwork and the kerb/Nordschleife section banners retain their existing roles. The photographic About/Contact scenes keep their separate rendering.

| Surface | Before | After |
| --- | --- | --- |
| Mobile PDP, EN 390px | [30px price](before-pdp-390.png) | [24px price](after-pdp-390.png) |
| Home desktop cards, EN 1440px | [Before](before-home-cards-1440.png) | [After](after-home-cards-1440.png) |
| Cars desktop cards, EN 1440px | [Before](before-cars-cards-1440.png) | [After](after-cars-cards-1440.png) |
| Home desktop hero, EN 1440px | [Dots](before-hero-1440.png) | [Charcoal with matched Urus pair](after-hero-1440.png) |
| Cars desktop hero, EN 1440px | [Previous Golf/A45 pair](before-cars-hero-1440.png) | [Matched G-Class pair](after-cars-hero-1440.png) |
| Home desktop hero, EN 1920px | [Mixed models](before-home-hero-1920.png) | [Matched Urus pair](after-home-hero-1920.png) |
| Cars desktop hero, EN 1920px | [Previous pair](before-cars-hero-1920.png) | [Matched G-Class pair](after-cars-hero-1920.png) |

`verification.json` records 30 Home/Cars/PDP cases at EN 320, 390, 767, 992, 1280, 1440 and 1920px, plus BG 320, 390 and 1440px, and an additional Blog desktop check. Assertions cover the typography, spacing, single-row mobile facts, hero gradient and retained cars, overlay controls and horizontal overflow. The matched 390px mobile card records are identical before and after.

`hero-framing.json` records 18 additional Home/Cars checks: EN 390, 992, 1024, 1280, 1440, 1920 and 2560px plus BG 992 and 1440px. The checks measure the loaded artwork's alpha bounds, matching visible widths between both sides and both routes, mirrored front positions and wheel baselines. Visible widths are approximately 200px on narrow desktop, 456px at 1440px and 524px from 1920px. Mobile hero geometry and sources match the baseline; the two 390px hero screenshot pairs are byte-identical.

Svelte check, CSS policy, token/typography and visual-system pins, localization and locale source checks passed. The Svelte autofixer cleared DesktopHeroScene, CampaignVehiclePair and Home's Hero; its VehicleCard link advisory refers to the existing composed `i18n.href(withListReturn(resolve(...)))` expression, which already uses the route resolver and retains its navigation contract.

An isolated Node 22 production bundle and 12 built-preview browser cases passed, including the final Urus/G-Class hero pairs. The QA build inherits the canonical Svelte configuration and Vite font handling, writes to this task's ignored `node_modules/.cache` output, and omits adapter packaging to preserve the other active preview's build output. This verifies production rendering, without claiming a Vercel/Cloudflare package or deployment. `production-verification.json` records the built-preview checks; its temporary server was closed after the run. Shared dirty work and template release pins are preserved.
