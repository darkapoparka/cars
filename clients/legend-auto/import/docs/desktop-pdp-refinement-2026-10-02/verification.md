# Desktop vehicle-detail refinement

Save and Compare now sit beside the vehicle title in one full-width row. The gallery and purchase column start together below it. Mileage, year, fuel and colour move above Cash price / Financing in the purchase panel. The dealer details below the phone action become a separate automotive banner with the existing logo, localized appointment/address text and the retained map destination.

## Source and artwork

- `VehicleDetailPage.svelte`: desktop title/action row and column composition.
- `VehiclePurchasePanel.svelte`: short overview above the payment tabs; existing price, financing and enquiry contracts retained.
- `VehicleDealerBanner.svelte`: reusable dealer banner that reads configured identity, artwork, contact links and localized copy.
- `config/dealer.ts`: the banner asset is configurable through `daynightAssets.vehicleDealerBanner`.

The banner reuses `static/assets/daynight/banners/commerce-collection.webp` (720 × 405) and the existing configured dealer logo. This is the Cars-owned collection campaign artwork documented in [Commerce banner artwork](../assets/COMMERCE-BANNERS.md). No new image was generated and no existing asset was replaced. Text and branding remain separate from the background image.

## Visual evidence

- `before-bg-1440.jpg`: the starting BMW X4 detail page at 1440 × 1000.
- `after-bg-1440.jpg`: the same page and viewport after the change.
- `after-en-1440.jpg`: the English composition.

| Vehicle / language | Desktop widths          | Result                                                                                                                              |
| ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| BMW X4 / BG        | 768, 1024, 1440, 1920px | Title/actions do not overlap; gallery and purchase column align; summary precedes tabs; banner images load; no horizontal overflow. |
| BMW X4 / EN        | 768, 1024, 1440px       | Same checks pass, including localized dealer text.                                                                                  |
| Mercedes GLA / EN  | 768px                   | Longer title wraps within its available space beside Save/Compare; no overlap or horizontal overflow.                               |

At 320 and 390px, the mobile composition remains separate, the desktop header is absent, and root geometry matches the starting page without horizontal overflow. The existing mobile branch and `AuxeroVehicleMobilePdp.svelte` are unchanged. Mobile screenshots were inspected at 390px; exact pixel equality is not claimed.

## Interaction and source checks

- Save and Compare each toggle and restore their starting unchecked state.
- Financing displays the existing illustrative 604 €/month; Cash price restores correctly.
- Gallery and enquiry dialogs open and close with Escape. No enquiry was submitted.
- No browser console errors recorded in the QA tab.
- Svelte checking: zero errors and warnings. Scoped ESLint, Prettier and `git diff --check` pass.
- Architecture check: 57 native route modules, 211 reachable modules, one Tailwind entry. Image signature check: 911 local images pass.
- The running Node 24.21.0 / Vite server at 6790 served the inspected route with HTTP 200. A fresh production build was not run for this local desktop composition change; template release and dealer deployment were not performed.
- Before integration, `workspace-doctor --fetch --json` confirmed Cars main at `2d3c19eedd957349aaf1db2e204a57d3378dbdae`, matching fetched origin/main with no divergence. Other working changes are preserved.

Source SHA-256 at verification:

- `VehicleDetailPage.svelte`: `AC20AC43FFF1E12CC18F91D5DE9A4EA0493E103D11783A367F6A65920CE3321E`
- `VehiclePurchasePanel.svelte`: `F9310353C446A295CD4748E28B33D45FBF1507A150D9E6848AB51C980CA3C491`
- `VehicleDealerBanner.svelte`: `8C3E543619589A5C841DD89B10F379EA6AFC1E0FE9B431678BB3710685BDBE65`
- `config/dealer.ts`: `CB565C8BA1B426FBCCE2FE61DD94183597FA15C90A9F21512EDFAEECF9ABBA2C`
