# Template reference — Import

## Identity

- Repository: `darkapoparka/cars`, source at `templates/import`
- Key: `import`
- Role: reusable dealer design in the selected five-design portfolio
- Design position: import/sourcing specialist for dealers that actively sell the import journey
- Stack: Svelte 5 + SvelteKit + Vite 8 + Tailwind CSS v4; explicit Vercel adapter
- Runtime: Node 24 (see .node-version), npm lockfile
- Primary entry: `/`
- Suggested standalone review port: `6790`

This is a **template master**, not a sendable dealer demo. The baseline intentionally preserves source/sample material for design fidelity; every lead copy requires a complete identity and content sweep.

## Install and run

```text
npm ci
npm run dev -- --host 127.0.0.1 --port 6790 --strictPort
```

## Primary personalization surface

Shared customer typography follows [Typography](docs/TYPOGRAPHY.md).

The accepted About styling, automotive reference boundaries and next full desktop audit are documented in [Desktop styling](docs/DESKTOP-STYLING.md), with a [copyable new-session prompt](docs/DESKTOP-POLISH-PROMPT.md).

- `src/lib/config/dealer.ts` and validated `src/lib/config/site.ts`
- `src/lib/content/`
- `src/lib/data/daynight.ts` (compatibility/content facade)
- `src/lib/data/daynight-listings.json`
- `src/lib/data/vehicles.ts`
- `src/lib/styles/`
- `static/assets/daynight/`
- `static/`

Do not assume these are the only identity consumers. Search every retained route, data module, metadata definition and static asset before declaring a skin complete.

### Dealer logos: replace the configuration, preserve the banners

`import` is the internal template family ID, not the dealer's trading name or release version. The master displays a generated **IMPORT** placeholder. Every dealer proposal must replace it with that lead's permitted, recognizable logo, following [Lead build guardrails](../../docs/LEAD-BUILD-GUARDRAILS.md). Keep the family ID and the legacy `daynightBrand` / `daynightAssets` export names for publisher compatibility.

Save the lead's transparent PNG/WebP inside the copied application's `static/brand/`, then set its actual public paths in `src/lib/config/dealer.ts`:

```ts
export const daynightAssets = {
	// Treatment readable on dark backgrounds.
	logoDark: '/brand/lead-logo-on-dark.webp',
	// Treatment readable on light backgrounds.
	logoLight: '/brand/lead-logo.webp'
	// Keep the other asset fields.
};
```

Use the same path for both when one logo works on both surfaces. The filename and format can vary; use the real extension. Update `daynightBrand` to the lead's identity and `site.identity.favicon` in `src/lib/config/site.ts` to its browser icon. These paths are URLs relative to `static/`, not filesystem paths.

`site.identity.logo` maps to the light-background treatment; `site.identity.logoOnDark` maps to the dark-background treatment. The desktop header, mobile app bar, navigation menu, footer, vehicle dealer banner and Home Sell/Finance banners consume this configuration. Banner artwork remains separate from the logo overlay: do not bake the dealer logo into it or replace strings in individual components. The existing Import refresh adapter fills `logoDark` / `logoLight` from the dealer profile; still verify the rendered result and replace the favicon.

Before a dealer build is complete, inspect light and dark surfaces, the compact 112 × 32 desktop banner slot, mobile headers/menu at 320/390 px, the footer and a real vehicle detail page. Confirm the logo loads without clipping, stretching or excess transparent padding, and search reachable dealer identity/metadata for the `IMPORT` placeholder, `import.demo` and inherited sample branding. No template placeholder may remain in the delivered dealer identity. Record the exact source release in lineage metadata rather than adding a version number to the logo artwork.

## Representative QA routes

- `/`
- `/inventory`
- `/contact`
- `/sell-your-car`
- `/financing`
- `/import`

## Required checks

- `npm run verify`
- `npm run build`
- `npm run test:e2e`

## Inquiry persistence

Optional Neon-backed inquiry storage and private template admin access are documented in [Inquiry database](docs/INQUIRY-DATABASE.md). Preview mode stays synthetic even when credentials are present. Live persistence must be explicitly enabled. Saving is separate from notification delivery.

## Current constraints

Use the approved immutable Import source release selected by Cars. Local template polish does not promote that release or update existing dealer copies.

## Source lineage

Split on 2026-09-10 from the live working tree at `J:/cars/templates/import`. The split deliberately captured local working-tree changes, including changes newer than the `cars` repository HEAD. Historical root instructions were archived under `docs/legacy/from-cars-2026-09-10/`; use them only for provenance, never as current operating instructions.

## Portfolio policy

Cars owns portfolio choices: Auto Best, Modern, Import, App and Mobile. The [hosting and release decision](../../docs/HOSTING-AND-RELEASE-DECISION-2026-10-04.md) and [template promotion contract](../../docs/TEMPLATE-PROMOTION.md) own the current release boundaries.

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](docs/CARS-INTEGRATION.md).

Current source boundaries and retained legacy limits: [Architecture](docs/ARCHITECTURE.md).
