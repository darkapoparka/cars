# Desktop Make / Model flow — 8 October 2026

Choosing BMW in Make and opening Model before Save previously discarded the
pending make. Both desktop Home and inventory shortcuts now continue the same
pending selection when switching between Make and Model. A single chosen make
opens its model families directly. Several chosen makes show only those brands.
Save/Show applies both choices; Escape, Close, outside dismissal or switching to
an unrelated field discards the abandoned pending identity selection.

Model's brand screen reuses the existing logo renderer and exact Make catalogue
order: stock brands, familiar brands, then the remaining alphabetical catalogue.
The 179-brand catalogue uses its 162 existing logo assets and the established
fallback for brands without artwork. No asset or dependency was added.
Wide Model uses four columns of logo cards within its existing 640px menu.
The compact editor retains its single column with smaller logos. Brand buttons
navigate into model families; they do not repeat Make checkboxes.

The existing model-family hierarchy, canonical GET values, contextual search,
Back/focus restoration, 840px Make / 640px Model / 380px nested widths, menu
height and footer position remain. Desktop anchored menus allow focus to reach
the sibling selector. Delayed closing focus cannot steal focus from a newly
opened inventory menu. Mobile retains its existing focus behavior and UI.

## Validation

| Suite | Passed cases |
| --- | ---: |
| Make/Model handoff, Chromium | 8 |
| Grouped models, Chromium, including six 99-choice future families | 18 |
| Make catalogue and nested editor, Chromium | 10 |
| Home browse, BG/EN at 768, 992, 1440 and short desktop height | 8 |
| Mobile filter preservation, BG/EN at 320 and 390 | 4 |
| Make/Model handoff, WebKit | 4 |
| Grouped models, WebKit, including two 99-choice future families | 4 |
| **Total browser cases** | **56** |

`npm run validate` passed, including domain, enquiry-resource and overlay checks,
Svelte diagnostics (0 errors and 0 warnings) and the production build.
The five edited/new Svelte components were analyzed with the Svelte autofixer;
no issues were reported. Its suggestions concern retained initialization effects
and component references, rather than new diagnostics.

Native before/after captures used the existing server on port 6461 at the same
1280×720 viewport. The Make menu interior was pixel-identical (0 changed image
channels), with the same 840×468 geometry and 162 logos. Model retained its
640×300 Home and 640×314 inventory frames. The comparison shows the new direct
BMW-family handoff and logo-based Model brand screen.

Initial runs on the shared development server were interrupted by hot reloads
while source was being edited. Final browser acceptance used a task-owned Vite
process in this same checkout on port 6548 with source watching disabled; it
did not create another editable source copy. That process is stopped after QA.
The original development server remains running.

Evidence is retained in ignored repository runtime storage:
`runtime/auto-best-make-model-flow-2026-10-08-01a115ed/`, including the comparison,
native captures, browser results, validation log and source preimages.

Validation ran in the shared working checkout. This task's commit excludes the
pre-existing Home-bar padding and desktop range-field styling drafts. Other
template changes and staging are preserved. This is local template verification;
it does not promote a release or deploy a dealer.
