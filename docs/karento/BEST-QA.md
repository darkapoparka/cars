# Karento Best local acceptance evidence

Checked on 6 October 2026. Local production preview: <http://127.0.0.1:6466/>. Original reference: <http://127.0.0.1:6462/>.

## Delivered organization

- Separate `templates/karento-best` candidate, using Home 3, Car List 2 and Car Details 3.
- Thirty clean website routes; complete member and dealer dashboard menus; Import directory/profile, Shop/product, Explore and News grid/article.
- One shared desktop/mobile menu definition. Existing home/list/detail links select the approved layouts. Original captured aliases remain accessible directly.
- Home 3 remains the base, with the owner-selected Home 2 Car Rental System and testimonial sections. Home 2's five stats sit in a bordered card inside the system section. Original source artwork remains preserved; mobile CSS fixes header/dashboard overflow and makes the borrowed testimonial cards readable on narrow phones.
- Details breadcrumb and Contact terms link corrected where the upstream capture pointed to absent pages.
- How It Works uses four original image-generated photographs, centered step captions and a responsive numbered list. The original icon diagram remains in the preserved source only.

## Results

| Check | Result |
| --- | --- |
| `npm run check` | 0 errors, 0 warnings |
| `npm run build` | Passed, Node adapter production output |
| `npm run qa` | 108 routes: 30 clean aliases plus 78 original aliases; consistent menus, selected destinations, retained section/image counts, 404 and CSS responses |
| Captured assets | 526 HEAD requests returned 200 |
| Browser routes | All 30 website routes at 1440, 390 and 320px; 90 final observations with no document overflow or broken images |
| Browser errors | No console errors observed during route and navigation checks |
| Click journeys | Home to Vehicles to Details 3; Shop/product; Import directory to source profile; News/article; mobile Dashboard to Member Area to My Profile |
| Best dependency audit | 0 reported vulnerabilities |
| `node scripts/check-workflow.mjs` | Passed |
| Original preservation | All 39 captured HTML SHA256 hashes and original route loader match pre-edit receipts; original process remains on 6462 |
| Release state | Template lock and dealer manifests unchanged; no publication or fleet migration |

HTTP report: [best-http-qa.json](best-http-qa.json). Browser observations, matched Home 3 screenshots, dependency audit and preservation receipts are under `runtime/karento-curation-20261006/` (ignored local evidence). Screenshots include `before-home-{1440,390,320}.jpg`, `after-home-{1440,390,320}.jpg`, `after-explore-1440.jpg` and `after-dashboard-menu-1440.jpg`.

The subsequent Home 2 section swap passed check/build, all 108 route and 526 asset checks, plus affected homepage checks at 320, 390 and 1440px. Testimonial card widths were 293, 363 and 470px respectively; the slider initialized at all three widths, with no missing images, duplicate stats blocks or console errors. Screenshots and final browser observations for this revision are in `runtime/karento-home2-sections-20261006/`, including desktop before/after system and testimonial captures, mobile testimonials and embedded stats.

The follow-up density adjustment reduced the combined system section from approximately 1077 to 763px at 1440px width (29%). Check/build and 108 route/526 asset checks passed again. At 320 and 390px the car fits the viewport, all five stats remain inside the section, and no document overflow, missing images or console errors were observed. Matched desktop before/after evidence and mobile measurements are in `runtime/karento-compact-system-20261006/`.

The photographic How It Works replacement passed check/build (0 diagnostics), all 108 route checks, 526 reference asset checks and byte-for-byte checks of the four new WebP assets. Unknown image names return 404. The responsive grid uses four desktop columns and two phone/tablet columns; 320, 390, 768 and 1440px checks found no section/document overflow or broken images. Desktop section height is approximately 604px; phone heights are 658px at 320 and 643px at 390. Find your car opens selected List 2; Talk with us opens Contact. No forms were submitted. Browser console checks were clear. Matched desktop before/after captures, mobile captures and observations are in `runtime/karento-generated-process-20261006/`. See [artwork provenance](HOW-IT-WORKS-ARTWORK.md) and [asset hashes](how-it-works-assets.json).

## Functional boundary

This acceptance covers local page composition, navigation and reference preservation. The approved inventory filter row/drawer and conversion of rental panels into sales/enquiry panels are pending. Inventory, testimonials, contact details, profiles, memberships, authentication, wallet and shop content retain reference demo behavior and need dealer personalization or backend implementation before a customer release. No successful purchase, enquiry or finance approval was tested or asserted.

Best reads its HTML, metadata and assets from the preserved sibling Karento source. Publisher packaging must include this dependency and license evidence before immutable release selection. Whether Best replaces Import or becomes a sixth dealer design is still an owner decision.
## Test-drive artwork revision, 6 October 2026

Replaced the open-door test-drive image with an image_gen photograph of a customer behind the wheel. The new view-20261006-v2.webp URL avoids immutable-cache collisions. Existing generated originals and the other three process images remain preserved; no original Karento source changed.

Validation: Svelte check has 0 errors and 0 warnings; production build passed; QA passed 108 routes, 526 reference assets and four current generated assets. Workflow documentation check passed. Browser checks at 1440, 390 and 320 px show all four images loaded and no horizontal overflow; browser error log was empty. Matched desktop before/after and phone evidence: runtime/karento-human-process-20261006/. Local Best preview remains http://127.0.0.1:6466/. Artwork still awaits the owner's visual selection.

## Restrained motion and account organization, 6 October 2026

Removed reveal/lift classes and delay attributes before rendering. Static counters replace odometers, brand lists replace automatic tickers, and loading/floating/sticky entrance effects are disabled. Vendor carousels remain initialized for deliberate arrows/swipes, start paused and use a 220ms transition (zero with reduced motion). Public navigation has seven entries, with View cars replacing Add Listing. Footer account/owner entries preserve access to all eleven dashboard screens through their sidebars. Owner/member screens have a demo notice and current-page state.

Svelte check: zero errors/warnings. Production build passed after using the existing relative-module import convention for the new script endpoint. HTTP QA passed all 108 routes, 526 original assets and four active generated images; it checks owner-only Add Listing, public navigation, internal dashboard destinations and immediate content. The documentation workflow check passed.

Browser evidence covers seven affected routes at 1440, 390 and 320px (21 cases): no horizontal overflow, reveal targets or hidden content headings, and no console errors. All five homepage slider positions remained unchanged while idle; the hero Next arrow advanced its slide. Desktop Explore and phone Explore opened; the phone menu closed. Footer Owner area opened the dashboard; its sidebar Add Listing opened the correct screen and active-page marker. Screenshots and observations are in runtime/karento-motion-20261006/. Authentication, persistence and role permissions are not implemented by this visual pass; original Karento and dealer publication remain unchanged.

## Sign-in dashboard entry correction, 7 October 2026

The owner rejected the footer account entry. Account access now runs through Sign in: the login preview offers Dealership owner or Member, and Sign in to demo opens `/dashboard` or `/account`. It requests no credentials. A tab-local preview role changes the desktop/mobile account link to Dashboard or My account and provides Sign out; it grants no authentication or server permissions. The footer account entries are removed. The owner overview heading now says Owner Dashboard.

Verified the desktop header Sign in journey, owner destination, persistent Dashboard entry when returning to the website, Sign out, and the Member destination. Repeated owner sign-in and mobile-menu sign-out at 390 and 320px. Final 1440/390/320 dashboard checks show the correct heading and Dashboard entry, no footer account link, no horizontal overflow, and no console errors. Evidence: runtime/karento-signin-20261007/. Build, Svelte check and the 108-route/526-reference-asset/four-generated-asset QA passed. Real authentication and saved inventory remain unimplemented.

## Desktop header wrapping correction, 7 October 2026

The added Sign out control exceeded the reference's fixed 405px right-side group, wrapping View cars onto a second row. Tagged that group explicitly and applied a desktop-only flex layout with no wrapping, intrinsic right-side width, compact margins and balanced navigation spacing. Existing account and mobile-menu behavior is retained. The public desktop header now measures 76px at the full navigation widths, compared with 96px in the reported broken state.

Checked 1200, 1280, 1366, 1400, 1440 and 1920px on public/owner screens, and the owner, member and signed-out account states. Visible controls align on one row, with no visible menu overlap or horizontal overflow. The existing collapsed navigation below 1400px is preserved. At 390 and 320px, header heights, logo widths and right-side widths match their pre-change measurements. Browser console errors were absent. Svelte check, production build and all 108 route/526 reference asset/four generated asset checks passed. Evidence: runtime/karento-header-20261007/, including the reported-style My account header and desktop before/after screenshots.

## Shared Home 3 header correction, 7 October 2026

Previously only the menu links were shared; inner pages retained their own captured header compositions and contact strips. Every Best route now receives Home 3's header, mobile menu and side panel before route/menu/account personalization. Home 3 uses the upstream CSS class `header-home-2`, but the selected source is `index-3`, recorded on the rendered header. The original Karento source is unchanged.

Svelte check passed with zero errors/warnings; production build and all 108 route, 526 reference asset and four generated asset checks passed. HTTP QA now asserts Home 3's header composition and controls on every route, with no alternate top strip. Browser checks cover Home, Vehicles, Details, Contact, Dashboard and Login at 1440px; Home, Vehicles and Dashboard at 390/320px; and Dashboard at 1920px. Desktop headers measure 76px, while phone headers match Home 3 at 96px/87.84px. No horizontal overflow, broken images or browser console errors were observed. Vehicles navigation, desktop/phone Explore and mobile menu closing work. Evidence, including matched Vehicles before/after captures: `runtime/karento-shared-header-20261007/`.

## Direct Import navigation, 7 October 2026

Import is now a direct desktop/mobile link to `/import`, with no directory/profile dropdown. Source names and logos open `/import/source`. This retains the existing shared illustrative detail page; individual source data and profiles are not implemented by this navigation change.

Svelte check passed with zero errors/warnings, production build passed, and HTTP QA passed all 108 routes, 526 reference assets and four generated assets. Browser journeys verified desktop Import to directory to profile, source logo navigation, and the same phone menu journey at 390/320px. No Import submenu, horizontal overflow or console errors were observed. Evidence: `runtime/karento-import-navigation-20261007/`.

## Direct Shop navigation, 7 October 2026

Shop is now a direct desktop/mobile link to `/shop`. Product images, names and existing Buy Now links open `/shop/product`; the Product Details menu option is removed. Product title links occupy their full rectangular area so wrapped names have no gaps in their clickable area. Products still use the existing shared sample detail page; no checkout or distinct product data is introduced.

Svelte check passed with zero errors/warnings, the final production build passed, and HTTP QA passed 108 routes, 526 reference assets and four generated assets. Desktop Shop to grid to product title navigation and phone Shop to grid to product image navigation at 390/320px passed. All twelve product grid images are linked. No Shop submenu, horizontal overflow or browser console errors were observed. Evidence: `runtime/karento-shop-navigation-20261007/`.
