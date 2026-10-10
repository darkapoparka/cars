# Silver Home service cards — 4 October 2026

This is the initial Home pass and its original verification. The [subsequent shared silver service system](../silver-service-system-2026-10-04/README.md) records the current unified car artwork and source handoff. The original screenshots and staging notes below are retained as evidence of that first pass.

The four mobile Home action cards now match the approved silver car-and-showroom services artwork. Cars uses a new silver estate/SUV pair. Sell, Import and Finance reuse the existing reviewed About valuation, container/import and leasing illustrations through the shared dealer artwork configuration. Card dimensions, routes, labels and typography are preserved.

The approved overview is implemented below brand discovery as one native Bulgarian/English card linking to the existing About `#process` section. Its image is decorative and lazy-loaded. Shared spacing, surface and type tokens govern its natural layout; equal text/image columns keep the 320px action readable. Desktop hides the mobile overview and retains its original composition.

## Rendered comparisons

These are actual localhost app screenshots, captured in the in-app browser:

| Before, 374 × 884 | After, 374 × 884 |
| --- | --- |
| ![Previous Home cards](home-cards-before-bg-374.jpg) | ![Matching silver Home cards](home-cards-after-bg-374.jpg) |

Both action-card screenshots use the same scroll position, 442px. All four card rectangles and copy match exactly: 159.5 × 161.609375px with the same 16px gaps.

| Before services overview | Implemented services overview |
| --- | --- |
| ![Brands and guides before](home-services-before-bg-374.jpg) | ![Services overview below brands](home-services-after-bg-374.jpg) |

[Bulgarian at 320px](home-services-after-bg-320.jpg), [English at 320px](home-services-after-en-320.jpg), and [native browser measurements](browser-audit.json) cover the narrow-screen layout, destination and keyboard focus. At 1440 × 900, every existing desktop section rectangle and the 3929px document height match the before snapshot; the mobile cards and overview remain hidden.

## Checks

- `npm run validate` on Node 22.20.0: architecture, CSS policy, tokens, typography, asset inventory, domain checks, Svelte/type checks and production build passed; Svelte reported zero errors and warnings.
- `BASE_URL=http://127.0.0.1:6461 node scripts/mobile-polish-smoke.mjs`: eight BG/EN cases at 320, 390, 430 and 1440px passed. The existing suite now checks the four silver assets, overview placement, touch target and localized service link.
- Home-only `scripts/mobile-reflow-smoke.mjs`: six BG/EN cases at 320, 390 and 430px passed with normal, increased spacing and 200% text settings. No page overflow or clipped actions were detected.
- Native browser: the services card opens `/bg/about-us#process` at the service section, and keyboard focus is visible with a 3px outline. No browser errors or warnings were captured.

Saved [mobile polish report](mobile-polish-report.json), [reflow report](reflow-report.json), and [validation result](validation.json) record the actual local checks. Verification ran against the current working checkout, which includes pre-existing desktop/content drafts. Staging keeps those drafts separate and compiles the staged locale output from the three task-owned messages. This is local implementation evidence, not template promotion or dealer deployment.

[Artwork provenance, delivery files and exact prompts](../../provenance/home-silver-cards-2026-10-04.md).

## Source handoff

The implementation is present in `L:/CODEX/cars/templates/auto-best` on `main`, based on `60244f06ff9a2ab872eafebdb6f7b6dac5edd383`. Commit/push is pending because `L:/CODEX/cars/.git/index.lock` exists. The shared lock has been preserved, and no task files were staged over it.

`runtime/home-silver-cards-20261004/staging-plan.json` lists the 20 task-owned whole files and five partial files with source hashes. `partial-index.patch` contains only the three locale messages and their generated output, the two-asset guard increment, and the Home styling documentation. Existing team/contact translations, desktop artwork/configuration and styling drafts remain separate. The patch passes `git apply --cached --check`.

After the repository owner releases the lock, rerun `prepare-scoped-staging.mjs`, then `stage-reviewed.mjs` from the template directory using Node 22.20.0. Review the scoped index, commit the silver Home cards, make a non-force push to `origin/main` and verify the resulting remote commit. The helpers reject changed HEAD/source hashes or unrelated staged work.
