# Day & Night Auto Group · Karento

Separate owner-requested dealer proposal using Karento Best. Local client preview: http://127.0.0.1:6691/. The neutral reusable Signature master is separately served at http://127.0.0.1:6466/.

## Independent Vercel hosting

`npm run build:vercel` uses `vite.vercel.config.mjs` and pinned `@sveltejs/adapter-vercel` 7.0.2 to generate the Vercel output, including request-based locale handling. `vercel.json` selects that command and marks the demo noindex. The normal Node-adapter `vite.config.ts`, `npm run dev`, `npm run build` and port 6691 are preserved. This is a separate `dn-signature` project; it must not rebuild the combined six-variant project. The dependency lock was updated without creating another dependency installation. The cloud release build and public verification remain pending while Vercel rejects new deployments at the daily cap.

## Final mobile card family and source freeze — 1 November 2026

Cars, Services and Shop now use a photo-first, borderless two-column family on phones down to 320px, with 12px column gaps, 24px row gaps, 16px media corners and two-line 14px titles. Cars reuses the Home card presentation with supplied year/mileage/price; Services uses cover photos and brief summaries opening the existing drawer; Shop uses square contained product images and prices. Repeated Shop ratings/reviews are omitted from catalogue cards only. The reference-collection label, USD example prices, product-detail selection and draft/demo boundaries remain. No stock, service descriptions, prices, payment or booking capabilities were invented.

Home's default cards and 24px hero/search composition are preserved. The final phone Home hero, search and first-card bounds match the preceding candidate exactly. Desktop layouts, the white shared header, graphite dock, source assets and all six static stylesheets remain. The mobile catalogue explicitly selects the new car tiles; other grid consumers retain their original `showLocation`/recommendation behavior without another responsive switch. Car detail links keep their original Cars return path.

Opus 5.5 audited the reference and proposed the shared family, then reviewed the implementation diff and captures. Its metadata-spacing regression was corrected and browser-asserted (`2016 · 170,000 km`), and the unnecessary nested responsive switch was removed. Strict checking passes with zero errors/warnings; all eight edited Svelte components pass the official autofixer. The maintained native preview build passes. Focused browser checks cover 320 BG / 360 EN / 390 EN and desktop 1440, BMW filtering (four matching listings), Cars → detail → Cars, service drawer/Escape/focus return, selected Shop product detail and dock clearance. Source preservation confirms 458 master / 412 other client files unchanged. The existing HTTP receipt passes six served stylesheets, all 16 detail/photo links, contact and real 404s; the final source guard additionally covers the last explicit-mode/spacing correction. No second broad QA campaign was run.

Current evidence: `.runtime/evidence/signature-cards/result.json`, `cards.diff`, the Opus reports and `browser-result.json`. Four retained captures cover the variant-5 reference and final Cars/Services/Shop views; the matched prior Cars baseline remains `signature-search/navigation-cars-after.png`. Temporary Services/Shop audit captures were retired after review. Local owner visual acceptance remains pending.

Publisher handoff: maintained source is this exact folder, `L:/CODEX/cars/clients/day-and-night-auto-group/karento`. Frozen source/config/static/provenance is pinned in `.runtime/evidence/signature-cards/frozen-source-manifest.json`: **1,077 files / 38,769,068 bytes**, content digest **`c28ad581679b5e8e3129df884eb8a44c60ce10b78a65aef0d37c7a906028394d`**. The manifest hashes materialized static assets, including reused junction targets; export the selected paths as files, not Windows junctions. Dependencies, generated builds/QA/runtime, the reference tree and inactive legacy `.txt` files are excluded. No source commit, push or public deployment was made by this pass. The publisher owns the separate Vercel adapter/config/package-lock delta after this UI freeze; this agent preserved the existing Node adapter and local 6691 configuration and is not publishing a competing revision or the combined six-variant project. No UI blocker remains; independent hosting configuration/publication is a separate checkpoint.

## Shared header and mobile navigation — 1 November 2026

Home and standard interior pages now share Home's white header, account/grid-menu controls and graphite dock icons. The layout's single `MobileNavigation` owns the route-derived active tab; Home no longer renders a second dock. Existing Home control styles moved into `Header.svelte`, and the older image-overlay header and alternate phone controls were removed from this client. At this navigation step Cars retained its original hero/list/cards; the later mobile card-family correction is documented above. Content follows the separate 56px phone header. The native fullscreen vehicle-detail treatment remains unchanged.

Current receipt: `.runtime/evidence/signature-search/navigation-result.json`, with the three-file diff, source hashes, browser measurements and read-only review in the same folder. Strict checking and the native preview build pass. The feature-aware HTTP/source check passes all 16 detail/photo links, contact/404 checks and all six shared stylesheets; 458 master and 420 unadapted client files remain unchanged. Focused browser checks cover 390 EN / 320 BG / 1440 EN, direct Cars loading, active tabs, menu Open/Escape and Cars → detail → Cars. Home's hero, search panel and first card retain their exact previous phone bounds; desktop search remains 102px with a 24px title gap. Three captures retain the matched Cars correction and unchanged Home result. Opus 5.5 reviewed the actual diff and captures read-only and found no blocker; its desktop/layout follow-up points are covered by the browser measurements.

Publishing scope is recorded in `navigation-publishing-scope.json`. This standalone candidate is untracked and unstaged in `darkapoparka/cars`. The public six-design project `day-and-night-a` uses the separate `darkapoparka/day-and-night-autodeal` repository; authenticated Vercel inspection confirmed its current production deployment came from that repository's `main`. Registered Signature entry is `/variant-6/`. A source commit can select only Signature; publishing into the combined services project may rebuild the package while preserving the other designs. An ordinary Cars push does not automatically incorporate this candidate. No commit, push or deployment was performed.

## Home Buy/Rent — 1 November 2026

The owner explicitly selected a separate white header on Home at phone and desktop sizes, a rounded desktop hero and full-width square phone hero, with a 24px title/search gap and the search inside the image. The latest focused refinement reduces the phone search panel from 106px to 92px and the desktop panel from 106px to 102px. Buy/Rent and the phone search opener retain 44px targets with no overlap. The shorter phone panel returns 7px of space above and below the title/search group: the hero and first card retain their exact previous bounds, the title/search gap stays 24px, and there is 31px of image below the panel. Wrapped Bulgarian copy at 320px also retains the 24px gap. The header, cards, desktop hero frame, search/modal logic and other pages are unchanged by this refinement.

The preceding [Turo](https://turo.com/) adaptation supplies the existing grouped white Buy/Rent search panel and shorter headline; tagline/help/tablet filler remain removed. Signature branding, fonts and artwork assets remain. The subsequent shared-navigation correction above extends the white header across standard interior pages. No rental fleet, rates or booking submission were invented.

Cars now uses the authorized two-column mobile card family above; its desktop Signature composition remains. The owner-supplied variant-5 reference was visually compared; a two-column photo grid is a discussion option, not an implemented card redesign. Shared template source, all six top-level stylesheets, desktop hero frame and artwork assets are unchanged. Home's Buy model options deduplicate repeated models (two BMW X6 listings caused a native keyed-list crash), while retaining both results. The wider Home picker reuses the existing full-make parser, including Land Rover.

Panel-density evidence: `.runtime/evidence/signature-search/panel-balance-result.json`. Two matched pairs compare `header-home-*` before with `balance-home-*` after at 390/1440px. The earlier header-spacing, Turo/reference and original Signature receipts retain their named baseline purposes; capsule/flat-tab candidates remain owner-rejected. The exact four-file CSS diff and source hashes are recorded in `panel-balance.diff` and `panel-balance-source.json`. Strict checking, focused formatting, native preview build and source preservation pass (458 master / 422 unadapted client files unchanged). Browser checks cover 320 BG, 390 EN and 1440 EN geometry, phone Buy/Rent sheets, desktop make picker/rental dialog and zero console errors. Header formatting remains preserved from the master. The prior 16-detail/photo HTTP receipt remains in `turo-result.json`; it was not rerun for this small style change. Physical iOS/Safari and a connected rental backend remain outside this local preview verification. Opus 5.5 reviewed the actual four-file diff and matched captures read-only and found no material regressions or blockers. Local visual owner acceptance is pending.

## Current source — Signature baseline correction, 1 November 2026

The owner selected **the maintained Signature master at 6466, with Day & Night branding** after rejecting the custom Home/Cars pass below. That maintained native Svelte application is now adopted in this existing client checkout. The responsive Home, List 2, Details 3, typography, geometry, controls and artwork remain the baseline; authorized Home and shared header/navigation follow-ups are documented above. The six top-level master stylesheets are byte-identical. No new clone, dependency installation, template-lock adoption or public deployment was made.

Day & Night's existing wheel logos, contacts and 16 dated listing records are applied through `scripts/lib/client-refresh-six.mjs:applyExtendedRefreshAdapter` and the typed dealer/data boundaries. The original profile JSON remains the input. Display titles, Land Rover's full make, sourced power/year and expected-import context are derived without inventing stock facts. The original hero's existing reference branches are selected to preserve its phone/desktop wording and markup. Dealer notices/hours are translated for this English review. The client-only catalog make parser preserves Land Rover in the existing filter controls; it changes no styling.

The source selection and exact adaptation are recorded in `.runtime/evidence/signature-correction/source-manifest.json`; working-source digest is `d2d12d7234cf5ef42052ae4ca86d8013195224632cf1f5e3b4b11dbe1f0019d3`. This records the owner-selected working source, including its existing local edits, rather than certifying an immutable template release. The shared master is unchanged.

Review link: http://127.0.0.1:6691/?lang=en. It is an adapter-node **production preview**, served strictly on loopback from the reused `J:/.artifacts/cars-source-sync/daynight-local-dev/signature-build/build/index.js` output. Current PID is 61416, tool session 82802; current follow-up evidence is in `.runtime/evidence/signature-cards/result.json`. Keep that active output. Port 6466 remains the independent reference preview. Source changes need a refreshed build; the previous candidate dev server is stopped. Native source uses `static/`; its assets/brand/fonts junctions reuse the master and dealer inventory reuses the original retained directory. These local junctions are preview conveniences, not a portable deployment package.

Run `npm run check` for strict Svelte/TypeScript checking. `node tests/signature-baseline-http.mjs --home-search` explicitly allows the authorized Home/navigation changes and verifies source preservation, both Home presentations, all 16 native detail/photo links, default detail, contact identity, the six served stylesheets and real 404s. The obsolete captured/rejected-view checks below do not qualify this source. The reusable build config is `.runtime/signature-build.config.mjs`; it puts output/temp files on J:. `tsconfig.rootDirs` explicitly resolves this client's generated route types through the shared dependency junction.

The 11 legacy/rejected route/app files are retained as `.txt` files in place. They cannot shadow native routes or assets. Their helper modules remain unused by the runtime; `.runtime/correction-master.mjs` reuses the previous pure display normalizer. `SOURCE.json` and the original personalization walkthrough are historical evidence for the captured candidate. The current native source manifest above supersedes them as the client implementation record. No forms, payments or stock services were connected; owner acceptance remains open.

## Rejected pass — 1 November 2026 (historical)

**Owner review: rejected.** The owner rejected the visual result of this pass. Passing technical checks below do not establish visual acceptance. Do not extend this new Home/Cars composition as an accepted baseline. The original maintained Signature at 6466 remains unchanged; the correction baseline is being clarified with the owner. Preserve this candidate and its useful evidence while deciding the correction.

Owner requested a coherent Day & Night Home/header/hero and Cars polish using the SIXT-derived app's Buy/Rent and selection-sheet patterns. Opus 5.5 (`claude-opus-5-5`) reviewed the plan read-only; Codex implements in this existing client only. No source, dependency tree or static-asset library was duplicated.

Home and `/vehicles` are now native Svelte views with the existing dealer wheel logo and Signature hero image. Home has one contained hero, Buy/Rent search box, make/model/budget sheets, four service actions and selected dated cars. Buy filters use the existing 16 listing records. Rent uses dates and a contact sheet; it never presents sale stock as rentable vehicles or invents rates/reservations. Import, valuation, servicing, transport and rental were confirmed by the owner; their availability, terms and service providers are not independently verified.

Cars defaults to two columns on ordinary phones, one below 360px, three at tablet widths and four on desktop. Grid/list choice, filters and sort live in the URL. Display normalization shortens advertising titles, restores Land Rover's complete make name, preserves expected-import status, and reads sourced power without changing stock records. Existing `/vehicle?id=…`, contact and other legacy routes retain their captured implementation; this bounded pass is not a full native migration of that older candidate.

Current code: `src/lib/components/DealerPage.svelte`, `Sheet.svelte`, `CarCard.svelte`, `Icon.svelte`, `dealer-page.css`, `src/lib/showroom.ts`, `src/lib/server/showroom.ts` and the explicit Home/Cars routes. The historical personalizer below still owns legacy routes. Native pages do not load its vendor scripts/styles; full document navigation preserves that boundary. Browser zoom is enabled.

Verification and review are recorded under `.runtime/evidence/signature-polish/`. Four logic tests, strict Svelte/TypeScript checks (zero errors/warnings), focused formatting checks and the production build pass. Run `node --test tests/showroom.test.ts`, `npm run check`, and, against the running 6691 preview, `node tests/showroom-http.mjs`. The focused HTTP check passes Home/Cars, filtered and empty results, all 16 detail IDs/photos, contact identity and a real 404. Browser checks cover 320/390/834/1440px, make/model/budget handoff, list persistence, Back, native-to-legacy return, rental dates/context, service sheets and focus/scroll restoration. Opus's code review found filter-remount focus loss, a newer URLSearchParams property dependency and a same-page menu dismissal bug; all were fixed and checked in the browser/source. This records review plus Codex validation of the corrections, not an additional Opus sign-off or a physical-device/Safari pass.

Five retained captures have distinct purposes: matched Home before/after at 390 and 1440px (four), plus the resulting phone Cars grid (one). No broad screenshot matrix was generated. The current client dev server is PID 12904 on loopback 6691; the master production preview remains on 6466. The one bounded build output is `J:/.artifacts/cars-source-sync/daynight-local-dev/signature-build`. Its bundles have no active consumer, but automatic approval review rejected their cleanup with “blocked by policy”; they remain intact, with that retention exception recorded in the result. The historical `npm run qa` asserts the old captured Home and is not acceptance for this authorized native composition. Do not rewrite its preservation assertions to conceal that difference. This pass is local and unpublished; release pins and public identities are unchanged.

The existing Day & Night apps, dealer manifest, public Vercel origin and both Karento masters are unchanged. This folder is the complete candidate source; it is not added to the dealer's approved variants or template lock.

## Legacy personalization (historical captured candidate)

| Swap | File or directory |
| --- | --- |
| Business name, phone, address, links, accent, listing data | `src/lib/server/dealer-profile.json` |
| Actual wheel logos and favicon | `reference/karento/static/dealer-brand/` |
| Vehicle photos | `reference/karento/static/dealer-inventory/` |
| Copy and template-to-dealer mapping | `src/lib/server/dealer-profile.mjs` |
| Logo fit, contrast and small presentation adjustments | `src/lib/server/dealer-site.css` |

The accent comes from `business.accent` in the profile. There is no need to edit vendor styles or master code. Solid accent surfaces choose their foreground using relative luminance and contrast, including the darker hover color; neutral and soft accent surfaces keep their own text colors. Inline button icons follow the foreground, and menu image icons use the matching monochrome filter. Day & Night's red uses white text (6.27:1 contrast); the template's fixed black foreground gave only 3.35:1.

Listing actions use the short label “View” with a full vehicle name for accessibility. Keep the template's 40px action height, prevent wrapping, and leave the inherited price caption empty so longer sale prices fit at narrower desktop widths.

Vehicle cards use a consistent 4:3 photo frame, one compact title line and a bottom-aligned price/action row. Longer titles use an ellipsis while retaining their full text for accessibility and the original title on hover. Do not reserve an empty second line when swapping differently sized photos or longer model names. Listing sample badges have no review star; testimonial star icons follow the accent foreground; review-banner eyebrow text stays white on photography.

Card specifications use small neutral badges: mileage/gearbox above, then year/fuel/horsepower. Quiet template icons follow the theme foreground, with a calendar for year. Definition-list labels provide accessible context. Power uses a positive `powerHp` or the explicitly unit-bearing sourced `raw.power`; absent/invalid power is omitted and the second row uses two badges. Narrow four-card desktop rows use compact text/body/icon spacing to keep complete values readable.

The 16 vehicle samples and photos come from the dealer's existing dated source, observed 24 July 2026. They are not freshly verified available stock. Existing licensed template hero/section artwork remains; the How It Works images are the existing generated Karento Best artwork.

Only the selected 30 website routes are public. Vehicle cards open `/vehicle?id=<listing-id>`; sale details use the matching price/photo and dealer contact. Existing samples supply one small cover image per vehicle, not a full gallery. Contacts and viewing actions open the correct phone, dealer profile, map or contact page. Forms do not send messages or make bookings. Owner/member sign-in selects a browser demo role without credentials.

Advanced catalogue filtering, shop checkout, finance calculations, memberships, real authentication and saved dashboard changes remain template demonstrations. They are not completed backend features.

## Run and check

Use Node 26.10.0 and the included lockfile. In a fresh exported checkout with its own dependencies:

```powershell
npm ci
npm run check
npm run build
$env:HOST='127.0.0.1'
$env:PORT='6691'
node build/index.js
```

Run `npm run qa` in another terminal against the running production preview. `QA_BASE` overrides the origin and `QA_REPORT` optionally writes the JSON report. For development: `npm run dev -- --host 127.0.0.1 --port 6691 --strictPort`.

This shared checkout currently uses a `node_modules` junction to the already installed Karento Best dependencies to avoid another install on the nearly full drive. Do not run `npm ci` against that junction. It is ignored and is not part of the portable source or build.

## Reproduce the workflow

Inventory cards keep neutral specification badges and a compact solid-accent View action. The common showroom location stays in the site and vehicle details rather than repeating on every card; spacing groups the title, specs and price/action without a divider. The action uses the profile's contrast-selected foreground in both normal and hover states.

See [the tested personalization walkthrough](../../../docs/karento/DAYNIGHT-PERSONALIZATION.md). `SOURCE.json` records the exact source-copy manifests and profile/photo provenance. The existing `copySource` tool copied the selected template and its required captured inputs; `reference/karento` is the pinned build dependency, not a new master to edit.

Publication remains separate. Karento is a candidate outside the approved dealer manifest/publisher families. No hosting resource, existing deployment, billing or DNS was changed by this build.
