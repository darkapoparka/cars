# Service check circles - 4 October 2026

Following the owner's request, all five Services cards use small neutral circles around the checkmarks. Each decorative icon retains the previous 18px footprint, with a 12px grey tick inside a white circle and subtle border. The text, card spacing and enquiry actions retain their existing behavior.

| Viewport | Before | After |
| --- | --- | --- |
| Bulgarian 390 x 844 | [Plain checks](before-bg-390.jpg) | [Circled checks](after-bg-390.jpg) |
| Bulgarian 1440 x 900 | [Plain checks](before-bg-1440.jpg) | [Circled checks](after-bg-1440.jpg) |

Live browser checks cover Bulgarian 320, 390, 768 and 1440px, plus English 320, 390 and 1440px. Each layout has five cards and fifteen 18px circles with 12px ticks. All check rows remain on one line; there is no page overflow. The matched 390px and 1440px card widths, card heights and row heights are unchanged. Decorative spans use `aria-hidden` and add no interactive control.

`npm run check` passed (lint, typecheck and the production build) with Node 22.20.0 and isolated `.next-build-check` output. No browser application errors were recorded. [Measured before/after layouts](verification.json) retain the evidence. Temporary viewport overrides were reset after verification.

This is a local App source and preview change. No dealer publication or template release selection is recorded here.
