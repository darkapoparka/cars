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

## Initial PDP detail treatment

The owner-requested follow-up restores alternating shaded technical-data rows
inside a rounded inset container. The complete specifications dialog uses the
same row shading. Vehicle condition, category and the other captured facts keep
their existing values and localization.

The initial follow-up used 48px boxes on both phone and desktop, aligned with
the two-line label/value pairs. Below 360px, tighter column spacing and slightly
smaller text keep Bulgarian owner and gearbox labels readable without isolated
final characters. The earlier PDP composition is retained.

The follow-up passes `npm run check` on Node 22.20.0: zero lint warnings,
TypeScript, all 156 domain tests and the production build. Formatting and the
repository workflow check pass. The final browser suite was repeated on this
production build: 168 rendered states and 12 interaction flows passed, with zero
errors or application submissions. Twelve focused PDP states cover Chromium and
WebKit, Bulgarian and English, at 320, 390 and 1440px; no horizontal overflow or
icon/text overlap was found.

All 24 hero/detail frames were stable across repeated captures within each build.
Development and production were compared in matching states: 21 of 24 pairs were
pixel-identical; the remaining three differ by 28–43 raster pixels, with matching
dimensions. The earlier cold image-load capture is retained in runtime evidence;
final captures wait for image decoding before recording the gallery.

Matched detail-section screenshots use the same listing, language, photo and
section scroll anchor:

| Surface             | Before the detail adjustment                                     | After the detail adjustment                                    |
| ------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| Phone, 390 × 844    | [Before](pro-integration-2026-10-09/pdp-details-before-390.png)  | [After](pro-integration-2026-10-09/pdp-details-after-390.png)  |
| Desktop, 1440 × 900 | [Before](pro-integration-2026-10-09/pdp-details-before-1440.png) | [After](pro-integration-2026-10-09/pdp-details-after-1440.png) |

The [320px Bulgarian capture](pro-integration-2026-10-09/pdp-details-after-320-bg.png)
shows the narrow-width spacing and multiline technical values. Follow-up logs,
full captures and geometry reports are retained under the integration runtime
directory with the `pdp-finish` prefix.

## Final PDP sizing and spacing

After inspecting the first hosted follow-up, the owner requested smaller,
better-aligned fact icons, more compact CTAs and less space above Technical data.
The fact icons now use 40px boxes centered in a 44px column. The taller calendar
uses 36px and Fuel has a 2px optical inset to align its tank with the other icons.
Labels and values remain vertically centered beside the icons.

The summary CTA faces are 36px on phones and 40px on desktop, with 44px clickable
targets on both. Phone labels use 14px text, and both summaries use 16px CTA icons.
Action spacing is slightly tighter. Browser checks activate both controls in the
outer padding: Contact opens its existing sheet and Enquire reaches the correct
vehicle-context Contact page.

The inherited fact grid still applied 8px top and 24px bottom padding despite the
showroom's zero-padding shorthand. Explicit longhand overrides remove both.
On phones, the gearbox icon box is now 18px from the technical-data separator,
compared with 40px in the first hosted follow-up. The rounded technical table and
captured sample data remain intact.

The final source passes strict lint, TypeScript, all 156 domain tests, formatting
and the Node 22.20.0 production build. On the frozen production build, the route
suite passes 168 rendered states and 12 interaction flows with zero errors or
application submissions. The focused PDP suite passes all 12 states and their
section, specification-sheet and CTA flows across Chromium/WebKit, BG/EN and
320/390/1440px. All 24 hero/detail frames are stable across repeated captures;
controls measure 44px and there is no overflow or icon/text overlap. Repository
workflow validation passes.

Matched captures use the same listing, language, saved state, third photo,
viewport and section scroll anchor. The earlier 390px detail image is byte-identical
to its capture on the first hosted follow-up.

| Surface | Before the final sizing | After the final sizing |
| --- | --- | --- |
| Phone summary, 390 × 844 | [Before](pro-integration-2026-10-09/pdp-compact-before-390.png) | [After](pro-integration-2026-10-09/pdp-compact-after-390.png) |
| Phone facts and technical data, 390 × 844 | [Before](pro-integration-2026-10-09/pdp-details-after-390.png) | [After](pro-integration-2026-10-09/pdp-compact-details-after-390.png) |
| Desktop summary, 1440 × 900 | [Before](pro-integration-2026-10-09/pdp-compact-before-1440.png) | [After](pro-integration-2026-10-09/pdp-compact-after-1440.png) |

The [320px Bulgarian result](pro-integration-2026-10-09/pdp-compact-after-320-bg.png)
also retains single-line CTAs and readable fact values. Detailed checks and full
captures are under the integration runtime directory with the `pdp-compact` and
`pdp-vercel-after-compact` prefixes. Hosted publication is recorded in the
[Vercel receipt](../../../docs/mobile-template-vercel-20261009.md).
