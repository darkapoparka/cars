# Mobile entry field rounding — 4 October 2026

Home Buy/Import, Sell and Import single-line entry fields now use the existing `--dn-pill` token, matching the selector and CTA. The shared rule remains inside the mobile breakpoint (`max-width: 767px`); the two Home radius overrides were removed.

Matched browser measurements confirm the same 48px field height, card dimensions, field padding and typography. The selector retains its 44px frame and inset 40px selection; the CTA retains its 44px hit area and 40px painted height.

## Before / after

These are matched Bulgarian captures from the in-app browser at 320 × 844px. Home retains the same native scrollbar gutter in both captures.

| Entry | Before | After |
| --- | --- | --- |
| Home Buy | ![Home Buy before](before-home-320.jpg) | ![Home Buy after](after-home-320.jpg) |
| Home Import | ![Home Import before](before-home-import-320.jpg) | ![Home Import after](after-home-import-320.jpg) |
| Sell | ![Sell before](before-sell-320.jpg) | ![Sell after](after-sell-320.jpg) |
| Import | ![Import before](before-import-320.jpg) | ![Import after](after-import-320.jpg) |

## Validation

- `npm run check`: 0 errors and 0 warnings.
- Existing CSS policy, token and typography/visual-system checks: passed.
- `npm run build`: passed with Node 22.20.0.
- Existing `shared-entry-smoke.mjs`: 8/8 BG/EN cases passed at 320, 390, 768 and 1440px against a snapshot of this production build on port 6469. This covers selector framing, stable selection, keyboard/focus behavior, Import URL validation/prefill and overflow.
- `git diff --check`: passed for the two source paths.

The [verification record](verification.json) preserves source fingerprints, matched browser measurements and the check summary. This records local template verification; no dealer release or deployment was performed.
