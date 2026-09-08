# Shared behavior ownership

Updated 2026-09-08 for the independent J:/cars/templates/carwow master. This documents focused repairs; it does not replace DESKTOP_STYLE_GUIDE.md or merge the intentionally separate desktop and mobile compositions.

## Inventory

- `src/lib/utils/inventory-url.ts` owns parsing and serialization for both layouts. Multi-value fields accept repeated, comma-separated, and legacy plural parameters. Serialization emits repeated fields, preserves unrelated context, and includes sorting. Equivalent desktop/mobile sort names are translated; each layout keeps its own default order.
- `src/lib/state/inventory-filters.svelte.ts` owns vehicle matching, price/mileage bands and the per-instance desktop reactive state. No mutable server singleton is used.
- `MobileInventoryPage.svelte` owns the mobile sheet draft and choice flow. Changing fields previews the result count; **Покажи** applies to the URL. Close/Escape restores the last applied URL criteria. Reload and route/history changes rehydrate from that URL. The same matcher handles desktop-only feature/condition parameters when a link is opened on mobile.
- `desktop-inventory-context.svelte.ts` owns desktop draft/control coordination and delegates URL output to the same helper. Desktop's additional sorting options remain desktop options; their unsupported mobile equivalents fall back to the mobile default.

Do not add a second matcher or silently drop existing query criteria in a new inventory control. Filter state is route-local; garage favorites/comparison remain separate state.

## Finance

- `src/lib/utils/finance-estimate.ts` owns the pure illustrative calculation, EUR formatting, input validation and current/legacy calculator query parsing.
- `CalculatorContent.svelte` owns the full calculator fields, summary and FAQ; `DesktopDetailFinanceCalculator.svelte` owns the compact vehicle handoff. Both call the same model and reset from changed route/vehicle data.
- Calculation assumptions are disclosed beside the controls: equal monthly payments, fixed annual interest, and fees calculated from price and financed upfront. Total includes deposit/trade-in plus installment repayments. Inputs are hypothetical, not offered terms; other costs/insurance are excluded.
- Invalid input produces an explanation and no payment. Cards must use enquiry wording until finance assumptions are approved; a divisor of the source BGN price is not a financing model.
- `finance-estimate.test.ts` tests arithmetic, upfront/fee accounting, invalid values and old query links. `inventory-url.test.ts` tests filter round trips and sort aliases.

## Full-screen mobile sheets

`MobileFullSheet.svelte` owns a native modal dialog in the browser top layer, including background inertness, initial focus, Escape cancellation, viewport sizing and focus return after the closing transition. `src/lib/utils/modal-focus.ts` provides the explicit Tab/Shift+Tab wrap for visible enabled controls, also reusable by other modal owners; native dialog alone can send focus to browser chrome. The existing opaque slide and reduced-motion path are retained. Feature owners provide the labelled heading and choose apply/cancel behavior; they must not introduce independent background scroll or focus traps.

## Boundaries

Shared data, pure calculations and behavior primitives are useful cross-layout seams. Desktop and mobile route compositions, information density and styling remain independent. Extraction should fix duplicated behavior or establish a cohesive responsibility, not merely shorten a file. Existing source sample content and local forms do not establish provider delivery or public readiness.
