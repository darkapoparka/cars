# Sell guidance and Services banner — 3 October 2026

Sell now starts directly with its two existing sale/exchange cards. The top dark banner is removed at all widths; an accessible page heading remains. The sale card's above-fold artwork is prioritized. The cards retain their original imagery, three check rows and explicit valuation/trade-in actions.

How it works is one compact light panel, 130px tall at 320px and 390px, with three numbered columns: Details, Valuation and Terms. The columns are explanatory content. A single underlined View steps action opens a structured three-step explanation in `ReferenceInfoSheet`, using the existing modal boundary. Before you sell uses simple 72px icon/text rows with bottom dividers, retaining each original information drawer.

Services uses the full mobile copy width inside the retained banner and artwork. At 320px, the supporting sentence previously wrapped and enlarged the banner to 180px. The title and sentence now stay on one line in Bulgarian and English, keeping the banner at 158px at 320px and 390px, matching Leasing. The 24px title, 15px supporting copy and 44px action remain intact. Desktop Services remains 248px tall. This verifies the rendered geometry; no performance CLS measurement or native-device claim is made.

## Before and after

| View | Before | After |
| --- | --- | --- |
| Bulgarian Sell, 390px full page | [Before](before/bg-sell-390-full.jpg) | [After](after/bg-sell-390-full.jpg) |
| Bulgarian Sell, 390px guidance in context | Earlier full-page capture above | [Compact process and advice](after/bg-sell-390-guidance.jpg) |
| Bulgarian Sell, 320px | Earlier Sell evidence retained | [After](after/bg-sell-320-full.jpg) |
| Bulgarian Services, 320px | [Before](before/bg-service-320.jpg) | [After](after/bg-service-320.jpg) |
| Bulgarian Services, 390px | [Before](before/bg-service-390.jpg) | [After](after/bg-service-390.jpg) |
| Bulgarian Leasing, 390px | [Baseline](before/bg-finance-390.jpg) | Measured banner geometry matches the baseline |
| Bulgarian desktop, 1440px | Earlier evidence retained | [Sell](after/bg-sell-1440.jpg), [Services](after/bg-service-1440.jpg) |
| English, 320px | Earlier evidence retained | [Sell](after/en-sell-320-full.jpg), [Services](after/en-service-320.jpg) |

The fixed mobile dock remains at the original viewport position in full-page browser captures. The separate scrolled guidance screenshot shows the whole process panel and advice rows unobscured. The preview uses a 15px scrollbar, so available document widths are 305px and 375px at the two phone viewports; no horizontal overflow was found.

## Verification and source

[Measured checks](results.json) record 19 focused checks: Bulgarian 320px/390px, English 320px and desktop 1440px; Sell without the removed banner; three static process columns; all three detailed steps in the drawer; Escape and close focus restoration; original advice contents; Sale/Exchange intent from the leading cards; Services' editable enquiry destination; matching Leasing banner geometry; and final browser logs.

A missing locale binding on the new accessible Sell heading was caught during the first render check and fixed before the successful build. Final browser checks captured no errors or warnings after that repair.

`npm run check` passed using Node 22.20.0: ESLint, TypeScript and the Next.js webpack production build generated 407 static pages. Build output used `.next-build-check` separately from the live `.next` server, and the generated `next-env.d.ts` imports were returned to their prior development paths.

Canonical checkout: `L:/CODEX/cars/templates/app` on Cars `main`, based on `95a7998cc9d2b0368f734d0e231bf12b6ed14728`. Changes are limited to the landing composition, Sell guidance, optional structured information-sheet content, Services copy width, one EN/BG label and these instructions/evidence. Unrelated quick-filter edits are preserved. The scoped source commit is reported in the task handoff; dealer release/publishing and owner visual acceptance remain separate.
