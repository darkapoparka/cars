# Localization release gate and generator protection — 20 September 2026

## Scope and actual result

This change implements generator input validation, native-localization collision protection, concurrent-writer checks and a narrower unrelated-dealer publishing trigger. It is **not completed Phase 3 native template adoption**. No standalone template source, template pin, inventory registry or existing dealer application was changed. No second dealer was regenerated or deliberately published.

The independent generator now exposes a bounded `--locale-config` preflight. It reports intended en/bg routes and explicit release blockers without claiming those routes have been implemented. A blocked dry run exits 2; a write request fails before installing a dealer. No override flag bypasses the missing native template/packager release.

The legacy packager's Modern adapter selects its default locale. Applying that adapter to the verified Al Reef implementation would regress explicit-language behavior. Packaging now rejects native locale sources and declarations before legacy transformations, including native files excluded from a supplied retained-file map.

Generation rechecks its own reviewed inputs, main SHA, template release pins, original/prepared source fingerprints, dealer identity, publishing repository and target occupancy before installation. Isolated fixture tests cover concurrent changes without creating real dealer applications.

Shared packager, catalog, template-pin and workflow-file changes no longer trigger the Champion Auto Pro publisher. Its own client-source trigger and manual workflow_dispatch remain available. The job body and publishing branch were not changed. This prevents the localization maintenance commit from publishing a second dealer as a side effect.

## Verified Al Reef release retained

Repository: `darkapoparka/cars-alreefusedcars`; branch `main`; checkout `I:/cars-clients/al-reef-used-cars`.

Accepted application commit: `f0ac5db2fb87d2167260607dbad338636556101b`; accepted deployment: `dpl_2ZstyWXeU2AJJgWYCvojjVJTdFkT`.

Current main, freshly fetched in this execution: `41ddc34893a8cfcf0219d80a248aead5fbc0c435`. Its changes after the application commit are documentation/evidence only. The production alias `https://cars-alreefusedcars.vercel.app` was observed READY at `dpl_3VER6ig3NxL3oF7fkc1CGH8ydGnw`, with Git source `41ddc34893a8cfcf0219d80a248aead5fbc0c435`.

Project: `prj_r5Vaw6NQh5iTxi5jjfrtuP9GFTNm`; team: `team_RTNXBnClGWDdcYFFUW0BnqvJ`. All 366 recorded application-source hashes matched the accepted source at the start of verification. The Al Reef working tree was clean.

## Standalone adoption gate remains unresolved

These are read-only observations from this execution, not permission to discard or publish the working trees:

| Source | Local main | Live/fetched remote main | Unresolved ownership state |
| --- | --- | --- | --- |
| Auto Best | `b61327ef7eb0c9b8b3db5f200a80ba581e7fdc49` | `989ec3a1d80a8f19150d18eb81282ac7cd216d83` (GitHub API) | Native fetch fails on an invalid existing Codex checkpoint ref; clean local source contains unreviewed unpublished work. Cached origin/main is not current remote proof. |
| Modern | `1cf8edfe26a36e25b0d95dcc963b60de51cdeb50` | `703feaeb060f28f6cd43308c0aa4ff1b0a670fe8` | Ten unpublished local commits and 32 changed entries, including overlapping UI work. |
| Carwow | `26eb9d3d4d488eac09882f03e36588d712850c1a` | `89f50c427863050abb7923152f05c091bb937d1e` | Local main is three commits behind; 19 changed entries must be reconciled without overwriting custom work. |

The checkouts remain under `J:/template-repos/`. Their maintenance instructions require ownership/visual review. No checkpoint references were deleted, no local commits were force-published, and no alternate checkout or replacement application was created.

The integration checkout `J:/cars` was synchronized at `8d8b2b622f194a452d6c7b84a8b387f8235b0dd7` before this scoped change. The byte-preservation comparison covered 4,540 pre-existing modified/untracked files and found zero differences. `templates.lock.json` and `docs/DEPLOYMENT-INVENTORY.json` were unchanged.

Native template adapters/catalog adoption, approved template publication, pin advancement, full generator contract propagation and the subsequent Al Reef Phase 3 reconciliation remain **not performed**. The existing Al Reef release was reverified, not regenerated. No second-dealer or fleet rollout is authorized by this work.

## Safety and rollback

English and Bulgarian are the only enabled Al Reef languages. Arabic/RTL remains unavailable. The separate Admin remains accurately labeled English-only. Al Reef's physical location remains Sharjah, UAE, and its illustrative inventory remains AED. Visitor preferences do not change those facts. Real enquiry, CRM, database, AI, payment and notification writes remain disabled; no backend migration or live integration was enabled.

No new Al Reef deployment was created by these generator changes, so its verified Phase 2 release remains the rollback baseline: application `f0ac5db2fb87d2167260607dbad338636556101b`, deployment `dpl_2ZstyWXeU2AJJgWYCvojjVJTdFkT`, or the application-identical documentation follow-up `41ddc34893a8cfcf0219d80a248aead5fbc0c435` / `dpl_3VER6ig3NxL3oF7fkc1CGH8ydGnw`. Use only the existing project and alias. The pre-Phase-2 deployment is an emergency fallback, not a localized release.

The generator protections can be reverted by a normal reviewed commit on Cars main, preserving other work. Keep the narrowed publisher trigger unless a separately reviewed dealer publication explicitly requires changing it. Do not force-reset, force-push, create another project, or run the old packager over native localized sources as a rollback shortcut.

## Fresh checks and retained execution evidence

The existing Al Reef preview processes on 6891–6893 were verified by PID, parent, command and port before stopping them for builds. The combined proxy on 6890 was left untouched. All three application previews were restarted after the builds; initial HTTP checks returned 200 from every design.

Fresh production builds and checks passed for Auto Best, Modern and Carwow. Auto Best reported zero errors/warnings; Carwow reported zero errors and three warnings in one existing file. Modern's web typecheck and production build both passed. Final Al Reef root guards and all 21 root tests passed. The focused Modern suite passed 57 tests across eight files.

`node scripts/check-workflow.mjs` passed. The final complete Cars suite, `node --test --test-concurrency=1 scripts/*.test.mjs`, passed **137 tests with zero failures and zero skips**. Serial scheduling does not change assertions. The earlier default-parallel attempt reported Node/VirtualAlloc out-of-memory and process-spawn failures on this shared machine; its failed log was retained rather than relabeled as passing.

The fresh production HTTP/security suite passed 12 checks. Preference checks passed 4; storage/cookies-disabled/no-JavaScript checks passed 18; preference-race checks passed 24; visibility/control-fit checks passed 44.

The en/bg journey run at 320px and 1440px passed 488 checks with two explicit skips. The separate 390px run initially passed 272 checks, failed two checks after a Chrome page crash, and skipped two. A fresh, focused Modern/bg/390px Sell run passed all four checks, including both previously crashed checks. The failures remain in their original reports. The four intentional skips across widths are Carwow's desktop-only numeric financing calculator at mobile widths; its mobile financing-information fallback was checked instead.

The subsequent long-lived route browser produced timeouts. Its partial report was retained, and the owned QA browser was stopped. Route tests were rerun in separate processes by design and width with the original assertions unchanged. Raw evidence remains in `I:/cars-clients/al-reef-used-cars/runtime/phase3/20260920-finalize`, including the interrupted attempts, build logs, screenshots, passing reruns and preservation hashes. The structured summary alongside this document records the final outcomes; do not infer a pass for missing or interrupted checks.

Unchanged approved template pins: Auto Best `989ec3a1d80a8f19150d18eb81282ac7cd216d83`; Modern `703feaeb060f28f6cd43308c0aa4ff1b0a670fe8`; Carwow `89f50c427863050abb7923152f05c091bb937d1e`. These are the existing pins, not new localization releases.

Final production route coverage passed **342 unique checks** after the recorded fresh-process reruns: Auto Best 78, Modern 120 and Carwow 144, across en/bg and 320/390/1440px. This includes `/contact?topic=trade-in`, query-specific service pages, metadata, public detail routes and localized error pages. The completed current journey evidence covers 766 unique cases: **762 passing assertions and four intentional skips**, with the two original crash failures resolved by the separate focused rerun rather than erased.

Final dealer smoke passed 42 checks. Branding passed 128 checks plus 27 published-asset hash checks. Admin's 14 read-only checks confirmed English-only behavior. The restored local preview also passed all 12 HTTP/security checks.

The accompanying `2026-09-20-LOCALE-GATE.json` records source hashes, exact retained report paths, unchanged template pins, current outcome counts and unresolved rollout scope. Earlier unsuccessful attempts are explicitly listed and remain available. This is evidence of the specific checks performed, not owner approval of unpublished template redesigns or authorization for another dealer rollout.
