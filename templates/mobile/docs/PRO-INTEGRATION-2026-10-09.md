# PRO integration and PDP restoration

The owner requested review and integration of `PRO`, preferred the earlier PDP,
and authorized branch cleanup after merging. Cars `templates/mobile` on `main`
remains the maintained source. This is source integration and local verification;
the Mobile release lock and dealer publication remain separate.

## Reviewed source

GitHub confirmed the original PRO tip `918c7a9621f0fc9d0ac6422aa021bea5dcf9ea14`.
Its parent frontend snapshot is `23ba02bb7`. The newer local Mobile source was
preserved in `cf938e2bc` before integration. The integration retains the separate
screen modules, shared responsive hook, inventory navigation module, guarded
service-draft storage, dead-code removal and strict lint gate.

All six original boundary failures were reproduced, then fixed in `070ecf35b`.
Lookups accept own dictionary entries; unknown values use safe fallbacks. Invalid
make/model map keys are rejected without truncating or changing their identity.
The combined domain suite passes 156 tests, including the six boundary cases,
six draft-storage tests and the later local data regressions.

The PDP restores the compact phone summary, rounded variant pills, accent icons,
full-width desktop heading and four-fact strip above the gallery. The desktop
price/contact card aligns with the gallery. Supplied appraisals and price notes
remain explicit, unknown owner counts remain absent, and dealer descriptions and
images survive reused sample IDs. Finance entries and the calculator retain one
set of illustrative defaults. The technical-data phone sheet and semantic feature
list are retained. CSS grid replaces the original title-measurement probes.

## Refactor comparison

The three extracted screen bodies and shared StyleX declarations were compared
with TypeScript ASTs against `23ba02bb7`; they are unchanged. Frozen builds of that
snapshot and the original refactor were compared in Chromium and WebKit, Bulgarian
and English, at 320, 390 and 1440 pixels. All 108 viewport states had stable repeated
captures, matching dimensions, no horizontal overflow, no broken visible images
and no browser exceptions. 91 pairs were pixel-identical, including all 54 WebKit
pairs. The remaining 17 Chromium pairs differ by 4–97 raster pixels around small
controls and rounded edges; this is not a claim of complete pixel identity.

The original 13 discrepant full-page cases were recaptured separately. Repeating
the same full-page screenshot on the unchanged baseline produced six unstable
states; the unchanged refactor produced two. Four cross-build differences occupy
the same top 66-pixel header strip. This is consistent with full-page capture
altering the observer state, but does not prove the cause of every original
difference. Ordinary viewport captures retain matching header states.
Functional image/compact/image header transitions are checked separately in the
final browser suite. Full-page pixel parity is not used as a release gate or
presented as established by this review.

## Final verification

Cars `main` was fast-forwarded to integration commit `c0762a0d7`. This includes
the original PRO commits, the boundary fixes, the PDP restoration and concurrent
App commit `8ac04243b`. The integration diff from that App commit contains only
Mobile files. Unrelated dirty work was preserved.

| Check                          | Result                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| `npm run check`, Node 22.20.0  | Passed: strict lint, TypeScript, 156 domain tests and production build                      |
| `npm run format:check`         | Passed; four inherited formatting differences were normalized                               |
| Architecture browser suite     | 852 checks passed, zero errors; Chromium/WebKit, BG/EN, eight widths from 320 to 1920       |
| Final PDP and route suite      | 168 rendered states and 12 interaction flows passed, zero errors or application submissions |
| Final viewport captures        | 12 stable captures; both engines at 320, 390 and 1440, PDP and services                     |
| Repository workflow validation | Workflow check and all 391 workflow tests passed; none skipped                              |
| Production dependency audit    | Zero reported advisories                                                                    |
| Development dependency audit   | Seven high-severity dependency entries in one `braces` advisory chain                       |

The final browser suites used the maintained checkout's frozen production build
at port 6532. Header transitions were verified by scrolling past the gallery and
returning to the top; full-page screenshots were not used to infer those states.
The rendered PDP was inspected at all three required widths.

Matched screenshots use English, the same BMW X6, the third gallery image, saved
state, viewport height and scroll position:

| Surface             | Before the restoration                                   | After the restoration                                  |
| ------------------- | -------------------------------------------------------- | ------------------------------------------------------ |
| Phone, 390 × 844    | [Before](pro-integration-2026-10-09/pdp-before-390.png)  | [After](pro-integration-2026-10-09/pdp-after-390.png)  |
| Desktop, 1440 × 900 | [Before](pro-integration-2026-10-09/pdp-before-1440.png) | [After](pro-integration-2026-10-09/pdp-after-1440.png) |

The [320-pixel phone capture](pro-integration-2026-10-09/pdp-after-320.png) also
preserves readable facts and usable controls. These screenshots show the result
of the requested restoration; owner visual acceptance remains separate.

The fresh audit agrees with the [GitHub advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm):
`braces` through 3.0.3 is affected and no patched release is listed as of this
review. The installed production dependency tree is unaffected by this audit.
The suggested incompatible downgrade of `eslint-config-next` was not applied.
Dependency pins and the lockfile are retained.

The old development module graph referenced the removed `ShowroomPages.tsx`.
Its generated output was preserved on C: and the preview restarted with a fresh
webpack cache. The recovery location is recorded in `dev-cache-recovery.json`.
Ownerless Git index lock files were moved to recovery only after checking their
age, content, exclusive access and active writers; none was deleted.

Evidence, source snapshots, original Astra audit metadata, differing-region crops
and recovery receipts are under Cars `runtime/mobile-pro-integration-20261009`.
The original handoff remains [PRO-AUDIT.md](PRO-AUDIT.md). No Mobile release lock,
dealer variants or hosting configuration were changed by this integration.
