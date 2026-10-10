# Mobile Home: Services before Buying guides — 10 October 2026

Home now places the mobile service overview after brand discovery and before Buying guides. The existing Services and Read actions retain their copy, artwork, dimensions and destinations. The services section remains hidden from 768px upward, preserving the desktop composition.

The existing mobile placement assertion and the styling/testing contracts now reflect this order. Unrelated edits in those shared files were preserved and excluded from the scoped commit.

Focused live-preview checks passed at BG 320/390px and EN 320px with no horizontal page overflow. Both service and article links were clicked in BG/EN: services reaches localized About `#process`, and Read reaches its existing localized article. The existing smoke placement assertion passed at 320px. All visible desktop Home section geometry at 1440px matches the preceding source. Script syntax and scoped whitespace checks passed; the route autofixer retains its existing localized `goto(resolve(...))` wrapper advisory. No production build or full test suite was repeated for the order change.

| 390px before | 390px after |
| --- | --- |
| ![Before](before-390.png) | ![After](after-390.png) |

The retained set is this matched pair, this explanation and compact `result.json`. Intermediate layout measurements were retired. Source delivery does not promote a template release or deploy dealers.
