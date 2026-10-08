# Contained car-detail sections

Local App template verification on 30 September 2026, in the Cars main working copy at `L:/CODEX/cars/templates/app`.

Characteristics use one rounded, filled card with a two-column grid of white tiles. Mobile tiles are 56px tall with 8px padding, 12px labels and 14px values. The transmission label reads **Скорости** in Bulgarian and **Gearbox** in English. All six labels and values fit on one line at 320px and 390px; the complete characteristics card is 240px tall.

The showroom link is a filled 80px card with a location icon and supporting text. The entire card links to the localized showroom route. Equipment has its own filled card, white check rows and a full-width 44px button leading to the complete equipment list. Neither section relies on separator lines or a bare text link for its main action.

Verified the Toyota Fortuner and Kia Seltos detail pages. Final compact-layout measurements cover Bulgarian at 320px and 390px, desktop at 1440px, and English at 320px. An earlier tablet inspection at 768px verified the filled section layout. There was no document horizontal overflow, broken image or JavaScript error in the inspected final views. See `verification.json` and the final phone/desktop screenshots.

Keyboard checks confirmed 2px focus rings on the showroom and equipment links. The showroom link reached `/bg/stores`; equipment opened the correct car's `/features` route, and searching **Круиз** showed **Круиз контрол**. The condition request opened the existing unsent enquiry draft; Escape closed it and returned focus to the trigger.

Final `npm run check` passed: ESLint, TypeScript and the production build, including all 407 generated pages. Used Node 22.20.0, `NEXT_DIST_DIR=.next-build-check`, `NODE_OPTIONS=--max-old-space-size=1024 --max-semi-space-size=4`, and `CIRCLE_NODE_TOTAL=2` to bound the build to one static-generation worker. Earlier attempts exhausted available machine memory. The live App preview was temporarily stopped for one successful build and then restored on port 3001. The final compact revision also passed with the restored preview running. Original `next-env.d.ts` and `tsconfig.json` content was preserved after verification.

This turn changed `components/VehicleBelowFold.tsx` and the two locale catalogs. Existing overlapping PDP work in `VehicleDetailClient.tsx`, `OwnershipPanel.tsx`, `VehicleDetailTabs.tsx` and the catalogs was preserved. Unrelated staged and working changes were not staged, reset or committed.

Commit/push remains pending because `L:/CODEX/cars/.git/index.lock` is present. Observed Cars branch `main`, HEAD `807e2d6ee`, with no fetched main drift. The shared lock was left intact. Once its writer releases it, review the related PDP changes and dependencies together, run the existing workspace doctor, and perform a scoped non-force integration. This is local template work; no dealer release or deployment was requested.
