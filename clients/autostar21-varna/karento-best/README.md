# Karento Best

The owner-selected dealer website, implemented in Svelte 5 and SvelteKit 3: Home 3, Car List 2 and Car Details 3, with 30 canonical paths and all 39 maintained page compositions. The neutral palette, fixed light appearance, original artwork and latest approved Contact panel are retained.

Cars `templates/karento-best` is the editable master. `darkapoparka/cars-template-karento` is the standalone publishing mirror. Original captured source remains in Git history and immutable preservation evidence; it is not loaded by the native application.

The [October 10 source handoff](docs/SOURCE-HANDOFF-2026-10-10.md) records the approved Signature source and standalone Vercel hosting boundary. The mirror applies the existing provider adapter; the maintained master keeps its local Node pin.

## Run

Use the Node version in `.node-version` (26.10.0).

```sh
npm ci
npm run dev
```

The canonical development preview binds strictly to [127.0.0.1:6466](http://127.0.0.1:6466/). After `npm run build`, set `HOST=127.0.0.1`, `PORT=6466` and `ORIGIN=http://127.0.0.1:6466`, then run `node build/index.js` for the Node production preview. Never stop an unrelated process to claim a port.

## Website and source

The main navigation is Home, Vehicles, Services, Shop, Explore, Plans and Contact. Explore contains About, Import, News, Calculator, FAQ and Terms. Account opens the sign-in flow or selected demo account; sign out stays inside the drawer. Member and owner dashboard routes retain their sidebars. Unknown URLs return the designed screen with HTTP 404.

`src/lib/routes.ts` defines canonical routes and original aliases. `src/lib/pages` composes all 39 compiled variants from named sections. Shared feature components live under `components/search`, `vehicle-listing`, `vehicle-detail`, `faq`, `dashboard`, `page-header`, `finance`, `editorial`, `contact` and `plans`; repeated sample records and layout configuration live in typed `data` modules. Three vehicle card components preserve the distinct grid, editorial and featured presentations. `Header.svelte` owns shared navigation, `content.ts` owns typed dealer inputs, and `preview.svelte.ts` owns visitor state per layout.

Desktop text roles and repeated card, panel, control and spacing values are owned by [the typography contract](docs/DESKTOP-TYPOGRAPHY-SYSTEM-2026-10-09.md) and [the geometry contract](docs/DESKTOP-GEOMETRY-SYSTEM-2026-10-09.md) at 992px and above. Components choose semantic roles and retain their own composition. Mobile uses [its separate shared patterns](docs/MOBILE-PATTERNS.md). The concurrent `/2` discovery experiment is outside the 39-composition route registry and requires its own acceptance.

English and Bulgarian use typed catalogs, request-local locale resolution and per-layout context. [The localization guide](docs/I18N.md) owns message keys, formatting, language-preserving queries and mount-aware internal links; factual dealer content stays at its typed data boundary.

`PageMetadata.svelte` applies descriptive dealer-aware titles to every variant. `DemoForm`, `DemoActionButton`, `DemoActionLink` and `DemoFeedback` compile preview feedback without extra layout wrappers. Feedback is singular per action container and is released on navigation. Historical reference and migration files are outside the runtime import graph.

`CalendarInput.svelte`, `Gallery.svelte` and `PhotoViewer.svelte` provide native date selection, galleries and modal viewing, including keyboard/mobile controls and route cleanup. Billing uses native radios and consistent monthly/annual amounts. The application does not load jQuery, Slick, the legacy datepicker, captured whole-page HTML or the global legacy `main.js` runner.

Swiper, PerfectScrollbar, ApexCharts and noUiSlider remain independent libraries behind lifecycle-owned typed Svelte attachments. Native quantity, dropdown and drawer behavior use the same attachment boundary. Their markup, state boundaries and disposal belong to the maintained app. Original vendor files remain byte-preserved in `static/`; retaining an asset is different from loading it.

The homepage keeps the selected Home 2 system/testimonial sections, nine unique static brand logos and the approved four-step photography. Contact preserves reviewed portraits and location links inside one white outer panel. Get in Touch has its own inner card on the left, while the map fills the right column without an inset card or heading. Its address and directions link agree with the map; phones stack the form and map. Demo forms show truthful feedback and do not send or save information.

## Verification

```sh
npm run check
npm run format:check
npm test
npm run build
npm run qa
```

The latest local desktop verification and its exact scope are recorded in [the final verification report](docs/DESKTOP-FINAL-VERIFICATION-2026-10-09.md). Strict checks, tests and a build establish source validity; rendered routes, controls and matched screenshots establish the corresponding frontend evidence.

`qa` runs the preserved SSR contract, link/ID/control associations across all 39 variants, 21 browser journeys, native widgets at 320/390/1440px, 30 page-loading smoke tests and mobile checks. Its first step, `test:ssr`, compares 102 compositions/aliases with exact recorded titles, visible copy and image order, plus nine real 404 responses. This is a migration-preservation contract. Authorized identity, content and design changes require current rendered acceptance and can differ from that historical contract; its assertions and reference files remain intact. The aggregate stops on its first failure, so focused passing checks do not establish a passing `qa` run. Set `KARENTO_NATIVE_URL` to override the active preview. Browser tests use local temporary profiles; `KARENTO_BROWSER_CHANNEL=chrome` selects installed Chrome.

`npm run test:visual` compares all 39 variants at 320, 390 and 1440px, plus the drawer. Set `KARENTO_BASELINE_URL` to a preserved approved build, `KARENTO_EVIDENCE_DIR` for evidence output, `KARENTO_ROUTES` for a focused route subset, or `KARENTO_WIDTHS` for a unique subset of `320,390,768,1024,1440`. The default covers the full 120-comparison matrix. Both sides use the same browser, fixed clock and reduced motion. Overlapping 900px-high browser views cover the complete document; settled scrolling and stable height are asserted. The comparison checks text/section geometry, image errors and native horizontal overflow, recording original overflow separately. The declared Contact design adjustment, wallet chart resize fix and stable 2D range-slider layer are applied to the preserved reference only, without changing its source. The native application contains these changes. Raw pixel equality and differences above the fixed 0.1 pixel threshold are reported separately.

`provenance/reviewed-source.json` identifies the preserved approved composition and stylesheet. `reviewed-compositions.json` stores semantic contracts, not runtime HTML. All 607 original recorded files and original asset bytes remain protected by unit contracts. The standalone mirror contains `karento/` and `karento-best/`; Cars checks its preserved `../karento` library and the hash-locked `provenance/frozen-best` archive. `provenance/tooling` is migration history, not a supported generator.

Set `KARENTO_REFERENCE_KIND=native` when comparing an already approved native build; reference adjustments are then disabled. Nine alternate-layout document titles have declared replacements in `reviewed-reference-adjustments.json`. The recorded body, image and composition contracts remain unchanged as preservation evidence; they are not rewritten to match later polish.

The 8 October architecture cleanup is recorded in [SVELTE-ARCHITECTURE-AUDIT-2026-10-08.md](SVELTE-ARCHITECTURE-AUDIT-2026-10-08.md). [SVELTE-AUDIT-2026-10-08.md](SVELTE-AUDIT-2026-10-08.md) records the earlier skill-led interaction audit, [FINAL-REVIEW.md](FINAL-REVIEW.md) records the preceding cleanup, and `IMPLEMENTATION-REPORT.md` preserves the original native frontend promotion report. These dated reports describe their own checkpoints. A local pass does not assert a GitHub Actions pass or owner visual approval.

## Reuse boundary

Read `REUSE.md` and `.template/template.json`. Dealer identity, logo, contacts, locations, selected copy and inventory overrides have typed inputs. Keep reviewed neutral/light defaults; optional accents require individual review. Catalog support and a default locale do not qualify complete dealer translation or publication.

Account, shop, wallet, booking, membership and dashboard data are demonstrations. Real authentication, saved enquiries, payments and inventory services are separate integrations. This frontend promotion does not change the approved template lock, dealer manifests, fleet registration, the 25 lead projects or hosting. Use the existing Cars release and publishing workflow for that work.
