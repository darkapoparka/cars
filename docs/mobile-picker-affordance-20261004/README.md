# Mobile picker reset and disclosure controls

The embedded “All brands” preset is now a compact, rounded reset button rather
than a brand row with a generic catalog icon. It exposes its selected state with
`aria-pressed`, keeps the whole button clickable, and has no misleading drill-in
arrow when a brand is selected. The corresponding mobile “All models” row uses
the same quiet surface treatment.

Mobile family disclosure arrows now lead the family names. Plain model names
align with the family names, and expanded children remain indented. Selection
circles stay on the right. Native buttons and checkbox labels retain their full
tap areas, keyboard operation and separate expand/select actions. Press feedback
has rounded corners; the list does not need repeated underlines or dividers.

Desktop retains trailing disclosure arrows, the existing name alignment and
square model checkboxes. No new selection state or dependencies were introduced.

## Matched screenshots

All pairs use Bulgarian, the same viewport and the same draft selection.

| View | Before | After |
| --- | --- | --- |
| Brands, 390 × 844 | [Before](before-makes-390.jpg) | [After](after-makes-390.jpg) |
| BMW models, 390 × 844 | [Before](before-models-390.jpg) | [After](after-models-390.jpg) |
| Desktop, 1440 × 900 | [Before](before-desktop-1440.jpg) | [After](after-desktop-1440.jpg) |

## Verification

- Lint, TypeScript, all 92 domain/localization tests, formatting and QA syntax passed.
- The isolated production build generated all 51 pages successfully.
- Chromium and WebKit passed all 12 grouped browser cases: Bulgarian and English
  at 320, 390 and 1440px. They cover reset selection state, taps on button padding,
  leading/trailing disclosure positioning, model-name alignment, whole-label model
  selection, partial family selection, keyboard toggling, back navigation,
  search/apply behavior and overflow.
- The resulting build was verified on the template preview at port 6474.

Receipts are summarized in [browser-verification.json](browser-verification.json).
The approved release lock and dealer deployments remain separate acceptance steps.
