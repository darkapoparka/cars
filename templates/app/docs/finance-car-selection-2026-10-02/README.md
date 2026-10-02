# Finance car selection — 2 October 2026

The current layout makes the first banner the calculator, with a standalone car selector below it, inventory examples and a compact contact banner. The owner's later correction removes the steps and loose guidance. See [current Finance mobile cleanup](../finance-mobile-cleanup-2026-10-02/README.md). The [earlier calculator banner receipt](../finance-calculator-banner-2026-10-02/README.md) and images in this receipt remain historical evidence.

The Finance page now starts with a car-selection entry directly below its single dark hero. The shared search-field appearance opens a searchable picker using the same inventory matching as Cars. A tinted Calculator button opens the calculator without requiring a selection. It spans the mobile content width, includes a calculator icon and arrow, and uses the shared 16px control text role. There is no separate calculator heading on the page.

View all is a visible rounded button with an arrow and the short label All / Всички. The section heading and button fit on one row at 320px in both languages. Ask us uses the same shared button surface. All three actions have at least a 44px height; the calculator entry is 52px high.

The mobile hero is Finance. in English and Лизинг. in Bulgarian; the Bulgarian service tab also uses Лизинг. Desktop keeps its descriptive hero heading.

The page shows three priced inventory examples, ordered by price, using the shared vehicle card. Its payment action calculates an example with the existing amortisation helper: 20% deposit, 7% annual rate and five years. These assumptions are displayed beside the section heading. Selecting a car starts the calculator at its advertised price; changing cars resets the calculation, while closing and reopening preserves entered values. Price-on-request and coming-soon records are excluded from the picker. No lender eligibility or finance approval is asserted.

The four finance-benefit cards and lower budget banner are removed from this route. Supporting information is grouped into three disclosures: How it works, required documents, and lender terms. The process contains three short illustrated rows in natural colour. Sell and Services retain their composition; normal inventory cards retain their existing behavior when the optional finance action is absent.

## Verification

- Node 22.20.0; `NEXT_DIST_DIR=.next-build-check npm run check` passed: ESLint, TypeScript and the optimized Next.js build, including 407 generated pages.
- HTTP health checks returned 200 for `/bg/finance`, `/en/finance` and `/bg` on port 6483 after compilation.
- React review: one shared modal boundary, keyboard focus on view changes, Escape/Back and focus-return handling, preserved calculator state, shared locale-aware URLs and image paths, and shared text roles.
- The local preview was restarted on the same port, 6483, after disk-related server errors. A pre-existing broken temporary-build junction was repaired by recreating only its missing target directory; source, donor assets and recovery data were preserved.
- The HTTP preview is accessible again. Browser checks now cover Bulgarian at 320px, 390px, 768px and 1280px, plus English at 320px. There is no document overflow. Inventory uses one, two and three columns at the appropriate breakpoints. Shared control text remains 16px.
- Calculator entry, View all, car payment actions and search were exercised. An empty search shows no results; choosing MG 5 loads its €26,599 price and €421 example payment. The Mitsubishi card opens its €24,799 / €393 calculation. Changing a manual price from €25,000 to €35,000 updates the monthly example from €396 to €554. Closing and reopening preserves values; choosing another car resets them. Escape and browser Back close the sheet, restore focus to the launcher, and release body scrolling.
- The three supporting process rows were inspected on English mobile with natural-colour artwork and readable wrapping. Source/build verification and owner visual acceptance remain separate facts.

Rendered evidence: [Bulgarian 320px](finance-buttons-320.png), [Bulgarian 390px](finance-buttons-390.png), [English 320px](finance-buttons-en-320.png), [car picker](finance-picker-390.png), [selected-car calculator](finance-calculator-390.png), [desktop](finance-desktop.png).

The Cars24 donor at `L:/inspiration/cars24` and its previously inspected local reference on port 6484 remain preserved. This is local App-template work; no dealer release or deployment is claimed.

## Git handoff for the button correction

The button correction and screenshots are saved locally and verified. Commit/push is pending: another active Cars task, Polish import desktop styling, is writing in the shared checkout and pushing its Import commit. The shared index lock was left intact. At this check, main was `f190421c4`, with no staged paths and one commit ahead of the fetched origin/main.

After the shared writer releases the checkout, stage only `components/action-button.stylex.ts`, `components/FinanceCalculatorLauncher.tsx`, `components/FeatureContent.tsx`, this README and the six PNGs linked above; make the scoped App commit and push main without force. Preserve the unrelated App documentation directories and all other Cars changes. The original car-selection implementation is already in `5ca534b01`; this handoff concerns only the button correction and its completed browser evidence.
