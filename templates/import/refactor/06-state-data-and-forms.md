# 06 — State, public data and form boundaries

## State ownership table

| State                                                            | Owner                                                                   | Persistence/navigation rule                                                                |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Search, brand/model, price/mileage/year, sort and supported view | Canonical inventory query                                               | URL; deep links and back/forward must reconstruct it                                       |
| Facet draft before Apply                                         | The active facet/form controller                                        | Local until commit; Cancel must not mutate the committed query                             |
| Open menu/dialog/sheet                                           | Owning UI primitive + explicit shallow-history integration where needed | Temporary; preserve router state rather than overwriting it                                |
| Revealed card count and scroll restoration                       | Inventory page/navigation state                                         | Restore on detail return without making presentation state a global server value           |
| Favourite/compare selection                                      | Existing per-layout garage context                                      | Client persistence with safe hydration/storage-event cleanup                               |
| Form values, errors and step                                     | Feature form controller                                                 | Preserve/recover intentionally; never store sensitive documents or contact details in URLs |
| Authenticated session                                            | Server-side validated session boundary                                  | Never inferred from a query parameter in live mode                                         |
| Dealer configuration                                             | Typed public configuration plus private server configuration            | Read-only during a request; no secrets serialized to the client                            |

The existing layout-created `GarageState` is a pattern to preserve. Do not replace it with a module-level singleton shared across server requests.

## Inventory contract

Keep `server/inventory-state.ts` as an adapter while extracting pure parsing/serialization into a shared module. Write characterization tests before changing aliases. The domain contract should distinguish identifiers, displayed labels, structured make/model filters and free-text query terms. Avoid deriving behaviour from translated strings.

The canonical parser must specify repeated parameters, comma-separated historical aliases, blank/all values, unsupported sort/view values, numeric bounds and invalid ranges. A normalized query should serialize consistently. Preserve required old URLs through boundary aliases or redirects rather than keeping historical names in every component.

Use one definition of facet options/counts, dependent make/model validity and clear/reset behaviour. Test a brand change when a previously selected model is no longer available. Define whether Apply is explicit or immediate per control; do not let mobile and desktop silently disagree.

For the current small fixture catalogue, local filtering may remain appropriate. Do not introduce remote search infrastructure merely to modernize the folder tree. When catalogue size warrants server paging, introduce it behind the same query contract and test payload size, stable ordering and duplicate-free paging. The existing 12-card reveal is a presentation batch, not proof that only 12 vehicles are serialized.

## Public vehicle model

Keep one canonical `Vehicle` type and a deliberate public view model. A server adapter can combine approved fixture and CMS data, but must not expose private notes/contact submissions or import a full backend model into a client bundle.

Normalize price/currency, mileage/unit, make/model/trim, status, source identity and image metadata before presentation. Keep absence distinct from zero. A missing price is not automatically zero euros; a missing rating is not 4.9; a generic stock image is not a verified photo of a vehicle. Deduplicate merged fixture/CMS records by a stable key and specify conflict precedence.

Homepage, inventory, detail, compare, favourites and sitemap should use consistent publication/availability rules. The existing homepage static-only selection versus merged public inventory needs a deliberate editorial policy, not accidental divergence. If “featured” is curated, model that as curation rather than a hidden exception list of problematic slugs.

## Finance and formatting

Move the shared estimate formula out of an unrelated generic formatter into a small domain module when migrating consumers. Inputs must explicitly include principal, down payment, term, rate and any approved fees/assumptions. Test zero rate, zero financed amount, invalid term, non-finite values, negative values and rounding. Do not display `price / 72` as if it were the same product as an amortized estimate with interest.

A configured display locale/currency must be used consistently. Store numeric values, not formatted strings that must be parsed back from several languages. Formatting helpers should receive locale and currency where relevant. Preserve existing source data through explicit conversion at the ingestion boundary, with fixtures for spaces, decimal separators and unavailable values.

Whether any finance disclosure or offer is legally sufficient is not established by this code audit. The template must allow approved lender/dealer copy and clearly distinguish an estimate from an offer.

## Form architecture

Each actual flow owns its schema: general inquiry, import request, sell submission and administrative updates are not necessarily the same payload. Share validation fragments for genuinely repeated fields, not a universal all-optional mega-schema. Reuse Zod 4; a second validation library is not needed.

Choose progressively enhanced SvelteKit actions for ordinary page forms where suitable. Keep JSON endpoints where there is a real API/dynamic-wizard consumer. Both paths should call one submission service and return a typed result. Do not duplicate authorization/validation/storage logic in both route handlers and UI controllers.

A submission result should distinguish validation failure, unavailable service, successful demo storage, durable live acceptance and actual delivery status. The existing truthful demo copy must remain. “Saved” must not be relabelled “sent to the dealer” merely because a database insert succeeded.

Validation should preserve entered values, identify fields, provide a concise error summary when helpful and move focus appropriately. Support keyboard autocomplete/input modes, explicit button types and clear disabled/loading behaviour. A retry must not silently create duplicate records: choose an idempotency policy for live submission, scoped to the endpoint and storage transaction.

## Request/service boundaries

Parse the request once, validate before business operations, authorize protected operations independently, then invoke storage/delivery. Bound request body and upload processing at the deployment/runtime boundary as well as field-schema level. A 5,000-character message limit does not prevent a huge body from being read first.

Keep public-safe errors in the response; record structured operational context without secrets or unnecessary personal information. JSON malformed-input handling already exists and should remain. Add coverage for malformed/unsupported form-data content rather than removing defensive parsing.

## Navigation and effects

Replace direct browser history manipulation with the supported SvelteKit shallow-routing integration where that preserves the existing mobile-back contract. Preserve unrelated router/page state. Track which overlay owns a history entry and what happens on route changes, nested openings and direct links.

Use derived state for values computed from route data/props. Avoid effects that copy state in circles. Effects, observers and subscriptions need cleanup and cancellation. Prevent stale asynchronous count/search responses from overwriting current state. No new general state-machine dependency is required unless a specific flow proves it needs one; ordinary typed state and explicit transitions are sufficient initially.

## Completion evidence

Query round-trip and legacy-alias tests; representative vehicle normalization tests; no shared mutable per-user SSR state in migrated services; one finance policy; identical validation rules across viewport presentations; mocked submission/delivery tests; and browser tests for back/forward, repeated form openings, invalid input and retry. Feature-specific tests precede removal of old adapters.
