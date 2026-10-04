# Mobile brand back navigation and search cues

4 October 2026. Selecting BMW on a phone now opens a model list whose first
checkbox names BMW and identifies the All models choice. Unchecking it removes
the brand and its model criteria, returns to the brand list and focuses BMW.
The brand selector has a back arrow that returns without removing selected
models; it also clears the model search. These actions use the existing draft
and brand-removal logic, with no additional state or dependency.

Vehicle search suggestions have a small right arrow beside the price. The whole
row remains a button: selecting it fills the search draft, and Show cars applies
it. Prices remain aligned and the decorative arrow is hidden from assistive
technology.

## Matched screenshots

The same browser, Bulgarian, matching viewports and initial filter state.
Before is the existing production preview at 6474; after is the completed
production build at 6478, subsequently served at 6474. Paired image dimensions
are verified. Screenshots are untouched browser captures.

| View                       | Before                              | After                             |
| -------------------------- | ----------------------------------- | --------------------------------- |
| BMW models, 390 x 844      | [Before](models-before.jpg)         | [After](models-after.jpg)         |
| Search, 390 x 844          | [Before](search-before.jpg)         | [After](search-after.jpg)         |
| Desktop search, 1440 x 900 | [Before](search-desktop-before.jpg) | [After](search-desktop-after.jpg) |

## Validation

Node 22 source lint, TypeScript, all 92 domain/localization tests, touched-file
formatting and a production build of 51 routes passed.

[Browser verification](browser-verification.json) records 12 passing grouped
cases in Chromium and WebKit with zero browser errors. Bulgarian and English
were checked at 320, 390 and 1440px. The phone cases cover keyboard removal of
the checked brand row, return focus, retaining model selections through Back,
clearing model search, restoring All models and applying removal without stale
brand/model URL criteria. All widths cover visible search arrows, contained
rows, draft isolation and applying the selected search to inventory.

The existing showroom suite's labels were updated for the renamed row and
back action. The new focused regression suite is
`templates/mobile/scripts/qa-showroom-search.mjs`.

Source and local browser verification are candidate evidence; release-lock
acceptance and dealer publication remain separate.
