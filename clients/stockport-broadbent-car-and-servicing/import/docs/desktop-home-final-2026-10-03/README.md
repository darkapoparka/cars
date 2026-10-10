# Final desktop Home and overlay pass — 3 October 2026

The owner requested replacing separate Home View all buttons with browse cards inside their sections, plus a final review of overlay, button and hover ownership. Work stays in the canonical Import master on Cars `main` at `L:/CODEX/cars/templates/import`. The preceding white-panel styling remains the visual anchor; this pass retains the cool canvas, white panels, dark text, red primary actions and automotive hero composition.

[Before/after gallery](http://127.0.0.1:6795/home-final.html) · [Live Home](http://127.0.0.1:6790/bg) · [Live Inventory](http://127.0.0.1:6790/bg/inventory)

## Result and ownership

- Stock now presents three vehicle previews and a native inventory browse card in the fourth grid slot. The separate View all button is removed.
- Reviews and guides retain all three previews and end with the same browse-card component. Their desktop grids use four columns at wide widths and two through 1100px. Mobile horizontal rails retain their full content and presentation.
- Make/type discovery keeps its existing data-rich end tiles. Search, vehicle detail, save/compare and campaign actions keep their product purpose.
- `HomeBrowseCard.svelte` owns the repeated link markup, existing theme roles, neutral hover and visible focus. Localized labels/destinations retain their content owners; contextual accessible names distinguish the destinations. Links work with JavaScript disabled.
- `Modal` owns desktop title, close/back and footer treatment. `Action` consumes inherited height, text and radius values with its retained defaults. Redundant consumer overrides are removed from inventory/search dialogs. The backdrop literal moves to the existing token owner without a visual change.
- Desktop portal titles use the available 20px heading role. Close/back controls use square 48px targets, including the retained icon primitive's flex basis. Footer actions use 48px height, 18px text and the existing 8px radius. Selected filter rows share the existing accent tint, distinct from neutral hover.
- Typed `inventoryDialogCopy` owns the repeated BG/EN overlay labels and result-count text. Selection, loading, query, draft and domain controllers remain with their current owners.

This makes the touched public owners clearer. It does not claim that every retained legacy wrapper or inline label in the repository has been modernized.

## Actual screenshots

Before images were captured from the canonical source before this pass. After images come from its frozen production build. No palette or component styles were injected for the screenshots.

| View                                | Before                                  | After                                  |
| ----------------------------------- | --------------------------------------- | -------------------------------------- |
| Home stock                          | [Screenshot](before-home.png)           | [Screenshot](after-home.png)           |
| Full Home, including reviews/guides | [Screenshot](before-home-full.png)      | [Screenshot](after-home-full.png)      |
| Search dialog                       | [Screenshot](before-search.png)         | [Screenshot](after-search.png)         |
| Home make picker                    | [Screenshot](before-home-make.png)      | [Screenshot](after-home-make.png)      |
| Inventory make selection            | [Screenshot](before-inventory-make.png) | [Screenshot](after-inventory-make.png) |

## Verification

The complete frozen source contains 1,678 application/configuration/test/asset paths. Its SHA-256 manifest digest is `923aae0d74951c327c71fb937d1b74c0437036f4f1914f6b55969e6346dd6233`; [source-snapshot.json](source-snapshot.json) owns the per-file hashes. The retained lockfile digest is `aa596db7046c3f226ce50b488e283e30121eb49122d5006c60035ef57a952e1c`. The QA copy has its own `npm ci` and build output, with no Git, environment-secret or deployment bindings. The live preview's output was preserved.

Svelte checks report zero errors/warnings. Task formatting, full ESLint, architecture, assets, 124 unit tests and the production build pass. `npm run verify` still stops at three unchanged formatting files: `public-assets.policy.json`, `scripts/public-asset-retention.mjs` and `svelte.config.js`. The subsequent gates were run separately and their results are recorded; full verify is not reported as passing.

Five existing browser suites pass 42 applicable tests with 16 intentional project skips. The focused grid/keyboard/native-link cases in `visual-hierarchy.e2e.ts` pass three tests with three intentional mobile skips. There are no failed or flaky cases. Coverage includes search/filter GET navigation, header disclosures, avatar/article rendering, keyboard focus, dialog dismissal, accessibility, contact typography and browse destinations in BG/EN with JavaScript disabled. The obsolete All filters color-class assertion now checks the actual accessible control, its height, opening behavior and Escape focus restoration.

Forty baseline, 100 responsive after and 20 production states have no response, page-error, overflow or broken decoded-image failures. The matrix covers Home's four modes, Inventory default/selected/empty, Services, About and Contact in BG/EN at 320/390/768/1024/1440/1920px where applicable. Six production overlay captures and six additional interaction records verify titles, targets, footer roles, distinct selection/hover, focus trapping and Escape restoration. [verification.json](verification.json) records counts, dimensions, log hashes and screenshots.

All 20 matched mobile viewport PNGs and complete-page computed-presentation records at 320/390px are identical, including About. Three of four additional full-Home PNGs are byte-identical. The English 390px full-page image differs by 55,857 pixels within `[14, 2415, 375, 2617]`, confined to the unchanged consultation banner image. Its measured geometry and copy match. Responsive-image painting is the inferred cause; exact full-page pixel equality is not claimed for that frame. External map pixels were excluded consistently.

The first iteration hid a third review and used a title token unavailable to portals; browser and visual checks caught both. All review/guide previews are retained in the final grid, and titles use the portal's actual role. A subsequent measurement found a 44px flex basis on the search close control; the desktop hit-size token now owns that dimension. Earlier diagnostic files are retained under ignored task runtime.

## Integration and limits

The workspace doctor fetched before writing and before integration. The baseline was `629e23fead391fa3b0f853c19a988334f75bac2e`. While QA ran, a Modern-only commit advanced Cars `main` and `origin/main` to `5b111b173b058c8da9910833d93b6ecec490ddd5`; it was preserved and Import's source hashes remained unchanged. The staged index was empty before task staging. The scoped change includes the 13 source/test paths listed in verification, maintained styling/architecture/QA/handoff documentation and this evidence folder. Import's inherited ignore edits, old evidence drafts and untracked unused asset remain outside the commit, as do other templates and dealer work. No lock deletion, reset, blanket staging or force push is used.

An unchanged empty index lock created at 19:28:33 UTC prevented staging. It was observed repeatedly, opened exclusively and retained until its originating Git processes had ended. No current Git process predated the lock; newer app diff/status readers were left running. The orphan was preserved with native PowerShell `Move-Item -LiteralPath` under `runtime/desktop-home-final-2026-10-03/recovery/index-lock-2026-10-03T192833-preserved`, with its metadata in `index-lock-receipt.json`. Scoped staging then succeeded. The lock was not deleted.

Raw captures, logs, diagnostics and the frozen QA copy remain at:

- `L:/CODEX/cars/templates/import/runtime/desktop-home-final-2026-10-03/`
- `C:/Users/radev/.codex/tmp/cars-import-home-final-2026-10-03/qa/`

These are local standalone master checks. The entire browser catalogue, external/native handoffs, hosted or mounted behavior, immutable template release, owner visual approval and dealer rollout are separate evidence boundaries. No template promotion, dealer deployment or outreach was performed.
