# Auto Best native localization

This repository owns one standalone SvelteKit application. English and Bulgarian are the only enabled languages. The dealer rollout, other template masters, Cars generator and release pins are outside this change.

## Source ownership

- `src/lib/config/brand.ts`: retained dealer/sample identity, contacts, coordinates and approved artwork destinations.
- `src/lib/config/locale.ts`: explicit dealer country, inventory currency, default/enabled languages, formatting locales and preference lifetime.
- `src/lib/locale/policy.ts`: portable pure routing/resolution/preference contract from the committed Cars rollout kit. Configuration is frozen; every request gets a new resolved state.
- `localization/common.json`: reusable interface messages and contextual filter titles.
- `localization/catalog.reviewed.json` and `template.reviewed.json`: retained template presentation copy in both languages.
- `localization/dealer.reviewed.json`: dealer-owned display fields and source-owned media titles. Changed business display fields require matching translations, not a generic fallback.
- `src/lib/locale/catalog.ts` and `localization/generated-manifest.json`: deterministic generated output. Edit the input catalogs and run `npm run locales:build`.

Catalog filenames use the inherited `reviewed` convention; their notes distinguish authored translation review from independent human linguistic approval. No independent professional translator approval is claimed.

## Native request/rendering adapter

`src/hooks.ts` uses URL-only SvelteKit rerouting. `src/lib/locale/server.ts` resolves request-local state into `event.locals`; `+layout.server.ts` returns it to native context. Svelte renders message keys directly on the server and client. No rendered DOM translation, HTML text replacement or machine-translation network service is used. The document-language template token is filled from the resolved locale.

Explicit `/en/...` or `/bg/...` wins over conflicting query hints, cookies, Accept-Language and country suggestions. Old links negotiate to their equivalent localized path. Existing filter values, query strings, anchors and external/static/API destinations retain their contracts. The portable URL policy understands design mounts; this standalone application does not invent a cross-application FAB or assert mounted-dealer acceptance.

The UI separates visitor country and language from dealer identity, location and stock currency. Vercel's trusted country header supplies an approximate suggestion only; localhost uses the configured dealer country. No GPS, raw-IP storage or third-party geolocation lookup is introduced.

## Preferences and business-write boundary

A first-visit native dialog/mobile sheet is dismissible. Permanent header/menu/footer links reopen it. Explicit save performs a full navigation/reload so server HTML and client state agree. A same-origin SSR settings form remains usable without JavaScript. Explicit language URLs work when storage/cookies are blocked; country and dismissal cannot persist when all storage is denied.

Only `/api/preferences` accepts the tightly validated preference POST. Cookies are host-only, Path=/, HttpOnly, SameSite=Lax, Secure on HTTPS, with a 180-day maximum age. Dismissal records only prompt completion, not accepted country/language. Preference-dependent HTML is private/no-store, including CDN headers. Abort/version handling prevents a stale dialog request from navigating after dismissal or reopening.

Enquiries, CRM, database, payment, AI and notification writes remain disabled. Enquiry drafts, clipboard and browser sharing do not claim delivery. Admin is a separate English-only application and is not translated or deployed here.

## Verification commands

Use the retained lockfile and Node 22.12+ on the 22 line. Run checks and browsers serially against an explicitly owned server:

```powershell
npm run check:locales
npm run check:locale-source
npm run test:locales
npm run validate
$env:BASE_URL = 'http://127.0.0.1:6461'
npm run smoke:locales
npm run smoke
npm run smoke:typography
node scripts/overlay-proportions-smoke.mjs
node scripts/mobile-polish-smoke.mjs
```

`run-locale-qa.mjs` accepts an evidence label, base URL and optional explicit script names. It records logs, exit codes and source hashes, rejects source drift during the suite, and stops at the first failing script. For example: `node scripts/run-locale-qa.mjs production https://cars-template-auto-best.vercel.app qa-locale-http qa-locale-storage qa-locale-races qa-locale-journeys`.

Catalog compilation rejects duplicate/missing/stub messages, mismatched placeholders and ambiguous prose aliases. `check:locale-source` audits literal native text, accessibility copy and static key/alias calls; it is not a proof about arbitrary runtime data. Negative fixtures exercise that guard. Browser route/state matrices cover dynamic copy, request isolation, storage denial and interactions.

The older discovery/enquiry suites use an explicit returning-Bulgarian fixture; dedicated locale suites independently test first visits, both languages and conflicting preferences. URI assertions normalize only the supported language prefix where testing unchanged route semantics. Other tests assert exact localized URLs and preserved query/anchor values.

See [route/state coverage](COVERAGE.md), [handoff](HANDOFF.md), and the committed evidence records for actual run results and source/deployment identities. A successful local build is not a production acceptance result.
