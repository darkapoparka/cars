# Modern mobile polish — 1 October 2026

Scope: restrained refinement of the existing mobile patterns. No typography scale, imagery, service flow, desktop redesign, dealer refresh or deployment is part of this change.

## Changes

- Inventory, leasing selections and related cards share a 42% image track (previously 44%) and a 12px outer right inset (previously 8px). The 8px image-to-copy gap is retained.
- Fact rows remain equal where space permits. The second cell reserves its full content width on narrower cards, keeping mileage readable without smaller type, rounding or reduced padding. Before this pass, all 12 mileage labels were truncated at 320px in both Bulgarian and English.
- Shared mobile sheet headers, search fields, search results, vehicle taxonomy options and leasing preferences use a 16px side inset. Headers gain 4px of bottom space and balanced multiline titles.
- Existing browser coverage now measures the visible text itself, catching ellipsis clipping that the previous outer-element overflow check missed. The fixed equal-column assertion was replaced because it conflicted with preserving full mileage on narrow screens; font size, one-line text, padding and card alignment checks remain.

## Before and after

These are paired browser captures at identical viewport widths, with no retouching. The overlay captures wait for their opening animation to finish.

- [Inventory at 320px](mobile-final-2026-10-01/cars-320-comparison.png)
- [Inventory at 390px](mobile-final-2026-10-01/cars-390-comparison.png)
- [Import sheet at 320px](mobile-final-2026-10-01/import-link-320-comparison.png)
- [Leasing preferences at 390px](mobile-final-2026-10-01/lease-term-390-comparison.png)

## Validation

- Node 22.23.2, pnpm 11.4.0; canonical source `L:/CODEX/cars/templates/modern` on `main`, local static-demo preview at `http://127.0.0.1:6462`.
- Unit tests: 271 passing (85 marketplace UI and 186 web).
- `pnpm --filter web typecheck`: passed.
- Biome: all eight changed source/test files passed. `git diff --check`: passed.
- Local visual/HTTP checks: inventory, vehicle detail, leasing, imports, sell and contact at 320px, 390px and 1440px; all 18 returned HTTP 200, with no horizontal overflow, page errors or failed loaded images.
- Desktop comparison against `fbe8900c7`: inventory, leasing, imports, sell and contact are pixel-identical. The vehicle-detail difference is confined to the live map tiles.
- Chromium/WebKit interaction run: 33 of 34 selected cases passed on the first run. One WebKit make/model test timed out after the initial filter tap; both isolated repeats passed unchanged. Covered search/filter selection, desktop search continuation, draft preservation, custom vehicle makes, focus return, import clear/focus, financing handoff, semantic type/contrast and full vehicle facts at 320/375/390/430px in BG/EN.
- `pnpm --filter web build`: passed with the documented static-demo environment. The owned preview was paused for the build, then restored on 6462 using Cars start-preview.ps1.

## Preservation and limits

The original mobile captures were taken at `3aa204ccb`. The separate desktop writer completed its work as `fbe8900c7` before mobile source edits began; desktop comparison captures were refreshed against that revision. No message was sent to another chat. The shared chat reference could not be read because the browser presented a verification screen, so the live Modern template was the visual reference.

Workspace doctor fetched current refs successfully. Unrelated Cars/dealer/template changes and the independent admin repository's ahead/behind state were preserved. This is local standalone static-demo evidence, not mounted dealer, hosted, physical-device or real enquiry-delivery verification. Owner visual acceptance remains with the owner.
