# Native EN/BG localization

Carwow uses request-local locale state and Svelte-rendered messages. Supported public URLs are `/en/...` and `/bg/...`; a mounted build uses `/variant-3/en/...` and `/variant-3/bg/...`. `DAY_LOCALE_BASE=/variant-3` is a build setting, not a hardcoded production prefix. Admin retains the existing English authentication/database boundary.

Catalog ownership:

- `localization/common.json`: reusable preferences, validation and route metadata.
- `localization/template.reviewed.json`: authored Carwow interface and editorial copy, with exact source aliases for immutable template data.
- `localization/dealer.reviewed.json`: dealer facts/transliterations. Visitor country never changes these facts or inventory currency.
- `localization/catalog.reviewed.json`: reserved stock/catalog-owned additions. Stock identifiers and user-entered data are preserved.
- `src/lib/locale/config.ts`: explicit dealer and enabled-language configuration.

Use `i18n.t(key, parameters)` for direct messages, `i18n.text` for known immutable template copy, `i18n.spec` for controlled stock taxonomies, and `i18n.stock` for units. Parameters are data, not translated markup. Unknown immutable copy fails loudly. Never pass arbitrary customer/CMS prose through immutable-copy lookup. Internal links use `i18n.href`, assets use `i18n.asset`, and preference APIs use the mount-aware endpoint helper. There is no translated HTML/DOM overlay.

`npm run check:localization` checks generated drift, catalog parity, literal native bindings and dealer isolation. Counts are inventories, not proof of route or interaction coverage. `npm run test:localization` runs policy and catalog-negative tests; application adapter/isolation tests run in the normal unit suite. `node scripts/build-locales.mjs` regenerates catalogs using the installed formatter. The build/deployment commands reject stale catalogs.

Browser verification is serial and uses an already running owner preview; the scripts never start or stop servers:

- `node scripts/localization-browser.mjs`: EN/BG × 320/390/1440 route matrix, assets, HTML language, manual control, visible text, links, document overflow and tab-text containment.
- `node scripts/localization-interactions.mjs`: preferences, query/hash preservation, focus, menus/dialogs, demo forms/errors, blocked storage, no-JS and stale response race.

Set `LOCALE_ORIGIN`, `DAY_LOCALE_BASE`, and optionally `LOCALE_EVIDENCE` for mounted/public verification. Evidence goes to `.audit/localization/<label>/`. Build standalone with `npm run build:preview-node`; build the mount with `DAY_LOCALE_BASE=/variant-3` in the environment. Run the existing Node preview wrapper with the appropriate HOST/PORT/ORIGIN. Do not bypass any denied listener restart.

Preference writes are same-origin only, limited to the preference schema and bounded request bodies. Saved cookies are host-only, Path=/, HttpOnly, SameSite=Lax, bounded lifetime and Secure on HTTPS. Dismissal writes only the prompt cookie. Public business POSTs fail closed before enquiry/CRM/AI/database handlers. Native auth/session/device handling stays downstream and HTML/data responses are private/no-store while retaining User-Agent variation.

See HANDOFF.md for the exact release, verification results, retained unrelated work and deployment status. Translations are authored and programmatically/browser reviewed; no independent human linguistic review is claimed.
