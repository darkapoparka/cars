# Karento Best

The owner-selected dealer website: **Home 3, Car List 2, Car Details 3**, with all requested supporting pages and dashboard screens organized into one navigation. The complete original Karento remains at `../karento`, independently available on port 6462.

## Run

Use Node 26.10.0, matching the installed Karento reference runtime and pinned package-lock versions.

```powershell
npm ci
npm run check
npm run build
npm run dev -- --host 127.0.0.1 --port 6466 --strictPort
```

For a production preview after building, set `HOST=127.0.0.1` and `PORT=6466`, then run `node build/index.js`. `npm run qa` checks the active Best preview; `KARENTO_BEST_QA_URL` can override its URL. The original reference preview on 6462 must be available for its preservation check.

## Website organization

The Home 3 base uses Home 2's centered Car Rental System section and testimonial card slider. Home 2's five stats sit in a bordered card inside the system section; there is no separate stats block. The source sections are read directly from the preserved Home 2 capture.

How It Works is a custom four-step dealer journey using image-generated photography inspired by the Mobile Services page. Its WebP assets are owned and bundled by Karento Best, with centered captions and four desktop/two mobile columns. See [artwork provenance](../../docs/karento/HOW-IT-WORKS-ARTWORK.md).

| Header | Pages |
| --- | --- |
| Home | Home 3 at `/` |
| Vehicles | List 2 at `/vehicles`, selected Details 3 at `/vehicle` |
| Services | `/services` |
| Shop | Direct link to `/shop`; product images and names open `/shop/product` |
| Explore | About, Import, News, Calculator, FAQ, Terms |
| Plans | Direct link to membership packages at `/membership` |
| Contact | `/contact` |

The header's Account button opens Login, or the selected demo account. The grid button retains the original desktop drawer, with account actions and website links. Signed-out visitors see Sign in and Create an account. Selecting Dealership owner and Sign in to demo opens `/dashboard`; Member opens `/account`. The chosen preview area persists in the current browser tab and updates the drawer to View account, Account settings and Sign out. Sign out is not an inline header action. The mobile navigation retains one direct account entry. Login/Register are outside Explore, and Register links back to Login. The six member screens and five owner screens live inside their existing sidebars. Add Listing is available inside the owner dashboard. Dashboard screens explicitly identify their sample data and unsaved changes. This sign-in preview collects no credentials and is not authentication or a working inventory backend.

Missing website URLs return HTTP 404 and render the existing Karento error design with the shared website header and a Back to Home link. Error pages are not menu entries. Normal pages and the error screen use the same captured-page renderer and vendor initialization. Contact appears once in the main menu; Import and News live under Explore. News opens `/news`; article images, titles and featured stories open `/news/article`.

Motion is restrained throughout the derivative: scroll reveals and lifting classes are removed before rendering; counters are static; brand lists wrap without a ticker; decorative artwork and sticky-header entrance animations are disabled. Carousels start paused and retain deliberate arrows/swiping with a short transition, respecting reduced-motion preferences. Buttons, links and cards retain subtle color/border feedback and visible keyboard focus. The shared original vendor assets remain untouched.

Every page uses Home 3's header and mobile menu, composed from the preserved `index-3` source before applying the shared navigation and account controls in `src/lib/server/site.mjs`. The original drawer and scrollbar lifecycle are retained, with account/navigation content replacing the stock profile and products. The drawer supports keyboard focus containment, Escape, close-button and overlay dismissal. Inner pages no longer inherit their original header contact strips. All existing home, catalogue and vehicle-detail links lead to the selected layouts. Original captured route names remain accessible directly for reference, but alternate layout selectors are removed from the website menus.

Best uses one consistent light appearance. The inactive theme switch and its late-initializing vendor script are removed from this derivative. The preserved Karento reference still includes its dark styles and controls.

The homepage brand section uses nine unique monochrome logos from Home 1, with a centered heading and a static responsive grid. It removes repeated ticker entries and invented stock counts. View all vehicles opens the selected catalogue; brand filtering remains part of the pending inventory adaptation.

Import reuses the original dealer directory/profile composition with source-oriented labels and explicitly illustrative source content. It is not an assertion of approved sourcing relationships. Shop, memberships, authentication, wallet, bookings, calculators and dashboard data retain their reference demo behavior; working commerce, authentication and saved user data require separate backend implementation.

Product details use a centered breadcrumb with the Shop page's rounded border treatment and the displayed product title. The purchase summary sits in a bordered card beside the gallery on desktop and below it on phones; quantity and Add to cart are grouped above Share/Wishlist. This layout does not add checkout functionality.

Inner image heroes share centered titles, balanced photo shading and responsive content height. Contact links to the existing enquiry section, Services opens Contact, and the centered calculator introduction links down to its calculator. Plans, About, Import and Terms keep text-only introductions. Article titles/metadata remain inside their hero on phones; featured news stories and vehicle breadcrumbs are centered too. Existing centered Home, catalogue, Shop, support and account introductions are retained. See the [30-page hero review and before/after comparisons](../../docs/karento/HERO-REVIEW-2026-10-07.md).

Contact uses four matching generated portraits as circular avatars, centered location titles and country labels. Its example locations and fictional portraits are disclosed together; dealer copies should supply their own locations, contacts and permitted staff photos. Location titles jump to the enquiry form, and email/map links match the displayed contacts. See [Contact artwork and comparison](../../docs/karento/CONTACT-AVATAR-ARTWORK.md).

The enquiry form and location share one white, bordered panel on a soft background, matching the site's other contained sections. They sit side by side on desktop and stack on phones. The address and map have their own smaller white card with a subtle border inside the panel, with reduced padding on phones. Labels are connected to their fields, keyboard focus is visible, and enquiry shortcuts leave the panel's top clear of the fixed header.

The approved catalogue filter row/drawer and conversion of rental panels to vehicle-sale enquiry panels remain follow-up functional adaptations. This pass organizes the requested pages and preserves their layout and existing interactions.

## Reuse direction

The starter accent is neutral black. Four values at the top of `src/lib/server/dealer-site.css` control accent, hover, contrast and soft surfaces; they map to the existing vendor variables. Header/footer starter logos are displayed in monochrome with CSS, preserving the original asset files. The later dealer build must supply the lead's recognizable logo, permitted inventory/imagery, copy, locations and contacts through the existing Cars workflow. See [the reuse handoff](../../docs/karento/REUSE-HANDOFF.md) for the intentionally small scope of the next architecture pass.

## Source preservation and publishing boundary

The HTML page bodies, metadata and vendor assets are read from `../karento`; this project does not maintain a second copy of the captured library. SvelteKit bundles the HTML and shared static assets into its own production output. CSS for this derivative is served from `/dealer-site.css`.

Before publisher/release integration, source packaging must include the explicit Karento dependency and license evidence. This local candidate is not an approved template-lock entry and does not change any existing dealer or hosting provider. See [design decisions](../../docs/karento/DESIGN-SELECTION.md).
