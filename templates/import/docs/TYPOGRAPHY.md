# Typography contract

Public copy uses self-hosted Sofia Sans. Hero headings use Sofia Sans SemiCondensed; public desktop section and panel headings use the body font. Keep the admin font configuration isolated.

The root layout bundles `src/lib/styles/fonts.css` with the shared styles, avoiding a separate blocking font CSS request. It references fonts through their public `/fonts/sofia-sans/` URLs; importing a stylesheet from `static/` can produce forbidden development asset paths. Latin and Cyrillic delivery subsets retain the original glyph metrics; the original full fonts remain the fallback for other scripts. The SIL OFL license and a compatible relative-path stylesheet stay beside all font files. To regenerate these assets and both stylesheet copies, install FontTools 4.66.1 and Brotli 1.2.0 in an isolated Python environment and run `python scripts/subset-fonts.py`. Python is only needed for asset maintenance.

Design values live in src/lib/styles/tokens.css. Action, MobileModeTabs, HeroFilterDialog and forms.css own their typography and geometry. Do not apply a heading weight to ordinary controls, or shrink action text through page-level CSS.

| Role                             | Desktop                 | Mobile                                               | Weight                  |
| -------------------------------- | ----------------------- | ---------------------------------------------------- | ----------------------- |
| Standard action                  | 20px                    | 18px                                                 | 400                     |
| Compact action                   | 18px                    | 18px                                                 | 400                     |
| Main navigation                  | 20px                    | Existing bottom-nav caption scale                    | 400                     |
| Mode tabs                        | 22px                    | 20px                                                 | 400, including selected |
| Picker value                     | 20px                    | 20px where this picker is used                       | 400, including selected |
| Options and form values          | 18px                    | 18px                                                 | 400                     |
| Field labels                     | 16px                    | 16px                                                 | 400                     |
| Instructions / compact body copy | 16px                    | 16px                                                 | 400                     |
| Prose / prominent copy           | 18px                    | 18px                                                 | 400                     |
| Section headings                 | 28px body font          | Public section scale or established 22px drawer role | 600                     |
| Panel / article-card headings    | 20px body font          | Existing component role                              | 600                     |
| Process titles                   | 18px body font          | Existing component role                              | 600                     |
| Metadata                         | 14px public desktop     | 13px                                                 | 400                     |
| Compact vehicle specifications   | Existing metadata scale | 12px / 16px                                          | 400                     |

Actions use --bc-weight-action; inputs and options use --bc-weight-control. Headings and prices retain emphasis. Selected controls use their underline, border, colour or checkmark rather than changing text weight or width.

Actions remain at least 44px high; primary actions, option rows and social links use 48px targets. Small visual icons do not mean small hit areas. Do not shrink text to squeeze more controls into a row: use wrapping or the established horizontal rail.

Desktop vehicle cards keep a single 18px title line with an ellipsis and the full name on hover. Year, fuel and transmission share one metadata row, with the complete mileage aligned right. Year and transmission retain their width; long fuel labels truncate within the remaining space and retain their full hover text. Mileage belongs in this row rather than over the photograph. Card actions retain 18px text and a 44px minimum height at compact card widths too. This contract is shared by Home, Inventory, Favorites and related vehicles; mobile keeps its separate card composition.

Desktop intro headings share `PageIntro` and start 56px below their frame's top edge. Heading width and scale, 16px spacing between heading/caption/actions, and 24px end padding belong to desktop hero tokens. The grid flows from that anchor; the height of route-specific controls does not vertically recenter the heading. Image hero frames retain their common responsive minimum height and grow when content needs room. Text-only intros share the same centered type and anchor. `mobileAlign` and the independent mobile hero compositions retain their existing behavior.

The public desktop editorial theme shares About's 28px body-font section headings, 20px panel/team/article headings, 18px process titles and 16px supporting copy. Vehicle-card titles retain their explicit 18px role and prices retain their stronger scale. Location actions use the existing compact 18px role and 44px targets. Hero headings retain the shared `PageIntro` contract. The separately requested mobile About trial uses body-font section headings at 22px/28px, names and process titles at 18px/24px, and copy at 16px/24px. Its hero retains the existing heading font and scale. Social targets remain 48px. [Desktop styling](DESKTOP-STYLING.md) records the accepted reference and rollout boundaries; [the desktop receipt](desktop-editorial-2026-10-02/README.md) records verification.

Home's desktop discovery header opts into the panel `MobileModeTabs` appearance with 20px/400 labels and 48px targets. Its selected underline uses the existing primary red against the light discovery frame. Selection retains the same text weight and keyboard contract. The frame and helper text use desktop theme aliases; mobile tab variants retain their existing values. Secondary brand/body-type discovery labels use the 18px/400 control role, leaving headings and vehicle prices as the main emphasis. The redundant Home quick links remain removed and the shared desktop heading anchor remains 56px. See [the current theme receipt](desktop-cool-off-white-2026-10-03/README.md); [the Home entry receipt](desktop-home-entry-2026-10-03/README.md) and [charcoal receipt](desktop-hero-content-2026-10-02/charcoal-2026-10-03/README.md) retain earlier evidence.

Preserve the homepage logo/model dialogs and mobile drawers. Do not replace them with native selects to simplify implementation. The all-filters dialog has one scrolling body and a persistent action footer.

Placeholders inherit input typography. A search input inside a decorated wrapper uses a visible focus ring on that wrapper. Verify selected states, placeholder styles and keyboard focus in the browser.

Mobile inventory search uses the 18px input scale and shows the current filtered result count, including zero. Long queries truncate before the count. Search and filter rows have an 8px gap; the sticky toolbar owns the single 12px gap before the first vehicle card. Home Buy/Import and service entry tabs use the same 20px mode-tab token, 400 weight and 44px targets.

Test matching roles across home, inventory, About, Contact and conversion routes at 390px and 1440px, plus intermediate-width reflow. The typography-contact test suite checks action size and weight, picker selection, social links and Contact alignment. Existing suites cover selection persistence, drawers, navigation and focus.
