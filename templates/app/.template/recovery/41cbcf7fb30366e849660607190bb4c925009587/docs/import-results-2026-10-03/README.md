# Import search, country filters and demo listings — 3 October 2026

The owner's correction replaces the previous wrapped country enquiry buttons with search, a single scrolling row of country filters and import listing cards, in that order beneath the calculator banner. All, Germany, Canada, USA, Italy and the Netherlands filter the results. Search matches make, model, trim, year, fuel and localized country names, and combines with the selected country. The field shows the actual result count. Clearing search retains the country; the empty-result action resets both.

Five synthetic template listings use the shared VehicleCard composition and original generated photos. Each photo carries its country badge; a compact Demo / Демо label identifies the examples. Mobile keeps the 44% photo column, single-line title, larger euro price and one swipeable facts row beside the photo. Desktop retains two fact rows. Stock cards keep their existing links and desktop wishlist; import examples open enquiries instead of linking to unrelated stock details.

`lib/import-inventory.ts` isolates synthetic template records from dealer stock. Dealer mode reads only the initially empty `lib/dealer-import-inventory.json`; no examples are presented as that dealer's stock. The country configuration remains in `showroom.importCountries`. This local change does not refresh or publish client sites.

Card actions prefill the import enquiry's country, year/make/model and budget. Edited fields survive closing and reopening the same listing. A different listing preselects its own details. Users can choose a custom country and include a listing URL. Preparing the enquiry opens the existing local editable draft; it does not submit an order or message.

## Local browser verification

Preview: `http://127.0.0.1:6483`, canonical App master, Node 22.20.0. The stopped preview was restarted on the same free port before inspection.

| Locale | Viewport | Observed result |
| --- | --- | --- |
| BG | 320 × 740 | One pill row, all six targets 44px tall, five loaded photos, zero broken photos. Document width equals scroll width at 305px. The last country scrolls into view and its full Netherlands badge fits. |
| BG | 390 × 844 | Search, one pill row and Canada/USA cards visible together. Five loaded photos, zero broken photos, width equals scroll width at 375px. |
| BG | 768 × 1024 | One pill row and two card columns. Five loaded photos, no document overflow at 753px. |
| BG | 1440 × 1000 | One pill row and two card columns, all five photos loaded, no document overflow at 1425px. |
| EN | 320 × 740 and 390 × 844 | Localized controls and cards inspected. One row at 320px, 44px pill targets and no document overflow at 305px. |

Focused interaction checks:

- Each country filters to its corresponding single example and badge. Selecting a country does not open a dialog.
- Canada plus Toyota RAV4 yields one result; Canada plus Tesla yields none. Clear search retains Canada. Show all resets both controls and restores five results.
- English Audi A4 search returns the Netherlands car. USA selection returns the Tesla example.
- The Tesla card preselects USA, 2022 Tesla Model 3 and €22,900. Those details reach the editable draft.
- Back returns from the draft to its populated form. Escape restores focus to the listing action.
- An edited listing URL survives closing and reopening the same RAV4 enquiry. Choosing Швейцария as a custom country produces a draft with that origin, the car, budget and URL.
- The existing calculator banner opens the €25,000 example with its €396 monthly estimate.
- The ordinary Fortuner stock card still has two detail links, a single mobile facts row and no mobile wishlist. At desktop it retains a wishlist and the two facts rows. Its link opens the correct stock detail page with the €94,099 price.

No external messages were sent. Development route compilation was allowed to finish before inspecting loaded stock pages.

## Final evidence

- [Bulgarian mobile, 320px](bg-320.jpg)
- [Bulgarian mobile, 390px](bg-390.jpg)
- [Bulgarian desktop](bg-desktop.jpg)
- [English mobile, 390px](en-390.jpg)
- [Generated originals, runtime files and exact prompt set](../../public/showroom/imports/PROMPTS.md)

## Source validation

`npm run check` passed after the final enquiry-retention adjustment: ESLint, TypeScript and the production webpack build with Node 22.20.0, one build worker and isolated `.next-build-check` output. The final log is retained in `L:/CODEX/cars/runtime/app-import-results-2026-10-03/check-final.log`. Generated `next-env.d.ts` imports were restored to their original preview paths. `node scripts/workspace-doctor.mjs --fetch` completed; unrelated Cars changes, existing evidence and independent admin drift were preserved. App-scoped whitespace and staged-path checks complete the source handoff.
