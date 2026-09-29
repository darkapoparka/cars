---
target: Carwow mobile bottom-navigation routes and banners
total_score: 21
max_score: 32
na_heuristics: 5,9
p0_count: 0
p1_count: 0
target_identity: "file:J:\\template-repos\\cars-template-carwow\\src\\lib\\components\\home\\mobile\\MobileBottomDock.svelte"
target_fingerprint: "sha256:22a362d5457d0eabcc6a35b9748289bf1148ef2a8694a6e4219812422996b243"
target_path: "J:\\template-repos\\cars-template-carwow\\src\\lib\\components\\home\\mobile\\MobileBottomDock.svelte"
timestamp: 2026-09-12T21-29-47Z
slug: nents-home-mobile-mobilebottomdock-svelte-3d9500cd
---
Method: dual-agent (A: /root/design_review; B: /root/detector_review), with parent-operated Browser evidence. A completed before B findings entered synthesis.

Mobile design critique — 13 September 2026

The strongest improvements are the bottom navigation and banner system, followed by inventory readability and the manual Sell flow. The mobile UI is usable and automotive-specific through real dealer photography, but several controls and promotional cards look assembled from different visual systems.

Inspected Home (/), Cars (/inventory), Sell (/sell-your-car), Import (/contact?intent=import), and Menu at 390x844 and 320x740. Opened and closed Filters, the manual Sell form, and Import explanation. Warm navigation works. No horizontal document overflow in the checked pages; some content clips internally. Form submissions, error recovery, physical phone safe areas, and secondary Menu destinations were not tested.

1. [P2] Bottom navigation: retain five destinations and compact full-width layout. The 65px bar has 56px-high tap targets, but visually reads as a generic icon strip; active indication relies mainly on the red icon. Use consistent 22-24px icon optical weight, 12px labels, a restrained active background/marker, and coherent spacing. Do not add an oversized floating capsule. Menu uses a plus icon for Sell while the dock uses a tag. Suggested follow-up: polish.

2. [P2] Banners and lead-page action hierarchy: Home sell/import promotions use full-width photography and pill CTAs; Sell/Import manual-entry cards use inset images and circular arrows; phone cards add a third treatment. Essential form entry resembles an advertisement. Use one compact image/copy/action composition and explicit actions such as “Въведи данни” and “Опиши автомобила”. Remove the static drag handle above Sell/Import content. Keep real photography, make crops deliberate, and reserve the red emphasis for the next task action. Suggested follow-up: distill.

3. [P2] Inventory: preserve compact cards, but improve the narrow portrait-like image crop, reduce the repeated financing line, and quiet the specification chips. At 320px the financing text clips. Add a visible result count and current-filter summary. Normalize price presentation: the visible BMW card has decimals while adjacent cards do not; decide the formatting contract without changing actual prices. Suggested follow-up: layout.

4. [P2] Manual Sell flow: “Нямам номер или VIN” opens with registration number and VIN as the first fields. Only VIN is marked optional, although identifiers are not required when make/model are supplied. Lead this path with make/model/year/mileage and clearly mark identifiers as optional. Suggested follow-up: clarify.

5. [P2] Home and Menu density: Home repeats similar silver-car cutouts across budget/body tiles. At 320px the over-50000 price splits its euro symbol onto a separate line. Menu repeats three dock destinations, repeats the logo, and truncates “Автомобили” at 320px. Make it a readable secondary list centered on Saved, Compare, dealer information and support. Provide explicit Contacts: the Map link has /contact href but the source click handler opens the external map. Suggested follow-up: distill.

Preserve immediate Home search, real stock photography, price/stock counts, compact Inventory density, labeled navigation and the short three-step Import explanation. Empty white space on focused Sell/Import pages is not itself a problem and should not be filled with more promotional sections.

Provisional Nielsen assessment (design judgment; untested behaviors excluded):

| Heuristic | Score /4 | Evidence |
|---|---:|---|
| System status | 2 | Active tab/steps present; matching inventory count not visible |
| Real-world match | 3 | Clear Bulgarian labels; manual-entry mismatch |
| Control/freedom | 3 | Sheets close; static handle misleading |
| Consistency | 2 | Multiple banner grammars and duplicate navigation |
| Error prevention | n/a | Not exercised |
| Recognition | 3 | Labeled navigation, fields, filters |
| Efficiency | 3 | Quick filters/manual alternatives; weak result summary |
| Minimalist design | 2 | Repeated promotional/grid treatments |
| Error recovery | n/a | Not exercised |
| Help | 3 | Concise Import explanation and phone assistance |
| Total | 21/32 | Provisional; not release acceptance |

Persona risks: first-time buyers must decipher cropped photos and lack a visible result summary; sellers without identifiers meet identifier fields first; hurried phone users encounter inconsistent arrows and a nonfunctional drag affordance. The emotional journey starts confidently with real stock, loses clarity through repeated promotions, and recovers in the concise Import explanation.

Deterministic scan: 20 Svelte markup files, one advisory for a decorative grid in the location drawer's map panel (mobile-home-sheets.css:448); no priority finding in the reviewed main surfaces. The phone-link autofixer warning is a tel: false positive. A clean scan does not validate design quality.

Runtime: owned Vite PID 7208 serves the confirmed J:\template-repos\cars-template-carwow checkout, main at d769bb0558ad0228b92440fc3fd9ff81548bc890 with substantial existing dirty work. Startup/cold navigation triggered dependency optimization and an earlier dynamic-module fetch failure; after reload/warmup the main pages rendered. No current disk-space error was observed. The server remains running as requested. No source/design edits, commits or publication.

Screenshot evidence: C:\Users\radev\.codex\visualizations\2026\09\12\01a09773-8190-70c0-8776-104c2d9a3a7b\mobile-*.png (Home, banners, Inventory, Filters, Sell, Sell form, Import, Import info, Menu, plus 320px route checks).

Questions skipped: the user already prioritized bottom navigation and banners; this request was an audit. Recommended first implementation pass: dock and shared banner/action treatment, then narrow-width fixes and manual-Sell copy/order.
