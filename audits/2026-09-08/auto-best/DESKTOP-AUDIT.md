# Auto Best — desktop UI, UX and styling audit

8 September 2026 · `J:/cars/templates/auto-best` · <http://127.0.0.1:6461/>.

## Decision and scope

**Retain the desktop design. Finish targeted journey, content and accessibility repairs before presenting a personalized lead demo.** The shared header, vehicle grids, search panel, route artwork and red/black action hierarchy are consistent. There is no evidence supporting a new framework, a replacement hero system or a complete visual redesign.

This is the independent Auto Best SvelteKit master, catalog version `2026.09.06-refresh-1`. The 5173/6511 aliases refer to its lineage; the audited library listener is 6461, PID 60520, launched with the Cars helper from this physical J: folder. It is not the original M: checkout or the Carwow/6517 template. This folder has no Git repository; `.template/template.json` records ancestral commit `ab92ce9671fb1b56afa38f693755b41aee9c28b0` plus working files. The [source manifest](evidence/source-manifest.json) identifies the audited files.

Application source was not changed. This report does not certify current business inventory, successful staff delivery, hosting or production operations.

## Coverage and results

- Primary desktop: installed Chrome, 1440×900. Additional checks at 1024, 1280 and 1920px; transition checks at 768, 991 and 992px and landscape at 844×390. [Full coverage](COVERAGE.md).
- Every retained vehicle (8) and article (9), plus home, inventory, About, blog, five contact intents, two empty states and three errors: **31 primary captures per layout**. Supplemental article captures complete the initial route batch.
- All 28 non-error states returned 200 per layout, with no captured page JavaScript errors, broken visible images or document-wide horizontal overflow. Three expected error states returned 404. All 84 checked internal URL entries had successful final responses.
- `npm run validate` passed: architecture, assets, Svelte check with 0 errors/0 warnings and production build. The dedicated desktop-discovery suite passed home/inventory at 1024, 1440 and 1920px, including sticky search, draft state, filters and focus.
- The large general smoke suite logged all 28 initial desktop checks as PASS, then failed mobile assertions and timed out in a mobile quick-picker sequence. **The general suite remains incomplete, not passing.** Its early desktop successes do not erase that result.
- The first YouTube video played at 3.08s, readyState 4, paused=false. The stop control restored trigger focus. Maps on About, detail and Contact rendered on settled revisits; early blank full-page captures are not evidence of broken embeds.
- Real-device behavior, full screen-reader testing, zoom/text enlargement, production performance, provider delivery and public deployment were outside verified coverage.

Evidence: [routes](evidence/routes.json), [widths](evidence/edges.json), [interactions](evidence/interactions.json), [verified follow-ups](evidence/followup.json), [smoke logs](evidence/existing-smokes.log), [general suite log](evidence/sveltekit-smoke.log).

## What should stay

- Header hierarchy is clear: contact context above navigation, then enquiry and inspection actions. Mega-menu ArrowDown, Escape and trigger focus return passed.
- Keep the compact detail header, the desktop grid density and prominent prices. All eight title/price variants fit in reviewed layouts.
- Preserve home/inventory discovery continuity and the sticky search bar. Do not unify desktop and mobile by forcing the same composition onto both.
- Keep current colors and route-specific artwork. Multiple route colors here are an existing design decision, not grounds for a generic one-color redesign.
- Preserve the typed inventory and article data, shared cards and native dialogs. Preserve the calculator's honest principal-only explanation and local draft wording.

## Findings

P1 = material presentation/readability/journey issue. P2 = bounded usability or consistency repair. Shared mobile findings are cross-referenced so the implementation backlog can deduplicate them.

### D01 · P1 — The data looks more complete than its item-level evidence

Exact vehicle prices, mileage and equipment appear across grids and detail pages. Yet the BMW entries 4/7 share an image with different figures; Mercedes 6/8 share an image while record 8 has conflicting body/category labels. Equipment is justified at model-family level in a source comment. About separately contains explicitly labelled sample team members and partner logos.

This is a reusable **source-branded candidate**, not a ready identity pack for another dealer. Before presenting a client-specific version, replace/confirm the records against the lead's own evidence. Keep provenance per stock item, optional verified fields, and a deliberate way to disable unsupported team/partner sections. Do not invent data to fill the layout.

**Acceptance:** Every client stock record, price, image and claim has approved provenance; no source dealer watermark/identity or sample person leaks into a new lead's presentation. Conflicting category data is resolved, not simply translated.

Sources: [inventory](J:/cars/templates/auto-best/src/lib/data/inventory.ts:31), [demo content](J:/cars/templates/auto-best/src/lib/data/demo-content.ts:14). Evidence: [all vehicles](evidence/montage-desktop-vehicles.jpg), [About](evidence/desktop-about.png). Shared: M01/M10.

### D02 · P1 — Enquiry and finance handoffs drop the selected car

The finance calculator changes correctly: €68,804 minus €10,000 over 12 months shows €58,804 principal and €4,900 rounded principal/month. An excessive deposit clamps to the car price. However, its enquiry link passes a vehicle title that the contact loader never reads. Inspection links carry only a topic. “Изпратете запитване” leads to contact information rather than a vehicle enquiry.

Carry a validated vehicle ID through existing contact intent, show that car at the destination, and align CTA wording with the actual next step. Keep calculation assumptions; no lending feature or backend is implied.

**Acceptance:** Every vehicle-specific action retains the selected car. Unknown IDs show a safe fallback. A caller knows which vehicle is being discussed; an action labelled “send” does not merely open contact details.

Sources: [detail actions](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/+page.svelte:169), [finance](J:/cars/templates/auto-best/src/lib/components/vehicles/VehicleFinanceCalculator.svelte:68), [contact loader](J:/cars/templates/auto-best/src/routes/contact/+page.ts:4). Evidence: [finance changed](evidence/1440-finance.png), `verified-finance-handoff` in follow-up data. Shared: M02.

### D03 · P1 — A missing CSS token breaks the focus ring

`--dn-focus` is referenced by finance/detail focus styles but never defined. The finance select receives keyboard focus and matches `:focus-visible`; its computed outline style is `none`. A thin red border survives, but the intended 3px indicator is absent.

Define a canonical focus token, use it consistently and guard against unresolved custom properties. Verify the affected input, select, CTA, tabs and related links across light/dark surfaces.

**Acceptance:** Every affected keyboard stop has a clear visible indicator, and forced-colors behavior remains usable. Check actual computed/rendered focus, not just existence of a `:focus-visible` rule.

Sources: [calculator](J:/cars/templates/auto-best/src/lib/components/vehicles/VehicleFinanceCalculator.svelte:137), [detail CSS](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/detail.css:171). Evidence: [focused select](evidence/1440-keyboard-focus.png), follow-up focus measurements. Shared: M07.

### D04 · P2 — Visible Back actions reset the user's list

From two BMW results sorted by ascending price, entering vehicle 4 and clicking “Назад” returns to all eight vehicles with no query. Article Back also points to an unfiltered index.

Retain a safe internal return URL and useful scroll position. Avoid an unconditional `history.back()` that might leave the site after a direct visit; provide a deterministic index fallback.

**Acceptance:** List → detail → visible Back preserves keyword, facets and sort. Direct detail visits still return safely to inventory. Verify article search/category round trips too.

Sources: [vehicle Back](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/+page.svelte:64), [article Back](J:/cars/templates/auto-best/src/routes/blog-detail/[id]/+page.svelte:22). Evidence: `verified-detail-back` in follow-up data. Shared: M03.

### D05 · P2 — Gallery and team overlays look interactive without providing actions

The red-list marker at the lower-right of a vehicle photo is a decorative div, not a gallery control. Team photo social symbols are spans with pointer cursors and hover colors; they have no destinations. Demo labels make the team provenance honest, but do not make inactive controls useful.

Remove false interaction cues. Only add real gallery/social behavior when the underlying media/destinations exist. Keep the established card and image geometry.

**Acceptance:** Every pointer/hover control has an accessible action and a real destination; purely decorative content has no misleading affordance.

Sources: [gallery](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/+page.svelte:92), [team socials](J:/cars/templates/auto-best/src/lib/components/company/AboutTeam.svelte:33). Evidence: [vehicle detail](evidence/desktop-vehicle-1.png), [team hover](evidence/1440-team-hover.png). Shared: M04/M10.

### D06 · P2 — Stock discovery promotes empty categories

Home's brand/body library and the mega-menu promote choices absent from the eight-car sample. Kia, Sedan and New cars all produce zero results. The explicit empty state is correct; the prominence of dead-end starting choices is not helpful.

Drive default stock discovery from active inventory with counts. If the dealer also sources these categories, distinguish a sourcing enquiry from browsing available stock. Preserve the existing tiles and menu layout.

**Acceptance:** Recommended browse destinations have matching results, or clearly identify their different sourcing purpose. Genericization does not leave stale source-only option lists.

Sources: [home data](J:/cars/templates/auto-best/src/lib/data/home.ts:3), [navigation](J:/cars/templates/auto-best/src/lib/data/navigation.ts:30), [listing options](J:/cars/templates/auto-best/src/lib/data/listing.ts:25). Evidence: `home-discovery-1440` in interactions. Shared: M05.

### D07 · P2 — Article teasers do not open their advertised content

All three home guide cards open `/blog`; the specific guide features in the “Полезно” mega-menu also point to the general index. Their titles suggest a specific answer.

Use canonical article/service destinations that match the teaser. Connect home teasers to the article dataset where appropriate. Keep the index action for “Вижте всички статии”.

**Acceptance:** Clicking a specific topic reaches its answer, and title/image/destination remain consistent after content changes.

Sources: [home editorial](J:/cars/templates/auto-best/src/lib/data/home.ts:29), [navigation](J:/cars/templates/auto-best/src/lib/data/navigation.ts:120). Evidence: [home](evidence/desktop-home.png). Shared: M06.

### D08 · P2 — Article sidebar length overwhelms short articles

All nine articles have two brief sections. A stack of five sidebar widgets determines the page height, leaving a large empty area below the article column. On mobile the same stack becomes a long tail. The issue is visible in every article, so it belongs in the shared layout.

Reduce redundant supporting navigation and tighten widget spacing/grouping while preserving useful search, related-reading and contact paths. Do not add filler copy or stretch the article card to match the sidebar.

**Acceptance:** The article is the primary content, its next useful action is easy to identify, and the layout remains balanced for the shortest and longest retained articles.

Source: [article layout](J:/cars/templates/auto-best/src/routes/blog-detail/[id]/+page.svelte:67). Evidence: [all desktop articles](evidence/montage-desktop-articles.jpg). Shared: M11.

### D09 · P2 — Repeated navigation has no keyboard skip path

First Tab reaches the header phone link on desktop. There is no skip-to-main link and no stable main ID. Mega-menu keyboard behavior itself passed; the missing bypass is a separate shared-shell issue.

Add a focus-visible skip action targeting the main content without changing the normal header appearance.

**Acceptance:** First Tab exposes the bypass and Enter places focus at content on every public/error route. Shared: M12.

Source: [SiteShell](J:/cars/templates/auto-best/src/lib/components/layout/SiteShell.svelte:11). Evidence: `first-tab` in [follow-up data](evidence/followup.json).

### D10 · P2 — Internal body keys become inconsistent customer-facing labels

The same inventory uses Bulgarian card categories and English detail/filter values, including “Wagon”. The data model also stores both `category` and `body` without a consistency guarantee.

Introduce a stable code-to-label mapping and use it in every surface. Confirm the underlying vehicle category before changing its display label. Preserve existing query keys through normalization if needed.

**Acceptance:** Cards, filters, chips and detail agree on category and language; old shared filter URLs still resolve.

Sources: [overview](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/+page.svelte:48), [listing model](J:/cars/templates/auto-best/src/lib/data/listing.ts:25). Shared: M13.

### D11 · P2 — CSS-hidden hero assets still download

A fresh desktop home visit downloaded the hidden mobile front-car image (61,626 encoded bytes) and the hidden old hero (41,178 bytes, still marked high priority). The mobile visit downloaded the hidden desktop side cars and old hero: 190,500 encoded bytes across those three unique URLs. These are local request measurements, not production performance scores.

Remove permanently retired hero markup after confirming it has no retained variant. Use media-aware image delivery for the approved responsive artwork. Preserve the visible cars; do not solve this by removing intentional art. Do not count a shared image as waste merely because one of its several DOM instances is hidden.

**Acceptance:** Fresh mobile/desktop requests load the appropriate hero assets; the visible composition remains identical; obsolete images no longer compete with above-the-fold content.

Sources: [Hero](J:/cars/templates/auto-best/src/lib/components/home/Hero.svelte:1), [HeroVehicles](J:/cars/templates/auto-best/src/lib/components/ui/HeroVehicles.svelte:1), [global overrides](J:/cars/templates/auto-best/src/app.css:559). Evidence: `hidden-images` in [final probes](evidence/final-probes.json).

## Presentation boundary

The local master is usable for an owner review of the design. A sendable lead demo still needs the lead's confirmed identity, stock, contacts and permitted media, removal/disablement of unsupported sample sections, and a tested public preview when publication is requested. Passing a local build does not complete those steps.

Implement shared findings once, then recheck both layouts. The proposed order and component boundaries are in [ARCHITECTURE-AUDIT.md](ARCHITECTURE-AUDIT.md) and [REFACTOR-HANDOFF.md](REFACTOR-HANDOFF.md).
