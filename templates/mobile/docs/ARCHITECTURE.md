# Architecture and verification

## Ownership and stable presentation

The editable template lives in `darkapoparka/cars`, under `templates/mobile` on
`main`. `darkapoparka/cars-template-mobile` is its standalone publishing mirror,
not a second independently maintained implementation. Source changes do not
select a fleet release or update an existing dealer; the Cars release lock and
publisher remain the separate authority for those operations.

Keep dealer identity and contact configuration in `src/lib/showroom.ts`, inventory
in the catalog boundary, and presentation in the existing components and StyleX
tokens. Architectural changes must not silently rewrite component markup,
spacing, breakpoints, imagery or styling. Compare phone and desktop renders when
changing code that can affect presentation or navigation.

## Browser state boundaries

`persistence.ts` owns the persisted state shape, defaults, limits and decoding of
untrusted or old browser records. All dictionary keys are validated consistently;
saved-search IDs are unique after normalization. Invalid data falls back to known
defaults rather than becoming arbitrary application state.

`app-store.ts` is a React-independent store factory with an injected browser and
storage boundary. Each instance owns its snapshot and subscriptions. Snapshots
are stable and side-effect-free, hydration happens once before the first read or
write, and server-side calls cannot mutate the shared server snapshot. Storage
access can fail without losing the current in-memory session. A successful local
write is reported separately from session-only retention.

`store.ts` is the React adapter and existing domain-action API. Components continue
to use `useAppState` and named actions; they do not need to know about storage
serialization or subscription internals. The persisted key remains
`mobile-reference-v1`, so valid existing user data is retained. Toasts stay
transient and are never restored from storage.

Cross-tab synchronization accepts only events for this store's localStorage area
and key (including clear). It rereads current storage rather than replaying a
possibly stale queued event value, and does not echo writes back to other tabs.
This is browser-local, last-write-wins persistence, not a multi-user database or a
transactional merge across simultaneous edits. Dealer instances sharing an origin
and storage keys need an explicit isolation design before such hosting is adopted.

Service request drafts keep their separate existing versioned serialization in
`service-requests.ts`. The template's enquiry forms save local drafts; they do not
send leads or claim successful delivery. Dealer personalization, verified contact
destinations, and a real submission integration require separate acceptance before
using this template for live enquiry intake.

## Maintained checks

Use the pinned dependency lockfile and Node 22.x:

```sh
npm ci
npm run check
npm start
```

`check` runs lint, strict source typechecking, every `tests/*.test.mjs` domain test,
and a production build. The test runner discovers files deterministically instead
of silently omitting new suites. `tsconfig.check.json` checks source independently
of stale generated route types. The Next production build still performs its own
framework and generated-route checks; those checks are not disabled.

With a preview running, install the supported browser binaries when needed and
run the current smoke/regression gate:

```sh
npx playwright install chromium webkit
npm run qa:architecture
```

The browser gate checks 320px, 390px and 1440px layouts, vehicle tabs, filter
application/cancellation, focus restoration, cross-tab saves, draft persistence,
Bulgarian preference, corrupt and denied storage, image loading, horizontal
overflow, and absence of application enquiry POSTs. It derives inventory counts
from the current catalog rather than hardcoding the original four captured cars.
`QA_URL` selects an already-running preview. `QA_ENGINE=chromium` or `webkit`
selects a subset, which must not be reported as a two-engine pass.

The latest report overwrites `.qa/architecture/report.json`; `QA_OUTPUT` can select
an explicit evidence directory. Generated build directories, reports and logs are
ignored. Keep useful failure evidence until it is understood, but do not commit
accumulating screenshot or build-output dumps as source.

## Historical reference tooling

Existing `qa:showroom`, native capture, parity, asset and reference-contract tools
are retained for their specific captured-reference contracts. Some historical
suites assert older inventory counts and labels and are not the current showroom
release gate. Do not restyle the app to satisfy an obsolete visual expectation.

Already-applied one-shot scripts that rewrote source/configuration during the
original reconstruction have been removed. Their exact contents remain in Git
history. Asset provenance, captured data, reusable capture helpers and real test
suites are preserved; deleting the scripts is not permission to delete their
required assets or replay old visual patches against the polished template.
