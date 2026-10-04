# Make header navigation

The phone model-picker header groups the back arrow and make name in one native button. The arrow-to-name gap is reduced from 20px to 8px. The shared button uses the existing model-row styles, retaining a 52px minimum height and leaving the selection circle as a separate control.

Tapping either the arrow or make name returns to the make list without changing selected models. The existing navigation handler clears the model search and restores focus to the selected make. The circle retains its all-models selection behavior and localized accessible name.

The separate make label and back-button StyleX rules are removed. No navigation state or effect is added; desktop model selection is unchanged.

| Before | After |
| --- | --- |
| ![Separate arrow and make label](before-320.jpg) | ![Compact shared back button](after-320.jpg) |

Matched Bulgarian BMW captures at 320 × 844, with all models selected. The browser suite checks arrow/title alignment and both tap targets with a selected BMW 120, alongside the existing selection and focus checks.

Lint, typecheck, formatting, all 95 domain/localization tests and the production build passed. All 12 Chromium/WebKit cases passed in Bulgarian and English at 320, 390 and 1440px, including taps on both the make name and arrow with a selected model. Validation details are recorded in [browser-verification.json](browser-verification.json).

Mobile candidate source and local preview; no release-lock selection or dealer deployment.
