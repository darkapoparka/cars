# Mobile PDP drawer correction

3 October 2026. Scope: the Mobile showroom candidate, its existing GitHub mirror
and the existing `cars-template-mobile.vercel.app` test deployment.

The owner rejected the first PDP layout: it presented separate rounded cards
and placed the information tabs after the title, price, finance and contact
blocks. Functional tab and popup checks did not establish the intended drawer
composition. In the live in-app browser at 390 × 568, the tab rail began at
601.30px and ended at 654.30px, entirely below the viewport.

## Correction

One white sheet now starts directly beneath the vehicle photo, overlapping it
by 20px, with rounded top corners, a restrained shadow and a small handle.
The three equal-width Details / Photos / Features underline tabs sit at the
sheet entrance before the title and price. The handle and tabs pin below the
60px vehicle header while the information content scrolls.

Details contains the retained title, price, financing, contact actions, summary
facts, technical data and description on one continuous white surface. Dividers
replace the individual rounded boxes. Photos and Features replace this content
within the same sheet. The compact price/enquiry action stays available in those
two views; in Details it appears after the main actions pass the pinned rail.
The contact observer measures the rail and responds to changes in its height.

Live inspection also exposed a scroll-position defect in the inherited tab
handler: scrolling a sticky navigation element into view could leave the new
panel partway down its content. Tab changes now align the sheet's stable page
position beneath the header, so the first photo or Features heading begins
directly below the rail. Keyboard tab changes use the same alignment.

The sheet uses the browser's normal page scroll. There is no separate nested
scroller or draggable modal. The existing photo viewer, technical-data dialog,
URL section state, inventory Back behavior and financing/contact actions remain.
Home, Services and Contact retain their tab styling; only the PDP uses the flush
rail variation. Non-showroom reference sections retain their existing cards.

## Source checks

- TypeScript and ESLint across `src` with zero warnings: passed.
- All 86 domain tests: passed.
- Scoped Prettier and whitespace checks: passed.
- Existing browser QA source adds 320/390 × 568 entry checks for photo overlap,
  visible tabs and flat summary facts, plus a regression check that Photos starts
  at its first image after switching from scrolled Details. Script syntax passes;
  the complete suite has not been executed.
- Final TypeScript, ESLint and production build after the scroll correction:
  passed, all 50 static pages generated. Final local build ID:
  `QbBI3IfSkkj4BFTthYoip`. The initial sheet build and domain-test logs are retained.
- The generated-configuration guard verified and restored only expected Next
  TypeScript additions. Existing runtime/reference files were preserved.
- `workspace-doctor.mjs --fetch`: Cars had no fetched main drift; unrelated
  template/client drafts and independent Admin divergence were preserved.

## Hosted verification

The existing Cars source utilities exported the committed Mobile subtree to
the same private [publishing repository](https://github.com/darkapoparka/cars-template-mobile).
No new project or source checkout was created. Each of the two corrections
triggered one Git production deployment; the final deployment is READY.

- Cars sheet correction: `1ad2f70ad363362b435a56c6b722d0c2c44c323a`.
- Cars final scroll correction: `85a65cd993547656d981931201667fcd6a6a261b`,
  verified on fetched `origin/main`.
- Final Mobile subtree: `98adebc796a659e6ca3b71c8e0eae89cd6a6427b`.
- Export digest: `ef82ce3ecc2f02f47a73d0dc7a4de8b5c8c3ed738ed504b57b0d0bf20bc29f2c`;
  685 source files plus the source receipt.
- Publishing main: `57a049282a30a3a7be4376e67f6de8a071643bc3`, verified equal
  to fetched publishing `origin/main`; mirror clean.
- Existing Vercel project: `prj_PsCXLysg0t3owguVyrnnXQXa7x1r`.
- Final production deployment: `dpl_4KtJy2NZYGkj56FjYReQFEbbppES`, READY;
  its provider `gitSource.sha` and GitHub metadata match the publishing commit.
- Public alias: [Mobile showroom](https://cars-template-mobile.vercel.app/),
  with the corrected [BMW X6 PDP](https://cars-template-mobile.vercel.app/vehicle/bmw-x6).
  Immutable host: `cars-template-mobile-jfwk2gg7u-tyj5.vercel.app`.
- Home, BMW X6, Services and Contact HEAD requests returned HTTP 200 without
  redirects on the public alias after deployment.

Focused live in-app browser checks on the final deployment:

| View                                  | Result                                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 390 × 568 and 390 × 667 entry         | Rail at 301.30–354.30px; all three 52px-high tabs visible. Before, it was at 601.30–654.30px.                           |
| 320 × 568 entry                       | Rail at 257–310px; three equal-width tabs visible.                                                                      |
| Phone sheet                           | Photo overlap 20px; summary facts radius 0; no horizontal page overflow.                                                |
| Scrolled Details                      | Navigation pinned at 60px below the vehicle header; compact price/enquiry dock visible.                                 |
| Photos and Features after deep scroll | First photo or Features heading starts 16px below the rail; 20 photos and 70 feature rows retained.                     |
| 320px Photos / Features / Details     | Content fits; ArrowLeft / Home switch tabs, align the content and restore the Details actions without a duplicate dock. |
| Photo viewer                          | Opens image 2; Next / Previous update 2 → 3 → 2; Escape closes it, unlocks page scroll and returns focus to image 2.    |
| 320px technical-data dialog           | 26 rows retained; opens and closes without horizontal overflow; focus returns to All specifications.                    |
| 1440 × 900                            | Existing 1100px layout fits without horizontal overflow; entry rail remains visible.                                    |
| Browser console                       | No captured warning or error entries.                                                                                   |

The final screenshots, geometry and HTTP records are retained under
`runtime/mobile-pdp-drawer-20261003/`; final renders use the `final-` prefix.
The viewport override was reset and the corrected Details page left open.
The earlier local-browser restriction still applies; inspection used public HTTPS.
The complete browser suite, physical-device Safari, touch gestures, native keyboard
behavior and owner visual acceptance remain pending. These browser checks do not
establish native-app parity.

Abandoned zero-byte index locks delayed scoped commits. Live-process checks
and an exclusive read/write-sharing probe verified they had no active file owner;
they were moved into recoverable task-runtime backups. No active lock was removed,
and foreign staged object IDs were checked before and after the scoped commits.

No template release lock, dealer copy, other Vercel project or outreach changed.
