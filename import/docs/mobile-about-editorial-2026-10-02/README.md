# Mobile About editorial trial

The owner accepted the desktop About direction and requested a mobile About trial before the next full desktop pass. This change adopts its calmer neutral surfaces locally on About, preserves the approved desktop result, and records the [desktop styling contract](../DESKTOP-STYLING.md) and [new-session prompt](../DESKTOP-POLISH-PROMPT.md).

## Changes

- About uses the shared editorial canvas, border, muted copy and hover values on mobile. The desktop aliases still resolve to their original values; other mobile routes retain their existing theme.
- Section headings, process titles and team names use the body font at their existing readable sizes. Process markers are decorative 32px circles. Copy remains 16px/24px.
- The team card's compact mobile variant places Instagram beside the role, preserving its 48px target. The role area supports two readable lines. All three cards are 110px tall in the four checked mobile states; the previous CEO card was 140px at BG 390px while the other cards were 98px.
- About UI labels moved from inline BG/EN conditionals into typed `src/lib/content/about-page.ts`. Identity, people, copy, imagery, hero actions, destinations, page order, contact banner and bottom navigation retain their existing owners.

## Before and after

Both full-page captures use a 390 × 900 mobile viewport. A full-page capture places the fixed bottom navigation at the original viewport position. [The ordinary scrolled viewport](after-team-mobile.jpg) shows the complete team cards and visit banner with the navigation at the screen bottom.

| Before                                    | After                                   |
| ----------------------------------------- | --------------------------------------- |
| ![Before mobile About](before-mobile.jpg) | ![After mobile About](after-mobile.jpg) |

![Team cards and visit banner](after-team-mobile.jpg)

## Verification

- BG and EN checked at 320px and 390px: no horizontal overflow or failed visible images, equal 110px team cards, 48px social target, readable role wrapping and preserved action destinations. [Comparison](comparison.json), [before](before-mobile.json), [after](after-mobile.json).
- About desktop at 1440 × 1000 in BG and EN exactly matches the before probe, including measured geometry, fonts, surfaces, links and image sources. [BG before](before-desktop.json), [BG after](after-desktop.json), [EN before](before-desktop-en.json), [EN after](after-desktop-en.json).
- Cars and Contact hero actions were exercised through native navigation, including Back. Contact mobile at 320px retains all measured geometry, fonts, surfaces, links and image sources. Its baseline raw `main.textContent` contained nonvisual Svelte template serialization that disappears after hydration; that field is explicitly distinguished in [navigation evidence](navigation-checks.json).
- The EN 320px baseline reused the larger cached candidate of the existing contact-banner image; the after browser chose its small responsive candidate. Both are the same unchanged image family. No image component or asset changed in this trial.
- Svelte check: zero errors and warnings. Scoped ESLint and Prettier passed. Architecture passed for 57 route modules and 221 reachable modules. Live assets passed for 946 images; the QA snapshot retains two unused earlier illustrations and passed for 948.
- Existing unit suite passed: 18 files, 124 tests. Production build and Vercel adapter packaging passed in the existing frozen QA snapshot on C:, using Node 24.21.0 and the retained npm lockfile. Live dev output was preserved. The complete [application source manifest](source-snapshot.json) contains 1660 paths synchronized to that snapshot.

Local browser evidence uses the in-app Chromium browser. This is a focused About trial, not a full public-route audit, native-device acceptance, template release or dealer rollout. The next session should preserve this mobile state pending the owner's review and use the documented desktop contract.

## Preservation and runtime

The inherited Import ignore-file changes, untracked drafts and unrelated Cars/dealer work were preserved. A full source drive interrupted one component save; its verified prior QA source was restored and the task changes reapplied. The live source and tested snapshot were then compared by hash. No recovery evidence was deleted. The earlier About build log was moved with SHA-256 verification from ignored `runtime/desktop-about-studio-2026-10-02/build.log` to the existing C: QA snapshot's `runtime/retained-about-build-2026-10-02.log`.

The pre-existing empty Cars `.git/index.lock`, last written at 17:48:31, had no active file handle and no Cars Git writer was found. It was moved with hash verification to ignored `runtime/desktop-about-studio-2026-10-02/stale-index-lock-2026-10-02-174831.lock` so the required scoped commit could proceed. Its contents and timestamp were preserved; the existing index was not reset.

The preview was restarted after its listener stopped: [About](http://127.0.0.1:6790/bg/about), port **6790**. Build/check logs remain in the C: QA snapshot's `runtime/mobile-about-*.log`. Runtime, Git and reference-port state should be checked again in the next session.

## Integration handoff

Implementation and verification are saved in `L:/CODEX/cars`, branch `main`, based on HEAD `6cc97e1e4218b9de238f3487275c9142a5465a13`. Commit/push could not finish: Git recreated a fresh empty `L:/CODEX/cars/.git/index.lock` at 19:02:08 before the scoped staging attempt. `git add` returned “File exists”; the fresh lock was preserved. The staged index remains empty. No commit or push is claimed for this mobile/docs pass.

After the current Git lock owner releases it, review and commit only these task-owned paths, then non-force push `main` and verify the remote:

- `templates/import/src/lib/styles/tokens.css`
- `templates/import/src/lib/components/common/TeamMemberCard.svelte`
- `templates/import/src/lib/components/common/ProcessSteps.svelte`
- `templates/import/src/lib/content/about-page.ts`
- `templates/import/src/routes/(site)/about/+page.svelte`
- `templates/import/TEMPLATE.md`
- `templates/import/docs/ARCHITECTURE.md`
- `templates/import/docs/TYPOGRAPHY.md`
- `templates/import/docs/localization/HANDOFF.md`
- `templates/import/docs/DESKTOP-STYLING.md`
- `templates/import/docs/DESKTOP-POLISH-PROMPT.md`
- `templates/import/docs/mobile-about-editorial-2026-10-02/`

The inherited Import `.gitignore`, `.prettierignore`, older screenshot/refinement drafts, unused `about-editorial.webp` and unrelated Cars/dealer changes are outside this commit. Do not bypass an active lock or blanket-stage the checkout. The source recovery copy and build logs remain in the existing C: QA snapshot.

### Handoff resolved by the desktop audit

The next session verified all 1660 source-manifest hashes against the live checkout, reviewed the scoped changes, and reran architecture, scoped ESLint and formatting checks successfully. The remaining empty lock last written at 19:07:23 had no open handle (an exclusive read succeeded), and no Cars Git writer was active. It was preserved with SHA-256 verification at `runtime/desktop-editorial-2026-10-02/stale-index-lock-20261002-190723.lock`. The listed mobile and documentation changes were then recorded independently, before new desktop source edits. The desktop receipt records the resulting commit and remote verification.
