# Mobile make/model picker polish

The mobile picker now uses whitespace between rows instead of repeated separator
lines. The embedded brand button and its wrapper previously both drew a bottom
border. Both mobile rules are removed; desktop retains its quiet model dividers.

“All brands” has a neutral catalog icon in the same 32px slot as the brand logos.
Selected brand marks and mobile model checkboxes use compact 20px circles. Model
inputs remain native checkboxes, including their keyboard and indeterminate states.
Desktop model checkboxes retain their 5px corner radius.

Brand rows remain full-width native buttons and individual model rows remain full
labels. Family names expand the model list; their separate 48px checkbox targets
select the family. No additional selection state or click handlers were introduced.

## Matched screenshots

All captures are Bulgarian, with the same viewport and draft state in each pair.

| View | Before | After |
| --- | --- | --- |
| Brands, 390 × 844 | [Before](before-makes-390.jpg) | [After](after-makes-390.jpg) |
| BMW models, 390 × 844 | [Before](before-models-390.jpg) | [After](after-models-390.jpg) |
| Desktop, 1440 × 900 | [Before](before-desktop-1440.jpg) | [After](after-desktop-1440.jpg) |

## Verification

- Lint, TypeScript, all 92 domain/localization tests, formatting and QA script syntax passed.
- The isolated production build generated all 51 pages successfully.
- Chromium and WebKit passed all 12 grouped browser cases: Bulgarian and English
  at 320, 390 and 1440px. These cover row alignment, taps outside the brand text,
  whole-label model selection, partial family selection, keyboard toggling,
  brand removal/back navigation, search/apply behavior and overflow.
- The resulting build was verified on the template preview at port 6474.

The build and browser receipts are summarized in [browser-verification.json](browser-verification.json).
This is candidate-source polish; the approved release lock and dealer deployments
are separate acceptance steps.
