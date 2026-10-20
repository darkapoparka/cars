# Drive24 Showroom

A dealer-first responsive car showroom inspired by the strongest interaction patterns in modern automotive apps, rebuilt with original branding and reusable dealership configuration.

## Stack

- Next.js 16 App Router and React 19
- TypeScript with strict checking
- StyleX 0.19 design system and compiled atomic CSS
- Static generation for inventory and vehicle pages
- PWA manifest for installable web-app behavior
- A domain/data boundary designed for a future Capacitor shell or React Native client

## Routes

- `/` — showroom home and discovery
- `/cars` — searchable inventory and responsive filters
- `/cars/[slug]` — vehicle gallery, pricing, finance, trust and contact
- `/sell` — sell/trade-in lead flow
- `/finance` — finance lead flow
- `/service` — service and test-drive flow
- `/saved` — saved vehicle shortlist
- `/more` — customer activity and dealer services

## Commands

```bash
npm run dev
npm run check
npm run build
npm start
```

The current inventory is fixture-backed. Replace `lib/data.ts` with a typed API adapter without changing the page contracts.