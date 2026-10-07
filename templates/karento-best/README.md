# Karento Best

The owner-selected dealer website, implemented in Svelte 5 and SvelteKit 3: Home 3, Car List 2 and Car Details 3, with 30 website routes and all 39 preserved page variants. The neutral palette, fixed light appearance, original artwork and latest approved Contact panel are retained.

Cars `templates/karento-best` is the editable master. `darkapoparka/cars-template-karento` is the standalone publishing mirror. Original captured source remains in Git history and immutable preservation evidence; it is not loaded by the native application.

## Run

Use the Node version in `.node-version` (26.10.0).

```sh
npm ci
npm run dev
```

The canonical development preview binds strictly to [127.0.0.1:6466](http://127.0.0.1:6466/). After `npm run build`, set `HOST=127.0.0.1`, `PORT=6466` and `ORIGIN=http://127.0.0.1:6466`, then run `node build/index.js` for the Node production preview. Never stop an unrelated process to claim a port.

## Website and source

The main navigation is Home, Vehicles, Services, Shop, Explore, Plans and Contact. Explore contains About, Import, News, Calculator, FAQ and Terms. Account opens the sign-in flow or selected demo account; sign out stays inside the drawer. Member and owner dashboard routes retain their sidebars. Unknown URLs return the designed screen with HTTP 404.

`src/lib/routes.ts` defines canonical routes and original aliases. `src/lib/pages` contains compiled Svelte variants; `sections`, `cards` and `components` contain reusable markup. `Header.svelte` owns shared navigation, `content.ts` owns typed dealer inputs, and `preview.svelte.ts` owns visitor state per layout.

`CalendarInput.svelte`, `Gallery.svelte` and `PhotoViewer.svelte` provide native date selection, galleries and modal viewing, including keyboard/mobile controls and route cleanup. Billing uses native radios and consistent monthly/annual amounts. The application does not load jQuery, Slick, the legacy datepicker, captured whole-page HTML or the global legacy `main.js` runner.

Swiper, PerfectScrollbar, ApexCharts and noUiSlider remain independent libraries behind lifecycle-owned Svelte actions. Their markup, state boundaries and disposal belong to the maintained app. Original vendor files remain byte-preserved in `static/`; retaining an asset is different from loading it.

The homepage keeps the selected Home 2 system/testimonial sections, nine unique static brand logos and the approved four-step photography. Contact preserves reviewed portraits and location links inside one white outer panel. Get in Touch has its own inner card on the left, while the map fills the right column without an inset card or heading. Its address and directions link agree with the map; phones stack the form and map. Demo forms show truthful feedback and do not send or save information.

## Verification

```sh
npm run check
npm run format:check
npm test
npm run build
npm run qa
```

`qa` checks 102 server-rendered route/alias compositions, nine real 404 responses, 14 browser journeys, native widgets at 320/390/1440px and 30 page-loading smoke tests. Set `KARENTO_NATIVE_URL` to override the active preview. Browser tests use local temporary profiles; `KARENTO_BROWSER_CHANNEL=chrome` selects installed Chrome.

`npm run test:visual` compares all 39 variants at 320, 390 and 1440px, plus the drawer. Set `KARENTO_BASELINE_URL` to a preserved approved build, `KARENTO_EVIDENCE_DIR` for evidence output, or `KARENTO_ROUTES` for a focused subset. Both sides use the same browser, fixed clock and reduced motion. Overlapping 900px-high browser views cover the complete document; settled scrolling and stable height are asserted. The comparison checks text/section geometry, image errors and native horizontal overflow, recording original overflow separately. The declared Contact design adjustment, wallet chart resize fix and stable 2D range-slider layer are applied to the preserved reference only, without changing its source. The native application contains these changes. Raw pixel equality and differences above the fixed 0.1 pixel threshold are reported separately.

`provenance/reviewed-source.json` identifies the preserved approved composition and stylesheet. `reviewed-compositions.json` stores semantic contracts, not runtime HTML. All 607 original recorded files and original asset bytes remain protected by unit contracts. The standalone mirror contains `karento/` and `karento-best/`; Cars checks its preserved `../karento` library and the hash-locked `provenance/frozen-best` archive. `provenance/tooling` is migration history, not a supported generator.

Actual validation results and limitations are recorded in `IMPLEMENTATION-REPORT.md`. A local pass does not assert a GitHub Actions pass or owner visual approval.

## Reuse boundary

Read `REUSE.md` and `.template/template.json`. Dealer identity, logo, contacts, locations, selected copy and inventory overrides have typed inputs. Keep reviewed neutral/light defaults; optional accents require individual review. A locale setting is not a complete translation.

Account, shop, wallet, booking, membership and dashboard data are demonstrations. Real authentication, saved enquiries, payments and inventory services are separate integrations. This frontend promotion does not change the approved template lock, dealer manifests, fleet registration, the 25 lead projects or hosting. Use the existing Cars release and publishing workflow for that work.
