# UK dealer locale readiness — 10 October 2026

This is a bounded audit for the ten researched UK dealer proposals. The owner requests six families and Cloudflare hosting after final template polishing. This record does not select a new template release or certify a hosted dealer.

## Profile foundation implemented

[The existing normalizer](../scripts/lib/client-refresh-normalize.mjs) recognises explicit `GB`, `United Kingdom` and `en-GB`. UK defaults are `en-GB`, `GBP`, `mi` and `United Kingdom`; supplied language, currency and units still take precedence. An explicit country code takes precedence over a formatting locale. Recorded UK country names also remain UK when the supplied display language is Bulgarian.

For a recorded `GB` business, a complete eleven-digit domestic phone number beginning with one zero gains `+44` in the contact link. The display number and original facts remain intact. International numbers, short numbers and extension-bearing input retain the previous treatment. Shape normalisation does not verify number ownership; use a verified business contact. Addresses accept the verified town and postcode as text, with separate directions and embed URLs.

Focused normalizer checks passed **7/7** under Node `26.10.0`: UK defaults, explicit-value precedence, retained tagged stock facts, UK contact conversion, limited phone handling, existing market defaults, and the existing ELIQ/KG Team profile cases. Command: `node --test --test-name-pattern='UK profile|non-UK profile|legacy ELIQ|dealer phone arrays' scripts/refresh-client.test.mjs`. No template build or deployment was run.

## Remaining family integration

The following observations describe the source inspected during this audit. Reconcile them with the owners' final polished releases before adapting dealers.

| Family | Existing boundary | UK work still required |
| --- | --- | --- |
| Auto Best | [Dealer locale configuration](../templates/auto-best/src/lib/config/locale.ts) accepts explicit language, country and currency. | [Mileage formatting](../templates/auto-best/src/lib/locale/formatters.ts) fixes kilometres. Match cards, details and filter thresholds to a reviewed UK display-unit contract. |
| Modern | Dealer market and contact configuration exist. | [Public market schema](../templates/modern/packages/marketplace-domain/site-config.ts) currently excludes GBP. [Vehicle specification](../templates/modern/packages/marketplace-domain/types.ts) fixes `mileageUnit` to `km`; the existing adapter converts known source miles to km. |
| Import | [Dealer configuration](../templates/import/src/lib/config/dealer.ts) supports explicit language, country and currency through its existing adapter. | [Auxiliary formatters](../templates/import/src/lib/utils/format.ts) retain `fr-FR`, EUR and km. Review the actual catalogue, detail and filter consumers. |
| App | [Dealer JSON/schema boundary](../templates/app/lib/dealer-schema.ts) permits GB, GBP and English. | [Adapter](../scripts/lib/app-dealer-adapter.mjs) reads km mileage only; a source-mile record without canonical km becomes mileage on request. Cards/details/filters label km. |
| Mobile | Contact, map, dealer storage namespace and actual feed currency are personalised by the existing six-family adapter. | [Native locale defaults](../templates/mobile/src/lib/locale.ts) retain Bulgarian, `en-IE` money formatting and EUR. The adapter replaces currency but leaves default language/formatting; inventory and UI use km. |
| Signature | [Native formatting](../templates/karento-best/src/lib/i18n/locales.ts) has English fallback and `en-GB`. [Fact adapter](../scripts/lib/client-refresh-signature.mjs) retains per-listing currency and mi/km tags. | Final approved source selection and combined publisher/runtime acceptance remain. A local draft is not a released sixth family. |

Keep source mileage tags and amounts intact. If using a canonical internal unit, convert only from a known unit and apply the same display/filter conversion everywhere. Do not label kilometre values as miles or GBP amounts as EUR. Confirm the raw record before treating absent mileage as zero.

## Visitor-country hints and release checkpoint

Auto Best's [server locale boundary](../templates/auto-best/src/lib/locale/server.ts), Modern's [request boundary](../templates/modern/packages/internationalization/request.ts) and Import's [server hook](../templates/import/src/hooks.server.ts) currently read a Vercel country header under a Vercel environment check. No Cloudflare country integration was found in the scoped template runtime sources. Add a trusted provider boundary at the Cloudflare integration checkpoint; retain explicit URL language and saved-preference priority. Visitor country must not change the dealer's verified GB location or listing GBP.

The lock inspected here approves October 9 sources for Auto Best, Modern, Import, App and Mobile. It has no `karento-best` entry. See [the Signature draft record](karento/SIGNATURE-LOCAL-DRAFTS-2026-10-10.md) and [hosting/release decision](HOSTING-AND-RELEASE-DECISION-2026-10-04.md), then reconcile the final source selection and six-family publisher before the first UK Cloudflare pilot.

At that pilot, verify English default, GBP, a known 60,000-mile listing across card/detail/filter views, manual language preference, `+44` actions, postcode/maps, mounted design routes and direct reloads. Provider state, source selection, runtime build and hosted acceptance are separate facts. This profile change does not modify template files, adapters, releases, registries or hosting resources.
