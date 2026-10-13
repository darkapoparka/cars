# Template contract

## Product and release boundary

The product is a single-dealer showroom with two responsive journey compositions, EN/BG locale support and mounted-preview support. The Cars `templates/app` subtree is canonical; the standalone repository carries review/publishing history. Source improvements do not update the Cars release lock, deploy a site or refresh existing clients automatically.

A dealer release supplies verified identity, contacts, currency, stock and import listings. Runtime public files are validated by `lib/dealer-schema.ts` before development/build; private fields are rejected. Demo records stay separate from dealer stock. The reference comparison panel is template-only. Prices, inventory availability, service terms and finance examples are not commitments by a real dealer.

## Preserve the accepted appearance

Use the existing StyleX tokens, compiled styles, assets and component composition. Do not introduce a second styling framework, regenerate dealer identity, replace manufacturer emblems with generic icons or restyle during architectural maintenance.

On phones, retain the illustrated Buy/Sell/Finance/Services tabs, their active underline and compact scrolled state. Keep the configured proportional dealer logo and search entry, manufacturer rail, promotions and car feed in their existing positions. The dock remains Home, Cars, Services and Menu; the alternative journey retains its own Services hub. Saved cars remains available through Menu and secondary save controls.

Mobile car cards keep the beside-photo composition, small make label, single-line year/model title, prominent price and horizontally scrollable facts in the text column. Preserve all fact text and accessible names. The card wishlist button stays hidden on phones without reserving its space. Compact pill, tab and photo labels stay on one line, truncating inside their slot while keeping adjacent icons/counts visible. Preserve 44px control targets and safe-area spacing.

Desktop starts at 1100px. Keep the bounded white shell, grey outer gutters, configured logo/header actions and Buy/Sell/Leasing/Services navigation. Buy keeps its existing graphite hero and Make/Model/Budget controls. Home uses four photo-first stock cards; Cars uses three cards beside its sidebar at 1100–1399px and four from 1400px. Keep result count, removable selections, Clear all and Sort in their existing shared row. Desktop filter categories use concise labels and restrained helper copy; retain the compact finance card below the budget controls and its existing calculator drawer. Preserve the buy box, detail/gallery split, Viewing/Save actions and hidden desktop dock. Desktop fact badges wrap only as needed.

Home and Cars use the same search dialog: full-height and top-aligned on phones, centered on wider screens, with VisualViewport keyboard handling. Applying a suggestion preserves independent inventory criteria and ordering. Clear all removes owned URL refinements without dropping unrelated campaign parameters. Back from a vehicle returns to its exact collection entry.

Keep the shared modal boundary for initial focus, nested background isolation, scroll locking, keyboard containment, Escape, browser Back and focus restoration. Opening a filter starts at the selected category without an unsolicited pan. Service details keep their photograph, explanation, editable make/model details and enquiry draft in the existing drawer flow. Welcome remains optional and scoped to dealer/mount.

PDP photo albums keep Exterior, Interior and Close-ups, with actual counts, current phone target sizes and the full-size viewer. Preserve the hero, muted facts, information tabs, record disclosures and current price/viewing panel. Missing facts must not become zero-price offers, low-mileage claims or fabricated finance discounts.

## Client configuration

Identity, contacts and locale policy: `lib/dealer.json`. Stock: `lib/dealer-inventory.json`. Imports: `lib/dealer-import-inventory.json`. Campaign/service copy and images have their own explicit configuration modules; see README. Preserve existing property meanings and use only public content.

Numeric controls retain the reference bounds unless real dealer stock requires expansion. Classics, cheaper vehicles, high-mileage stock and newer model years must remain selectable. Recently added uses optional actual `listedAt` dates, with stable source ordering for unknown dates. Unknown numeric values sort last and remain visible in an unfiltered catalogue.

All enquiry flows remain drafts. Do not invent submission success, instant valuations, approved finance, completed reservations, verified inspection results or contact destinations. Real integrations require separate implementation, error handling, consent/data-retention decisions and end-to-end delivery checks.

## Verification

Run `npm run check`, production route checks and `npm run test:browser`. Compare affected pages and open dialogs at 320px, 390px, 1100px and 1440px in both locales. Browser emulation does not replace real iOS/Android keyboard and touch acceptance. Review client content and permissions before publishing.

Earlier contradictory polish instructions and dated QA narratives are historical, not an active work queue. Their original versions remain in canonical Cars history and the pre-refactor PRO snapshot. New evidence belongs in ignored runtime output; the current contract above governs architectural maintenance.

Manufacturer emblems and dealer logos follow [App asset standards](../../docs/APP-ASSET-STANDARDS.md); master and client previews share the DealerBrand rendering path. Preserve original Drive24 or configured dealer identity and recorded asset provenance.
