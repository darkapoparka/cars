# QA and evidence

Run checks that establish the changed behavior. Documentation changes use link/command/skill checks and workflow fixtures; they do not require rebuilding the portfolio. Template frontend work uses the template's technical QA reference and focused rendered checks. A new or materially changed dealer requires its offered-design journeys below.

## Local applications

Use the documented Node version and retained lockfile. Keep Modern's full workspace and static-demo environment. Confirm checkout, branch, SHA, relevant dirty state and listener ownership before launching. Use free explicit ports through `scripts/start-preview.ps1`; process readiness is not visual health. Do not run concurrent Next builds/dev against one output directory.

At 390 and 1440 px, check each offered entry, inventory, one real detail, contact, navigation, a search/filter, menu dismissal/focus return and the main enquiry destination. Check offered homepage alternatives, visible images, overflow, error UI and console. A generated logo is implemented only after integration in each app. Do not submit messages to external recipients.

## Mounted dealer preview

Test actual mounted routes and assets on the combined origin. Check CSS/background URLs, links, locale routes, request/API paths, redirects, detail/back navigation and contact destination. Verify all three entries and the actual deployed FAB: visible size/position, active design, choices, Escape dismissal, focus return and navigation. Include 320 px for the switcher.

Use `node scripts/verify-dealer-preview.mjs --help` for the manifest-driven automated smoke. Browser inspection of the rendered results and relevant interactions completes the evidence; a static scan or injected switcher does not.

Set `dealer.json` → `qa.forbiddenIdentity` to source-specific stale business names when useful. The harness does not blacklist a real dealer globally. Complete the fact-pack/content sweep separately. Its search check only proves that an available text input accepts and clears text; verify actual filtering and custom drawers in the browser.

For an explicitly scoped protected preview, Vercel can issue a temporary share link. Keep its returned JSON in ignored `runtime/` and pass `--share-file runtime/<file>.json`. The harness permits only the exact preview origin and records temporary sharing separately from anonymous public access; it never writes the share token into QA metadata. Record expiry and protection limits. This is suitable for a bounded review pilot, not proof of a permanently public lead link. New dealer delivery still requires anonymous access to its final public origin.

## Record separate facts

- Source: canonical path, source commit, dirty limitations, template pins.
- Personalization: observed facts/assets, dated inventory, explained source-identity matches.
- Build: exact command/runtime/commit and result.
- Deployment: project/team, ID, Git SHA, URL and provider state.
- HTTP/browser: date, unauthenticated access, routes, widths, assertions and screenshots.
- Owner review: owner decision only; retain [manual review](MANUAL-REVIEW.md).

Missing evidence is unknown. Source files do not establish a completed build; READY does not establish public browser health; frontend success feedback does not establish provider delivery.
