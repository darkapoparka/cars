# Sell page and enquiry overlay — 2 October 2026

The owner requested removing the Sell brand selector, a more useful banner, an action below the banner that opens an overlay, and selling cards below it.

## Implemented

- Static “Време за промяна?” / “Time for a change?” banner with the existing original showroom artwork.
- One full-width Request a valuation button below the banner, opening car details on the current page.
- Sale and part-exchange cards open the same sheet with the appropriate option selected. Phone and tablet cards stay stacked; desktop cards remain side by side.
- Make/model inputs, optional year/mileage/notes, and an editable enquiry draft using the existing dealer configuration. These details remain local; no valuation or sale is submitted.
- Removed the landing brand grid, process list, repeated campaign, generic FAQ and contact footer. The compact illustrated guide rail opens its advice intentionally.
- Legacy `/bg/sell/details?brand=Toyota` still prefills the existing make input.

## Verified locally

In-app browser on `http://127.0.0.1:6483`: Bulgarian at 320×740, 390×844, 768×1024 and 1440×1000; English at 320×740. The affected views had no horizontal page overflow or broken visible artwork. The desktop form was centered at 560px wide; the narrow form retained 16px inputs and a visible primary action.

Checked the main action, both card presets, required make/model validation, sale and exchange draft contents, preserved input values when reopening, nested Back navigation, Escape, focus return, Tab/Shift+Tab containment and restoration of background scroll/inert state. The photo guide opened and closed correctly. Services category filtering and the finance calculator still worked after the shared banner changes. Final console inspection found no new application errors after the source settled.

`npm run check` passed on Node 22.20.0: ESLint, TypeScript and the production build, including 407/407 generated pages. Verification used the separate `.next-build-check` output and two build workers; the maintained preview stayed on its existing output. The generated `next-env.d.ts` imports were restored and checked against the original dev paths after the build.

This verifies the local master. Dealer refresh, hosted deployment, native-app parity and owner acceptance are separate.

## Final screenshots

- [Bulgarian mobile, 390px](bg-390.jpg)
- [Bulgarian mobile, 320px](bg-320.jpg)
- [Car-details overlay, 320px](overlay-320.jpg) — example QA inputs only.
- [English mobile, 320px](en-320.jpg)
- [Bulgarian desktop, 1440px](bg-1440.jpg)
