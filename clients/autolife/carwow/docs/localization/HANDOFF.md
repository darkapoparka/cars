# Native EN/BG localization handoff

Verified 20 September 2026 in the canonical Carwow checkout on main. This existing task was the sole source/index/build writer and created no other tasks, agents, worktrees or application copies. Only Carwow was changed. Cars, pins, dealers, other applications, credentials, security/approval settings and dependency versions were not changed.

## Exact source and deployment

- Original baseline: `89f50c427863050abb7923152f05c091bb937d1e`.
- Earlier application release: `2cb3eb1d33f71d5b3ef92497b773d629dcd52ffc`, followed by documentation commit `6a503023c012c3b3f533954e9f756422af6b6313`. Its original 156-route matrices remain historical evidence, not certification of the expanded scope below.
- Final application-source commit: `6e2bb94f85e0140846ce8c11e09b89330c3fdbf8`.
- Tested and pushed follow-up release: `4c5db243f07fa13831894e762203a75366e5a44d`; tree `96cbf5c74b4fd7b0603291fa26d2497eb2eba247`.
- The only change from the application-source commit to the release commit scopes a browser verifier selector. Application, catalog, configuration and asset blobs are identical, confirmed by `git diff --exit-code 6e2bb94 4c5db24 -- src static localization svelte.config.js package.json package-lock.json`.
- Existing Vercel project `prj_MrJ6NCi6r5wuMlo1k697mUk1AENj`, team `team_RTNXBnClGWDdcYFFUW0BnqvJ`.
- Verified Git/main production deployment `dpl_8vUuDx4pWFyEMqaZWNsrjm17um7C`: **READY**, exact release SHA, no alias error. Immutable deployment: https://cars-template-carwow-l66rqgui2-tyj5.vercel.app. Public alias tested: https://cars-template-carwow.vercel.app.

[verification.json](verification.json) records source hashes, commands, counts, skips, build/browser receipt hashes and deployment identity. Full ignored artifacts remain under `.audit/localization/`. This final documentation commit follows the verified application and changes no application source. Its resulting Git-connected READY/alias check is recorded in `OWNER-STATUS.md` and `followup-docs-deployment.json`; it does not require another full application matrix when the source comparison is empty.

## Implemented and scoped

Native request-local EN/BG catalogs and component bindings cover navigation, inventory/detail, Sell, Import, trade-in/contact, financing/calculator, information/editorial/team pages, forms/errors/accessibility and caller-owned dynamic metadata. Country and language preferences remain independent of dealer facts and inventory currency. Unknown immutable copy fails explicitly; ambiguous aliases still require context-specific keys. User input, inventory identifiers, names and calculations are preserved.

The existing native auth/session/DB/device handler is retained. Public business writes are blocked before handlers; only the exact unlocalized preference endpoint for the configured base accepts preference operations. Admin remains English and uses base-aware resource links. Cookies remain host-only, Path=/, HttpOnly, SameSite=Lax, Secure on HTTPS and bounded in lifetime. Explicit supported URL language wins over cookies; unsupported lang queries without an explicit supported path locale are rejected. HTML remains private/no-store with User-Agent, Cookie and Accept-Language variation. Native data responses retain SvelteKit's private/no-store behavior.

Preferences use existing desktop navigation, mobile menus and footers. The temporary root floating control was removed; error pages have an in-flow fallback. First-visit dismissal, stable focus return, stale requests, blocked storage, keyboard behavior and complete no-JS forms are verified. Invalid no-JS return destinations fall back within the configured base.

Follow-up corrections include localized initial contact subjects/video-photo prose, explicit compact fuel labels, VAT popup labels/BGN units, home alias metadata, retained presentation route copy/metadata/assets/account links, localized sitemap listings/articles and mounted robots sitemap URLs. Presentation changes are bounded translation-fit corrections: readable dark-header control, nonoverlapping heading/search and contained actions at narrow widths. No pages were removed and no unrelated redesign was published. `paths.relative: false` keeps Kit's resolve output absolute before locale wrapping. The installed and locked Kit version is **2.61.1** (the earlier review referenced 2.57.0); installed APIs were used without a dependency upgrade or version-3 migration.

## Redirect release blocker: resolved and reverified

The original coordinator failures are retained in `coordinator-normalized-return-path-negative.json`, `coordinator-redirect-recheck-*.json` and `coordinator-watch/`. They are genuine failing-before evidence.

Current Carwow policy SHA256: `0d94a5cd19f105bd822dd56d14baf237697a20e48b450b12b71a5bc83288d85e`. After WHATWG dot-segment normalization, the pathname must begin with exactly one slash; encoded separators, nested escaping and controls remain rejected. `/x/..//evil.example/path`, `/%2e%2e//evil.example/` and `/..//evil.example/path?x=1` are rejected for save/dismiss in form and JSON requests, without Location or cookies. An external URL confined to a same-host query remains valid.

The current policy/catalog suite passes **109 tests**, including all **12** normalized-return negatives and the valid-query positive. Every final browser environment also tests the actual form/JSON handler, a malicious mocked client destination and six no-JS invalid-return cases. No Cars/shared-kit/Al Reef policy was edited.

## Final verification

All browser work was serial Chromium, EN/BG at **320, 390 and 1440**, including explicit URLs conflicting with saved locale cookies.

| Environment                              | Routes | Interactions | Follow-up checks | Failures | Explicit skips |
| ---------------------------------------- | -----: | -----------: | ---------------: | -------: | -------------: |
| Standalone production build              |    180 |           59 |               35 |        0 |              2 |
| Configured `/variant-3` production build |    180 |           59 |               35 |        0 |              2 |
| Actual public Vercel alias               |    180 |           59 |               35 |        0 |              2 |

Skips are EN/BG desktop cases for the intentionally mobile-only import URL hero; desktop contact validation is covered. Routes include home compatibility aliases and retained presentation alternatives. Checks cover SSR/client language, native links, image currentSrc/base and missing assets, OG/hreflang/dynamic descriptions, overflow, tab **text** containment in selected/unselected states, header action bounds and heading/search nonintersection. Follow-up checks also inspect every English sitemap listing's SSR metadata and VAT copy, actual mounted XML/robots, preference aliases, query precedence, trade-in presets/free text, VAT popup and malicious no-JS fallback. Interactions include finance invalid numbers/terms/deposit/trade-in/rates, filters, saved cars/compare, menus, demo failures, preference races and focus return.

Evidence directories: `release-followup-final-standalone/`, `release-followup-mounted/`, `release-followup-public/`. Commands: `node scripts/localization-followup.mjs`, `node scripts/localization-browser.mjs`, `node scripts/localization-interactions.mjs`, with `LOCALE_ORIGIN`, `DAY_LOCALE_BASE` and `LOCALE_EVIDENCE` set for each environment. Mounted and standalone builds used `node scripts/build-node-preview.mjs`; the owned local Node preview used PORT=6464, HOST=127.0.0.1 and ORIGIN=http://127.0.0.1:6464. Build logs and SHA256 receipts are recorded in verification.json.

Other checks: Svelte **0 errors/0 warnings**; **167 unit tests in 21 files** on the task-only application source; **109 policy/catalog** and **11 tooling** passes; code lint; all **36 committed task-owned blobs** formatted; localization guard; typography **289 source files**; backend secret boundary **354 client-exposed source/395 built client files**. The final selector-only verifier change separately passed ESLint. Exact source hashes were captured while tracked source/index were clean, before local work was restored.

Screenshots were opened and inspected, including mounted EN desktop VAT popup, BG narrow presentation headers, BG desktop presentation header, and restored EN mobile article/BG mobile index. A settled VAT screenshot avoids the initial opacity transition. Screenshot evidence supplements, rather than replaces, interaction and containment assertions.

## Preservation and local-only work

The first release restored 25 held paths. This follow-up held **24 paths** (21 tracked, three untracked): **22** now match the hold bytes exactly; `format.ts` and `MobileBlogArticle.svelte` were formatted after restoration. `followup-restoration-final.json` records refreshed current hashes and retains both backup generations. The original 25th path, `src/lib/styles/daynight-home-desktop.css`, remains byte-identical to baseline SHA256 `6f9d0895050d367617926b7dbdb2932191307394e8dc1852fa648ecde2a392f9`.

Unrelated desktop/mobile composition edits, cents-preserving data/formatter changes, new blog components/tests, promo assets and `.impeccable` work remain local and uncommitted. The mobile article share-status localization and optional EUR display-locale formatting are retained in that unpublished composition. The release diff includes no unrelated styles/data/repository/promo-asset publication.

Restored local checks separately passed: Svelte, guard, Node build, **176 unit tests in 22 files**, and **72 browser cases**, including all six blog articles, share success text, empty search, both languages and all three widths. These checks are not release-source proof or owner visual approval of the redesign. The final local preview is `http://127.0.0.1:6464`, serving restored local work. Port 6463 was never restarted or otherwise touched.

## Retained failures and limits

Earlier failures remain distinct: strict presentation copy 500s (including 177/180 routes); localized heading/action clipping and control contrast; a local preview missing its explicit HTTP ORIGIN; a VAT test before hydration/transition; and the mounted extra test's 23/35 result caused by an account locator matching two legitimate headers. Source defects were corrected; selectors/timing were corrected without removing assertions. Accepted results above were rerun after the relevant fixes.

Unchanged gate limitations: architecture reports two pre-existing unreachable modules (`MobileLeadManualCard.svelte`, `mobile-filter-pill.css`); whole-repository formatting reports five unrelated existing files; local production-write backend preflight lacks DATABASE_URL, BETTER_AUTH_SECRET, CHAT_COOKIE_SECRET and DEFAULT_DEALER_SLUG. No credentials/settings were changed to hide those failures. Public business delivery is disabled and was not claimed.

Full legacy e2e/visual baselines, Firefox/WebKit, forced production 500, authenticated admin workflows, real business delivery and independent linguistic review were not claimed. This release is implemented, scoped-committed, normally pushed, Git-deployed and verified as identified above; retained design work is authored/local only. No dealer rollout or Cars pin promotion is authorized by this handoff.
