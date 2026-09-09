# Теси Кар · Auto Best

Actual independent SvelteKit copy of `templates/auto-best` at `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`, version `2026.09.08-polish-1`. The source components, layouts, routes, styles, package manifest and lockfile are retained. `.template`, inherited `AGENTS.md` and master-only `TEMPLATE.md` are not carried into this client.

## Implementation checkpoint — not review-ready

The rendered brand configuration and inventory provider now consume the local `src/lib/data/dealer-facts.json`: eight specifically sourced Tesi Car cars, EUR prices, kilometres, original source IDs and advertised-unverified availability. No original template stock is used by this provider. The published Cars.bg dealer logo is bundled locally. Stock-photo URLs are currently the exact source URLs; local copies and the remaining content-consumer sweep are still in progress. This is not a completed asset pack or a QA pass.

## Run and validate

Use the Node version required by the retained package manifest. From this directory: `npm ci`, then `npm run dev -- --host 127.0.0.1 --port <free-port>`. Run `npm run validate` for the retained validation suite. The coordinator can use the repository's existing client launcher after integrating the branch; no shared launcher was modified.

Entry `/`; inventory `/listing-grid`; first detail `/listing-detail-v1/1`; supporting routes `/about-us`, `/contact`, `/blog`.

No dependencies have been installed and no build/browser pass is claimed in this checkpoint. `static/robots.txt`, page metadata and the retained preview configuration prohibit indexing. No deployment, dealer contact or private sales records were created.

## Source and rights boundaries

`SOURCE_LICENSE.md` records the original template lineage, not a licence for Tesi Car's photographs. Public sources and the source-vs-confirmed distinction are recorded in `dealer-facts.json`. Dealer/platform reuse approval was not supplied; it is not inferred from public visibility. Do not deploy this concept before the rights and factual review.
