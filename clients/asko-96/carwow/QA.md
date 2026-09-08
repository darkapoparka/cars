# ASKO96 Carwow QA — 2026-09-07

Local preview: http://127.0.0.1:6613/ · PID28564 · Node24.18.0 · J:/cars/clients/asko-96/carwow.

- npm ci from retained lockfile: passed.
- npm run check: 0 errors, 0 warnings.
- Final npm run build: passed; .client/build.log.
- 44 changed public Svelte files reviewed with Svelte autofixer, plus final6 components. Retained external-URL false positives and existing bind:this suggestions; no Svelte compile errors.
- 30 route/viewport visits across390/1440: home, inventory, detail, contact, sell, services, financing, about, team, service-information cards, FAQ, terms, blog and inventory map. HTTP200, no horizontal overflow/broken visible images/page errors. Browser evidence found and corrected a hidden source financing phone and sell disclosure label.
- Final12 route/viewport visits: clean after corrections; .client/qa-final.json.
- Mobile Toyota filter showed one real listing; desktop Audi filter showed3 real listings. Detail navigation, telephone destinations, import navigation and menu dismissal tested. Menu closes after inherited exit animation (~1.6s), matching source6517.
- Verified ASKO YouTube thumbnails rendered in viewport: .client/youtube-1440.png.

Final home screenshots: .client/final-390-home.png, .client/final-1440-home.png. More routes: .client/final-*.png. Original matrix and interaction records: .client/qa-routes.json and .client/qa-interactions.json.

Limits: selected16-listing published snapshot, availability/terms confirmed by dealer; generic decorative source car cutouts/body/budget illustrations retained; forms/chat are clearly local demos with no delivery configuration; no external submissions, public deployment or CRM registration. Legacy/presentation/admin sample paths are retained but not offered as homepage variants. Viber availability, physical-device behavior and hosted acceptance remain unverified. Internal source identifiers and unreferenced source assets remain for provenance.
