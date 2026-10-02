# Boxcar shared page banners

Updated locally on 2 October 2026, on [Cars](http://127.0.0.1:6455/inventory/), [About](http://127.0.0.1:6455/about/) and [Contact](http://127.0.0.1:6455/contact/).

All three pages now use `src/components/PageBanner.svelte`. The existing shallow pale blue background, centered title, short introduction and compact breadcrumb remain. One complete white estate is placed on the left facing right, and one complete blue SUV is placed on the right facing left. The title stays between them. Both illustrations hide below 1241 px, leaving the centered copy clear on tablets and phones. Text grows naturally, with proportional line spacing, when its size is increased.

About's banner uses the configured dealer name; its original five-image gallery and four illustrated benefits follow immediately below. Contact preserves its existing showroom/map area, contact details and form. Its viewing subject is retained, and selling mode uses Sell Your Car in the same banner with the existing selling fields. Inventory retains its grey canvas, white panels, compact card controls and query/Back behavior. Saved cars keeps its earlier heading. The shared navigation/footer, curated homepage and ten original reference-home source files were not changed.

## Artwork

The built-in imagegen tool produced two individual cutouts from the existing two-car Browse Cars artwork. Runtime files are transparent 720 x 405 WebP images; the white car is 58,860 bytes and the blue SUV 65,004 bytes. Original generated PNG files and the earlier two-car image remain intact. The cutouts use empty alt text and depict decorative marketing vehicles.

[White estate facing right](../../templates/boxcar-updated/public/media/banners/boxcar-estate-right-v1.webp) · [Blue SUV facing left](../../templates/boxcar-updated/public/media/banners/boxcar-suv-left-v1.webp) · [Final generation prompts and original paths](../../templates/boxcar-updated/provenance/page-banner-art-2026-10-02.md).

## Verification

Svelte check passed with zero errors and warnings; the final Vite production build passed, 163 modules. Chromium and WebKit passed 50 banner states across the three pages at 1440, 1241, 1024, 768, 390 and 320 px, including 320 px with 200% root text and Contact's selling/viewing modes. Four desktop/phone journeys passed shared header/mobile-menu navigation, viewing/selling subjects and fields, required-field validation, truthful local previews, input-change reset, the breadcrumb homepage link and native Saved navigation. No JavaScript errors or form submissions were recorded. The [browser receipt and source hashes](shared-banners-results.json) record the checks. Desktop and 320 px views were also inspected in the in-app browser; its responsive override was reset and the temporary tab closed afterwards.

Final screenshots: [Cars desktop](shared-banner-inventory-1440.png), [Cars phone](shared-banner-inventory-320.png), [About desktop](shared-banner-about-1440.png), [About phone](shared-banner-about-320.png), [Contact desktop](shared-banner-contact-1440.png), [Contact phone](shared-banner-contact-320.png).

This is shared candidate-template source polish. No dealer refresh/deployment or immutable release pin changed. Earlier [inventory banner evidence](INVENTORY-BANNER.md) records the preceding right-side grouped illustration. The 19 explicit owned source/evidence paths are listed in ignored `runtime/boxcar-shared-banners/owned-paths.json`.
