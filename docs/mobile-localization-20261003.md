# Mobile showroom: Bulgarian / English and phone polish

The Mobile master at `templates/mobile` now defaults to Bulgarian. A BG/EN
header control switches the showroom UI immediately and remembers the choice on
the device. Shared links can specify `?lang=bg` or `?lang=en`; detail tabs, inventory
filters, saved cars and written enquiry text survive language changes.

Showroom navigation, inventory and filter labels, detail specifications and
equipment, galleries, finance previews, services, import/sale steps, validation,
reviews and local draft confirmations use the selected language. Bulgarian search
finds translated vehicle fuels/body types and services while the filter identifiers
remain canonical. Drafts remain device-local and never claim an enquiry was sent.

German listing advertisements are replaced with concise factual display summaries.
Cards and galleries omit eight captured promotional/testimonial slides and use
the remaining photos of the same vehicles. The original catalog, captured data
and raster files remain preserved. Dealer names on retained photos are reference
material; actual dealer imagery and verified stock/contact details remain part of
personalization.

Styling changes stay below 700px: licensed Manrope Latin and Cyrillic, a compact logo and
44px language control, full vehicle facts that wrap rather than clipping, and
short Bulgarian detail-tab labels. Desktop card/photo dimensions and typography
keep the existing composition.

The follow-up mobile refinement uses one Manrope family for Bulgarian labels,
Latin model names and numerals. The BG/EN action has a transparent background,
matching the quiet header wishlist action, while retaining a 60 × 44px target.
Vehicle detail ends on a white surface; contact and related cars use simple
dividers instead of nested rounded frames. Related cards retain horizontal
scrolling with 16px inset snapping and no visible mobile scrollbar.

## Verification

- Node 22.20.0: ESLint with zero warnings, TypeScript, and 91 domain/localization
  tests passed. The production build passed with the separate `.next-review`
  output, preserving the existing dev server on 6474.
- Codex @Browser checks used 320 × 568, 390 × 844, and 1440 × 1000 viewports.
  Bulgarian/English switching persisted across reloads and selected detail tabs.
  Bulgarian `Дизел` search returned the three diesel cars; make/model selection
  retained canonical values and found BMW X6.
- Local enquiry drafts retained user-written Bulgarian text when switching to
  English and reloading. Import and sale steps, validation, condition selection,
  review values and draft-only confirmations were inspected on mobile. Saved
  cars could be added, located and removed in both languages.
- The curated photo viewer navigated through actual vehicle photos and closed
  back to the selected Photos tab with focus restored. The equipment view and
  mobile forms had no horizontal page overflow at 320px.
- At 1440px, before/after English home measurements matched: 1100 × 60 header,
  527 × 460.375 cards, first card at (178.5, 237), unchanged row positions and
  `"Mobile Base", Arial, sans-serif` font. The BG/EN header control is mobile only.

Evidence is retained under ignored `runtime/mobile-localization-20261003/`,
including before/after home screenshots, form reviews, equipment screenshots,
`desktop-comparison.json`, test/build logs and workspace-doctor results.
The generated `next-env.d.ts` was reconciled to its pre-task dev references and
excluded from the scoped change.

This is local browser/build evidence. This change does not update the separate
Vercel publishing mirror, select an immutable dealer release, or establish
physical-phone acceptance. The existing hosted preview remains its deployed
snapshot until a publishing refresh is requested.

## Source handoff

The scoped change targets Cars `main`. Initial staging was blocked by the shared
index lock at 07:28 local time; the lock was absent during the follow-up. No lock
was deleted or bypassed. The owned paths are recorded in ignored
`runtime/mobile-localization-20261003/commit-paths.json` and the follow-up manifest
in `runtime/mobile-type-surface-20261003/commit-paths.json`; `next-env.d.ts` and
unrelated template work are excluded.

## Follow-up verification

- Node 22.20.0: ESLint with zero warnings, TypeScript and all 91 tests passed.
  The final production build passed after the carousel spacing adjustment.
- Codex @Browser checked Bulgarian and English at 320 × 568 and 390 × 844.
  Home and detail text retained the unified font without horizontal page
  overflow. The language action's transparent background and 60 × 44px target
  were measured. Related cards scrolled and snapped within the page.
- The production preview on temporary port 6475 showed the same white detail
  footer and single top dividers, with no outer side/bottom borders or corner
  rounding. English import-page and enquiry controls and Bulgarian contact
  layouts were checked at 320px; there were no new console errors or warnings.
- At 1440 × 1000, the detail footer matched its before measurements exactly:
  `"Mobile Base", Arial, sans-serif`, grey parent surface, 1px panel borders,
  16px corners, 1076px widths and 174.5px left positions. The generated Next
  environment file was restored byte-for-byte after building.

Follow-up screenshots, geometry comparisons and build/doctor logs are retained
under ignored `runtime/mobile-type-surface-20261003/`. The existing 6474 dev
preview remains the user-facing review route.
