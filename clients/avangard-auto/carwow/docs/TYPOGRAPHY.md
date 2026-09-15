# Typography contract

The storefront uses the locally hosted DayNight Geist variable font, including Cyrillic. `src/lib/styles/tokens.css` owns font sizes, family and weights. CSS and Tailwind consume that same scale; do not add raw sizes, arbitrary weight utilities or a second family to components.

| Role                              | Mobile          | Desktop                        | Weight  |
| --------------------------------- | --------------- | ------------------------------ | ------- |
| Ordinary body copy                | 16px            | 16px; 18px for leads           | 400     |
| Supporting metadata               | 14px            | 14px                           | 400–500 |
| Tiny badges/counts                | 12px            | 12px                           | 500–600 |
| Inputs                            | at least 16px   | at least 16px                  | 400–500 |
| Primary and secondary actions     | 17px            | 18px                           | 500     |
| Buy/import tabs                   | 20px            | 20px                           | 500     |
| Mobile card title / section title | 18px / 20px     | use desktop card/section roles | 600     |
| Desktop card titles               | —               | 22px                           | 600     |
| Display headings                  | responsive role | responsive role                | 600–700 |

Use `--sa-button-font-size`, `--sa-button-font-weight` and `--sa-button-line-height` for action text. A phone action must not outrank a primary conversion action through a larger or heavier label. Use color and placement for action priority. Main navigation tabs use their dedicated larger role. Tiny badges are not a suitable role for body copy or buttons.

Use `--sa-mobile-type-*` or the existing desktop semantic roles for repeated content. Body text uses normal leading (1.5), headings use the tighter heading roles, and paragraphs should stay within about 65–75 characters where the layout permits. Keep Cyrillic headings readable, allow wrapping, and expand the container rather than shrinking text at narrow widths. Inputs must remain at least 16px.

Compact mobile hero pills, banner links and Contact/About actions use 16px regular text. Contact/About section titles use 20px medium text. The bottom dock uses 14px regular labels; its active item uses ink colour, a semibold label and a 2px icon stroke, with no active or pressed background.

Card actions inherit the shared action role. Mobile promotional cards reserve more width for copy; image banners allow title wrapping and use 44px minimum action height. Keep the independent desktop/mobile compositions, imagery, content order and interactions.

`npm run check:typography` rejects local font size, weight and family literals and arbitrary text-size utilities. It also runs through `npm run check:architecture`. The scanner is an enforcement floor: rendered measurements are still required, because inherited styles, Tailwind utilities and the cascade can produce a wrong role even when every value is tokenized.

Before accepting a typography change, inspect Home, inventory/detail, sell/import, content pages and relevant form sheets at phone and desktop widths. Include 320px reflow, the 991/992 composition boundary and zoom. Check computed label size/weight, wrapping, overflow, input readability and focus visibility. Store independent screenshots and results under `.audit/`; do not replace approved visual baselines.
