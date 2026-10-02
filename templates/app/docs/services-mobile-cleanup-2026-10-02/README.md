# Services mobile cleanup — 2 October 2026

Services now consists of the service banner, make selector, two service cards and care banner. Removed How it proceeds, its six plain text steps, the generic FAQ and separate contact footer. No replacement text sections were added. Package descriptions remain in their existing details sheets.

Reduced mobile card padding to 18px, the gap between cards to 12px and the gap after makes to 24px. Services uses the same 84px plus safe-area bottom clearance as Finance. The Bulgarian finance heading is now Коли на лизинг. The Cars24 donor's service package/card structure was reviewed; existing original artwork remains in use.

## Verification

- Node 22.20.0: `npm run check` passed lint, TypeScript and the optimized production build in `.next-build-check`. Development route imports were restored; port 6483 still serves the master.
- In-app browser: Bulgarian Services at 320 × 844, 390 × 844 and 1440 × 1000; English at 320 × 844. No horizontal document overflow or visible broken images. Both service cards and their actions fit; the process, generic FAQ and contact footer are absent. Desktop retains two columns.
- Package details open and close with Escape, restoring focus and body scrolling. Selecting Toyota opens `/bg/service/details?brand=Toyota` with Toyota prefilled. The care-banner action opens `/bg/service/details`. The form retains its enquiry-draft semantics; nothing was submitted. The corrected Коли на лизинг heading was verified on `/bg/finance`.
- No captured browser runtime errors. The development server logged an expected Fast Refresh full-reload warning during editing. React review confirmed stable hook order, explicit conditional rendering and the existing shared modal behavior.

Final screenshots: [320px](bg-320.jpg), [390px](bg-390.jpg), [lower Services page](bg-390-lower.jpg), [English 320px](en-320.jpg), [desktop](bg-desktop.jpg).

## Source status

Live local master: `http://127.0.0.1:6483/bg/service`. This correction changes `components/FeatureContent.tsx`, `components/FeatureLanding.tsx`, the existing `Cars to finance` Bulgarian translation and `TEMPLATE.md`, plus this evidence directory. Earlier App finance work and unrelated Cars changes remain preserved.

Historical receipt: the owner's later [Services card revision](../services-cards-2026-10-02/README.md) removes the make selector, adds search/category pills and generated card imagery, and integrates this cleanup in the scoped App UI commit. No dealer refresh, release selection or deployment was performed.
