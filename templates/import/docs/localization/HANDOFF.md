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
