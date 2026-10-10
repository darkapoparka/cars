# Ten UK dealer proposals on Cloudflare — 10 October 2026

The owner requested all ten selected UK leads with Auto Best, Modern, Import, App, Mobile and Signature, hosted on Cloudflare after final template polish. This authorizes the builds and publication direction. Final polishing time is not an immutable release or a hosted acceptance result.

## Prepared inputs

- [Ranked research](../leads/uk-2026-10-10.md) and [public brief packs](../leads/uk-2026-10-10-briefs/README.md) cover ten stable identities.
- Each dealer gets one public proposal origin with six choices, using the existing Cars creation, personalisation, source seals, packaging and preservation-aware export machinery.
- For new dealers: Auto Best at /, Modern at /variant-2/cars, Import at /variant-3/, App at /variant-4/, Mobile at /variant-5/, Signature at /variant-6/. The shared admin demonstration remains a separate destination.
- Existing Vercel resources and the historical Cloudflare Priselci pilot remain intact. This batch is new UK work; it does not refresh the old dealer fleet.

## Live readiness

Cloudflare connector identity, account listing, Workers listing, account settings and workers.dev subdomain reads succeeded on 10 October. Four historical Priselci Workers exist. Account settings report `default_usage_model: standard`; this does not establish a Paid subscription. Subscription read returned an authentication error. The owner subsequently confirmed **Workers Free** on 10 October. Two isolated framework qualification Workers have now deployed successfully using the existing CLI OAuth session. No subscription, billing, DNS, domain or historical Worker changed.

The executable publisher now has an explicit `--provider cloudflare` path for six-design packaging version 5. It adapts original mounted sources through compatible SvelteKit Cloudflare adapters and vinext, emits a public router with six internal services, and seals provider receipts. The Vercel default remains available. Cloudflare never consumes a previously Vercel-transformed payload. Publishing requires frozen family and router dependency locks; generated build proofs stay outside the source payload.

The working release lock now selects App’s reviewed 10 October source, alongside the 9 October Auto Best, Modern, Import and Mobile releases. Signature is not selected. The latest chat audit found newer published Auto Best (`14b3cbe…`), Modern (`fc267cef…`) and App (`70c2b806…`) candidates. Auto Best's final hosted receipt is pending; Modern's focused receipt needs exact native release acceptance; [App's exact publication and hosted QA](qa/app-ui-audit-publication-2026-10-10.md) is available for release reconciliation. Mobile's current owner, “Improve desktop car cards,” still reports local changes; Import and Signature are also being polished. Final six-family source checks and immutable release selection remain necessary before copying. Qualification below uses older approved immutable inputs and is not a latest-template or dealer delivery claim.

### Hosted framework qualification

- Auto Best: approved source `2afd974c23d4f4cfb290ed99a00f46074793be3a`, Worker `cars-cf-qualification-auto-best`, version `451c0cf6-6e1a-4f95-bcd8-7d03cbb7d791`. Production build and dry run passed; 19 hosted HTTP checks passed, including EN/BG, catalogue filtering, details, 404, contact, robots and imagery. [Live English template](https://cars-cf-qualification-auto-best.darkapoparka1.workers.dev/en).
- Mobile: approved source `876590474d01178413feccf3153a0859230158a1`, Worker `cars-cf-qualification-mobile`, corrected version `ff5a4997-4912-4ba0-be73-ebe6cf32b7d5`. Production build passed after applying the existing native mount transformation. All 23 distinct rendered image URLs passed local production checks; 17 hosted checks passed. Browser checks confirmed loaded imagery, no horizontal overflow and the saved-car interaction. [Live mounted template](https://cars-cf-qualification-mobile.darkapoparka1.workers.dev/variant-5/).

Both sites are template qualification, retain sample identity/inventory and original presentation, and carry noindex metadata. No branded UK dealer origin or complete six-family pilot exists yet. Import, Modern, App and Signature still need actual framework build/hosted qualification.

Auto Best's first retained CPU sample contains 10 complete matched invocation records: median 8 ms, p95/max 55 ms, four above 10 ms; all outcomes were `ok`. The final raw tail object was incomplete, and later repeated requests were not captured in that sample. Wall time is not CPU, and the first request is not asserted cold. Successful deployment and HTTP responses do not certify sustained Free CPU compatibility. [Current Workers limits](https://developers.cloudflare.com/workers/platform/limits/) remain the qualification reference. No Paid requirement or upgrade is inferred from an upload.

Corrected Mobile's retained CPU sample contains 11 exact matched invocation records from 17 HTTP probes: median 16 ms, p95/max 69 ms, eight above 10 ms; all outcomes were `ok`. Home measured 69 ms on the first observed invocation and 16/16 ms on captured repeats; detail measured 34 then 3/2 ms. This does not establish isolate coldness. Cloudflare documents per-isolate flexibility for infrequent CPU overruns before terminating consistent limit hits, which explains successful responses above 10 ms. This SSR candidate is therefore not qualified for reliable Free operation. The final dealer inputs must be measured after UK personalization; if they still exceed the allowance, qualify a feature-preserving static/client conversion or present the exact SSR Paid requirement without purchasing it.

Compact source/build/HTTP/CPU receipts are retained in `runtime/uk-cloudflare-svelte-adapter-20261010/` and `runtime/uk-cloudflare-next-adapter-20261010/`. Two rendered Mobile captures retain the image-path defect and correction. Each owner reuses one qualification output and dependency installation while this pilot remains active; these have a concrete ongoing build/CPU investigation purpose.

The older WORKFLOW/LEAD-PUBLISHING prose describes three designs. Current code and the owner's explicit six/Cloudflare scope govern this extension; existing input identity and release validation remain required.

## Concrete rollout

1. Finish public identities, branding and one coherent inventory/media pack per dealer. Current stock packs are unpopulated: advertisement counts are research evidence, not a live feed. Use source-backed permitted assets or explicitly illustrative stock with truthful prices/units and unavailable delivery/form states.
2. The existing new-client command now accepts `--design-set six --locale-config JSON`, creates six selected families and records an explicit native locale contract. Synchronized-main, duplicate, release source/digest and staged-install guards remain. This source-creation extension does not create deployment or adoption receipts. It still refuses the currently absent Signature release pin.
3. Use the implemented Cloudflare provider branch after source proof, before Vercel-specific transformations. Reuse dealer facts, mounts, switcher and export logic; finish Next and Svelte production qualification for all six families. Do not create another source generator or bypass acceptance.
4. Qualify **Broadbent first** as one six-family UK pilot. Measure real emitted assets/bundles, route behaviour and CPU. Provider success alone does not mark visual acceptance.
5. After that passes, publish Motors Castle and Square One in a small first wave, then the remaining seven using the same versioned publisher. Each origin must show all six families exactly once.
6. Record exact source/template/export/build/deployment identities and route/browser evidence in the technical registry at publication. No outreach or private sales history is created.

All ten are Modern-first source configurations. The existing preservation-aware tooling still needs to preserve both slot orders for the old fleet; this batch does not migrate that fleet.

## Provider implementation boundary

The extension reuses `committedDealerInputs`, `collectSource`, packaging validation, native adoption proofs, export hashes and the existing private-repository reconciliation. It selects the provider inside `prepare()` before six-variant mounting, the Signature Vercel adapter replacement, `vercel.json`, Vercel asset planning and Vercel-only output corrections. Cloudflare build proofs bind source, installed dependencies and emitted bytes. The shared publisher also contains another owner's pending selector edits, which the scoped integration preserves.

Qualify [SvelteKit's Cloudflare adapter](https://developers.cloudflare.com/workers/framework-guides/web-apps/sveltekit/) for Auto Best, Import and Signature, and a supported [Next.js Workers build](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) for Modern, App and Mobile. Compare the exact apps with the documented [OpenNext path](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) where needed. Preserve the Modern workspace and the Mobile build wrapper. Signature's current runtime/dependency versions differ from its frozen Vercel publishing adapter; changing only the adapter name is not qualification.

A server-rendered pilot candidate is one public routing Worker with six application Workers behind [HTTP Service bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/http/). Preserve path, query, method, cookies and mount boundaries, and keep the selector on the public origin. This candidate would use seventy Workers for the full batch and has not been selected. The confirmed Free plan makes actual CPU and output limits decisive. First assess complete static hosting for all six demos, preserving their routes and interactions; do not strip required features to claim Free compatibility. Keep adapter-owned assets initially and avoid caching language/preference-bearing HTML. A later asset pool must preserve namespaced aliases, hashes and true 404 responses, following [static asset routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/).

The provider extension implements generated-output exclusions and family budget inspection, preserves adapter exclusions and freezes exact dependency inputs. Hosted upload and route receipts exist for the two framework qualifications above. Complete six-family mounted acceptance, UK integration and the accepted dealer publisher checkpoint remain outstanding.

### Confirmed Free-plan feasibility

The bounded source audit found no feature-preserving, unchanged-source static six-pack. Auto Best uses request locale/preferences and query loaders; Import uses server inventory/detail loaders and count endpoints; Signature uses server locale cookies and phone hints. Modern is explicitly dynamic with server filtering, preferences and forms. App and Mobile consume request/query state, and the publisher also injects request-dependent metadata/proxies for all three Next families. These features need runtime support or a separately tested client/static conversion. See [SvelteKit page options](https://svelte.dev/docs/kit/page-options) and [Next static export limitations](https://nextjs.org/docs/app/guides/static-exports).

The smallest complete Free pilot therefore qualifies all six supported framework outputs, serves matching assets first, and measures actual cold and repeated home/catalogue/detail/filter/locale requests. Start the heavier Modern/Import request measurements early. Free permits 10 ms CPU per Worker request; its asset bundle has a 20,000-file limit and 25 MiB individual-file limit. [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) and [static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) define the current limits.

If that complete SSR implementation repeatedly exceeds Free, present a Paid requirement for that implementation or scope a feature-preserving static conversion. Mobile is the lowest-effort static candidate, but a Mobile-only pilot would not qualify this six-family batch. No paid capacity or static compatibility is inferred from the preparation checks.

## UK acceptance

Use dealer country GB and British presentation en-GB with actual GBP prices, original tagged mileage and UK contact/postcode information. Native routing currently uses en/bg, so an English route and British formatting are distinct settings. Preserve manual URL choice, saved preference and supported browser language ahead of country hints.

UK profile normalization now recognizes GB, United Kingdom and en-GB, defaults to en-GB/GBP/mi, and converts complete domestic UK phone links to +44 only for GB businesses. Explicit settings and original inventory facts remain intact. Family publication still needs: Modern GBP schema support; Mobile English/dealer-owned formatting; consistent miles display and filter thresholds; App source-mileage input handling; and a trusted Cloudflare country boundary. Never change real currency, distance facts or business country based on the visitor.

A 60,000-mile listing should retain that original fact and remain consistent on cards, detail and filters. Canonical km storage can coexist with a deliberate miles display; relabelling km as miles is invalid. Missing prices must not become zero.

## Hosting and remaining inputs

The planned Cloudflare deployment must preserve all six applications and direct reloads, deep links, images, filters, browser navigation, safe enquiry behaviour and the design selector. Use supported framework output; assess renderer sharing or bounded static deployment groups from actual measurements, rather than assuming sixty independent Workers are the final architecture.

Cloudflare's current [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) states a $5/month account minimum plus usage for Paid; [limits](https://developers.cloudflare.com/workers/platform/limits/) distinguish Free and Paid CPU allowances. The owner confirmed Free. The previous Modern Free pilot recorded CPU errors; it does not prove the final six-family build's result. Qualify static hosting first or measure real server rendering against Free limits. If preserving the full demo needs Paid, present the concrete pilot requirement and cost before purchasing an upgrade. No upgrade or purchase is authorized by this preparation.

Current holds: final six immutable releases, accepted Cloudflare provider implementation/pilot, UK family integration, and sourced branding/inventory/media. A shell deploy command also needs its own authenticated upload session; plugin login is not proof of CLI authentication. A qualified plugin/API upload path can be used instead if it preserves the same artifact receipts.

## Preparation verification

The initial preparation check passed **479/479** across 59 test files on Node 22.23.2. It includes the new six-design creation and UK profile cases. Five initial Signature failures were resolved by permitting the template's known optional trailing calculator binding after all six mandatory dealer props; missing, duplicate and misdirected props remain rejected. See [the initial compact QA record](qa/uk-cloudflare-prep-2026-10-10.json).

The provider integration checkpoint subsequently passed **505/505** workflow tests across 64 files. After the final source/dependency/artifact guard changes, **33/33** focused Cloudflare tests and `check-workflow` passed. These cover source seal tampering, stale output, exact lock maps, mounted routing, trusted country hints and the Vercel default. [Provider checkpoint](qa/uk-cloudflare-provider-2026-10-10.json) distinguishes the test phases.

All ten public packs and locale contracts validated; Markdown link checks passed. The standalone board contains its own wrapper/runtime and no external `src`/`href` dependencies. Two framework production builds and test deployments now exist as recorded above. No branded UK dealer installation, complete six-family pilot or ten-dealer delivery is asserted.

## Sister's presentation

- [Browser-ready board](uk-sales-board-2026-10-10.html): open with Chrome or Edge. This is a standalone export of the original in-conversation coach.
- [Written guide](uk-sales-board-2026-10-10.md): open in Codex or a Markdown editor.
- Do not present a design demo as a live stock feed, delivered enquiry, finance approval or connected CRM.

