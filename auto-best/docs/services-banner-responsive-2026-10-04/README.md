# All services responsive correction — 4 October 2026

Historical first responsive pass. The owner subsequently requested a shorter visual action and side-by-side artwork below 320px. The [compact follow-up and current evidence](../services-banner-compact-2026-10-04/README.md) supersede the earlier 17.5rem stacking threshold and 40px painted CTA described here.

The owner requested that narrowing the screen preserve the illustration's size and balance the title, single-line supporting text and CTA beside it. `MobileServicesOverview.svelte` now uses an intrinsic 8rem illustration column instead of the earlier 3:2 split. Copy uses the remaining width, with shared spacing and unchanged 18px title / 14px detail and action fonts. The concise localized supporting line is “За вашата кола” / “For your car”. Natural text wrapping remains available for accessibility; there is no ellipsis or forced clipping.

At normal 16px root size, the illustration is 128px wide at 320, 360, 390 and 430px in both languages. Its crop, aspect ratio and approved silver source are unchanged. The text stack uses tighter shared spacing; the card grows with content and measures 131.609px tall at 320 and 390px. The action retains the shared 44px frame / 40px painted pill, black surface, white text and Fluent arrow. A font-relative container query stacks copy and artwork when two columns cannot accommodate enlarged text. The card is still a single localized About `#process` link and hidden on desktop.

Native Codex in-app browser screenshots preserve viewport, scroll position, card top and width in each comparison:

| Width | Before | After |
| --- | --- | --- |
| BG 320px | [Before](before-bg-320.png) | [After](after-bg-320.png) |
| BG 390px | [Before](before-bg-390.png) | [After](after-bg-390.png) |

English checks: [320px](after-en-320.png), [390px](after-en-390.png). [Browser measurements](browser-audit.json) cover both languages at 320, 360, 390 and 430px, single-line title/detail/action, stable artwork, correct localized destinations, and no page overflow. The narrow illustration increases from 95.594px to 128px; the former wrapped detail becomes one line. Heroes and surrounding cards are unchanged by this correction.

[Mobile polish](mobile-polish-report.json) and [Home reflow](reflow-report.json) contain the existing focused browser-suite results. [Validation](validation.json) records the local source checks and build. These checks describe the local master checkout, which also contains pre-existing drafts; they do not select a template release or deploy dealers.

[Scoped integration handoff](../services-banner-cta-2026-10-04/INTEGRATION.md) owns this correction, the earlier black CTA work and the pending original hero restoration, while excluding unrelated drafts.
