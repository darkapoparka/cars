# Feature banner primary actions

Moved Sell and Services primary actions into their blue banners, matching Finance. Labels: Sell your car, Get assistance, Book a service. Removed the duplicate full-width actions directly below the brand grids. Brand shortcuts retain their brand-prefilled destinations.

All banner buttons use the same white pill treatment and 44px minimum height. Phone banners have a 190px minimum height and content-driven expansion; artwork stays at its natural proportions along the lower edge, blended into the existing gradient. Desktop composition remains 2.5:1. No booking/submission behavior or reference claims were added or changed.

Source remains the untracked App candidate on Cars main `18ecaeb1af58672f9967fa2d35d2d80235164635`. Preserved the nine unrelated staged paths and existing parent divergence; no index/commit/push changes.

Validation: Node 22.23.2 `npm run check` passed (lint, TypeScript, production build; 205 pages). Inspected Sell/Services at 320px and desktop and Services at 768px; final Sell evidence at 390px. Banner CTAs fit without clipping. Verified Sell CTA opens `/sell/details`, Services CTA opens `/service/details`, both Toyota brand shortcuts retain `?brand=Toyota`, and Finance assistance opens/closes the existing login dialog. No information submitted. Locator DOM evaluation calls intermittently timed out after navigation; screenshots and DOM snapshots confirmed final route state. Evidence: Cars `runtime/app-showroom-qa/cta-sell-390.png` and `cta-service-390.png`. Production preview remains on port 6473.
