# Services, Contact and account Cars correction

Services keeps its single scrolling filter row. Inactive pills now use the white surface; the selected pill keeps its existing dark active state. The shared Action defaults and desktop filters are unchanged.

Mobile Contact no longer repeats the primary phone number below the Call action or renders the external fallback labelled “Онлайн запитване” beside the enquiry button. A configured real mailto contact remains supported. The actual configured Google map, address, map destination, Call/Viber actions, enquiry sheet and social links remain available.

Customer account Cars now has a separate mobile composition using the existing SearchField and Action components. The count and native sort control sit on opposite sides of one toolbar. Compact white cards show titles, statuses, descriptions, references and supplied price/mileage values, followed by labelled Edit and Message links. Missing values do not become repetitive “On request” rows, and the generic car SVG is not rendered as a vehicle photo. Edit pages retain the full submission data. This change does not add photo storage or notification delivery.

Search matches the actual prepared request data. Newest/Oldest sorting uses the existing submission creation timestamps, now included in the typed page rows. English links preserve `?lang=en`; the desktop controls and legacy table remain visible above the mobile breakpoint. This correction changes neither submission persistence nor authentication.

## Screenshots

The before/after pairs use the existing in-app Browser at 390×844 on the preserved 6790 development server. They show the same existing twelve customer requests, without submitting or editing those records. Additional captures cover 320×568 and desktop at 1440×1000. Contact captures show the actual Google map after loading.

| Page                 | Before                                | After                                |
| -------------------- | ------------------------------------- | ------------------------------------ |
| Account Cars         | [390px](before/listings-390.jpg)      | [390px](after/listings-390.jpg)      |
| Services             | [390px](before/services-390.jpg)      | [390px](after/services-390.jpg)      |
| Contact              | [390px](before/contact-390.jpg)       | [390px](after/contact-390.jpg)       |
| Account Cars desktop | [1440px](before/listings-desktop.jpg) | [1440px](after/listings-desktop.jpg) |

## Checks

- Svelte check: zero errors and warnings.
- Scoped ESLint and Prettier: passed for all eight task files.
- Native architecture check: passed (57 route modules, 206 reachable modules, one Tailwind entry).
- Production build: passed; existing CSS `@reference` minification warnings and plugin timing notices remain.
- Focused Playwright: 18 passed, 12 project-specific skips. The skipped mobile cases ran successfully in the mobile project; the desktop preservation case ran successfully in desktop.

The browser checks exercise BG/EN request search, empty-state recovery, real chronological sorting, edit navigation and return, search-icon vertical alignment, right-aligned sorting, no fallback car SVG, 320/390px layout and 200% root-font stress. They also exercise six-route account hydration, account navigation and Messages, white single-row Services filters and search/reset, the retained Contact map/action composition, enquiry opening/closing and contact-sheet validation. These are local browser checks, not physical-device or complete accessibility certification.

The build and browser checks use the task-owned C: verification candidate with its retained npm lockfile and Node 24.21.0, its own build output and a fresh synthetic CMS fixture directory. The active 6790 runtime remains untouched. [Source snapshot](source-snapshot.json) records the frozen input; [file hashes](verified-files.json) confirm the eight task source/test files match the passing candidate. Other Cars work is preserved and outside the scoped correction.

```text
PLAYWRIGHT_SKIP_WEBSERVER=1
PLAYWRIGHT_BASE_URL=http://127.0.0.1:6795
node node_modules/@playwright/test/cli.js test tests/account-listings-mobile.e2e.ts tests/account-hydration.e2e.ts tests/mobile-secondary.e2e.ts tests/mobile-sheet-regressions.e2e.ts --grep "mobile account cars|contact keeps the map|desktop account listings|service filters|account navigation|account pages hydrate|contact validation|contact and account pages reflow" --workers=1 --reporter=list
```

This is source polish on the Import master. Visual acceptance, template release and dealer deployment remain separate.
