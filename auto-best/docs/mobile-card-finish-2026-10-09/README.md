# Mobile card finishing — 9–10 October 2026

The services overview now reads **Нашите услуги / За вашата кола / Виж всички** in Bulgarian and **Our services / For your car / View all** in English. The action stays on one line at 320px and reaches the retained localized About #process section.

The shared mobile car-price role changes from **24px/600 to 20px/600** on both Home and Inventory. The model remains 16px/500 and the quieter manufacturer remains 12px/450. The cash amount keeps its actual value and currency formatting. Inventory records provide cash prices and have no verified monthly offer or finance terms, so no monthly amount was added.

Cards retain the approved **12px** corners, vehicle fact badges **6px**, inset vehicle photos **10px**, and the dock its separate **16px** role. The preceding [advice/services spacing change](../mobile-card-actions-spacing-2026-10-09/README.md) remains applied. Desktop and tablet pricing and card geometry are preserved.

## Matched screenshots

| Surface | Before | After |
| --- | --- | --- |
| Inventory, 390px | [24px price](before-cars-390.png) | [20px price](after-cars-390.png) |
| Inventory, 320px | [24px price](before-cars-320.png) | [20px price](after-cars-320.png) |
| Home car, 390px | [Before](before-home-car-390.png) | [After](after-home-car-390.png) |
| Services copy, 320px | [Before](before-services-320.png) | [After](after-services-320.png) |

Each pair uses the same locale, viewport, content, font and loaded artwork. The 20px browser-only trial preceded the saved token change.

## Verification

- 40 mobile cases passed across Home and Inventory: BG/EN, 320/360/390/430/767px, normal and 200% root text size. The full label, one-line action, price/title roles, card corners and overflow checks passed.
- 16 tablet/desktop comparisons passed at 768/992/1440/1920px in both languages and routes. Every visible product element retains its dimensions, font, padding, borders, colors and corners. The development-only banner-preview widget is excluded when matching the initial development capture to the production preview; it is not present in production.
- Six existing mobile car-card smoke cases passed, including long-model and compact fuel/transmission fixtures. Four live checks at http://127.0.0.1:6461 passed at 320/390px in BG/EN, with actual services navigation and the 20px price on both Home and Inventory.
- Svelte check: zero errors and warnings. Production build, locale/source generation checks, CSS policy and token policy passed. Seven existing radius/locale policy fixtures passed. The Svelte analyzer retains its existing wrapper-link advisories; live localized navigation passed.
- The separately scoped commit source passes corner governance across 174 tracked source files and compiles all 98 Svelte components without errors. Pending work from other tasks remains outside the commit.

The task-owned production preview closed after the run. The development preview at 6461 remains available. Source delivery is separate from template promotion or dealer deployment.

[Responsive results](after.json) · [Live results](live.json) · [Summary](summary.json) · [Production-preview completion](completion.json)
