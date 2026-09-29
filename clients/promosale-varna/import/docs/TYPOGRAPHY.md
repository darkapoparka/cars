# Typography contract

Public copy uses self-hosted Sofia Sans. Headings use Sofia Sans SemiCondensed. Keep the admin font configuration isolated.

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
| Section headings                 | Responsive 32–36px      | Public section scale or established 22px drawer role | 600                     |
| Metadata                         | 13px                    | 13px                                                 | 400                     |
| Compact vehicle specifications   | Existing metadata scale | 12px / 16px                                          | 400                     |

Actions use --bc-weight-action; inputs and options use --bc-weight-control. Headings and prices retain emphasis. Selected controls use their underline, border, colour or checkmark rather than changing text weight or width.

Actions remain at least 44px high; primary actions, option rows and social links use 48px targets. Small visual icons do not mean small hit areas. Do not shrink text to squeeze more controls into a row: use wrapping or the established horizontal rail.

Preserve the homepage logo/model dialogs and mobile drawers. Do not replace them with native selects to simplify implementation. The all-filters dialog has one scrolling body and a persistent action footer.

Placeholders inherit input typography. A search input inside a decorated wrapper uses a visible focus ring on that wrapper. Verify selected states, placeholder styles and keyboard focus in the browser.

Test matching roles across home, inventory, About, Contact and conversion routes at 390px and 1440px, plus intermediate-width reflow. The typography-contact test suite checks action size and weight, picker selection, social links and Contact alignment. Existing suites cover selection persistence, drawers, navigation and focus.
