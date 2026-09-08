# Carwow master repair and before/after review

Date: 8 September 2026. Target: **J:/cars/templates/carwow**. Local review: http://127.0.0.1:6463/. This is the independent Carwow library master derived from the historic 6517 source, not the running M: project or any client copy. No Git repository exists in this master. Source baseline and hashes were saved before editing. No commits, deployment, CRM change or real message/lead was sent.

[Open the interactive before/after viewer](before-after.html). Choose a route and mobile/desktop; both screenshots can scroll independently or together. [Changed source manifest](changes.json). Architecture, styling and content agents worked in separate file ownership lanes, integrated and checked by the parent.

## Outcome

Retained the yellow desktop and compact black/red mobile compositions. Fixed task outcomes, shared URL/calculation/content contracts, modal focus, support-page density and component consistency. This is a repaired source-branded candidate for local review, not a genericized or publicly accepted dealer release.

| Audit findings | Result | Evidence / remaining boundary |
|---|---|---|
| M01 | Repaired | Direct/reloaded/shared request URLs start intake. Confirmation depends on validated successful API response. Browser interception proves failure then success, reload and Back cannot invent success. Fields stay in component memory instead of being put into a success URL. Real lead persistence/delivery not tested. |
| M02 / D01 | Repaired | One pure EUR finance model, input validation and detail query handoff. Price/term edits update summary; invalid data produces no payment. Explicit hypothetical assumptions, not offered finance terms. |
| M03 | Repaired | Phone text is dark on white; measured 44px target at 320/430. Existing telephone destination retained. |
| M04 / D08 | Repaired | Both vehicle names and remove/replace actions precede table; sticky 96px phone label column, scroll instructions, semantic H1. Removal persists in garage. Desktop table retained. |
| M05 | Repaired | Native modal + shared explicit Tab containment; search, all filters, brand, model, sort and price submode checked. Escape restores original trigger. Existing Menu dismissal checked. |
| M06 | Repaired | Shared parse/serialize/match contract, Apply vs Cancel, URL sorting and explicit results/reset count. BMW Apply/reload and draft cancel checked; desktop URL sorting now serialized too. |
| M07 / D02 / D10 | Demo boundary repaired | Home/detail/list use same nine sample reviews and derived sample statistics. Team identities agree with profile destinations. Prominent demonstration disclosures added, including mobile About. Unsupported home guarantee replaced by appointment wording. Actual reviews/staff/guarantee conditions still need approval. |
| M08 / D03 finance | Misleading estimate removed | Source inventory card/detail monthly strings use finance-by-enquiry wording; source prices retained. Calculator illustrative assumptions stay visible. No finance offer invented. |
| M09 / D05 | Consistency repaired; verification pending | Phone/address/hours and map queries share site data. Conflicting schedules replaced by appointment guidance. Map queries use the same source address; verified place pin and real hours remain owner prerequisites. |
| M10 / D09 | Repaired locally | Flat chat styling and honest contact status. Mobile chat entry follows page content, so it no longer floats over inventory/comparison. Open chat uses one native modal task layer with explicit focus containment and Escape return. API errors remain honest; no real chat delivery tested. |
| M11 | Repaired | Existing photo favorite/compare actions have 44px targets and legible white backgrounds/selected states without enlarging cards. |
| M12 / D03 stock | Repaired | Availability is first displayed badge, separate from promotional flags. Incoming detail structured data uses PreOrder instead of literal InStock. Source prices and listing identities preserved. |
| M13 | Repaired | Footer family translation/gutter corrected once. Field bounds: 16–304px at width320, 16–414px at width430; link groups use native disclosures. |
| M14 | Repaired within existing layouts | Blog search/categories move above mobile article stream; compact article/team/recommendation rows and profile geometry. Blog 8377→5220px, team profile 7683→4985px, dealer profile 7761→5318px in matching 390px captures. Content/routes retained. |
| M15 / D11 | Local implementation repaired | Share URLs use actual canonical site origin/path. Public production origin still needs hosted verification. |
| M16 / D04 policies | Misleading links removed | Footer retains actual Terms destination; duplicate Terms prose removed. No privacy/cookie policies invented. Approved legal content remains a public-release prerequisite. |
| M17 | Repaired | Available budget choices appear first, truthful zero choices retained lower; diesel/petrol shortcuts precede electric. No stock/count invented. |
| M18 / D12 | Repaired | Reviews/Compare H1, article H2 preserving visual scale, FAQ group spacing and duplicated Terms cleanup. |
| D04 other labels | Repaired | Person utility describes contact; footer calculator label describes finance calculation. Existing destinations retained. |
| D06 | Repaired in specified families | Favorites/Financing use established desktop black primary actions; supporting panels flat; mobile red actions preserved. Component-pattern ownership documented. |
| D07 | Repaired locally | Photo/video contact handoff carries known vehicle slug/lot/title and subject into both contact forms. Message builder preserves context without inventing a database UUID. Browser navigation and helper tests pass. |
| D13 | Repaired | Placeholder news entries reclassified as guides, original slugs/dates retained; substantive buying guide featured. No fresh stock/news claims generated. |

## Validation

- `npm run check`: **0 errors, 0 warnings**.
- `npm run test:unit -- --run`: **19 tests passed**, four files; finance arithmetic/invalid inputs, URL contracts, contact handoff and existing garage tests.
- `npm run build`: passed with the retained Vercel adapter. Calculator/Contact now render on request because their initial content depends on query parameters; the first build exposed the old prerender setting, which was corrected.
- [Focused browser verification](verification.json): eight cases pass, including intercepted Sell failure/success, calculator change/error/handoff, mobile filter persistence, compare and chat at320/390/430/1440, and gallery contact handoff. Browser fixtures are not backend acceptance.
- [Modal modes](modal-modes.json): seven cases pass, including price submode and Menu Escape/focus return.
- [Matched route captures](after.json): 20 routes ×390/1440, plus populated comparison/chat states; no recorded page errors, broken visible images or document overflow.
- [Edge widths](edges.json): 13 routes ×320/430/1280/1920; no recorded page errors, broken visible images or document overflow. Inventory root-font enlargement smoke passed at320/430; this is not full accessibility/device certification.
- Svelte autofixer: no issues on changed components. Reviewed suggestions concern deliberate DOM dialog effects/bindings and URL synchronization. Detector map-grid and existing Sell modal-backdrop findings were retained as functional incumbent patterns.
- [Inherited visual suite](visual-suite.log): **6 snapshot comparisons fail** against old Home/Inventory/Detail baselines. Baselines were not overwritten. Substantial drift predates this repair: current-before desktop Home was4672px versus stored5421px; Inventory3795px versus stored5485px. Current-before→after desktop Inventory stays3795px; Home4672→4721 and Detail4512→4636 reflect shared content/chat changes. The new matched captures provide this task's review evidence; the old snapshot gate is not green and baseline acceptance remains explicit review work.

## Architecture and pattern handoff

- [Architecture](../../../templates/carwow/docs/ARCHITECTURE.md): shared finance, inventory URL/matching and modal focus behavior. Separate layouts preserved; no monolithic replacement or mass file extraction.
- [Component patterns](../../../templates/carwow/docs/COMPONENT-PATTERNS.md): action/panel/field families, responsive support layouts, footer ownership and states.
- [Content contracts](../../../templates/carwow/docs/CONTENT-CONTRACT.md): sample reviews/team, site facts and contact intent. Source branding remains intentionally present.

## Limits before public delivery

Actual staff delivery, database writes, authenticated admin, production performance, physical mobile keyboards and full assistive-technology coverage were not certified. Real business hours, exact map pin, reviews/team evidence, approved policies and hosted canonical origin still need business/provider verification. No private credentials were added. Existing client copies and M: source remain independent and unchanged.

The source snapshot and old Vite optimizer cache are retained for recovery. Initial cold-runtime/optimizer timing caused false readiness assumptions; final listener identity and rendered route were checked. Local preview is for review only.
