# 08 — Assets, performance and metadata

## Asset evidence and ownership

The static inventory contains 828 files totalling 176,890,853 bytes, including 225 JPG, 190 PNG, 275 WebP and 122 SVG files. Several generated PNG cutouts exceed 2 MiB. These totals locate cleanup opportunities; they do not establish the bytes downloaded by any one route.

Build an asset ledger with path, purpose, rendered consumers, intrinsic dimensions, bytes, format, provenance/licence and whether the file is a runtime derivative or editable source master. Include references from TypeScript, Svelte, CSS URLs, raw templates, manifests and Cars packaging. Do not delete an image because it was absent from one component-import search.

Keep approved artwork. Use SVG for suitable logos/icons; WebP/AVIF/JPEG/PNG choices should follow transparency, quality and browser requirements. “Everything must be WebP” is not a correct cleanup criterion. Move unused editable/source variants out of the served runtime tree only after reference and provenance checks.

## Image rendering policy

Each active raster image needs appropriate source dimensions, intrinsic width/height or a stable aspect ratio, responsive `srcset`/`sizes` where useful, sensible loading priority and truthful fallback content. Do not request a multi-megapixel cutout for a small card. Do not lazy-load the actual first-screen LCP image; do not preload every possible hero/menu image.

The homepage currently preloads two specific cutouts in `home-five-page-data.ts`. Measure whether those are the real first-screen assets in each viewport/mode before retaining that policy. A hidden desktop tree can still cause work or image requests on mobile; verify the network rather than assuming `display:none` prevents them.

Card/gallery fallback imagery must not misrepresent a different vehicle. Missing-source fixtures should use an honest placeholder and retain accessible labelling. Generated banners containing visible text require equivalent accessible names without duplicate visible headings or repeated announcements.

## Font policy

Document storefront versus admin font scope and the actually shipped weights. Preserve Cyrillic coverage and avoid synthetic weight/style surprises. Preload only fonts used above the fold when the measurement supports it. Do not introduce another body font as part of component cleanup. Keep font licences with source provenance; font binaries are not part of the downloadable audit package.

## CSS and JavaScript

The uncompressed legacy `static/assets/app.css` is 397,415 bytes. Removing it from a migrated route must be proven with actual network/build output, not inferred from deleting one import when another shell still loads it.

The main opportunity is retiring unused runtime systems: HTML rewriting, body-script replay, unused vendor widgets and hidden viewport-specific controllers. Avoid splitting every tiny component into a dynamic import. Route-level code splitting and explicit optional heavy features are usually clearer. Check bundle contents before claiming an icon dependency contributes its whole package to the client.

Inspect serialized load payloads. Do not send a complete HTML document, unused desktop/mobile view models or the whole fixture catalogue when a route only needs a smaller public result. Preserve SSR-visible essential content.

## Measurement and budgets

Phase 00 establishes production-build transfer baselines for home, inventory, detail and import. The initial isolated build attempt was not a valid production-performance baseline; see verification evidence. Capture compressed JS/CSS, initial image/font transfer, request count, load-data payload and layout shifts under a documented browser/network/device profile.

Recommended project gates after a valid baseline exists: no unexplained increase greater than 5% in a migrated route’s initial JS/CSS; no new duplicate framework/vendor runtime; no first-screen image without intrinsic sizing; no unnecessary cross-origin embed on initial render; and no unexpected horizontal page overflow. A justified accessibility or feature cost can be accepted explicitly rather than hidden by raising the budget.

Measure Core Web Vitals and interactions in a realistic environment, and field data after a release has real traffic. A local screenshot or a Lighthouse score is not a guarantee of field performance. Do not record aspirational performance targets as achieved results.

## Metadata and routing

Use explicit typed page metadata and `<svelte:head>` rather than extracting titles from imported HTML and resetting them imperatively. Define canonical base URL, page title/description, social image, locale and indexing policy in the safe site/page configuration.

Preview deployments need an intentional indexing policy. Live pages need the approved dealer domain, not the sample domain inherited from `daynight.ts`. Sitemap publication rules must agree with public vehicle/blog/agent availability. Do not assign every page a new `lastmod` merely because the site was rebuilt; use actual meaningful update data when available or omit unsupported precision.

Preserve canonical redirects and supported query semantics. Test unknown vehicle slugs, missing content and 404/error pages. Structured data, when supplied, must reflect real approved facts; do not carry synthetic ratings or inventory availability into a live dealer release.

## Locale and mounted compatibility

Test Bulgarian and English head/body output, internal/external/tel/mail links, alternate locale navigation, JSON-LD and static asset URLs. A mount prefix must be handled by the supported packaging/base-path contract, not added manually to a few links. Native buttons/links that force arbitrary href values through a route cast require explicit internal/external tests before broad reuse.

Standalone `/` verification does not establish `/variant-2/` correctness. Cars owns that separate release qualification. Asset moves, source-shape changes, route groups and removal of template rewrites require a compatibility checkpoint there before promotion.
