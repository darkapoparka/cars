# Source-content repairs — session 03

Date: 2026-09-09. Repository: `darkapoparka/cars`. Branch: `codex/astra-bg-03` only. Original campaign base: `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`.

## Actual state

All five assigned dealers now have Auto Best, full-workspace Modern and Carwow application source in their existing client folders. Those application-copy/core-personalization commits were already present or arrived concurrently during this correction pass; they were preserved, not recreated or claimed as work performed by this pass. See REPORT.md and the existing CLIENT.md / REVIEW.md records for their provenance. This pass changes actual source consumers, not only briefs.

All five outcomes remain **in-progress**, not verified-local or owner-approved. The real vehicle-photo galleries are not bundled; existing explicit unavailable-image tiles remain. A wider supporting/legacy-page sweep is still unfinished. The corrections and isolated tests below do not establish full application build, visual fidelity, working routes, real inventory or enquiry delivery.

## Published correction checkpoints

| Dealer | Application source fixes |
| --- | --- |
| СЪНИ / sunny-varna | `a4431101d8a28a41849baded42504d5972138a4f` (Auto Best), `f176d3c1442ffc8f3765f50dec3069770df4c8a6` (Modern / Carwow phone), `a5898ca3ade0e3c0dd01f35659bf4e09bd1de008` (Carwow about / metadata) |
| R.Q.S. / rqs-auto-team | `05a2c8b03eaf18e4148a10b2696dca273bd4db57` |
| ЕВРОКАР ВАРНА 09 / evrocar-varna-09 | `d56773d9f73515b480619804668c1bf3eaa9e275` |
| Спринт ауто / sprint-auto-varna | `570e888ef2e8e0d8e07e6aaf05d5aed1d6ee73da` |
| Европа / europa-varna | `ea89dc95e93c971e0577c771fc096cea0841c02c` |

This final checkpoint additionally corrects the numeric-price field in all five Carwow SEO helpers and adds the executed regression harness/result. Its final commit is intentionally not self-referential; verify the assigned branch ref after publication.

Twelve source consumers per dealer were corrected (60 distinct application files across the five dealers): four Auto Best about/contact/hero components, two Modern desktop/mobile contact files, and six Carwow about/SEO/site files. Existing component markup, sections, styles and routes were retained, apart from narrow logo-fitting presentation. Some files were normalized from CRLF to LF, notably DesktopAboutPage.svelte; large line diffs are not a claimed redesign. Visual fidelity has not been browser-verified.

The changes remove inherited business identity from those consumers, use each dealer's local identity assets, replace unrelated premises imagery with explicitly illustrative brand scenes, remove old social destinations, and replace unsupported services/verification/finance promises with accurate questions and demo limitations. Modern's prepared-vehicle handoff explicitly says that details have not been sent. Carwow's 21 metadata route/alias definitions and sitemap flags are retained, with dealer-specific text and preview noindex metadata.

Carwow phone compatibility: old consumers add +359 after dropping an initial 0, so `daynightSite.phone` must remain a national number. The explicit `phoneHref` remains the dealer's E164 tel URL. A later inspection caught a mistake in the initial SEO change: `Car.priceEur` is display text, while `Car.price` is numeric. The final tested helper formats `price`, uses 'Цена при запитване' for absent/invalid/non-positive values, and never parses display text as a different currency.

## Preservation and scope checks

Each published checkpoint used a fresh full root tree and a non-force branch update followed by a ref readback. Two non-force rejections during concurrent activity were handled by inspecting new commits and replaying only unchanged owned paths; no force update was used. The concurrent Sprint, Europa and report commits were preserved.

Before applying generic source deltas to each additional dealer, the existing Auto Best components tree, Carwow components/server trees and the three individual Modern/site blobs were matched to the exact pre-repair baseline. Dealer data, stock, public assets, colors and other app files were not copied from Sunny. The matching baseline trees were `c6e059049a3df247a5e6f706056b8551cca5aadd` (Auto Best components), `d56239b4006d6dafd0a1ec5ef3538c750e3bb4dd` (Carwow components), and `e38a483bf949b8ec562634739d70ec1e95b2d7c0` (Carwow server). Modern was patched by individual file, not by replacing the differing app tree.

GitHub compare `8d77be1411535f5fd73016b635040b8037086810...a4431101d8a28a41849baded42504d5972138a4f` returned four modified Sunny source files. Compare `95e84730a82a07883291f03d73bd45806f017336...ea89dc95e93c971e0577c771fc096cea0841c02c` returned six commits and 56 modified application files, all within the five assigned client folders. No files were deleted by these corrections. The final price/test checkpoint must be compared separately after publication.

## Executed checks — narrow scope

Three real TypeScript module snapshots were materialized in an isolated cloud directory at `/mnt/data/cars-content-checks/carwow`. Existing site/routes snapshots were checked against their remote Git blob hashes. The tested corrected SEO blob and test script were then created through GitHub and their returned hashes matched the tested local bytes.

Executed command (working directory independent of the owner's machine):

```sh
TYPESCRIPT_PATH=/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js \
  node /mnt/data/cars-content-checks/scripts/content-contracts.cjs
```

Runtime: Node v22.16.0; TypeScript 5.8.3. Exit code: **0**. Result: **15 grouped checks passed, 0 failed**, using five explicit dealer-name/phone fixtures. Checks cover national/E164 compatibility, imported identity, 21 route/alias definitions, dealer-specific metadata and numeric EUR / unavailable-price behavior. Positive price inputs: 1699, 10000, 1.99. Invalid/unknown inputs: null, undefined, NaN, Infinity, zero, negative, and numeric-looking display text. These are test fixtures, not added advertised stock or independent dealer verification.

An intentional local-only negative control changed the helper back to the wrong display-price field. Exactly five price-test groups failed (exit 1), as expected; the candidate was restored immediately and rerun successfully (15/0, exit 0). No mutated source was published.

The emitted result is `content-contracts.result.json`. Harness: `clients/sunny-varna/scripts/content-contracts.cjs`, Git blob `33419f1d052514c4be8434d34e67b5ef673d0ee5`. Tested source blobs:

- daynight-site.ts: `712061d4cdc98e1491f48485aea6be31e9919cde`
- public-routes.ts: `fe9bb90f7f22a2eaa55ea97dbe0ca745827b1cfe`
- daynight-seo.ts: `bea2d2f351a06336cba5e97e95fa48e335dbddf9`

Reproduce after installing a Carwow copy's retained dependencies, from the Cars root:

```sh
node clients/sunny-varna/scripts/content-contracts.cjs clients/sunny-varna/carwow
# The optional final path may instead point at another assigned Carwow copy.
```

This is TypeScript transpilation and isolated module execution with fixture imports, **not** full application typechecking, Svelte compilation, lockfile installation, Auto Best validation, Modern Prisma/web build, Carwow framework build, or browser testing. All of those broader checks and 320/390/1440px route/interaction reviews remain unexecuted by this pass. No QA or owner-review flag was promoted.

## Coordinator handoff

Fetch `codex/astra-bg-03` without resetting or switching the shared dirty checkout. Inspect the actual source changes and the existing per-client REVIEW.md files, beginning with Sunny. Expected launcher entries remain Auto Best `/`, Modern `/cars`, Carwow `/`; these are not verified running URLs. None of these five dealers is represented as a fully finished, runtime-verified demo. No deployment, shared-origin/FAB integration, external enquiry, Windows checkout edit, background job, master-template change or private-record update was performed by this pass.
