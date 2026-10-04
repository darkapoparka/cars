# Mobile Leasing car selection — 4 October 2026

The phone's dealer panel now begins with “Избери кола” / “Choose your car”, using the same white 44px search treatment and centered logo as the other tabs. It opens the existing car-search overlay; a selected stock car then opens the existing calculator with its price filled in. The dealer panel remains 150px high.

The owner's follow-up removes the separate inline “Марка или модел” / “Make or model” import search below the panel. The country pills now follow the banner directly, then the import cards. The priced-stock overlay is the only car search on Leasing; country filtering and its accessible live result count remain available. The duplicate field, its query state and unused styles are removed at the component owner, across phone and desktop layouts.

“Въведи цена” / “Enter a price” provides a quiet route to the calculator for a car outside the priced stock, including when search gives no results. Switching from a stock car to a custom price clears that car. Reopening the same car or a custom calculation preserves edited price, rate, term and deposit. Another selected car starts with its own price. The picker uses the existing rounded keyboard-search focus protocol. Desktop retains its direct Calculate action; Home, Sell and Services retain their current controls.

The country pills now include 20 × 15px flags for Germany, Canada, USA, Italy and the Netherlands beside their translated labels. All remains text-only. Flags are decorative and locally hosted; each country keeps its full accessible name and 44px touch target. The shared pill accepts an optional flag asset without changing other controls. [Flag provenance and retained license](../../public/flags/README.md) record the five original SVGs.

## Local verification

Canonical App preview at `http://127.0.0.1:6483`, existing process on Node 22.20.0. Both Bulgarian and English phone entry/selection flows were checked at 320px and 390px, plus the English desktop calculator at 1440px and the neighboring Home / Sell / Services headers at 390px.

- The initial picker shows 42 eligible priced fixture cars; unavailable/coming-soon and price-on-request cars stay excluded by the existing stock selection.
- Searching Ciaz returns one 2023 Suzuki Ciaz. Selecting it opens the calculator at €28,799 and displays the selected car.
- Closing and reselecting that car preserves an edited €33,000 estimate price. Custom mode preserves €31,000, an 8% rate, a six-year term and a 21% deposit after close/reopen.
- Empty search retains the manual-price action. Both picker and calculator fit 320px without horizontal document overflow, with 16px text-entry controls.
- Search receives focus; the modal contains keyboard focus. Escape and browser Back close the overlay; closing returns focus to its banner entry.
- The search entry is 44px high, with regular 16px text and one search icon. All four phone dealer panels remain 150px high. Services still has its editable inline search; Sell retains its valuation action and arrow.
- The calculator remains illustrative. No enquiry, finance application, booking or message was sent.

All 27 focused assertions pass. `npm run check` passed after the final picker-focus change: lint, TypeScript and the production build, including 407 generated pages. The isolated `.next-build-check` output preserved the dev runtime, and preview type imports were restored to `.next/dev`. No application warning/error appeared; one development Fast Refresh full-reload notice while editing is retained in `verification.json`. Source, local browser/build evidence and any future dealer deployment remain separate. Unrelated drafts and shared Git ownership are preserved.

The duplicate-search follow-up adds 11 passing rendered assertions: Bulgarian and English at 320px and 390px have no inline import search or horizontal page overflow; Germany selects its one BMW, All restores five cards, the single overlay search finds Ciaz and opens the calculator at €28,799, and desktop at 1440px retains its working Calculate action. `npm run check` passed again after removing the field, including lint, TypeScript and all 407 generated pages. No browser warning or error appeared during this follow-up. See `duplicate-search-verification.json` for the evidence and final check result.

The flag follow-up adds nine passing rendered checks: all five local flag images load at 20 × 15px, the translated labels and 44px targets remain intact, country selection and All reset work, and keyboard Enter can select the final Netherlands pill and its Audi. Bulgarian and English at 320px and 390px and desktop at 1440px fit without horizontal page overflow. The neighboring Services pills retain their labels and appearance. `npm run check` passed after the flag change, including lint, TypeScript and all 407 generated pages. No browser warning or error appeared during the flag review; `flags-verification.json` records the checks and asset source. Preview type imports were restored after the isolated build.

## Screenshots

The latest [mobile spacing correction](SPACING.md) standardizes the discovery groups at 12px. [Spacing before](spacing-before-bg-390.jpg) · [Current after](spacing-after-bg-390.jpg)

[Flags before](flags-before-bg-390.jpg) · [Current after with flags](flags-after-bg-390.jpg)

Earlier duplicate-search correction: [Before](duplicate-search-before-bg-390.jpg) · [After](duplicate-search-after-bg-390.jpg)

Earlier entry change: [Before](before-bg-390.jpg) · [After](after-bg-390.jpg) · [Car picker 390px](picker-bg-390.jpg) · [Car picker 320px](picker-bg-320.jpg) · [Selected-car calculator](calculator-bg-390.jpg) · [English entry](after-en-390.jpg)

## Source handoff

Cars main and fetched origin were aligned at `6c92fdc2758d5d5b985a9c8a9004c7bb969d313a` at handoff. The intervening commits did not change App source. Only `TEMPLATE.md`, `components/FeatureLanding.tsx`, `components/DealerMobileBanner.tsx`, `components/FinanceCalculatorLauncher.tsx`, `components/ImportCountryPicker.tsx`, `components/FilterPill.tsx`, `lib/showroom.ts`, `lib/locales/bg.json`, `lib/locales/en.json`, `public/flags/` and this evidence directory belong to this change.

The later spacing correction also owns the eight additional App source paths listed in [SPACING.md](SPACING.md). The combined reviewed changes and evidence form the scoped preview-publication source.

At the original local check, the shared Cars index lock blocked staging/commit/push and the staged index was empty. During the later owner-authorized preview-publication request, the unchanged empty lock was confirmed orphaned with no writer or open handle, then preserved with the previous index in Cars runtime recovery. Fetched main had no drift and no foreign paths were staged. The local UI and required build checks are complete; publishing the standalone preview does not select an approved template release or refresh dealers.
