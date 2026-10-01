# Restrained mobile menu polish

The /more page keeps its existing grouped cards, icons, language control and bottom navigation. The owner rejected both the inset separators and the black Cars row. Every menu row now uses the same white surface, dark icon and regular label, with full-width borders. Mobile labels use weight 400; desktop uses weight 500. Rows remain 56px high, with the location row at 60px for its subtitle. The current screenshot is 390-uniform-rows.jpg; earlier screenshots retain the superseded treatments for comparison.

Verified the main template at 320px, 390px and 1440px with no page overflow. English/Bulgarian switching retains /more and marks the selected language correctly. The vehicle-services menu link opens /bg/service, and returning restores the menu. Desktop computed styles retain the previous weights and separators.

After removing the primary-row treatment, verified white backgrounds on all six menu rows at 320px and 1440px, and confirmed the Cars row opens /bg/cars with 48 listings. No other navigation hierarchy was changed.

`npm run check` passed: lint, TypeScript and production build (407 generated pages). The build used .next-build-check, separately from the active dev server on port 6483. Screenshots in this folder show the 320px, 390px and desktop results. No dealer refresh or deployment was performed.
