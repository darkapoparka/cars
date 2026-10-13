# Mobile Home article actions

This records the first compact-action trial. It is superseded by
[the final density adjustment](../mobile-editorial-density-2026-10-04/README.md),
which removes category and description rows from mobile Home cards.

Home article cards now use the same slim black rounded action as the services
card: 28px painted height, 12px horizontal padding, Inter 500, and the official
Fluent Regular arrow. The entire article remains one link, with its full title
as the accessible label.

Short BG/EN descriptions fit one line at ordinary mobile sizes. Titles remain
fully readable and flow naturally: two lines at 320–430px, with a third line
available on extra narrow 280px cards. Enlarged text can reflow without a clamp.
Desktop descriptions, actions, and card dimensions are unchanged.

`before.jpg` and `after.jpg` show the same native browser viewport (360 × 884),
scroll position (1811px), and section position (141.28125px from the top).
`verification.json` records BG/EN geometry at 280, 320, 390, and 430px, the native
360px view, and the preserved 1440px desktop cards. Both locales have zero page
overflow at 320–430px; 280px measured a 1px rounding overflow.

Validation passed under Node 22.20.0: CSS policy, design tokens, pinned
typography/icons, locale source audit, Svelte check (zero errors and warnings),
and production build. The existing Home reflow cases passed at 320px in both
languages, including WCAG text spacing and 200% root text.

This is local source evidence. It does not select a template release or deploy
dealer sites.
