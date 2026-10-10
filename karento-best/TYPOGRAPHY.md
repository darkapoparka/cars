# Typography · 8 October 2026

Current desktop roles are documented in
[the 9 October desktop typography system](docs/DESKTOP-TYPOGRAPHY-SYSTEM-2026-10-09.md).
They supersede the desktop scale described below. This file retains the earlier
refinement and font-choice evidence; its Bulgarian section records the state at
that earlier date.

Urbanist remains the site's font. This refinement raises specific undersized
captions while preserving the existing body and heading scale, weights, tracking,
colors and component composition. No styling framework or runtime dependency is
added.

`static/typography.css` owns the font-family mapping and three shared size roles.
The rem values resolve to the following sizes at the existing 16px root:

| Role    | Token                               | Use                                                                   |
| ------- | ----------------------------------- | --------------------------------------------------------------------- |
| Compact | `--karento-text-compact: 0.75rem`   | 12px navigation labels, mobile category counts and status badges      |
| Caption | `--karento-text-caption: 0.8125rem` | 13px small captions, mobile vehicle facts/locations and result counts |
| Field   | `--karento-text-field: 1rem`        | 16px calendar input values                                            |

Home's compact vehicle cards retain 12px metadata: the 13px candidate made the
specs wrap at ordinary phone widths, and the owner preferred the previous row.
The shared compact token restores that size for Home locations, specs and price
suffixes. Natural wrapping remains available at narrower widths.

Existing caption weights and 18px leading remain. Mobile navigation uses its
existing relative line height. Card titles, prices, hero copy and body text keep
their existing sizes. Inputs that already use 16px are unchanged.

The existing theme, dealer, native-widget and mobile styles retain their owners.
The small overrides bridge the preserved theme and responsive styles through
existing role selectors; component CSS still owns layout. New consumers should
use the appropriate shared token instead of duplicating a size literal. A future
font choice needs a comparison at the existing sizes and weights first.

## Evidence

`home-card-correction-390.png` is the current Home result after the owner's
single-row feedback. All six Home cards have one spec row at 390px and retain
the original natural wrapping at 320px. The focused correction audit covers
Home and Vehicles at all three widths with six passing cases in
`.runtime/evidence/typography/home-card-correction/after/audit.json`.

`docs/typography-refinement-2026-10-08/` contains the current matched desktop and
phone screenshots and measured before/after fonts. For the final comparison,
only this size layer was temporarily omitted and restored on the same live
application; each phone capture was reloaded at its target width and waited for
hydration. This isolates typography from concurrent layout edits.

`.runtime/evidence/typography/refinement/{before,after}/audit.json` records all 39
layouts at 320, 390 and 1440px, with zero failures in 117 after cases. The initial
whole-site captures also include concurrent page changes and should not be used
to attribute those layout differences to typography. The matched native captures
are the visual comparison for this pass.

The earlier IBM Plex Sans images in `docs/typography-2026-10-08/` and its
`verification.json` are historical evidence of the rejected candidate. The
candidate is inactive. Font binaries, license, provenance and the rejected
stylesheet are preserved under ignored
`.runtime/evidence/typography/rejected-plex` and removed from maintained font assets.

`node scripts/validate-typography.ts` records font families, sizes, wrapping,
images and widget/browser failures at 320, 390 and 1440px. The expected font is
Urbanist; `KARENTO_TYPOGRAPHY_FONT` supports a future comparison candidate.
`KARENTO_EVIDENCE_DIR` keeps focused or restoration runs separate from the
historical audit. Runtime audits and screenshots are not visual acceptance.

## Bulgarian

Site copy remains English. Urbanist's preserved bundle does not supply Cyrillic.
A compatible Bulgarian font and full translation still require a content/font
pass. Keep typed locale selection, use locale catalogs and Intl formatting,
and review Cyrillic alongside English. No candidate's glyph-coverage test alone
establishes that it fits the approved visual character.
