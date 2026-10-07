# Karento Best native Svelte maintenance

The owner requested the completed native Svelte frontend and source promotion on 7 October 2026. Cars `templates/karento-best` is the maintained master; the standalone `cars-template-karento` repository is its publishing mirror. Work on Cars main according to the parent coordination rules. Source promotion is separate from a template-lock release, dealer generation, provider integration or deployment.

The maintained application lives in `src/`, `static/`, `scripts/` and `tests/`. All 39 variants are compiled Svelte; Home 3, List 2 and Details 3 are the selected website layouts. `routes.ts` owns routes, `Header.svelte` owns shared navigation and `content.ts` owns typed dealer inputs. Keep Home, Vehicles, Services, Shop, Explore, Plans and Contact, with Account as the direct action and sign out inside the drawer.

The standalone mirror's `karento/` and `karento-best/` are immutable reference evidence protected by `provenance/baseline.json`. In Cars, the original library remains at `../karento`; the 26 old Best evidence files live at `provenance/frozen-best`. Neither is a runtime dependency. Never alter reference files or assertions to conceal a mismatch. `provenance/tooling/` is migration history, not a supported regeneration command or dealer generator.

Do not change CSS, layout, artwork, typography or default colors without explicit owner approval. Preserve meaningful inline whitespace, especially non-breaking spaces in flex rows. Compilation and identical stylesheets are not proof of visual equivalence; run the rendered comparisons.

Use Svelte 5 typed props/runes and per-layout context for visitor state. Keep maintained code under strict checks; no raw whole-page HTML injection, generic HTML-tree renderers, global legacy main.js loader, blanket compiler suppression or untyped escape hatches. Keep route modules split and unknown/prototype-name routes genuinely HTTP 404.

The gallery, photo viewer and calendar are compiled Svelte components. Do not restore jQuery, Slick, the legacy datepicker or the global legacy script runner. Swiper, PerfectScrollbar, ApexCharts and noUiSlider are independent libraries behind lifecycle-owned actions; register cleanup immediately, check asynchronous disposal and test repeated navigation. Never move preview account state into a process-global singleton.

Personalization belongs at the explicit typed content boundary. Keep neutral/light defaults; accent overrides require individual review. Reference stock, contacts, reviews, financial values and demonstration account screens are not real dealer data. Demo form feedback must not imply that an enquiry or payment was sent or saved. See REUSE.md for promotion blockers and current content-boundary limitations.

Use the exact Node version in `.node-version` and `npm ci`. Before committing, run `npm run check`, `npm run format:check`, `npm test`, `npm run build`, the HTTP/browser tests and visual comparisons relevant to the change. Inspect `.runtime/evidence` rather than treating a build as visual approval. Keep runtime caches, test profiles and bulk screenshots ignored.

The canonical local preview is 6466, bound strictly to loopback. Never stop an unrelated process merely to take a port. Preserve current dealer manifests, the approved lock and hosting choices. Never read, print or commit secrets or change Git credentials/global configuration as a workaround.
