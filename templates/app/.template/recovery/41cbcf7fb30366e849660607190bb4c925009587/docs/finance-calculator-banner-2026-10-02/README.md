# Finance calculator banner — 2 October 2026

Historical receipt: the later [Finance mobile cleanup](../finance-mobile-cleanup-2026-10-02/README.md) removes the steps and loose document/approval guidance entirely and lightens the calculator estimate. The retained banner and car-selection behavior below remains useful provenance.

The first graphite banner now represents the calculator. Its original calculator artwork stays proportional, and the short white Calculate / Изчисли button opens the full existing calculator sheet. The mobile supporting copy is Monthly payment / Месечна вноска. Choose your car / Избери кола is a standalone 52px control immediately below the banner.

The inventory heading occupies its own line. Three priced cars follow, with calculator payment actions. The example assumptions and filled All cars / Всички коли button remain below the feed. That button opens the searchable picker containing 42 priced inventory records.

How it works is open content: three illustrated steps with shared 18px titles and 15px mobile descriptions. Short document and lender-term guidance follows without disclosure rows, menu icons or card borders. A compact consultation-photo banner ends the page with Need a hand? / Нужда от помощ? and a white Ask us / Попитай ни action. It opens the existing non-submitting enquiry sheet. The mobile contact banner is about 155px tall. The previous control-row and disclosure-menu receipts are historical evidence.

## Verification

- Node 22.20.0 with isolated `.next-build-check`: `npm run check` passed ESLint, TypeScript and the production build, generating 407 pages. The production build was regenerated successfully after the final Bulgarian contact-copy edit. Development route-type imports were restored afterward.
- Bulgarian at 320px, 390px, 768px and 1440px; English at 320px. No horizontal document overflow. The selector remains 52px high; inventory retains its existing one-, two- and three-column breakpoints. The calculator artwork is uncropped on wider screens. A second 390px screenshot uses a 980px viewport height to show all lower content together.
- The hero opens the full calculator. Changing the price to €30,000 produces an example €475 payment and preserves the value after closing and reopening. Searching ATTRAGE returns two cars; selecting the 2023 Mitsubishi loads €24,799 and an example €393 payment. The MG 5 card's payment action loads €26,599 and an example €421 payment.
- All cars opens the full picker. Back and Escape close the sheet without leaving Finance; focus returns to the opener and body scrolling is restored. Shift+Tab from the dialog wraps to the estimate disclosure, and Tab wraps back to the close button. Ask us opens the enquiry sheet; no enquiry was sent.
- React review: the parent controls one shared cars/calculator dialog, while selection and calculator values remain mounted in the launcher. Existing focus, history, Escape and scroll-lock boundaries are retained. Banners, controls, steps and guidance use shared typography roles. No dependencies or CSS framework were added.

Evidence: [Bulgarian 320px](bg-320.png), [Bulgarian 390px](bg-390.png), [lower content](bg-390-bottom.png), [320px contact banner](bg-320-bottom.png), [English 320px](en-320.png), [tablet](bg-tablet.png), [desktop](bg-desktop.png), [phone calculator](calculator-320.png), [desktop calculator](calculator-desktop.png).

## Source handoff

The changes are live locally at `http://127.0.0.1:6483/bg/finance`. Cars main is at `f190421c4`; workspace-doctor with fetch confirms main is zero ahead and zero behind origin. The existing zero-byte `.git/index.lock` is preserved, and another active Cars task is writing Import in this shared checkout. Commit and push are pending under the shared-checkout coordination rule. No template release or dealer deployment is claimed.

When the checkout is available, review and commit only these ongoing App task paths from `L:/CODEX/cars`:

- `templates/app/TEMPLATE.md`
- `templates/app/components/action-button.stylex.ts`
- `templates/app/components/BrandCampaign.tsx`
- `templates/app/components/FeatureContent.tsx`
- `templates/app/components/FeatureLanding.tsx`
- `templates/app/components/FinanceCalculatorLauncher.tsx`
- `templates/app/components/ShowroomBanner.tsx`
- `templates/app/lib/locales/bg.json`
- `templates/app/lib/locales/en.json`
- `templates/app/docs/finance-calculator-banner-2026-10-02/`
- `templates/app/docs/finance-controls-2026-10-02/`
- `templates/app/docs/finance-car-selection-2026-10-02/`
- `templates/app/docs/finance-steps-2026-10-02/README.md`
- `templates/app/docs/finance-steps-revision-2026-10-02/`

Preserve unrelated Cars changes and the existing App home-branding/mobile-audit documentation. Do not include generated build output or development route-type changes. Fetch and resolve main drift before the scoped commit and non-force push.
