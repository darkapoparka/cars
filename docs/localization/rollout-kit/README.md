# Cars localization adoption kit

**Status: stored implementation candidate; NOT integrated into templates or deployed applications.**

Repository location: `darkapoparka/cars`, `main`, `docs/localization/rollout-kit/`.
Local location: `J:/cars/docs/localization/rollout-kit/`.
Execute the current repository prompt at `docs/prompts/LOCALIZATION-ROLLOUT.md`.
No attachment or download is needed. Historical receipts below describe the original candidate run.

Prepared 20 September 2026 for the existing Cars dealer portfolio. This directory is a review artifact, not a replacement repository, application clone, or template release. It does not change any live site merely by being downloaded or extracted.

## What actually exists today

Al Reef has the verified native English/Bulgarian experience across Auto Best, Modern and Carwow. The other 24 registered dealer projects have not received that shared experience. The current live entry audit checked 150 explicit language URLs and 75 existing unprefixed entries. All 75 old entries returned HTTP 200; only Al Reef's six language entries met the tested status/language/SSR-marker contract. This is entry-level evidence, not a fresh full browser certification.

Two dealers, `outletcars-varna` and `promosale-varna`, use **Import** as Design 2. The portfolio therefore needs four reusable template integrations, while each dealer still offers only its existing three designs. Do not replace their Import design with Modern.

The original candidate-preparation session reported a safety-status error and made no application changes. That historical report does not describe this later successful repository-storage operation. Recheck current access before implementation; do not bypass any actual current denial.

## Implemented candidate code

`src/policy.ts` contains the framework-neutral routing, immutable dealer configuration, request-local locale resolution and bounded preference endpoint implementation. It separates dealer identity, country and stock currency from the visitor's language and country preference. It preserves native design mounts, query strings and anchors, validates return destinations, and rejects cross-origin and invalid preference requests. Cookies remain host-only, Path=/, HttpOnly, SameSite=Lax and Secure on HTTPS. A dismissal does not accept a language or country.

`config/al-reef.json` is the pilot configuration. No Al Reef name, UAE country or AED currency is built into the generic policy. Other dealers must supply their reviewed facts explicitly.

The language registry contains metadata for en, bg, ar, de, uk, tr, ro and el. **Metadata is not a translated site.** Only en/bg are enabled in the pilot configuration, and the candidate emitter explicitly refuses to enable the other languages against the current pilot catalog/UI adapters.

`tools/catalog-audit.mjs` validates reviewed source keys, duplicate keys, missing text and interpolation parameters, and exports translation review packets. Missing translations stay blank rather than becoming English fallbacks. Its output explicitly does not establish linguistic review or browser acceptance. It does not make machine-translation calls or mutate rendered DOM.

`tools/build-core.mjs` produces the single-file `candidate/alreef-core.ts` with the pilot's existing public API and public/server split. This lets the existing FAB extraction boundary remain compatible. The authored policy, configuration and emitter need clear ownership when adopted; do not maintain the generated candidate as a second handwritten policy.

`tools/build-patch.mjs` creates a deterministic **review patch** and expected-source hash manifest. It never applies the patch or accesses the user's computer.

## Verify the kit

Use Node 22.16+ and TypeScript 5.8.3, as pinned in package.json. The tests here used Node 22.16.0 and TypeScript 5.8.3. Installing the pinned development dependency requires npm access; no additional runtime library is required by the policy.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run check
```

`npm run check` builds the portable policy, emits and typechecks the candidate, compiles the unchanged reference, regenerates the review patch, verifies generated drift, and runs the tests serially. With a suitable TypeScript compiler already available, `npm run check` needs no dependency download. `npm test` alone consumes the included compiled artifacts and does not establish that later source edits were rebuilt.

Final result: **113 passing tests, zero failures, zero skips**. One differential test contains 4,050 valid-resolution comparisons with the exact recorded deployed policy. Those are not 4,050 separately counted tests. A VM test executes the FAB's public prefix without Request, Response or cookie access. The generated patch was also applied successfully to a tiny isolated single-file fixture and its bytes matched the generated candidate.

The candidate retains strict TypeScript, noUncheckedIndexedAccess and exactOptionalPropertyTypes. The unchanged historical reference is compiled with noUncheckedIndexedAccess=false, matching its pre-existing indexing assumptions; it is comparison input, not new implementation. The initial failed reference-build attempt is retained in `evidence/reference-build-first-attempt.txt`, separately from the successful final run.

## Review and integration, not automatic installation

The patch targets `darkapoparka/cars-alreefusedcars`, main, based on `41ddc34893a8cfcf0219d80a248aead5fbc0c435`. The expected old `localization/core.ts` SHA-256 is:

```
9b6d9abc2fc7d5019e275cf6082e2e58d5814f118e45ee0460e4c3abd3e2581d
```

The current candidate SHA-256 and patch hash are in `candidate/change-manifest.json`. A mismatch with current source requires a reviewed merge, not replacement or reset. The patch changes only the core file; successful patch application is NOT application acceptance.

Before an authorized integration: read current repository instructions, inspect ownership and Git state, review the full diff, resolve the source-write tool issue without bypassing it, and establish where the authored generic policy/configuration/emitter live. Then integrate through the current source architecture, regenerate the three native mirrors and FAB with the existing `npm run locales:sync`, and run all framework checks, production builds and browser matrices. Stop on regressions. Publish only reviewed main changes through the existing project and verify the precise live source.

## What this does not finish

This stored candidate does not integrate four standalone template masters, translate additional languages, provide Arabic RTL layouts, replace the generator's incompatible legacy mount transform, update approved template pins, reconcile dealer-specific source changes, or deploy the portfolio. Existing Al Reef UI components and shared messages still contain dealer-specific facts that must become configuration/presentation boundaries during extraction. Do not copy its facts into another dealer.

The 113 isolated tests are not Svelte/Next builds or proof of hydration, dialogs, geometry, complete linguistic quality, every browser, or Vercel cache behavior. The fresh 21-test Al Reef receipt covers its **unchanged** source, not this candidate. Application and production acceptance must follow integration.

Retain real business-write blocking, approved raster assets, original heroes and compositions, and the honestly English-only separate Admin demo. Preference persistence is distinct from analytics/marketing consent; adding this selector is not a general consent implementation.

## Delivery map

- `NEXT-SESSION.md`: paste-ready implementation and rollout request, with current source identities and named scope.
- `evidence/fleet-audit.json`: normalized fresh GET audit for all 25 registered dealer projects.
- `evidence/unchanged-pilot-checks.json`: current unchanged-Al-Reef guard and 21-test result.
- `evidence/final-check.json` and `final-check.txt`: isolated implementation test receipt and detailed results.
- `candidate/change-manifest.json` and `alreef-core.patch`: candidate provenance and unapplied patch.
- `evidence/original-core.ts`: exact original source used for compatibility comparison, with recorded hash.

## Primary implementation references

The existing pilot and these decisions were checked against SvelteKit request-local context guidance, Vercel country-header documentation and W3C directionality guidance. These are design references, not proof of an application release:

- https://svelte.dev/docs/kit/state-management
- https://vercel.com/docs/headers/request-headers
- https://www.w3.org/International/questions/qa-html-dir

IP-derived country is approximate and should be offered as a suggestion, never an identity or authorization signal. Explicit URL language must not be overridden by that suggestion. Arabic needs actual translations and bidi/RTL presentation acceptance, not only a registry entry or `dir` flag.

## 21 September 2026 normalization correction

The stored policy now rejects protocol-relative pathnames created by WHATWG dot-segment normalization, not only unsafe raw input. The candidate core, compiled mirror and exact-base patch were regenerated together. The added normalized-return regressions and the complete kit check passed **125 tests**. Earlier `evidence/final-check*` files remain historical receipts for the earlier candidate, not acceptance of this correction.

Current application rollout observations live in `../adoption-2026-09-21/TEMPLATE-AUDIT.json`; native Cars packaging and its limits are documented in `../NATIVE-ADOPTION.md`. This kit is still not automatic template approval or a complete portfolio rollout. The checksum manifest includes the new regression file and updated source/candidate hashes.
