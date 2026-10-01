# Card spacing, visible facts and euro display

Owner correction following the earlier mobile pass: the fixed minimum height plus `space-between` created empty space after prices, and the horizontal fact strip concealed the third badge at 320px. The prior one-row scrolling rule is superseded by this request.

The shared `VehicleCard` now sizes to its content. Facts sit 8px after the details, wrap into compact rows when needed, and remain fully visible without scrolling. The photo follows the content height. The price uses 20px/700 type versus the mobile title's 15px/500; price-on-request text has a separate 15px treatment. `CurrencyLabel` displays the euro symbol for EUR, including related mini-card prices. Stored currency codes and monetary amounts are unchanged; other currencies retain their code.

## Verification

- `npm run check` passed for both the App master and mounted Navara copy using Node 22.20.0 and isolated `.next-card-check` output: lint, TypeScript and production webpack builds.
- All nine Navara cards checked at 320, 390, 768 and 1440px: all three facts inside their visible bounds, no horizontal overflow, 8px maximum price-to-facts gap, euro price and distinct title/price typography.
- All 48 master inventory cards checked at 320, 390 and 1440px, including trim/monthly-payment content: all facts visible, 8px gap after the detail block, no horizontal overflow.
- EN and BG card display checked. Save/unsave and detail navigation still work. Original Navara preview and master preview now serve the corrected builds.

Evidence: `verification.json`, `before-{320,390}.jpg`, `after-{320,390,768,1440}.jpg`, and `master-after-{320,390,1440}.jpg`.

Canonical source: `templates/app`. Navara's local copy is mirrored for review; this pass does not create a fleet release or Vercel deployment. Prior evidence remains preserved and describes its then-current layout.

## Source delivery blocker

Commit/push is pending: Git add encountered an existing `L:/CODEX/cars/.git/index.lock` (25,165,824 bytes, DIRC index header). No Git process was visible on repeated inspection and the file could be opened exclusively, but this is a nonempty interrupted index and was preserved untouched. The working-tree edits and verification evidence are complete; stage only this correction after the shared index is recovered by its owner. No alternate index, force operation or lock deletion was used.
