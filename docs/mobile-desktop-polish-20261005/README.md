# Mobile desktop styling polish

The approved layout remains: type in the hero search box, one quick-filter row, sorting beside the result count and four inventory columns. The banner stays 280px.

Desktop fields share their spacing, typography and focus styles. Pills use lighter borders and selected surfaces; range groups and the make/model panes have clearer spacing. Filter styling is now separate from editor behavior, and sorting has a dedicated component.

Matched before/after images use 1440 x 960 views in Bulgarian and English. Filter comparisons retain the complete dialog and surrounding context.

Validation passed: source lint, TypeScript, 95 retained tests, a production build, 58 desktop interaction checks and 56 phone layout/control/style comparisons at 320/390px in Chromium and WebKit. The phone comparisons match in the tested views; pixel statistics are recorded separately.

Independent phone model-selector edits were preserved and excluded from this scope. The exact source hashes and evidence are in verification.json. This is a validated local preview and desktop source change; template release and dealer publication remain separate.
