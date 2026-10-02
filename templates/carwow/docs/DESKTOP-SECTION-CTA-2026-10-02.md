# Desktop section browse actions

YouTube, testimonials, About sections, the collection card, financing card and Sell promotional CTA now share yellow buttons with dark text and arrows. Hover deepens the yellow. Black buttons remain on yellow banners for contrast; the red Sell banner has a white keyboard focus outline. Labels, destinations and button geometry are preserved.

`DesktopBrowseLink.svelte` owns this family. The optional review footer now reuses it instead of maintaining separate styles. Filter states, form submissions, the Home mode selector and vehicle cards are unchanged.

Verified with Node 24.21.0 against the production preview:

- Svelte check: zero errors or warnings; scoped ESLint and formatting pass.
- Typography guard: 299 source files pass; 187 unit tests in 22 files pass; production build passes.
- Eight focused Chromium tests pass: media loading/playback, type/make navigation, desktop section geometry at 992/1280/1440/1920px, and mobile composition/assets.
- Sixteen desktop states across English/Bulgarian Home, About and Sell preserve CTA text, destinations, fonts and dimensions, without clipping or overflow. Yellow defaults, hover and keyboard focus are checked. Media and testimonial panels retain equal heights.
- Sixteen mobile states across English/Bulgarian Home, Inventory, About and Sell at 320/390px exactly match the captured control styles and geometry. All 127 protected mobile/shared-data/asset and existing desktop selector/card files retain their SHA-256 hashes.

Evidence: `.audit/desktop-section-cta-2026-10-02/`. The final paired-section screenshots are `production/en-section-actions.png` and `production/bg-section-actions.png`.

The architecture guard still reports the pre-existing unreachable `MobileLeadManualCard.svelte`; its blob is unchanged (`7a0ee36e8a44c5745bda8a0055134534458507aa`). Mobile source was not modified to clear that unrelated failure. This is local master source verification; template release, dealer deployment and owner visual acceptance remain separate.
