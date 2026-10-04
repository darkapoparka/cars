# Template reference — Modern

## Identity
- Repository: `darkapoparka/cars` · authoritative master: `templates/modern`
- Key: `modern`
- Portfolio role: **core**
- Design position: premium minimal / inventory-first showroom
- Stack: Next.js monorepo + pnpm/Turborepo
- Desktop discovery: `/`
- Inventory browsing and primary mobile entry: `/cars`
- Suggested standalone review port: `6462`

This is a **template master**, not a sendable dealer demo. The baseline intentionally preserves source/sample material for design fidelity; every lead copy requires a complete identity and content sweep.

The current desktop Home uses the finalized Boxcar Home 10 direction through native Next.js/React components: a contained 1320 px frame, compact photographic hero, white search bar and stock immediately below. Existing mobile presentation is preserved below 1024 px. [Final implementation and QA](docs/HOME10-DESKTOP-FINAL-2026-10-03.md) records the current geometry, screenshots and checks.

Desktop Cars carries Home's configured photograph and frame into a shorter inventory hero, with the existing filters, sorting and Grid/List controls in a contained results panel below. Showroom cards share compact fact badges, a steady neutral border and an inline Details action across Home, inventory and related stock. Hero image preloading is owned by `DealerDesktopHero` and limited to desktop; inventory and related image sizing follow their layout owners. [Browse polish and verification](docs/DESKTOP-BROWSE-POLISH-2026-10-03.md) records this local revision and before/after evidence.

Desktop inventory uses one shared frame below the hero. Count, Quick/Sidebar selection, sorting and Grid/List share its top row; Quick adds rounded neutral filter buttons and a wider vehicle grid. Each button opens the relevant section of one full filter dialog, with every supported filter available in its side navigation. Make/Model uses searchable options and moving Make/Model/available Body style segments within that dialog. One controlled draft preserves choices across sections; Show results applies it, while dismissal discards edits. The Quick/Sidebar switch restores the white sidebar without changing applied filters, sorting or Grid/List selection; an unsubmitted sidebar draft stays mounted while switching. The optional `desktopInventoryFilterLayout` in `lead-site.ts` selects `"quick"` or `"sidebar"` for a dealer. A versioned dealer-scoped cookie remembers the visitor's selection and seeds server rendering on reload. Both layouts reuse the existing filter options and URL search state. [Inventory options verification](docs/DESKTOP-INVENTORY-OPTIONS-2026-10-04.md) records the current design; [the earlier search](docs/DESKTOP-INVENTORY-SEARCH-2026-10-04.md) and [layout evidence](docs/DESKTOP-INVENTORY-LAYOUTS-2026-10-04.md) are retained as history.

Desktop About and Contact use the same configured photograph and 1320 px frame through the shared hero's `appearance="photo"` option. Their gallery and map start 40 px below the masthead. About uses four equal 3:2 photo tiles and four illustrated cards with generated blue 3D artwork. Its closing CTA uses the configured brand color with white copy, white buttons and dark button text. Contact retains its existing local-preview form behavior. [Masthead verification](docs/DESKTOP-ABOUT-CONTACT-POLISH-2026-10-04.md), [About gallery/artwork verification](docs/DESKTOP-ABOUT-GALLERY-2026-10-04.md) and [CTA verification](docs/DESKTOP-ABOUT-CTA-2026-10-04.md) record the desktop reviews and matched mobile captures.

Modern uses Tailwind CSS v4 for its shared styling system, with CSS Modules and shared tokens for desktop composition. The [desktop Next.js code review](docs/DESKTOP-NEXT-CODE-REVIEW-2026-10-03.md) records the current framework versions, component and image-loading improvements, and mobile preservation evidence.

The desktop master uses a Modern wordmark through the optional `desktopPreviewIdentity` in `lead-site.ts`. Its `sourceSlug` guard applies only to this static master; Cars client adaptation changes the dealer slug and automatically restores that client's configured logo, inverse logo and identity. Existing mobile identity and composition remain unchanged. [Reusable configuration](docs/SITE-CONFIGURATION.md) documents the artwork and shortlist boundaries.

## Install and run
```text
corepack enable && pnpm install --frozen-lockfile && pnpm --filter @repo/database build
pnpm --filter web exec next dev -H 127.0.0.1 -p 6462
```

## Primary personalization surface
- `packages/marketplace/lead-site.ts`
- `packages/marketplace/`
- `apps/web/public/`
- `apps/web/app/`

Do not assume these are the only identity consumers. Search every retained route, data module, metadata definition and static asset before declaring a skin complete.

## Representative QA routes
- `/cars`
- `/bg/cars`
- `/bg/listing/bmw-x5-m50d-sofia-2020`
- `/bg/contact`
- `/bg/imports`
- `/bg/sell`
- `/bg/lease`

## Required checks
- `pnpm --filter web typecheck`
- `pnpm --filter web build  # with the documented preview environment`

## Current constraints
Keep the whole monorepo. Static demo mode provides preview inventory; provider services are not automatically configured. Do not split packages or simplify the runtime during a lead skin.

Local static-demo review requires the environment in docs/QA.md. Provider services remain unconfigured unless explicitly wired.

## Source lineage
Split on 2026-09-10 from the live working tree at `J:/cars/templates/modern`. The split deliberately captured local working-tree changes, including changes newer than the `cars` repository HEAD. Historical root instructions were archived under `docs/legacy/from-cars-2026-09-10/`; use them only for provenance, never as current operating instructions.

## Portfolio policy
Cars owns portfolio choices: standard Auto Best / Modern / Carwow, or Auto Best / Import / Carwow. See [Cars integration](docs/CARS-INTEGRATION.md).

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](docs/CARS-INTEGRATION.md).
