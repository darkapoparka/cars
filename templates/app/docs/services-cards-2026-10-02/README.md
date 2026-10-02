# Services search, filters and original imagery

The owner's latest correction replaces the Services landing-page make selector with service discovery. The page order is banner, search, category pills, image cards and the existing care campaign. The two existing categories remain Servicing and Diagnostics; no new service, fixed price or booking promise is introduced.

`lib/service-catalogue.ts` owns the names, checks, images and stable IDs. `ServiceCatalogue` uses the shared search field and typography, StyleX styling and AppImage/AppLink wrappers. Each entire card is a keyboard-accessible link to the existing service enquiry draft. Its recognized service ID prefills the localized request text; make and model are entered in the draft. Nothing is submitted by selecting a card.

All, Servicing and Diagnostics are functional filters. Search matches names, descriptions and check rows in the active locale and English. Empty results provide Show all services, which clears both filters and focuses search. Clear search also returns focus to the input and preserves the category. Query/category are mirrored into the current URL with native replaceState, preserving the locale and mounted pathname. Returning from the draft restores the search/category without adding a history entry for every keystroke. The URL-reading component has a scoped Suspense boundary.

Generated originals, optimized runtime WebPs, exact prompts and built-in tool provenance are preserved in [the service artwork folder](../../public/showroom/services/PROMPTS.md). The tool exposed no model version. The scenes are illustrative, not images of the dealer's actual staff or facilities. PNG originals are 1536 x 1024; each 1200 x 800 WebP is under 90 KB, with Next Image responsive derivatives. Cards display a 2:1 crop.

## Verification

Local preview: `http://127.0.0.1:6483/bg/service`, maintained App checkout on Cars main. Node 22.20.0, retained npm lockfile, Next webpack development server. No hosted deployment or dealer refresh is part of this change.

- Bulgarian 320 x 844 and 390 x 844, tablet 768 x 1000, desktop 1440 x 1000; English 320 x 844. No document horizontal overflow, broken images or landing-page make selector. Desktop/tablet use two columns; mobile uses one. All three Bulgarian pills fit at 320px, including the preview's 15px scrollbar. Every category has at least a 44 x 44 target.
- Servicing/Diagnostics filters show the correct card. Bulgarian searches for масло and компютър, and English oil, match their actual cards. Combining масло with Diagnostics gives the empty state; Show all services restores both cards. Clear search restores input focus and leaves one rounded focus outline.
- Both card destinations prefill the localized service name. Enter activates a card. Browser Back restores the prior category and the prior Bulgarian search query. The service enquiry stays a non-submitting draft.
- Sell retains its existing make selector. Finance's Коли на лизинг heading and calculator launch/close were checked again. The earlier Finance and Services removals remain: no process list, generic FAQ or separate contact footer on Services.
- The final `npm run check` passes: ESLint, TypeScript and production webpack build, including all 407 generated pages. The build uses `NEXT_DIST_DIR=.next-build-check` separately from the running `.next` preview, with generated next-env references restored afterwards. One run with 11 workers crashed in a Windows native worker during page generation after compilation/type checking passed. The final run sets `CIRCLE_NODE_TOTAL=3` for that process only, which this installed Next version resolves to two workers; all checks then pass. App configuration and the running preview are unchanged. Build logs are under Cars' ignored `runtime/app-services-cards-2026-10-02/`.

One in-app browser tab crashed during a search check. A fresh tab in the same in-app browser recovered; the same Bulgarian search/filter intersection then passed. No application console error was observed. A development Fast Refresh full-reload warning occurred while editing.

## Final views

- [Bulgarian 320px](bg-320.jpg)
- [Bulgarian 390px](bg-390.jpg)
- [Lower mobile cards and care campaign](bg-390-lower.jpg)
- [Desktop](bg-desktop.jpg)
- [English 320px](en-320.jpg)

The additional full-page mobile capture is preserved but excluded from acceptance evidence because the preview capture cropped the right edge. The viewport images above establish the actual rendered geometry.

## Source handoff

Implementation is in the maintained Cars main checkout. The integration base is `3492a952fc5e70e6d1b7f50412e4f71b42b76a01`; its intervening change affects Import, with no App source drift. The existing `L:/CODEX/cars/.git/index.lock` initially occupied the shared index and was observed with a 19:16:03 UTC write time on 2 October. It was preserved until it cleared. Main tracking refs were refreshed and the staged set was checked before integrating the scoped App changes.

The related App scope combines the already-verified Finance cleanup with this Services revision: `TEMPLATE.md`; BrandCampaign, DealerRequestPage, FeatureContent, FeatureLanding, FinanceCalculator, FinanceCalculatorLauncher, ShowroomBanner, ServiceCatalogue and action-button component files; `lib/service-catalogue.ts` and the EN/BG catalogues; the service artwork folder and ASSET-PROVENANCE entry; current Finance/Services verification receipts and their historical pointers. These form one scoped App UI commit. Dealer release and hosted delivery remain separate operations.
