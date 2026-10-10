# Ten UK dealer proposals on Cloudflare — 10 October 2026

The owner requested ten saved UK leads, each with Auto Best, Modern, Import, App, Mobile and Signature, hosted on Cloudflare. The recovered current shortlist is the ten-dealer set in [the build manifest](../leads/uk-2026-10-10-build-manifest.json). It supersedes the earlier research shortlist pasted into the conversation. The owner explicitly chose Workers Free; no paid upgrade is authorized.

## Current delivery checkpoint

As of 10 October, 10:10 UTC:

- All ten dated business, stock, logo, icon and locale packs pass input validation. They contain 71 sourced listing samples with real advertised GBP prices and original mileage.
- All six exact approved template versions passed Cloudflare production compilation and frozen dependency qualification on GitHub Actions.
- Ten private publishing repositories exist on `main`. They currently contain the GitHub initialization README; actual package exports are still pending. [Verified repository inventory](qa/uk-publishing-repositories-2026-10-10.json).
- The first canonical dealer source run stopped before committing because the approved Signature version used different contact and discovery boundaries. The narrowly scoped compatibility fix passed the complete pinned Signature adapter against all ten actual packs, including contacts, stock, GBP filters, disclosure text, TypeScript and Svelte checks.
- No complete branded UK origin has been deployed or accepted yet. Template compilation, source personalization, private export, upload, hosted behavior and Free CPU qualification remain distinct evidence.

Broadbent is the first complete six-design dealer pilot. The remaining nine use the same reviewed source creation and publishing workflow once the pilot establishes the necessary behavior.

## Dealer inputs

| Dealer | Location | Retained listing samples |
| --- | --- | ---: |
| Broadbent Car and Servicing | Stockport | 10 |
| Motors Castle | Motherwell | 8 |
| Trade Car Sales | Birmingham, Grasmere Road | 10 |
| Square One Motors | Birmingham | 7 |
| Car Market Yorkshire | Dewsbury | 6 |
| S A Motors | Nottingham | 5 |
| AS Motor Group | Batley | 5 |
| Cherry Tree Cars Ltd | Bradford | 8 |
| Norton Grange Trade Cars | Stockton-on-Tees | 10 |
| North Norfolk Car Sales | North Walsham | 2 |

The [retained stock research](../leads/uk-2026-10-10-stock-research.json) and individual [brief packs](../leads/uk-2026-10-10-briefs/README.md) distinguish listing facts observed on 10 October from a live stock feed. Availability is unconfirmed. Incomplete or conflicting records were excluded; unknown prices or mileage were not converted to zero.

Vehicle images are generated category illustrations, explicitly labelled “Illustration — not the advertised vehicle”. Each pack retains source URLs, observation dates, image provenance and the inventory disclosure. No third-party listing photographs are presented as licensed dealer assets. Published condition caveats remain in the applicable descriptions.

Branding uses retained public identity where available and clearly recorded design proposals otherwise. Every dealer has a raster logo contract, a real square PNG app icon and a valid multi-size ICO. [Brand research](qa/uk-branding-visual-research-2026-10-10.md) records the observed identities and proposal decisions. Dealer approval and application visual acceptance have not been inferred from asset generation.

## Approved design versions and Cloudflare qualification

[Exact six-design release selection](qa/uk-approved-six-selection-2026-10-10.json) binds the revisions, source trees, digests and approval evidence. Ongoing edits to template masters do not silently change this batch.

| Design | Approved source | Successful qualification run |
| --- | --- | --- |
| Auto Best | `2afd974c23d4f4cfb290ed99a00f46074793be3a` | [38041380562](https://github.com/darkapoparka/cars/actions/runs/38041380562) |
| Modern | `827d75b9a53666c6feb09f04e3f8e7f255e95a30` | [38043025503](https://github.com/darkapoparka/cars/actions/runs/38043025503) |
| Import | `a51f329b0b9e8e4d21665e16abf2734505d02e07` | [38041380562](https://github.com/darkapoparka/cars/actions/runs/38041380562) |
| App | `70c2b80671e217ab299549a938a537c0b9559611` | [38041380562](https://github.com/darkapoparka/cars/actions/runs/38041380562) |
| Mobile | `876590474d01178413feccf3153a0859230158a1` | [38041380562](https://github.com/darkapoparka/cars/actions/runs/38041380562) |
| Signature | `cc130e432a41a3a60cc80bc2b3461c6416893b4a` | [38042594609](https://github.com/darkapoparka/cars/actions/runs/38042594609) |

The initial combined run had four successful families. Modern and Signature passed subsequent targeted runs. The publisher consumes only the verified successful family receipts and their frozen locks; the overall conclusion of the initial mixed run is not substituted for individual evidence.

The provider fixes preserve the approved application sources. Modern uses the exact reviewed workerd build permission and the typography plugin version already present in its approved lock. Svelte npm caches are outside sealed source directories. The portable npm resolver supports the declared GitHub runner toolchains. Next deployments use the emitted `dist/server/wrangler.json`, with verified relative entry and asset paths.

Compilation proves that the applications build for Cloudflare. It does not establish hosted UI acceptance or reliable operation within Free CPU limits.

## Source creation, packaging and export

Canonical editable source stays in `darkapoparka/cars`, under `clients/<slug>/`. There is one authorized local Cars checkout at `L:\CODEX\cars`; independent dealer source materialization and dependency builds run on ephemeral GitHub runners.

The manual `build-uk-dealers` workflow reuses the existing new-client planner and creation tool, all six family adapters, native localization adoption and source seals. It commits only the selected dealer prefix to Cars `main`. Existing unrelated work is preserved, source pins and pack digests are checked again, and there is no force push. A failed source candidate receives a failure artifact instead of a false success receipt.

The first run, [38043022224](https://github.com/darkapoparka/cars/actions/runs/38043022224), copied all six approved sources but failed during Signature personalization. It created no canonical source commit. The contact correction recognizes the exact approved responsive component and hides unpublished rows at phone and tablet widths. The discovery correction supports the approved inline catalog while retaining genuine mandatory price/year facts, original body types and real filtering behavior. Newer catalog-shaped sources retain their existing path; unknown source shapes still fail.

The manual `build-uk-cloudflare` workflow prepares one sealed package from committed dealer source, using the existing `package-dealer` provider path. All six applications and the router compile from that identical package tree. Share images use the retained approved rendering toolchain. No Cloudflare credentials enter GitHub Actions.

A thin Git bundle transports the package tree with its canonical source commit as a prerequisite. The local exporter verifies the retained blobs directly, using an isolated index and the existing private repository reconciliation. This avoids another complete source directory on the PC. Transport ancestry is not published into dealer repositories. Each compiled target is downloaded and deployed separately, retaining its hash inventory and actual deployment receipt.

The six-source set measured 1,661,899,116 bytes before dependencies. Ten complete local copies would exceed 16 GB. [Storage accounting](qa/uk-source-storage-2026-10-10.json) and [the 60 exact sparse exclusions](qa/uk-2026-10-10-sparse-exclusions.txt) retain local metadata while keeping the new family trees off disk. No pre-existing caches or unrelated projects are removed.

## Public routing and UK behavior

Each dealer has one public origin in the connected `darkapoparka1.workers.dev` subdomain, named `cars-uk-<slug>`, with six internal application Workers.

| Design | Public route |
| --- | --- |
| Auto Best | `/` |
| Modern | `/variant-2/cars` |
| Import | `/variant-3/` |
| App | `/variant-4/` |
| Mobile | `/variant-5/` |
| Signature | `/variant-6/` |

The public router preserves request paths, query strings, methods, cookies and mount boundaries through service bindings. Internal applications have `workers_dev: false`. The design selector lists each family once; the established shared Admin demonstration remains a separate destination. Existing Vercel sites and historical Cloudflare Priselci deployments are outside this batch.

Dealer country is GB, currency GBP, display locale en-GB and distance miles. Native source catalogs retain the required en/bg contract with English as default. A visitor's location does not change the dealer's actual currency, distance facts or business country. Original mileage is retained even when an application needs canonical kilometres for internal comparisons; filter bounds use matching conversions.

Published contact information is used without inventing missing details. Preview forms must not claim an enquiry was delivered, finance approved or CRM connected. The planned hosted review covers home, stock, details, search, filters, gallery, navigation, contact actions, honest form states, direct reloads, images, icons and the six-design selector at phone and desktop widths.

## Workers Free qualification

The account has four historical Priselci Workers and two framework qualification Workers. The ten six-family origins would add seventy Workers, within the Free account count limit. Asset and CPU limits still require actual measured outputs and requests; upload success alone is insufficient.

Two earlier framework qualifications were hosted with the existing Wrangler OAuth session:

- Auto Best: `cars-cf-qualification-auto-best`, version `451c0cf6-6e1a-4f95-bcd8-7d03cbb7d791`. Nineteen hosted HTTP checks passed across locale, catalogue/filter, detail, contact, robots, 404 and imagery.
- Mobile: `cars-cf-qualification-mobile`, corrected version `ff5a4997-4912-4ba0-be73-ebe6cf32b7d5`. Seventeen hosted checks passed; all 23 distinct rendered image URLs passed production checks. Browser inspection verified loaded images, no horizontal overflow and the saved-car interaction.

Both use template inventory and identity. They are not branded UK delivery.

Auto Best's retained CPU sample had ten complete matched invocations: median 8 ms and maximum 55 ms, with four above 10 ms; all outcomes were `ok`. Mobile had eleven complete matched invocations: median 16 ms and maximum 69 ms, with eight above 10 ms; all outcomes were `ok`. Incomplete tail data was excluded, wall time was not treated as CPU, and isolate coldness was not established. These samples do not qualify either final dealer implementation for sustained Free operation.

Cloudflare documents a 10 ms Free CPU allowance and flexibility for infrequent overruns before consistent excess is terminated. See [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) and [asset billing and limits](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/). The real personalized six-family pilot must be measured, with early attention to Modern and Import. The older Modern pilot's CPU errors remain historical evidence, not a verdict on the new package.

The source audit found request-dependent behavior in all six families. An unchanged-source complete static export was not established. A static conversion would need to preserve routes, filters, preferences and other interactions and receive separate qualification. If actual six-family SSR repeatedly exceeds Free, the next decision must be based on those observed results. [Workers Paid pricing](https://developers.cloudflare.com/workers/platform/pricing/) lists an account minimum of $5/month plus applicable usage; no purchase or upgrade is authorized.

Compact historical build, HTTP and CPU records remain under `runtime/uk-cloudflare-svelte-adapter-20261010/` and `runtime/uk-cloudflare-next-adapter-20261010/`.

## Earlier integration evidence

The initial preparation passed 479 tests; the provider integration checkpoint passed 505. Subsequent focused provider checks passed 33 tests. [Preparation](qa/uk-cloudflare-prep-2026-10-10.json), [provider evidence](qa/uk-cloudflare-provider-2026-10-10.json) and [UK personalization integration](qa/uk-personalization-integration-2026-10-10.json) distinguish their exact phases, known fixture failures and targeted follow-ups. They are not claims of a fresh complete suite or hosted dealer approval.

The older workflow prose describes three designs. Current six-design code and the owner's explicit scope govern this extension while preserving the existing release, source ownership, payload integrity and remote reconciliation requirements.

## Sister's presentation

- [Browser-ready board](uk-sales-board-2026-10-10.html): standalone file for Chrome or Edge.
- [Written presenter guide](uk-sales-board-2026-10-10.md).
- [Current ranked research](../leads/uk-2026-10-10.md).

Design proposals are demonstrations. Their dated listing samples, illustrations and enquiry behavior must be explained accurately.
