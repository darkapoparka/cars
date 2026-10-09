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
the same top 66-pixel header strip. The full-page capture can change the observer
state during capture. Ordinary viewport captures retain matching header states.
Functional image/compact/image header transitions are checked separately in the
final browser suite. Full-page pixel parity is not used as a release gate or
presented as established by this review.

## Final verification

Final build, browser results and main integration receipt will be recorded here
after the maintained checkout is verified. Evidence and recovery material are
under Cars `runtime/mobile-pro-integration-20261009`; the original handoff remains
[PRO-AUDIT.md](PRO-AUDIT.md).
