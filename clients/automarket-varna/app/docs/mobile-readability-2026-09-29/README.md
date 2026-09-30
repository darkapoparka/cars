# Bulgarian mobile readability audit — 29 September 2026

Scope: Cars App candidate, `/bg`, inspected in the Codex in-app browser. Reference source in `L:/cars-app` was read without modifying it. Existing home/feed, navigation, and filter edits were preserved. No dealer release or deployment is included.

## Changes

- Short mobile headings and campaign copy, including “Последно разгледани”, “Нашите услуги”, and “Следващата ви кола.” Desktop campaign copy remains available.
- Legible 16px mobile text inputs, consistent search gutters, mixed-case suggestions, visible focus rings, 48px suggestion rows, and 44px clear/save controls.
- Darker secondary text tokens, reduced-motion support, localized accessible labels, and readable specification names for assistive technology.
- Search suggestions retain keyboard navigation. Inventory filtering uses a deferred query and memoized vehicle cards to reduce work on the input path.
- Secondary headers use available width; gallery/features no longer reserve simulated phone-status-bar space. Photo controls remain outside the image centre and work in landscape.
- Bulgarian feature searches match translated labels. Saved-car counts and gallery captions are localized. Vehicle names can wrap at narrow widths. Gallery share URLs retain locale and mounting path.

## Browser checks

Tested phone viewports: 320×740 and 390×844. Additional layout checks: 768×1024, 1440×1000, and 844×390 photo-viewer landscape. Production browser checks used port 3002 to avoid relying on dev compilation. The original development URL on port 3001 was also verified after the final changes: home at 390px, search and sort sheet at 320px.

- Home: short headings, banner composition, sticky navigation, carousel selection, loaded images, and horizontal overflow.
- Search/inventory: suggestions, ArrowDown/Enter selection, Toyota results, ascending price order, filter focus containment, Escape dismissal and focus restoration, reset/clear controls.
- Finance: price/term changes update the example deposit and monthly payment; assistance produces a draft enquiry.
- Sell/service and their detail forms: mobile input sizing, layout, and draft-only enquiry behavior. No external messages or transactions were sent.
- Vehicle details, saved list, gallery, features, stores, and More: mobile layout and accessible control names. Saved state was toggled on and restored. Photo next/previous and zoom were exercised. Bulgarian `круиз` returns “Круиз контрол”.
- Checked routes had no document-width overflow, missing visible form/button labels in the DOM check, or broken loaded images. Final desktop/tablet home checks produced no browser warnings/errors.

The accessibility review covers reflow, contrast tokens, control names, keyboard operation, modal focus, touch-target sizing, input readability, and reduced-motion styling. The revised muted token is approximately 5.5:1 against `#f4f4f5`; this is not an all-elements contrast certification. References: [WCAG contrast minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum) and [WCAG 2.2](https://www.w3.org/TR/wcag/).

This is viewport emulation, not physical iOS/Android testing. Screen-reader behavior, actual soft keyboards, OS text scaling, and low-end-device performance need physical-device acceptance. No blanket WCAG-conformance or zero-lag claim is made.

## Validation

`npm run check` runs ESLint, TypeScript, and the production build using Node 22.23.2. A separate `.next-build-check` output directory keeps production verification separate from the existing development server. Logs are in ignored `runtime/app-mobile-check-final.log`.

Final `npm run check` passed: ESLint, TypeScript, and production generation of all 407 pages. `git diff --check` also passed. An initial concurrent-build attempt ran out of memory. A subsequent npm launcher issue was avoided using the installed npm CLI with a process-scoped prefix; no global npm configuration was changed. Sequential verification used a 2GB Node heap cap.

## Commit handoff

Changes are saved in `L:/CODEX/cars`, branch `main`, last observed HEAD `ec126c79d`. Commit/push remain pending because the existing shared `.git/index.lock` returned during final verification, with Git process 41764 still present. The lock was not removed or bypassed. The fetched main was in sync with `origin/main` at the last comparison.

After the existing Git writer releases the index, inspect drift and staged changes again, then make a scoped App polish commit and non-force push. The relevant changes are the App presentation files under `app/`, `components/`, `lib/`, and this audit directory. Preserve pre-existing home/feed edits, unrelated fleet changes, and generated/untracked setup files; do not blanket-stage the repository. Temporary TypeScript include paths added by the audit servers were removed.

## Evidence

- [Home, 390px](home-390.png)
- [Compact headings and services banner, 320px](home-services-320.png)
- [Inventory and full vehicle names, 320px](inventory-320.png)
- [Localized gallery, 320px](gallery-320.png)
- [Focused search and suggestions, 320px](search-320.png)
