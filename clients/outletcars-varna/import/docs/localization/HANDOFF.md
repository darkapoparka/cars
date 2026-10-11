# Import native EN/BG localization release

Status: implemented, committed, pushed and verified in production on 20 September 2026. Application release: `b2b99376ccdd7accd6486366220032afbd90d1e3`. Existing Vercel production deployment `dpl_GFCgAQo9Ef6Zzxtx138MxvE6s4bN` is READY and serves `cars-template-import.vercel.app`. This documentation-only receipt does not change application source.

## Source and publication boundary

Authoritative checkout: `J:/template-repos/cars-template-import`, repository `darkapoparka/cars-template-import`, branch `main`. Starting commit and verified remote baseline: `5ff9805ebe0211343e7a025465d8d71e306180fa`.

Runtime/source digest: `6065cf3b1b7f3d7bce1274895f1c5f99d7ec6e156f81e0382063fc8cb7896fe6`, covering 1,408 source, asset and runtime-configuration files in the tested candidate. Exact paths and hashes are in [runtime-source.json](evidence/runtime-source.json). [source-selection.json](evidence/source-selection.json) records selected source, retained formatting-only changes, pre-existing deletions and excluded local drafts.

This release deliberately includes the current native public storefront prerequisites needed by localization. It does not silently publish the whole pre-existing refactor. Unrelated admin/account/alternate-preview UI drafts and historical refactor records remain local. The two retained dashboard CSS entry adapters consume the single shared Tailwind entry; their inclusion does not release unfinished admin UI work. Existing legacy account/agent/alternate-preview implementations remain separate from the native public storefront.

## Implemented contract

Native EN/BG URLs use `/en/...` and `/bg/...`, or `/variant-2/en/...` and `/variant-2/bg/...` when mounted. The existing `(site)` route group is retained through native SvelteKit rerouting. Old unprefixed links and `lang` query hints remain compatible. Explicit path language wins over query, saved preferences, browser language and approximate country suggestions. Queries, anchors, public deep links and explicit sibling design mounts are preserved; APIs, static resources, external URLs and Admin remain separate.

The server creates request-local locale state. HTML, data and localized error responses are private/no-store; locale navigation and browser back update content, document language, metadata and links without shared visitor state. Country suggestion uses the hosting header only on Vercel; no GPS, raw-IP storage or third-party geolocation service was introduced.

A dismissible first-visit dialog/mobile sheet and permanent selector offer native English/Bulgarian names and independent country selection. The native settings form works without JavaScript. Preference POSTs validate same origin, body size, content type, duplicate/unknown fields and safe return destinations. Cookies are host-only, Path=/, HttpOnly, SameSite=Lax, Secure on HTTPS and expire after a bounded period. Dismissal does not accept country/language. The shared prompt version is `v1`, with compatibility for the earlier `1` dismissal. Request cancellation and close/reopen races are covered.

Native catalogs cover the offered storefront routes and states: import/listing/search/source wizards, Sell, financing and calculators, inventory/detail, contact including `?topic=trade-in`, About, services, guides, reviews, FAQs, policies, favorites, comparison, menus, dialogs, validation, empty/error states, accessibility and metadata. Authored native constraint messages follow the page language, independently of browser UI language.

Dealer names, addresses, stock values, actual inventory currency, contact destinations, logos and artwork are not visitor preferences. Numbers are formatted by language without currency conversion. All 823 baseline asset/inventory files are byte-for-byte unchanged. Historical source-string artifacts are cleaned only in display catalogs; feed keys and inventory data remain untouched.

## Final local verification

Node `24.21.0`, npm `11.19.0`, retained npm lockfile and independent candidate installation. Complete `npm run verify`: passed. Svelte/TypeScript: 0 errors, 0 warnings. Prettier and ESLint: passed. Architecture guard: 57 native route modules, 181 reachable modules, one Tailwind generation entry. Local image signatures: 806 passed. Unit/catalog/negative/security tests: 104 passed across 16 files. Standalone and `/variant-2` production builds completed with the Vercel adapter.

| Browser run                                         | Passed | Intentional skips | Failures |
| --------------------------------------------------- | -----: | ----------------: | -------: |
| Standalone desktop plus EN/BG 320/390/1440 journeys |    115 |                 3 |        0 |
| Existing mobile regression project                  |     39 |                29 |        0 |
| Mounted `/variant-2` EN/BG journeys                 |     50 |                 0 |        0 |

The 32 skips are viewport-specific cases, not unimplemented locale assertions. The mounted run uses an isolated Import fixture, not a Cars trio or dealer application. Browser checks cover the offered route families, both import/Sell modes, calculators, native and no-JavaScript contact, preferences save/dismiss/reload, keyboard focus, blocked storage/cookies, request races, explicit-language conflicts, request isolation, metadata, assets, URL state and narrow layout. [acceptance.json](evidence/acceptance.json) records exact cases, skips, timestamps and log hashes. Browser runs were serial.

Visual spot checks include the English/Bulgarian 320px import screens and desktop/mobile preferences. Captures are stored in this evidence directory. Earlier failures are retained in the local audit: mobile fallback links overlapped fixed navigation; the settings form overflowed narrow widths; an obsolete test compared EN/BG price-label strings instead of the unchanged source amount/currency. Those issues were corrected, and the final runs above passed. Non-fatal retained legacy `@reference`/build-timing warnings remain visible in build logs.

## Verified production release

Application commit: `b2b99376ccdd7accd6486366220032afbd90d1e3`. The committed tree was compared byte-for-byte with all 1,540 tested candidate files; the runtime digest above is unchanged. Existing Git publication produced READY deployment `dpl_GFCgAQo9Ef6Zzxtx138MxvE6s4bN`. The public alias passed 22 HTTP route/resource checks, eight preference/security checks and 15 serial Chromium journeys, with zero failures or skips. HTTPS cookies were verified Secure, host-only, HttpOnly, SameSite=Lax and Path=/. Production checks included both languages, 320/390/1440 preference interaction, native no-JavaScript settings, blocked storage/cookies, stale requests, route language precedence, request isolation and SPA metadata updates. See [production.json](evidence/production.json) for exact cases and the deployment receipt.

Git identity was supplied per invocation from this repository's existing history; no global Git identity or credential configuration was changed. A PortableGit helper-selection prompt was resolved by using the installed credential manager for the authorized push.

## Production and rollback

Existing Vercel project: `prj_6oD4HMR2gOO5Qn6tZUviKNx8ugXv`, team `team_RTNXBnClGWDdcYFFUW0BnqvJ`; alias `cars-template-import.vercel.app`. Pre-release READY deployment: `dpl_HdL8v8iTpsWgpucNgEMHj8L2YVLC`, source `5ff9805ebe0211343e7a025465d8d71e306180fa`. Publication uses the existing Git connection, not a replacement project or duplicate CLI deployment. Rollback remains this recorded deployment or a reviewed normal revert; never reset or discard local work.

The production environment listing contained no configured variables. Default synthetic preview behavior is retained. No real enquiry delivery, database, CRM, AI, payment or notification integration was enabled. Native demo requests do not promise external delivery.

## Preservation and remaining boundaries

The original owner preview on port 6790 is not rebuilt or stopped. Local source baselines, working-change backups, raw passing/failing logs and scoped staging evidence are under `.audit/localization-20260920/`. No branch, worktree, new repository or Vercel project was created. No Cars pins/tooling or dealer applications were changed. Outlet Cars and Promosale remain Import-as-Design-2 consumers; this template release does not roll them out.

Arabic, German, Ukrainian, Turkish, Romanian and Greek remain disabled/hidden. Arabic RTL and additional-language acceptance are not claimed. Chromium automation and visual spot checks are not universal browser/device certification or independent human linguistic approval. Browser-owned file/calendar chrome remains controlled by the browser. Legacy account/admin/agent modernization and production-provider qualification are outside this native storefront localization release.

## Cars working-source mobile QA — 30 September 2026

The current Cars master received a local mobile interaction, accessibility and delivery pass. [The complete report](../mobile-final-2026-09-30/README.md) records 136 passing mobile journeys, 20 passing desktop checks, 117 unit tests, the build, and loading concerns that remain on slow mobile connections. The frozen runtime digest is `2012941df31bcd07e789931010bca9d61a30339d6117e8b09429424e6cd1b753`; the tested runtime matched the canonical source. Pre-existing owner drafts were preserved and are identified in the report. This working-source pass does not supersede historical deployment evidence, promote a template release, verify the mounted variant, or deploy dealers. The canonical dev site is available at <http://127.0.0.1:5174/en>.

## Cars mobile card hierarchy — 1 October 2026

Canonical master: `L:/CODEX/cars/templates/import`, Cars `main`. [The focused QA receipt](../mobile-card-hierarchy-2026-10-01/QA.md) records homepage/inventory/import hierarchy, compact card labels, the menu contact banner, scrolling language control and bottom navigation. The complete frozen source matched the canonical source before this documentation receipt; its SHA-256 manifest digest is `2a6bcd74777ab9233f13b4f0207823d1de2d75307656ed627274db482c061ca1`. The separate production build passed. Existing recovery-artifact formatting/lint gaps and the unverified mounted/public/dealer boundaries are documented in the receipt. The master dev URL for this pass is <http://127.0.0.1:6790/bg>.

## Cars mobile listing and homepage details — 1 October 2026

The [follow-up QA receipt](../mobile-details-2026-10-01/QA.md) records side-by-side transmission/mileage badges, tighter search controls, removal of the redundant mobile card CTA, a one-line YouTube heading with a final channel card, and compact testimonial roles. The complete frozen source matched the canonical source before the receipt; SHA-256 manifest digest: `b88fd670189bda079ce64551d352e5aabc7471c0cf91c51e1be1af6e95acade4`. The production build, 124 unit tests, 18 production layout checks and 12 focused browser tests passed. The receipt preserves existing global formatting/lint gaps, the retained temporary QA copy and the standalone-only verification boundary. This supersedes the earlier outlined mobile card CTA and inventory mileage overlay; import recommendation mileage remains on the photo. The master dev URL remains <http://127.0.0.1:6790/bg/inventory>.

## Cars mobile header contact actions — 1 October 2026

The [header QA receipt](../mobile-header-contact-2026-10-01/QA.md) records the two-control Contact/Map header, configured Call/Viber options, preserved location callbacks and a mobile search-grid fix for enlarged text. The complete frozen working-source digest was `cd7f3f0bd086a6a0a1ea890cc003020c06b8bdda7da950447d33ec387d919a5f` before the receipt. The production build, source checks, 17 production header/layout/history checks and four existing mobile-navigation regressions passed. The receipt preserves concurrent drafts, documents the retained QA copy and distinguishes inspected native links from actual native-app handoff. No template release or dealer rollout is implied. The master preview remains <http://127.0.0.1:6790/bg>.

## Cars desktop audit and consistency — 1 October 2026

The [desktop QA receipt](../desktop-final-2026-10-01/QA.md) records shared Home/Inventory heroes and generated inward-facing edge cars, canonical search and a restored native-form sidebar, compact banners/articles, readable discovery labels, and consistent Services/About/Contact surfaces. The frozen runtime digest is `5f29394eab3850514a4323e713ceaf397187fc2704eb92dad453351beb285482`, covering 1,560 runtime/source/asset files. The production build, code/architecture/asset checks, 124 unit tests and desktop journeys passed. The broader browser run and picker recheck leave six explicit narrow-screen locale-entry/focus failures; the receipt also records the existing historical-evidence formatting gap, retained QA snapshot and local-only verification boundary. Mobile header work and other Cars/dealer changes were preserved; no release or rollout is implied. Preview: <http://127.0.0.1:6790/bg/>.

## About Us desktop editorial styling — 2 October 2026

The [About desktop receipt](../desktop-about-studio-2026-10-02/README.md) records consistent section widths, neutral editorial surfaces, inset team photos and map framing, compact hero actions and body-font section headings. The common hero anchor and independent mobile presentation remain. Eight desktop states passed; all four Bulgarian/English mobile states at 320/390px exactly match the measured baseline. Source checks, 124 unit tests and a production build passed in the existing temporary C: QA snapshot. All 1659 current application paths matched the tested snapshot after the build; per-file SHA-256 values are in the receipt's source manifest. Its two unused earlier illustrations are recorded separately. The running dev output and unrelated work were preserved. Owner visual acceptance remains open; no template release or dealer rollout was performed. Preview: <http://127.0.0.1:6790/bg/about>.

## Mobile About trial and desktop handoff — 2 October 2026

The owner accepted the preceding desktop About styling and requested a mobile trial before the full desktop audit. [The mobile receipt](../mobile-about-editorial-2026-10-02/README.md) records About-local neutral surfaces, readable body-font headings, 32px process markers, equal compact team cards and a 48px Instagram target beside the role. About's inline UI labels now have a typed content owner. BG/EN at 320/390px passed the focused browser checks; both 1440px desktop probes exactly match the approved baseline. Hero Cars/Contact navigation and Back were exercised. Other mobile routes keep their existing composition; Contact's measured presentation was checked separately.

Svelte, scoped format/lint, architecture, assets, 124 unit tests and the frozen production build passed. All 1660 current application paths matched the tested C: snapshot after the build. Drive exhaustion interrupted a save; the prior source was recovered, changes reapplied and hash verification completed. The receipt identifies retained recovery evidence, a preserved stale empty Git lock, inherited dirty work and browser verification limits.

[Desktop styling](../DESKTOP-STYLING.md) is the maintained design contract; [the new-session prompt](../DESKTOP-POLISH-PROMPT.md) asks for the full public desktop audit and implementation. Treido Studio at port 6418 supplies typography/surface/spacing references, while Cars retains its automotive identity and composition. Preserve current mobile, including this About trial pending owner review. No full desktop rollout, template release, dealer deployment or outreach was performed in this focused pass. Preview: <http://127.0.0.1:6790/bg/about>.

Integration is pending in `L:/CODEX/cars` on `main`, HEAD `6cc97e1e4218b9de238f3487275c9142a5465a13`: a fresh `.git/index.lock` was recreated at 19:02:08 and prevented scoped staging. It was preserved; the staged index is empty and no new commit/push is claimed. The mobile receipt lists the exact task-owned source/documentation paths and next integration action. The reviewed edits and evidence remain in the canonical checkout and tested C: QA snapshot.

## Mobile integration resolved and full desktop implementation — 2 October 2026

The preceding mobile handoff was integrated first in scoped commit `f190421c4a2a80630a2170ec5c52a27a3c1df05b`, pushed and verified on `origin/main`. The [full desktop receipt](../desktop-editorial-2026-10-02/README.md) records the shared desktop theme/content/component owners, before/after gallery, 408 BG/EN responsive states, production build, 124 unit tests and final desktop/mobile interaction reruns. The accepted About desktop anchor and mobile trial are preserved. The receipt owns the desktop source/commit evidence and explicitly retains local-only, reference, fixture and external-map limits. No template release or dealer rollout was performed.

## Cool off-white desktop implementation — 3 October 2026

The owner requested implementing the reviewed cool canvas/hero rhythm in the actual Import master. [The implementation receipt](../desktop-cool-off-white-2026-10-03/README.md) records shared desktop tokens, all automotive heroes, quiet controls and discovery tiles, plain red/black About/Contact actions, eight before/after route pairs and full Home screenshots. All 100 matching BG/EN mobile captures and presentation records at 320/390px remain identical, including the About trial.

The frozen source digest is `0f4efedb2e10c4bd74a5da162c86476cb0541fdd1739b849bbb552307b1815e4`, covering 1,677 current application/configuration/test/asset paths. Svelte, task formatting, full ESLint, architecture, assets, 124 unit tests and production build pass. Twelve existing browser suites pass 89 applicable tests with 53 intentional skips and no failures/retries; additional populated Garage, FAQ and Home keyboard/Axe states pass. The full verify command remains blocked by unchanged formatting defects, documented in the receipt. Current Treido reference loading/onboarding and external-map limits remain explicit. Source stays on Cars main; immutable release selection, visual acceptance and dealer deployment remain separate.

## Continuous off-white desktop canvas — 3 October 2026

The [continuous canvas receipt](../desktop-continuous-light-2026-10-03/README.md) records the shared desktop header, hero and content background. The application change is one token alias inside the 768px desktop scope. White cards, soft discovery panels, red/black actions, automotive artwork, campaign images and the footer keep their existing owners and composition.

The frozen source digest is `415c8e6f4c3f2eac5fa441d47bf561e187985691b60f322ab6d9a2d22bb4e1a6`, covering 1,677 current application/configuration/test/asset paths. Svelte, task formatting, full ESLint, architecture, assets and production build pass. All 156 production route captures are clean; all 100 matched BG/EN mobile screenshots and presentation records at 320/390px remain identical, including About. The six-suite browser run passes 47 tests, intentionally skips 22, and retains one unchanged old All filters `strong`-class assertion in `style-parity.e2e.ts:44`. Full verify still stops on three unchanged formatting files. The receipt preserves these limits and the development/production capture distinction; no gate was weakened. The actual implementation is visible at <http://127.0.0.1:6790/bg>, with [production before/after comparison](http://127.0.0.1:6795/unified-implemented.html). No template promotion or dealer deployment is implied.

## White desktop discovery panels — 3 October 2026

The [white-panel receipt](../desktop-white-panels-2026-10-03/README.md) records pure-white discovery frames and cards on the continuous cool canvas, consistent inset Home/Inventory controls, restrained panel shadows and visible red keyboard focus. The four changed component/token owners remain scoped from 768px; no content or interaction contracts changed. [The actual before/after comparison](http://127.0.0.1:6795/white-panels.html) includes Home, Inventory, Services and full Home.

The frozen source digest is `7e1cf8d1469db805ebd626ec1f11b1f9a2fa2b8f20149d82a27bdd41c8ceb602`, covering 1,677 current application/configuration/test/asset paths. Svelte, scoped formatting/ESLint, architecture, assets and production build pass. Forty before, 100 after and 20 production states have no response, page-error, overflow or broken-decoded-image failures; production screenshots wait for image decoding. All 20 matched BG/EN mobile screenshots and presentation records at 320/390px remain identical, including About. Four existing browser suites pass 35 tests with 13 intentional skips; 14 additional keyboard/surface records pass. The receipt retains the existing full-verify formatting limits, earlier unrelated style assertion and one raw desktop results-frame geometry difference. Unit tests were not repeated for this CSS-only follow-up. Work remains on Cars main; template promotion, owner visual acceptance and dealer deployment remain separate.

## Final Home browse cards and overlay cleanup — 3 October 2026

The [final Home receipt](../desktop-home-final-2026-10-03/README.md) records native browse cards inside stock, reviews and guides, replacing their standalone View all buttons. Three stock previews precede the inventory card; all three review/guide previews remain. Shared Modal/Action owners now provide desktop titles, close/back targets and footer treatment; typed inventory dialog copy and the existing selected tint remove repeated consumer values. Mobile rails and the About trial retain their presentation. [The comparison gallery](http://127.0.0.1:6795/home-final.html) includes full Home and three overlay states.

The frozen source digest is `923aae0d74951c327c71fb937d1b74c0437036f4f1914f6b55969e6346dd6233`, covering 1,678 application/configuration/test/asset paths. Svelte, task formatting, full ESLint, architecture, assets, 124 unit tests and the production build pass. Existing suites and focused native/keyboard browse cases pass 45 tests with 19 intentional skips, no failures/flaky cases. One hundred responsive after states, 20 production states, six overlay captures and six interaction records pass. All 20 matched mobile viewport screenshots and complete-page computed presentation records at 320/390px remain identical; three of four additional full-Home PNGs match, with one unchanged responsive banner-image paint difference documented separately. The old All filters class assertion was replaced with meaningful control/interaction checks; three unchanged global formatting defects still prevent full verify. Master integration stays scoped on Cars main; no template promotion, mounted/dealer or hosted acceptance is implied.

## Standard white Home browse cards — 3 October 2026

The [standard-card receipt](../desktop-browse-standard-2026-10-03/README.md) records all five desktop browse destinations using `HomeBrowseCard`: stock, makes, body types, reviews and guides. The black make and image-based type end cards are replaced with the same white surface, red arrow and shared hover/focus roles. Explicit `allTile` data identifies the type destination; category imagery and independent mobile end tiles remain in their existing owners. [The comparison](http://127.0.0.1:6795/browse-standard.html) includes makes, types and full Home.

The frozen working-source digest is `c81ba78f3603c4d20445e28b468b1041654bbb995a935d25c0ca632172e5bc6a`, covering 1,678 application/configuration/test/asset paths. Svelte, task format/lint, full ESLint, architecture, assets, 124 units and production build pass. Existing and focused native browser cases pass 29 tests with 13 intentional skips and no failures/flaky cases. Sixteen responsive after states, two production states and 40 individual card presentation/hover/focus probes pass. All eight matched BG/EN Home/About mobile viewport images and complete-page presentation records at 320/390px are identical. The same three unrelated formatting defects prevent full verify. Work stays scoped on Cars main, without template promotion or dealer deployment.

## Inventory browse artwork — 4 October 2026

The taller desktop Home inventory destination opts into `HomeBrowseCard`'s retained three-car decorative artwork. Asset/dimensions belong to `homeBrowseArtwork.inventory`; the mobile type tile consumes the same path. The media-gated picture and `HeroCars` share the exact existing transparent fallback through `utils/assets.ts`. White surface, red arrow, localized label, native inventory destination and other browse cards retain their owners. See [the receipt](../desktop-inventory-browse-artwork-2026-10-03/README.md).

Source digest `18f346b144f75221506af578925be95694da6b0e6b545577af2ce435e56355fd` covers 1,678 matched source/QA paths. Svelte, scoped formatting/lint, full ESLint, architecture/assets, 124 units and production build pass. Nine production browser cases pass with three intentional skips; three preliminary live browse cases also pass. Sixteen before/after states and two production captures are clean. Eight matched Home/About 320/390 mobile PNGs and complete-page presentation records are identical. Twelve media states and forty hover/focus probes pass. Full verify retains the same three unchanged formatting failures documented in the receipt. Only task-owned source/docs are integrated; inherited ignore/evidence/asset drafts and other Cars work are preserved. Standalone verification does not promote a template or deploy dealers.

## Desktop testimonial labels — 4 October 2026

Home and Reviews now use concise, one-line BG/EN categories beneath names through ReviewCard and content/reviews.ts. Typed roleKind metadata follows existing review content; original compatibility/mobile role strings remain intact. See [the receipt](../desktop-review-labels-2026-10-04/README.md) and [comparison](http://127.0.0.1:6795/review-labels.html).

Frozen source digest 834ee026103be0246b045b31f12b372738ff149b6f24f097de837fb3e123b714 covers 1679 matched application/configuration/test/asset paths. Svelte, scoped format/lint, full ESLint, architecture/assets, 124 units and production build pass. Both existing desktop/mobile review-avatar/article journeys pass. Seventy-two desktop label measurements, four no-JavaScript checks, four accessibility scans and all responsive captures pass. All twelve BG/EN Home/Reviews/About 320/390 mobile PNGs and complete-page presentation records match. Full verify retains the same three untouched formatting failures. Task scope remains source/docs on Cars main, without template promotion or dealer deployment.

## Home mode tabs — 4 October 2026

Home uses the installed Lucide car, percent, tag and globe with consistent weight and a selected underline following its content. MobileModeTabs owns the panel appearance; existing mobile variants, labels and mode/query rules remain intact. Blog keeps its native full-card link and text-and-arrow action. See [the receipt](../desktop-home-tabs-2026-10-04/README.md) and [comparison](http://127.0.0.1:6795/home-tab-polish.html).

Source digest f6ee836b2aa7f1a1a29b38fe538bdfb2cbc64f18fb1e131a6ac7395afeaadae5 covers 1679 matched application/configuration/test/asset paths. Svelte, task formatting, full ESLint, architecture/assets and production build pass. Existing browser cases pass 5 with 3 intentional skips. Thirty-two mode probes, 32 keyboard cases, eight accessibility scans and two no-JavaScript checks pass. All 16 BG/EN Home/Sell/Import/About 320/390 mobile screenshots and presentation records match. Full formatting retains the same three untouched failures; domain units were not repeated for this visual follow-up. The initial missing finance-action import was corrected before successful frozen-build QA. Work stays on Cars main without template promotion or dealer deployment.

## Home generated 3D tabs — 4 October 2026

The owner replaced the preceding line-icon preference with explicit generated 3D artwork. Four red-and-silver transparent cutouts now come from typed Home content records; MobileModeTabs and one sizing token own display and native interaction. Labels, mode destinations, filters and mobile variants stay intact. See [the receipt](../desktop-home-3d-tabs-2026-10-04/README.md), [asset provenance and prompts](../assets/HOME-MODE-3D-2026-10-04.md) and [comparison](http://127.0.0.1:6795/home-3d-tabs.html).

The frozen 1683-path digest is 4ec84a44d224a9ab628f78dd2e293155ede5dd491d01e70f0d4a1b2bbfc3db37. Svelte, task formatting, full ESLint, architecture/assets and production build pass. Existing browser cases pass 5 with 3 intentional skips. Thirty-two mode probes, 32 keyboard cases, eight accessibility scans and two no-JavaScript checks pass. All 16 BG/EN Home/Sell/Import/About 320/390 mobile screenshots and presentation records match; four mobile probes record no new artwork requests. Full formatting retains the same three untouched failures; domain units were not repeated for this visual follow-up. Integration stays on Cars main with no template promotion or dealer deployment.

## Discovery typography follow-up — 4 October 2026

Home panel tabs now explicitly use the 20px entry token instead of resolving to the general 22px desktop mode token. Sell/Import entry inputs inherit the same 20px/400 role as Buy, Inventory and Services. Hover remains neutral; the red underline remains selection-only. The previous 3D receipt's label-size statement is corrected to reflect its 22px recorded metrics. See [the receipt](../desktop-discovery-type-2026-10-04/README.md) and [comparison](http://127.0.0.1:6795/home-type-polish.html).

Frozen source digest 9962526ebda48dc7d6ea11ae0425e5a90777f396634d863a2f775e09be19d54b covers 1683 paths. Svelte, scoped formatting, full ESLint, architecture/assets and build pass. Production type checks cover 88 hero states; native form checks cover 12 first states. Browser cases pass 9 with 3 intentional skips. All 16 matched mobile screenshots and presentation records are identical. Full formatting retains three untouched issues. No template promotion or dealer deployment is included.
