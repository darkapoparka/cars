# ASKO96 Modern — local review

Template: Modern 2026.09.06-refresh-1, copied independently from J:/cars/templates/modern. Entry: http://127.0.0.1:6612/cars. Node 22.23.2, pnpm 11.4.0. No credentials or deployment bindings copied.

## Personalization

Official ASKO96 wordmark and secondary logo, Sofia showroom photo, verified phone/address/map/email/Facebook/YouTube and localized dealer copy. Sixteen representative stock entries and 52 source photographs from the dealer's Mobile.bg listings. The client-only directory fixtures now use the same ASKO96 data. Existing pages, navigation, cards, filters and enquiry behavior remain intact. The primary gold is dark enough for the source white button labels; the mobile financing header uses bright gold with dark controls. The old split-logo treatment was adapted to ASKO96's complete wordmark.

## Verification

- Frozen lockfile installation and Prisma client generation passed; no database connection was required.
- Web typecheck passed. Production build passed, including final branding changes; see modern-build-brand-final.log.
- Home /cars, /bg/cars, Toyota detail, contact, import, sell, lease, blog, privacy and terms: 20 route/viewport combinations at 390 and 1440 pixels, HTTP 200, no broken visible images, page/console errors or horizontal overflow.
- Final branding corrections were rendered again on sell, lease and detail at both widths.
- Mobile filters opened and dismissed with Escape; menu opened and dismissed. Toyota search returned one vehicle at both widths, opened the matching detail with the correct phone, and browser Back restored the query.
- No form was sent. The call link target is tel:+359899769696; map and social destinations match the supplied business.
- React review: branding/data changes retain component boundaries, state, event handling and routing. No new effects, fetch waterfalls or interaction architecture were introduced.

Evidence: J:/cars/audits/2026-09-06/results-asko-modern.json, results-asko-modern-brand-final.json and screenshots/asko-modern*.png. Interaction evidence: asko96-build/modern-interactions.json (mobile pass; first desktop selector was wrong) and modern-interactions-desktop.json (corrected desktop selector, passed).

## Limits

Local demo only. Stock is a dated snapshot, with availability/specifications and finance conditions requiring dealer confirmation. No live inventory sync, provider configuration or message delivery was certified. Source legal/guidance copy needs dealer review before publication. Generic decorative vehicle/service art remains; its internal filenames preserve source provenance. Official secondary logo contains its existing 28-year medal. Next development image sizing/hidden-parent warnings remain; no image failed to load. CRM registration remains pending; current Agency OS access could not be verified.
