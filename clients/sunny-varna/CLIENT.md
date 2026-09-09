# СЪНИ — Varna

Status: **in-progress**. Three actual independent master-based applications exist with integrated local source-matched branding, icons, business identity and an eight-listing public-source snapshot. This supersedes the earlier documentation-only / zero-application status, preserved in RESEARCH-2026-09-09.md.

Branch-only handoff on `codex/astra-bg-03`. The owner elected to run application tests locally. No installs, framework builds or app browser checks are claimed here; owner review remains pending. No deployment, new dealer repository, outreach or Windows client checkout. The read-only remote research process used during the latest continuation completed with exit code 0; no background implementation process remains from it.

## Sources and identity

Published account: https://sunny.mobile.bg/ . Primary phone: 0898 644 464, `tel:+359898644464`. Address: бул. „Цар Освободител“ 256, Кайсиева градина, Варна. Hours are the published about-page schedule, qualified by a request to confirm before visiting. Conflicting secondary contact and tenure claims remain documented in the original research. Unknown socials and email are not replaced with another business's accounts.

The application data snapshot was observed on 2026-09-09. Its original collection used two individual details (Beetle and Smart) and six catalogue cards; those source limitations remain recorded in the unchanged vehicle data. A subsequent read opened all eight individual pages and matched the source IDs, seller phone, year and advertised mileage. This did not independently verify condition, availability, all specifications or prices, and no extra inferred values were written into the records. Eight sample records are not the dealership's verified live stock count.

Published branding was visually recovered at https://cdn2.focus.bg/mobile/images/housespicts/h11690476830498886.pic : black custom СЪНИ lettering on lime green. Commit `0338e32623a058319a5c8217b3bb38994347dd9d` replaced the earlier sun/road proposal with source-matched outlined and raster exports in every app. The original source PNG is preserved locally in each brand directory. The cleaned SVG is a derivative demo export, not an untouched official vector file or evidence of dealership approval. No successful ImageGen output was used for this cleanup. See BRANDING.md and each app's brand/PROVENANCE.md.

## Actual implementation boundaries

- Auto Best: retained full SvelteKit application; brand, inventory, footer, map and app icon consumers use the dealer identity. Local source-matched logo/icon assets are integrated.
- Modern: retained full workspace and packages. The lead-site and public mock-data modules consume the dealer snapshot. Commit `931206c0fa488dbdff3b37595cd1054a01ce6574` also replaces the source directory's nonexistent am-* listing lookups and synthetic businesses with this account's own bounded profile and sample records.
- Carwow: retained full SvelteKit application and dated sample data. The same commit fixes homepage featured-record selection, keeps explicit missing-photo states rather than hiding all records, and corrects default head identity/image metadata. Local compatibility-logo paths now contain СЪНИ artwork.

## Executed checks and remaining work

The limited regression harness passed 26 fixture/static assertions, using Node 22.16.0 and TypeScript 5.8.3. This is not a full application typecheck/build/browser pass; the directory schema is stubbed. Run `node clients/sunny-varna/scripts/runtime-data-contracts.cjs clients/sunny-varna` from the Cars root after retained dependencies are installed. Exact results and tested blob hashes are in the session-03 runtime-data-contracts result.

The route-by-route supporting-content and legacy hardcoded-identity sweep remains unfinished. No real vehicle-photo galleries have been bundled. Public listing/image access was established during follow-up, but complete local media integration and its use authorization remain unresolved. Missing photos stay visibly unavailable; another dealer's stock is not substituted. Public visibility does not establish a general reuse license.

See REVIEW.md for retained install/check/start commands and expected local entries. All application QA flags remain false. Shared public-origin/FAB integration is not implemented in this branch-only phase. This is an in-progress source checkpoint, not a completed demo or owner-approved design.
