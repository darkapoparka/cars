# Mobile UI sizing baseline - 14 October 2026

Accepted local UI baseline for `templates/mobile`, following the owner's request
to verify these controls and lock their sizing for the forthcoming template rollout.
Keep the current composition and the sizes below. Measurements are rendered CSS
pixels; the visible fill and the clickable button are separate boxes.

| Control                        | Accepted presentation                                                       | Clickable area                                                      |
| ------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Phone quick-filter pills       | 16px labels, 22px line height, 36px visible height, 10px horizontal padding | 48px high, natural width; 6px of tap space above and below the fill |
| Phone Sort                     | 20px arrow icon, 2px stroke, 36px circle                                    | 44 x 48px                                                           |
| Vehicle-type row               | Existing artwork, responsive from 56 x 35px at 320px to 64 x 40px at 390px  | 52px high, responsive equal-width tabs                              |
| Search-overlay field           | 16px text, 48px outer field                                                 | 44px input inside the field                                         |
| Search-overlay section tabs    | 16px text, existing underline treatment                                     | 48px high                                                           |
| Search-overlay close and reset | Existing icons                                                              | 48 x 48px                                                           |
| Search-overlay apply action    | 16px text, existing red pill                                                | 44px high                                                           |
| Floating navigation            | 204 x 48px dock, 28px generated icons, three destinations                   | 44px-high links with localized accessible names                     |

For example, Bulgarian Make/model is approximately 162 x 48px clickable, with a
162 x 36px visible pill. The width depends on the label; it is not a 48px square.

Focused verification passed on the existing preview at `http://127.0.0.1:6474`:

- Bulgarian at 320px and 390px; English controls and search overlay at 390px.
- All five quick pills retain the accepted sizes. Keyboard navigation reveals
  offscreen pills, shows a visible focus ring, and their top tap padding hits the button.
- Sort opens and dismisses; Make/model opens through Enter and Escape restores its opener.
- Search focuses its input, finds three BMW X6 examples, clears back to the six
  initial suggestions, and Enter submits the empty search back to all 16 cars.
- Category artwork and dock assets load. No document overflow or browser errors were found.
- At 1440px, desktop filter geometry matches the pre-polish measurements; the
  desktop Sort icon remains 16px and the floating dock remains hidden.

The review used the maintained preview and existing dependencies. Earlier scoped
lint and formatting checks remain valid for the unchanged reviewed component hashes.
This records local UI acceptance; immutable template-release selection and dealer
publication remain their own checkpoints.

Retained final captures:

- [Phone 320px](locked-home-320.jpg)
- [Phone 390px](locked-home-390.jpg)
- [Search overlay 390px](locked-search-390.jpg)
- [Desktop 1440px](locked-desktop-1440.jpg)

[Verification receipt and source hashes](ui-sizing-baseline.json) bind this review
to the working source. Prior chat-linked comparisons remain under
`runtime/mobile-final-ui-audit-20261014/` for their distinct before/after history.
