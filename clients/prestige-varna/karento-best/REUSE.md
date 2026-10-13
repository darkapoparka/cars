# Reuse contract · Karento Best

## Status and authority

The native frontend is maintained in Cars `templates/karento-best`; the standalone repository mirrors that source. This source promotion is not a sixth-template fleet release. Keep the existing Cars template selection, approved lock, dealer manifests and 25 lead projects unchanged until the separate release integration. Do not establish two independently edited masters or another dealer generator.

The standalone repository root is the native app. Its `karento-best/` and `karento/` folders are preserved evidence only. The Cars checkout uses its existing sibling original library and `provenance/frozen-best` archive for preservation checks. These are not runtime dependencies and must not be edited to make tests pass.

## First-batch branding decision

Keep the reviewed black/white/grey palette and fixed light theme for the first 25 lead adaptations. Change the actual dealer's logo, imagery, identity and verified content. Do not automatically recolor controls from a logo and do not enable a day/night selector. This keeps the source's appearance consistent and makes dealer-specific visual regressions easier to isolate.

`dealer.reviewedAccent` is deliberately absent by default. An individually approved override accepts four six-digit hex values: `base`, `hover`, `contrast` and `soft`. `branding.ts` validates them and the server hook applies the corresponding existing CSS variables. No override means no injected color styles. Review contrast, hover/focus states and the complete visual matrix before approving a colored variant; syntactic validation is not a contrast audit.

## Content boundary

Edit the typed `dealer` object in `src/lib/content.ts` at build time, not mutable module state per visitor. Identity and logos are consumed by the shared shell/footer. Contacts and locations feed their mapped source sections. `copy` provides explicit overrides such as `home.hero`. Shared UI and translated reference copy use the typed catalogs in `src/lib/i18n`; custom dealer names, descriptions and facts remain supplied data. Follow [the localization guide](docs/I18N.md) for that boundary.

Inventory overrides currently address the preserved reference card titles and replace a complete `VehicleCardContent` record. Repeated appearances share the same override. These are template slots, not production vehicle identifiers. The Cars adapter must map verified inventory and real detail destinations into those slots; do not turn display titles into a production stock identifier or pretend the static sample detail page is an inventory database. Cards marked `sample: true` are not dealer stock.

The location interface supports explicit address, telephone, email and map destinations. Replace every visible sample location and contact, not just the header name. Provide a light-surface logo and a footer logo suited to the existing surfaces. Keep recognizable logo proportions and do not recolor a dealer's logo to manufacture uniformity.

`dealer.locale` sets the default language. The request resolves the explicit language or saved preference, and each layout owns its typed locale context. English and Bulgarian catalogs, Intl helpers and language-preserving links are implemented; this support does not qualify a complete dealer-language release. Audit all routes, supplied factual copy, wrapping, fonts, number/currency conventions and legal copy through the existing localization workflow. New languages require complete typed catalogs and their rendered checks.

`contentStatus` distinguishes `reference-demo` from `owner-reviewed`; it is an explicit content declaration, not automatic publication permission. Never mark captured claims as reviewed merely to pass an integration gate.

## Demo behavior is not a backend

Guest/member/owner selection is isolated preview state, with optional session storage, not authentication or authorization. Direct dashboard routes contain demonstration content, not protected records. Forms expose preview feedback rather than claiming a submitted enquiry. Booking, membership, checkout, wallet, saved stock, earnings and calculator examples must not be presented as operational services or real financial offers without the relevant integration and owner-approved terms.

Adapt rental/search/booking copy and controls to the sales/import/enquiry journey actually offered by each lead. Do not invent inventory, reviews, testimonials, team members, opening hours, contact details, guarantees or service areas.

## Promotion gates

Owner visual approval is required against the preserved source at mobile and desktop widths, including drawer, account states and core page journeys. Run the strict/type/format/unit/build/HTTP/browser gates from the README and retain the comparison receipt.

Before a lead publication, complete the existing Cars publisher/base-path integration, route/link audit, translated-content audit where needed, real assets and truthful inventory/content verification, enquiry destination validation, accessibility review and permission/licence checks. `locale.href` applies the compiled mount to ordinary internal links while preserving language, queries and hashes. Current local frontend evidence does not establish mounted dealer publication: asset paths, the publisher integration and the hosted route matrix remain separate release gates.

Register the approved sixth-template version and reuse it through the existing lead pipeline only after those source gates pass. The 25-lead batch itself has not been built or released in this repository change.
