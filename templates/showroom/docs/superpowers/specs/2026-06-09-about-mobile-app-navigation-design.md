# About mobile app navigation

Date: 2026-06-09
Status: Approved (design), pending implementation plan
Scope target: mobile `/about` only, with desktop Auxero page preserved

## Goal

Make the About page feel like the existing Bohemcars mobile app surfaces instead of a desktop
website stacked into one long page. The mobile page should expose the useful actions immediately:
call, location, search, team, contact, brands, and services. Desktop keeps the current Auxero-derived
layout and section order.

## Chosen Approach

Use a route-scoped mobile About layer:

- Add a mobile-only contextual header at the top of `/about`.
- Add quick pills for the About sections.
- Use bottom drawers for contact/location actions.
- Use section anchors for content discovery instead of filtering.
- Keep all styling local to About components and preserve Auxero global button/container behavior.

This matches the existing Bohemcars mobile patterns in home, inventory, import, sell-your-car, and
the global mobile bottom nav. It avoids turning informational content into fake filters.

## Mobile Structure

The mobile page order should be:

1. Contextual header
2. Search/action row
3. Quick section pills
4. Current Auxero page banner
5. Team
6. Brands
7. Services
8. Location/contact

The current desktop order and components remain intact for tablet/desktop unless a mobile-only class
needs an anchor target.

## Contextual Header

Mobile header content:

- Left: Bohemcars logo from `bohemcarsAssets.logoLight` or the existing light logo asset.
- Right: two compact icon buttons:
  - Phone button, using `about.contact.primaryPhoneHref`.
  - Location button, opening the location/contact drawer.

Visual style:

- App-like but calm: white or soft surface, subtle border, 8px-radius where needed.
- No lift, glow, scale, or decorative motion.
- Use lucide icons for phone and location if the component uses icon imports.
- Keep tap targets at least 44px.

## Search Row

Add a mobile search/action row below the header:

- Label: `Търси автомобил, марка...`
- Primary behavior: link to `/inventory`.
- The row should look like the existing inventory mobile search field: soft fill, compact height,
  search icon, no heavy border.

## Quick Pills

Pills:

- `Екип`
- `Локация`
- `Контакти`
- `Марки`
- `Услуги`

Behavior:

- `Екип`, `Марки`, and `Услуги` scroll to their section anchors.
- `Локация` opens the location/contact drawer.
- `Контакти` opens the location/contact drawer.

Visual style:

- Use the same calm fill-style pattern as home mobile quick links and Auxero `car-box` /
  `menu-tab-style2` pills.
- Hover/focus/active states use soft grey/green fill.
- No underline-heavy tabs, scale, shadows, or custom border-only buttons.
- Horizontal scroll is acceptable; it should hide scrollbars and use stable dimensions.

## Drawer

Add a mobile bottom drawer for contact/location:

- Header: `Bohemcars` and `Контакти и локация`
- Content:
  - Address from `about.office.address`
  - Primary phone and secondary phone if distinct
  - Email
  - Hours and appointment note
  - Actions: call, email, open map
- The drawer does not embed the map iframe. `Отвори карта` launches the existing Google Maps URL.

Implementation can use `vaul-svelte` because inventory and detail mobile already use it.

## Component Boundaries

Preferred implementation:

- Add `src/lib/components/about/AboutMobileSurface.svelte` for the mobile header, pills, search row,
  and drawer.
- Keep data shaping in `src/lib/auxero/about.ts` if new labels/links are needed.
- Update `AboutContent.svelte` to render the mobile surface and add anchor ids to existing sections.
- Keep `AboutConsultantsSection`, `AboutBrandsSection`, `AboutIntroSection`, and
  `AboutLocationSection` visually faithful; only add minimal anchor/class hooks if needed.

Do not add global `.btn` or `.container` overrides.

## Accessibility

- Use real links for phone, email, inventory, and map actions.
- Use buttons only for opening drawers.
- Add `aria-controls` and `aria-expanded` for drawer triggers.
- Drawer needs a title, description, close control, backdrop, and Escape/backdrop close from the
  chosen drawer library.
- Section pills should be readable by screen readers and have stable labels.
- Do not trap users in the page; bottom nav remains available.

## Responsive Rules

- Mobile surface displays under `max-width: 767.98px`.
- Desktop/tablet current About page remains visible and unchanged.
- The mobile surface should account for the global mobile bottom nav and safe-area inset.
- Text must fit in controls at 360px wide without overlap.

## Out Of Scope

- Reordering or redesigning desktop About.
- Rebuilding consultant, brand, service, or vehicle cards.
- New global navigation patterns.
- Product-specific animations beyond existing Auxero or drawer behavior.
- Full inventory search filtering inside About.

## Verification

After implementation:

- Run `npx @sveltejs/mcp svelte-autofixer` on edited Svelte files.
- Run `npm run lint`.
- Run `npm run check`.
- Run focused unit tests if touched data shaping changes.
- Run build.
- Verify `/about` on mobile width, including:
  - header logo/call/location
  - search row
  - each quick pill behavior
  - contact/location drawer open and close
  - no text overlap at narrow mobile widths
  - desktop About still matches the existing Auxero page
- Use Browser screenshots for touched mobile and desktop states when available.
