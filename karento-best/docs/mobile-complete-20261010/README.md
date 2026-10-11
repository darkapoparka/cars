# Mobile comparison captures — 10 October 2026

These local English-language comparisons use matched states in the in-app browser at a 390 × 844 CSS-pixel viewport. The native JPEG captures are 375 × 812 pixels because of browser capture scaling. Each 766 × 848 composite places **Before on the left** and **After on the right**, with labels and a gutter. The UI pixels were not retouched.

| Comparison                              | Matched state                                                | Improvement shown                                                                                                                                     |
| --------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Wishlist](wishlist-before-after.png)   | Search query `Porsche`; document scroll Y = 213              | Previously inert search now filters the supplied vehicles and presents a truthful empty state with a working clear action.                            |
| [News list](news-list-before-after.png) | Document scroll Y = 1857; first card top = −53.75 CSS pixels | Shared 18/14/12px mobile type roles, natural card height, quiet category treatment, and a shared browse pill with 28px paint and 44px touch coverage. |

The four exact source captures remain in `.runtime/evidence/mobile-complete-20261010/`: `wishlist-before.jpg`, `wishlist-after.jpg`, `news-list-before.jpg`, and `news-list-after.jpg`. The two composites above are the retained visual comparisons.

Compact browser coverage records, integration results, and current HTTP results remain in that same evidence directory. The reused `mobile-final-20261010` production output is retained for the active local preview; this pass did not create full QA project or dependency copies.

These captures show the named comparison states. They are not deployment evidence or fresh captures of the final chart repair.
