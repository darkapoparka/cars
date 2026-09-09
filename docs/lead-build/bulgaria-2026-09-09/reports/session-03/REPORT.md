# Session 03 — actual application source handoff

Updated 2026-09-09 after the owner's correction: build the applications and leave runtime tests to the local coordinator. Repository darkapoparka/cars, branch codex/astra-bg-03. Original published baseline faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca.

## Delivered source and honest status

**All 15 requested application folders now contain actual independent master-based source, with local dealer-specific proposed logos/icons, contact/map identity and core catalogue bindings.** They are not scripts that generate the apps later. Modern retains its complete monorepo, all apps and required packages, not only apps/web.

**Status remains in-progress for all five dealers.** The requested complete personalization is not finished: real vehicle photo galleries are not bundled, and supporting/legacy pages still need a full stale-identity/content sweep. Those are implementation gaps, separate from the owner's choice to run tests locally. No application is represented as verified-local or accepted.

| Dealer | Actual folders under clients/<slug>/ | Source checkpoint | Status |
| --- | --- | --- | --- |
| sunny-varna | auto-best, modern, carwow | 2db15c1d327a736c4753115bd446984673e1be78; e409b7c880554af9fdc37ed398ba94a0bdad0936; 9aba10c0bdfc95109fb50a20c71da61851f80e08 | in-progress |
| rqs-auto-team | auto-best, modern, carwow | c27cf18e93c987746f1405f6abc02d39a19dea81 | in-progress |
| evrocar-varna-09 | auto-best, modern, carwow | f5e9000f34b55f3ce478d593d6d81feee9019bb3 | in-progress |
| sprint-auto-varna | auto-best, modern, carwow | 8d77be1411535f5fd73016b635040b8037086810 | in-progress |
| europa-varna | auto-best, modern, carwow | 6d12146b3b1c42e50fcaa3d7969f730f6b7f8dfe | in-progress |

A concurrent Sunny-only commit a4431101d8a28a41849baded42504d5972138a4f landed after Sprint. Its comparison against 8d77be1 showed only Sunny paths. Europa was published on top of that fresh head, preserving those changes. This report does not claim authorship or runtime verification of that concurrent patch. Do not overwrite it with an earlier Sunny tree.

The prior five qualification briefs were preserved as clients/<slug>/RESEARCH-2026-09-09.md. Current CLIENT.md, REVIEW.md and per-variant .client/project.json distinguish actual source presence, incomplete content and unexecuted runtime checks. BASELINE.json and CHECKPOINTS.json in this report directory describe the earlier research-only phase; their old zero-app totals are historical, superseded by this report.

## Original masters actually retained

| Design | Version | Original source tree |
| --- | --- | --- |
| Auto Best | 2026.09.08-polish-1 | 97833980ab127f6de8f675ac1a188e4b7f717976 |
| Modern | 2026.09.06-refresh-1 | 66bfb8196bbce18832ada6b34b02dda97baba25b |
| Carwow | 2026.09.08-repair-1 | d4a08817e87cf84d08c4db1c08a515937245f2dd |

Every design starts from its exact original master tree at the recorded baseline. Client-neutral binding patches created during this implementation were applied as individual files to the original masters; no other dealer's complete app, identity or inventory was used as the source. Frameworks, components, source styles, routes, lockfiles and licenses remain. Root inherited AGENTS/.template metadata and selected historical ledgers were removed. Remaining reference/QA documents inherited from a master are not new client QA and have not all been exhaustively pruned.

## Actual consumers changed

Auto Best: src/lib/config/brand.ts; data/dealer.ts, inventory.ts, company.ts, home.ts, navigation.ts and vehicle-artwork.ts; original footer, showroom map and hero components; app icon tags and client palette. The real card/filter/detail data boundary is changed, not only an unused facts file.

Modern: packages/marketplace/lead-site.ts and dealer-profile.ts; marketplace-domain/testing's actual static-demo data and query helpers; dealer-mobile-brand-bar.tsx and public metadata. The original split-logo crop is replaced with whole local logo rendering while retaining its surrounding navigation. Other supporting page content is not yet fully swept. Static-demo customer leads, sales and trust records were not rebranded as real events.

Carwow: the imported site/navigation, current inventory, vehicle-detail/filter, FAQ, topic-profile, review, video, legacy dealer and agent data modules. Unestablished reviews and channels are not replaced with fabricated endorsements. Legacy numeric fields such as unknown doors/ratings can still need better unavailable-state presentation; no app browser acceptance is claimed.

Each application contains its own local brand/ directory. No external/expiring image URL is needed to render its logo, icons or explicit missing-photo state. The preserved source asset directories may still contain unused or unswept old media; the complete source-identity and media-consumer sweep remains outstanding.

## Source-backed catalogue limits

Each dealer has an eight-record dated sample. Exact individual listing URLs/IDs were retained when established; catalogue-only records explicitly keep their external ID unknown, link to the source catalogue and use an internal descriptive slug. Advertised currency, kilometres, tax wording and known conflicts are retained. Unknown email, socials, street numbers and schedules were not filled with another dealer's facts. Source URLs and original research limits are in each client brief and imported dealer module.

Primary public catalogues: https://sunny.mobile.bg/ ; https://rqsautoteam.mobile.bg/ ; https://evrocarvarna09.mobile.bg/ ; https://sprint.mobile.bg/ ; https://evropavarna.mobile.bg/ . Observation date is 2026-09-09, distinct from source edit/crawl dates. No live feed or independently verified available-stock count is asserted.

Examples kept explicit: RQS Auris power mismatch and customer-owned Civic; Eurocar repeated advertised 100000km; Sprint Ignis HYBRID title versus petrol field and Yeti's source body category; Europa mixed VAT wording and unknown engine capacities. Europa's parts-only Mini, damaged/misclassified offer and conflicted Subaru were excluded. No third-party photos were replaced with generated vehicle photographs.

## Branding and asset evidence

The new logos are custom outlined-vector **demo proposals**, not dealer-approved official originals. ImageGen was attempted but generation did not start; no generated image, ID or faithful source-logo recreation is claimed. The wordmarks contain outline geometry, not linked font files. Matching favicon and PNG emblem/wordmark exports are actually uploaded and referenced inside all three applications. The later four dealer marks intentionally use a white-backed treatment for both light and dark surfaces.

The following uploaded PNG Git blob SHAs matched hashes computed over the actual local file bytes before use:

- Sunny logo: 7950bb2d806aae22a792ea8323cece9515d1f8f6; touch icon: 7a49b5913bf7b122d1f0c1dd54d3b21d13de06dc.
- RQS emblem: ba6c4c06c442df4cd99c3297958653ff72ff68d9.
- Eurocar emblem: 63a41ed9fbd877814ab5bee91aebb3dbfa42c9a8.
- Sprint emblem: 6a2333647f4350551725c2fdb9cc6fd19c4ead95.
- Europa emblem: bf02748626cde3392fc3bc13f13943e89f0c2a98.

SVG/PNG composition and basic Cyrillic/bounds were checked in isolated asset preparation, not in rendered applications. See each app's brand/PROVENANCE.md. Incorrect intermediate blob-upload attempts were not mounted into the delivered application trees.

**Real vehicle photographs/galleries are not delivered.** The source access/reuse issue remains open and the apps currently use explicit missing-photo tiles linking back to source information. These tiles are not falsely described as vehicle images. Abstract brand scenes are decorative, not representations of premises, cars, employees or customers.

## Remote verification actually executed

At immutable head 6d12146b3b1c42e50fcaa3d7969f730f6b7f8dfe, all five dealer directories were fetched back; each contains all three actual application directories and a REVIEW.md. Per-dealer app tree SHAs matched the mounted source trees, with Sunny reflecting its preserved concurrent update.

GitHub compare against faf76e81 reported 14 commits ahead and zero behind. Its returned file list is only a bounded portion of this large change and is not treated as a complete count or exhaustive allowlist audit. The published root tree and full clients top-level tree were also read: all unrelated client subtree SHAs, clients/index.json, templates, scripts, catalog, leads, audits and root files match the baseline. Every write in this implementation used the complete preceding root plus only allowlisted client/report paths. No force update was used. Each published ref was read back.

This final report changes only this REPORT.md. Its own final commit is intentionally not self-referential; the remote ref must be read back after publication. The final chat handoff supplies that verified commit link.

## Tests and local review

**No package install, application typecheck, production build or application browser test was executed in this cloud session.** The owner explicitly chose to run these locally. There are no claimed command exit codes, application screenshots, passed route matrices or completed owner review. Source/API/asset checks above are not substituted for them.

Expected local entries after preparation, not tested here: Auto Best http://127.0.0.1:6631/ ; Modern http://127.0.0.1:6632/cars ; Carwow http://127.0.0.1:6633/ . Each client REVIEW.md provides exact slug-specific launcher commands and a representative detail path. Start one dealer at a time using the existing coordinator launcher, in the coordinator's chosen review checkout, without resetting or overwriting unrelated dirty work.

Retained checks: Auto Best Node22 npm ci then npm run validate. Modern Node >=22.22 <23, pnpm11.4, frozen install, local @repo/database build for Prisma generation, web typecheck and configured web build; no migration/live DB. Carwow Node24 npm ci, npm run check and npm run build. Each retained TEMPLATE.md contains its environment guidance. Review desktop/mobile header, catalogue, details, source/media notice, contact, filters, menu dismissal, noindex and enquiry outcomes locally.

## Coordinator resume point

Fetch codex/astra-bg-03 and begin source review with Sunny, preserving the concurrent Sunny patch. There are now real apps to install and inspect, but no dealer should be labelled fully finished from this checkpoint. Complete real permitted stock galleries and the supporting/legacy copy sweep, then run the local checks. No monolithic wrapper, shared public-origin mounting or FAB was added; those remain the later coordinator publishing step.

No Windows checkout/connector, local-drive worktree, competing server, background job, deployment, new dealer repository, external enquiry or private CRM write was used by this implementation.
