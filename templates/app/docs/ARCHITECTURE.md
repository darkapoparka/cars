# App architecture

## Presentation and routes

The Next.js App Router owns locale pages, metadata and shared layouts. `app/[locale]/2` is an alias layer for the alternative mobile journey, not a separate application. Both journeys use the same vehicle-detail routes, catalogue and enquiry components. Styling remains in existing StyleX definitions and tokens; no redesign is part of architectural maintenance.

`AppLink` and the navigation wrapper compose locale and alternative paths. Pure alternative-path decisions live in `lib/home-paths.ts`; React context remains in `lib/home-alternative.tsx`. `lib/paths.ts` is the mount/asset boundary. Do not write bare `/cars` or `/sell` browser URLs around these boundaries.

`lib/locale-policy.ts` resolves enabled locales without importing translation dictionaries or React. Explicit URL locale wins; cookies are only preferences and must also be enabled. Disabled locale prefixes are replaced once rather than repeatedly prepended. Proxy still rejects submissions in this preview. Locale-dependent layouts read request headers, so application pages should not be described as universally statically generated.

## Inventory and formatting

`lib/vehicle.ts` defines the shared vehicle type without importing fixtures. `lib/data.ts` retains the established catalogue API, selects dealer/template inventory, and indexes vehicle lookup by slug. Existing imports remain compatible through re-exports. `lib/format.ts` reuses one currency formatter rather than constructing one for every displayed price.

Full captured inspection/detail snapshots are server-route inputs; only the selected detail is passed to a client component. The architecture regression test follows import graphs to prevent these snapshots and server request helpers from entering client bundles. A `.server.ts` filename alone is not treated as sufficient enforcement.

`lib/inventory-filters.ts` owns filter normalization and matching. Untrusted restored state is bounded before use. Explicit numeric filters exclude unpublished prices, unpublished mileage and absent monthly estimates; an unfiltered catalogue continues to show those vehicles honestly. Formatting and default catalogue ordering remain unchanged.

## Browser state

`lib/vehicle-storage.ts` contains browser-independent persistence rules with injected storage access. The hooks in `components/useVehicleState.ts` own subscriptions and React lifecycle integration. String snapshots remain stable for `useSyncExternalStore`; decoded lists are validated, deduplicated and bounded. Denied or full storage does not crash browsing or report a failed save as successful.

Only the original unmounted template retains `drive24:saved` and `cars24:recent`. Other instances are scoped by mode, dealer ID and mount. Primary and `/2` journeys intentionally share that scope. Dealer previews do not inherit the template's recent-car example.

The service search uses URL parameters as its source of truth, so history restoration cannot leave a stale category or query in local component state. `lib/history-state.ts` carries application-owned fields through native history writes without copying Next.js internal router markers. Inventory back navigation validates stored destinations and falls back safely when browser history is malformed.

`lib/inventory-search.ts` parses and serializes inventory selections for portable URLs and reloads. `components/useInventoryHistory.ts` preserves the current collection entry and records that entry when a vehicle is actually opened. Filter sheets commit their URL after dismissal so their Back step retains live edits. Clear all removes owned filter parameters while retaining unrelated URL options. History restoration validates the exact entry before applying stored state. Monthly-payment shortcuts use the same published-value predicate as the filter panes.

## Verification and release boundary

`npm run check` runs lint, application type checking, domain/architecture tests and a production build. The test runner uses TypeScript already in the toolchain and Node's built-in test runner; it adds no testing-framework dependency. Temporary test output is removed in `finally`. The standalone publishing repository's CI uses the same gate and production route smoke checks. Browser capture is a review utility, not a substitute for interaction testing or visual comparison.

Historical `.template` recovery files and ignored `runtime` output are outside active lint/type-check inputs. Public assets and fixture data remain protected. The canonical source retains the owner's design specifications and existing QA evidence; the standalone publishing snapshot's historical cleanup is described in [HISTORY.md](HISTORY.md).

This directory is the canonical Cars App template. The functional refactor from standalone commit `f08f679ff091e446ca0b57eec9c3710baaec7ef9` was reconciled here on 7 October 2026 while preserving the newer local UI work. The template remains a preview without a transactional enquiry backend. Source maintenance does not approve a template release or refresh existing dealers; the Cars release lock and dealer-specific acceptance remain authoritative.
