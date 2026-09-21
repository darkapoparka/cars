# Native localization adoption and release integration

Cars packaging version 2 preserves each template's native request handler, localized routes and rendered catalogs. Version 1's native-source rejection remains in place. Removing that rejection is not a migration.

## Supported native trios

| Design | Standard trio | Import trio | Build-time configuration |
| --- | --- | --- | --- |
| 1 | Auto Best at `/` | Auto Best at `/` | Existing native root application |
| 2 | Modern at `/variant-2` | Import at `/variant-2` | `NEXT_PUBLIC_BASE_PATH` / `TEMPLATE_BASE_PATH` |
| 3 | Carwow at `/variant-3` | Carwow at `/variant-3` | `DAY_LOCALE_BASE` |

Locale follows the design base. Modern retains `app/[locale]`, its request proxy, native `basePath`, catalogs and framework navigation. Cars binds documented configuration exports; it does not replace proxy logic, wrap translated HTML, force the default locale or rename the app tree. Unknown configuration shapes fail closed and must be reconciled upstream.

## Release evidence is a prerequisite, not a badge

`native-localization.mjs` requires exact repository/commit/source digest, complete declared EN/BG catalogs, viewport evidence for 320/390/1440, twelve named hashed checks and a matching READY deployment/public alias. A successful catalog parser checks declared parity and interpolation, not linguistic quality or total UI coverage. Every required review still needs real source, route, state and browser evidence.

Do not fill an acceptance record from key counts, screenshots, HTTP 200 or READY alone. Current template observations and rollout acceptance are recorded separately in the dated audit and named rollout matrix. An upstream security failure blocks promotion even when its ordinary language routes pass.

## Independent generation and existing sources

The independent generator captures workflow inputs, approved snapshots, exact revisions and prepared source hashes. Version 2 produces a sealed native package and rejects changes to those inputs before installation. Synthetic standard and Import fixtures exercise successful generation, not just rejection guards.

Existing Cars-canonical dealers use `refresh-client.mjs` with an explicit native locale configuration and reviewed bilingual dealer overlay. The overlay must target dealer-owned data/configuration/catalog boundaries. Brand assets are byte-preserved unless an exact hashed conflict has an explicit decision; template hero artwork cannot be replaced with dealer artwork. Overlay presence is not linguistic acceptance.

Refresh requires a registered source/repository match, clean dealer and committed workflow inputs, exact template releases, an unchanged candidate and a fresh verified rollback source/deployment/public alias receipt. The installer checks workflow/source/registry/release hashes again, preserves competing writes on rollback, and is idempotent. It does not publish or mark dealer browser QA complete. Independent Al Reef and ISAUTO's legacy CLI mapping must not be passed through this Cars-canonical path.

## Repeatable checks

```sh
node scripts/check-workflow.mjs
node --test --test-concurrency=1 scripts/*.test.mjs
node scripts/localization-preferences-audit.mjs --base-url https://cars-template-carwow.vercel.app/ --source-commit 17422cd3a31a9251da35f72d30c3111a6641e9ec --output runtime/localization-audit/carwow-preferences.json
```

The preference auditor never follows redirects or sends business requests. It requires all twelve normalized-return negatives and four valid save/dismiss form/JSON positives; it also validates host-only cookie attributes, bounded expiry and private/no-store responses. Use a new output path per run. For a native standalone template use no mount; a mounted template uses `--mount /variant-2` or `/variant-3`.

Al Reef intentionally owns **one shared root `/api/preferences` endpoint** for its accepted three-design implementation. Its mounted API paths must remain blocked. Run its existing HTTP/preferences/storage/races/journey suites and the root preference regression probe; do not misinterpret a 403 on `/variant-2/api/preferences` as permission to open another write endpoint.

## Publication and incomplete work

A refresh candidate is not a published release. Preserve each existing mirror-only fix, record rollback source/deployment/assets before changing a dealer, commit only reviewed source, publish once by its established route and verify the exact READY source and public alias before repeating EN/BG/security journeys. A failing release stops the batch.

Additional languages remain hidden; Admin remains a separate English-only destination. Country preferences do not change dealer identity, inventory currency, stock, contact details or artwork. Real enquiry, database, AI, CRM, payment and notification writes stay disabled.

The 21 September integration tests are synthetic workflow acceptance, not full real-template trio acceptance. Modern and Import's normalized-return failures and Auto Best's unpublished native source currently prevent promotion and the Navara/fleet rollout. Carwow's successful targeted checks do not bless an incomplete trio. Al Reef's narrow security reconciliation must preserve its already accepted Phase 2 work rather than regenerate it.

An optional additional template-promotion rollback prototype was **not integrated** after its new test-file write was blocked by a tool safety-status error. The untested helper was moved out of active workflow source into ignored runtime. Do not execute `runtime/localization-resume-20260921/wire-template-install.mjs` or treat the prototype as accepted work. Existing promotion protections remain unchanged by that prototype.
