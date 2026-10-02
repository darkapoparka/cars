# Public dealer asset pipeline

## Scope and ownership

The existing source, template release, dealer refresh and publishing workflows remain authoritative. This is an opt-in post-build step in `scripts/package-shared-media.mjs`, not a replacement generator. It changes the derived public asset payload only. It does not edit template UI, dealer source, inventory, source receipts, release locks, Vercel projects, billing, DNS or independent Al Reef source.

The current fleet has four offered designs: Auto Best, Modern, Carwow and App. Outletcars and PromoSale use Import instead of Modern. Mobile and Boxcar remain separate candidates; asset support for an extra manifest entry does not approve a fifth design or add its application build, personalization or release integration.

## One media pool per dealer

`public-asset-bundle.mjs` scans an assembled public build, binds it to a SHA-256 file manifest, and stores each duplicated supported binary media object once at `/_cars/media/<dealer>/<sha256>.<extension>`. Four design URLs can resolve to one physical output object. The same filename with different bytes remains a different object. Dealer namespaces remain separate.

Original URLs of pooled media receive exact Cloudflare static-asset 200 rewrites. Unique artwork stays at its existing path, avoiding unnecessary rules. These preserve mounted paths and do not require a JavaScript Worker or an extra browser redirect. JavaScript, CSS and SVG retain their original paths, because relative imports and references can be significant. No lossy image conversion occurs here. Responsive image generation is a separate publication step.

This backward-compatible URL bridge reduces package duplication, not necessarily browser downloads across different legacy URL aliases. A later template data-contract update should reference immutable media URLs directly and reduce the alias count. The existing Vercel shared-media catalog is not deleted, overwritten or disabled. Shared artwork across different dealers still needs an explicit provider-neutral storage target and asset lifecycle policy.

## Guarded publication

The compiler rejects unsafe paths, links/junctions, case collisions, private/build-code paths, undeclared design mounts, existing outputs, input/output overlap, conflicting routing rules, excessive alias/file counts, and oversized individual files. Every generated object and alias is verified against the input hash. Input content is checked before and after copying. Failed outputs are marked separately; source files are never pruned.

Generation prompt documents block publication unless an exact-path, exact-hash exclusion review supplies a concrete reason. Unknown media is retained until its use has been checked. Do not delete a folder simply because its name contains `reference`, `old` or `admin`. Licenses and required notices remain preserved. Automatic removal based only on textual grep is not a runtime dependency proof.

The initial alias budget is 1,900, leaving room below Cloudflare's 2,000 static-rule ceiling. Static-file and individual-file limits are checked independently. A fifth design or large stock inventory must pass the resulting budgets; exceeding them is a release hold, not permission to omit media.

## Reproduce locally

Provide an already assembled public directory, not a repository, `node_modules`, or a Worker server bundle. The caller remains responsible for building and combining the selected designs at their existing mounts. The output parent must exist and the output directory must be new.

```powershell
node scripts/package-shared-media.mjs --local-assets --client priselci --input <assembled-public-directory> --manifest <dealer.json> --out runtime/<new-output> --exclusions <review.json>
# Review the dry-run summary, then repeat with --write.
node scripts/verify-public-assets-http.mjs runtime/<new-output> http://127.0.0.1:<asset-preview-port> runtime/<http-report.json>
node --test scripts/public-asset-bundle.test.mjs scripts/shared-media.test.mjs scripts/storage-assets.test.mjs
node scripts/check-workflow.mjs
node --test --test-concurrency=1 scripts/*.test.mjs
```

A local Wrangler assets-only preview should point `assets.directory` at `<new-output>/public`, use `not_found_handling: none`, and have no `main` Worker entry. Keep the source receipt outside the public directory. `verify-public-assets-http.mjs` exhaustively checks legacy asset URLs, bytes, representative query/HEAD behavior, immutable-object caching and missing-file 404s. It deliberately accepts only a localhost target.

## Separate acceptance gates

A correct asset-only payload does **not** make dynamic page rendering compatible with Workers Free. This tool does not prerender HTML, move cookie/header-dependent preferences into the browser, change catalogue filtering or replace application routing. The Modern/App request-rendering work and Svelte server-load adaptation remain separate implementation tasks.

The reviewed asset pilot uses the existing September 30 publishing snapshot to isolate packaging behavior while template UI is under active development. Its results cannot be relabeled as acceptance of newer UI commits. The latest templates must be source-reviewed and released, dealer refresh must preserve each client's customizations, and new exact packages must pass mounted EN/BG browser checks before publication.

For a fifth design, keep the current four routes and identities stable. Add only an explicitly selected and integrated family. The asset planner accepts explicit variant mounts without assuming a fixed number, but the application publisher's existing App/version-3 validations intentionally remain in place until a separately reviewed version supports the new family.

For fleet adoption: reconcile active source writers; commit reviewed tooling and UI; approve exact template releases; preserve each dealer's assets/configuration and independent ownership; build Modern and Import pilot configurations; run asset and application checks; publish a small wave; then refresh the remaining dealers. No bulk publish is authorized by this document.


## Default Svelte template output retention

Auto Best, Carwow and Import now wrap their existing production adapters with `withRetainedPublicAssets`. Normal framework builds apply the template-local `public-assets.policy.json`; no separate opt-in command is needed for this unused-output cleanup. The shared-media pool above remains a separate publication stage.

The maintained engine is `scripts/publishing/public-asset-retention.mjs`. Each Svelte master carries a byte-identical standalone copy under `scripts/`, so extracted immutable releases and dealer copies do not depend on the parent Cars checkout. `scripts/public-asset-retention.test.mjs` rejects copy drift.

Policies nominate exact path/hash pairs, not wildcard deletions. Before omitting a copied output file the adapter checks all current source consumers, public HTML/CSS/SVG/manifest dependencies, server-read assets, computed directory prefixes, extensionless responsive-image inputs, alternative formats, and explicit dynamic/fallback prefixes. Changed dealer artwork is always retained. Unknown assets are retained. Source changes during adaptation reject the build. Licensing and notices cannot be nominated for removal.

Only files copied into the adapter's public output are removed; canonical `static/` originals, source, development previews, receipts and Git history remain intact. Thus the reusable design library does not have to be replicated into every production output. This does not introduce a new icon library or rasterize legitimate SVG interface/manufacturer icons.

The initial browser pass caught computed desktop video thumbnails and responsive commerce banners. Guards now retain those families; regression tests cover both transformations. A text search alone is not acceptance. Browser verification must serve assets from the emitted adapter directory, never fall back to source originals, and exercise mobile/desktop and EN/BG routes, vehicle links and direct reloads. A Vite preview by itself can serve the untrimmed intermediate client directory and does not prove this condition.

Build receipts are written outside the public directory at `.svelte-kit/cars-public-assets/retention.json`, naming the selected and retained candidates, copied destinations, bytes and source/policy digests. Compare `.svelte-kit/output/client` with the actual adapter public output from that same build, not a historical dealer snapshot.

The release lock and existing dealer variants are unchanged. Exact-source release approval and preservation-aware fleet refresh remain required; independently owned Al Reef must not be overwritten. Next-based Modern/App and candidate Mobile/Boxcar do not inherit this Svelte adapter automatically. This asset change makes no claim about request-rendering CPU or the Vercel billing meter.

Reproduce the emitted-asset browser gate with the template's own installed Playwright package:

```powershell
# Build the selected template, then start its production preview on a free port.
node scripts/verify-template-assets-browser.mjs carwow http://127.0.0.1:8963 L:/CODEX/cars/templates/carwow L:/CODEX/cars/runtime/retention-browser-new
```

The browser tool requires a new report directory outside the template. It checks viewport-intersecting images (not intentionally unloaded horizontal-carousel slides), language, headings, overflow, actual vehicle clicks, direct reloads, Back navigation, and failed asset requests across 320/390/1440px in EN/BG. Run families sequentially on an occupied development workstation; concurrent browsers/builds can exhaust memory and invalidate results. Do not classify an operating-system allocation failure as an application regression or silently count it as a pass.
