# Mobile Home article density

The mobile Home cards now show their image, readable title, and slim black
reading action. Category labels and descriptions are hidden on mobile; their
desktop presentation remains unchanged. The unused mobile summary data and
three trial translation keys were removed.

Titles flow without truncation, using two lines at ordinary phone widths and
allowing a third at 280px. Cards share a flexible title area and retain one
full-card article link with its complete accessible name. The action keeps the
same 28px painted pill and official Fluent Regular arrow as services.

The matched screenshots use the native 360 × 884 browser viewport, a 1911px
scroll position, and a section top of 41.28125px. The card height drops from
307.515625px to 264.34375px, about 43px or 14% shorter.

`verification.json` records mobile geometry in both languages and preserved
1440px desktop geometry. Existing validation covers CSS, pinned typography,
Svelte diagnostics, build, and the 320px Home text-spacing/enlarged-text cases.
This is local source evidence, not dealer deployment or template promotion.
