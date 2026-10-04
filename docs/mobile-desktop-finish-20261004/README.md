# Mobile desktop filter finish — 4 October 2026

The desktop editor keeps its approved equal-width Make/Model panels, fixed
820 × 680px frame, seven 16px tabs, stationary footer and 8px blurred backdrop.
Quiet pane backgrounds, 18px headings, aligned 16px model rows, selected-model
summaries and a 240px apply action make the controls easier to read. Optional
settings keep their heading visible while scrolling in short windows.

The desktop editor previously omitted `onRemoveMake`, so unchecking All models
left BMW selected. The callback now removes the brand and clears its criteria.
Phone styles use their existing defaults; desktop model styles are applied only
by the desktop editor.

| Surface | Before | After |
| --- | --- | --- |
| Make/Model, Bulgarian, 1440 × 960 | [Before](desktop-before.jpg) | [After](desktop-after.jpg) |
| More settings, Bulgarian, 1440 × 960 | [Before](more-before.jpg) | [After](more-after.jpg) |

Validation used Node 22.20.0, lint, TypeScript, 92 domain/localization tests and
a production build. The [desktop matrix](desktop-verification.json) covers all
seven tabs in Bulgarian and English at 1440 × 960 and 700 × 600: each retains
the frame and footer, fits all tabs and has no horizontal page overflow.
At 700px, the dialog is 652 × 552px with 24px viewport margins.

Rendered interaction checks covered direct brand deselection, All models,
model family expansion and partial selection, model search, variant edits,
exclusion, Clear, Apply and cancellation with Escape/Close. Search/apply returned
the expected single X6 listing; Escape returned focus to the Price pill.
The inspected browser reported no console errors.

All 28 [matched phone comparisons](phone-comparison.json) are pixel-identical:
seven filter sections, both locales, 320px and 390px widths at 844px height.
This evidence compares the saved baseline with this desktop change; subsequent
concurrent phone work is outside this change.

The local review link uses port 6478. This is source and local-browser validation;
the dealer release lock and hosted dealer rollout are unchanged.
