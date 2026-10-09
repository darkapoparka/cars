# Mobile PDP and PRO publication

Published 9 October 2026 (Europe/Sofia) to the existing standalone showroom test
site: [Mobile PDP](https://cars-template-mobile.vercel.app/vehicle/bmw-x6).

The Cars push initially updated the editable source repository. The Vercel
project builds its separate publishing mirror, which still held the previous
snapshot. The first refresh published source `9c11b9b86` as mirror `2afc097f5`,
including the PRO refactor, earlier PDP restoration and inset technical table.
The owner then requested smaller icons and CTAs and tighter fact spacing. The
compact refresh published source `b8f52aeb7` as mirror `7e002f3a7`. The latest
refresh below applies the owner's selected near-black colour to the six fact
icons through the same source utilities.

The final GitHub sync also preserves the previously uncommitted 8 October audit:
18 screenshots, its report and two JSON evidence files. The report is explicitly
marked historical. Application files are identical to the tested neutral-icon
source `d7ced9114`; this final snapshot adds documentation and captured evidence.

## Exact source and deployment

| Item | Verified value |
| --- | --- |
| Editable repository | `darkapoparka/cars` |
| Cars source commit | `9c933097a3147b47b219a431c2b23dbb1bbe4fc3` |
| Source subtree | `templates/mobile` |
| Source tree | `2a88d30ab728823ee1f708945de935d9f37bc6a4` |
| Export policy | `cars-source-v1` |
| Normalized source digest | `a1cb3525e58a826a3bc04e61296ae8ec29f5cf791fcac88d6683d0397a58cf0e` |
| Publishing repository | `darkapoparka/cars-template-mobile` |
| Publishing commit | `f2345cebb82edba2770de071833c6d4fabe56b4c` |
| Previous publishing commit | `babe1b9b2e70c776b0d67681c175f3124dd7b52a` |
| Vercel project | `cars-template-mobile`, `prj_PsCXLysg0t3owguVyrnnXQXa7x1r` |
| Team | `tyj5`, `team_RTNXBnClGWDdcYFFUW0BnqvJ` |
| Production deployment | `dpl_7Aw2DBwSnyVxHozkAoBEpzyAw68L`, `READY` |
| Immutable host | `cars-template-mobile-n4s22aj4g-tyj5.vercel.app` |
| Public alias | `cars-template-mobile.vercel.app` |

The publishing mirror had zero independent source drift from its recorded Cars
baseline. Its history was preserved through a child commit. The 812 exported
source files match the tested Cars snapshot's normalized digest exactly.
Publication receipts and superseded files are retained under `.template/`.
The existing Git integration started the production build after the mirror push.
Vercel's deployment and public-alias metadata both identify the publishing SHA
above; the public alias resolves to this final `READY` deployment.

## Verification

The unchanged application passed strict lint, TypeScript, all 156 domain tests,
formatting and its Node 22.20.0 production build on `d7ced9114`. Fresh TypeScript
and workflow-documentation checks pass for this final sync, and the historical
image dimensions and referenced evidence reports are verified. The final Vercel
production build also passes. Before publication, the focused
local production suite passed 12 PDP states and 12 interaction flows across
Chromium/WebKit, Bulgarian/English and 320/390/1440px. Both engines also pass the
390px dark-appearance check, with the icons following the light heading colour.
The broader 168-state route suite passed on the preceding compact source
`b8f52aeb7`; this colour follow-up was verified with the focused PDP suite.
The [integration report](../templates/mobile/docs/PRO-INTEGRATION-2026-10-09.md)
records the refactor audit, boundary fixes, earlier PDP restoration and final
technical-data/icon treatment. The six fact icons use the heading's themed text
colour, `#1b1b21` in light appearance. They retain 40px boxes, with a 36px calendar
and a 2px optical inset on Fuel. CTA faces measure 36px on phones and
40px on desktop while retaining 44px clickable targets. Explicit overrides remove
the inherited 8px top and 24px bottom padding from the fact grid.

Public HTTP checks returned 200 without redirects for eight routes: Home, BMW X6,
its gallery, Services, Import and Sell service tabs, vehicle-context Contact and
saved cars. The final public-alias browser suite passes all 12 PDP states across
Chromium/WebKit, Bulgarian/English and 320/390/1440px, with zero runtime errors.
Each state passes section switching, the technical-data sheet with Escape/focus
return, and Contact/Enquire activation in the outer CTA padding. Phone image and
compact header transitions also pass. Controls measure 44px and there is no
horizontal overflow or icon/text overlap. All six fact icon colours match the
heading, and every recorded layout measurement matches the tested local build.

All 24 hosted hero/detail captures are stable across repeated frames. Comparison
with the tested local production build gives 18 pixel-identical pairs; the six
remaining Chromium pairs differ by 6–45 pixels around control edges and small
rendering regions. All dimensions and measured layout properties match; all 12
WebKit pairs are pixel-identical. The source screenshots below show the requested
visual changes rather than claiming complete pixel parity between environments.

Matching before/after screenshots are committed with the tested source:

| Surface | Before | Final result |
| --- | --- | --- |
| Phone facts, 390 × 844 | [Orange icons](../templates/mobile/docs/pro-integration-2026-10-09/pdp-compact-details-after-390.png) | [Neutral icons](../templates/mobile/docs/pro-integration-2026-10-09/pdp-black-icons-after-390.png) |
| Desktop facts, 1440 × 900 | [Orange icons](../templates/mobile/docs/pro-integration-2026-10-09/pdp-black-icons-before-1440.png) | [Neutral icons](../templates/mobile/docs/pro-integration-2026-10-09/pdp-black-icons-after-1440.png) |

The [320px Bulgarian result](../templates/mobile/docs/pro-integration-2026-10-09/pdp-black-icons-after-320-bg.png)
retains readable facts and single-line summary actions. Earlier size and spacing
comparisons remain in the integration report.

## Scope and recovery

This refreshes the existing standalone Mobile test site. It preserves the Vercel
project, team, aliases and deployment-protection settings. The Cars template lock
and dealer variants were not changed. The separate Cars marketplace remains
independent. Sample vehicle facts and local demonstration actions retain their
existing disclosures.

`node scripts/workspace-doctor.mjs --fetch` completed before publication.
Unrelated dirty work and independently staged paths were preserved. The mirror
commit was assembled with an isolated index rather than another editable source
checkout. Export, drift, push, provider and browser evidence is under
`runtime/mobile-pro-integration-20261009`, using `vercel-` and `pdp-vercel-`
filenames. The latest receipts and captures use the `complete-sync` names; earlier
neutral-icon, compact and initial receipts are preserved. The integration report
also records
the retained initial development hydration timeout and dark WebKit capture
instability, followed by successful checks.

The separate active chat, "Polish desktop vehicle PDP", began a new draft during
this publication. Its new `docs/desktop-pdp-polish-2026-10-09` captures are ongoing
work and are preserved outside this completed snapshot.
