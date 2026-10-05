# Mobile quick-pill shadow polish

Owner review: the lighter-shadow experiment was rejected and the previous shadow was restored. See [the restoration comparison](../mobile-quick-pills-restored-20261005/README.md). The captures below remain as historical experiment evidence.

Inactive pills were already pure white, but their surrounding shadow gave them a grey rim. Reduced the shared shadow from `0 1px 4px rgba(27, 27, 33, 0.12)` to `0 1px 3px rgba(27, 27, 33, 0.08)` below the desktop breakpoint.

The white fill, transparent mobile border, black selected state, 40px faces and 48px touch targets retain their existing values. Desktop pills retain their existing border and no-shadow treatment.

Matched before/after screenshots use the same Bulgarian route, scroll position and viewport:

- Inventory: `before-390.jpg` / `after-390.jpg`, with 320px and 1440px pairs alongside them.
- Services: `before-services-390.jpg` / `after-services-390.jpg` show the shared component and black selected state.

Validation: full source lint, TypeScript, component formatting, 95 existing domain/localization tests and the production build passed using Node 22.20.0. Browser checks at 320, 390 and 1440px confirmed unchanged inventory pill geometry/colors and no page overflow. Services checks covered both phone widths and changing the selected filter; neither route logged browser errors. Exact measurements are in `browser-verification.json`.

Local preview: `http://127.0.0.1:6474/`, build `Ww1HJlatAT5dt6MkkH2uc`. Unrelated concurrent desktop edits and generated configuration were preserved. This is scoped source polish; release selection and dealer publication remain separate.
