# Compact mobile inventory cards

The owner's latest request supersedes the earlier two-row mobile fact layout. The canonical master at port 6483 now hides card wishlist buttons on mobile and removes their reserved title/make padding. Titles use one line with ellipsis while retaining their full text in the DOM and title attribute. Facts stay beside the photo in one horizontally scrollable row, with no dropped text. The row supports touch and keyboard scrolling. Desktop keeps its wishlist buttons and two fact rows; vehicle detail pages keep their Save action.

Reference: the retained L:/cars-app/components/VehicleCard.tsx uses a regular-weight, single-line title with ellipsis. The right-column facts are our adaptation, not a claim of exact Cars24 parity.

Browser verification against the running master dev server:

- At 320px and 390px, all 48 cards are 157px high, all titles occupy 21px, and every facts group occupies one row. Before this correction, the first eight cards measured 183px at 390px.
- No horizontal page overflow at 320px, 390px or 1440px.
- At 320px, keyboard Right arrows scrolled the first facts row from 0 to 104px and brought the complete third fact into view.
- Card navigation opened the correct Toyota detail page and its mobile Save action remained visible.
- At 1440px, all 48 card wishlist controls remain visible and facts retain two rows.
- Screenshots: 320-facts-scrolled.jpg, 390.jpg and desktop.jpg.
- `npm run check` passed: ESLint, TypeScript and production build (407 static pages generated). Build output used .next-build-check, separate from the active .next dev server.

This change is in the master template only; no dealer refresh or Vercel deployment was performed in this pass.
