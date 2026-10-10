# Mobile PDP controls — 9 October 2026

Local refinement of the reusable Import template, following the mobile title,
price and navigation work in [the previous receipt](../mobile-pdp-space-2026-10-09/README.md).

The matched vehicle is `/en/inventory/21754658377544573`, Mercedes-Benz GLA 45 AMG
4M AMG Night Package. The before images already contain the previously approved
single-row title, quieter price and smaller bottom navigation.

## Change

Only `src/lib/components/detail/AuxeroVehicleMobilePdp.svelte` changes in this
follow-up. Back, Compare, Save and Share now paint 36px white circles inside
unchanged 44px native controls. Back uses a 20px icon; the other top icons use
18px. All use a 2px stroke and a quieter shadow. The action group gap is 4px.
Keyboard focus gets a visible ring around the smaller face.

Inquire and Call retain their 44px height and readable 16px text, with regular
400 weight instead of 600 and 16px icons with a 2px stroke. Inquiry and phone
destinations retain their existing handlers and native link semantics.

The earlier title/price and navbar edits remain intact. No commit, release or
dealer publication is included. Other dirty source is preserved.

## Rendered evidence

- [390px matched before/after](before-after-390.png)
- [320px matched before/after](before-after-320.png)
- Individual `before-*` and `after-*` images: BG/EN, 320/390px widths,
  540/844px heights; desktop BG/EN at 1440×1000.
- [Computed comparison](comparison.json): zero horizontal overflow or browser
  errors in all captures; unchanged panel height; both desktop images are
  pixel-identical.

## Verification

- Svelte check: 0 errors and 0 warnings, using the current dev-generated types.
- Scoped ESLint, Prettier and `git diff --check`: passed.
- Production build and `@sveltejs/adapter-vercel+cars-public-assets`: passed in
  the private QA snapshot, using the same edited component hash as dev.
- Svelte autofixer reviewed. It reports the existing localized `linkHref as
resolve` alias as two unresolved links and suggests review of existing
  effects. Those handlers already use the localized resolver, and this change
  does not alter them.
- Five existing mobile PDP Playwright cases passed: BG/EN at 320/390px, gallery,
  Specs/Features, demo inquiry submission, and rendering before hydration.
- Browser interaction evidence is in `controls-verification.json`: Chromium
  and WebKit, BG/EN, 390×844 and 320×540. Taps at the transparent outer edge
  exercise Save/persistence, Share, Compare and Back. Inquiry opens without
  focusing an editable field; Call retains its native telephone destination.
  This is browser emulation, not physical-device acceptance.

The QA harness waits for each overlay's shallow-history pop to finish before
opening the next overlay or using Back. The initial harness incorrectly expected
Compare to navigate, and then advanced before an overlay's asynchronous history
dismissal finished in WebKit. Corrected checks follow the existing overlay contract.

Runtime scripts, source backup and isolated build log live under
`L:/CODEX/cars/runtime/import-mobile-pdp-controls-20261009/`.
The build uses the existing private QA snapshot at
`L:/CODEX/cars/runtime/import-mobile-pdp-20261009/frozen/`, refreshed from current
source with the retained lockfile and Node 24.21.0. The canonical dev server stays
on `http://127.0.0.1:6791`.
