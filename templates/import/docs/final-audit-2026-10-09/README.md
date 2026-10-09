Import final local audit — 9 October 2026

The mobile guides now scroll horizontally using the existing cards. At 390px the section shrank from 484.8px to 224.4px; the next card remains visible, keyboard scrolling works, and the last article opens correctly. Footer social icons remain on the left with 48px tap targets. The duplicate name above mobile policy links is hidden, and the message link has a compact button style. Desktop and tablet composition is preserved.

The audit also fixed Home-to-Import links losing the chosen body type or electric preference, Home cards showing financing when estimates are disabled, and preview reviews lacking a sample label. Regression coverage includes both locales. Existing dealer configuration, routes, assets and lockfile are preserved.

Validation: Node 24.21.0/npm 11.19.0; Svelte check 0 errors/0 warnings; formatting/ESLint, architecture, 997 local asset signatures, 179 unit tests and the final production build passed. The full Chromium run verified 497 applicable cases with 259 intentional skips. Three initial environment failures (disk exhaustion and a browser resource fetch) each passed three isolated repeats. After the guide polish, 20 focused tests passed with 6 intentional project skips; after the final footer revision, another 3 accessibility/footer tests passed with 1 intentional skip. Browser inspection covered core routes, Compare, filters and English/Bulgarian at phone, tablet and desktop widths.

| Change                                  | Before                                     | After                                    |
| --------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| Mobile guides, matched heading position | [Before](before-guides-mobile-390.jpg)     | [After](after-guides-mobile-390.jpg)     |
| Mobile footer, matched bottom position  | [Before](before-footer-mobile-390.jpg)     | [After](after-footer-mobile-390.jpg)     |
| Desktop preservation                    | [Before](before-bottom-desktop-1440.jpg)   | [After](after-bottom-desktop-1440.jpg)   |
| Import type handoff                     | [Before](before-hatchback-handoff-320.jpg) | [After](after-hatchback-handoff-320.jpg) |
| Sample review label                     | [Before](before-reviews-mobile-390.jpg)    | [After](after-reviews-mobile-390.jpg)    |

Production dependencies have zero reported vulnerabilities. Four moderate advisories remain in development database tooling. Browser recorded two `derived_inert` runtime warnings during overlay/breakpoint checks, with no page errors or reproduced interaction failure; the final polish introduced no additional warnings.

This is local source/build/browser verification. Template promotion, deployment and hosted acceptance remain separate. Raw diagnostics are preserved under ignored `runtime/final-audit-2026-10-09/`; unrelated shared-checkout work remains untouched. [Compact verification receipt](verification-summary.json).

Source is maintained on `main`; repository history records its commit and push. Git publication does not imply template promotion or deployment.
