# Small hero box refinement — 4 October 2026

The shared white hero boxes now have a 24px desktop inset instead of 20px. Home's tabs and fields share that inset, with 16px above the tabs. Its inner height calculation follows the panel's spacing role. The composition, artwork, typography, box widths, corner roles, shadows and 36px round search surface remain.

Search keyboard focus now uses three explicit settings consumed by the shared focus rule. Its input retains one visible wrapper ring; Home's opener retains its inset ring. The existing default outline and contrast shadow remain for other controls. This removes four local `!important` declarations and the repeated search-action radius declaration.

## Matched screenshots

These are actual local preview captures at 1440 × 1000, in Bulgarian, with the same viewport for each pair.

| Route    | Before                        | After                       |
| -------- | ----------------------------- | --------------------------- |
| Home     | [Before](before-home.png)     | [After](after-home.png)     |
| Cars     | [Before](before-cars.png)     | [After](after-cars.png)     |
| Services | [Before](before-services.png) | [After](after-services.png) |
| About    | [Before](before-about.png)    | [After](after-about.png)    |
| Contact  | [Before](before-contact.png)  | [After](after-contact.png)  |

At 1440px, Home remains 760px wide and changes from 232px to 236px tall. Cars and Services retain their 162px height. About changes from 154px to 162px, and Contact from 188px to 196px, accommodating the additional padding.

## Verification

- Svelte check passed with 0 errors and 0 warnings; the isolated production build passed.
- The 11 existing desktop search/typography/contact cases passed, covering modes and artwork, focus and accessibility, filter/query handoff, selected control sizes, narrow desktop wrapping and the About/Contact routes.
- 24 rendered BG/EN desktop cases had no horizontal overflow: Home at 768/1024/1440/1920px; Cars, Services, About and Contact at 768/1440px.
- All 20 matched BG/EN mobile cases at 320/390px retained the geometry, copy, typography and colors of 184 inspected first-viewport headings and controls across the five routes. This is focused preservation evidence rather than a full-page audit.
- Actual keyboard traversal confirmed one 3px wrapper ring for Cars and Services search inputs, Home's inset opener ring, and the original outline/contrast shadow on its action.
- Scoped source formatting and ESLint passed. Architecture and asset checks passed: 57 native route modules, 230 reachable modules, one Tailwind entry and 955 local images.

[Structured verification](verification.json) records the source hashes and measured changes. Detailed check/build/browser logs remain in ignored `runtime/hero-box-refinement-2026-10-04/`. Validation uses the retained npm dependencies and pinned Node 24.21.0 in isolated output, preserving the running 6790 preview.

This is reusable Import source polish and local preview verification. It does not select a template release or deploy dealer variants. Unrelated checkout changes remain intact.
