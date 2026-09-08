# Bohemcars Mobile Header Patterns

Bohemcars has two approved mobile header patterns. Use one deliberately; do not create route-specific header chrome unless a route has a product reason documented in the component.

## Brand Appbar

Use on brand, marketing, and intake entry pages where Bohemcars identity is the first signal.

Examples: `/`, `/sell-your-car`, `/import`, contact-style entry pages.

Structure:

- Bohemcars logo on the left.
- Contact, map, message, or similarly contextual quick actions on the right.
- Inline or absolute over the top hero when the page uses green chrome.
- No page title and no back button.

Visual contract:

- 56px mobile row plus safe-area inset.
- 44px white circular icon controls, shrinking to 38px on very narrow screens.
- Dark ink icons on green chrome.
- Calm fill hover/focus states only.

## Utility Appbar

Use on top-level task pages where the user is inside a tool, not reading a brand landing page.

Examples: `/compare`, mobile inventory tool surfaces, favorites if presented as a tool page.

Structure:

- Use the Bohemcars logo for public top-level utility pages when brand consistency matters and the
  task title/state is directly below the header.
- Use page title/state in the header only for denser app-only surfaces where the next row is not a
  clear task title.
- Put the primary task action in the content band when it needs a text label; avoid duplicating it
  as a second icon-only header action.
- No back button for top-level routes that are reachable from bottom navigation or the menu.

Visual contract:

- Same 56px mobile row plus safe-area inset as the brand appbar.
- Same green chrome and 44px/38px white circular action controls when green chrome is used.
- The page content owns its own gutters; do not nest the tool inside an extra mobile container/card.
- Hide the full marketing footer on mobile utility pages; keep the fixed bottom navigation as the
  mobile navigation surface.

## Back Buttons

Use a back button only for child or drill-in contexts: vehicle detail, account detail, a wizard step, or a modal-like page entered from a specific parent. Do not add a back button to top-level public routes such as `/compare`, `/sell-your-car`, `/import`, or `/contact`.

When a back button is justified, it replaces the left-side title or appears inside a child-screen header, not beside the Bohemcars logo on a brand page.
