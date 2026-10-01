# Restrained mobile menu polish

The /more page keeps its existing grouped cards, dark Cars row, icons, language control and bottom navigation. Ordinary mobile row labels now use weight 400. Mobile separators align with the start of the text and stop before the chevron, instead of crossing the icon column. Desktop keeps weight 500 and full-width separators. Rows remain 56px high, with the two leading rows at 60px.

Verified the main template at 320px, 390px and 1440px with no page overflow. English/Bulgarian switching retains /more and marks the selected language correctly. The vehicle-services menu link opens /bg/service, and returning restores the menu. Desktop computed styles retain the previous weights and separators.

`npm run check` passed: lint, TypeScript and production build (407 generated pages). The build used .next-build-check, separately from the active dev server on port 6483. Screenshots in this folder show the 320px, 390px and desktop results. No dealer refresh or deployment was performed.
