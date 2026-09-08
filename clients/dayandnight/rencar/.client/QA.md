# Strict Rencar reskin QA — 2026-09-06

V1 was rejected for rebuilding the project. The following source-comparison sections record the restored V2 baseline before the owner's subsequent motion/surface polish request. Previous custom-app checks do not apply. The current polish exception is documented at the end of this report.

## Source fidelity

Read-only comparison of `J:/cars/templates/rencar` and this client confirms:

- All 45 page hierarchies, 28,178 elements, attribute keys, 17,950 class-bearing elements and 343 IDs match.
- All 1,178 form/control/label/option structures match, including 74 forms.
- App.svelte, main.js, template.js, all nine original CSS files and all thirteen original widget scripts are byte-identical.
- Page-manifest changes are titles only.
- All page edits replay exactly from `.client/skin-changes.json`; source/result hashes match. Changed link targets are solely the verified Day & Night phone substitution.
- Svelte autofixer ran against master and client App plus five homepages: all 12 checks returned no issues or suggestions.

## Browser comparison

All five original homes were rendered at 1440×900 and 390×844, in both source 6430 and skin 6601: 20 samples. Main section order/classes, form/control counts, navbar class and heading font match at each width. No rejected custom components are mounted. No page/console errors, broken images or horizontal overflow were observed. Screenshots: `.client/reskin-qa/`.

The final neutral background tint was additionally confirmed on Homes 1 and 4 at both widths. Geometry and animation are retained; branding CSS recolours existing imagery and fits replacement images to original image boxes.

`npm run check`: zero errors/warnings. `npm run build`: passed using the original lazy-loaded Rencar page architecture. Logs: `.client/reskin-qa/check.txt` and `build.txt`.

## Limits

This verifies a visual reskin, not a new dealer application's functionality. Original rental controls, sample cars/prices/reviews, example email/hours and remaining template copy are retained. They are not verified business facts. There is no claim of real reservations, messages, payments, stock sync or outreach readiness.

The rejected custom app and its records remain archived at `.client/rejected-v1`. Masters and original M: projects are separate.

The source scan reports 24 retained template placeholder-copy findings. They are disclosed source content, outside this branding-only visual correction. The substituted heading was shortened to fit the unchanged mobile type scale.

## Subsequent owner-requested motion and surface polish

The owner accepted the restored reskin, then explicitly requested calmer hovers/reveals and rounded/inset header and booking panels. Current changes are isolated to a linked `public/daynight/polish.css` and the original `public/assets/js/main.js` initializer. The latter removes WOW initialization and hero entrance choreography and disables carousel autoplay. Manual carousel controls remain operational. The original theme CSS is unchanged; the new overlay implements the requested surface bounds, radii and hover transitions.

All 45 page files still match the accepted reskin hashes. App.svelte, main.js, template.js and the original main stylesheet match the master. No native-Svelte migration or master-template changes were made.

Current browser evidence: `.client/polish-qa/results.json` and screenshots. All five homes, inventory, one detail and contact were rendered at 1440 and 390 pixels (16 samples): no page/console errors, broken images, horizontal overflow, hidden WOW content, active reveal animations or automatic carousels. Menu open/close, sticky header, search Escape/focus return, search URL, a stock checkbox, booking select and booking navigation, and the local contact-form notice passed at both widths. These are existing demo behaviors; the checkbox check does not prove stock filtering and form submission explicitly reports that nothing was sent. Manual hero-next and stationary-arrow/colour-only button hover were additionally checked. Reduced-motion CSS was checked on mobile.

At 1440 the white header is inset 24px on each side with a 50px end radius; at 390 it is inset 12px with a 28px radius. The Home 1 booking panel is centered (1200px wide at 1440, 366px at 390), with all four corners at 24px. Dropdowns render outside the surfaces without clipping. Mobile navigation and sticky states were visually inspected.

`npm run check`: zero errors/warnings. `npm run build`: passed. The polish stylesheet scan returned zero findings. The final hover-specificity correction was confirmed in-browser at 160ms. Original rental/example content and the source template's other limitations remain; this pass does not make the preview outreach-ready.

## Current pass: content-width header, centered About and style guide

The owner's subsequent request explicitly authorized a narrower header and a cleaner centered section approach informed by the running 5173 demo. Current contract: `J:/cars/docs/RENCAR-STYLEGUIDE.md`. Future promotion procedure: `J:/cars/docs/TEMPLATE-PROMOTION.md`. Both are linked from the workspace/client instructions. No promoted master exists yet.

Home 1 About now has a centered introduction and three service items using the existing 5173 heading/service copy and Rencar's bundled icon font. Its decorative collage, rental benefits and unverified experience badge were removed. The existing About link still goes to `/about.html`. The remaining page's sample content has not been relocalized. Scope verification in `.client/section-qa/changes.json` confirms Why choose us and every surrounding Home 1 section are byte-identical to the pre-pass copy; the other 44 page files retain their original reskin hashes. The initial 45-page structural identity claim is historical, with this explicit About exception now recorded.

Header surface width is 1248px at 1280, 1440 and 1920 viewport widths, aligned around the 1200px top-bar container. At 1024 it is capped to 1000px around the 960px container; at 390 it is 366px. All widths retain viewport gutters. This supersedes the earlier viewport-wide 24px-inset header.

Current layout evidence: `.client/section-qa/layout.json` plus desktop/mobile header/About screenshots. At 390, 1024, 1280, 1440 and 1920 there were no page errors, broken images, horizontal overflow or About heading clipping. About stacks to one service column on mobile and its link navigates correctly. The existing 16-sample route and interaction suite passed again at 390/1440; results were copied to `.client/section-qa/routes-and-interactions.json`.

Svelte autofixer: no issues/suggestions. `npm run check`: zero errors/warnings. `npm run build`: passed. Source UI scan: one retained FAQ placeholder-copy finding outside the changed About section. The source-comparison script now identifies the exact authorized About wrapper exception; all other section comparisons remain strict.

## Subsequent Home 1 hero/header cleanup

The owner requested a centered shorter hero, removal of the red repeated name and two vague buttons, a higher booking box, and bounded top information background. The compact top strip now contains the existing verified phone and the location/appointment information already used by the owner's 5173 demo. Example email/hours and template login/language/social shortcuts were removed from this Home 1 strip. The white main navigation is unchanged.

Home 1 retains all three original manual slides, existing background/vehicle media and the original headline. Repeated business-name eyebrows, filler paragraphs, About More/Learn More buttons, spiral and diagonal shapes were removed. The headline and car are centered; scoped CSS shortens the hero and raises the booking box. At 1440/1920 the box starts at about 481px, and at 390 it starts at about 414px. The information-strip width equals the white header width at each inspected size.

Evidence: `.client/hero-qa/` contains pre-change files, screenshots and the focused verification script/results. The original booking form and all source content below the hero are byte-identical to their pre-pass versions, including the newly accepted About composition and Why choose us. This pass is isolated to Home 1; original masters and Homes 2–5 are separate.

The existing 16 route samples and navigation/search/booking/contact interaction checks passed again at 1440 and 390. Svelte autofixer returned no issues/suggestions; Svelte check reported zero errors/warnings; build passed. The UI source scan still finds one retained FAQ placeholder outside this scope. At 320px a 4px document overflow remains outside the changed header/hero: removing both changed surfaces in the browser did not affect it. Their own heading and bounds fit; this narrow legacy overflow is not claimed fixed.

