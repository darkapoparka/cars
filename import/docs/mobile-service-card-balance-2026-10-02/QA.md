# Mobile Services card balance — 2 October 2026

The mobile directory cards now have a short localized context label above the title. The image column grows from 30% toward 36% as space allows, while retaining room for the existing headings at 320px. The rounded action follows the summary with an 8px gap instead of being pushed to the bottom of a tall image.

Labels describe the service context, such as “Преди покупка” and “След покупка”. They are typed public content in `src/lib/content/service-directory.ts` and are included in search matching. Existing service destinations, desktop copy, mobile search and filter controls are retained.

Changed source:

- `src/lib/components/services/ServiceCard.svelte`
- `src/lib/content/service-directory.ts`
- `src/routes/(site)/services/+page.svelte`

## Visual evidence

Before images came from the existing development server on port 6790 before editing. After images came from the independently built frozen preview on port 6795. Both use the same viewport and page position for the paired top views.

| View                 | Before                                | After                               |
| -------------------- | ------------------------------------- | ----------------------------------- |
| Bulgarian, 320 × 844 | [Before](before/services-320.jpg)     | [After](after/services-320.jpg)     |
| Bulgarian, 390 × 844 | [Before](before/services-390.jpg)     | [After](after/services-390.jpg)     |
| Desktop, 1440 × 960  | [Before](before/services-desktop.jpg) | [After](after/services-desktop.jpg) |

Additional evidence: [remaining cards at 390px](after/services-390-lower.jpg), [English at 320px](after/services-en-320.jpg).

At 320px, all six Bulgarian headings remain on one line and the image width remains 87px. At 390px, the image width is approximately 130px. All six cards have an 8px summary-to-action gap. The desktop spot check confirms that the mobile labels are hidden and the existing three-column card layout remains. No horizontal overflow was observed in these views.

## Checks

Using the retained lockfile and Node 24.21.0 in the frozen QA candidate:

- Scoped Prettier and ESLint: passed for the three changed source files.
- `npm run check`: passed with zero errors and zero warnings.
- `npm run build`: passed.
- Existing focused Playwright cases: **6 passed, 2 skipped**. The two skips are the existing desktop exclusions for mobile service-filter cases. Coverage includes both locales, 320/360/375/390px title reflow, white single-row filter pills, native GET search, service destinations, empty-search recovery, and 200% root-font reflow.
- Browser check of native GET search for “След покупка”: one Registration result with `/bg/contact?topic=registration#contact-details`.

Commands for the focused browser checks:

```text
PLAYWRIGHT_SKIP_WEBSERVER=1
PLAYWRIGHT_BASE_URL=http://127.0.0.1:6795
node node_modules/@playwright/test/cli.js test tests/mobile-secondary.e2e.ts tests/account-hydration.e2e.ts --grep "service filters|contact and account pages reflow" --workers=1 --reporter=list
```

`source-snapshot.json` records the complete working-source snapshot used for the build. `verified-files.json` confirms that the three task-owned files still matched that candidate when evidence was saved. Other working changes were preserved. This is local template verification; no template promotion or dealer deployment was performed.
