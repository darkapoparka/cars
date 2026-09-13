# Native storefront cleanup — 12 September 2026

## Review boundary

Repository: `darkapoparka/cars-template-carwow`. Owner review server: `http://127.0.0.1:6463`. An isolated production preview on port 6473 was used to distinguish development behavior from the built application.

Work remains on `main`, uncommitted and unstaged. No push, deployment, database migration, seed, production-data write or real enquiry submission was performed. The owner must visually approve before a commit or push.

The initial branch was `mobile/finalization-2026-09-12`, with substantial owner changes. The complete nonignored working tree, branch/status metadata and a binary diff against main were backed up outside the repository before switching to main. The backup pointer is `.audit/refactor-2026-09-12/baseline-location.txt`. Counts below compare with that actual starting working tree, not with main's older commit.

## Removed obsolete architecture

The raw HTML renderer was unreachable behind an empty legacy route allowlist. Its string-rendering, asset-injection, template-chrome and trusted-HTML wrappers were removed together with disconnected dashboard/component/data families. Historical dashboard URLs still redirect to native admin routes; unknown URLs use normal SvelteKit 404 behavior. Redirect and sort lookups reject inherited object-property names.

The unused `.template-ref` HTML kit, old Swiper distribution/initializer and Fancybox CSS were removed after importer checks. Attribution, asset licenses, source manifests and source lineage remain; the removed Swiper header is retained in `../legacy/removed-template-runtime.md`. The catalog seed remains an explicit tooling entry point, not dead runtime code.

Three hardcoded one-off mobile audit scripts were replaced by one configurable public-route audit. The obsolete DOM accordion adapter was removed: native Svelte components own accordion state.

The dependency checker resolves TypeScript `.js` aliases, `.svelte.js` rune modules, CSS URL imports and explicit script roots. This is important: a simple text-import scan can falsely classify active admin UI barrels as unused. The final checker is covered by tooling tests. It proves module reachability, not that every exported symbol or public asset is unused.

## Native data and state boundaries

Home, list, map and vehicle-detail builders now accept an explicit catalog and return native typed data. They no longer carry raw HTML, script URLs, template filenames or independent device guesses. An empty published catalog stays empty. The repository, not each presentation adapter, owns standalone fixture fallback. Home variants share a server loader without sharing their visual composition.

One request-local viewport context owns the 991/992px composition boundary and one live media-query listener. Home, inventory, detail and admin sidebar read it. Desktop-only home/detail styles share a tested loader with deterministic placement, deduplication, safe bootstrap serialization and a client resize path. Resizing from phone to desktop no longer leaves detail without its desktop stylesheet.

The mobile home is a composition rather than a combined layout/form controller. Search, import and location sheets are separate components. Buy filters have a per-mounted-sheet state object, not a module singleton. Buy and import drafts remain independent and survive closing/reopening their respective sheets.

## Lifecycle and accessibility repairs

Image fallback is event-based and reference-counted per element. It no longer schedules repeated timer/decode probes, mistakes a healthy transparent pixel for failure, or loses the remaining owner when one attachment unmounts. A successful replacement photo clears placeholder styling. Route image enhancement uses one capture listener and visits newly added subtrees rather than rescanning the whole document after mutations.

Pending sheet focus callbacks are guarded after disposal. Dialog triggers explicitly establish focus before opening, including pointer activation in WebKit. Native form controls retain their keyboard behavior. Financing FAQ controls are actual buttons with controlled content IDs rather than simulated `div` buttons.

Native main/skip targets were repaired on About, vehicle detail, presentation variants and admin login. A stale hardcoded vehicle-location destination now uses the same business map data as the rest of the site.

## CSS and visual preservation

The task did not authorize a redesign. The existing mobile and desktop compositions, icons, hero colors, cards, typography, spacing and sheet geometry were retained.

Extracted mobile-home sheets use a narrowly scoped shared stylesheet that preserves the old Svelte one-class specificity. Search, import and location before/after captures had zero changed pixels in the controlled extraction comparison. The financing FAQ native-button conversion also had zero changed pixels in its controlled capture.

Production review exposed a genuine inventory cascade problem: shared CSS chunks could override native route rules in a different order from development. Base, layout, retained template rules and native overrides now live in one ordered inventory-family stylesheet. A production regression asserts the inspected 44px dark search action and listing gutters after direct loading and visits through home, favorites and map.

Matching screenshots must use the same engine, viewport, data, storage, motion and scroll. Windows development/production captures showed some text-edge rasterization differences even with identical computed fonts, colors and geometry. These were inspected separately from actual layout differences; no reference images were overwritten to hide failures.

## Tooling and documentation

The dev wrapper resolves the physical checkout and forwards ordinary Vite host/port flags; its default is 6463. Browser installation is separate from each test run. E2E configuration supports an existing server, a dedicated production-preview port and explicit browser selection.

Workspace cleanup is a dry run by default. Applying it only targets named generated directories after validating the complete plan. Tracked descendants, workspace escapes, symlinks/escaping ancestor junctions and ordinary owner files are rejected. Audit evidence is opt-in. No destructive workspace cleanup was executed during this task.

The current instruction/design/architecture/content/QA documents were aligned. Source-era design and migration documents remain as clearly marked history rather than conflicting operating instructions. The documentation index explains the distinction.

## Evidence inventory

All paths below are local to `.audit/refactor-2026-09-12/`:

- `change-metrics.json`: actual starting-working-tree comparison and final Git state.
- `gates.json` and `gate-*.log`: source/tooling/unit/build/secret/asset gates.
- `before/`, `after/`, `visual-comparison.json`: route images, metrics and comparisons.
- `home-*-before.png`, `home-*-after.png`, `finance-faq-*.png`: controlled component-state comparisons.
- `final-e2e.json`, `final-e2e-*.log`: final production browser results; earlier failed or interrupted diagnostic runs are retained separately.
- `supplement-summary.json`: additional canonical-route checks in Firefox, WebKit and phone no-JavaScript mode.

The reusable entry points are `npm run audit:mobile`, `npm run check:architecture`, the unit/tooling suites and `npm run test:e2e`. See `../QA.md` for environment variables and exact release boundaries.

## Not established by this cleanup

This is a public-storefront and repository verification, not a claim of authenticated admin end-to-end coverage. Client tests intercept lead responses; they do not prove real staff delivery or provider credentials. A local production build does not prove a deployed origin, physical iOS/Android keyboards, VoiceOver/TalkBack or field performance. Sample inventory/reviews/editorial content does not become verified dealer data through a refactor.

Owner visual approval remains the next gate. Do not commit or push this working tree until that approval is explicit.
## Source consolidation, 13 September 2026

The owner requested integration of all preserved source into main and removal of obsolete branches. Existing implementation checkpoints are committed on main; earlier reports describing an uncommitted checkout are historical. Owner visual review and an approved Cars template release remain separate requirements.
