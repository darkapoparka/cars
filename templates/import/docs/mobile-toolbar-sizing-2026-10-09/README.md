# Mobile Search, Filter and Sort alignment

Search is 44px high on the actual Inventory page. The earlier utility-control
pass reduced the visible Filter/Sort circles to 36px while keeping their 44px
targets. That made this field row visually uneven.

`InventoryMobilePage.svelte` now sets the shared surface-size token to the
standard 44px height inside its Search row. Search, Filter and Sort align at the
same top and bottom. The action icons remain 20px with a 2px stroke, and both
native targets remain 44px square. Search width, row spacing and filter/sort
behavior are unchanged.

The 36px default remains for compact utility controls, including PDP photo
overlays. Consistency follows the control's context: full-height actions beside
a field, compact actions over imagery, and a shared 44px touch target. This
receipt supersedes the earlier blanket 36px rule for Inventory Filter/Sort.

## Rendered evidence

- [390px before/after](before-after-bg-390.png)
- [320px before/after](before-after-bg-320.png)
- [Search row comparison](toolbar-before-after-bg-390.png)
- [Before measurements](before/metrics.json)
- [After measurements](after/metrics.json)
- [Preservation comparison](preservation.json)
- [Grouped checks and exact QA source](verification.json)

Before views come from the actual public Import alias. After views come from a
frozen production build of the committed source plus this one-line correction,
without injected CSS. Both languages are measured at 320px and 390px. The
measurement checks Search height, native and painted action sizes, icon/stroke
sizes, alignment, all four target edges, overflow and page errors.

The working checkout's existing desktop drafts are excluded from the frozen QA
source and preserved in place. Mobile Home/PDP and desktop Inventory captures
check the unaffected presentation. Source checks, rendered output and hosted
alias verification remain separate facts.
