# Desktop PDP facts styling — 2 October 2026

The two facts cards keep their existing placement, grouping and vertical rows. This follow-up reduces their visual weight: no outer borders or row dividers, smaller headings in the body font, quieter icons/labels and values aligned to the right. The stock reference uses the existing metadata typography. Explicit row line spacing and vertical centering correct the former icon/label/value baseline offset.

Only `src/lib/components/detail/VehicleFacts.svelte` changes application behavior. The facts data, gallery, description, purchase/finance column and independent mobile PDP are unchanged. Existing tokens and the shared panel frame supply the dimensions and surfaces.

## Before and after

Both views use the same BMW X4, Bulgarian locale, 1440 × 1000 viewport and finance anchor. The before source was `f00dced0ded85ddc7776783fdd1a8283a0d757c3`.

| Before                                                  | After                                                   |
| ------------------------------------------------------- | ------------------------------------------------------- |
| ![Bordered cards with row dividers](before-bg-1440.jpg) | ![Lighter cards with aligned values](after-bg-1440.jpg) |

Further views: [Bulgarian 768px](after-bg-768.jpg), [English 1440px](after-en-1440.jpg), [English 768px](after-en-768.jpg).

## Verification

- Node 24.21.0; existing Import Vite server on port 6790 kept running.
- Svelte check: 0 errors, 0 warnings. Scoped ESLint, Prettier and whitespace checks passed.
- Bulgarian PDP `/bg/inventory/21778068579001193`: 768, 1024, 1440 and 1920px. English equivalent: 768 and 1440px. All nine facts remain present; no clipped values or horizontal page overflow. The cards retain the established side-by-side/stacked container behavior.
- At 1440px, card heights reduce from approximately 342/288px to 279/239px. No forced equal heights or filler rows.
- Mobile at 320 and 390px: existing mobile PDP renders; the desktop facts component is absent; no horizontal overflow. Mobile source is unchanged.
- Inspected browser warning/error log: empty. Detailed measurements and mobile screenshots are retained in ignored `runtime/desktop-pdp-facts-polish-2026-10-02/`.
- Root workspace doctor fetched successfully and confirmed matching main/origin at its snapshot. Unrelated dirty work was preserved.

Verification is local dev verification of this component. No production build, template promotion or dealer deployment was performed.
