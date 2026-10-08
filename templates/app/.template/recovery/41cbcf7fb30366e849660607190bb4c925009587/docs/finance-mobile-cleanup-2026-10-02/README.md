# Finance mobile cleanup — 2 October 2026

Removed the owner-rejected How it works section, all three illustrated step cards, Required documents and Rates and approval. Finance now proceeds from the calculator banner to car selection, three inventory examples, the existing assumptions and All cars action, then the contact campaign. No replacement prose blocks were added. Mobile inventory gaps are slightly tighter.

The calculator dialog uses a light estimate panel. Its existing estimate note sits inside that panel alongside the payment and total. The embedded vehicle-page calculator retains its presentation. Calculations, inventory, shared modal behavior and enquiry semantics are preserved.

Read the donor's `L:/inspiration/cars24/components/FeatureContent.tsx` and `FinanceCalculator.tsx`, and inspected the retained native Finance capture and donor mobile screenshot. Those supplied spacing and calculator hierarchy references. Original dealer artwork remains in use.

## Verification

- Node 22.20.0: `npm run check` passed lint, TypeScript and the production build using isolated `.next-build-check`. Development route imports were restored afterward; the existing server remains on port 6483.
- In-app browser: Bulgarian at 320 × 844, 390 × 844, 768 × 1024 and 1440 × 1000; English at 320 × 844. No horizontal document overflow or visible broken images. Removed sections are absent at each width. Inventory retains one, two and three columns. No captured browser errors or warnings.
- Searching ATTRAGE finds two cars; selecting the 2023 car loads €24,799 and an example €393 monthly payment. Editing price to €30,000 with 20% deposit, zero interest and five years produces €400. Values survive closing and reopening. The MG 5 payment action resets to €26,599, 7%, five years and €421. Escape and Back dismiss the dialog, restore focus and release scroll locking. The contact action opens the enquiry draft; no message was sent.
- React review: explicit conditional rendering, stable hook order, existing controlled inputs and derived estimates. No new hooks, requests, dependencies or styling framework.

Final evidence: [Bulgarian 320px](bg-320.jpg), [Bulgarian 390px](bg-390.jpg), [lower page](bg-390-lower.jpg), [calculator 320px](calculator-320.jpg), [English 320px](en-320.jpg), [desktop](bg-desktop.jpg).

## Source status

Live local master: `http://127.0.0.1:6483/bg/finance`. This correction is integrated with the later [Services card revision](../services-cards-2026-10-02/README.md) in the scoped App UI commit. Existing App changes and unrelated Cars changes were preserved. No template release or dealer deployment is claimed.

This correction changes `FeatureContent.tsx`, `FinanceCalculator.tsx`, spacing in `FinanceCalculatorLauncher.tsx`, the Finance paragraph of `TEMPLATE.md` and the historical receipt pointers above, plus this final evidence directory. The earlier banner and car-selection changes are retained in the same App scope.
