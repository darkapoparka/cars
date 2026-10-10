# 05 — Desktop and responsive product specification

## Visual policy

The refactor must improve the desktop result, not merely change file organization. Use the current mobile implementation as a protected reference, not as an instruction to stretch mobile screens to desktop width. Keep approved imagery and useful hierarchy. Do not add marketing filler, repeated counts, extra eyebrow headings or decorative rules to make a page look busier.

Desktop decisions require a representative reference pass at 1,280 and 1,440px, with checks at 1,024 and 1,920px. Mobile regression references start at 390px, with compact/large-phone and breakpoint checks. A desktop screenshot and a mobile screenshot are not sufficient to characterize the interval between them.

## Shared shell, navigation and page geometry

Use one navigation data source and clear active-route semantics. The homepage may deliberately use an inverse hero/header while content pages use another approved surface, but logo bounds, action semantics, spacing roles and typography remain related. An inventory header action must not become larger merely because another stylesheet wins on that route.

The public shell owns the main landmark, skip-link target, content container, header/footer relationship and shared sticky offsets. A page should not add its own second shell or reset the body classes of its neighbours. Language, favourite, compare and account controls need descriptive labels and a consistent icon style. A button that opens a menu is not a navigation link; a navigation link is not a button with a click handler.

Dropdowns need keyboard behaviour, sensible placement near the viewport edge and focus restoration. Hover-only access is insufficient. Use the existing primitive library where appropriate instead of maintaining independent document-level listeners in each header/filter implementation.

**Acceptance:** compare the header’s computed control sizes, baseline and gutter across home, inventory, import, sell, financing, contact and detail. Check hard reload and navigation in both directions. At compact laptop width, primary navigation neither overlaps the logo nor silently loses actions.

## Homepage

Keep a strong hero/search area, useful vehicle imagery and a readable page hierarchy. Establish a consistent container edge from hero controls through featured vehicles and subsequent sections. Review whether each existing action band serves a distinct purpose; remove duplication only through a content decision, not because a shorter page is automatically better.

The Buy/Import/Sell modes must share tab geometry and preserve the user’s input/intent where appropriate. Switching a mode should not resize unrelated text or move the underline baseline. Hero controls can be larger than ordinary toolbar controls, but should not establish the default size for every form.

Featured cards must follow the same fact/price/action rules as inventory cards. A page parent must not force a different title height, badge treatment or finance alignment through descendant selectors. Desktop card density must preserve the usefulness of the image. No global mobile `order` rule should contradict meaningful reading/focus order; compose the intended sequence in markup or explicit section slots.

**Acceptance:** first-screen composition, long-title cards, complete below-fold section rhythm, active mode transitions and comparison with the mobile baseline are reviewed. Duplicate headings or apparently duplicated review slides must be assessed in the accessibility tree, not only by visual hiding.

## Inventory

Split the interaction into query state, facet options, toolbar, grid/list presentation and cards. Keep the selected filters, count, sort and view meaningful as one composition; avoid scattering every element into a separate box.

Desktop should have clear primary search/filter access, a stable results toolbar and a useful grid. Choose columns from available card width and the approved density role, not from a desire to display the maximum number of cards. Retain existing view options until the supported-product decision is made. The compact desktop layout must not squeeze card titles, metadata, price and finance into competing lines.

Facet controls need explicit empty, selected, expanded, disabled and loading states. Make/model relationships must clear or preserve dependent values predictably. Popovers need content-height limits, no large blank band below a missing description and a consistent clear/apply pattern. Dynamic counts must not add a redundant full-width row below quick pills when the information already exists elsewhere.

The list must preserve the current detail-return experience: applied query, scroll position and revealed card count. Avoid keying state to unstable object identity. Fetch races must not allow a slow old count/result to replace a newer one.

**Acceptance:** initial, filtered, multi-filter, zero-result, loading, malformed-query, long-label, sort, view, load-more and back-from-detail cases pass. The query is identical on desktop/mobile for the same URL. Essential list content is server-rendered at mobile widths, including with JavaScript disabled.

## Vehicle card family

Inventory, featured, favourite and comparison-entry cards may have purposeful variants. They must share canonical title/trim, price, mileage, badges, image, availability, finance estimate and action semantics. Do not create a universal card with dozens of unrelated booleans.

Preserve a compact title treatment where it remains readable. Handle long models deliberately rather than reserving multiple empty title rows on every card. Keep secondary monthly text subtle, but separated enough from metadata to avoid visual competition. Keep metadata compact and non-interactive unless it truly performs an action. The image remains prominent; avoid shrinking it as the default solution to text-layout problems.

Favourite/compare controls must not be nested inside an interactive card link in a way that creates invalid or competing activation behaviour. A card has usable keyboard targets, honest image fallbacks, stable dimensions and no hover-only essential information.

**Acceptance:** use fixtures for long Bulgarian names, short names, zero/unknown price, missing finance, reserved/sold status, missing image, long mileage, image failure and loading. Compare at every grid density retained in the supported contract.

## Vehicle detail

Keep the gallery visually important. Desktop needs a clear relationship between gallery, price/primary inquiry and supporting facts. A sticky inquiry summary must not overlap navigation, hide focus or create an excessively long empty column at intermediate widths.

Share the gallery model, specification groups, finance assumptions, contact methods and related-vehicle data between desktop/mobile. Do not maintain two diverging vehicle models. Separate substantial sections by responsibility: gallery, summary/actions, facts, history/description, finance, contact and related vehicles.

The facts panel should use the approved neutral surface rather than an accidental greenish brand tint. Reviews should read as one coherent section/container. A finance panel may intentionally receive stronger emphasis, but its treatment must not be inferred from arbitrary existing CSS. Preserve approved artwork; do not add an extra overlaid text heading that duplicates a title already baked into an image. Provide an equivalent accessible heading/name without duplicate announcements.

**Acceptance:** keyboard gallery opening/closing and image navigation; focus return; zoom/escape; short/long descriptions; absent specifications; wide and narrow gallery ratios; sticky behaviour; financing calculation agreement; image loading/failure; and mobile safe-area action controls. A full detail route still needs a dedicated baseline beyond general public-page screenshots.

## Import and sell

Share each flow’s schema, values, validation and submission state across desktop/mobile. Share field/step content where it is genuinely the same. The mobile full-viewport wizard/sheet remains a protected interaction pattern. Desktop should use a deliberate bounded form/dialog or clear page composition, not a stretched phone sheet or a sparse two-column layout with a large empty region.

Import’s Link/VIN modes should be explicit and align with the shared tab contract. Do not model a simple mode selection as unrelated promotional cards. Preserve input when changing presentation unless the business meaning requires clearing it. The “how it works” content must not compete with the primary input.

Sell must cover vehicle details, images/documents where enabled, contact and review/submit without inventing follow-up promises. Long forms need appropriate grouping and visible error recovery, not excessive decoration. A missing optional description must not reserve header space.

**Acceptance:** keyboard-only completion; invalid/valid synthetic input; step back/forward; browser back; open/close/reopen; validation focus; virtual keyboard; safe areas; server error/retry; duplicate-submit prevention; no-data-loss policy; and truthful demo/live success states. Never submit real lead data during tests.

## Financing, contact and supporting public pages

Financing uses one calculation policy and clear assumptions. The main input and result hierarchy should remain readable without turning every number into a badge. Finance estimates on cards and detail must agree with the same configured terms or explicitly explain a different scenario.

Contact must use configured contact data, a consistent call/email/map treatment and a predictable form. External map/video embeds should not dominate initial loading. About, services, blog, FAQs, reviews and legal pages share reading width, heading rhythm, media treatment and surface roles; they do not need a separate layout system each.

Comparison requires deliberate horizontal behaviour and a readable first column, not simply a huge table forced into the viewport. Accessibility and mobile-specific presentation can justify different composition while sharing compared facts.

**Acceptance:** all retained public routes have one clear title, stable content alignment, meaningful empty/error states and consistent primary/secondary actions. Legal content and dealer claims are supplied/approved content, not generated facts assumed valid by the template.

## Protected mobile invariants

Preserve the newer shared `MobileSheet`, `MobileIconAction`, `MobileMenuAction`, `MobileModeTabs` and `MobileNavigationMenu` behaviour until parity is proven. Keep compact metadata, useful large images, the grey/white surface hierarchy, comfortable existing hit areas and readable mode labels. Do not add duplicate title/count rows. Browser back must dismiss the intended overlay once; focus/scroll must restore; virtual-keyboard and safe-area handling must survive nested steps.

Treat mobile/desktop differences as an explicit contract. The acceptance matrix is maintained in [10](10-testing-and-quality-gates.md); it is not permission to redesign mobile during a desktop cleanup.

## Audit-time browser observations

The clean production-preview sample covered six routes at 1440px and 390px. It confirmed the mobile inventory SSR gap and provided examples of differing desktop form treatments. Sampled desktop header heights were consistently 94px; do not invent a header-height inconsistency from source complexity alone. Mobile import/sell entry surfaces need a semantic main-heading check. See the [verification record](evidence/verification.md) for exact coverage and limits. These samples do not replace the larger matrix above.
