> Visual replacements from this pass were rejected. See [VISUAL-RESTORATION.md](VISUAL-RESTORATION.md) for the recovered homepage. Earlier screenshots and the isolated build do not describe the restored state.

# Implemented changes and ownership

## PDP and financing

`src/lib/components/vehicles/VehicleFinancing.svelte` owns the compact financing entry and native calculator sheet. `VehicleSeller.svelte` owns the matching seller entry. Existing generated decorative artwork is reused; this implementation did not generate new AI images. Brand names, city, prices, calculator values and actionable labels remain live Svelte content.

The PDP now has a full-width responsive image, clearer price/heading spacing, readable information tabs, and a consistent call/inspection dock. Duplicate mobile summary actions are removed. The calculator remains functional, with an explicit principal-only disclaimer; no interest rate or credit offer is invented.

`src/lib/data/finance.ts` owns supported terms, normalization, calculations and validated URL selection. The calculator sends `vehicle`, `down_payment` and `term` into contact. The contact summary's edit link returns those values to the correct PDP and financing section. The PDP loader validates them again before restoring the calculator. Invalid amounts/terms do not become accepted selections.

`VehicleImageFallback.svelte` is reused by listing cards and the PDP. Network/decode failures preserve layout and navigation rather than showing a broken image or unrelated replacement. The attachment also detects failures that happened before hydration.

## Search and budgets

`VehicleQuickSearch.svelte` is now a small presentational trigger. `SearchBox.svelte` and the inventory page use the same `VehicleSearchDialog.svelte` and `QuickFilterSheet.svelte`, rather than maintaining a separate homepage filter application. URL parsing, draft normalization, range checks, field choices and labels have shared owners in `data/listing.ts` and `data/filter-fields.ts`.

`data/discovery.ts` defines the budget bands once. Counts and hrefs are produced from the same predicates. An explicit exclusive-lower-bound flag prevents the EUR 60,000 and 70,000 boundary mismatch. Compact interval copy is formatted from these values, not written independently into each component.

`config/discovery.ts` owns preview limits, featured counts, presets and year bounds. Available inventory facts remain record-derived. Curated policy and fixture data are intentionally explicit; they are not duplicated business rules in view components.

## Enquiries and overlays

The Sell and Import entry cards use matched control rhythm. Both enquiry flows now use the same dark panel, field and footer surfaces. The import no-link path is available on the entry page and homepage import tab. Required vehicle identity is trimmed and validated; field errors are specific and accessible. Year limits and photo limits have explicit owners.

Drafts are not silently submitted anywhere. Clipboard denial and sharing cancellation retain the draft. Photo type/size/count checks, removal, preview URLs and cleanup remain covered by the existing tests. Device share/clipboard functions are mocked in automation; actual native application delivery is not claimed.

`lib/ui/overlay.ts` owns a reference-counted, reversible document scroll lock and tab containment. Nested pickers do not unlock the parent. Cleanup restores the live trigger and document state. `lib/ui/dock.ts` uses a reversible ResizeObserver attachment to reserve the actual mobile dock height when labels grow or wrap.

## Media, discovery cards and supporting pages

`scripts/export-images.py` produces width-specific WebP exports and `data/image-media.ts`. Existing asset identity/provenance is retained; components select appropriate resources through native `picture`, `srcset` and `sizes`. `ArtworkRegion.svelte` and `FeatureArtwork.svelte` share the same crop/media implementation. Vehicle, editorial and selected-contact thumbnails use responsive resources.

Body types now render one intended image and one centered live label per tile. Brands use the same mobile expansion control and card rhythm. Hidden extra choices do not request mobile artwork until needed. Desktop no longer receives the mobile baked-card image alongside a second vehicle image.

The homepage keeps its browse and ownership entry points while omitting the repeated lower mobile service grid. The mobile footer is compact. Contact and About reuse click-to-load showroom maps with an always-available directions link. Map loading requires an explicit interaction; third-party iframe content itself is not certified by the application's automated tests.

`config/brand.ts`, `data/services.ts` and `data/home-services.ts` own identity, social profiles, location and service definitions. UI labels and design constants are not artificially turned into a CMS or a generic schema engine. Responsive geometry remains local where it belongs; repeated business facts and filter policy do not.

## Quality and production safeguards

`npm run check` fails on warnings. `check-assets.mjs` validates references, file ownership, signatures and non-empty media without asserting a magic total. Static scratch output is archived outside the served tree; original evidence is not erased.

The quality command includes the existing smoke suites, homepage hierarchy, `mobile-quality.mjs` and `mobile-resilience.mjs`. Additional `capture-mobile-changes.mjs` and `mobile-render-check.mjs` provide visual, text-growth and slow-network evidence. These are ordinary project scripts, not a new test framework.

The cookie transitive dependency is overridden to compatible 0.7.2 rather than accepting the audit command's obsolete downgrade suggestion. The current registry audit reports zero known vulnerabilities; this is not a guarantee that vulnerabilities cannot exist.

SvelteKit now owns CSP generation in `svelte.config.js`. Its runtime bootstrap receives a nonce/hash; arbitrary inline scripts are not permitted. Development WebSocket sources are excluded from production. Inline styles remain allowed for existing declarative crop/custom-property styles. Security headers, legacy redirects and preview noindex safeguards are retained.

Production validation runs against an isolated copy under `J:\cars\runtime\auto-best-production-check-20260912`, not the live dev server's generated files. Port 6462 is the local built-preview check; port 6461 remains the development URL.

## Sign-off still requiring human/device access

Physical iPhone Safari and Android Chrome, native keyboard and upload picker behavior, VoiceOver/TalkBack, and native sharing to the actual recipient are not signed off by viewport/WebKit automation. Final artwork/content approval and any public-domain deployment remain separate. Sample inventory and unverified identity are not promoted to live stock by this implementation.
