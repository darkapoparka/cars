# Vehicle detail segmented control

Local App template change on 30 September 2026 in `L:/CODEX/cars/templates/app`, Cars branch `main`.

Information, Exteriors and Interiors now share a filled grey track below the price card. The selected segment is white with dark text and a subtle shadow. The control is 52px tall, with three equal 44px tap targets, 13px mobile labels and a visible 2px keyboard focus ring. The mobile Information label remains **Инфо**, with the full accessible name **Информация**.

Verified the Kia Seltos detail page at 320px, 390px and 1440px. All labels fit on one line with no document horizontal overflow or broken images. Information, exterior and interior panels switch correctly. The price and track retain their document positions when switching. Arrow navigation, Home, End and wrapping move both selection and focus. Exterior photos open the existing viewer; Escape closes it and restores focus to the photo trigger. The inspected browser reported no console errors. Measurements are in `verification.json`; phone and desktop screenshots are included alongside it.

`npm run check` passed: ESLint, TypeScript and production build, including 407 generated pages. Used Node 22.20.0 with `NEXT_DIST_DIR=.next-build-check`, a bounded heap and one static-generation worker. Preserved the pre-check contents of `next-env.d.ts` and `tsconfig.json`. Restored the App dev preview on port 3001 after its previous process had exhausted machine memory; the verified vehicle route returned HTTP 200.

This change updates only the styles in the existing untracked `components/VehicleDetailTabs.tsx`, preserving the earlier PDP implementation and unrelated working/staged changes. The shared Cars `index.lock` remains present and untouched, so scoped commit/push is pending. No deployment was requested.
