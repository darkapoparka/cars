# Owner-rejected visual replacements — homepage recovery

The owner rejected the replacement of approved controls and section styling. The prior automated QA did not approve those design changes.

Recovered source: `J:/cars/runtime/auto-best-mobile-before-20260912.zip`. All 119 entries match the hashes in `baseline.json`. The current source was separately backed up before restoration to `J:/cars/runtime/auto-best-visual-recovery-20260912/before-visual-restoration.zip`.

Restored from saved component markup/styles: original generated body-type cards and image-based All Types control; original brand expansion control and 108px tiles; the separate six-row homepage search; original lower service artwork and footer styling. Original generated images were recovered from the provenance archive, not regenerated. Responsive desktop hiding, accessible expansion names, shared filter parsing and scroll cleanup remain in place.

YouTube is a mobile-only correction to the owner's earlier direction: one rounded black container around heading and videos, with only YouTube visible in the heading. The saved pre-finalization VideoSection file itself already had the older two-line heading, so this is not claimed as a byte-identical restoration of that component. Desktop video styling remains unchanged.

This is a scoped homepage restoration, not a whole-template rollback. PDP, finance and enquiry-page work was not reversed in this recovery. No commit, push or public deployment was performed.

Source files changed: `BodyTypes.svelte`, `BrandSection.svelte`, `SearchBox.svelte`, `VehicleQuickSearch.svelte`, `TrustActions.svelte`, `Footer.svelte`, `VideoSection.svelte`, plus the recovered static images. Home-search regression selectors now point to the original independent dialog, rather than requiring the rejected shared layout.

Verification: `scripts/verify-visual-restoration.mjs` checks 320/390/430/1440px, artwork loading, 3-to-8/12 expansion and collapse, desktop artwork isolation, six-row mobile search, scroll/focus restoration, video opening/closing, page exceptions and horizontal overflow. Captures and logs live under `J:/cars/runtime/auto-best-visual-recovery-20260912/`.

The earlier production-copy hash verification and screenshots describe the pre-recovery state, not this restoration. The live source preview is port 6461. Do not use the stale isolated 6462 build as evidence for the recovered homepage.
