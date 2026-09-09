# Independent branding and data repairs — 2026-09-09

Branch only: `codex/astra-bg-03`. This continuation began at `d853ae36428f250821661a8f3b5ab0b4cb802930`. Current published main was read as `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`; it was not modified.

## Published branding checkpoint

`0338e32623a058319a5c8217b3bb38994347dd9d` changes 30 paths, all under `clients/sunny-varna/`. It integrates the visually inspected published black/lime СЪНИ identity across all three apps, preserves the original source PNG, exports matching outlined logos and icons, and repairs Carwow's legacy local logo/social-image asset paths. See `clients/sunny-varna/BRANDING.md` and per-app brand provenance. There was no successful ImageGen output used in that checkpoint.

## Independent source repairs in this checkpoint

Applied first to СЪНИ, without changing the existing application compositions:

1. Modern `packages/marketplace/mock-directory.ts`: the retained directory eagerly requested `am-1009` and other source-template IDs, while personalized listings use actual source IDs. Its old helper throws when these IDs are absent. The replacement consumes the assigned dealer and actual sample rows, tolerates missing image/ID values, and provides only that dealer's profile. It removes the synthetic multi-business directory, supplier/verification claims and unsupported live-local stock counts. Existing export names remain; the scale helper is deliberately bounded to this one account in the client demo.
2. Carwow `src/lib/server/home-page-data.ts`: replaces the previous dealer's featured IDs and stops silently excluding all eight records merely because photographs are unavailable. Six actual sample records can now populate the existing mobile cards, retaining their explicit missing-photo state. Passed empty inventory stays empty, and budget/count contracts remain intact.
3. Carwow `src/lib/components/home/HomePageHead.svelte`: uses the imported dealer for default title/description/brand metadata, keeps previews noindex, and stops calling an SVG logo a 1200 × 630 PNG.

These repairs do not constitute a complete supporting-page/content sweep. They do not add real photo galleries or validate a live inventory feed.

## Executed checks

26 passed, zero failed: isolated TypeScript-transpiled module tests with explicit fixtures plus static assertions on the head component. Node 22.16.0; TypeScript 5.8.3. The directory schema is stubbed in this harness; full Zod validation, package typechecking, Svelte compilation, installation, framework builds and browser QA were NOT executed. Dealer-named test cases exercise the same generic modules with fixtures, not five independently launched applications.

The committed result identifies the exact tested source blobs, which match the GitHub upload responses:

- home-page-data.ts: `4f909e5128145e15b241a5b46cf72923ea8e42e6`
- mock-directory.ts: `8fbfecdaab3563fca2af421dc3f21847f1879574`
- HomePageHead.svelte: `959b773077752ffe5ec24f9d41358eef7b2d0fe3`

After the retained dependencies are installed, reproduce the limited tests from the Cars root with:

`node clients/sunny-varna/scripts/runtime-data-contracts.cjs clients/sunny-varna`

`TYPESCRIPT_PATH` can select an already installed compiler. The executed cloud harness used `SOURCE_FIXTURE_ROOT=/mnt/data/cars-bg03-independent-fixes` and the installed TypeScript path, exit 0. It did not install packages or run a server.

## Scope and remaining work

A read-only source audit examined 865 unique blobs across the existing СЪНИ trio. Public marketplace pages and logo references were read without authentication or dealership contact. A remote in-memory Auto Best transformation command was blocked by the tool before any edits were applied; that process was sent `.exit`, and the blocked command was not retried or routed around. No client files, checkouts, branches or servers were created on the Windows machine. Subsequent independent branding/source objects are committed through the connected GitHub actions.

All five dealer outcomes remain **in-progress**. Remaining essentials include the full inherited-content sweep, correctly sourced/permitted local real-vehicle galleries, appropriate remaining logo refreshes, and full install/build/route/viewport checks. The Auto Best TrustActions and home/about/listing metadata changes from the blocked operation were not applied. No manual-review or application-QA flag is marked complete. The owner's coordinator should fetch this branch and inspect СЪНИ first as an in-progress source checkpoint, not a finished dealer demo.
