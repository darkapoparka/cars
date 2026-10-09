# Mobile PDP reading cards — 9 October 2026

The owner asked to retain containers because they separate the content from the
tab rail, and to standardize the previously different treatments. The Info
description, Specs/Данни list and Extras/Оборудване list now share one mobile CSS
rule: white background, a subtle 1px border, 12px corners and 12px padding.

Info keeps its compact overview chips and finance blocks. Specs keeps its row
dividers and aligned values. Extras keeps its heading and checkmarks. The tab
rail retains its white surface, 600 selected label and existing underline.
No content, typography sizes, navigation or form logic changed.

The first and last Specs rows omit redundant top/bottom spacing inside the card;
the last row also omits its separator. Below 381px, balanced columns allow long
values such as the location to wrap without crowding their labels. The card
introduces a narrower text area than the previous bare table, so this responsive
adjustment is part of the change. Description text gains 8px of available width
from the reduced inset.

## Changed source

- `src/lib/components/detail/AuxeroVehicleMobilePdp.svelte`: shared reading-card
  styling and narrow Specs columns, scoped to mobile.
- [Follow-up patch](task.patch) compares the source immediately before this
  container change with the final source. Earlier PDP work remains intact.

The change is local and uncommitted on `main`; no Git index or dealer publication
operation was performed. Other dirty work is preserved.

## Rendered evidence

- [All three final BG panels](all-panels-after-bg.png)
- [All three final EN panels](all-panels-after-en.png)
- BG 390px: [Info before/after](before-after-bg-390-0.png),
  [Данни](before-after-bg-390-1.png), [Екстри](before-after-bg-390-2.png).
- BG 320px: [Info before/after](before-after-bg-320-0.png),
  [Данни](before-after-bg-320-1.png), [Екстри](before-after-bg-320-2.png).
- Matched full captures cover all three tabs in BG/EN at 390×844, 320×844 and
  320×540, plus the desktop PDP at 1440×1000.
- [Before measurements](before-metrics.json) and
  [final measurements](after-metrics.json) come from canonical dev with no
  injected styles, after fonts and visible images load. All 18 mobile states
  have matching card backgrounds, borders, corners and padding, no horizontal
  overflow or page errors, and reachable final content after scrolling.
- Both desktop captures are pixel-identical to their fresh before captures.

## Verification

Scoped Prettier, ESLint and Git whitespace checks passed. Svelte autofixer
reports the same two existing localized resolver-alias findings and effect
review suggestions; this CSS change adds no navigation or reactive logic.

Five existing mobile PDP browser tests passed in 18.0 seconds: BG/EN at 320/390px
for gallery, Specs, Extras and demo inquiry, plus server rendering before
hydration. Their output is in the task's runtime `e2e.log`.

A new production build was not run for this CSS follow-up. The prior grouped
production-build receipts retain their original scope; this receipt establishes
the current local rendering and interaction checks.

Runtime scripts, the original component backup and logs are in
`L:/CODEX/cars/runtime/import-mobile-pdp-reading-cards-20261009/`.
Dev remains at `http://127.0.0.1:6791/bg/inventory/21754658377544573`.
