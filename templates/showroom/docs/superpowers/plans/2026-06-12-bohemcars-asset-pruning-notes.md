# Bohemcars Asset Pruning Notes

Date: 2026-06-12

## Current Guardrail

`src/lib/server/asset-manifest.spec.ts` now renders representative Auxero pages and verifies that every local `/assets/...` reference exists under `static/`. This is the safety net for future asset deletion: prune only after the manifest and browser screenshots prove the rendered routes no longer depend on a file.

The same manifest spec also checks that rendered routes do not ship blocked or unused Auxero script tails. Keep that test updated before pruning additional template JavaScript.

## Largest Local Assets

The largest local files are mostly Bohemcars-generated PNGs with much smaller WebP siblings:

| Asset                                                             |       PNG |     WebP |
| ----------------------------------------------------------------- | --------: | -------: |
| `static/assets/bohemcars/footer-canada-request-v2`                | 1986.6 KB | 105.8 KB |
| `static/assets/bohemcars/blog/import-check-cover`                 | 1936.7 KB |  92.2 KB |
| `static/assets/bohemcars/cta/sell-car-banner-v2`                  | 1893.2 KB |  98.3 KB |
| `static/assets/bohemcars/cta/import-canada-banner-v2`             | 1846.6 KB |  97.7 KB |
| `static/assets/bohemcars/services/sell-car-service`               | 1823.8 KB |  81.4 KB |
| `static/assets/bohemcars/services/import-canada-banner-generated` | 1799.6 KB |  82.2 KB |
| `static/assets/bohemcars/blog/registration-cover`                 | 1767.0 KB |  78.6 KB |
| `static/assets/bohemcars/services/evaluate-link-service`          | 1732.0 KB |  65.1 KB |
| `static/assets/bohemcars/blog/sell-car-cover`                     | 1714.4 KB |  73.1 KB |
| `static/assets/bohemcars/megamenu/inventory-bmw-x4m-cutout-v2`    | 1107.1 KB |  89.1 KB |
| `static/assets/bohemcars/megamenu/inventory-audi-sq5-cutout`      | 1067.3 KB |  84.4 KB |
| `static/assets/bohemcars/megamenu/inventory-audi-a7-cutout`       |  900.9 KB |  70.7 KB |
| `static/assets/bohemcars/megamenu/inventory-bmw-x5-cutout`        |  881.4 KB |  73.2 KB |

## Pruning Rule

1. Rewrite rendered references from PNG to WebP only when the visual output is equivalent in desktop and mobile screenshots.
2. Run `npm run test:unit -- --run src/lib/server/asset-manifest.spec.ts src/lib/server/auxero-template.spec.ts`.
3. Run route screenshot QA for every page family that referenced the asset.
4. Delete the PNG only after `rg` confirms no source, template, CSS, or generated adapter still references it.

This keeps Auxero fidelity intact while giving the project a clear path to remove several megabytes of static image weight.

## Pruned Legacy Scripts

The rendered-route script guard and production-source search allowed these static template leftovers to be removed:

- `static/assets/js/count-down.js`
- `static/assets/js/countto.js`
- `static/assets/js/infobox.min.js`
- `static/assets/js/jquery.fancybox.js`
- `static/assets/js/maps.js`
- `static/assets/js/marker.js`
- `static/assets/js/plugin.js`
- `static/assets/js/shop.js`
- `static/assets/js/switcher.js`

The map route uses the Bohemcars/Svelte map fallback instead of Google Maps scripts; ecommerce, countdown, fancybox, plugin, and switcher scripts belong to blocked or unrendered Auxero pages.
