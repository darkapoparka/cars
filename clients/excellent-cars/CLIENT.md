# Excellent Cars — Varna

Prospect visual trial, built 2026-09-07. No sale, agreement, registration, publication or outreach is implied.

Three independent Fast Skins cloned from the current Auto Best, Modern and Carwow masters, version `2026.09.06-refresh-1`, using the official clone helper after its successful dry run. Masters and ASKO copies were read-only. Existing source licenses and provenance remain in each copy. No credentials or source deployment bindings were copied.

## Verified identity and content

Business: Excellent Cars, Varna. Main public phone **0895 996 559**, additional published phones 0894 883 833 and 0878 377 562. Dealer address: corner of **Yan Hunyadi / Tsar Osvoboditel**, Vazrazhdane 1, Varna. The demo uses the dealer's junction description; Google number 178 is retained only as a research note. Cars.bg publishes navigation coordinates 43.23375, 27.87058.

Hours: Monday–Friday 08:30–19:00, Saturday 09:00–18:00, Sunday closed. Source: [Mobile.bg contacts](https://excellent.mobile.bg/contacts). Services published in the dealer's [About page](https://excellent.mobile.bg/about) and adverts include vehicle sales, purchase and trade-in, inspection and test drive, registration assistance, delivery/transport, detailing, roadside assistance and leasing on individual terms. No claim of dealer-owned finance is made.

Published logo, green brand colour and showroom image were downloaded from the matching Mobile.bg/Cars.bg profiles. `assets/logo-header.png` is a generated transparent/dark-lettering adaptation for light headers; the original logos are preserved. No official social profile or public email was sufficiently verified to wire as a dealer contact.

`stock.json` contains 16 representative published sale adverts captured 2026-09-07, each with real title, model/specification fields, EUR asking price, source URL and four actual photos. Advert availability is a snapshot and must be confirmed by phone. Two conflicting headline/description adverts were excluded. This is a selection from the dealer's catalogue, not a live inventory feed. Original image watermarks remain. Detailed observations and source HTML are in `research/`; download provenance is in `assets/provenance.json`.

## Retained compositions

- **Auto Best**: primary recommendation; entry `/`, stock `/listing-grid`, example `/listing-detail-v1/1`, contact `/contact`. Data/config, branding, contact facts, budget shortcuts and media personalized. The source video-card composition now shows source-backed advert cards. Its detail photo-count control now cycles the four real gallery images. Exact served-media budget is recorded in `asset-archive-plan.json`; unused source assets are preserved outside the served tree in `source-assets/auto-best`.
- **Modern**: full monorepo retained, entry `/cars`, locale `/bg/cars`. Existing static demo mode reads Excellent inventory and its matching directory record. Public/API/app origins are distinct: ports 6622, 6624, 6625. API/private-app services have not been started or configured.
- **Carwow**: entry `/`, stock `/inventory`, contact `/contact`. Existing separate desktop/mobile compositions retained. Public branding, inventory/galleries, contact facts, services and advert cards personalized. Template review cards now contain service information, with no invented customer testimony or star score. Historical `daynight` source symbols and retained route identifiers are implementation lineage, not dealer identity.

Generic vehicle cutouts, silhouettes, keys/calculator illustrations and explicitly labelled sample team/partner surfaces remain template/demo content. They are not represented as Excellent's inventory, premises, real staff or partnerships. No backend integration was added. Local enquiry preparation and provider-dependent forms do not establish real message delivery; no external enquiry was submitted during QA.

## Local review and verification

Assigned URLs: Auto Best `http://127.0.0.1:6621/`, Modern `http://127.0.0.1:6622/cars`, Carwow `http://127.0.0.1:6623/`. These are local-only review URLs. Final check results, screenshot paths, runtime state and exact restart commands are recorded in each `.client/project.json`, `BUILD-STATUS.md` and `qa/`.

Batch resource rule: every heavy install/check/build and preview+browser+teardown job runs through the shared `with-build-slot.ps1` wrapper. Only one such job per task is queued at a time. No own server remains running outside its bounded QA slot.

## External state

CRM: `registered: false`, IDs unverified. Public URL: null. No deployment, commits, pushes, messages or CRM writes performed.

## Final verification — 2026-09-08

All three local variants verified at 390/1440px; 28 route states and 6 interaction passes. Current fixes, build logs, screenshots, contact checks and remaining demo limits are recorded in [qa-final/FINAL.md](qa-final/FINAL.md). Review servers 6621/6622/6623 remain running, superseding the earlier stopped/queued runtime notes. No public deployment or message delivery is implied.
