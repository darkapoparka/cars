# Mobile search focus — 4 October 2026

Mobile search and entry fields now use one 1px inset focus line. This removes the detached 2px ring and its 2px gap without changing field dimensions, corners or spacing. Keyboard-focused entry buttons retain a visible 2px inset indicator. Compact filter pickers share the same focus behaviour as the full search overlays.

The existing charcoal circle and selected-row treatment remain appropriate; this change keeps their geometry and selection behaviour.

| Selector before — 355 × 884 | Selector after — 355 × 884 |
| --- | --- |
| ![Detached thick search ring](before-quick-355.jpg) | ![Single thin inset focus line](after-quick-355.jpg) |

| Home before — 320 × 844 | Home after — 320 × 844 |
| --- | --- |
| ![Home search before](before-home-320.jpg) | ![Home search after](after-home-320.jpg) |

The implementation touches `src/lib/styles/base.css` and the search wrapper's semantic class in `src/lib/components/listing/QuickFilterSheet.svelte`. New styles are confined to the existing max-width 767px rules. Inner inputs explicitly leave the visible focus treatment to their wrapper. An input can report a 3px computed outline width while its outline style is `none`; that does not mean another ring is painted.

Native browser checks covered BG Home at 320px, compact and full inventory filters at 355px, English Home and blog search at 390px, pointer dismissal, keyboard dismissal/focus return and the desktop breakpoint at 1440px. All ten focused cases passed; matched field geometry and no horizontal overflow were verified. Measurements are in `verification.json`.

CSS policy, tokens, pinned Inter/Fluent and typography checks passed. Svelte check reported zero errors and one warning. The full build was attempted but its locale-source preflight is currently blocked by unkeyed `· km` in the concurrent `DesktopVehicleSearch.svelte` draft. That desktop work, its dependencies and all unrelated dirty files are excluded from this commit. This is source polish, not a template release or dealer deployment.
