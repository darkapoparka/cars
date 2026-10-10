# Desktop vehicle header alignment

Baseline: `50ed1f301687640e9b1773c2552dfea3dff501ed`. Verified on the existing Import Vite server at `http://127.0.0.1:6790` with Node 24.21.0.

The title and Save/Compare controls now share one header row in the gallery column, level with the top of the purchase panel. Save/Compare reuse the shared secondary action style, with a light grey background and a darker selected state. When the gallery column is 40rem or narrower, the buttons show compact icons with localized accessible names and hover titles. Long vehicle names remain readable and wrap within the title area without moving the controls into a second row.

The redundant overview above Cash/Financing is removed from the purchase panel, including its derived value and CSS. The payment tabs are the first content in that panel. The existing dealer banner and specifications panel remain below the purchase actions.

| Browser check                                      | Result                                                                                                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bulgarian BMW X4, 1440px                           | Title header and purchase panel both start at y=160px; header and gallery are both 918px wide. Title stays on one line. Grey actions retain text labels. |
| Bulgarian BMW X4, 1024px                           | Both panels start at y=199px. Title stays on one line alongside compact icon actions. No horizontal overflow.                                            |
| Bulgarian BMW X4, 768px                            | Both panels start at y=199px. Title stays on one line alongside compact icon actions. No horizontal overflow.                                            |
| English Mercedes-Benz long title, 768px and 1440px | Full title wraps without colliding with the controls. Header remains level with the purchase panel. No horizontal overflow.                              |
| Save and Compare                                   | Each toggles false → true → false; original state restored.                                                                                              |
| Payment tabs                                       | Financing selects and displays 604 €/month; Cash restored.                                                                                               |
| Removed summary                                    | No `.purchase-summary` element is present.                                                                                                               |
| Mobile, 320px and 390px                            | Independent mobile PDP renders at the viewport width, with no desktop header or horizontal overflow.                                                     |
| Mobile source preservation                         | Mobile branch in `VehicleDetailPage.svelte` matches the baseline byte for byte after newline normalization; `AuxeroVehicleMobilePdp.svelte` has no diff. |
| Svelte check                                       | Zero errors and warnings.                                                                                                                                |
| Browser console                                    | No captured errors in the verification tab.                                                                                                              |

Both changed components pass scoped ESLint. The components and architecture document pass Prettier. The task diff passes `git diff --check`.

Before and after captures use the same Bulgarian BMW X4 route and 1440×1000 viewport override:

- [Before](before-bg-1440.jpg)
- [After](after-bg-1440.jpg)
- [Long English title at 768px](after-long-title-en-768.jpg)

The Cars workspace doctor fetched main and confirmed the expected repository, branch, and zero divergence before integration. It also reported existing uncommitted work, which was preserved. This is local development verification; no production build, template promotion, or dealer deployment was performed.
