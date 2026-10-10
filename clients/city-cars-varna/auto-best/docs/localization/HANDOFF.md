# Auto Best native EN/BG localization handoff

Date: 21 September 2026
Repository: `darkapoparka/cars-template-auto-best`
Branch: `main`
Scope: this reusable Auto Best template only; no dealer application or Cars release-pin changes.

## Release status

| Layer | Status at this checkpoint |
| --- | --- |
| Local source | Complete and frozen for release. Native EN/BG request handling, catalogs, preferences, public routes, metadata, validation, dialogs, errors and accessibility copy are integrated. |
| Local production build | Passed from the exact application/assets candidate recorded below. |
| Local browser verification | Passed on the fresh production preview at `http://127.0.0.1:6461`. |
| Committed / pushed | Pending the reviewed release commit. |
| Template deployment | Pending the Git-backed production deployment. |
| Dealer deployments | Not performed and not authorized in this session. |

This file supersedes the historical coordination/build-hold notes. `COVERAGE.md` is the route/state map; `evidence/release-candidate-2026-09-21.json` is the machine-readable local gate.

## Implemented contract

- Explicit `/en` or `/bg` URL language wins over query, cookie, browser-language and approximate-country hints. Legacy links redirect once while preserving query strings.
- Country and language are independent preferences. Save, dismiss, manual reopen, no-JavaScript form handling, blocked storage, invalid writes and request races are covered.
- English and Bulgarian are the only enabled languages. Other languages remain hidden; Arabic remains disabled pending complete translation and RTL acceptance.
- Catalog rendering uses explicit context keys. Forty-three ambiguous aliases are quarantined and zero are active at runtime.
- Dealer-owned city, address, appointment and related presentation fields are resolved through explicit configuration/catalog ownership rather than hardcoded runtime fallback.
- Public routes include Home, inventory and all eight retained vehicle details, Contact/inspection, Sell/trade-in, Import, Finance, About, all nine editorial details, locale settings, errors, robots and sitemap.
- POST/PUT/PATCH/DELETE business writes remain disabled by the server. Copy/share UI prepares local text or invokes the device share surface; it does not claim delivery.
- The accepted mobile work is retained: compact controls, single-line listing titles, concise Import labels, selected-state treatment, overlay geometry, header alignment and focus/scroll ownership.

## Exact candidate hashes

| Boundary | SHA-256 |
| --- | --- |
| Application inputs | `57125f5901d65aa2ae96a1de02b5d97fb8f44afdb3fcc286bb120ecb5cc8c6ae` |
| Static assets | `ede625f0b2e6871f6cd3655293a769d21554fc6d91687e822f9d9bd047755119` |
| QA scripts | `7c133fd8030a16e64fc4d3c4668b9339bac25e5dd796d1905f9314d5c62d3e83` |
| Locale policy | `e0adcfd9ca1efaf30c1410540cdbef25d2144bf9dc447971f0ce3b38cc5928c0` |
| Generated catalog | `f9d14b919eedc6b633c41b60061f9f05a0c7d63fd0265a1945abfdada8685b73` |
| Generated manifest file | `c841478a893a77731fc755a2dea6798c1afa46878eeed5b14adc284d49e26524` |

The generated catalog contains 958 complete EN/BG messages. Source catalog hashes are recorded in `localization/generated-manifest.json` and the release evidence JSON.

## Verification evidence

Static/build gate, all exit zero: catalog generation check; 24 locale/catalog/source negative tests; architecture; CSS policy; token graph; typography; assets; domain; 20 overlay ownership checks; Svelte/type check with zero errors and warnings; strict warning check; `git diff --check`; Vercel-adapter production build.

Serial localization browser gate, all exit zero:

- SSR: 54/54 routes.
- Explicit route/viewport matrix: 168/168.
- HTTP/security: 6/6; legacy redirects: 76/76.
- Preferences: 4/4; unavailable storage/no-JS: 6/6; request races: 8/8.
- Native route/state journeys: 226 passed, 0 failed, 6 deliberate standalone FAB skips.
- Sell/Import completion: 12/12; compact Import copy/fit: 6/6.

Existing and focused browser gates, all passed:

- Native route smoke 106/106; journey 8/8; enquiry 4/4; mobile filters 4/4; desktop discovery 6/6; Phase 4 boundaries 6/6.
- Typography/enquiry 7/7; mobile polish 8/8; overlay proportions 18/18; Chromium overlay controls and reactive validation 100/100.
- Primary widths include 320, 390 and 1440 CSS pixels, with 430, 768, 991/992, landscape and wide boundaries where relevant.

## Deliberate exclusions and remaining work

There are no known local acceptance failures. The six skipped locale-journey checks are cross-design FAB cases that do not exist in the standalone Auto Best template. Additional languages, mounted trio packaging, Admin localization, dealer refresh/publication and Cars release-pin promotion are outside this repository/session.

The remaining release actions at this checkpoint are: create reviewed scoped commit(s), non-force push `main`, wait for the existing Vercel template deployment to report the exact Git source, and verify critical EN/BG public journeys. The status table and task ledger must be updated after those actions.
