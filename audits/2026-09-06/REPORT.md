# Automotive template audit and library setup

Audited 2026-09-06. **Start selling with Auto Best. Keep Modern and Carwow as the first alternatives. Polish Rencar once as a dealer template, then Boxcar.** Keep the other sources available without turning every prospect into a new design project.

Ten folders are now present under `J:/cars/templates`. They represent eight related design families: AutoDeal/Auto Best share lineage, and Import/Showroom share Auxero lineage. All current layouts and source branding were preserved for the next personalization or template-polish task.

## Ratings

These are comparative design/UX ratings out of 10 for the current renders, with mobile judged as a stock-browsing and enquiry experience. They are not Lighthouse results, accessibility certification, legal clearance, or production readiness. Source/demo content issues are called out separately because they affect the cost of a skin.

| Local name | Supplied port | Desktop | Mobile | Decision | Main reason |
|---|---:|---:|---:|---|---|
| **auto-best** | 5173 | **8.5** | **8.5** | Use first | Balanced showroom presence, compact mobile inventory, coherent detail/contact journey; easiest starting point here. |
| **modern** | 6212 | **7.0** | **8.5** | First alternative | Best compact, direct inventory grammar; desktop feels more like a stock tool than a full showroom. |
| **carwow** | 6517 | **8.0** | **8.0** | First alternative | Distinct yellow desktop, useful mobile hierarchy and rich stock browsing; denser cards and source data need attention. |
| **import** | 6518 | **7.5** | **8.0** | Keep ready to select | Dark, direct buy/import experience; useful mobile cards, slightly older typography/card treatment. |
| **showroom** | 6404 | **7.5** | **8.0** | Keep for stock-led dealers | Clear red/white inventory, sidebar on desktop and compact list on mobile; tall mobile inventory hero delays stock. |
| **autodeal** | new 6460 | **8.0** | **7.0** | Full variant library | Ten real compositions and broad route coverage; mobile stacks and mixed sample copy need a deliberate skin. |
| **boxcar** | 6450 | **8.0** | **6.5** | Polish after Rencar | Strong spacing, cards and detail patterns; oversized mobile search/intro keeps inventory below the fold. |
| **rencar** | 6430 | **7.5** | **5.5** | Adapt once, then reuse | Attractive desktop motifs and five real homes; very tall mobile heroes and rental booking semantics. |
| **motoria** (Motors) | 6440 | **6.5** | **5.0** | Reserve | Recognizable conventional dealer design, but mixed source layouts, vendor chrome and uncaptured destinations. |
| **nusavo** | 6420 | **6.5** | **6.0** | Rental reserve | Clear fleet patterns, less convincing for a showroom; cart/checkout semantics, large image blocks and remote CSS dependency. |

The first three are different enough to make a sensible three-option offer. Showing Import and Showroom alongside each other creates less visual variety because they share a base.

## Evidence and coverage

- Opened all nine supplied previews in Chromium using browser automation. Captured the requested entry, stock/listing, one real detail route and contact at **1440×900** and **390×844**. ELIQ's homepage was also inspected.
- Inspected **all five Rencar homepages** and **all ten AutoDeal homepages** at both sizes.
- Baseline, journey and initial library passes contain **110 route/viewport samples across 50 distinct port/route pairs**. Those samples had no failed page navigation, positive document overflow, or detected broken visible `img` elements. Console issues below were observed; this is not a blanket clean-runtime claim.
- Added a confirmation pass of eight samples for copied Carwow, Import and Showroom. Those final samples returned 200 with expected titles, no document overflow, no broken visible images and no console errors. Their initial cold compilation produced timeouts and Carwow dependency-optimizer 504s; a fresh pass after optimization passed without source fixes.
- Bootstrapped the independent Modern copy and added six passing inventory/detail/contact samples on 6462. The initial launch refused duplicate app origins; the corrected local configuration uses distinct origins and the existing static demo mode. Final renders have no console errors or broken visible images, while development image-sizing/LCP and toolbar warnings remain.
- Sampled mobile filter/search/category controls across the templates. Auto Best, Modern and Import showed filter panels and returned focus to the trigger on Escape. Carwow's panel closed but focus returned to the document in two checks. Rencar's search overlay returned focus. Boxcar's More Filters expands an inline panel. Nusavo's Economy category visibly narrows the fleet. These are bounded interaction checks, not complete transaction tests.
- Preserved raw JSON, screenshots and initial failures. No lead form, message, booking, payment or other external submission was made.

Evidence files:

- [Baseline observations](./results-baseline.json)
- [Journey and Rencar home observations](./results-journeys.json)
- [Full AutoDeal and relocated-preview observations](./results-library.json)
- [Initial independent-copy startup observations](./results-copies.json)
- [Independent-copy confirmation](./results-copies-confirmation.json)
- [Modern copy confirmation](./results-modern-copy-confirmation.json), [final validation](./validation.json) and [source integrity](./library-integrity.json)
- [Interaction observations](./interactions.json) and [focused follow-up](./interactions-followup.json)
- `screenshots/*-sheet.png`: desktop top and next viewport on the left; mobile top on the right. These are two desktop scroll positions, not one continuous screenshot.

Rencar's first baseline screenshots caught its entrance animation before the text appeared. The later `rencar-home1` through `home5` captures waited for the animation. Ratings use those settled captures. Waiting to read content is itself a useful reason to simplify its motion later.

This audit did not measure production performance, full-page contrast, every keyboard path, real devices, every source route, authenticated services or hosted deployments. Long pages were sampled at their first and next viewports rather than exhaustively photographed to the footer.

## Per-template findings

### Auto Best — 5173 / library 6461

Keep the compact mobile rows, prominent prices, consistent filter sheet, native route structure and contact CTA placement. The desktop homepage has enough discovery and dealership context to sell the business. This is the strongest default, not a reason to rebuild it again.

The source has eight illustrative vehicles and source-specific contact/social/media data. Replace those before a new offer. Some budget imagery repeats, and the desktop listing hero is sizeable, but neither justifies another open-ended polish pass. The source's old AGENTS asset count was stale; the actual current asset guard passes with 85 referenced files.

Evidence: [home](./screenshots/auto-best-entry-sheet.png), [inventory](./screenshots/auto-best-inventory-sheet.png), [detail](./screenshots/auto-best-detail-sheet.png), [filter sheet](./screenshots/auto-best-interaction-390.png).

### Modern — 6212 / library 6462

Its mobile catalog shows several vehicles immediately, separates quick filters and full filtering, and makes scanning easy. Desktop is restrained and functional; it can work for an inventory-first pitch but gives less showroom atmosphere and service context than Auto Best or Carwow.

**P2:** the sampled BMW X5 detail hero crops most of the car below the image frame on desktop and mobile. Select an appropriate image/crop when replacing assets. Do not judge this only from the attractive listing row.

The runtime is a Next monorepo with database/integration boundaries. Copying only `apps/web` would be incomplete; the whole workspace was copied. Dependencies were installed independently and Prisma was generated locally. The web typecheck passed and the copied inventory/detail/contact pages render at both widths using existing static demo mode, without source credentials. No API/private app or provider delivery was configured. Next reports image-sizing/LCP and unconfigured development-toolbar warnings; visual simplicity does not mean operational simplicity.

Evidence: [inventory](./screenshots/modern-entry-sheet.png), [detail](./screenshots/modern-detail-sheet.png), [contact](./screenshots/modern-contact-sheet.png).

### Carwow — 6517 / library 6463

The yellow desktop composition is distinctive, and mobile is a different, intentional browsing layout. Keep the strong buy/import hierarchy and compact stock rows. “Carwow” is an internal nickname for the inspiration, not affiliation or a source license.

**P2:** desktop inventory puts five dense cards across the tested width; long names, badges and finance labels compete. **P2:** homepage budget tiles use repeated generic car imagery and advertise empty low-budget groups in the sampled data. A lead's actual stock should decide those groups. **P2:** Escape closes the mobile filter sheet but keyboard focus lands on the document instead of returning to its trigger.

The original source listener changed PID during the session outside this task; its physical path remained the same. The J: copy is a timestamped snapshot, not a live sync with subsequent source edits.

Evidence: [home](./screenshots/carwow-entry-sheet.png), [inventory](./screenshots/carwow-inventory-sheet.png), [filter sheet](./screenshots/carwow-interaction-390.png).

### Import — 6518 / library 6464

The dark hero makes the stock/import purpose clear, and the mobile home reaches actual inventory sooner than the raw commercial themes. Preserve the direct buy/import controls and the existing discovery paths.

**P2:** the mobile home card is quite wide with a long title clipped in its carousel, and desktop's condensed typography, framed spec pills and repeated red card CTAs look older than Auto Best. Treat these as a shared future polish batch only if this template is selected.

Evidence: [home](./screenshots/import-entry-sheet.png), [inventory](./screenshots/import-inventory-sheet.png), [detail](./screenshots/import-detail-sheet.png).

### Showroom — 6404 / library 6465

This is the copied ELIQ Bohemcars source, now given a generic local name. The inventory has useful desktop filtering and compact mobile rows with price/spec hierarchy. It is a good fit when stock and phone enquiries dominate.

**P2:** the mobile inventory hero consumes roughly the first 300 px before search/filters, whereas Auto Best and Modern put inventory much sooner. Preserve its existing character now; shorten only in a requested template pass. Update the real contact/location, finance wording and all ELIQ media in a new client copy.

Evidence retains the initial audit key `import-eliq`: [inventory](./screenshots/import-eliq-entry-sheet.png), [home](./screenshots/import-eliq-home-sheet.png), [detail](./screenshots/import-eliq-detail-sheet.png), [filter sheet](./screenshots/showroom-interaction-390.png).

### AutoDeal Full — library 6460

The complete existing Agency OS library is now local, with **ten genuinely different homes**. It is useful as a choice library, while Auto Best is the more efficient first sales demo.

For a future shortlist, start with **Home 2** for explicit search, **Home 8** for a vehicle cutout composition, and **Home 9** for a premium image-led entrance. Home 7 suits a hero-vehicle campaign. Home 5's mobile spec tiles precede the main vehicle content, making it a weaker general dealer entrance. Homes 1/6 depend on correct hero vehicle and seller data.

**P1 content:** source vehicle names and images often disagree (for example Nissan Leaf wording over a different vehicle), and Bulgarian pages retain mixed English/source copy, sample sellers and broad marketplace claims. These cannot be carried into a branded sales sample. **P2:** many mobile homepages stack a large hero and four-field search form before any stock.

All homes are at `/`, `/home02` … `/home10`. Keep them in one cloned codebase. An all-variants offer must update identity on all offered homes; it does not become complete by changing only `/`.

Evidence: `screenshots/autodeal-home1-sheet.png` through `autodeal-home10-sheet.png`; [Home 2](./screenshots/autodeal-home2-sheet.png), [Home 8](./screenshots/autodeal-home8-sheet.png), [Home 9](./screenshots/autodeal-home9-sheet.png).

### Boxcar — 6450

Best raw visual system among the four newcomers for a conventional showroom: good hierarchy, restrained card styling and useful detail/filter/compare patterns. It deserves a shared pass.

**P1 selection truth:** Home 2-10 menu entries currently point to `/`; only one local home exists. Do not offer ten Boxcar designs from this folder. **P2:** mobile inventory does not reach its first vehicle image until around 650 px because the search, title and sorting sections stack. More Filters adds another long inline form. **P2 content:** sample vehicles and images do not consistently agree. **P3:** `/favicon.ico` returns 404; this was the otherwise unexplained console error in the baseline.

Evidence: [home](./screenshots/boxcar-entry-sheet.png), [inventory](./screenshots/boxcar-inventory-sheet.png), [More Filters](./screenshots/boxcar-interaction-390.png).

### Rencar — 6430

All five homes are preserved. Home 2 is a clear split composition; Home 5 gives the vehicle cutout more identity. Those are the first candidates to adapt for a dealership. Keep the stronger motifs without rebuilding the whole theme for each prospect.

**P1 dealer fit:** pickup/drop-off dates, driver age, traveller counts, daily rates, booking and checkout are real rental concepts. Replacing their labels would create a misleading sales flow. Convert the shared discovery/detail/enquiry contract once in the master. **P2 mobile:** very large headings, tall heroes and stacked forms delay the catalog; inventory stacks the sidebar filters before vehicle cards. **P2 content:** cards repeat the same generic vehicle name over different images, with sample review totals and daily prices. **P2 motion:** text is initially hidden during entrance animations.

Evidence: [Home 2](./screenshots/rencar-home2-sheet.png), [Home 5](./screenshots/rencar-home5-sheet.png), [inventory](./screenshots/rencar-inventory-sheet.png). Raw ratings reflect the current template, not the quality it could reach after adaptation.

### Motoria / Motors — 6440

The name correction matters: the local folder reproduces **Motors by Stylemix**, not Agency OS's older Motoria source. Its conventional look may suit some dealers, but it is presently the weakest fast-demo option.

**P1 route completeness:** many vehicle cards and account/dealer links still lead to the vendor's website; only the BMW detail is captured locally. **P1 offer presentation:** vendor Buy Now/backend-demo bars remain visible. **P2 consistency:** homepage and inventory use different source skins, colors and header treatments. **P2 mobile:** long vertical cards include seller/marketplace detail unnecessary for a single dealer, and the homepage navigation is limited.

Nine pricing styles are preserved; they are not nine homepage variants. Resolve routes and presentation continuity before considering cosmetic polish.

Evidence: [home](./screenshots/motoria-entry-sheet.png), [inventory](./screenshots/motoria-inventory-sheet.png), [detail](./screenshots/motoria-detail-sheet.png).

### Nusavo — 6420

The compact category filters are useful, and the template is a coherent rental storefront. Its type and lime accents are more specific than the broad-market dealer alternatives. Keep it for rental-oriented prospects rather than forcing it into every car showroom offer.

**P1 dealer fit:** rental daily prices and cart/checkout need a deliberate dealer conversion. **P2 dependency:** an external `masking_img.png` referenced from source styling fails CORS in the original audit and again during fleet filtering; a post-relocation homepage pass did not show it, so the issue is intermittent/state-dependent, not fixed. **P2 mobile:** large vehicle image blocks dominate the home, and filtering to one category leaves a narrow single card rather than using the available width. **P3:** missing favicon.

Evidence: [home](./screenshots/nusavo-entry-sheet.png), [filtered fleet](./screenshots/nusavo-interaction-390.png), [detail](./screenshots/nusavo-detail-sheet.png).

## Work completed and validation boundary

- Moved `boxcar`, `rencar`, `motoria`, `nusavo` into `templates/` after verifying each listening process's actual current directory. Restarted only those confirmed processes on 6450/6430/6440/6420.
- Copied six working source trees, including uncommitted polish, without modifying their M: originals. Each retained file was SHA-256 checked after copying. Dependencies, secrets, source Git/CRM/deployment bindings and generated outputs were excluded. Source history/provenance is recorded in each `.template/source-manifest.json`.
- Installed independent dependencies for Auto Best, Carwow, Import, Showroom and Modern. Auto Best's validation passed: architecture, 85 referenced assets, zero Svelte errors/warnings, production build. AutoDeal's build passed: 150 routes, 479 resources, nine locale catalogs. Boxcar, Rencar, Motoria, Nusavo, Carwow, Import and Showroom each passed Svelte checks with zero errors and warnings. Modern passed Prisma generation and its web typecheck.
- Created root and per-template agent instructions, a catalog, template-specific reskin/run guides, source manifests, client briefs, a checked clone helper, and a port-safe startup helper.
- The copy-helper regression check passes for edited content, root configuration, source modules named for credential handling, secret-file exclusions, overwrite refusal and retained-junction rejection. Root config files and two Modern security source modules initially omitted by broad filters were restored from source and hash-verified; the corrected helper retains them in future copies.
- The final integrity check verifies 6,256 retained source files. README originals are archived beside the copy manifests. Next dev changed Modern's generated `next-env.d.ts` route-type import; its exact source original is also archived, and the verifier accepts only that recorded generated change.
- All ten library masters now have their own located local preview. Modern uses static demo inventory with local validation bypass, distinct configured origins and no provider credentials. A production build or provider acceptance for Modern was not performed.
- No template UI polish, client personalization, Git publication, deployment, CRM mutation or outbound contact was performed. Client folders are scaffolds only.

## Agency OS and internet context

Inspected Agency OS instructions, the full AutoDeal and older static AutoDeal Best sources, local project metadata and the CSV fallback for existing lead aliases. The available Neon connector organization returned no Agency OS project, so live CRM records were not refreshed or changed. CSV observations in client briefs are explicitly historical.

The current public [ELIQ dealer profile](https://eliqauto.mobile.bg/) shows a substantial stock-oriented business; that supports an inventory/enquiry pitch. [Day & Night's public dealer listings](https://daynight.mobile.bg/obiavi/avtomobili-dzhipove/p-2) support the same broad discovery direction. This is template-fit research, not a fresh stock synchronization or a completed lead qualification. ASKO's listed website could not be fetched successfully; no quality or business-status claim follows from that failure.

Public author sources consulted for template identity: [Boxcar](https://demoapus1.com/boxcar/), [Nusavo author listing](https://themeforest.net/item/nusavo-car-rental-elementor-pro-template-kit/64724420), [AutoDeal author listing](https://themeforest.net/item/autodeal-car-dealer-rental-listing-react-nextjs-template/55557853). The local source READMEs identify [Rencar](https://live.themewild.com/rencar/) and [Motors](https://motors.stylemixthemes.com/elementor-classified-one/); direct web-tool fetches for those demos were unavailable. Ratings come from the actual local browser renders, not author marketing claims. No new source or remote media was imported.

## Next action

Use Auto Best for the first requested client skin and get an offer into review. Keep Carwow and Modern as the two meaningful alternatives. Then give Rencar one bounded shared dealer/mobile pass, followed by Boxcar. The local library and instructions now support that flow; they deliberately do not claim that every copied commercial-style template is already a one-config showroom generator.
