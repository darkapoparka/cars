# App mobile closeout — 3 October 2026

The current mobile composition is retained: illustrated Buy / Sell / Leasing / Services tabs, a consistent centered Drive24 panel with a useful action, the lighter Sell cards, and the Home make strip followed by its four compact promotions and inventory. Home promotions retain one natural title line, two supporting lines and regular 14px action text. This closeout adopts and verifies the pending shared quick-filter treatment rather than introducing another layout direction.

Cars, Finance and Services now share `FilterPill` and `pill.stylex.ts`: white bordered surfaces, charcoal selection, 44px control targets and a 40px visible phone surface (36px on wider screens). Inline category/country choices expose `aria-pressed`; Cars controls retain their drawer semantics. The final correction places keyboard focus inside the control with a white ring on dark selections. Previously the outer ring was clipped by the scrolling rail, on phones and desktop.

## Verification

Local preview: `http://127.0.0.1:6483`. Node 22.20.0, Next.js 16.3.6, retained npm lockfile and StyleX. The existing preview process was reused.

| Check | Result |
| --- | --- |
| Main page layouts | 40 renders: BG and EN at 320px and 390px across Home, Cars, Saved, More, Search, Sell, Finance, Services, Stores and the Fortuner detail page. No horizontal document overflow. |
| Shared responsive controls | Four BG tablet renders at 768px and Cars / Finance / Services at 1440px. No horizontal document overflow. Selected keyboard focus is contained and contrasting. |
| Search and inventory | 48 actual fixture records. Toyota text search and brand filter produce nine results; ascending sorting is reflected in the prices. Home's keyboard model suggestion produces three Fortuner results. |
| Detail and Saved | Detail gallery advances to photo 2/18. Save survives a reload; removal returns the empty state and focus to its browse action. The QA-created saved car was removed; pre-existing user state was preserved. Returning from detail retains the inventory filter and sort. |
| Viewing | Viewing choice opens an editable draft containing the actual vehicle and current URL. Escape closes the sheet and returns focus to its opener. |
| Sell and exchange | Sale form fits 320px with 16px inputs. Changing to exchange retains the entered vehicle. The draft contains the exchange intent; Back dismisses only the top enquiry and preserves the underlying form. The process drawer opens its three steps. |
| Leasing | Canada filters the five import examples to one. An incompatible Tesla query gives zero; reset restores five. Changing the illustrative calculator price from €25,000 to €30,000 changes its monthly estimate from €396 to €475; closing/reopening retains the entered value. |
| Services | Category filtering gives one option; combining Diagnostics with an oil search gives zero. Reset restores both options. Choosing Servicing prepares an editable draft retaining the selected service and entered vehicle. One visible mobile search field and loaded service images. |
| Navigation and locale | Mobile dock and More menu destinations work. The language switch opens the translated English menu and returns to Bulgarian. The visit page truthfully displays the unconfigured template contact state. |
| Browser diagnostics | No warning/error entries during this verification session. |
| Final required check | `npm run check` passed after the final shared focus correction: lint, TypeScript and production build, including 407 generated pages. Isolated `.next-build-check` output and a 2048MB Node heap preserved the dev runtime; generated preview type imports were restored to `.next/dev`. |

`verification.json` records 140 passing assertions, route geometry and the local evidence boundary. Browser navigation delays and initial measurements taken while a route loaded were resolved by reading the settled screen. Test-selector corrections are recorded with their affected assertions. This is local browser evidence, not physical-device, hosted deployment or connected enquiry delivery acceptance. Enquiry actions prepare drafts; no message or transaction was sent.

## Screenshots

- Final primary views: [Home 390px](after/bg-390.jpg), [Sell 390px](after/bg-sell-390.jpg), [Leasing 390px](after/bg-finance-390.jpg), [Services 390px](after/bg-service-390.jpg), [Cars 390px](after/bg-cars-390.jpg).
- Narrow phone: [Home 320px](after/bg-320.jpg), [Sell 320px](after/bg-sell-320.jpg), [Services 320px](after/bg-service-320.jpg).
- Focus correction: [Phone before](before/bg-country-focus-320.jpg), [phone after](after/bg-country-focus-320.jpg), [desktop before](before/bg-service-focus-1440.jpg), [desktop after](after/bg-service-focus-1440.jpg).
- Working states: [Saved car](after/bg-saved-filled-320.jpg), [viewing draft](after/bg-viewing-draft-320.jpg), [service draft](after/bg-service-draft-320.jpg).

## Source handoff

Reviewed source paths: `TEMPLATE.md`, `components/FilterPill.tsx`, `components/pill.stylex.ts`, `components/ImportCountryPicker.tsx` and `components/ServiceCatalogue.tsx`, plus this evidence directory. Unrelated drafts, historical captures and shared Git state remain preserved.

The shared index was locked during verification. App instructions require: “Preserve unrelated work and never bypass an active Git lock.” No lock was removed or bypassed. The index became available before handoff, and foreign staged changes were absent. `workspace-doctor.mjs --fetch` then confirmed Cars main aligned with origin at `94d83cf84adfee24837362501a99811ea6c2de5b`; the intervening Import commit did not change App source. The build/browser verification began at `f615f5d485908a22d3410525914b0dbd9a8acb31`. Earlier mobile banner/copy work is already in `b12dc1e6e493876cc46d20af6f6831997875d89b`.

The source handoff contains only the reviewed App paths and this evidence directory. No template-lock selection or dealer deployment is included in this UI closeout. The final response reports the scoped commit and remotely verified push separately.
