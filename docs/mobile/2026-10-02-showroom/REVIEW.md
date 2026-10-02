# Mobile showroom adaptation — 2 October 2026

The owner approved making the inventory the home of the Mobile showroom template.
The entry screen now contains the showroom header, search, stock-condition tabs,
horizontal filter pills and photo-led cars. The navigation is Cars / Services /
Contact, with a local shortlist in the header. Filters, sorting, old search links
and vehicle Back retain the inventory context. Cars links avoid preloading a new
inventory URL on each search change.

Canonical source: `L:/CODEX/cars/templates/mobile`, Cars `main`.
Local production preview: <http://127.0.0.1:6474/>.

## Verification

Node 22.20.0: lint, TypeScript, all 57 domain tests and the production build passed.
The focused showroom suite passed 28 Chromium checks and 9 WebKit checks, with no
page or console errors. It covers search, condition and make/model selection,
quick and complete filter sheets, Escape focus return, sorting, tab navigation,
vehicle Back/Forward (including related cars) and scroll restoration, local saved cars, contextual enquiry
drafts, redirects and empty-result recovery.

Chromium route checks cover Cars, Services, Contact, Saved cars and a vehicle at
320, 390 and 1440 px. Short 320 × 480 filter/sort sheets keep their controls
reachable; Cars, Services and Contact also pass simulated 200% text reflow at
320 px. Lazy images are requested and decoded before asset assertions. The suite
waits for pending requests before replacing a document and retains its console
error gate. Representative rendered captures were visually inspected.

See [verification.json](verification.json), [Cars at 390 px](cars-390.png),
[Filters at 320 × 480](filters-320-short.png) and
[Contact at 390 px](contact-390.png).

## Template boundaries

The stock and vehicle detail facts remain captured samples. Example services
require dealer confirmation. `src/lib/showroom.ts` holds the verified identity
and contact configuration; the neutral template does not invent a phone number,
address or map. Enquiries save drafts on the current device and send no request.

This is local browser verification, with owner visual acceptance still pending.
No native-device parity, dealer personalization, template release or hosted
deployment is established by these checks. The donor/reference source is preserved.

Automatic approval review rejected cleanup of the inactive task dev output and
its junction, reporting only `blocked by policy`. The retained paths are
`L:/CODEX/cars/templates/mobile/.next-overlay-showroom` and
`C:/Users/radev/AppData/Local/Cars/mobile-89e4395-20261001/showroom-dev`.
The live preview uses the separate production `.next-review` output.
