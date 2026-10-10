# Architecture

## Routes and presentation

Next App Router owns routes, metadata and shared layouts. `app/[locale]/2` aliases the alternative mobile journey; it is not a duplicate application. Both journeys share vehicle detail routes and business rules. `AppLink`, the navigation wrapper and `lib/paths.ts` compose locale, journey and mount paths. Do not bypass them with browser-root URLs.

The existing StyleX tokens and component styles remain authoritative. `components/filters` separates checkbox presentation, make/model selection and unchanged filter styles from `NativeFilterPane` orchestration. This is extraction by responsibility, not a generic form-builder or a new design system.

## Public configuration and domain

`lib/dealer-schema.ts` is the build-time schema and type source for public dealer and vehicle data. `lib/vehicle.ts` exports only its inferred type; the validator is not a client runtime dependency. `scripts/validate-dealer.mjs` validates all three public JSON inputs, duplicate identities, permitted URLs and local asset existence. Unexpected private fields fail validation rather than silently becoming public props.

`lib/data.ts` is the catalogue adapter and slug lookup. Template seed records are isolated in `lib/fixtures`; captured inventories retain their existing source order/merge behavior. Dealer stock is never supplemented with template examples. Import listings have a separate adapter and country boundary. These boundaries can later be backed by a service without replacing presentational contracts.

`lib/vehicle-values.ts` defines published price, mileage, monthly estimate and discount semantics. `inventory-filters.ts` owns validated selections and matching. `inventory-settings.ts` derives shared control bounds from configured dealer stock, without importing captured demo catalogues. `inventory-options.ts` contains make/model choices and canonical make names. `inventory-sort.ts` owns the option catalogue, stable ordering and missing-value placement; phone and desktop cannot drift onto different comparators.

`inventory-search.ts` parses and serializes portable URL selections. Untrusted history and query values are normalized before matching. Explicit refinements exclude unpublished numeric facts; an unfiltered catalogue still includes those cars. Sorting never mutates the source. Recently added uses actual optional listing dates, not model years or observation dates.

## Server/client boundary

Full captured detail/inspection snapshots are server-route inputs. Only the selected vehicle's detail reaches its client component. Server detail and locale helpers use the `server-only` marker. The architecture test traverses client import graphs to reject those snapshots, request helpers and the configuration validator. Request-dependent locale layouts mean routes are not all static exports.

`locale-policy.ts` resolves enabled locales without React or translation dictionaries. Explicit URL locale wins; cookies are only enabled preferences. Disabled prefixes are replaced once. The preview proxy accepts browsing, not transaction submissions.

## Browser state and interactions

`vehicle-storage.ts` owns validation, deduplication, limits and storage failure semantics. Hooks in `useVehicleState.ts` own subscriptions and stable external-store snapshots. Saved/recent state is scoped by dealer, mode and mount; the primary and alternative journeys intentionally share that scope. Failed persistence is not reported as success.

`useInventoryHistory.ts` owns the exact collection entry and vehicle-return state. Native history writes preserve application-owned fields without copying Next's internal router markers. Filter sheets retain their own Back step and commit selections on dismissal. Clear all preserves unrelated URL parameters.

`useModal` remains the single boundary for nested focus/background isolation, scroll locking, Escape and Back. Enquiry drafts have per-instance accessible IDs and accurately named state; they do not simulate authentication or submission. External mail, call and WhatsApp destinations come from validated public configuration.

## Verification and maintenance

Unit/domain tests use Node's test runner and TypeScript already in the toolchain. Browser tests use Playwright with real production output. The visual suite compares routes and filter panels at four widths in both configured languages; golden images and traces remain ignored runtime artifacts. CI runs source/build validation, production dependency auditing, browser journeys and route smoke tests.

Keep source, lockfiles and intentional provenance. Do not accumulate dated generated build paths, one-off rewriting scripts or screenshots under active source directories. Canonical Cars ownership, review branches and release approval are separate concerns: see README and PRO-REVIEW.
