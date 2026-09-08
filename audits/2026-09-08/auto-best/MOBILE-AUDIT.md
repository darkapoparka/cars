# Auto Best — mobile UI, UX and styling audit

8 September 2026 · `J:/cars/templates/auto-best` · reviewed at <http://127.0.0.1:6461/>.

## Decision

**Keep the existing mobile design and repair the specific issues below before presenting a personalized lead demo.** The inventory rows, bottom navigation, search sheets, Sell/Import composition and restrained red/black actions are a sound foundation. A new shell or visual redesign is unnecessary.

This is an audit of the reusable **Auto Best** master, version `2026.09.06-refresh-1`, not the original M: Day & Night project and not Carwow/6517. `5173`, `6511` and `autodeal-best` are catalog aliases for this master; its local library preview is 6461. The directory is physical, not a junction, and has no Git repository. Its recorded provenance is source commit `ab92ce9671fb1b56afa38f693755b41aee9c28b0` **plus source working files**, not an exact clean-commit identity. Current audit hashes are in [source-manifest.json](evidence/source-manifest.json).

No application source was edited. Reports, audit scripts/screenshots, generated validation output and an owned preview were created. No lead message, real enquiry, CRM update, commit, push or deployment was performed.

## Evidence and coverage

- Chrome/Playwright at 390×844, with touch emulation for the primary mobile route capture. Additional browser viewport checks cover 320, 430, 768, 991 and landscape 844×390; shared desktop boundary checks are also recorded. These are not physical Safari/iPhone/Android tests.
- All eight vehicle details and all nine articles received mobile and desktop captures. Home, inventory, About, blog, five contact intents, two empty states and three error routes were included: **31 route/state captures per primary layout**. See the complete [coverage matrix](COVERAGE.md).
- All 28 non-error states at each primary width returned 200. The three intentional error routes returned 404. No page JavaScript errors, broken visible images or document-wide overflow were recorded on the non-error route captures. The expected 404 console responses are not application crashes.
- Fifty-four additional route/viewport combinations had zero document-wide overflow. This does not alone certify scroll regions, focus, contrast or content truth.
- All 84 checked internal URL entries returned successful final responses, including sampled legacy redirects and machine-readable routes. Query-string variants are counted separately.
- `npm run validate` passed: 77 application/configuration files checked, 98 assets checked, zero Svelte errors/warnings and a successful production build. The separate mobile-filter and enquiry smoke checks passed. **The large general smoke suite did not pass**; see the qualification note below and [architecture report](ARCHITECTURE-AUDIT.md).
- Full-page screenshots can show the fixed dock near their top: that is capture behavior, not a repeatedly inserted dock. Maps initially look blank in some captures; settled revisits rendered successfully. First-video playback was observed at 2.45s on mobile, readyState 4, paused=false.
- Actual message delivery, client business facts, hosted deployment, production performance, full screen-reader behavior, browser zoom/text enlargement and physical software keyboards were not certified.

Primary evidence: [route data](evidence/routes.json), [remaining articles](evidence/supplemental-articles.json), [width checks](evidence/edges.json), [interactions](evidence/interactions.json), [follow-up verification](evidence/followup.json), [final probes](evidence/final-probes.json). Use the follow-up records for finalized navigation URLs; a few initial interaction observations sampled URLs before Svelte navigation had settled.

## Preserve

- Inventory at 390px starts immediately with search, quick filters and compact vehicle rows. Cards keep title, price, year, mileage, fuel and gearbox readable. Do not add a large inventory hero on mobile.
- Keep the five-item bottom navigation, the dedicated vehicle-detail action bar and the current separate desktop composition.
- Keep native dialogs, full-screen nested filter pickers, draft/apply separation, URL-backed applied filters, model reset on make change and empty-state recovery.
- Keep Sell/Import drafts truthful: photos stay local; review explicitly says the enquiry has not been sent. Do not replace this with a fake success screen.
- Keep the reactive principal calculator and its explicit exclusion of interest, fees and insurance. It is not the frozen 6517 calculator.
- Keep the existing Onest typography, semantic colors, artwork and icon families. No new decorative effects, carousel chrome, marketing sections or generic dashboard components are required.

## Findings

P1 = resolve before a convincing unrestricted lead walkthrough. P2 = focused usability, consistency or accessibility improvement. There is no confirmed P0 functional blocker in the audited flows.

### M01 · P1 — Stock records need item-level evidence before they can represent a lead

**Observed:** All eight vehicles look like concrete stock: exact year, mileage, price and equipment. Vehicles 4 and 7 reuse the same BMW image with different figures; 6 and 8 reuse the same Mercedes image. Record 8 says `body: Coupe`, `category: Спортбек`, and uses the same photo as “GT 4-Door”. Equipment provenance is a comment about model families, not evidence attached to each vehicle. These are unresolved sample-data issues; this audit did not establish that any particular price or car is false.

**Improve:** Give each retained client vehicle an approved source record, its own confirmed imagery and an explicit availability status. Treat unknown equipment as unknown. For the shared master, make sample data distinguishable in configuration and qualification checks. Do not invent replacements or infer stock from a similar model.

**Acceptance:** Each visible card/detail pair resolves to the same verified vehicle; category, photo, mileage and price agree; sample records cannot be mistaken for the new lead's inventory during final qualification.

Source: [inventory.ts](J:/cars/templates/auto-best/src/lib/data/inventory.ts:31). Evidence: [all mobile vehicles](evidence/montage-mobile-vehicles.jpg), especially [vehicle 8](evidence/mobile-vehicle-8.png).

### M02 · P1 — Detail enquiries lose the vehicle, and some labels promise the wrong next step

**Observed:** “Получете реална оферта” carries `vehicle=Audi RS 6 Avant` to `/contact?topic=leasing`, but the destination ignores it and never displays the selected car. Inspection actions carry only `topic=inspection`. “Изпратете запитване” opens a general contact/phone surface; it does not open an enquiry for this car.

**Improve:** Carry a validated vehicle ID into the existing contact intent, show the selected car and keep it in the prepared request when appropriate. Make labels accurately describe calling, opening contact options or preparing an enquiry. Preserve the existing journey rather than adding a backend implicitly.

**Acceptance:** Select any vehicle, enter through every inspection/finance/enquiry CTA, and see the same vehicle at the destination. Direct links with unknown IDs recover honestly. A label saying “send” must not merely navigate to phone information.

Sources: [detail actions](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/+page.svelte:169), [finance link](J:/cars/templates/auto-best/src/lib/components/vehicles/VehicleFinanceCalculator.svelte:68), [contact loader](J:/cars/templates/auto-best/src/routes/contact/+page.ts:4). Evidence: `verified-finance-handoff` in [followup.json](evidence/followup.json).

### M03 · P2 — The visible Back action discards discovery state

**Observed:** `/listing-grid?make=BMW&sort=price-asc` shows two results. Open vehicle 4, then use the image Back button: it returns to `/listing-grid`, showing all eight. Both visible detail Back links have a fixed unfiltered destination. Article Back similarly points at `/blog` rather than the preceding category/search.

**Improve:** Preserve a safe internal return URL and, where practical, the previous result position. Keep a sensible inventory/blog fallback for a direct detail visit. Browser history and explicit Back links should be tested separately.

**Acceptance:** Make, sort, keyword and scroll position survive a list → detail → visible Back round trip; external return destinations are never accepted.

Sources: [vehicle back](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/+page.svelte:64), [article back](J:/cars/templates/auto-best/src/routes/blog-detail/[id]/+page.svelte:22). Evidence: `verified-detail-back` in [followup.json](evidence/followup.json).

### M04 · P2 — The photo has a control-shaped decoration that does nothing

**Observed:** The white circular red-list marker over the vehicle photo looks tappable. It is an `aria-hidden` div containing three spans. There is one image and no gallery button.

**Improve:** Remove the decorative control affordance. Add actual gallery behavior only when approved additional photos exist. Do not build a carousel around a single photo to justify the icon.

**Acceptance:** Every control-shaped item over imagery has a real, named action; a one-image listing does not imply extra images.

Source: [detail markup](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/+page.svelte:92). Evidence: [detail viewport](evidence/mobile-vehicle-1-top.png), `gallery-390` in interactions.

### M05 · P2 — Prominent discovery choices lead directly to empty stock

**Observed:** Home promotes Kia, Toyota, Jeep and Nissan among the first mobile brand tiles, while this sample stock contains Audi, BMW, Mercedes-Benz and Land Rover. Kia, Sedan and New vehicles were explicitly tested and returned zero results. The empty recovery works; the initial recommendations are the problem.

**Improve:** Derive in-stock discovery choices/counts from the active inventory. If a choice represents sourcing/import rather than available stock, make that intent explicit and route accordingly. Keep the current tile/rail geometry.

**Acceptance:** Prominent stock tiles return matching inventory or honestly describe a sourcing request; absent stock is not presented as a useful default browse choice.

Sources: [home data](J:/cars/templates/auto-best/src/lib/data/home.ts:3), [navigation](J:/cars/templates/auto-best/src/lib/data/navigation.ts:30). Evidence: `home-discovery-390` in interactions.

### M06 · P2 — Specific home guide cards all open the generic blog index

**Observed:** Cards titled “Има ли офис в София…” and the inspection/import questions all point to `/blog`. The reader then has to identify the relevant article again. Some corresponding desktop mega-menu features do the same.

**Improve:** Map each teaser to a matching article or the actual contact/service destination. If no matching article exists, correct the teaser rather than inventing editorial content. Reuse canonical article records for title, image and URL where appropriate.

**Acceptance:** Each specific teaser opens content that answers its title; the “all articles” link remains the generic index.

Source: [home editorial records](J:/cars/templates/auto-best/src/lib/data/home.ts:29). Evidence: [mobile home](evidence/mobile-home.png), [blog index](evidence/mobile-blog.png).

### M07 · P1 — A missing focus token removes the intended keyboard outline

**Observed:** Finance input/select/link and some detail styles use `var(--dn-focus)`, but that token is not defined. On the focused finance select, `:focus-visible` is true while computed outline style is `none`. A 1px red border remains; the intended 3px ring does not.

**Improve:** Define and consistently use the existing system's focus color, including a visible high-contrast fallback. Verify related links and tabs; changing one select alone leaves the shared defect.

**Acceptance:** Keyboard focus is clearly visible on every affected control, at 390 and 1440px, without relying only on a subtle border-color change. Add an unresolved-token guard.

Sources: [calculator focus](J:/cars/templates/auto-best/src/lib/components/vehicles/VehicleFinanceCalculator.svelte:137), [detail focus](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/detail.css:171). Evidence: [keyboard focus](evidence/390-keyboard-focus.png), `finance-keyboard-focus` in follow-up data.

### M08 · P2 — A missing vehicle still gets a vehicle-specific action bar

**Observed:** `/listing-detail-v1/999` correctly returns 404, but its bottom bar still says “Заявете оглед” and “Обадете се”. Header chooses the detail bar from the pathname alone.

**Improve:** Use resolved page status/data to choose the action bar. On a missing vehicle, keep ordinary navigation or a recovery action for inventory.

**Acceptance:** Invalid/missing vehicle URLs cannot invite an inspection of an unresolved vehicle. Valid detail routes retain the existing dock.

Source: [Header](J:/cars/templates/auto-best/src/lib/components/layout/Header.svelte:31). Evidence: [missing vehicle](evidence/mobile-vehicle-missing.png).

### M09 · P2 — The custom mobile menu needs background isolation

**Observed:** Initial focus, 19 successive Tab presses, Escape and trigger focus return passed. However, the `aria-modal` div does not make the rest of the document inert. Its current safety depends on a manual keyboard loop. Full screen-reader behavior was not tested, so this is a hardening gap rather than a claimed reproduced screen-reader failure.

**Improve:** Keep the same menu but use native modal behavior or explicit background inertness with reliable cleanup. Reuse a tested lifecycle pattern with the other dialogs.

**Acceptance:** Focus and assistive navigation stay in the open menu, background controls cannot be activated, and navigation/unmount/Escape restores the document and trigger appropriately.

Source: [menu implementation](J:/cars/templates/auto-best/src/lib/components/layout/Header.svelte:151). Evidence: `mobile-menu` in interactions and [menu screenshot](evidence/390-menu.png).

### M10 · P1 for lead delivery — About still contains sample people/partners and fake social affordances

**Observed:** About openly labels the four English-name team profiles and six partner logos as demo content. This is honest, but unfinished for a lead. The social symbols inside team photos are noninteractive spans, yet receive a pointer cursor and hover styling.

**Improve:** Enable these sections only when approved client records exist. Otherwise omit them from the personalized copy. Use real social links only when supplied; decorative symbols should not behave visually like controls. Preserve the section design for clients who have the content.

**Acceptance:** No source demo person, partner logo or inactive social control remains in a presentation claimed ready for a particular lead.

Sources: [demo records](J:/cars/templates/auto-best/src/lib/data/demo-content.ts:14), [AboutTeam](J:/cars/templates/auto-best/src/lib/components/company/AboutTeam.svelte:33). Evidence: [About](evidence/mobile-about.png), [team hover](evidence/390-team-hover.png).

### M11 · P2 — Short articles inherit a long stack of secondary navigation

**Observed:** Each article contains two short sections followed by search, categories, related articles, a contact panel and popular topics. On mobile this supporting stack dominates the length of the page. No clipping was found; the issue is hierarchy and repeated navigation.

**Improve:** Make the existing supporting widgets more compact and prioritize the next useful article/contact action. Consolidate duplicate category/tag navigation where it provides the same choice. Do not pad the article with generic copy to fill space.

**Acceptance:** The article remains the visual focus; related content is easy to reach; all retained navigation is still available. Compare all nine articles after a shared change.

Source: [article layout](J:/cars/templates/auto-best/src/routes/blog-detail/[id]/+page.svelte:67). Evidence: [nine articles](evidence/montage-mobile-articles.jpg).

### M12 · P2 — Keyboard users cannot skip the repeated shell

**Observed:** First Tab reaches the logo; there is no skip-to-content link or stable main target. The shared shell renders an unlabelled-by-ID `<main>`.

**Improve:** Add one visually hidden, focus-visible skip link and a stable main target. Keep it out of the ordinary visual composition.

**Acceptance:** First Tab reveals the skip action; Enter moves focus to page content on normal and error routes.

Source: [SiteShell](J:/cars/templates/auto-best/src/lib/components/layout/SiteShell.svelte:11). Evidence: `first-tab` in follow-up data.

### M13 · P2 — Internal body codes leak into the Bulgarian interface

**Observed:** Audi's detail shows “Категория / Wagon”; filters expose `Coupe`, `Wagon`, `Sportback`, while cards use Bulgarian labels such as “Комби”. Record 8 also has conflicting body/category labels.

**Improve:** Keep stable internal facet keys and a single Bulgarian display-label mapping. Resolve data conflicts separately; translation must not disguise them.

**Acceptance:** The same body type has the same human-readable label across cards, quick filters, full filters, detail and URL chips. Existing shareable URLs continue to work.

Sources: [detail overview](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/+page.svelte:48), [listing options](J:/cars/templates/auto-best/src/lib/data/listing.ts:25). Evidence: [detail viewport](evidence/mobile-vehicle-1-top.png).

## Qualification notes and false positives avoided

- The general smoke suite expected a 28px campaign icon and a 44px anchor box. Current icon width is 32px; the text anchor is 20px high but its pseudo-element covers the 178×144px card. **Do not enlarge these cards just to satisfy the stale box assertion.** Retest actual hit areas and reconcile the intended icon baseline.
- That suite later timed out selecting BMW in a quick picker and did not reach its final report. The same Audi/model → BMW change passed independently after explicit readiness, clearing the old model and preserving sort. The full-suite timeout remains unresolved; it is not proof that ordinary brand changes are broken.
- The dedicated mobile-filter suite passed all four tested sizes, including invalid/zero-result states and nested focus return. Enquiry tests passed 320, 390, 844 and 1440px using mocked sharing/clipboard APIs. See [logs](evidence/existing-smokes.log).
- No invisible mobile phone CTA was found here. No frozen calculator or false “received your data” screen was reproduced. Those 6517 findings must not be pasted into this master audit.

## Repair order

1. Resolve selected-vehicle handoff and focus token; qualify stock and About content before lead delivery.
2. Repair Back state, gallery affordance, missing-vehicle dock and specific discovery/guide destinations.
3. Harden the menu/skip path, unify human-readable labels and tighten article supporting content.
4. Re-run the route matrix and reconcile the smoke suite against the preserved design.

See [desktop audit](DESKTOP-AUDIT.md), [architecture audit](ARCHITECTURE-AUDIT.md) and the bounded [implementation handoff](REFACTOR-HANDOFF.md).
