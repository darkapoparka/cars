# Finance step revision — 2 October 2026

Historical receipt: the owner's later correction removes this entire steps and guidance section. See [current Finance mobile cleanup](../finance-mobile-cleanup-2026-10-02/README.md). The comparison below is preserved as provenance.

Inspected the hosted [Cars24 reference](https://inspiration-cars24-tyj5.vercel.app/finance) in the in-app browser, including all six loan-journey cards. At 390px its first card measures 351 × 102px, with a 100 × 100px image on the left, a short title and explanation, a subtle border, rounded corners and 12px gaps. This is the preserved reference preview, not a claim of current official Cars24 parity. The local donor in `L:/inspiration/cars24` was preserved.

Finance now presents its three dealer steps in that composition. Cards have a 104px minimum height, a 100px image column that shrinks to 30% on narrow screens, a subtle border and 12px gaps. Shared `title` and `body` roles provide 18px titles and 15px phone descriptions. Existing original artwork supplies a person choosing on a phone, a calculator with a car, and a consultation scene. No new artwork or proprietary reference assets were imported. The steps remain a static ordered list with no buttons, arrows or disclosure controls. Desktop uses three columns; phones and tablets stack the cards.

## Verification

- Bulgarian inspected at 320 × 844, 390 × 844, 768 × 1024 and 1440 × 1000 CSS pixels; English at 320 × 844. The three cards are 104px high at all checked widths. No horizontal document overflow; descriptions wrap inside their columns. At 320px the image column is about 84px; at 390px it is 100px.
- Images loaded in the inspected phone layouts. The shared image component serves responsive derivatives; the size hint accounts for cropping the landscape artwork into the small upright frame. Each step contains zero buttons or links. The calculator banner opens the full calculator sheet, and the lower Ask us action opens the existing non-submitting enquiry sheet; both were closed after inspection.
- Node 22.20.0: `npm run check` passed ESLint, TypeScript and the optimized production build, generating 407 pages in isolated `.next-build-check`. The production build was regenerated successfully after the final responsive-image size hint. Development route-type imports were restored afterward.
- Screenshots: [Cars24 reference](cars24-reference-390.png), [previous layout at the browser's 319px width](before-current-319.png), [Bulgarian 320px](bg-320.png), [Bulgarian 390px](bg-390.png), [English 320px](en-320.png), [tablet](bg-tablet.png), [desktop](bg-desktop.png).

## Source handoff

Live local preview: `http://127.0.0.1:6483/bg/finance`. Commit and push remain pending while another Cars writer uses the shared Git index. Its existing lock and unrelated staged files were preserved. No dealer deployment or template release is claimed.

This revision changes `components/FeatureContent.tsx`, one Bulgarian step sentence in `lib/locales/bg.json`, the Finance paragraph in `TEMPLATE.md`, the historical receipt pointers and this evidence directory. These belong with the ongoing App banner and car-selection changes listed in the [banner handoff](../finance-calculator-banner-2026-10-02/README.md). Preserve unrelated App home-branding and mobile-audit documentation. Resolve main drift and obtain the shared index before a scoped commit and non-force push.
