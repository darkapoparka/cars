# Mobile PDP action text — 9 October 2026

The Inquire and Call labels now use `1.0625rem` (17px at the normal root size)
instead of the 16px mobile label role. Their regular 400 weight gives the labels
less visual emphasis than the title, while the slight size increase makes them
more comfortable in the existing 44px buttons.

Only this font-size declaration changes in
`src/lib/components/detail/AuxeroVehicleMobilePdp.svelte`, within its mobile media
query. The [one-line task diff](task.patch) is relative to the previous completed
controls refinement. The earlier title, price, top controls and navbar work stays
intact. The work is local and uncommitted; other dirty work is preserved.

## Evidence

- [390px before/after](before-after-en-390.png)
- [320px BG before/after](before-after-bg-320.png)
- [Final measurements](final-metrics.json), captured from canonical dev with no
  injected styles: BG/EN at 390×844, 320×844 and 320×540; 17px text, 400 weight,
  44px button height, no horizontal overflow and no browser errors.
- Both 1440×1000 desktop screenshots match the prior screenshots pixel-for-pixel.

The intermediate 500-weight comparison rendered identically to 400: the retained
Sofia Sans font faces contain 400, 600 and 700, so this preview did not provide a
distinct medium face. The size comparison and final images show the actual 17px
adjustment instead.

Scoped ESLint, Prettier and `git diff --check` passed. Svelte autofixer reports the
same two existing localized resolver-alias findings and existing effect-review
suggestions as the prior pass; this font-size change introduces no new findings.
The previous full check/build and interaction suite belong to the prior 16px
receipt; they were not repeated for this single CSS value. Vite compiled and
rendered the final source successfully for the matched browser captures.

Dev remains at
`http://127.0.0.1:6791/en/inventory/21754658377544573?lang=en`.
