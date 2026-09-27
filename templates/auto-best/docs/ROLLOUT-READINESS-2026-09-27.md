# Auto Best readiness and dealer rollout — 27 September 2026

## Scope

Latest Auto Best mobile polish. The two generated wide Sell/Import illustrations were reviewed and removed from active placements because their angled composition did not fit the template. The live fleet has 25 registered origins, 24 Cars-owned dealer sources and one independent Al Reef repository. No dealer files or public aliases were changed in this audit.

## Readiness

The current master has tested EN/BG responsive controls, search/filter and enquiry journeys. This is not a claim of flawless UX, physical-device testing, owner acceptance or a promoted dealer release. Home Sell/Import cards, service illustrations, the Sell campaign banner and centered mobile service heroes now use newly generated v3 front-facing compositions. Heroes render one complete transparent scene instead of duplicated side cutouts. The earlier angled v2 scenes are retained only as provenance, not rendered. New prompts, sources and checksums: [front-facing artwork](../provenance/service-front-art-2026-09-27.json). Prompt and asset provenance: [service-banners-2026-09-27.json](../provenance/service-banners-2026-09-27.json).

All 25 local dealer manifests still reference Auto Best `989ec3a1d80a8f19150d18eb81282ac7cd216d83`. None declares the new native localization contract or a reviewed `localization/dealer-overlay.json`. These are local source observations; hosted content may contain additional fixes. The selected Auto Best release in templates.lock.json predates this polish.

## Checks for this master candidate

- `scripts/mobile-polish-smoke.mjs`: EN/BG at 320, 390, 430 and 1440px, including artwork containment, menu, inventory/filter, services and detail/contact journeys; all eight cases passed.
- Visual inspection: Home cards plus Sell/Import hero and expanded service steps at 320px.
- `check:assets`: 129 inventoried media files with retained prior artwork.
- Architecture and CSS policy checks passed. Svelte check: zero errors and warnings. Production build passed using Node 22.23.2.
- `template-release.mjs status`: immutable selected releases have matching integrity; Auto Best has development changes, while the other three working template digests match their selected releases. This does not promote the new master.
- Physical iOS/Android keyboards/safe areas and dealer-specific mounted/public acceptance remain separate work.

## Rollout work

1. Complete exact-source release QA, including EN/BG localization acceptance, mounted behavior and matching hosted evidence required by TEMPLATE-PROMOTION.md.
2. Reconcile each dealer’s publishing head and local changes. Preserve existing identity, stock, contacts, permitted assets, unique fixes, all three designs and the admin/switcher links.
3. Prepare reviewed native dealer overlays and locale configuration. Existing refresh-client.mjs migrates the manifest’s whole offered trio, so do not run it as though it were an Auto Best-only copier. Review its exact proposal before installing any candidate; preserve the other designs.
4. Start with one Bulgarian and one English dealer candidate. Verify 320/390/1440px, locale routes, logo variants, inventory/detail/contact, filtering, forms, switcher and assets.
5. Adopt reviewed candidates sequentially, using existing packaging/export tools for Cars-owned dealers and Al Reef’s independent repository for that dealer. Publishing scope is awaiting the owner’s answer in this chat.

## Registered fleet

| Dealer folder | Source owner | Current Auto Best generation | Native overlay ready |
| --- | --- | --- | --- |
| al-basma-motors | cars-canonical | 989ec3a1d80a | No |
| al-hamoor-al-thahabi | cars-canonical | 989ec3a1d80a | No |
| al-reef-used-cars | independent-repository | 989ec3a1d80a | No |
| asko-96 | cars-canonical | 989ec3a1d80a | No |
| astracar | cars-canonical | 989ec3a1d80a | No |
| autolife | cars-canonical | 989ec3a1d80a | No |
| automarket-varna | cars-canonical | 989ec3a1d80a | No |
| avangard-auto | cars-canonical | 989ec3a1d80a | No |
| champion-auto-pro | cars-canonical | 989ec3a1d80a | No |
| day-and-night-auto-group | cars-canonical | 989ec3a1d80a | No |
| eliqauto | cars-canonical | 989ec3a1d80a | No |
| elit-auto-import | cars-canonical | 989ec3a1d80a | No |
| excellent-cars | cars-canonical | 989ec3a1d80a | No |
| f1rst-motors | cars-canonical | 989ec3a1d80a | No |
| isauto-varna | cars-canonical | 989ec3a1d80a | No |
| ivo-auto | cars-canonical | 989ec3a1d80a | No |
| kg-team-auto | cars-canonical | 989ec3a1d80a | No |
| legend-auto | cars-canonical | 989ec3a1d80a | No |
| navara-car | cars-canonical | 989ec3a1d80a | No |
| outletcars-varna | cars-canonical | 989ec3a1d80a | No |
| perfect-auto-varna | cars-canonical | 989ec3a1d80a | No |
| priselci | cars-canonical | 989ec3a1d80a | No |
| promosale-varna | cars-canonical | 989ec3a1d80a | No |
| texas-drive-auto | cars-canonical | 989ec3a1d80a | No |
| the-dealers-point | cars-canonical | 989ec3a1d80a | No |
