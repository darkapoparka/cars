# Single Finance banner — 2 October 2026

Finance had accumulated a main campaign, a second calculator panel, four photo cards and a budget campaign. The page now has one campaign banner, with its primary white 56px Calculate action opening the existing calculator modal. The standalone calculator panel and budget campaign are removed from this page.

The four finance parameters are a plain definition list with short localized explanations. A quiet Ask us text action preserves the existing enquiry draft. The numbered process, mobile Стъпки / Steps heading, FAQ and contact section remain available. Typography uses the shared locale roles; other landing banners retain their existing actions. Original assets and earlier verification screenshots are preserved.

## Verification

- `npm run check` passed under Node 22.20.0 with `NEXT_DIST_DIR=.next-build-check`: ESLint, TypeScript and the optimized build generated 407 pages.
- `/bg/finance` was inspected at 320×720, 390×844, 768×1024 and 1440×1000; `/en/finance` at 320×720. Each has one campaign banner, its calculator trigger inside that banner, no separate calculator panel or budget campaign, four text parameters, six process steps and no horizontal page overflow. The white trigger is 56px high and borderless; mobile Стъпки / Steps stays on one line.
- The calculator produced €667/month for €30,000, 20% deposit, 0% annual interest and three years. Closing and reopening retained entered values. Escape restored trigger focus; Back closed the modal without leaving Finance. The background remained inert and page scrolling locked. The desktop modal is centered and 560px wide.
- The quiet assistance action opened the existing enquiry draft. No message was submitted. Sell and Services retained their 44px hero actions and navigation to `/bg/sell/details` and `/bg/service/details` at 320px.
- Browser logs showed no errors and one development Fast Refresh full-reload warning during editing. `workspace-doctor.mjs --fetch` completed; unrelated staged and working changes were preserved.

These checks cover the local App template. No dealer refresh or deployment was performed.

## Evidence

- [390px Finance](finance-390.jpg)
- [320px Finance](finance-320.jpg)
- [768px Finance](finance-768.jpg)
- [1440px Finance](finance-1440.jpg)
- [English at 320px](finance-en-320.jpg)
- [Phone calculator](calculator-390.jpg)
- [Desktop calculator](calculator-1440.jpg)
- [Recorded geometry and interactions](verification.json)
