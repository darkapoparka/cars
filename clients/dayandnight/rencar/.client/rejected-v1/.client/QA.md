# Day & Night Rencar · local QA

Date: 2026-09-06. Result: **local prototype verified for owner review**. Primary preview: http://127.0.0.1:6601/. Comparison: http://127.0.0.1:6601/variants.html.

## Source and runtime

- Client: J:/cars/clients/dayandnight/rencar, package day-and-night-rencar, independent copy without Git identity.
- Listener 6601: PID 22044, exact client working directory and direct Vite command verified. Node 24.18.0 was used for install/check/build.
- Source Rencar listener 6430: PID 76436, J:/cars/templates/rencar. All 316 original source files still match the clone manifest SHA-256 hashes.
- Donor listener 5173: PID 51708, physical M:/codex/agency-os-projects/leads/automotive/day-night-auto-group/autodeal-best-day-night. Current owner changes were preserved. Imported assets are individually recorded in provenance/assets.json.
- Evidence: qa/listeners.json and qa/master-integrity.json.

## Framework checks

- `npm ci`: passed with the retained lockfile.
- `npm run check`: 0 errors, 0 warnings. Evidence: ./check-final.txt.
- `npm run build`: passed, 121 modules transformed. Evidence: ./build-final.txt.
- Svelte autofixer: no issues in the adapted components. Native dialog references produce optional attachment suggestions only.
- Clean Product UI source scan: no findings; a source scan is supplemental to the rendered checks below.

## Rendered coverage

Chrome on Windows through Playwright; desktop 1440×900 and mobile 390×844.

All **22 route/viewport samples** passed with no page/console errors, visible broken images, horizontal document overflow or sampled stale rental identity. Routes: all five homes, catalog, one model detail, contact, about, services and comparison. Each has viewport, below-fold and full-page evidence in qa/screenshots. Screenshots were visually inspected, including card hierarchy, full homepage/footer, mobile menu, filters and contact.

All **19 interaction checks** passed across desktop/mobile:

- Global search, combined home criteria, make filters, sorting and URL updates.
- Empty results, reset, and restoration of query/sort through a detail and a related model.
- Vehicle image enlargement and close/Escape with focus and scrolling restoration.
- Mobile menu close/Escape, search Escape with a populated search field, and mobile filter close/Escape.
- Model-specific inspection enquiries and topic switching while retaining the selected model.
- Verified telephone destination and the public dealer contact link.
- Unknown model fallback, old booking-to-contact compatibility, invalid external return URL rejection, and legacy account not-found content.

The **12 responsive samples** cover Home 2, catalog, detail, contact, about and comparison at 320px and with 200% computed text-size emulation at 390px. They pass without horizontal overflow or out-of-viewport sampled content. The measurement temporarily disables document overflow clipping. All five hero compositions additionally passed independent 320/390px geometry and text-clipping inspection. This is browser emulation, not a claim of physical-device or cross-browser certification.

Evidence: qa/routes.json, qa/interactions.json, qa/responsive.json, qa/variant-previews.json. Comparison previews are unmodified screenshots of the actual five home layouts.

## Corrections completed during QA

Fixed a skewed Home 1 decoration causing 3px mobile overflow, Home 3 eyebrow contrast, inherited Home 4 text strokes/title sizing, inherited footer/header colors, low-contrast form labels, concatenated contact heading text, large-text wrapping, sort URL timing, related-model filter return, and native search-input Escape behavior. Final checks cover the resulting implementation.

## Content and delivery limits

This is a showroom concept with representative models. Model images are illustrative and prices are “По запитване”; current availability and specifications need dealer confirmation. Decorative cutouts/showroom scenes do not establish actual stock or premises. Public phone/address facts were checked; social URLs are inherited from the owner's current Auto Best configuration, without an independent social-profile audit.

The enquiry journey opens a phone call or the public dealer contact page. No message was sent and no local form delivery, booking, finance approval or inventory backend was claimed or tested. There is no public deployment, CRM mutation or outreach. Unknown routes use SPA not-found content, not server-side 404 responses.

The master Rencar template is still the rental baseline. Promotion of this dealer adaptation into a reusable master is a separate owner decision after visual review.

