# Karento curated dealer design selection

Owner decisions recorded from the Cars chat on 6 October 2026.

The owner subsequently chose the name **Karento Best** for the curated dealer website and explicitly asked to keep the complete **Karento** reference. Implementation lives in `templates/karento-best`; the 39 captured page bodies and original Karento route loader remain preserved.

## Selected page layouts

| Page | Selected source | Status |
| --- | --- | --- |
| Homepage | Home 3: `/index-3.html` | Karento Best root `/` |
| Vehicle catalogue | Car List 2: `/cars-list-2.html` | `/vehicles`; filtering adaptation below remains pending |
| Vehicle details | Car Details 3: `/cars-details-3.html` | `/vehicle`; sale/enquiry adaptation remains pending |

Canonical reference source: `L:/CODEX/cars/templates/karento`, still available at `http://127.0.0.1:6462/` with Home 2 as its default. Curated website: `L:/CODEX/cars/templates/karento-best`, production preview at `http://127.0.0.1:6466/` with Home 3 as its default.

## Supporting pages and navigation selected by owner

Keep the original page layouts and artwork, organizing the full requested website rather than trimming it to six pages:

| Header | Selected content |
| --- | --- |
| Home | Home 3 |
| Vehicles | List 2 and Details 3, with alternate-layout menus removed |
| Import | Direct link to the source directory; source names/logos open their illustrative profile. Future real data may describe sources, brands or countries |
| Shop | Direct link to the product grid; product images and names open product details |
| Explore | About Us, Services, Membership & Pricing, Car Calculator, FAQ, Terms, Contact, Login, Register, 404 Preview |
| News | News grid and article details |
| Contact | Contact page |

The owner requested a useful name instead of Pages. **Explore** is the implementation choice for this pass. Desktop and mobile share the same route/menu definition. On 7 October the owner identified inconsistent inner-page headers. Home 3's header, mobile menu and side panel are now shared across every Best route, removing the original inner-page contact strips. Website cards and original links lead to the chosen home/list/detail variants. The complete original library remains independently accessible.

After the owner asked for further polish and questioned the public Add Listing and Dashboard menu, the public Dashboard dropdown was removed. On 7 October the owner rejected the footer account entry and specified access through Sign in. Sign in now opens the login preview; its owner selection opens `/dashboard`, while Member opens `/account`. A browser-tab preview role changes the header/mobile entry to Dashboard or My account and provides Sign out. No credentials are collected and no authentication is asserted. All six member and five owner screens remain accessible through their internal sidebars, with a current-page state. The public header action is View cars; Add Listing belongs to the owner dashboard. Account and owner screens show a short demo notice. Real authentication, owner permissions and saved inventory still require backend implementation.

## Agreed visual direction

On 6 October 2026 the owner refined the homepage composition: keep Home 3 as the base, replace its Car Rental System block with Home 2's centered `.section-cta-4`, move Home 2's five statistics into a bordered card inside that block, and replace the collage testimonials with Home 2's centered heading and testimonial card slider. The original standalone stats block is removed. These sections are composed from the preserved Home 2 source in Karento Best only.

After the owner found the combined system section too large, its outer padding, card padding, gaps, car height and stats typography were reduced. It measures approximately 763px at 1440px width, compared with 1077px before tightening. All three captured homes use essentially the same How It Works treatment. The owner then requested a photographic replacement using image-generated assets inspired by the Mobile template's Services page on port 6474.

The proposed photographic direction is implemented as four centered steps: Find your car, Talk with us, View & test drive, Make it yours. The owner rejected the repetitive first set; test drive now shows a person behind the wheel. The overall artwork set remains a visual draft. Responsive cards replace the original icon diagram in Karento Best. Original reference assets remain unchanged. See [artwork provenance](HOW-IT-WORKS-ARTWORK.md).

The owner also requested restrained motion. Reveals, lifted hovers, animated counters, floating artwork, loading overlay and moving brand tickers are removed from the derivative. Carousels start paused, with short transitions for manual arrows or swipes. Sticky navigation stays in document flow without an animated entrance. Color, border and focus feedback remain available, and reduced-motion preferences are respected.

- Favor centered hero text and section headings, and compact vehicle cards.
- Preserve Home 3's visual composition and Car List 2's full-width grid.
- Keep vehicle specifications and other comparison data consistently aligned for scanning; centered sections do not require centering every field.
- Keep the complete Karento reference available as the internal design library. The intended dealer proposal is a curated website built from selected layouts.

## Agreed catalogue filtering

Use Car List 2 with a compact filter row: Make, Model, Price, Year, and All filters.

All filters opens a side drawer for mileage, fuel, transmission, body type and other relevant criteria. Show applied filters as removable chips. On mobile, provide a clear Filters button with a selection count, alongside Sort.

Car List 1 exposes a permanent sidebar. Car List 2 currently hides the sidebar with `d-none`; its toolbar does not expose an advanced filter drawer. Its current location/date search is rental-oriented. This organization pass retains those reference controls. Implement and connect dealership filtering to the inventory as the next functional adaptation; do not describe it as completed filtering behavior.

## Details 3 adaptation

Retain its main gallery, thumbnail strip, specification blocks, content sections and separate action panel. Replace rental dates, rental extras and daily booking totals with vehicle sale price, dealer contact and enquiry/test-drive actions. Remove or replace inherited identities, unrelated placeholder text and sample reviews. Forms must describe their actual demo or connected behavior truthfully.

## Recommended refinements, not implemented

- A dealer location, hours and phone strip remains an optional future adaptation; the current shared header is Home 3 without a top strip.
- Shorten the mobile hero/search area so inventory appears sooner.
- Trim unnecessary lower homepage sections.
- Supporting pages are now selected as listed above; real account, membership, shop, wallet and dashboard integrations remain separate work.

## Acceptance boundary

This pass implements a separate local Karento Best website with shared navigation, clean routes, selected page-link destinations and Import wording. It preserves existing frontend demo interactions. The reference HTML and assets are shared dependencies; the Best production output bundles them. Publisher source collection must include them before release integration.

Check/build and local HTTP/browser evidence are recorded in `BEST-QA.md` and `best-http-qa.json`. These local checks do not constitute real transaction/authentication integration or hosted release approval. Whether Karento Best replaces Import as the fifth design or temporarily becomes a sixth remains undecided. The approved template lock, publisher and dealer manifests were not changed; existing releases and dealer URLs remain authoritative until a reviewed migration.
