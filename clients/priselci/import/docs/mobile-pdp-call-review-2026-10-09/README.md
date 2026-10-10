# Mobile PDP Call colour — 9 October 2026

The owner selected the pale grey preview for Call. The mobile Call button now
uses the shared `--bc-surface` background (#f5f7f9). Its dark text,
17px regular label, 44px height and native phone destination are preserved.
Inquire retains its black background and primary emphasis.

The only source change in this follow-up is the background value at
`src/lib/components/detail/AuxeroVehicleMobilePdp.svelte`, inside the existing
mobile breakpoint. [Applied patch](applied.patch) compares the component backup
immediately before this change with the applied source. All earlier PDP work and
other dirty paths are preserved. The original colour comparison below retains
the outlined version; the final follow-up removes that outline.

- [BG 390px before/after](before-after-bg-390.png)
- [BG 320px before/after](before-after-bg-320.png)
- [EN 390px before/after](before-after-en-390.png)
- [EN 320px before/after](before-after-en-320.png)
- [Applied measurements](applied-metrics.json): canonical dev, no injected styles;
  both locales at 320/390px have the pale grey background, dark text, original
  control dimensions and phone href, no page errors and no horizontal overflow.
  The background, text, border and dimensions match the approved grey preview.

Scoped Prettier and Git whitespace checks passed. Svelte autofixer reports the
same existing localized resolver-alias findings and effect-review suggestions.
The earlier interaction suites, semantic lint and production build were not
repeated for this single CSS value change; their prior receipts retain their
original scope. This follow-up verifies the applied local render and link
attributes without placing a call.

Runtime scripts, the component backup and autofixer log are in
`L:/CODEX/cars/runtime/import-mobile-pdp-call-review-20261009/`.
Dev remains at `http://127.0.0.1:6791/bg/inventory/21754658377544573`.

## Final borderless treatment

The owner requested removing the Call outline to reduce competition with the
tab underlines and reading-card borders. Call now inherits the base CTA's zero
border. Its pale grey fill, dark 17px regular label, 44px target and native phone
href are unchanged. Inquire remains the primary black action.

- [Final BG 390px comparison](final/borderless-before-after-bg-390.png)
- [Final BG 320px comparison](final/borderless-before-after-bg-320.png)
- [Final EN 390px comparison](final/borderless-before-after-en-390.png)
- [Final EN 320px comparison](final/borderless-before-after-en-320.png)
- [Final rendered measurements](final/metrics.json): BG/EN at 390x844, 320x844,
  320x540 and desktop 1440x1000; no injected CSS. The Call border is zero, top
  icon targets remain 44px with 36px painted circles, the title is one line with
  its full accessible text, and the three reading containers share white fill,
  1px borders, 12px radii and 12px padding. All selected labels use weight 600.
  Last content remains reachable, the bottom navigation is 52px with targets
  over 44px, and captured routes have no page errors or horizontal overflow.

The Mobile reference was inspected at the same 390x844 viewport on
`https://cars-template-mobile.vercel.app/vehicle/bmw-x6`.
Its faint shadow separates a 52px rail from scrolling content. Import keeps its
44px rail, larger labels, selected weight and underline; adding another shadow
was not needed for this drawer. [Reference screenshot](mobile-reference-390-final.png).

Final checks use the frozen QA copy under
`L:/CODEX/cars/runtime/import-pdp-release-20261009/`: Node 24.21.0, retained npm
lockfile, Svelte diagnostics (zero errors/warnings), scoped ESLint and Prettier,
architecture/assets checks, 179 unit tests and the production build passed.
The frozen runtime includes the other chat's committed Sell refinements.
Svelte autofixer's existing resolver-alias and effect suggestions were reviewed;
this change introduces no navigation or effect edits.

The grouped browser run covered gallery, tabs, demo inquiry and bottom-nav
route/menu behavior. A stale Sell heading-level assertion was updated to the
existing H1. Two affected navigation cases and a transient demo-response timeout
passed on the focused serial rerun (4 passed, 2 desktop-only skips). The first
run's other 13 cases passed; its original report is preserved in the runtime.
No application behavior was changed to resolve those test results.
