# Теси Кар · Carwow

Actual independent SvelteKit copy of `templates/carwow` at `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`, version `2026.09.08-repair-1`. The original routes, component tree, layouts, styles, scripts, manifest and lockfile are retained, excluding inherited root agent and master-instance instructions.

## Implementation checkpoint — not review-ready

The site's actual configuration, current-listing data and vehicle provider consume the same local eight-record source facts as the other two variants. Source IDs, models, EUR prices, kilometres, equipment and galleries are explicit—not inferred from manufacturer names. Availability is unverified, not labelled available. Published dealer branding is bundled. Invented sample reviews are removed. Stock photography still uses exact original source URLs while local asset transfer and the remaining component/page sweep are in progress.

## Run and validate

Use the Node version required by the retained package manifest (the session baseline calls for Node 24), then `npm ci`, `npm run check`, `npm run build`. The coordinator should use the existing repository launcher or a direct Vite command with a free port; the inherited development wrapper's hard-coded port must not collide with another app. No shared launcher was modified.

Entry `/`; `/inventory`; first detail `/inventory/mitsubishi-asx-2015-917784`; `/contact`; `/sell-your-car`; `/financing`. No deployment or dealer contact has occurred. Robots and HTML metadata mark the copy noindex.

## Checks actually performed

The replacement vehicle module was transpiled with TypeScript in the independent Linux container and evaluated against the eight source records. Ten assertions passed for distinct slugs, explicit model/reference/price mapping, featured selection, two-image source galleries, used condition, unverified availability, no invented BGN conversion and absence of placeholders. These are source-provider checks, not `svelte-check`, a full app build or a browser/viewport check; none of those has run.

Source template licensing is not dealer-image permission. Exact source URLs and the unverified reuse/availability boundaries are recorded in `dealer-facts.json`. Do not deploy before factual and media review.
