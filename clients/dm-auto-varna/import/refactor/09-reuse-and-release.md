# 09 — Reusable dealer configuration and release qualification

## Ownership to preserve

This repository is the Import master. Cars owns canonical dealer source under `clients/<slug>/`, dealer facts, immutable template selection, packaging and publication. Do not personalize the master for a particular lead or create an automatic update path into existing dealer sites.

Import is an intentional replacement for Modern in Design 2 when that trio is selected. It is not an automatic fourth design. Keep the current dealer manifest’s choice. `main` is a working head, not an approved immutable template release.

## Configuration boundary

Replace scattered dealer literals with one small typed public configuration and approved content sources. The master remains a clearly identified demonstration. A configuration file is useful only if the application actually reads it; a new fact-pack JSON next to hardcoded components does not create reusability.

Suggested public shape, kept deliberately small:

```ts
type SiteConfig = {
	identity: {
		name: string;
		canonicalOrigin: string;
		logo: { src: string; alt: string; width: number; height: number };
	};
	locale: { default: 'bg' | 'en'; supported: Array<'bg' | 'en'>; currency: string };
	contact: { phoneLabel: string; phoneHref: string; email?: string; address?: string };
	navigation: Array<{ labelKey: string; href: string }>;
	presentation: { themeId: string; showFinanceEstimates: boolean };
};
```

This is a starting model, not a requirement to replace every existing type. Keep private mode/provider/auth/storage configuration in server-only code. Public navigation flags never authorize a server operation. Validate imported configuration at the boundary, restrict URL schemes/asset choices appropriately and fail with an actionable error for missing required live facts.

Separate content collections such as FAQs, policies, blog posts and services from structural configuration. Do not create a JSON layout-builder system with arbitrary component names, CSS values or embedded executable HTML. Most dealer differences should be facts, assets, content and a small theme input set.

## Theming without a multi-tenant platform

For independent dealer copies, a selected theme/configuration at build time is sufficient initially. A runtime multi-tenant resolver, theme registry service or package-publishing pipeline is not justified by the current requirement. Maintain a small stable token API and a provenance/version record so template changes can be deliberately promoted later.

Changing a dealer’s name, logo, accent and contact information should not require editing shared Svelte components. Changing the fundamental layout of a page is a product/design task, not something hidden inside dozens of dealer configuration switches.

## Two-brand qualification

Use two fictional fixtures with `.invalid` domains and no real delivery recipients. Brand A resembles the current sample density and short labels. Brand B has a longer name, differently proportioned logo, different accent/contrast values, different contact length, altered optional services and long Bulgarian/English content.

For both, inspect home, inventory, detail, import/sell and contact at mobile and desktop widths. Assert configuration values in visible text, page head, sitemap, API-safe messages, structured data and fallback/error states. Check portal theme inheritance, logo sizing, long navigation, finance visibility and absent optional content.

Search rendered output and source for unintended sample identity. Use an allowlist for intentional fixture/provenance strings instead of a global blind replacement. Preserve source licence and asset provenance. Do not copy `.env`, `.git`, dependencies, deployment bindings, generated caches or local CMS records into a dealer copy.

## Promotion checklist

Record the immutable source revision, selected dependencies/runtime, completed phases, remaining accepted limitations and source-shape compatibility. Run the standalone matrix, then execute the separate Cars packaging/mounted matrix. Verify asset URLs, service routes, locale/raw links, requests, redirects and switcher behaviour at `/variant-2/` through the actual packaging layer.

Compare any Cars-only fixes before replacing a snapshot. Existing dealer configurations may have intentional customizations; do not overwrite them through a template cleanup. Publication, real delivery and provider setup require their own authorization and verification.

A release is qualified when the second-brand test requires only approved configuration/content/assets, shared components remain unchanged, and both standalone and mounted environments have evidence. This audit alone does not approve or perform that release.
