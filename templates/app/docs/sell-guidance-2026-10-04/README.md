# Sell guidance — 4 October 2026

How it works now shows the three complete step titles and compact summaries in the page. Phone layouts use a vertical sequence with numbered circles and quiet connecting lines; tablet and desktop retain three columns. The panel follows its content height, and the white View steps pill retains the existing information drawer with its fuller explanations. Shared guidance headings use 18px text on phones and 20px on wider screens. The English heading remains on one line at 320px.

Before you sell now uses one compact near-black panel. Three single-line drawer rows have 20px line icons, regular white labels and muted arrows, with a 44px target each. Phone and tablet rows stack with quiet dividers; desktop shows three columns. Full supporting explanations remain in the original advice drawers, and keyboard focus has an inset white outline. The leading selling cards, configured dealer panel, assets and enquiry workflow retain their existing boundaries.

## Before and after

| View | Before | After |
| --- | --- | --- |
| Bulgarian phone, 390 × 844 viewport, guidance in context | [Before](before-390.jpg) | [After](after-390.jpg) |
| Bulgarian phone, 390px full page | [Before](before-390-full.jpg) | [After](after-390-full.jpg) |
| Bulgarian phone, 320px full page | [Before](before-320-full.jpg) | [After](after-320-full.jpg) |
| Bulgarian desktop, 1440 × 900 viewport, full page | [Before](before-1440.jpg) | [After](after-1440.jpg) |
| English phone, 320px | — | [After](after-en-320-full.jpg) |

The scrolled phone captures show both sections at the same viewport size. Their scroll offsets differ because the process panel now includes its descriptions. Full-page captures retain the browser's fixed navigation at its original viewport position. The preview reserves a 15px vertical scrollbar in the measured phone layouts.

## Initial pass verification

[Rendered measurements and interaction records](verification.json) cover Bulgarian at 320px, 390px, 768px and 1440px, plus English at 320px. No horizontal overflow or clipped guidance text was found. The process action has a 44px target; preparation cards are at least 88px tall. Visible selling images loaded successfully.

All three advice drawers and the three-step process drawer open with their original localized content. Close and Escape restore focus. Enter opens the first advice card, keyboard focus has a visible outline, and Back dismisses the drawer while retaining `/bg/sell`. The sale and exchange cards open the existing car-details sheet with the correct intent selected. No enquiry was submitted. The final browser console contained no errors or warnings. The [320px process drawer](process-drawer-320.jpg) fits without horizontal overflow.

`npm run check` passed after the final header correction, using Node 22.20.0: ESLint, TypeScript and the webpack production build generated 407 static pages. The build used the existing isolated `.next-build-check` output; `next-env.d.ts` was preserved for the running development server. The usual Babel/SWC notices remain informational.

## Two-line correction

The owner then identified a three-line second description at the actual 360px viewport. Each step now has a separate compact localized summary with one deliberate phone line break. All text is visible; the original detailed description remains in the View steps drawer. Existing text sizing is retained, and the three phone rows each measure 69px high.

[Follow-up measurements](two-line-copy/verification.json) record exactly two summary lines in Bulgarian and English at 320px, 360px and 390px. Both locales remain within two lines at 768px and one line at 1440px, with no clipped text or horizontal overflow. The fuller Bulgarian drawer content was checked after the change. Current screenshots: [320px](two-line-copy/after-320-process.jpg), [the owner's 360px width](two-line-copy/after-360.jpg), [390px full page](two-line-copy/after-390-full.jpg) and [English 320px](two-line-copy/after-en-320-full.jpg). The earlier table records the first visual pass before this copy correction.

`npm run check` passed again after the copy correction with Node 22.20.0, including lint, TypeScript and all 407 static pages. Browser diagnostics included one expected Fast Refresh full-reload warning after editing the locale catalogs and no errors.

## Compact black preparation panel

The owner requested smaller drawer buttons and a black panel. The separate preparation cards and their supporting lines were replaced with three compact rows inside one dark section. The section is 192px high on phones, 202px at 768px and 112px on desktop; every drawer button is 44px high. All three inline process summaries still occupy two lines on phones.

| View | Before compact correction | After compact correction |
| --- | --- | --- |
| Bulgarian, 360 × 884, scrolled to the page end | [Before](compact-guides/before-360.jpg) | [After](compact-guides/after-360.jpg) |
| Bulgarian, 1440 × 900, full page | [Before](compact-guides/before-1440.jpg) | [After](compact-guides/after-1440.jpg) |
| Bulgarian, 320px full page | — | [After](compact-guides/after-320.jpg) |
| Bulgarian, 390px full page | — | [After](compact-guides/after-390.jpg) |
| English, 320px full page | — | [After](compact-guides/after-en-320.jpg) |

[Compact-panel measurements and drawer checks](compact-guides/verification.json) cover Bulgarian at 320px, 360px, 390px, 768px and 1440px, plus English at 320px. Labels stay on one visible line with no horizontal overflow or clipped text. Keyboard Enter opens valuation; Escape restores its outlined button focus. Service history closes through Back, and the photos drawer closes through its close button, both restoring focus. All three original Bulgarian descriptions and the detailed English process drawer remain present. The [320px valuation drawer](compact-guides/valuation-drawer-320.jpg) records its original content.

`npm run check` passed after the compact-panel correction using Node 22.20.0: lint, TypeScript and the webpack build generated all 407 pages. The isolated build output and preserved development `next-env.d.ts` were used again. Browser diagnostics contained no errors or warnings. The Bulgarian preview was restored with the temporary viewport override cleared.

Source: `L:/CODEX/cars/templates/app` in the existing Cars `main` checkout. The task began at `8f9752633c271d06b9573f8eb69837b49ded43c3`; unrelated Import work advanced main to `1ff7d9e5e` during the task and did not overlap the App files. `node scripts/workspace-doctor.mjs --fetch` found Cars aligned with fetched main and unrelated dirty work, which was preserved. The follow-up fetch also found Cars aligned with main. This receipt covers the local master preview and scoped source change; dealer publication and owner visual acceptance remain separate.

Scoped commit/push was blocked at the initial closeout by the existing `L:/CODEX/cars/.git/index.lock` (18,219,008 bytes). The two-line follow-up still encountered that lock, then measuring 0 bytes. The lock was preserved and subsequently cleared by its owning operation. At the compact-panel closeout, a fresh workspace-doctor fetch found no incoming Cars main changes; the unrelated Modern delivery note at `b0b392e2d` did not overlap this task and was preserved. Source delivery is scoped to `components/FeatureContent.tsx`, `lib/locales/en.json`, `lib/locales/bg.json`, `TEMPLATE.md` and this evidence folder. The rest of the shared checkout remains untouched.
