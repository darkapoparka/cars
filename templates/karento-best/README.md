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
| Import | Direct link to `/import`; source names and logos open the profile at `/import/source` |
| Shop | Grid at `/shop`, product at `/shop/product` |
| Explore | About, Services, Membership & Pricing, Calculator, FAQ, Terms, Contact, Login, Register, designed 404 preview |
| News | Grid at `/news`, article at `/news/article` |
| Contact | `/contact` |

Sign in opens the login preview. Selecting Dealership owner and Sign in to demo opens `/dashboard`; Member opens `/account`. The chosen preview area persists in the current browser tab, changes the header/mobile entry to Dashboard or My account, and provides Sign out. Dashboard access is not in the footer. The six member screens and five owner screens live inside their existing sidebars. Add Listing is available in the owner area; the public header has a View cars action. Dashboard screens explicitly identify their sample data and unsaved changes. This preview collects no credentials and is not authentication or a working inventory backend.

Motion is restrained throughout the derivative: scroll reveals and lifting classes are removed before rendering; counters are static; brand lists wrap without a ticker; decorative artwork and sticky-header entrance animations are disabled. Carousels start paused and retain deliberate arrows/swiping with a short transition, respecting reduced-motion preferences. Buttons, links and cards retain subtle color/border feedback and visible keyboard focus. The shared original vendor assets remain untouched.

Every page uses Home 3's header, mobile menu and side panel, composed from the preserved `index-3` source before applying the shared navigation and account controls in `src/lib/server/site.mjs`. Inner pages no longer inherit their original header contact strips. All existing home, catalogue and vehicle-detail links lead to the selected layouts. Original captured route names remain accessible directly for reference, but alternate layout selectors are removed from the website menus.

Import reuses the original dealer directory/profile composition with source-oriented labels and explicitly illustrative source content. It is not an assertion of approved sourcing relationships. Shop, memberships, authentication, wallet, bookings, calculators and dashboard data retain their reference demo behavior; working commerce, authentication and saved user data require separate backend implementation.

The approved catalogue filter row/drawer and conversion of rental panels to vehicle-sale enquiry panels remain follow-up functional adaptations. This pass organizes the requested pages and preserves their layout and existing interactions.

## Source preservation and publishing boundary

The HTML page bodies, metadata and vendor assets are read from `../karento`; this project does not maintain a second copy of the captured library. SvelteKit bundles the HTML and shared static assets into its own production output. CSS for this derivative is served from `/dealer-site.css`.

Before publisher/release integration, source packaging must include the explicit Karento dependency and license evidence. This local candidate is not an approved template-lock entry and does not change any existing dealer or hosting provider. See [design decisions](../../docs/karento/DESIGN-SELECTION.md).
