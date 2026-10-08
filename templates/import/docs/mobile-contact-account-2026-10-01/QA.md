# Import mobile Contact, Services and account polish

This pass keeps the established mobile composition and refines Contact, Services, `/account` and `/account/profile`. Home, inventory, Sell, Import and PDP were not restyled.

Contact now uses the centered shared hero and `Action` pills. The address and map link share one card; the decorative map and repeated address are removed. The enquiry sheet has an explicit full-width entry button, and social links follow the contact details. Phone, Viber, configured contact destination and enquiry source contracts remain intact.

Services exposes all five quick filters in wrapping rows aligned to the cards. Labels remain 16px with 44px targets. At a larger root font size, service cards can place the image above the text to keep their titles readable.

The account navigation fits all four links at 320px. Stat labels have the full card width, with smaller icons beside their values. Profile cards have white surfaces, compact avatar and banner uploads, consistent field corners and a full-width save button. Account cards and actions can grow with scalable text instead of overflowing or clipping it.

## Evidence

Normal mobile captures use the in-app Browser on the owner's existing server at port 6790. Main comparison views use 390×844; supplementary views use 320×568. Desktop was inspected at 1440×1000.

| Page             | Before                           | After                           |
| ---------------- | -------------------------------- | ------------------------------- |
| Contact          | [390px](before/contact-390.jpg)  | [390px](after/contact-390.jpg)  |
| Services         | [390px](before/services-390.jpg) | [390px](after/services-390.jpg) |
| Account overview | [390px](before/account-390.jpg)  | [390px](after/account-390.jpg)  |
| Profile          | [390px](before/profile-390.jpg)  | [390px](after/profile-390.jpg)  |

The isolated production tests also capture [large-font evidence](after/large-font/). The `before/large-font-regression/` images record the button-clipping issue found during this pass, before its final fix; they are not the original template baseline.

Desktop Contact reproduced identical decoded pixels. The other desktop views retained their composition on visual inspection but were not pixel identical; [comparison measurements](desktop-comparison.json) retain that distinction. Their images are included in the before/after folders.

## Validation

Final verification passed: Svelte checking reported zero errors and warnings; scoped ESLint and Prettier passed; the isolated production build completed; and 15 focused Playwright cases passed. Five mobile-only cases were skipped in the desktop project and ran successfully in the mobile project. The build retains existing Lightning CSS warnings for compatibility `@reference` rules and plugin timing notices.

The production preview uses a task-owned copy at `C:/Users/radev/AppData/Local/Temp/cars-import-secondary-20261001-01a0f61f/candidate`, with Node 24.21.0 and the retained npm lockfile. It does not rebuild the active 6790 preview. All nine task files match the tested copy. Later concurrent desktop inventory and embedded-search changes are outside this frozen QA snapshot. See [source snapshot](source-snapshot.json) and [task-file hashes](verified-files.json).

Focused browser command:

```text
PLAYWRIGHT_SKIP_WEBSERVER=1
PLAYWRIGHT_BASE_URL=http://127.0.0.1:6795
node node_modules/@playwright/test/cli.js test tests/account-hydration.e2e.ts tests/mobile-secondary.e2e.ts tests/mobile-sheet-regressions.e2e.ts --grep "service filters|account navigation|account pages hydrate|mobile .* account labels|contact validation|200%" --workers=1 --reporter=list
```

The regression checks cover complete Services filter visibility, search/filter/reset behavior, account word wrapping, upload control sizes, navigation and Messages at 320/390px, hydration across six account routes, and contact-sheet validation. The 200% root-font cases check a fixed 320px viewport, document width, service title clipping and account button text bounds. This is a CSS reflow stress test, not a complete accessibility certification or a physical-device claim.

## Boundaries

Account navigation and headings respond to `?lang=en`; the retained customer profile form body still contains Bulgarian copy. Its full localization was outside this styling pass. Demo forms and messages remain previews; delivery was not configured or claimed.

Unrelated ignore-file changes, desktop artifacts, imagery and other Cars work are preserved. No dealer deployment, template promotion or outreach is included. Owner visual acceptance remains separate from passing local checks.
