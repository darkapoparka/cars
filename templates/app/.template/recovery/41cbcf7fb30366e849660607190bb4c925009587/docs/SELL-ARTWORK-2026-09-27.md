# Sell artwork restoration

Restored the photographic composition of the original selling-method cards, replacing the generic large icon and paragraph treatment. Sell to us uses original key-handover photography; Part-exchange uses an original car/phone/key composition. The artwork fills the card surface with editable headings, short checklist rows and actions alongside it.

Restored the horizontal illustrated selling-tools pattern as three useful single-dealer guides: Car valuation, Service history and Photo checklist. Each opens its own information sheet. No marketplace listing boosts or simulated enhancement service were introduced.

Five original assets live in `public/showroom/`. Exact prompts and generated-source provenance are in `public/showroom/SELL-CARDS-PROMPTS.md`. Reference assets remain preserved.

The separate Home correction remains in place: its hero is blue and uses `home-hero-v3.png`. The location page retains its own image configuration.

At narrow widths the method artwork is contained rather than cropped into the copy. A small-screen top fade blends the image into the card surface without a rectangular seam. Both cards reserve equal height before their images load.

No Git staging, publication or approved template release was performed. The existing unrelated staged files were preserved.

## Verification

- `npm run check` passed (lint, TypeScript and production build), exit 0. Final log: `L:/CODEX/cars/runtime/app-showroom-qa/sell-artwork-verified-check.log`.
- Visually inspected 320px, 390px and 1440px. Both mobile method cards reserve 230px height: 281px content width at 320px and 351px at 390px. No document overflow. All five generated images loaded on desktop.
- Both Get a valuation and Explore trade-in open `/sell/details`, whose existing flow includes the Exchange step. No form submitted.
- All three selling guides open their correct information sheet and close successfully.
- Preview restarted on port 6473. Temporary browser viewport reset and QA tab closed.

Screenshots in `L:/CODEX/cars/runtime/app-showroom-qa/`: `sell-cards-before-390.png`, `sell-cards-after-390.png`, `sell-cards-after-320.png`, `sell-guides-after-390.png`, `sell-artwork-desktop.png`.
