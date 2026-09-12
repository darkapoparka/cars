# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web.

## Product

Day & Night Auto Group is a Bulgarian automotive inventory and direct-enquiry Sales Demo. It gives prospective buyers a fast path from discovery to a vehicle detail, phone call, viewing request, import enquiry, or leasing conversation.

## Architecture

The product is a native SvelteKit application. Server-rendered routes own their markup and URL state; typed modules own identity, inventory, company, and editorial data; reusable Svelte components own interaction and presentation. There is no mirrored HTML renderer, legacy Next.js client bundle, DOM-composition layer, or template route fallback.

## Public route surface

- Homepage and inventory discovery.
- URL-driven listing filters and sorting.
- Eight typed vehicle-detail routes.
- About, Contact, Blog, and nine typed article-detail routes.
- A small documented redirect set for former public aliases.

Unsupported dealer dashboards, accounts, listing submission, comparison, pricing, staff, and template-variant pages intentionally return 404.

## Truthful constraints

- Inventory is representative demo data, not a live stock feed.
- Vehicle availability, specifications, price, and financing terms must be confirmed with the business.
- Contact uses verified direct actions; there is no fake form submission or account backend.
- Team and partner content remains visibly identified as temporary demo presentation data until the owner supplies verified replacements.
- No review, testimonial, author, date, finance guarantee, or operational claim may be invented.

## Reuse boundary

This is a branded lead project, not a reusable template. Its clean component/data/config boundaries can inform a separately authorized Agency OS template promotion. See `REUSE_GUIDE.md` and `SOURCE_LICENSE.md`.

## Release standard

An eligible release must pass architecture, type, production-build, runtime-asset, redirect/404, and browser interaction checks; match the approved desktop visual contract; preserve representative mobile behavior; and be deployed from the exact pushed `main` SHA.
