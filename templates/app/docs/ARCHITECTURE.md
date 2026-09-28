# Architecture

## Product boundary

This repository is a single-dealer showroom, not a multi-seller marketplace. Dealer identity, inventory, services, finance offers and lead routing belong to one configured client.

## Rendering

Public inventory and vehicle routes are server-rendered and statically generated where possible. Interactive search, favourites, filters and sheets are isolated client components. This preserves SEO and browser performance while keeping app-like navigation.

## Styling

StyleX owns component styling and semantic tokens. Avoid introducing Tailwind or a second styling system. Brand overrides should be expressed through token themes rather than copied component trees.

## Future native delivery

Capacitor can wrap a static or hosted version of this web app. A later React Native app should reuse domain types, schemas, API clients, localization catalogs, analytics events and tokens—not DOM components. Keep browser APIs behind adapters so this boundary remains clean.

## Data model

`lib/data.ts` currently supplies fixtures. The production adapter should expose the same `Vehicle` contract and add dealership configuration, availability, lead submission, saved searches and account state.