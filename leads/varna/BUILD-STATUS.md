# Varna batch: compiled source, publication pending

Snapshot: **10 October 2026, after the 18:38:51 UTC CI completion**.

## What is saved

Research lives on `main` in `leads/varna`. The ten full personalized client source directories and the six-design build harness are on `varna`, at immutable source commit **06fcad9c0a8a5ac6b4f27c1a4e0df5445a6c8f5e**. They are not part of the separate Cars marketplace/platform. Other dealers and template working trees were not reset, cleaned or replaced.

The final source candidate is `f18cbf63793cead0a6fb30a33c63464d2bc44ff8`, generated from main `bbfa4cfd0310fd68ffbc4611492dd8c50f4a9a62`. Its preparation report is `leads/varna/candidates/ten-final-app-03.json` on the source branch. It is included in 06fcad9c with the build harness corrections.

## Verified compilation

[Run 38075636982](https://github.com/darkapoparka/cars/actions/runs/38075636982): **60/60 framework build jobs passed**. The separate plan job also passed. The complete 61-job response was checked, not just the first page. This is real dependency installation and native framework compilation, not a source-only audit.

| Dealer | Source directory under clients/ | Native builds | Hosted acceptance |
|---|---|---:|---|
| D&M - Auto Varna | dm-auto-varna | 6/6 PASS | Pending: Vercel quota rejection |
| Kolarov Cars | kolarov-cars | 6/6 PASS | Not submitted |
| Dynamic Auto Varna | dynamic-auto-varna | 6/6 PASS | Not submitted |
| CAR POINT TRADE LTD | car-point-trade-varna | 6/6 PASS | Not submitted |
| PM SELECT AUTOMOTIVE | pm-select-automotive | 6/6 PASS | Not submitted |
| DREAM DRIVE | dream-drive-varna | 6/6 PASS | Not submitted |
| PRIME AUTO | prime-auto-varna | 6/6 PASS | Not submitted |
| AUTOROAD | autoroad-varna | 6/6 PASS | Not submitted |
| Аутофест | autofest-varna | 6/6 PASS | Not submitted |
| Сити Карс | city-cars-varna | 6/6 PASS | Not submitted |

Each dealer includes Auto Best, Modern, Import, App, Mobile and Signature, using the same dealer facts and dated inventory/photo pack across its designs. The generated package includes the shared six-design FAB and the existing external Admin entry. App and Signature advertise alternative home layouts only when those routes actually exist in their source.

The CI artifacts contain per-family build receipts, assembly digests and specialization evidence. Preserve them before their seven-day retention expires if deeper archival proof is needed. This receipt does not claim hosted route/browser QA or release approval.

## Fixes that made the six-family build pass

`script` paths below refer to the verified source branch, not an arbitrary main checkout.

- `scripts/publishing/dealer-template-contracts.mjs` restores Auto Best's generated native price-label export and optional presentation fields without changing vehicle records, amounts or currency. It passes Modern's logo source as a typed child-component prop while retaining the native contrast selection.
- Import and Signature use Node 24.21.0 in the matrix; Auto Best, Modern, App and Mobile use Node 22.23.2.
- Seven regression tests cover the presentation repair, exact engines, Buffer/string preservation, unchanged stock, fail-closed drift, atomic application, double-application rejection and price wrapping.

No template-master changes or invented approval receipts were used to make these fixes pass. The batch was regenerated to include App **4e184777567849a2c5b4a9e4a3e652252179c29c** before all 60 jobs ran. Exact family pins are in `build-verification-2026-10-10.json`.

## Vercel pilot: actual result

Team: `tyj5` / `team_RTNXBnClGWDdcYFFUW0BnqvJ`.

New project: `cars-dmautovarna` / `prj_y5lH6zdYukAYEPkdfR6CbC1VQ7me`, framework `services`, preview-only authentication protection. It is not Git-linked yet. The project read after the attempt returned `live: false`, `latestDeployment: null`, and no domains.

The exact 06fcad9c D&M source package assembled successfully: 13,192 files, approximately 169 MiB public output, payload digest `176b80f915c8bfbb57a470abe11b878ed83b7764ff354e091a80ade48b16b760`. The CLI source upload was approximately 1.5 GB; public output size and uploaded source size are different measures and must not be conflated.

Vercel CLI 63.1.2 completed the upload and then returned:

> Resource is limited - try again in 24 hours (more than 100, code: "api-deployments-free-per-day").

The command exited 1. There is **no successful deployment ID or lead-safe URL** to report. No more deployment attempts were made after this limit. No billing upgrade, alternate account, or quota workaround was used. Existing production aliases were not changed.

## Remaining work and resume boundary

Finish the independent branding proposals, retaining original source assets/provenance. Original logos were inspected but not redrawn with image generation; Autofest's original is 100 x 26 pixels. Validate light/dark headers, square icons, favicon and social share previews before calling branding accepted. Any source/branding change needs fresh source-bound build evidence.

Create the ten dedicated publishing repos named in `selected-10.json`, using normal authorized GitHub repository creation; they are not created yet. GitHub source writes and native Git pushes worked, but the current connector has no repository-creation action and the machine's `gh` CLI is not signed in. Complete the normal browser authorization if using `gh`; do not extract stored credentials or invent repository IDs. Then use the documented Cars publication/qualification workflow, not raw unassembled client folders.

After the Vercel quota requirement is resolved, resume with the existing D&M project first. Do not submit all ten blindly or create a second D&M project. Compile evidence alone is not a release approval. Verify actual Vercel builds, six mounts, EN/BG entry flows, stock/detail images, phone links, logo contrast, mobile/desktop FAB, alternate homes and the shared Admin link before assigning a public alias or marking outreach ready. Keep `noindex` and independent-demo wording.

The local main checkout at `L:\CODEX\cars` contains concurrent work and must not be reset or cleaned. A final fetch there failed for insufficient disk space; the remote source commit is already safely pushed. Do not assume local `origin/varna` is current. Use a fresh allowed isolated checkout with adequate space, and keep the existing disk-capacity guards. No broad data cleanup was performed.

The research, stock and six sources do not need to be recreated. Start from this saved commit and the recorded blockers. No dealer has been contacted by this batch.
