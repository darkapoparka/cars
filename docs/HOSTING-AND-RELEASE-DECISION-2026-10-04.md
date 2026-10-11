# Cars: current five-design release and hosting decision

Updated 4 October 2026 after the owner supplied Vercel usage evidence and changed the design selection. This replaces the earlier same-day recommendation to preserve Carwow and necessarily publish the next dealer release on Vercel. It is not a completed deployment or permission to purchase plans, delete resources, or change DNS.

## The project is the existing Cars repository

`L:/CODEX/cars` is the physical working checkout of `darkapoparka/cars`, on main. `L:/PLATFORMS/cars-studio` is an existing Windows junction to that same checkout, not another app, clone or repository created for this task. Use the familiar Cars name. Do not relocate it during active template work. The Cars marketplace under `L:/PLATFORMS/cars` is a different product.

## Owner-selected result

Every one of the existing 25 dealer proposals must offer these five families exactly once:

**Auto Best, Modern, Import, App, Mobile. Carwow is removed from the new publication, not deleted from canonical source or Git history.**

Preserve the existing second-family mount rather than moving an already shared dealer URL unnecessarily:

| Mount | Existing Modern-first dealers | Existing Import-first dealers |
| --- | --- | --- |
| `/` | Auto Best | Auto Best |
| `/variant-2` | Modern, retained | Import, retained |
| `/variant-3` | Import, replacing Carwow | Modern, replacing Carwow |
| `/variant-4` | App, retained | App, retained |
| `/variant-5` | Mobile, newly integrated | Mobile, newly integrated |

Outletcars and PromoSale are the known Import-first dealers; verify the actual manifests rather than hardcoding only their names. Both configurations have the identical five-family set. New dealers default to the Modern-first order. The shared admin demo is a separate link, not a sixth variant. Label choices by family, not by an assumed global slot number.

Carwow detail IDs and route shapes differ from Import/Modern. Preserve old vehicle links only through a reviewed inventory-ID/route map. Do not blindly redirect arbitrary suffixes or keep Carwow assets in every new output just to avoid doing that mapping. Keep old source and deployment evidence available for rollback.

## Hosting decision

**Target Cloudflare for the next Cars dealer-demo release, after a tested five-design pilot. Do not run a speculative 25-project rollout on the current Vercel Hobby account.** The active Cars marketplace, Treido and Services platforms are not migrated by this assignment.

Cloudflare can host the dealer sites. The previous obstacle was a particular Free-tier, multi-Worker adaptation with runtime CPU failures, not an intrinsic requirement to use Vercel. Prefer a qualified Workers Paid build over rewriting all the apps merely to squeeze SSR into Free's 10 ms CPU allowance. Paid capacity removes that specific Free allowance but does not prove framework compatibility, correctness or efficiency. [1][2][3]

The initial 25-dealer migration does not require finishing a full multi-tenant rewrite. Retain the existing personalization/export workflow and prove provider adapters, routing and output first. In parallel, keep the longer-term shared-source/shared-media architecture: do not multiply independent source forks or blindly create five Workers for every one of 100 prospects. A small renderer set or bounded static deployment groups is the scaling goal, not a prerequisite to a safe first pilot.

Keep existing Vercel IDs, repositories and old production releases while the new hosted URLs are tested, but do not promise that an over-quota Hobby account will keep serving indefinitely. A `*.vercel.app` hostname cannot be moved onto Cloudflare by renaming a Worker. Use a reviewed Cloudflare preview URL initially; an owned preview hostname and any old-URL redirect/cutover require a separate verified change. Do not delete the Vercel fallback to force a migration.

Vercel remains a possible fallback provider if the owner chooses an appropriate commercial plan and the exact five-design package passes its checks. This is not an instruction to buy both providers or to retain every old deployment forever.

## Capacity evidence and its meaning

The owner's screenshot shows a last-30-days snapshot, not a per-Cars attribution:

| Meter | Screenshot | Approximate remaining amount |
| --- | --- | --- |
| Fluid Active CPU | 3 h 53 m / 4 h | 7 CPU minutes |
| CDN Requests | 957 K / 1 M | 43 K requests |
| Blob Advanced Operations | 1.6 K / 2 K | 400 operations |
| Fast Data Transfer | 48.77 GB / 100 GB | 51.23 GB |

The owner additionally reports over 65 GB Deployment Storage against a 10 GB allowance. That meter is not visible in this screenshot and the current quantity was not independently obtained from the connector. Vercel's September 16, 2026 announcement confirms the Hobby 10 GB allowance and that exceeding it can block new deployments. [4]

Storage, runtime CPU, CDN request count, Blob operations and network transfer are different measurements. A small source ZIP does not demonstrate a small final Function; smaller images reduce transfer but not necessarily request count; deleting an old deployment does not undo CPU or CDN requests already consumed in the displayed period. Do not blame all team usage on Cars without a per-project breakdown. [4][5]

The live Vercel deployment-context read still reports `tyj5` as Hobby. It lists Git-linked dealer projects, but the saved registry still calls IS AUTO `unlinked-cli` with a null Git repository. This is stale/conflicting saved evidence to reconcile, not permission to create another project or fire both Git and CLI deployments.

Cloudflare live reads returned four existing October 2 Workers: `cars-priselci`, `cars-priselci-modern`, `cars-priselci-carwow`, `cars-priselci-app`. Workers account settings report usage model `standard`; that is not proof of a paid subscription. Subscription reads returned authentication error 10000. R2 listing returned error 10042 asking to enable R2. No billing upgrade or R2 activation was performed.

Workers Paid currently has a $5/month account minimum, with request/CPU usage terms; it is not $5 per dealer. Direct static asset delivery has distinct billing, and enabling Workers Caching changes how cached/static requests are billed. R2 is separate and is not a compulsory prerequisite for a first pilot using supported static assets. [1][6]

## What the current source can actually publish

Read-only preflight at `2026-10-04T01:16:21.899Z`, Cars HEAD `6c92fdc2758d5d5b985a9c8a9004c7bb969d313a`, found:

- Exactly 25 selected existing dealer records, not all 87 registry entries.
- No selected master whose current source matched its approved release tree without dirty files. Auto Best, Modern, Import and App still reference the September 30 approved lock; current work differs. Mobile has no approved lock entry.
- All 25 lack a personalized `mobile/package.json` under their dealer source directories.
- The current application publisher accepts none of the proposed five-design manifests. This is expected: `package-dealer.mjs` still supports packaging versions 1/2/3 and three/four-design assumptions.
- One independent dealer source, Al Reef, requires its own publishing workflow.

These are incomplete release prerequisites, not a finding that the latest UI is broken. The preflight is source-only and deliberately never certifies production readiness. Re-run it after writer coordination; its output is a timestamped observation, not a frozen release.

```powershell
node scripts/check-five-design-release.mjs
node scripts/check-five-design-release.mjs --json
```

The command is read-only: it does not build, mutate manifests, fetch providers or deploy. Its nonzero exit when blocked is intentional. The helper `scripts/lib/five-design-release.mjs` validates/plans the selected family/mount set; it is not another dealer generator and does not bypass the existing publisher.

## Preparation implemented in this pass

These changes are local and uncommitted. Existing production sites and remote workflow definitions are unchanged until a reviewed scoped integration is pushed.

1. `scripts/publishing/preview-switcher.js`: added Mobile name/icon and five-choice behavior, retained the separate admin link, made new packages use their bundled selector immediately instead of fetching Vercel's mutable shared selector, and preserved an explicit legacy-only fallback mode. Mobile uses `?lang=bg/en`, not fabricated `/bg` or `/en` routes. Opening the selector after an in-page language change refreshes labels and destination URLs. Existing Import-first and Modern-first choices remain route-driven.
2. Three publishing/repair workflow files now have local manual-only triggers: `deploy-autobest-release.yml`, `fix-autobest-contact-localization.yml`, `reconcile-canonical-fleet-once.yml`. The Auto Best fallback no longer forces every CLI production build. This does not disable those triggers on GitHub until the reviewed changes are pushed.
3. Added the read-only five-design selection/cohort preflight and focused tests. The new tests passed **24/24**, including executed selector routing, language changes, duplicate injection, keyboard close/focus, separate admin link, both migration layouts, scope validation and manual workflow triggers. The selector tests use an in-memory DOM harness, not a visual browser acceptance pass.

No application/template files, dealer manifests, release locks, Git index/refs, provider resources, billing or DNS were modified in this preparation. Existing dirty work was preserved. Small before-byte receipts are in ignored `runtime/five-design-preparation-20261004-receipt.json` and `runtime/five-design-current-decision-doc-receipt.json`.

## Remaining implementation: one coordinated release

### A. Settle source and finish the actual five-design publisher

Coordinate with the agents editing Mobile, Modern, Import, Auto Best and App. Obtain exact source commits and fresh approved release evidence. Do not blanket-stage moving drafts or use the September 30 lock while claiming today's UI was shipped.

Extend the existing versioned publisher, rather than removing its validation:

- Add a tested new packaging version with the five selected families. Keep versions 1/2/3 readable for rollback and older source.
- Generalize `native-mounts.mjs` and `build-native-service.mjs` to manifest-selected mounts: Import must work at variant 3 and Modern at variant 3 for the Import-first migration. Current fixed mounts are not sufficient.
- Preserve native localization/source adoption seals and App's `.cars-app.json` identity, source digest, inventory and image checks. Do not forge new receipts merely because a hash mismatch prevents packaging.
- Implement Mobile's dealer-data/logo/contact/inventory adapter, mounted base paths, actual source collection, metadata, shared selector injection and honest draft-only forms. Keep its existing query-language contract or explicitly migrate/test it.
- Add Mobile to public roots, service names, retained/shared media, build helpers, publisher scopes, source export and refresh logic. Exclude Carwow from the new generated package, but preserve its original source/history.
- Use the already existing personalization and preservation-aware exporter, including remote-only fix reconciliation. Al Reef must not pass through the Cars-owned exporter.

### B. Verify compact outputs independently of the provider

Measure source upload/extracted source separately from final static output, each distinct final Function/Worker bundle, image transfer and retained hosted history. The earlier confirmed Vercel `GIT_REPO_TOO_BIG_FOR_DISK` failure is a source-unpacking problem, not proof of a particular runtime storage total.

Generate release artifacts only in the existing ignored runtime area or the controlled CI job, not as new maintained project copies. Exclude unrelated dealers/apps, Git metadata, environment secrets, reference captures, screenshots, dependencies and caches. Preserve required source, lockfiles, licensing, workspace dependencies and dealer assets. Never sweep source or C: folders to make space.

Retain the current exact-hash Blob externalization and per-dealer pooling until an alternative is verified. Serving the site on Cloudflare while still fetching every image from Vercel Blob does not completely remove Vercel dependence. For the intended migration, qualify emitted Cloudflare static assets or a verified R2/media domain and switch references deliberately. Keep old immutable Blob objects while retained deployments refer to them.

Reuse the historical responsive-cover experiment only after reconciling current source. Smaller correctly selected cover images are valuable on either provider; do not claim the earlier isolated 86.1% catalogue-transfer saving as a current fleet result.

Run all-family final-output checks with explicit output paths; no missing Mobile artifact, server bundle, or mounting route can be substituted with a passing master screenshot. Keep Vercel and Cloudflare-specific limits separate. Test production adapters in their supported build/runtime environments, not just development servers.

### C. Qualify two Cloudflare pilots, then publish the 25

Use Priselci and Outletcars as representative source configurations. Build the exact reviewed five-family release with the appropriate Cloudflare adapters, keeping the established UI and data boundaries. Cloudflare's Next.js guide offers vinext (beta) and the OpenNext alternative; choose on actual compatibility of these source versions, not a generic claim that any Vercel output will run unchanged. SvelteKit needs its own supported adapter. [3]

Do not reuse the old unqualified Free pilot as acceptance. The recovered October 2 report, `runtime/cloudflare-migration-20261002/README-AUDIT.md`, records six Modern HTTP 500s in 48 catalogue/detail probes with `exceededCpu`; expected pre-rendered HTML was absent. A Paid plan can avoid the specific Free CPU ceiling, but both successful runtime builds and repeated hosted requests must still pass.

Check all five mounted home/catalogue/vehicle/contact flows, actual listing clicks, direct reloads, filters/sort/pagination, Back/Forward, EN/BG, preference isolation, correct branding/contact/inventory, asset misses, selector choices, separate admin link, and keyboard behavior. Include 320/390px and affected 1024/1440/1920px desktop views, especially current Modern work. Verify DPR2 images and Safari where available. No real enquiries or outreach.

The shared admin URL intentionally stays a separate navigation destination; the bundled selector must not request its remote JS just to render the dealer page. Its eventual hosting is a separate move.

Record per-dealer exact template/tooling/data digests, source/publishing commit, provider project/Worker identities, deployed URLs/version, output metrics, test evidence and rollback. Advance only after the two pilots pass, in bounded waves. Report every one of the 25; 24/25 is not completion. Preserve existing Vercel identities until the explicit cutover plan is accepted.

## Scale toward 100 without rebuilding the same problem

Use versioned master code, a validated dealer profile/inventory/media manifest, and selected template releases. Shared code is not automatically shared deployed compute: current compile-time dealer constants must be removed from a renderer boundary before it can truly serve multiple dealers. Keep paid/custom-code clients independently deployable when needed.

A first bounded dedicated Cloudflare rollout can be practical for 25; do not enshrine five Workers per dealer as the 100-lead architecture. Free and Paid have finite default Worker counts (100/500). Static deployment groups also have file-size/count limits. Measure the real outputs and reduce duplication, without making a full platform rewrite a blocker to the initial delivery. [2]

Per-dealer rollback requires the old renderer or static artifact to remain actually available. Cache keys and identity resolution must include dealer, release and locale; private CRM/customer data never enters these public demos. No global caching of cookie-dependent personalized HTML.

## Next required owner action and completion boundary

Confirm whether Workers Paid is approved at the $5/month account minimum plus metered usage; the current paid/free subscription could not be read. No purchase is authorized merely by this document. R2 enablement is separate and can be deferred if the first pilot uses suitable static assets.

**Completed here: source/provider audit, current family/mount decision, tested local selector/workflow preparation, read-only per-dealer preflight and documentation updates. Not completed: the application publisher's new version, all Mobile dealer adaptations, latest source approval, full production builds, paid-plan action, Cloudflare pilot acceptance or any of the 25 hosted releases.**

Continue with the existing publishing/release skills and `VERCEL-COMBINED-RELEASE-PLAN.md`. Do not claim this preparation is an operational Cloudflare publisher or deployed five-design fleet.

## Official references checked 4 October 2026

[1] Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/

[2] Workers limits: https://developers.cloudflare.com/workers/platform/limits/

[3] Next.js on Workers: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/

[4] Vercel Hobby storage/retention announcement, 16 September 2026: https://vercel.com/changelog/hobby-projects-now-retain-fewer-deployments-to-free-up-storage

[5] Vercel Deployment Storage accounting: https://vercel.com/docs/deployment-storage

[6] Workers static asset billing: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
