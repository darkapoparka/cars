# Lead branding and native template integrity

Effective for this remediation: 11 October 2026. This overrides older instructions to extract a dealer colour and apply it to a template.

## Default boundary

Personalize dealership identity, approved media, contacts, inventory, copy and metadata. Keep the selected template's hero, banner, section, button and theme colours. Do not derive interface colours from a logo, a vehicle photo, business.accent, or an old dealer palette. The shared Modern and Import adapters no longer inject business.accent. A genuine commissioned redesign is a separate, explicitly reviewed source change, not an automatic lead-build option.

## One asset pack, two surfaces

Generate the requested independent-proposal identity with the available image-generation tool. Retain the recognizable business name, a transparent wordmark master and a compact mark. Derive near-black/on-light and white/on-dark rasters from the same alpha, not separate generations. Keep the original sourced logo and its provenance. Deliver WebP primary/mark pairs, a real square icon, favicon and share metadata. The raster source resolution is recorded; an enlarged export is not evidence of additional source detail. Record the actual tool and generation identifier. Do not claim an Image Gen version that the tool did not expose, and do not relabel font-written SVG or old low-resolution source logos as a new generated identity.

Use a content-versioned /dealer-brand/v2-PACK_ID/ namespace so browsers cannot keep an old logo under an unchanged cache key. Every native component must keep its explicit light/dark surface selection. Do not recolour the background to hide a poor logo. Original branding and the generated proposal are distinct evidence; neither implies endorsement by the dealership.

## Executable gates

The reusable implementation is scripts/publishing/lead-branding.mjs. A required .cars-branding.json binds all 60 variant asset entries, their hashes, exact template palette pins, native colour sequences, versioned consumers and preserved factual source hashes. Varna compilation checks it before adaptation and again after metadata/reference adaptation. The ordinary publisher checks manifests marked branding.required; new Varna lead manifests require it by default. Missing/changed rasters, missing dark/mark variants, repeated application, stale consumer URLs, changed stock/facts, mismatched palette pins and recoloured palette fields fail closed.

Regression tests decode all ten real generated inputs, compare exact alpha across surface pairs, check near-monochrome opaque pixels after normal resampling, verify icons, and exercise failure cases. This is not a substitute for hosted visual inspection at 320, 390 and 1440 pixels, including header, hero, footer, menus, alternate homes, both locales, images, FAB and Admin. No outreach status is upgraded by compilation or deployment alone.

## Cloudflare footprint

The composed delivery retains proof of all six genuine framework applications. The public Worker contains the unchanged compiled Auto Best handler plus the existing routing handler; Modern, Import, App, Mobile and Signature remain five internal services. There are six active Workers, not seven. The request, locale, assets, cookies and execution context are passed through; this is not a static replacement or an omitted design.

Composition verifies identical dealer/source/brand identities, preserves both source modules, rejects conflicting assets, keeps deployment below the existing Free size budget, and passes an actual Wrangler dry run. One verified delivery archive per dealer replaces seven separate transfer requests. Existing public URLs and Vercel aliases are not renamed. Retire an old internal Auto Best Worker only after hosted acceptance and a service-binding audit proves nothing references it. Keep source and rollback evidence; do not delete unrelated templates, workers, caches, local history or worktrees.
