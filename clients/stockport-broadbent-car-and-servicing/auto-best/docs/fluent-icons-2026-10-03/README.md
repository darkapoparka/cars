# Fluent Regular mobile icon review — 3 October 2026

The mobile action renderer now uses official Microsoft Fluent System Icons Regular, pinned at `a563cf9166f4f91aa617557ed272612b7f0a2f72`. [Source and license](../../provenance/fluent-icons.md) record the native geometry for sixteen existing roles. Inter, control sizing, page composition and navigation behavior are unchanged by this icon revision.

The comparison keeps Inter constant. All images are actual browser captures of the application at `http://127.0.0.1:6461`, with no replacement glyphs injected into the page. The before images were captured immediately before this source change. All frames are 844px high.

| View | Before: Material Symbols Sharp | After: Fluent Regular |
| --- | --- | --- |
| Bulgarian Home, 390px | [Before](before-home-390.jpg) | [After](after-home-390.jpg) |
| Bulgarian menu, 390px | [Before](before-menu-390.jpg) | [After](after-menu-390.jpg) |

Additional captures: [Bulgarian Home at 320px](after-home-320.jpg), [English Home at 390px](after-home-en-390.jpg).

Fluent's rounded outlines give the dock a more consistent visual weight than the previous Sharp set with its solid active house. The same Regular variant remains in selected and unselected states; the existing pill, color, caption weight and accessible current-page state communicate selection. This visual assessment remains subject to owner review.

Validation on Node 22.20.0: `npm run validate` passed, including source/geometry guards, Svelte checks with zero errors or warnings, locale/source audits and the production build. Against the production preview on port 6498, `mobile-polish-smoke.mjs` passed eight BG/EN cases at 320/390/430/1440px; `mobile-final-smoke.mjs` passed six BG/EN cases at 320/390/430px, including enlarged text, motion preferences and menu focus return. [Verification record](verification.json) retains the case results.

These results establish the local working-source behavior. Shared Cars work from other tasks was preserved; no template release or dealer deployment is included.
