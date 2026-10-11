# Mobile control size: 44px

The mobile standard for icon buttons, search fields and quick-filter pills is
44px. Utility icons are 20px with a 2px stroke. Icon buttons have the same visible
size and native target; text pills retain content-based widths and single-line
labels at a 44px height.

The preceding passes left several competing sizes:

| Mobile control                       | Before                    | Now                            |
| ------------------------------------ | ------------------------- | ------------------------------ |
| Home/PDP/shared close circles        | 36px surface, 44px target | 44px surface and target        |
| Cars Filter/Sort                     | 44px                      | 44px, using the shared default |
| Home/Cars quick-filter pills         | 42px                      | 44px                           |
| Home search bar                      | 48px                      | 44px                           |
| Cars search bar                      | 44px                      | 44px                           |
| Home Import search and Selling close | 40px                      | 44px                           |

`tokens.css` owns the shared mobile sizes. The chip height changes only below
768px, while the existing desktop utility size remains 40px. Inventory's
temporary local surface-size override is removed. Home's quick-filter icon and
search close use `MobileIconAction`, including their existing accessible labels,
expanded state and callbacks. `MobileSearchControl` aligns its mobile field and
action at 44px; the mobile Selling header uses 44px close/spacer columns and the
shared utility-icon size. Existing desktop CSS and interaction logic are retained.

This standard supersedes the earlier 36px utility rule and the subsequent Cars
search-row exception. Use the shared size owners for these mobile controls.

## Evidence

- [390px before/after](before-after-bg-390.png)
- [320px before/after](before-after-bg-320.png)
- [Before measurements](before/metrics.json), [additional close controls](before/extra-metrics.json)
- [After measurements](after/metrics.json), [additional close controls](after/extra-metrics.json)
- [Desktop preservation](desktop-preservation.json)
- [Verification](verification.json)

Before screenshots show the actual public alias. After screenshots show a frozen
production build without injected CSS, excluding unrelated desktop drafts in the
working checkout. BG/EN are checked at 320px and 390px for Home, Contact, Cars,
Sort, Filters, PDP, photo viewer, Home Import search and the Selling overlay.
Native targets, painted circles, icon sizes/strokes, pill/search heights, target
edges, overflow, page errors and close behavior are recorded. Desktop Home, Cars
and PDP are compared separately. The existing focused suites cover search,
filter drafts, sorting, PDP keyboard/gallery/enquiry behavior and VIN/manual
selling submissions with explicit demo receipts.

Source checks, rendered verification and publication of the exact reviewed
source remain separate results. Existing desktop drafts are preserved.
