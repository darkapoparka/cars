# Mobile dock density and Home action

The mobile dock is 52px tall, reduced from 61.59px. Its outer corners use the existing 16px radius. All five localized labels and the pinned 24px Fluent Regular SVGs remain; each action has a 46px-tall hit area. A short, flat marker beneath the active icon replaces the surrounding oval. Keyboard focus remains separately visible.

The mobile Home hero action reads `Виж всички` / `View all`, retains its arrow and still links to the inventory. The inventory count remains available in its existing inventory/service context.

Changes use the shared spacing, radius and mobile navigation clearance tokens. The height continues to grow with enlarged text. Desktop navigation, hero artwork and the vehicle detail action bar are unchanged by this diff.

## Matched screenshots

Captured from the in-app browser at `http://127.0.0.1:6461`, with a 390×844 viewport and scroll position 0. Home has a 375px content canvas because of its native vertical scrollbar; Import has a 390px canvas. Each pair uses the same canvas dimensions, loaded Inter font and settled page state.

| Page | Before | After |
| --- | --- | --- |
| Home | [Screenshot](home-390-before.jpg) | [Screenshot](home-390-after.jpg) |
| Import | [Screenshot](import-390-before.jpg) | [Screenshot](import-390-after.jpg) |

## Verification

- CSS policy, token graph and pinned Inter/Fluent typography checks passed.
- Svelte check: 0 errors, 0 warnings.
- Production build and its locale prechecks passed.
- `mobile-polish-smoke.mjs`: 8/8 cases, Bulgarian/English at 320/390/430/1440px. Checks include localized hero action, arrow/href, label and icon alignment, touch targets, active mark, menu and service flows.
- `mobile-final-smoke.mjs`: 6/6 cases, Bulgarian/English at 320/390/430px. Checks include 200% text, reduced motion, menu focus return and hidden footer navigation remaining inert.
- Both browser suites ran against the settled production preview on port 6469. The original development preview on 6461 was subsequently verified and the user tab refreshed.

[Recorded measurements and results](verification.json) identify the tested working-tree source. Pre-existing shared checkout changes were preserved. This local polish does not promote a template release or deploy dealers.
