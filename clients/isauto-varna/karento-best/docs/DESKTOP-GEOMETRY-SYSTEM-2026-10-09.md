# Desktop geometry and density

The owner approved a compact desktop pass on 9 October: 32px collection headings, 28px FAQ groups, and shared card, panel and spacing tokens. Marketing section headings remain 38px, breadcrumb page titles 40px and heroes 48px. Urbanist, artwork, four-column catalogs and rounded pills are retained.

See [Desktop final verification](DESKTOP-FINAL-VERIFICATION-2026-10-09.md) for the current source and checks. The geometry and controls sections below retain the evidence from their preceding snapshots.

## Ownership and breakpoint

`src/lib/styles/desktop-geometry.css` owns the shared geometry definitions. It is imported through `desktop-pages.css`, alongside `desktop-typography.css`. Definitions and consumers apply only at 992px and above. Base styles, mobile tokens, mobile stylesheets and visitor behavior are preserved.

Components use named tokens for repeated geometry and ordinary spacing tokens for composition-specific offsets. A new component should consume these definitions rather than add a local numeric fallback. Semantic hooks can attach a role to existing markup; no new wrapper component or runtime state is required.

| Role                                  | Current desktop value                                                 |
| ------------------------------------- | --------------------------------------------------------------------- |
| Catalog/editorial card corners        | 16px                                                                  |
| Catalog card body                     | 20px padding, 16px gap                                                |
| Narrow vehicle grid body, 992–1199px  | 16px padding                                                          |
| Panel/horizontal card body            | 24px padding                                                          |
| Grid gap / panel gap                  | 24px                                                                  |
| Collection section padding            | 64px block                                                            |
| Compact content section padding       | 48px block                                                            |
| Independent marketing section padding | 72px block                                                            |
| Heading-to-content gap                | 32px; compact variant 24px                                            |
| Form control                          | 44px minimum height, 12px corners                                     |
| Repeated card action                  | 34px minimum height, 6px by 16px padding, pill corners                |
| Section browsing action               | 40px minimum height, 8px by 16px padding, pill corners                |
| Panel/primary action                  | 44px minimum height, 8px by 16px padding, 12px corners                |
| Newsletter field and submit           | 44px height, 8px gap, aligned in normal flow                          |
| FAQ disclosure                        | 56px minimum height; longer questions may grow                        |
| Compact panel internal gap            | 16px; Plans retain 24px panel padding                                 |
| Pill                                  | 999px corners; compact fact and display badge sizes remain purposeful |

The scale also names 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 56, 64 and 72px offsets. These are design choices, not accessibility minima or a demand that every component share the same dimensions.

## Variants and composition

- Vehicle cards retain 3:2 photos; News retains 16:9; Shop retains contained product artwork. A shared card radius does not require identical image ratios.
- Horizontal/list cards use the panel density role. Their layout remains distinct from a four-column catalog.
- Repeated card CTAs use `desktop-card-action`. Shared inline-flex alignment, padding and height keep labels centered without repeating geometry in components. Compiled inline News variants use a `.card-news .card-button .btn` bridge to the same role. Card actions are smaller than section browsing pills and primary form actions.
- `desktop-section-action` uses the 40px browsing role and 13px/500 typography. `desktop-panel-action` uses the 44px primary role and 14px/600 typography; the `--spread` variant preserves Membership's justified arrow, and `rounded-pill` preserves deliberate pill variants.
- Both newsletters consume `desktop-subscribe-controls`; the submit stays in normal flow. Noninteractive promotional labels consume `desktop-display-badge`, avoiding full button padding.
- Detail accordion summaries use 16px by 20px padding; expanded content uses the 24px panel padding.
- `desktop-collection-section` and `desktop-marketing-section` apply full section spacing only to independent sections. Split headings, nested detail/account layouts, hero frames and calculator artwork are not assigned full-section padding.
- `desktop-section-heading` owns the gap below the whole heading/control row. Legacy grid top margins are removed only at the desktop breakpoint where that row already provides the gap.
- Dashboard, account, terms, supplier and contact surfaces reuse the same shared shell tokens. Existing focused field states and small notice/sidebar variants stay distinct.

## Preventing drift and preserving mobile

`npm run check` includes both typography and geometry architecture guards. Geometry checks reject duplicate shared definitions, undeclared references, local fallbacks and token definitions or consumers below the desktop breakpoint. The card-action ownership guard also rejects local sizing/alignment overrides on explicit consumers, including aliases such as `.card-button .btn`, while allowing colors, focus, wrapper layout and mobile rules. Fixtures exercise ownership independently of the numeric choices.

The geometry guard accepts whitespace and line breaks inside `var()`, so formatting cannot bypass the breakpoint, fallback or undeclared-token checks.

Source preservation receipts compare scripts, markup excluding intended role classes, and every base/mobile CSS declaration against the frozen preimage. Rendered checks compare the same routes at matching desktop widths; 320px and 390px checks verify unchanged mobile geometry. Geometry evidence is retained in ignored `.runtime/evidence/desktop-geometry-2026-10-09/`; the final controls pass is in `.runtime/evidence/desktop-final-2026-10-09/`.

This is maintained local frontend work. It does not change reference provenance, template locks, dealer copies or hosted deployments.

## Verification of the geometry pass

- 102 owned Svelte/CSS files preserve their base/mobile declarations; all 21 static stylesheet hashes match the preimage. Seven concurrently edited experimental `/2` route files are excluded from this pass.
- All 39 layouts were rendered at 1024px, 1200px and 1440px: no horizontal overflow, clipped headings, broken visible images, role-size mismatches or widget errors in the 117 recorded views.
- Nine representative routes match the preimage's mobile geometry and typography at 320px and 390px, with no horizontal overflow in the 18 views.
- 63 routes retain their main content and image order; five unknown/prototype-name paths return HTTP 404. FAQ expansion, News category/search/reset and Shop filter-dialog dismissal were exercised in the browser.
- All 70 tests, the isolated production build, shared-token guards and formatting of the changed files pass. The full project check has no errors and one existing warning in the concurrent `/2` route; full-project formatting reports 18 warnings outside the files changed here.

Matched screenshots show before on the left and after on the right. Their source captures, crop anchors and hashes are retained alongside the receipts in the evidence directory.

## Final controls pass

- Restored the compact vehicle CTA from the accidental 40px minimum to the 34px card-action role. Seven vehicle/product/editorial card families delegate geometry to the shared owner; duplicated component sizing/alignment blocks are removed.
- Standardized panel CTAs, section browsing actions, Plans spacing, Pricing FAQ disclosures, Subscriber and Footer newsletter controls. This final pass owns 28 Svelte components and the shared geometry stylesheet.
- All 29 owned files preserve base/mobile CSS against their genuine preimages; all 28 Svelte files preserve scripts and non-class markup. Earlier mobile/localization edits and experimental `/2` changes in the shared checkout are recorded separately. The older 6478 preview is not a clean baseline for those concurrent changes.
- Rendered all 39 layouts at 1024px, 1200px and 1440px: 117 views and 787 control measurements, with no horizontal overflow, clipped headings/actions, broken visible images, widget errors or collection/FAQ role-size mismatches. The final newsletter normal-flow correction is additionally verified at all three widths.
- Known/alias HTTP compositions retain status, title, header, heading and image sequence; nine detail aliases include an earlier localization correction from `[object Object]` to `Rent This Vehicle`. Unknown routes return HTTP 404.
- The final Svelte check reports zero errors and warnings. All 83 tests, scoped formatting, typography/geometry guards and the isolated production build pass. The shared geometry owner defines 37 tokens; typography retains 27 roles.
- Nine representative routes, including Header and Footer controls, match their genuine preimages at 320px and 390px: all 18 settled measurements are identical, with no horizontal overflow. Class hooks are measured consistently on both sides.
- Full-project formatting still reports 18 files outside this controls pass; the owned files pass scoped formatting.

For evidence comparisons, concurrent mobile stylesheets are frozen identically into both derived previews, including their compressed variants and asset metadata. Maintained mobile source is not changed by this pass.
