# Bohemcars Tailwind v4 Design System

This is the foundation for replacing the Auxero HTML bridge with Svelte-native desktop
surfaces while keeping the current visual contract intact.

## Source Of Truth

- Runtime CSS variables and helper classes live in `src/lib/styles/bohemcars.css`.
- Tailwind v4 theme mappings live in `src/lib/styles/bohemcars.tailwind.css`.
- Prettier's Tailwind class ordering uses `src/lib/styles/bohemcars.tailwind-entry.css`.
- The root layout imports that token layer before `src/routes/auxero-guards.css`.
- Admin and dashboard styles import the same token layer and map their local variables to it.
- Auxero template CSS is still allowed while routes are being ported, but new Svelte-native code
  should use Bohemcars tokens instead of hard-coded values.

## Tailwind v4 Pattern

Use CSS-first Tailwind v4 configuration:

- Define Tailwind theme variables with `@theme inline` in `bohemcars.tailwind.css`.
- Keep semantic CSS custom properties in `:root`.
- Use `@reference '$lib/styles/bohemcars.tailwind.css'` inside component styles when a Svelte
  component needs Tailwind `@apply` against these custom tokens.
- Do not add a `tailwind.config.js` unless a dependency forces a legacy config path.

## Token Families

- Fonts: `--bc-font-body`, `--bc-font-heading`, `--bc-font-dashboard`.
- Type scale: `--bc-text-h1` through `--bc-text-h7`, `--bc-text-body`,
  `--bc-text-body-lg`, plus matching `--bc-leading-*` values.
- Brand colors: `--bc-accent`, `--bc-accent-hover`, `--bc-accent-soft`,
  `--bc-accent-contrast`, `--bc-accent-bright`, `--bc-accent-bright-soft`,
  `--bc-accent-olive`.
- Surfaces: `--bc-bg`, `--bc-bg-strong`, `--bc-surface`, `--bc-surface-soft`,
  `--bc-surface-hover`, `--bc-surface-raised`.
- Borders and controls: `--bc-border`, `--bc-border-strong`, `--bc-control`,
  `--bc-control-hover`, `--bc-control-active`.
- Vehicle cards: `--bc-card-*`.
- Dashboard: `--bc-dashboard-*`.
- Showcase/proposal pages: `--bc-showcase-*`.
- Layout: `--bc-container-*`, `--bc-page-x`, `--bc-section-*`.
- Radius and shadows: `--bc-radius-*`, `--bc-shadow-*`.
- Motion: `--bc-motion-*`.

## Utility Names

Tailwind utility names generated from the theme layer include examples like:

- `font-bc-body`, `font-bc-heading`, `font-bc-dashboard`
- `bg-bc-bg`, `bg-bc-surface`, `bg-bc-accent`
- `text-bc-ink`, `text-bc-muted`, `text-bc-accent`
- `border-bc-border`
- `rounded-bc-md`
- `shadow-bc-subtle`
- `max-w-bc-page`
- `text-bc-h2`

## Route Porting Rules

1. Preserve Auxero typography, spacing, image ratios, card structures, buttons, and responsive
   behavior until a screenshot proves the Svelte-native route matches.
2. Do not use global `.btn` or `.container` overrides.
3. Use `.bc-*` helper classes or scoped component styles, not broad global selectors.
4. Keep hovers calm: background, border, or color changes only.
5. Keep vehicle actions faithful: `compare-details btn btn-small open-modal` and `view-details`
   stay visually consistent until a product-approved replacement exists.
6. Move data shaping to `src/lib/auxero` or `src/lib/server`; visual components should receive
   shaped data.
7. After editing Svelte files, run `npx @sveltejs/mcp svelte-autofixer <file> --svelte-version 5`.

## First Safe Surfaces

1. `/offer`: legacy `src/routes/layout.css` dependency removed; route now uses scoped base styles
   and Bohemcars showcase/accent tokens.
2. Dashboard shell: already maps cleanly to Bohemcars dashboard tokens.
3. `/inventory` desktop: best proof route for Svelte-native cards, filters, and layout.
4. `/inventory/[slug]` desktop: next proof route once card/listing tokens settle.

See `docs/bohemcars-cleanup-audit.md` for the route-by-route deletion and refactor plan.

## Verification

For each Svelte-native route port:

- Run the Svelte autofixer for touched Svelte files.
- Run `npm run lint`, `npm run check`, unit tests, and build.
- Capture desktop and mobile screenshots for touched routes.
- Compare against the current Auxero-backed route before deleting its template dependency.
