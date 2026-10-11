# Mobile final polish audit

The Import and Sell background ended before the mobile dock clearance, exposing about 15px of the plain shell at the bottom of a phone viewport. The service page now owns that clearance within its painted canvas. It uses the existing navigation and spacing tokens plus the safe-area inset, with a viewport minimum that can grow with content. The shared shell removes its second reservation only for these workflow pages below 768px.

No new color, font, icon, artwork or control geometry was introduced. Eight matched browser measurements confirm unchanged form, guide and dock bounds and document scroll length, including both service routes at 1440px. The visible unpainted strip is zero after the change. The retained background layer simply reaches the page end.

## Matched screenshots

These captures use the owner's original 374×884px in-app browser viewport.

| Import before | Import after |
| --- | --- |
| ![Import before](import-before-374.jpg) | ![Import after](import-after-374.jpg) |

| Sell before | Sell after |
| --- | --- |
| ![Sell before](sell-before-374.jpg) | ![Sell after](sell-after-374.jpg) |

## Actual verification

- [Browser audit](browser-audit.json): Bulgarian Home, inventory, detail, Contact, About, Advice and article frames at 320px; English Home, inventory, Import and Sell at 320px, plus seven main routes at 390px. Inspected page bottoms, filter/editor/guide/menu dialogs and Escape focus return. Reviewed rendered screenshots and checked page overflow, broken loaded images, duplicate IDs and clipped controls. Home/About dock handoff to their footer was verified after hydration.
- Background comparisons: Import at 320/374/390/430px and 390×500px, Sell at the original phone size, and both service pages at 1440px. Forms, guide cards, navigation and scroll length match their before measurements. Both English service canvases also reach their page end at 390px.
- `npm run validate`: passed using Node 22.20.0, including policies, tokens, asset/font/icon provenance, domain and locale checks, zero Svelte errors/warnings, and the production build.
- `node scripts/service-entry-overlay-smoke.mjs`: all six BG/EN × 320/390/430 cases passed. The suite includes editors, saved drafts, guidance, focus/dismissal, short-screen handling and enlarged-text editor checks. Its new regression checks that the painted canvas reaches the document end and that the guide can scroll above the dock. A stale 26px header-icon assertion was corrected to the retained 22px contract; targets stay 44px.

The browser audit uses the existing development server at `http://127.0.0.1:6461`. Build and browser evidence include the existing unrelated working drafts. Those drafts are excluded from the scoped staging plan. This records local behavior, not a template promotion or dealer deployment.
