# New-session prompt: Import desktop audit and refinement

Copy the prompt below into a new session opened in `L:/CODEX/cars/templates/import`.

```text
Work in the existing Cars Import master at L:/CODEX/cars/templates/import on main. Audit and polish the entire public DESKTOP, then implement the fixes. Preserve current mobile, including the mobile About trial; no other mobile redesign.

Read AGENTS.md, docs/DESKTOP-STYLING.md, docs/ARCHITECTURE.md, docs/TYPOGRAPHY.md and docs/QA.md. The desktop About page at http://127.0.0.1:6790/bg/about is the styling anchor I accepted. Its desktop receipt is docs/desktop-about-studio-2026-10-02/README.md; the mobile trial receipt is docs/mobile-about-editorial-2026-10-02/README.md.

First check the mobile trial receipt's integration handoff: the source/docs are verified but its scoped commit was blocked by a recreated Git index lock. Preserve active writers and inherited dirty work. Once the lock owner releases it, record that reviewed work with its listed scoped paths before expanding the desktop changes.

Inspect http://127.0.0.1:6418/admin-preview?lang=bg&store=studio and http://127.0.0.1:6418/ for the Shopify-derived Treido reference. Use its hierarchy, neutral surfaces, control balance and spacing. Respect Cars' automotive identity: centered dark heroes, shared heading/artwork alignment, red actions, car imagery, discovery boxes, four-column stock cards and purchase/finance layout. Keep reference repositories read-only. Port 6464/bg/services and its Home have relevant automotive assets. Verify ports before relying on them; if a reference is unavailable, use the documented inspected direction and record that limit.

Inspect Home in every mode, Inventory in its filter/sort/view/empty states, multiple car PDPs, Services/detail, About, Contact, Import, Sell, Financing, Favorites, Compare, Reviews, FAQ, Blog/detail, policies/locale/errors and public menus/dialogs/forms. Record and fix inconsistencies in typography, hierarchy, gaps, margins, card heights, crops, controls and responsive reflow. Retain the route-specific product rules in DESKTOP-STYLING.md.

Remove repeated hardcoded styling and inline copy through existing semantic tokens, typed content/config and reusable components. Keep legitimate layout geometry. Avoid layered overrides, duplicated markup, arbitrary abstractions, generic commerce/admin layout and random AI imagery. Preserve URLs, GET forms, dependent filters, saved/compare state, demo truthfulness and history/Back behavior.

Capture before/after screenshots. Verify BG/EN at 768/1024/1440/1920px and mobile preservation at 320/390px; exercise keyboard and affected journeys. Run the relevant existing checks and a frozen production build without disturbing the live preview. Preserve dirty work, use the pinned runtime/lockfile, finish with scoped commits and non-force push to main. Report actual evidence and limitations. Do not deploy dealers or promote a release. Proceed with implementation rather than stopping at a plan.
```
