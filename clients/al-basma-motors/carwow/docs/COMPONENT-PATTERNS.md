# Carwow component patterns

Scope: the independent J: template master. Updated for the September 2026 native refactor. Home, inventory and the separate mobile/desktop compositions remain the visual authority. This document describes implementation boundaries; it does not establish business, provider or deployment readiness.

## Actions and panels

| Family                                                        | Use                                          | Ownership                                                                                            |
| ------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `sa-cta sa-cta-primary`                                       | Existing black desktop primary action        | Geometry in `storefront.css`; desktop role colors and focus in `src/lib/styles/desktop-controls.css` |
| `sa-cta sa-cta-primary`                                       | Existing red mobile conversion action        | Preserve mobile red; do not recolor by changing global tokens                                        |
| `sa-cta sa-cta-secondary` / `sa-cta-ghost` / `sa-cta-on-dark` | Secondary action (white on desktop)          | Use the existing variant; do not duplicate its colors in route selectors                             |
| `sa-cta-compact` / `sa-cta-large`                             | Intentional size variants                    | Shared CSS owns dimensions and type; no per-button height patch                                      |
| Flat support panels                                           | FAQ, reviews, financing steps, article cards | Existing neutral border and radius; no broad decorative shadows or hover lift                        |

Favorites uses the shared black action and dark-surface secondary variant. Its retained black hero gives the primary action a white boundary for contrast. Financing uses the same action family. Scoped mobile financing actions retain their existing compact composition and a minimum 44px phone target; eyebrow selectors target only the eyebrow, so button text inherits its own foreground.

## Supporting routes

| Component                                            | Responsive contract                                                                                                                                                                                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BlogIndexPage`                                      | The native index owns URL-backed search and categories. Preserve the current desktop yellow hero, mobile compact white-card stream and existing filter hierarchy; do not revive the older sidebar/archive layout from historical plans.                 |
| `BlogArticlePage`                                    | One H1 and semantic H2 article sections retain the established type scale. Share URLs use the same current site origin and route as canonical metadata. Historical article slugs/dates are stable; guide labels must not imply newly arrived inventory. |
| `DesktopTeamPage`                                    | Desktop portraits remain. Mobile uses compact portrait, identity and contact rows; duplicate portrait-overlay controls disappear while the visible contact and profile actions remain.                                                                  |
| `DesktopTeamMemberPage` / `DesktopDealerProfilePage` | Mobile uses restrained section spacing and compact vehicle/team recommendation rows. Contact details remain accessible. Desktop geometry is preserved.                                                                                                  |
| `FaqContent`                                         | Native buttons expose `aria-expanded` and control the matching answer. Initially collapsed, single-open behavior. The title owns inset spacing; the outer panel does not duplicate padding.                                                             |
| `ReviewsContent`                                     | One H1; review ratings and disclosure come from shared review data. Decorative stars and avatars do not create repeated meaningless screen-reader labels.                                                                                               |
| `TermsContent`                                       | Each approved paragraph/list appears once. Stable section IDs and scroll margins retain anchor navigation. Footer labels point only to content that exists; do not invent privacy/cookie policies.                                                      |
| `DayNightFooter`                                     | Owns its gutters and translation reset once for all supporting mobile routes. Link groups are native disclosures with visible focus and 44px targets. The independent desktop footer remains separate.                                                  |

## Data and interaction boundaries

- Review identity, sample disclosure, ratings and aggregates belong to `daynight-reviews.ts`; team identity and disclosure belong to `daynight-team.ts`.
- Phone, location and business facts belong to `daynight-site.ts`. Retained sample content requires confirmation before personalization or public delivery.
- Finance calculation, availability and garage state belong to their shared model/state modules. A styled control must use the real state contract rather than a local hard-coded result.
- Component CSS owns its local layout. Shared utilities own action states. Responsive overrides stay inside the component or its existing family stylesheet; do not add a global override stack.
- Native links, buttons and details retain keyboard behavior. An interaction repair must preserve focus visibility and return. Do not remove focus outlines to imitate a static screenshot.

## Verification

Review the affected routes at 390 and 1440px together, plus 320/430px for mobile clipping and 1280/1920px for desktop families. Check open footer groups, keyboard focus, Blog search/filter URLs, article share payloads, FAQ expansion, phone label contrast and populated Favorites. Compare matching before/after views; a shorter full page is useful only when content remains readable and controls remain available.

Run Svelte analysis and the existing framework checks/build after integration. Rendered results, isolated persistence/delivery checks, hosted origin verification and physical-device testing are separate evidence boundaries. Do not update all visual baselines merely to hide a difference.

## Native lifecycle boundaries

Use the root viewport context rather than another media-query hook. Home buy/import/location sheets are independent components sharing explicitly scoped family CSS. Import drafts are not search-filter state. Per-image attachments are reference-counted and must release ownership on destruction; do not add timeout polling or document-wide rescans. Native FAQ buttons own their own state and accessibility attributes.
