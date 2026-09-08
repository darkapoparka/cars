# Excellent Cars — final local verification

Verified 2026-09-08. All three requested variants pass the local review flow at 390 and 1440px: 28 route/viewport checks and 6 interaction passes.

| Variant | Local entry | Framework evidence |
| --- | --- | --- |
| Auto Best | http://127.0.0.1:6621/ | Current qa-final/auto-validate.log: architecture/assets/Svelte check/build pass |
| Modern | http://127.0.0.1:6622/cars | Current qa-final/modern-typecheck.log and modern-build.log, exit 0 |
| Carwow | http://127.0.0.1:6623/ | Current qa-final/carwow-check-final.log and carwow-build-final.log, exit 0 |

Checks cover entry, inventory, one real detail, contact, about/imports, mobile menu Escape/focus return, filter dismissal, search, detail navigation, gallery where offered, and enquiry/phone destinations. The current checked pages have no broken images, horizontal overflow, uncaught page errors or console errors. See results.json and variant screenshots here. focused-results.json additionally verifies the financing phone, vehicle-detail map, static redirects, manifest, Modern lightbox and corrected budget filters. numeric-stock.json matches all 16 parsed prices and mileages against the captured stock.

Final repairs: readable existing logos on dark/colored headers, client logo in the retained chat button, unconfigured social placeholders hidden, financing phone and detail map bound to Excellent data, the inherited sample-profile map corrected, stale proposal/manifest/SVG identity removed, and non-breaking spaces parsed correctly for numeric prices and mileages. Svelte autofixer found no issues in edited components. React changes preserve existing rendering and state boundaries. No template layout, route structure, dependencies or backend was replaced.

Known accessibility gap: the Modern lightbox opens, changes photos and closes, but focus returns to the page body on mobile or a different gallery trigger on desktop. Menu Escape/focus return passes. This retained source interaction is recorded for a separate template accessibility fix.

All three local review servers remain available; publicUrl is null. Stock/photos retain captured source provenance. Forms, chat, account functions and live import feeds are not delivery-certified. Sample admin/team/partner routes remain declared template demonstrations. No external enquiry, deployment, commit, push or CRM change was made.
