# Cars workflow migration — 12 September 2026

Cars owns canonical dealer source, integration, technical records and release snapshots. The four standalone template repositories own reusable frontend work. A dealer receives three applications in one publishing repository and one Vercel project: Auto Best / Modern / Carwow, or the intentional Auto Best / Import / Carwow setup.

## Implemented surfaces

- Short root instructions, task-specific workflow/release/publish/QA/setup/coordination/registry references, and the owner quick start in the root README.
- Three repository-scoped skills in `.agents/skills`. The local Codex app-server `skills/list` returned all three as enabled repository skills; no model or personal settings were changed.
- Immutable release locks, normalized snapshot integrity, discovery separated from promotion, preflight duplicate/alias checks, and portable dealer guidance.
- Deterministic publishing packages with both trios, retained shared assets, mounted-path helpers, Services output correction and the actual design switcher. The exporter compares the actual remote and refuses unexplained publishing-only changes and remote races.
- One technical registry generates the readable deployment list, project index and dashboard state. Source, personalization, builds, deployments, browser checks and owner review remain separate. Eleven prior lead IDs and nineteen historical candidate records were retained.
- All four standalone instruction/reuse/QA sets route dealer work to Cars. Historical imported AGENTS filenames were renamed so they cannot be loaded as active nested instructions. Technical, license and provenance references remain available.

## Preservation and audit scope

The initial inventory covered 3,114 Markdown files in Cars, 34 in Auto Best, 134 in Modern, 54 in Carwow and 15 in Import. The [documentation disposition map](README.md#disposition-map) distinguishes active guidance, generated views, technical references and history. Original indexes, refs, document bytes and hashes are retained locally in `runtime/workflow-overhaul-20260912/`.

Cars began on local main `adc16cc3e3ae430c1f53e64dd7086ce632e29e38`, behind fetched main `a2f2975a0aa362dce2c66472f202dd0548dc8b1b`, with 9,393 staged paths and extensive unstaged/untracked work. Commits are constructed with a separate index and reviewed paths. No blanket staging, reset, clean, force push, branch deletion or additional Cars worktree is part of this migration. Modern's existing `astra` branch and unfinished template refactors remain owner work.

The GitHub plugin returned `USER_NOT_LOGGED_IN`. Authenticated local Git/gh provided repository access; the Vercel connector provided live deployment records. No credentials were written to source.

## Bounded validation

Seventeen workflow tests pass, exercising source integrity, duplicate identities, both trios, excluded files, repeatable packaging, mounted URL behavior, Services output, remote ancestry, remote-advance rejection and scoped temporary preview access. Command-help/link checks and actual local skill discovery are separate evidence. `start-client.ps1 -Client promosale-varna -Plan`, `template-release.mjs verify --key import`, `index-deployments.mjs --check` and `check-workflow.mjs` passed. The registry contains 73 technical dealer records and 202 application entries, including both existing Import trios.

The Import release pilot uses a reviewed immutable upstream commit. A failed external Audi sample photograph returned 404; the release uses the existing illustrative A7 cutout. This is template fixture media, not verified dealer stock. The candidate passed Svelte checking with zero errors/warnings, production build, and mobile/desktop route checks. Exact release/digest/evidence lives in [templates.lock.json](../templates.lock.json).

Promosale Varna is the existing dealer pilot. Its canonical retained source was compared with fetched Cars main across 3,267 tracked paths before adding portable instructions and the manifest. The final package uses canonical source `b66b7a1c1ad5c0dcf0a1a340f390ef6f483265d0`, packaging version 1 and digest `1678f44e7ce95deecc3444c5d7780a36b28774a42372e473094db605bce527a7`. Repeating generation produced the same digest. Thirty-three untracked preview experiments were excluded and preserved locally.

The actual publishing parent is `61552221b9f791fc57a40602643ae3d3915d3da1`. Every one of 434 changed payload paths has a [reviewed disposition](evidence/promosale-publishing-reconciliation-2026-09-12.json): 270 only normalize line endings, 105 remove historical generated metadata/instruction wrappers from the deployable copy, and 59 change the portable guidance or packaging. Historical evidence remains in canonical Cars and publishing history. Existing Carwow asset fixes and Svelte Services corrections are preserved; raw links/redirects, framework asset bases and renderer output were corrected in reusable packaging.

All three applications passed checks/builds. Auto Best and Import final app inputs equal the previously built candidate after line-ending normalization; Carwow was rebuilt after the final origin/asset correction. Carwow retains four existing unused-CSS warnings. The existing content verifier passed six listings and 54 image checks. No stock facts were refreshed or external enquiries submitted.

The exporter created `0a2c84804d656f3882e01343ceeeef8d7337f06a` on `darkapoparka/cars-promosalevarna`, branch `codex/workflow-pilot-20260912`, preserving the actual remote ancestry. Vercel's Git integration produced READY deployment `dpl_8REYyKrnMSz76tQdfrE4C45HbSpP` in existing project `prj_yjXIu0an7sqCiY26hKWgOGUl5hbY`, team `tyj5`. Its [deployment record](evidence/promosale-deployment-2026-09-12.json) verifies the exact exported Git SHA.

The exact preview origin is `https://cars-promosalevarna-qff6s3mf9-tyj5.vercel.app`. Direct anonymous access redirects to Vercel login. A deployment-specific share link enabled the [hosted browser checks](evidence/promosale-browser-2026-09-12.json) without account login; it expires **13 September 2026 at 17:20:37 UTC**. The token is kept only in ignored runtime and the owner's conversation. This is a temporary shared review preview, not a permanently public lead-delivery link. Project protection settings, production branch, primary domain and production deployment were not changed.

The hosted checks passed 24 route/viewport cases at 390 and 1440 px, with no page/console errors, visible broken images or horizontal overflow. All three real design switchers passed navigation, Escape/focus return and 320 px fit checks. Browser interaction verified BMW filtering in all three designs at both widths, one resulting listing per design, mobile menu close controls, and the telephone enquiry destinations. Home screenshots for all three designs at both widths were visually inspected. This bounded storefront proof does not certify every secondary/admin route, template polish, owner review or provider message delivery.

[Workflow validation](evidence/workflow-validation-2026-09-12.json) records command results, skill discovery and the document audit categories. The dashboard was browser-checked against the registry: Promosale shows its actual Import variant, six listings, eighteen local inventory images, shared preview QA and owner review pending. The [production check](evidence/promosale-production-preserved-2026-09-12.json) resolved the primary domain to its original READY deployment and Git SHA after the pilot.

## Published commits

| Repository | Exact commit | Scope |
| --- | --- | --- |
| Cars | `b64a840989716fff0584794e3209a037c324bc72` | Workflow, skills, registry, tools and Import snapshot |
| Cars | `42ca8b1c93d950c841f358305c7ecde44e857da7` | Portable pilot instructions |
| Cars | `b66b7a1c1ad5c0dcf0a1a340f390ef6f483265d0` | Final deterministic pilot packaging/source |
| cars-template-auto-best | `45fd0de4fcc6d5f43959746db771866d9a7db055` | Ownership, reuse, QA and Cars integration docs |
| cars-template-modern | `1fcddde3a1669d6ac7fc0997f71dad668fb8d99c` | Ownership, reuse, QA, historical instructions |
| cars-template-carwow | `134fcc7ef3dec3b22a62f568f16a5d9d4f6c9499` | Ownership, reuse, QA, historical instructions |
| cars-template-import | `b13436590d8128231f396a46e8dfe6ba0f2c755b` | Documentation and bounded sample-media repair |
| cars-promosalevarna | `0a2c84804d656f3882e01343ceeeef8d7337f06a` | Preview branch export; production untouched |

All five library/template repositories were pushed to their existing main branches without force; the dealer pilot was pushed only to its named preview branch. This report, final registry evidence and the temporary-access QA support are a follow-up Cars commit on that chain. Its exact SHA is supplied in the owner handoff; a file cannot contain its own commit SHA. [Machine-readable commit/file evidence](evidence/workflow-commits-2026-09-12.json) lists the scoped changes.

## Remaining release work

Auto Best, Modern and Carwow retain explicit release holds while existing Cars-only changes, unfinished standalone work and owner visual review are reconciled. The workflow refuses to call these arbitrary development heads approved. Existing dealers remain independent and are not synchronized or redeployed by template promotion. Template polish and individual release approval can proceed in their standalone projects.

The local Cars checkout remains at `adc16cc3e3ae430c1f53e64dd7086ce632e29e38` with its original index tree `3c7c20cc3e7708490ed8505b03fecde7790948fe`. Against the fetched pre-migration main, 7,670 staged paths were already upstream, 1,113 overlapping paths differed, and 610 staged paths were unique. Advancing the occupied local checkout blindly would mix or overwrite unfinished dealer work. Main-based scoped commits were published with separate indexes; the checkout and owner index were deliberately retained. Reconcile those unique changes by dealer/template before advancing local main. Do not use a blanket pull/reset/clean as a shortcut. The exact local path lists remain in `runtime/workflow-overhaul-20260912/main-integration-plan.json`; [preservation evidence](evidence/workflow-preservation-2026-09-12.json) verifies all five original checkout heads/branches and staged trees.

The Standard/Modern trio is covered by source/packaging fixtures, including locale and static-demo guards. This deployment pilot exercised the intentional Import trio. A materially changed Modern-based dealer still needs its own mounted and hosted QA. Three unreconciled template releases currently prevent creating a fresh approved trio; this is intentional until template reconciliation/polish is complete.

J: ran out of space during the final Carwow rebuild. After automatic approval review rejected deletion of generated dependency caches, this pilot's three dependency directories were relocated to the system temporary directory and the build passed on retry. No owner source was moved. Keep working-space capacity in view before another large build; cache locations are in the preservation evidence.

Historical application QA is not upgraded to current hosted proof. Dealer approval, external form delivery, private CRM synchronization and outreach are not implied. No portfolio deployment or lead contact is part of this migration.

Original specifications: [workflow review](WORKFLOW-REVIEW-2026-09-12.md) and [Codex handoff](CARS-WORKFLOW-CODEX-HANDOFF.md). Current instructions are linked from [the documentation index](README.md).
