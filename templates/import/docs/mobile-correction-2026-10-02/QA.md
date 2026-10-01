# Import mobile correction

This replaces the presentation from the previous mobile Contact/account pass after the owner rejected the two-row Services filters, repeated Contact icon cards and long Profile composition. It is a local template correction, not visual approval or a dealer release.

Services uses one horizontally scrolling row, aligned to the card gutter. Every filter remains reachable; the regression checks require one row, scroll the rail to its last control, verify each control's visibility and preserve search/filter/reset behavior without page overflow.

Contact restores the configured Google map for the actual Sofia address. One map/address block precedes plain phone and online-contact links. Repeated detail-card icons are removed. The shared centered hero, direct phone/Viber links, map destination and enquiry sheet remain.

The customer mobile Profile now composes shared form fields and Actions rather than restyling the raw desktop form. Photo, name, phone and email come first. Additional data, social links and address remain available in closed native disclosure sections. All retained fields remain in the form payload. Photo and banner controls preview selected images locally; they do not claim an upload. The save request preserves the existing API and preview-role header contract, reports failure accurately and permits retry. Desktop and staff routes retain the legacy form composition.

## Evidence

The before images show the rejected previous presentation on the active server, captured before this correction. Main comparisons use the in-app Browser at 390×844; supplementary mobile checks use 320×568. The desktop Profile was inspected at 1440×1000, with the legacy form visible and the mobile form hidden. Full-page captures include the browser's fixed navigation overlay; the lower viewport capture is provided for reviewing all three disclosure rows and the save action.

| Page | Before | After |
| --- | --- | --- |
| Contact | [390px](before/contact-390.jpg) | [390px](after/contact-390.jpg) |
| Services | [390px](before/services-390.jpg) | [390px](after/services-390.jpg) |
| Profile | [390px](before/profile-390.jpg) | [390px](after/profile-390.jpg) |

See [Profile lower view](after/profile-bottom-390.jpg) and [large-font stress evidence](after/large-font/).

## Validation

Svelte checking passed with zero errors and warnings. Scoped ESLint and Prettier passed. The isolated production build completed, retaining the existing compatibility `@reference` CSS warnings and plugin timing notices. Nineteen focused Playwright cases passed; five mobile-only cases were skipped in the desktop project and passed in the mobile project.

The browser checks cover six-route account hydration, account navigation and Messages at 320/390px, Services filter reachability and search/reset, contact-sheet validation, profile upload controls, preservation of additional form fields, local image preview, save failure and a successful retry against the real local preview API. The 200% root-font cases keep a fixed 320px viewport and check document width, service title bounds and account action text bounds. They are CSS stress checks, not physical-device or full accessibility certification.

Validation uses a task-owned frozen source copy on C: with Node 24.21.0 and the retained npm lockfile. The active 6790 runtime is preserved. The seven task files match the passing candidate; [source snapshot](source-snapshot.json) and [file hashes](verified-files.json) record that evidence. Other concurrent Cars work is outside this change.

```text
PLAYWRIGHT_SKIP_WEBSERVER=1
PLAYWRIGHT_BASE_URL=http://127.0.0.1:6795
node node_modules/@playwright/test/cli.js test tests/account-hydration.e2e.ts tests/mobile-secondary.e2e.ts tests/mobile-sheet-regressions.e2e.ts --grep "service filters|account navigation|account pages hydrate|mobile .* account labels|contact validation|200%|profile keeps extra" --workers=1 --reporter=list
```

No main-page restyle, backend authentication change, dealer deployment, template promotion or outreach is included. Existing demo and storage boundaries remain; the Profile API still owns which fields it stores. New mobile labels support BG/EN; retained user data and legacy desktop copy are not translated by this correction.
