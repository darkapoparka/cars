# Mobile brand catalog and model navigation

The first brand screen previously contained only BMW because the picker used the
four demo listings as its entire catalog. Mobile now shows all 181 catalog brands,
keeps stocked makes first, and adds `181 марки` / `181 makes` below the All brands
option. The count describes the catalog, not stock availability. Selected makes
outside the catalog remain editable. Desktop keeps its existing stock-based list.

The model screen has a 44px Back target beside the selected make. Back returns to
brands, clears the search, restores focus to that make, and preserves its model and
variant criteria. Show cars still applies the draft; closing the editor cancels it.
The search field retains its full width. All models remains a selection control;
unchecking it still removes the make.

BMW's families now appear together: 1–7 Series, M, X, i, and Z. Standalone older
models follow them. Family checkboxes select a whole series; disclosure arrows
reveal its individual models. The i models share one family. Every original leaf
model and saved leaf key is retained, and the same taxonomy resolves family
criteria in inventory filtering. The captured JSON remains intact.

Matched 390×844 Bulgarian captures:

- [Brands before](makes-before-390.jpg) / [brands after](makes-after-390.jpg)
- [Models before](models-before-390.jpg) / [models after](models-after-390.jpg), with 2002 selected

Validation: source lint, TypeScript, formatting, 95 domain/localization tests,
production build, and 12 Chromium/WebKit cases covering BG/EN at 320, 390, and
1440px. Browser checks cover full-catalog search, unavailable stock counts, Back
with a selected model and active search, selection/focus restoration, aligned
controls, whole-series and partial selection, draft/apply, and overflow.
See [browser verification](browser-verification.json) for the exact build and results.

This is Cars Mobile candidate source and a local production preview at port 6474.
The template release lock and dealer deployments are separate acceptance steps.
