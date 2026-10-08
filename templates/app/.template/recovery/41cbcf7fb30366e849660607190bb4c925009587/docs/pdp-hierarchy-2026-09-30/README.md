# Mobile PDP and showroom polish — 2026-09-30

Local source: `L:/CODEX/cars/templates/app`, Cars `main`. Preview: `http://localhost:3001/bg`.

## Result

- PDP order: photograph, wrapping vehicle title with price information on its right, numeric price followed by quieter EUR, compact Info / Exterior / Interior controls, selected content.
- Payment options expand inside the price information drawer. Exterior and interior panels start with photographs without repeating the segment heading.
- Specifications and equipment use contained panels. Viewing and ownership banners follow the vehicle details. Save and viewing remain available in the mobile footer.
- Back and related icon actions share one component: 44px touch target, 36px visible surface and 18px icon, with neutral and photograph tones.
- Homepage search spans the row. The separate wishlist action and visible services heading are removed.
- Mobile banners use shared title, copy, padding and action tokens. Their height follows their content. Current two-line copy banners measure 154px at both 320px and 390px.
- Recently viewed titles use one line with an ellipsis through `MiniVehicleCard`, shared by Home and Search. Kia, Land Rover and Toyota cards each measure 199px tall, with 20px title rows and matching price positions. Full vehicle names remain in the accessible content.

## Verification

`npm run check` passed under Node 22.20.0: ESLint, TypeScript and the production build, including 407 generated pages.

Browser checks covered 320px, 390px and desktop, including a long Land Rover title, Kia and Fortuner listings, the selected photo panels, price information and payment expansion, viewing choices, saved state, modal focus restoration, and shared navigation. The final Search back action navigated to Cars. No document overflow was present in the measured final states. No loaded broken images were present in the measured PDP states.

The final recently viewed measurements confirm `white-space: nowrap`, `text-overflow: ellipsis`, and a 20px title height on Home and Search. Land Rover text exceeds its 170px title box and is truncated; shorter Kia text stays within the same box.

Screenshots and `verification.json` in this directory record the local result. Enquiry and viewing requests remain draft interactions; verification did not transmit a request or perform a financial transaction.

## Delivery boundary

These changes are local. The existing parent repository `index.lock` was preserved, along with the nine previously staged files and unrelated edits. It blocks a scoped commit and push. No dealer release or deployment was performed.
