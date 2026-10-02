# Finance car selection — 2 October 2026

The Finance page now starts with a car-selection entry directly below its single dark hero. The shared search-field appearance opens a searchable picker using the same inventory matching as Cars. A compact Estimate payment action opens the calculator without requiring a selection. There is no separate calculator heading or oversized Calculate button on the page.

The mobile hero is Finance. in English and Лизинг. in Bulgarian; the Bulgarian service tab also uses Лизинг. Desktop keeps its descriptive hero heading.

The page shows three priced inventory examples, ordered by price, using the shared vehicle card. Its payment action calculates an example with the existing amortisation helper: 20% deposit, 7% annual rate and five years. These assumptions are displayed beside the section heading. Selecting a car starts the calculator at its advertised price; changing cars resets the calculation, while closing and reopening preserves entered values. Price-on-request and coming-soon records are excluded from the picker. No lender eligibility or finance approval is asserted.

The four finance-benefit cards and lower budget banner are removed from this route. Supporting information is grouped into three disclosures: How it works, required documents, and lender terms. The process contains three short illustrated rows in natural colour. Sell and Services retain their composition; normal inventory cards retain their existing behavior when the optional finance action is absent.

## Verification

- Node 22.20.0; `NEXT_DIST_DIR=.next-build-check npm run check` passed: ESLint, TypeScript and the optimized Next.js build, including 407 generated pages.
- HTTP health checks returned 200 for `/bg/finance`, `/en/finance` and `/bg` on port 6483 after compilation.
- React review: one shared modal boundary, keyboard focus on view changes, Escape/Back and focus-return handling, preserved calculator state, shared locale-aware URLs and image paths, and shared text roles.
- The local preview was restarted on the same port, 6483, after disk-related server errors. A pre-existing broken temporary-build junction was repaired by recreating only its missing target directory; source, donor assets and recovery data were preserved.
- Rendered 320px, 390px, desktop and drawer interaction checks are pending. Browser automation rejected the existing connection-error page because it uses a `data:` URL; the owner was asked to reload the HTTP Finance preview. Source/build success is separate from visual and owner acceptance.

The Cars24 donor at `L:/inspiration/cars24` and its previously inspected local reference on port 6484 remain preserved. This is local App-template work; no dealer release or deployment is claimed.
