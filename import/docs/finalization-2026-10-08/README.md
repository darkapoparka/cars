# Import finalization: 8 October 2026

Local cleanup is complete. This receipt closes the formatting, stale non-Compare assertions and dependency follow-up from the [initial audit](../final-audit-2026-10-08/README.md). Existing account/admin routing, desktop navigation and header work are preserved. Compare was completed separately in [Vehicle columns](../compare-vehicle-columns-2026-10-08/README.md); this pass did not edit its components or tests.

## Changes

- `tests/mobile-navigation.e2e.ts`: checks the actual Make selector in the first Import step, while retaining route, dismissal, scroll restoration and error checks.
- `tests/smoke.e2e.ts`: expects the current approved desktop 404 canvas, `rgb(250, 251, 252)`.
- `tests/account-hydration.e2e.ts`: checks the current 42px compact mobile upload target. The prior 44px assertion predated the shared compact-action rule; keyboard navigation, fully visible upload targets, avatar bounds and page overflow checks remain intact.
- `package.json` and retained `package-lock.json`: patch `cookie` to 0.7.2, `source-map-js` to 1.2.2 through overrides, and Sharp to 0.35.5. Existing SvelteKit, Bits UI, Vite, Svelte, Tailwind and database framework versions are preserved. Sharp's platform packages/libvips follow its patch; npm also fills six missing optional WASI dependency entries.
- `svelte.config.js` and `public-assets.policy.json`: formatting only. The asset-policy JSON object is unchanged.
- `.prettierignore` and `TEMPLATE.md`: document and exclude generated evidence JSON/reports and archived rendered HTML from formatting; authored Markdown remains checked. The shared retention engine is excluded because repository tests require byte-identical canonical copies. Its source remains unchanged.
- Twelve existing authored QA Markdown files received formatting only. Preimages and the exact path list are retained with the runtime evidence.

No application styling changed during this finalization pass.

## Verification

| Check                                | Result                                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Svelte diagnostics                   | 0 errors, 0 warnings                                                                                                 |
| Whole-source formatting              | Passed in the canonical master and isolated QA capture; final changed-file check also passed                         |
| ESLint                               | Passed; final test/config check passed after the account assertion update                                            |
| Architecture                         | Passed: 57 native route modules, 260 reachable modules, one Tailwind generation entry                                |
| Image signatures                     | Passed: 997 local images                                                                                             |
| Unit tests                           | Passed: 24 files, 162 tests                                                                                          |
| Production build                     | Passed through the existing Playwright build/preview harness using the configured adapter                            |
| Selected Chromium browser cases      | 176 passed across the main run and focused rerun; 50 project-specific skips; zero unresolved failures or flaky cases |
| Shared asset-retention tests         | Passed: 14 repository tests; Import and root engines retain identical SHA-256                                        |
| Cars workflow documentation contract | Passed: 12 active documents and main/editor/skill contracts                                                          |
| Patched Sharp                        | 0.35.5 with librsvg 2.63.2; existing JPEG metadata and an in-memory SVG decode passed                                |
| Production dependency audit          | 0 vulnerabilities                                                                                                    |
| All-dependency audit                 | 0 high/critical, 4 moderate development-tooling package findings                                                     |

The selected browser pass covers English/Bulgarian, desktop/mobile, accessibility, account hydration and redirects, Import/Sell/service dialogs, focus, forms/detail, inventory, localization, navigation and smoke routes. Existing cases also exercise 320px and intermediate widths. The initial pass recorded 172 passes and four failures against the obsolete 44px upload assertion. After its one-byte correction to 42px, all four affected cases passed against the same production build. The combined result counts each case once; the two original reports remain available.

Compare's owner separately recorded 16 passing focused cases and matched phone screenshots. Its source is included in this final capture; the overlay suite was left to that owner.

## Dependency findings

The patches address the [cookie validation advisory](https://github.com/advisories/GHSA-pxg6-pf52-xh8x), [indexed source-map advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) and [Sharp SVG advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). The canonical master and isolated QA installation both contain the patched versions. No assets were regenerated.

The remaining four package findings share the [esbuild development-server advisory](https://github.com/advisories/GHSA-67mh-4wv8-2f99), through Drizzle Kit 0.31.10 and its older loader. These packages are outside production dependencies. Local source inspection found no application import of this toolchain; the reviewed loader utility uses `transform`/`transformSync`, with no `serve`/`context` call. That call-site review is an exposure assessment, not a cleared advisory. A supported Drizzle tooling update still needs validation; the audit's proposed downgrade was not applied. No database schema, migration or connection was changed.

## Source and evidence

Canonical checkout: `L:/CODEX/cars/templates/import`, inside `L:/CODEX/cars`, origin `https://github.com/darkapoparka/cars.git`, on `main`. Concurrent changes and prior dirty work are preserved. No commit, push, template promotion, dealer deployment or outreach was performed by this task.

Checks used Node 24.21.0 and the retained lockfile in `L:/CODEX/cars/runtime/import-final-audit-20261008-01a119f3`. The capture has no copied `.env`, deployment bindings or original CMS data. Tests use synthetic preview fixtures. Final source digest: `5c1ba2e370db8ccd50648b3f2895da505713780565bd9530875885cf61345c53`, 1,772 source/static/config/script/test files. Every final captured path matches the canonical master; only the test assertion changed after the build.

Evidence is retained in `L:/CODEX/cars/runtime/import-finalization-20261008-01a119f3`:

- `verify-final.log`, `final-format.log`, `final-scoped-format.log`, `final-scoped-eslint.log`, `retention-tests.log`.
- `browser-final.log`, `e2e-report.json`, `account-rerun.log`, `account-rerun-report.json`, `browser-combined-summary.json` and failure/reflow artifacts.
- `audit-production-final.json`, `audit-all-final.json`, `dependency-changes.json`, install logs and preimages.
- `source-manifest.json`, `source-manifest-final.json`, `owned-source-check.json` and `source-match-final.json`.

The QA preview on 6798 was stopped after tests. The existing 6794 development listener was restarted with the patched installed dependencies and reported ready. Browser URL policy rejected an attempted reload of the previously bound in-app tab; no new in-app capture after that restart is claimed. Automated Chromium evidence comes from the isolated production preview. Native-device/Safari and hosted checks remain separate.

The template release lock was not promoted. This is a local source/build/browser receipt; dealer personalization, accepted publisher/release selection, mounted/public checks and any real enquiry delivery still belong to the deployment workflow.
