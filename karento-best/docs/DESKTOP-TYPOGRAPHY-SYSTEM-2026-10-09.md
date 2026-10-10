# Desktop typography system

This pass keeps Urbanist, the existing artwork, rounded cards and pill shapes. It standardizes the visual hierarchy of the maintained Svelte application at widths of 992px and above. Mobile values are a separate breakpoint contract.

Current source and final verification are recorded in [Desktop final verification](DESKTOP-FINAL-VERIFICATION-2026-10-09.md). The pass-specific counts below describe their earlier snapshots.

## One definition, explicit roles

`src/lib/styles/desktop-typography.css` owns desktop font family, size, weight, leading and tracking. It is imported through `desktop-pages.css`. Components select a `desktop-type-*` class according to the text's job; HTML heading tags retain their document semantics. Existing desktop title classes remain aliases to these definitions.

The explicit classes also work in portaled calendars and photo viewers. They apply only inside the desktop media query. The preserved template's size and bold utilities remain available to the existing mobile layouts; the desktop roles outrank them. Shared desktop geometry now follows [the geometry contract](DESKTOP-GEOMETRY-SYSTEM-2026-10-09.md); components retain composition, color and behavior.

| Role                                | Desktop size       | Weight          | Use                                             |
| ----------------------------------- | ------------------ | --------------- | ----------------------------------------------- |
| Hero                                | 48px               | 700             | Primary banner headline                         |
| Page                                | 40px               | 600             | Breadcrumb page heading                         |
| Section                             | 38px               | 600             | Major marketing section heading                 |
| Collection                          | 32px               | 600             | Vehicle, news, service, type and brand browsing |
| FAQ group                           | 28px               | 600             | General and Payments topic groups               |
| Banner / detail                     | 36px / 32px        | 600             | Supporting promotion / product or vehicle name  |
| Panel                               | 22px               | 600             | Buy-box group, detail panel, plan name          |
| Card / compact card                 | 20px / 18px        | 600             | Editorial card / dense inventory card           |
| Article subheading                  | 24px               | 600             | Long-form article hierarchy                     |
| Lead / body / small body            | 18px / 16px / 14px | 400             | Supporting descriptions and copy                |
| Prose                               | 16px               | 400             | Article copy, with 1.75 leading                 |
| Meta / eyebrow / label              | 13px               | 400 / 500 / 500 | Dates, context and field labels                 |
| Badge / pill / control              | 12px / 13px / 14px | 500 / 500 / 600 | Small status, quick filters and actions         |
| Card price / buy price / plan price | 22px / 28px / 38px | 700             | Increasing commercial emphasis                  |
| Stat / compact stat                 | 44px / 34px        | 600             | Metrics, with tabular numbers                   |
| Navigation                          | 14px               | 500             | Header and footer navigation                    |

Sizes are defined in rem. These are current design choices, not accessibility minimums. A 44px control target describes its interactive area, not its text size.

The bundled Urbanist font is variable and supplies normal weights from 100 to 900 for Latin text. The desktop stack explicitly falls back to system-ui / Segoe UI for scripts absent from the bundled font, including Cyrillic. This pass does not replace or download font assets.

## Preventing drift

`npm run check` includes `npm run check:typography`. The source guard parses maintained Svelte styles and CSS, validates role names and token references, and rejects hardcoded desktop sizes, weights, leading, tracking and font shorthands outside the central definitions. It also rejects central rules that would leak into mobile. Its fixture tests cover failures and valid role usage without fixing the chosen numeric scale in tests.

New components should use an existing semantic role. If a genuinely different role is needed, define its desktop values centrally and document the purpose. Do not add a per-page font-size override or a new wrapper component just to style a heading.

Select one text role per rendered element. `CalendarInput` accepts its parent's explicit class, with a body role only as the default when no class is supplied. Search date fields use the control role; reservation dates use small body text. The shared input does not append a competing body role. The homepage's dense statistics use the existing compact-stat context, while standalone statistics retain the larger stat role.

## Mobile follow-up

Design mobile typography independently at its approved breakpoints, using the same role meanings where applicable. Compact mobile cards, sheets and actions need their own rendered checks; copying desktop values downward would not establish good mobile hierarchy. The desktop source guard deliberately leaves base/mobile typography declarations available for that separate work.

## Evidence and scope

The first typography pass's matched captures and frozen source snapshots live in ignored `.runtime/evidence/desktop-typography-system-2026-10-09/`. That pass used 38px / 600 for all section titles. The owner subsequently approved the 32px collection and 28px FAQ group roles above; its fresh baseline and resulting comparisons live in `.runtime/evidence/desktop-geometry-2026-10-09/`.

Parallel localization and mobile work exists in this shared checkout. Preservation receipts distinguish the typography-only changes from those subsequent edits. The two service search type-narrowing repairs keep the same runtime filter logic. This document records local source and rendered desktop checks; it does not promote a template release or deploy a dealer.

Validation completed for this pass:

- Type checking and the typography architecture guard pass; the guard covers 343 maintained Svelte/CSS files and 25 roles.
- All 65 tests pass, including 8 positive/negative architecture fixtures.
- The isolated production build succeeds; all 30 canonical pages hydrate without browser/widget errors.
- All 39 layouts pass the rendered audit at 1024, 1200 and 1440px (117 views). Seven selected Bulgarian routes pass at 1200 and 1440px (14 additional views).
- No visible text clipping, horizontal overflow, broken images or browser errors were found in those rendered audits. News search plus the Road Trips pill was also exercised in the in-app browser and returned one matching article.
- Scoped formatting passes for the 191 owned paths. The final full-project formatter still reports 18 files affected by separate ongoing work; its log is preserved. No broad formatting rewrite was applied to the mobile/localization work.

The verified frozen desktop preview is running on loopback port 6478. Comparison images use Before on the left and After on the right; their source hashes and crop anchors are recorded in `typography-comparison-images.json`.
