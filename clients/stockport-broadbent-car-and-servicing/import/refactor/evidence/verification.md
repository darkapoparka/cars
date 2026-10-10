# Verification record — 19 September 2026

## Scope and source identity

Audited checkout: `J:\template-repos\cars-template-import`, remote `darkapoparka/cars-template-import`, branch `main`, commit `5ff9805ebe0211343e7a025465d8d71e306180fa`, **plus the existing 18 modified/untracked source paths**. Origin was fetched and the branch was aligned when inspected. Therefore these results describe the working-tree snapshot, not the commit alone.

The existing source files were fingerprinted before the documentation write; no fingerprint changed during the audit checks. Final delivery checks confirmed unchanged source fingerprints and all 18 pre-existing dirty paths, an unchanged HEAD, and only the new 25-file refactor/ folder added to Git status. All relative document links resolve. Scoped Prettier validation and git diff --check passed. No application refactor, dependency update, commit, push, deployment or database migration is part of this task.

The audit inspected route/layout ownership, shared components, desktop and mobile implementations, source CSS, server rendering, authentication/persistence, forms, packages/configuration, repository guidance and asset metadata. It is not a claim that every line or every user journey has been dynamically verified.

## Commands and observed outcomes

| Command/check                                                                 | Observed outcome                                                | Interpretation                                                                 |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `node --version` / `npm --version`                                            | v24.21.0 / 11.19.0                                              | Local audit runtime, not a declared project contract                           |
| `npm run check`                                                               | Pass; zero errors, zero warnings                                | Svelte/TypeScript diagnostics only                                             |
| `npm run test:unit -- --run`                                                  | Pass; 3 files, 14 tests                                         | Existing server/unit coverage, not UI regression coverage                      |
| `npm run lint`                                                                | Fail at Prettier; five files                                    | The chained ESLint command did not execute here                                |
| `npx --no-install eslint src --format json --output-file <audit>/eslint.json` | Fail; one error, zero warnings across 555 files                 | Separate source lint run                                                       |
| `npx --no-install playwright test --list`                                     | Fail; no tests found                                            | No discoverable E2E suite                                                      |
| `npm audit --json`                                                            | 20 affected package entries: 5 high, 8 moderate, 7 low          | Scanner counts; not a reachability/exploitability conclusion                   |
| `npm audit --omit=dev --json`                                                 | 11 entries: 3 high, 2 moderate, 6 low                           | Dependency classification is not a production bundle threat model              |
| `npm outdated --json`                                                         | Registry candidates captured                                    | See the installed-versus-available matrix, not an automatic upgrade list       |
| Clean independent copy: `npm ci`                                              | Pass                                                            | Used retained lockfile; did not replace the checkout's dependencies            |
| Clean independent copy: `npm run build`                                       | Pass                                                            | Production build; adapter-auto did not select a deployment environment locally |
| Local production preview, six public routes at two widths                     | All 12 navigations returned 200; no captured `pageerror` events | Read-only exploratory browser samples, not full E2E/visual approval            |
| Inventory at 390px with JavaScript disabled                                   | Main inventory content absent; bottom navigation text remained  | Confirms essential inventory content depends on client mounting                |

Prettier reported existing issues in `AGENTS.md`, `README.md`, `docs/CARS-INTEGRATION.md`, `src/lib/components/detail/AuxeroVehicleDetailStaticContent.svelte` and `src/lib/components/inventory/AuxeroInventoryDesktopSurface.svelte`. They were not reformatted during this documentation-only task.

The separate ESLint error is `src/lib/components/calculator/CalculatorEstimator.svelte:14:22`: unused `_active`, rule `@typescript-eslint/no-unused-vars`.

The unit suite consists of `import-criteria.spec.ts` (3 tests), `vehicle-keyword.spec.ts` (2 tests) and `inquiry-flow.spec.ts` (9 tests). The last suite mocks persistence/private configuration; it does not demonstrate real database delivery or live access control across every route.

## Clean build methodology and diagnostics

The existing preview on port 6464 was left running. To avoid replacing its output, the audit copied the current `src`, `static`, `.template-ref`, scripts and required build/configuration files into an isolated temporary directory. It did **not** copy `.env`, `.git`, deployment bindings, private CMS records or the original generated output. No branch/worktree was created.

The first attempt reused `node_modules` through a cross-drive junction. It failed with a generated Vite entry-name error, and the corresponding dev server could not hydrate modules from the external dependency path. Those screenshots/errors are **invalid as current-source application verification**.

That audit server was stopped, only the audit dependency junction was removed, and a real `npm ci` was run in the copy. Installation and production build then passed. The clean build emitted plugin-timing diagnostics and an adapter-auto environment notice. It generated an approximately 3,451.92 kB uncompressed `auxero-template.js` **server** chunk, not a browser download of that size. This is useful evidence of the legacy adapter's footprint, not a measured page-performance result.

The install reported native/install-script approval warnings for several packages under this npm version. No allow-script policy was silently changed. Image-processing output still requires its own test before an asset pipeline release.

The initial Playwright launch also found its expected bundled browser executable missing. Exploratory checks used the installed Chrome channel instead; no pinned-browser golden-image suite was established. The script was re-run against the successful clean production preview on loopback port 6764, replacing the invalid earlier sample metrics.

## Browser sample matrix

| Routes                                                                   | Desktop     | Mobile    | Checks                                                                                                                                        |
| ------------------------------------------------------------------------ | ----------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`, `/inventory`, `/import`, `/sell-your-car`, `/financing`, `/contact` | 1440 × 1000 | 390 × 844 | HTTP status, captured page errors, heading/header/form geometry, visible completed-image failures, required token value, viewport screenshots |
| `/inventory`, JavaScript disabled                                        | Not sampled | 390 × 844 | Essential server-rendered content and screenshot                                                                                              |

In the successful preview sample there were no positive document-width overflow measurements and no failed completed visible images at capture time. This does not establish all lazy-loaded assets, all transient states or all breakpoints are correct. A negative width delta from the initial measurement method must not be treated as a meaningful negative-overflow metric.

All six sampled desktop headers measured 94px high. This **does not support a claim that these headers currently have different heights**. Differences in the inner controls, container rules, cards and form systems still need the explicit contracts described by the plan.

Visual inspection of desktop inventory/import/sell and mobile inventory confirmed different card/form surface treatments and desktop process/CTA patterns. For example, import uses a grey form panel with white filled inputs, while sell uses a white panel and outlined inputs. Whether a difference is intentional must be decided by role, not by enforcing identical backgrounds everywhere. Mobile inventory retains the compact horizontal card/list pattern.

The DOM sampling found no visible `h1` element on the mobile import/sell entry surfaces; inventory has a screen-reader-sized heading. Include a proper semantic heading check in those route migrations. `textContent` can include hidden duplicate title variants, so repeated sampled text alone is **not** proof that duplicate headings are visually displayed.

`--bc-brand` computed as empty in the samples, matching the source/static-CSS scan. This confirms the missing alias referenced in legacy helper styling; it does not mean the application's actual accent token is absent.

The no-JavaScript inventory page exposed only the navigation labels “Начало / Коли / Продай / Внос / Меню” in the sampled body text, not the vehicle catalogue. This is consistent with `InventoryTemplatePage.svelte` initializing the mobile route flag in `onMount` while CSS hides the desktop branch on a small viewport.

No forms were submitted. No account records were edited. No providers, database writes or real notifications were exercised. The screenshots are exploratory local evidence, not approved visual snapshots.

## Evidence storage and portability

Local machine logs, the isolated copy, browser script, metrics and PNG samples were written under `%TEMP%\cars-import-refactor-audit-20260919`. Those files are not part of the application's source or this portable documentation archive. They may be removed by normal temporary-file cleanup. No font binaries, dependency tree, source image assets or secrets are included in the archive.

This folder carries the portable summary and lexical baseline. During implementation, create durable reviewed test artifacts in the chosen CI/review system instead of treating temporary local screenshots as an enduring release gate.

## Measurement definitions

Counts cover files under `src` at the captured working-tree snapshot. Styling measurements scan `.css` and `.svelte` text for `!important`, `:global(`, hex-colour literals, pixel values and inline-style syntax. They include comments/string content when the expression matches; they are risk-location signals, not parsed declaration counts or independent bugs. Static-directory size includes all its files, active or inactive, rather than one page's delivered assets.

Source hashes, route/file inventory, source/config/glob references and runtime checks serve different purposes. In particular, an asset or package with zero simple textual imports is not automatically safe to delete.

## Not verified by this audit

Mounted Cars packaging, live Vercel deployment, all native and legacy routes, authenticated admin paths, durable provider delivery, multi-instance storage, Firefox/WebKit, screen readers, full keyboard/gesture histories, device keyboards/safe areas, all translations, image provenance/licensing approval, Lighthouse/Core Web Vitals, accessibility conformance and owner visual acceptance remain explicit implementation/release gates.
