# Template reference — Modern

## Identity and source

- Authoritative master: darkapoparka/cars, main, templates/modern.
- Template key: modern. Position: minimal, inventory-first dealership showroom.
- Stack: Next.js / React / TypeScript, complete pnpm / Turborepo workspace.
- Public Home: /[locale]. Inventory and primary mobile entry: /[locale]/cars.
- Listing detail: /[locale]/listing/[slug]. Legacy /cars negotiates locale.

This is a reusable template master, not a sendable dealer demo. Its source/sample identity is intentionally retained for design fidelity. Every dealer copy requires a complete content, contact, metadata and asset sweep.

## Preserved visual contract

Architectural work must preserve the approved rendered mobile and desktop design. Do not use old audit screenshots or earlier composition notes as redesign instructions.

The current desktop frame caps at 1400 px from 1024 px, retaining 40 px minimum side margins. Shared mastheads have a 352 px minimum height. Home/Cars retain the graphite discovery artwork and the centered 900 px search capsule, with Make/Model/Price fields and the existing four vehicle-type pills. The capsule is 64 px high; fields/search are 48 px and pills 36 px. Discovery cutouts remain desktop-gated and keep their separate artwork span.

Home retains its four supplied preview cars without stock tabs. Shared showroom cards keep their image links, fact badges, separate Save control and quiet arrow in a 36 px grey square. Filters and Sort retain their equal 144 × 44 px controls. View remains in the inventory toolbar with the existing Grid/List and master-preview Quick/Sidebar choices.

Preserve all mobile structure, drawers, navigation, typography, imagery and spacing below 1024 px. Preserve current BG/EN copy and charcoal configuration. Dealer branding and artwork remain configurable; never hardcode a new identity into shared components.

Use [QA](docs/QA.md) for route/interaction checks. Current rendered source and owner-approved design take precedence over historical stage reports. Those reports are evidence of their dates, not instructions to restore earlier layouts.

## Code and content boundaries

[Architecture](docs/architecture.md) describes server/client ownership, browser preferences and public request handling. Primary personalization surfaces remain packages/marketplace/lead-site.ts, packages/marketplace/, apps/web/app/ and apps/web/public/. site-config.ts validates the adapted public site and preserves supported older artwork overrides.

The source-bound desktopPreviewIdentity is only for the static master. Dealer adaptation changes the slug and restores that client's configured identity. Do not assume lead-site.ts is the only identity consumer; inspect routes, content, metadata and assets for inherited dealer material.

Keep static-demo inventory distinct from live public inventory. Forms are demos until delivery is genuinely configured and verified; no simulated success or live enquiries during QA. Keep all workspace packages, runtime pins, lockfiles, licenses and provenance.

## Install and run

Use Node >=22.22.0 <23 and pnpm 11.4.0:

```text
corepack enable
pnpm install --frozen-lockfile
pnpm --filter @repo/database build
pnpm --filter web exec next dev -H 127.0.0.1 -p 6462
```

Set the documented local static-demo environment in [QA](docs/QA.md); do not invent credentials. Use the actual active preview origin for browser checks. A successful local build is not mounted or public-release acceptance.

## Source, dealer and release ownership

[Cars integration](docs/CARS-INTEGRATION.md) owns the canonical source relationship, dealer-copy contract and standalone/mounted limits. Cars selects reviewed immutable releases and owns the current portfolio/hosting decision. Editing master main does not automatically update existing dealers.

Historical split: this template was separated from the Cars working tree on 10 September 2026 and subsequently consolidated back into the Cars master. Legacy source instructions and artwork provenance remain historical; do not resume their old task queues.

## QA artifacts

Keep transient captures and logs in ignored runtime/ or existing Playwright output directories. Intentional visual test baselines remain under specs/*-snapshots. Loose E2E-root screenshots are not fixtures; retired captures remain recoverable from Git history. Keep concise reports rather than appending every implementation stage to this reference.
