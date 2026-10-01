# Restrained mobile menu polish

## Current revision: restored original composition

The owner rejected the open-list redesign. Restored the original menu from before commit 5b480220a: grouped cards, original 500-weight labels, 24px icons, 12px mobile gutters, spacing and pill-shaped language selector. The only retained visual correction is removal of the black Cars-row treatment. Current screenshot: 390-restored-baseline.jpg. Verified at 320px, 390px and 1440px with no horizontal overflow. Earlier revisions below are superseded.

## Superseded revision: open mobile list

The final direction removes the mobile card outlines and rounded containers. Quiet section labels identify the existing groups, icons are 20px, and rows use a consistent 20px page gutter with full-width separators. Language switching uses a light segmented control with a white selected state. Destinations, dealer configuration, language behavior and bottom navigation are retained. Wider layouts keep their grouped containers.

Current screenshots: 390-open-list.jpg, 320-open-list-bottom.jpg and desktop-open-list.jpg. Verified no page overflow at 320px, 390px and 1440px; menu rows retain at least 56px height and language options retain 44px targets. At 320px the final notice can be scrolled fully clear of the bottom dock. English/Bulgarian switching preserves /more, and Cars opens /bg/cars with 48 listings. The retained Cars24 menu capture informed the open-list structure and smaller icons; no reference login, marketplace claims or proprietary artwork was added.

## Earlier revisions

The /more page keeps its existing grouped cards, icons, language control and bottom navigation. The owner rejected both the inset separators and the black Cars row. Every menu row now uses the same white surface, dark icon and regular label, with full-width borders. Mobile labels use weight 400; desktop uses weight 500. Rows remain 56px high, with the location row at 60px for its subtitle. The current screenshot is 390-uniform-rows.jpg; earlier screenshots retain the superseded treatments for comparison.

Verified the main template at 320px, 390px and 1440px with no page overflow. English/Bulgarian switching retains /more and marks the selected language correctly. The vehicle-services menu link opens /bg/service, and returning restores the menu. Desktop computed styles retain the previous weights and separators.

After removing the primary-row treatment, verified white backgrounds on all six menu rows at 320px and 1440px, and confirmed the Cars row opens /bg/cars with 48 listings. No other navigation hierarchy was changed.

`npm run check` passed: lint, TypeScript and production build (407 generated pages). The build used .next-build-check, separately from the active dev server on port 6483. Screenshots in this folder show the 320px, 390px and desktop results. No dealer refresh or deployment was performed.
