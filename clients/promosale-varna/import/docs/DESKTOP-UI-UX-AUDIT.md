# Desktop UI/UX Audit and 10/10 Improvement Plan

**Project:** Day Night Auto / `cars-template-import`  
**Audit date:** 2026-09-11  
**Baseline:** `http://127.0.0.1:5175/`  
**Primary audit viewport:** 1440 × 1000  
**Target:** a consistent, production-grade desktop experience with reusable code and no page-by-page visual drift.

## Executive summary

The desktop frontend is already significantly stronger than the source template. The remaining gap is not a need for another redesign; it is a **systemization problem**.

Current desktop quality is approximately **7.5–8/10**. The main blockers to a true 10/10 are:

1. Multiple public-page design systems are still visible.
2. Desktop container widths, gutters and vertical rhythm vary by route.
3. PDP content is coupled to the height of the right sidebar, creating major dead space.
4. Inventory is too dense at 1440px.
5. Several secondary routes under-use desktop space or have inconsistent page hierarchy.
6. Active components still contain too many arbitrary pixels, literal colors and route-specific overrides.

The direction is correct: premium automotive, restrained, cool gray / white / black, deep red accents, strong imagery, simple hierarchy. We should **preserve that direction and make it consistent everywhere**.

## Audit scope

The desktop pass covered the principal public and conversion routes:

- `/`
- `/inventory`
- `/inventory/[slug]` using a live vehicle PDP
- `/services`
- `/about`
- `/contact`
- `/sell-your-car`
- `/import`
- `/calculator`
- `/financing`
- `/agents`
- `/reviews`
- `/faqs`
- `/blog`
- `/compare`
- `/account` landing/dashboard

The pass also inspected the shared style/token layer and representative route/component code. Browser route checks did not reveal runtime console errors during the audit.

Not yet fully audited in this document: every nested account route, every blog/agent detail page, all admin screens, and every mega-menu interaction state. Those should receive their own follow-up QA after the public system is unified.

## Non-negotiable design-system rules

All desktop improvements should follow these rules instead of adding more one-off CSS:

- One public site header.
- One public site footer.
- One desktop container/grid system.
- One typography scale.
- One spacing scale.
- One button hierarchy.
- One form-control system.
- One card/panel radius system.
- One semantic color system.
- Route components compose shared primitives; they do not invent new fundamentals.
- Red is a brand/action color, not a default border or decoration color everywhere.
- Cool neutral surfaces stay consistent across inventory, forms, cards and secondary pages.
- Avoid oversized UI. Desktop should feel premium and controlled, not inflated.
- No hardcoded route-specific values when an existing or new token can express the same rule.
- Prefer structural fixes over visual patches.

## Desktop layout baseline

Standardize the public desktop shell around:

- **Content max width:** 1320px
- **1440px viewport gutter:** 32px
- **Standard section vertical spacing:** 72–88px
- **Dense section spacing:** 48px
- **Grid/card gap:** 24px
- **Common internal gaps:** 8 / 12 / 16 / 24 / 32px
- **Standard card/form padding:** 24px
- **Large panel padding:** 32px
- **Primary control height:** 48px
- **Secondary control height:** 40–44px

## Typography baseline

Keep Sofia Sans / Sofia Sans SemiCondensed as the public brand system. Remove route-specific font families such as the separate Manrope load on Reviews.

Recommended desktop hierarchy:

- H1: 48–56px depending on hero context
- H2: 32–36px
- H3: 24px
- Card title: 18px
- Body: 16px
- Compact UI: 14px
- Meta: 12–13px

Headings should use the same weight, tracking and line-height rules across routes. Special display treatment belongs only to true hero/display contexts.

## Semantic color baseline

```text
Ink             #17191C
Surface          #FFFFFF
Surface subtle   #F5F7F9
Border           #D8DDE3
Muted            #626D7C
Brand red        #B9161C
Brand red hover  #8F1016
```

Success, warning and danger colors should only communicate semantic states. Inputs should not be red in their resting state. Secondary actions should generally remain black, white or neutral so primary CTAs retain hierarchy.

## P0 — system fixes

### 1. Unify the public shell

`/reviews` and `/faqs` currently expose a visibly different header/footer family from Home, Inventory, About, Blog, Contact and PDP. The alternate clean shell includes different footer composition, newsletter treatment, spacing and subtle header differences.

**Required change:** migrate every public route to one shared public shell with the same `SiteHeader`, `SiteFooter`, container geometry and responsive behavior.

### 2. Unify horizontal geometry

The current implementation mixes a global 1440px container / 15px page inset, Home-specific 1320px / 32px geometry, `px-4` clean routes and route-level arbitrary max widths.

**Required change:** introduce one desktop container primitive and use it everywhere. Route-specific widths should only exist for intentionally narrow content such as FAQ accordions or legal copy.

### 3. Repair PDP column flow

The PDP has the strongest visible desktop defect: after financing/location, the left column contains a large dead area before customer reviews because the content grid is coupled to the taller inquiry sidebar.

**Required structure:**

```text
MAIN                        SIDEBAR (360–380px)
Gallery                     Purchase card
Overview                    Specs
Finance                     Agent
Location                    Inquiry form
Reviews
```

The columns must be independent stacks. The right rail should become sticky below the site header. Reviews should follow Location immediately, without waiting for sidebar height.

### 4. Standardize shared primitives

Create/normalize reusable primitives before route polish:

```text
tokens.css
  color / typography / spacing / radius / controls / containers / elevation / motion

primitives/
  Container / Section / SectionHeader
  Button / IconButton
  Input / Select / Textarea / FormField
  Chip / Badge / Card / Panel

commerce/
  VehicleCard / VehiclePrice / VehicleSpecs
  VehicleGallery / FinanceSummary

layout/
  SiteHeader / MegaMenu / SiteFooter / RouteHero
```

The goal is not abstraction for its own sake. The goal is to remove visible styling drift and make future changes propagate predictably.

## P1 — route composition fixes

### Inventory

At 1440px, five cards per row are too dense. Titles, metadata, financing and CTA hierarchy become compressed.

- Use 4 columns at 1440px with 24px gaps.
- Reserve 5 columns for materially wider screens.
- Standardize media ratio, title region, metadata region and card footer heights.
- Keep the current filter/search hierarchy; the card density is the main issue.
- Avoid a visually stranded partial final row where possible through responsive grid sizing/pagination behavior.

### Agents

The three consultant cards occupy only the left side of the available desktop canvas, leaving an obvious unused fourth-column area.

- Center the 3-card composition in a 1080–1140px max-width grid, or span the full page grid intentionally.
- Normalize card interaction treatment so controls do not appear inconsistently on only one card.
- Keep image crops, title positions and card heights consistent.

### Import

The structure is correct but too sparse on desktop. Three small process cards float beside a relatively large form with excessive surrounding white space.

- Use a balanced 5/7 or similar two-column composition.
- Tighten the main section's vertical padding and inter-column gap.
- Make process and request form feel like one task flow.
- Prefer a compact proof/trust row over adding another oversized content section.

### Calculator

- Bring the page onto the same 1320px container geometry as the other public routes.
- Tighten the space between calculator, budget browsing and FAQ sections.
- Use neutral resting input borders; red only for focus, validation or selected state.
- Normalize budget cards to the shared card/spacing system.

### Financing

- Reduce excess vertical dead space between the hero, process/calculator area and footer.
- Align form fields and panel spacing with the shared form system.
- Preserve the simple two-column composition; no redesign is needed.

### Blog

The page title starts too close to the top/left edge compared with the article grid, producing a clear hierarchy/container mismatch.

- Put the page heading and article grid inside the same desktop container.
- Give the heading block approximately 56–64px top spacing.
- Use the shared section-heading primitive for category/index pages.

### Reviews

The content grid is sound; the route identity is not.

- Move the route to the common public shell.
- Remove the route-specific Manrope load and use the shared Sofia system.
- Reconsider green rating blocks: use them only if they intentionally represent an external review provider. Otherwise align ratings with the site's established brand/neutral language.
- Match card radius, padding and muted text to the shared card system.

### FAQ

- Move the route to the common public shell.
- Keep the intentionally narrow accordion measure.
- Align the page title and accordion under one container hierarchy.
- Normalize accordion borders, open state and section spacing against shared tokens.

### Compare

The comparison screen is already strong.

- Add a sticky vehicle identity/header row for long comparison tables.
- Consider freezing the first attribute column at narrower desktop widths.
- Keep the current information density and hero direction.

## Strong routes: preserve, then normalize

### Home

Home is one of the strongest pages and should not be redesigned again.

- Keep the current hero/search direction and content ordering.
- Make the H1/search module slightly more dominant without making it larger than necessary.
- Reduce competition from repeated small outline `Виж всички` controls.
- Normalize section gaps and section-header actions.
- Give brand/body-type tiles slightly more breathing room.
- Make YouTube, reviews and editorial sections inherit the same `SectionHeader` primitive.

### Services

The 3×2 service-card composition works well.

- Tighten the excess gap between service cards and the request/contact block.
- Improve title/body contrast inside service cards.
- Normalize card padding/radius/button placement with shared primitives.

### About

The overall progression is coherent: consultants → YouTube → brands → services → location.

- Keep the composition.
- Ensure the location/map area clearly reads as an intentional map/interaction rather than unloaded content.
- Normalize section widths and heading rhythm with the system.

### Contact

Contact is one of the best secondary pages and should be used as a reference for desktop form proportions. Preserve its two-column composition and migrate only the surrounding geometry/primitives as needed.

### Sell Your Car

The desktop route is already clear and usable.

- Keep the hero/process/form composition.
- Reduce unnecessary empty vertical space before the footer.
- Do not add filler content merely to make the page longer.
- Align the form controls and process cards to the shared desktop tokens.

### PDP polish after the structural fix

Once the independent two-column flow is fixed:

- Reduce the visual weight of the gray title wrapper.
- Increase hierarchy between price, monthly payment and the primary CTA.
- Make sidebar panels feel like one coherent conversion rail rather than unrelated boxes.
- Use a consistent sticky offset beneath the site header.
- Preserve the large gallery and thumbnail access; it is appropriate for the product.
- Keep finance tools close to the vehicle overview rather than pushing them deep down-page.

## Header and navigation

The desktop header is visually solid, but it must become the single source of truth.

- One logo size and header height across all public routes.
- One active-link underline treatment.
- One utility-icon size and spacing system.
- One mega-menu implementation and alignment grid.
- One sticky/non-sticky behavior decision across routes.
- Ensure hover menus cannot be obstructed by header layers and that their hit areas are robust.

The navigation should feel calm: primary route labels first, utilities second. Avoid making every icon/action equally prominent.

## Code-quality findings

The token layer is a good foundation, but active route components still bypass it too often with arbitrary pixel values, literal colors and local style blocks. The highest-density areas observed include Inventory, Compare, PDP and parts of the Home/Header family.

There are also parallel implementations of public chrome (`CleanSiteHeader/CleanSiteFooter` versus the primary public shell). Those duplicates are a direct source of visible drift and should be removed or reduced to thin wrappers around one implementation.

### Refactor rules

- Prefer token values over literal colors.
- Prefer spacing/radius/control tokens over arbitrary Tailwind values.
- Prefer shared layout primitives over per-route max-width/padding rules.
- Avoid route-level Google Font imports.
- Avoid CSS selectors that depend on legacy template body classes when a component-level API can express the same intent.
- Remove obsolete compatibility CSS as routes migrate to the shared system.
- Do not create a second component when a variant/slot of the shared component is sufficient.
- Keep mobile and desktop behavior explicit, but share visual tokens and data models.

## Implementation sequence

### Phase 0 — foundation

1. Lock desktop container/grid tokens.
2. Lock typography and semantic color tokens.
3. Create/normalize `Container`, `Section`, `SectionHeader`, buttons, controls and card primitives.
4. Consolidate the public header/footer into one shell.
5. Migrate Reviews and FAQ to that shell.

### Phase 1 — high-value route fixes

1. Repair PDP independent column flow and sticky conversion rail.
2. Change Inventory to the correct desktop card density.
3. Center/recompose Agents.
4. Tighten Import, Calculator and Financing.
5. Align Blog heading/container geometry.

### Phase 2 — system cleanup

1. Replace active arbitrary colors/sizes with semantic tokens.
2. Normalize section headings, buttons, cards and forms.
3. Remove duplicate public chrome and obsolete route-specific overrides.
4. Normalize hover, focus, active and reduced-motion behavior.
5. Verify empty/loading/error/success states.

### Phase 3 — final desktop QA

Perform visual and interaction QA at:

- 1280px
- 1440px
- 1536px
- 1920px

Also verify long Bulgarian strings, filter states, comparison with fewer vehicles, form validation/success, gallery controls, sticky sidebars, mega menus and keyboard focus.

## Definition of done

Desktop is 10/10 only when navigating between routes no longer reveals a change in design system. Header, footer, containers, typography, colors, controls and spacing must feel authored by one system.

A route is complete only when:

- Its outer grid aligns with the shared desktop container.
- Section spacing follows the shared rhythm.
- Typography uses the shared scale and brand fonts.
- Cards and controls use shared tokens/primitives.
- No resting field looks like an error state.
- Primary and secondary actions are visually distinct.
- There is no accidental dead space caused by grid coupling.
- No component is oversized relative to the rest of the product.
- Hover/focus/active behavior is consistent and accessible.
- The route works at all target desktop widths without awkward partial layouts.
- No new arbitrary styling is introduced to solve a local visual problem.

## Working principle for the improvement pass

**Do not redesign again. Systematize.**

The brand direction is already good. The fastest path to 10/10 is a unified 1320px desktop grid, one public shell, disciplined tokens and targeted composition fixes on PDP, Inventory, Agents, Import, Blog, Calculator and Financing.
