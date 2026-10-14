# Cars result controls — 9 October 2026

The desktop result count and applied filters were separated from the Filter
action. The toolbar now follows **Filter → active selections → Clear**, with
Sort aligned to the right. Clear sits directly after short selections. Longer
sets retain one row with a scrollable rail and a review menu containing every
selection and its removal link. Clear and individual removal preserve sort.

The Cars search field and its sticky version show the actual filtered result
count as `(7)`, `(2)` or `(0)`. The separate left result label is removed. The
optional count does not appear in Home's shared search component. Mobile keeps
its existing compact search/count, sort/filter circles and card layout.

The toolbar stays 44px tall: hero 540px, search panel at y=340, toolbar y=556 and
first result y=616 in both empty and applied desktop states. The Sort control
also reserves its icon gutter consistently when its compact picker CSS loads.

| Surface | Before | After |
| --- | --- | --- |
| Applied controls, BG 1440×900, matched crop | [Before](before-toolbar-1440.png) | [After](after-toolbar-1440.png) |
| Empty result toolbar, BG 1440×900 | [Before](before-bg-empty-1440.png) | [After](after-bg-empty-1440.png) |
| Applied results, BG 1440×900 | [Before](before-bg-applied-1440.png) | [After](after-bg-applied-1440.png) |
| Overflow selections, BG 992×900 | [Before](before-bg-overflow-992.png) | [After](after-bg-overflow-992.png) |
| Mobile applied results, BG 390×900 | [Before](before-bg-applied-390.png) | [After](after-bg-applied-390.png) |

Svelte and source policy checks passed. Autofixer link warnings are false
positives for the existing `i18n.href(resolve(...))` routing; the sticky effect
operates the native popover and does not assign reactive source state.

[56 responsive cases](verification.json) cover empty, applied, overflow and zero
results at 320–2560px in BG and selected desktop EN sizes. Checks include truthful
counts, one toolbar row, Clear placement, the Sort icon gutter, no document
overflow, single-value removal, sort retention, Clear retention, both dialog
entry points, restored filter focus, the sticky count and Home isolation.
[16 compiled-preview cases](production-verification.json) repeat the critical
layouts and interactions. No browser page errors were captured.

Matched 320/390px captures preserve search/card geometry. Other mobile pixel comparisons are not presented as
unchanged: concurrent corner-token edits and lazy image completion affected
those captures. The scoped commit preserves those unrelated edits outside its
source changes, together with the separate desktop modal draft.

The reviewed toolbar dependencies include the applied-selection rail, its two
localized labels and the desktop-only rule that moves its chips out of the search panel. Local QA used
the [recorded shared sources](source-hashes.json); it is not a template-release
or hosted-dealer acceptance. Adapter packaging and deployment were not run.
