# About mobile card and service layout — 2 October 2026

The mobile About intro replaces its paragraph with a pale service-section
shortcut and a down arrow. It links to the four existing service cards through
`#process`; keyboard activation and browser Back retain the localized About
route. Its 52px minimum height grows with enlarged text. About and Services stay
together, with Contact retaining the details/enquiry route. The header already
provides phone/location controls, so the About intro does not repeat them.
The inventory action and any configured Instagram, Facebook or YouTube profiles
remain available. Empty profile URLs are omitted; the master has no real social
URLs configured.

Below 768px, About uses Home's 244px hero and 192px card anchor. The existing
showroom illustration is capped at 320px so the building remains visible above
the overlapping card. The sole visible mobile page heading stays in that card.
At 768–991px the hero keeps its existing natural image height. Desktop retains
its separate hero and visit composition.

Service icons and titles occupy the same row. Descriptions start below that row
at the icon's left edge, using the full available width. The desktop service
layout is unchanged.

## Verification

- Node 22.20.0: `npm run check` passed with 0 errors and 0 warnings.
- CSS policy, tokens, typography and locale source checks passed.
- `npm run build` passed, including locale catalog/source checks and the Vercel
  adapter output.
- Chromium: 17 focused cases passed on the existing preview at
  `http://127.0.0.1:6461`. BG/EN widths 320, 390 and 430 matched Home's card
  anchor. Both locales reflowed at 320px with 200% text. Keyboard focus, service
  shortcut activation, Back and actual inventory/viewing navigation passed.
- The 991px mobile layout retained its existing hero height. At 992/1440px,
  mobile intro/artwork stayed hidden and the hero remained 540px. At 1440px,
  the measured desktop hero, title, button and service-card geometry matched
  the pre-change capture exactly.
- Browser-only social fixtures exercised all three official brand glyphs,
  configured link targets, 44px hit areas and social-row layout at 320/390px,
  with normal and 200% text. Fixture links use `example.org`; they were never
  written to brand configuration.
- WebKit: BG 320/390px and 320px with 200% text passed without horizontal
  overflow; descriptions occupied the full width below the icon/title row.
  Service shortcut activation and Back also passed at 390px.
- Reviewed rendered normal, enlarged-text and social-fixture screenshots.

Ignored screenshots and JSON reports are in
`artifacts/company-pages-polish/about-mobile-card-20261002/`.
These are local desktop-browser checks. Dealer deployment and release promotion
are outside this template-polish request. Existing unrelated work was preserved.
