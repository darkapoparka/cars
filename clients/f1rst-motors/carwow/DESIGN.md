# Storefront design contract

The current native compositions are the reference. A code refactor must not turn into an unrequested redesign.

The shared typography scale and action hierarchy are defined in [docs/TYPOGRAPHY.md](docs/TYPOGRAPHY.md). The September 13 typography pass standardizes those roles while retaining the separate native compositions.

Desktop and mobile deliberately use different information density and layout. Desktop's yellow home/support heroes, compact control hierarchy and existing card grammar remain independent from mobile's header, home, inventory cards, task sheets and bottom navigation. Use `DESKTOP_STYLE_GUIDE.md` and `docs/COMPONENT-PATTERNS.md` for ownership, not the old source-era backlog.

Preserve typography, spacing, icons, borders, color roles, open-panel geometry, keyboard focus, and route/content order. Test the 991/992px composition boundary as well as phone and desktop widths. Never use a broad token or global selector change to repair one route.

Home search, import and location sheets share explicitly scoped CSS in `src/lib/components/home/mobile/mobile-home-sheets.css`; their separate components own drafts and behavior. `MobileFullSheet` owns the opaque transition, content-vs-full presentation, focus, Escape, backdrop and visual viewport contract. Explanatory lead sheets retain their white header and single footer action; do not add a second contact action into them.

Capture matching before/after pages and interaction states. Inspect the images; a passing build or smaller diff is not visual verification. Do not overwrite reference screenshots merely to make a test pass. Owner visual approval is still required before committing or pushing the current refactor.

Historical design notes are archived in `docs/legacy/design-before-native-refactor.md` and do not select a branch or authorize a redesign.
