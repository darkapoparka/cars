# QA contract — Carwow-style

A build is necessary, not sufficient. Code cleanup must retain the inspected storefront and preserve owner work. The current cleanup remains uncommitted until owner visual approval.

## Setup and local review

Use Node 24, `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 6463 --strictPort`. The wrapper forwards standard Vite flags. Install test browsers once with `npm run test:install-browsers`; tests do not reinstall them on every run.

## Quality gates

```sh
npm run check
npm run lint
npm run check:architecture
npm run check:typography
npm run test:tooling
npm run test:unit -- --run
npm run build
npm run test:e2e
npm run check:backend-secrets
```

`test:e2e` normally builds and starts a production preview on port 4173. `E2E_PORT` overrides that port. Set `E2E_BASE_URL` to test an already-running local dev or production server without another build/server. `E2E_BROWSER` selects `chromium`, `firefox` or `webkit`. Do not run competing builds against the same `.svelte-kit` directory while browser tests are in progress.

For example in PowerShell:

```powershell
$env:E2E_BASE_URL = 'http://127.0.0.1:6463'
$env:E2E_BROWSER = 'webkit'
npm run test:e2e
```

The existing visual-baseline suite is separate and platform-sensitive. Do not update committed reference screenshots without approval; capture independent before/after evidence for a refactor.

## Route and interaction matrix

`npm run audit:mobile` combines the current sitemap with inventory, article and team-profile links, so pagination cannot omit published vehicle details. It captures the complete set at 390px plus canonical routes at 320, 430 and 1440px. Initial-viewport screenshots retain natural loading; the full-page pass settles lazy images before measuring broken/pending media, overflow and main/skip targets. HTTP response failures remain recorded even if an image fallback recovers. Each route receives a fresh browser context to avoid cross-route state and unbounded crawl memory.

`AUDIT_BASE` selects the reviewed server; `AUDIT_OUTPUT` selects the evidence directory (default `.audit/mobile-current`); `AUDIT_WIDTHS` overrides the width list; `AUDIT_ALL_WIDTHS=1` runs every discovered route at every selected width; `AUDIT_BROWSER` selects the engine. A route crawl is not a substitute for inspecting images or exercising controls.

Run the browser tests for menu/keyboard behavior, home search/import draft separation, inventory filtering and history, detail tabs and save/compare, garage limits, native accordions, content-sheet focus/backdrop/escape, form validation/error/success with intercepted responses, and the 991/992px resize boundary. Check the phone SSR/no-JavaScript path. Also inspect 568px landscape and short keyboard-visible viewports for sheets, and 1280/1920px for affected desktop families.

## Visual and content verification

Typography roles and the source guard are documented in [TYPOGRAPHY](TYPOGRAPHY.md). Check computed sizes and weights as well as screenshots: token use alone does not prove that a component selected the right role.

Preserve the intended separate compositions, typography, spacing, colors, icons, card actions, hero/control order, and open-panel geometry. Check bottom controls, tap targets, horizontal rails, lazy images and focus return. Before/after screenshots should use matching viewport, browser, route/query, data, scroll, motion and storage state. Investigate differences rather than replacing baselines.

For a dealer copy, source and date inventory, verify identity/map/contact destinations, retain sample-content disclosures until approved replacements exist, and complete the stale-identity sweep in `AGENTS.md`. A source catalog, demo review or guide is not evidence of a live dealer fact.

## Evidence boundaries and release gates

Report exact commands, engines, widths, counts, failures and paths. Keep local screenshot/log evidence under `.audit/`; never commit secrets or large generated browser artifacts. Historical audit results do not describe the current tree.

Mocked lead tests prove client validation and response handling, not real provider delivery. Authenticated administration, actual staff delivery, physical iOS/Android keyboards/browser chrome, VoiceOver/TalkBack, deployed-origin verification and field performance remain separate release checks. Do not send real enquiries, modify production data, deploy, commit or push merely because local tests pass.

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](CARS-INTEGRATION.md).
