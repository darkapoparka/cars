# Sell polish — 3 October 2026

The owner requested a usable Sell entry with a short heading, one supporting line and a valuation CTA inside the dark header. The previous page had a static hero, arrow-only sale/trade-in cards and three large illustrated guides.

The updated hero opens the existing car-details sheet with Sale selected. Sale and trade-in cards retain their artwork and three checklist rows, with visible action labels. A short three-step explanation covers car details, dealer review and agreed terms. Compact guide buttons open the existing valuation, service-history and photo advice. Both EN and BG copy are localized. Car details and contact drafts remain local; the preview does not submit a sale, valuation or message.

## Matched comparison

Screenshots were captured from the same local preview and browser at the indicated viewport sizes, before editing and after implementation. Full-page captures include the existing fixed navigation at its viewport position.

| 390 × 844 before | 390 × 844 after |
| --- | --- |
| ![Before: mobile Sell](before/bg-390.jpg) | ![After: mobile Sell](after/bg-390.jpg) |

| 1440 × 1000 before | 1440 × 1000 after |
| --- | --- |
| ![Before: desktop Sell](before/bg-1440.jpg) | ![After: desktop Sell](after/bg-1440.jpg) |

Additional evidence: [320px before](before/bg-320.jpg), [320px after](after/bg-320.jpg), [768px after](after/bg-768.jpg), [English at 320px](after/en-320.jpg), [390px form](after/bg-390-form.jpg), [desktop form](after/bg-desktop-form.jpg).

## Verification

- `npm run check` passed lint, TypeScript and the production build using Node 22.20.0. The build generated 407 static pages and used `.next-build-check`, separate from the existing dev server's `.next` output.
- The existing preview at `http://127.0.0.1:6483` is owned by this App checkout and runs Node 22.20.0.
- [24 focused browser checks](results.json) passed, with zero captured console errors. BG Sell was inspected at 320, 390, 768 and 1440 pixels; EN Sell at 320 pixels. The hero heading and supporting copy each occupy one line on the verified phone and desktop views, without forced no-wrap styling.
- Verified required fields, both intents, prepared draft contents, retained details across close/reopen and intent changes, keyboard activation, focus trapping, Escape, browser Back and scroll/focus restoration. All three guides open their existing localized detail sheets.
- Finance's calculator and Services' request CTA still open their existing destinations. Their landing pages have no Sell process content or horizontal overflow.
- React component review covered state ownership, stable list keys, labelled controls, dialog semantics and keyboard access. The optional compact banner treatment is enabled only for Sell.

## Source and delivery boundary

Canonical checkout: `L:/CODEX/cars/templates/app`, within Cars `main`. Baseline HEAD: `6a8cf208b3493128299f7ed8a8587694a1647b13`. The workspace doctor fetched Cars and reported no main drift at preflight. Existing unrelated dirty files and the earlier `TEMPLATE.md` edits were preserved; only the Sell contract paragraph was updated in that document.

Implementation paths: `components/FeatureLanding.tsx`, `components/ShowroomBanner.tsx`, `components/FeatureContent.tsx`, `lib/locales/en.json`, `lib/locales/bg.json`, and the Sell paragraph in `TEMPLATE.md`.

The pre-existing Cars `.git/index.lock` remains intact. No scoped commit or push could be made while that lock exists. This receipt establishes local implementation, build and browser evidence; dealer release, deployment and owner visual acceptance are separate.
