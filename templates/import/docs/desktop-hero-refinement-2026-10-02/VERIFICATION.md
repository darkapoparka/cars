# Desktop hero refinement — 2 October 2026

Home and Inventory now use Auto Best's existing side-facing vehicle cutouts. Their visible fronts sit 24px clear of the shared discovery panel, with one baseline 32px above the hero bottom. Positioning derives from measured artwork bounds and the shared panel width instead of independent page offsets. The original cutouts remain as provenance.

The quick-filter row has even 8px gaps, including Coupe → All filters. At 768–900px, All filters fills its existing two-column cell. Wider desktop rows keep basic filter labels intact when selected summaries need to truncate. Home and Inventory share a round 44px Search action inside the search field.

## Screenshots

| View                                   | Evidence                                  |
| -------------------------------------- | ----------------------------------------- |
| Inventory before, 1440px               | [Before](before-inventory-1440.jpg)       |
| Inventory after, 1440px                | [After](after-inventory-1440.jpg)         |
| Home after, 1440px                     | [Home](after-home-1440.jpg)               |
| Inventory after, 1920px                | [Wide desktop](after-inventory-1920.jpg)  |
| Inventory after, 768px                 | [Narrow desktop](after-inventory-768.jpg) |
| Actual Auto Best dev reference, 1440px | [Reference](reference-auto-best-1440.jpg) |

## Verification

- Whole-source Svelte check: 0 errors, 0 warnings. The final toolbar changes were CSS-only; its formatting, lint and the production build were repeated after those changes.
- Scoped formatting/lint, architecture and image signatures passed. The image check validated 868 local images.
- Production build passed under pinned Node 24.21.0 in the reused frozen QA candidate, without competing with the canonical dev server's build output.
- 15 existing browser checks passed against the final built preview: six desktop search checks, three inventory control checks, two BG/EN hero-frame checks and four Home/Inventory accessibility checks across desktop/mobile.
- 23 hydrated browser layout states passed at 320, 390, 768, 900, 1024, 1280, 1440 and 1920px. Wide desktop Home/Inventory were checked in both BG and EN. No horizontal overflow was observed. Artwork fronts remained within 0.04px of the intended clearance/baseline and filter gaps were 8px wherever controls were visible.
- At 320/390px the desktop panel is hidden. Below 1200px the decorative cars are hidden and both image sources remain the inline GIF fallback. These task changes do not modify mobile controls; independent mobile/service work is preserved.
- Both new WebPs are unchanged byte-for-byte copies of the Auto Best references, totaling 149,322 bytes. Their hashes and rendered measurements are in [geometry-summary.json](geometry-summary.json); task source hashes are in [source-proof.json](source-proof.json). [verification.json](verification.json) records the actual check results.

The canonical Import dev server remains on 6790, and Auto Best remains on 6461. No dealer publication or template release is part of this change. The temporary QA candidate is retained because automatic approval review rejected cleanup in the earlier discovery-box turn; no deletion workaround was attempted.
