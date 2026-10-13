# Mobile utility controls — 9 October 2026

Home Contact/Map, Cars Filter/Sort, PDP Back/Compare/Save/Share and the photo
viewer's Close now use `MobileIconAction` and the same shared mobile geometry:

| Property                 | Standard  |
| ------------------------ | --------- |
| Native clickable target  | 44 × 44px |
| Visible circular surface | 36 × 36px |
| Icon                     | 20 × 20px |
| Icon stroke              | 2px       |

The same component supplies the Contact sheet close and Cars search/filter/sort
drawer Back/Close controls. Photos retain their quiet white overlay surface;
Home retains its dark surface. Full-width enquiry/call actions retain their
existing composition.

`src/lib/styles/tokens.css` owns the four geometry tokens. `MobileIconAction.svelte`
owns painting, hit area, icon sizing, focus and pointer behavior. Page components
own position and actions. The former Cars surface-size override and duplicated
PDP/drawer button styles were removed. Desktop retains its existing 40px shared
surface and existing glyph sizes through breakpoint scoping.

## Matched rendered evidence

- [390px before/after](before-after-bg-390.png)
- [320px before/after](before-after-bg-320.png)
- [Before measurements](before/metrics.json)
- [After measurements](after/metrics.json)
- [Desktop preservation](desktop-preservation.json)

The captures use actual rendered pages with no injected styling, loaded fonts,
the same locales/viewport/routes and reduced motion. BG/EN at 320/390px cover
Home, Contact, Cars, Sort, Filters, PDP and the full photo viewer: 28 states.
Every audited utility has a 44px native target, 36px circle, 20px glyph, 2px stroke
and working hit detection on all four target edges. No page errors or horizontal
overflow occurred.

Before this correction, Home painted 40px circles, Cars painted 44px, PDP painted
36px, and the viewer painted 44px around a 24px X. Filter/Sort drawer close targets
were 42px. After the correction these all share the standard above.

The desktop baseline comes from the live production deployment before this edit;
the after views come from the frozen production build. At 1440 × 1000px, PDP has
zero changed pixels. Home and Cars have 31 and 51 differing pixels respectively,
with a maximum channel difference of 2/255; these are tiny rasterization
differences, with the existing layout and desktop control sizes retained.
The gallery close position is checked explicitly at the original top-right
anchor. The first inspection caught a positioning conflict after moving it into
the shared component; that inspection is preserved in ignored runtime evidence
and the corrected captures are linked here.

The frozen Node 24.21.0 build, Svelte check (zero errors/warnings), scoped ESLint,
format, architecture and asset checks pass. All 13 focused existing browser cases
pass, covering Home discovery, filter drafts, sort URL retention, wishlist toggles,
gallery/inquiry behavior and keyboard focus return.

Source and hosted verification receipts are recorded separately at closeout.
Concurrent desktop filter/page drafts remain outside this change.
