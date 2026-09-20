# Cars: complete native localization, then roll out to the named dealer portfolio

Execute implementation, tests, scoped commits and verified releases—not another plan-only response or additional guard-only milestone. Preserve all other work. Use connected Remote Desktop Commander, GitHub, Vercel and Context7 where appropriate.

## Recorded starting state and durable implementation inputs

At the recorded 20 September 2026 inspection, only Al Reef had the accepted shared EN/BG country/language experience. Reverify current source and deployment state before changing an application. The previous complete Phase 2 application is already committed and deployed. Do not repeat the obsolete claim from the earlier pasted prompt that Phase 2 is uncommitted or unverified.

- Cars workflow: `darkapoparka/cars`, main, `J:/cars`; last pre-storage implementation commit `8642db0591b2132957a9d7b50dca10d713b44a76`; this stored handoff is a later documentation/candidate commit, so inspect current `main` rather than resetting to that baseline.
- Al Reef: `darkapoparka/cars-alreefusedcars`, main, only editable checkout `I:/cars-clients/al-reef-used-cars`.
- Accepted Phase 2 application: `f0ac5db2fb87d2167260607dbad338636556101b`.
- Current Al Reef main: `41ddc34893a8cfcf0219d80a248aead5fbc0c435`; documentation-only follow-up with identical application sources.
- Current observed READY Git deployment: `dpl_3VER6ig3NxL3oF7fkc1CGH8ydGnw`.
- Existing project `cars-alreefusedcars`, ID `prj_r5Vaw6NQh5iTxi5jjfrtuP9GFTNm`, team `team_RTNXBnClGWDdcYFFUW0BnqvJ`, alias `https://cars-alreefusedcars.vercel.app/`.

All implementation inputs are committed in `darkapoparka/cars` on `main` at `docs/localization/rollout-kit/` (local: `J:/cars/docs/localization/rollout-kit/`). Read `docs/localization/README.md`, the kit README, `candidate/change-manifest.json`, `src/policy.ts`, `tools/`, `test/` and `evidence/fleet-audit.json`. The complete TypeScript policy candidate, configuration, catalog-audit tool, unapplied exact-base patch and test fixtures are present as ordinary files. Do not ask the owner to download, attach or upload a ZIP. Do not look for `/mnt/data` or prior-session sandbox paths. With GitHub use `fetch_file` on these repository paths. A sparse-checkout omission is not evidence that a committed file is unavailable; inspect Git/GitHub directly.

The candidate is stored, but NOT integrated into the template masters or deployed applications. Its isolated tests include 4,050 differential cases inside one compatibility test. It does not contain full additional-language translations, RTL layouts or complete native template adapters. Use the verified Al Reef implementation as the native application reference and review the candidate rather than blindly applying it.

Historical note: the earlier candidate-preparation session reported a source-write safety-status error and made no application changes. The subsequent repository-storage session successfully wrote the handoff to the authorized Cars checkout. Do not treat the old error as an ongoing blocker without an actual current tool failure. Never bypass an actual current access or safety denial.

Recorded entry audit (not a new verification for every later session): 25 registered dealers, 75 existing design entries all HTTP 200; of 150 EN/BG-prefixed entry requests only Al Reef's six met the status/language/shared-selector-marker contract. The other projects have not received this feature. Entry checks do not prove full catalogs or popup persistence.

## Ownership and four actual template masters

Read current AGENTS.md and relevant architecture/release instructions in each repository before editing. Fetch safely and inspect main/origin ancestry, staged/unstaged/untracked changes and process ownership. No reset, clean, stash, force-push, extra branch/worktree, application clone or replacement Vercel project. Do not publish unrelated unfinished redesigns.

Authoritative masters under `J:/template-repos/`:
- `cars-template-auto-best`: local observed `b61327ef7eb0c9b8b3db5f200a80ba581e7fdc49`; actual remote previously verified `989ec3a1d80a8f19150d18eb81282ac7cd216d83`. Fetch encounters an existing invalid Codex checkpoint ref. Preserve and resolve integrity; do not delete refs or publish local work blindly.
- `cars-template-modern`: local `1cf8edfe26a36e25b0d95dcc963b60de51cdeb50`; fetched remote `703feaeb060f28f6cd43308c0aa4ff1b0a670fe8`. Ten unpublished commits and 32 changed entries were present.
- `cars-template-carwow`: local `26eb9d3d4d488eac09882f03e36588d712850c1a`; fetched remote `89f50c427863050abb7923152f05c091bb937d1e`. Three commits behind and 19 changed entries were present.
- `cars-template-import`: local and cached remote `5ff9805ebe0211343e7a025465d8d71e306180fa`, 370 changed entries. Refresh remote evidence.

All repositories above are under `darkapoparka`. Reconcile ownership without losing drafts. Read the actual registry `docs/DEPLOYMENT-INVENTORY.json`, not the obsolete nonexistent `docs/independent-dealers/registry.json`. Al Reef is an independent source; other dealers retain their registered Cars-canonical sources and publishing mirrors. Preserve mirror-only fixes before export.

Read Al Reef AGENTS.md, tasks.md, docs/BRANDING-LOCALE-ARCHITECTURE.md, docs/PHASE-2-LOCALE.md, docs/HANDOFF.md, branding contracts, localization sources/catalogs/manifests and committed evidence. Also read Cars `docs/INDEPENDENT-DEALERS.md` and the 2026-09-20-LOCALE-GATE handoff, generator, packager and tests.

## Implement reusable EN/BG in the three standard designs first

Implement the actual Auto Best, Modern and Carwow template applications first; do not stop after adding more guards, metadata, another ZIP or another prompt. Adopt Import as well before rolling out to the two dealers that use it. Extract the reviewed policy and native SvelteKit/Next.js rendering into the authoritative masters. Separate configuration, common interface messages, template-specific messages and dealer-owned copy. Remove Al Reef/UAE/AED hardcoding from reusable code, selectors, notices, formatting, FAB configuration and metadata. Preserve each dealer's verified identity, inventory currency, phone, addresses, stock, approved PNG/WebP logos, hero artwork and layout. Changing visitor country does not change those business facts.

Complete English and Bulgarian for every offered public route and UI state, including Sell/trade-in, Import, financing, filters, empty/loading/error states, validation, dialogs, menus, accessibility labels and metadata. Preserve `/contact?topic=trade-in` as an explicit regression. No runtime DOM/HTML replacement, automatic translation overlay or English fallback presented as completed localization.

Use one contract with native framework adapters and request-local server state. Explicit supported path language wins over query hints, saved cookies, Accept-Language and country suggestions. Preserve old links, query strings, anchors, design mounts and external/API/static URLs. Canonical dealer URLs put locale immediately after each design base. No redirect loops, double mounts, hydration disagreement or visitor-cache leakage.

Provide an approximate Vercel country suggestion, first-visit dismissible dialog/mobile sheet, native language names and permanent manual selector. No GPS, raw-IP storage or third-party geolocation tracking. Country and language are separate choices. Dismissal must not silently accept preferences. Keep host-only Path=/ HttpOnly SameSite=Lax cookies, Secure on HTTPS, bounded expiry and strict same-origin preference-only POST validation. Retain safe return URLs, stale-request cancellation, rapid close/reopen behavior, keyboard focus and no-JavaScript fallback. With storage blocked, explicit localized URLs still work. Different dealer origins do not share cookies.

Keep three FAB designs plus the existing separate English-only Admin link. Do not claim a locale query translates Admin or rewrite Admin as a side effect. Keep real enquiries, CRM, database, AI, payment and notification writes disabled.

## Generator integration and existing-dealer rollout

The current legacy packager forces Modern's default locale. Replace this with a reviewed native-compatible mounting path and tests; do not simply remove its protective rejection guard. Integrate the independent generator and the existing-dealer publishing/refresh path. Prove standard AND Import trios with isolated synthetic fixtures, exact source hashes, preserved assets, correct generated routes, complete catalogs and collision/concurrent-writer rejection. A guard that only reports “blocked” is not completed adoption.

Publish reviewed template source, run each template's required checks/builds and standalone/mounted browser tests, then update approved pins. Preserve unrelated unpublished commits. When one checkout is genuinely blocked, finish independent authorized components and report the exact remaining dependency.

This request targets the following 25 existing registered projects, in controlled stages—not an unreviewed bulk overwrite:

al-basma-motors, al-hamoor-al-thahabi, al-reef-used-cars, asko-96, astracar, autolife, automarket-varna, avangard-auto, champion-auto-pro, day-and-night-auto-group, eliqauto, elit-auto-import, excellent-cars, f1rst-motors, isauto-varna, ivo-auto, kg-team-auto, legend-auto, navara-car, outletcars-varna, perfect-auto-varna, priselci, promosale-varna, texas-drive-auto, the-dealers-point.

First reconcile Al Reef idempotently, then one Bulgarian canary such as Navara after source ownership is verified. After both pass, proceed in small reviewed batches within this named list, recording each result. Outlet Cars and Promosale use Import instead of Modern; preserve that. ISAUTO has a special legacy/CLI publication mapping: verify the actual source/deployment route rather than invent a dedicated repository or Git connection. Reuse all existing URLs, projects and repos. No project outside the named list is authorized for rollout.

## Optional languages without fake support

Prepare extensibility for Arabic `ar`, German `de`, Ukrainian `uk`, Turkish `tr`, Romanian `ro` and Greek `el`; keep them hidden until complete. First finish EN/BG fleet readiness; optional languages must not block it. Arabic is the next proposed UAE expansion, not a language already delivered.

Additional languages require complete common/template/dealer-owned text, plural rules, dates/numbers, search/filter display labels, metadata and native-browser acceptance. Use catalog keys and translation review packets so reusable copy is translated once, not separately for every cloned dealer. Do not infer translation accuracy from key counts alone.

Arabic additionally requires reviewed RTL layouts, logical CSS, correct direction on document/dialogs, mixed-direction VIN/phone/email/price handling and actual mobile/desktop journeys. Do not blindly mirror photographs, logos or all icons. Do not enable a language merely by adding a dropdown option or `dir=rtl`. Record translation review honestly; do not fabricate human approval.

## Acceptance, publishing and completion

Run guards/negative tests, typed catalog coverage, each app's checks and production build, then EN/BG route and interaction matrices at 320/390/1440. Include complete available route families, menus/forms/errors, preference save/dismiss/reload, switching designs, explicit-URL conflicts, no-JS, blocked cookies/storage, server isolation, request races, tab-text fit and branding. Retain actual failures and label intentional absent controls as skips. Use serial tests and bounded browser batches on the shared PC; stop/restart only verified owned preview processes when rebuilding.

Record the exact pre-change SHA, READY deployment and asset/source hashes for rollback before each dealer update. Publish through the existing Git connection once; no duplicate CLI deployment. Verify the exact READY source and public alias and repeat production critical journeys/security/locale checks. Stop rollout on failure and restore through the existing project or a scoped normal revert. Do not force-reset or alter public URLs.

Update durable tasks, per-repository handoffs, registry/evidence and a named rollout matrix after each stage. Final output must separate: authored code, checks, committed source, deployed source, verified public behavior, disabled languages, skipped tests and work not performed. Do not call the portfolio complete while any listed dealer/design lacks the accepted experience.
