# Master refresh and ASKO96 Fast Skins

Requested work: refresh the owner-polished Auto Best (5173), Modern (6212) and Carwow (6517) sources into the J: library, then create three independent ASKO96 client trials. Import (6518) remains the reserve template and was outside this refresh.

## Refreshed masters

Version 2026.09.06-refresh-1. Transferred 60 Auto Best files, 43 Modern files and 32 Carwow files. Listener CWD, source repository identity and dirty changes were captured before copying. Source directories were read only; uncommitted owner polish was included. Destination changes were checked for conflicts, replaced files backed up, and every transferred hash verified after the refresh. Existing J: runtime configuration and README boundaries were preserved. Catalog, TEMPLATE.md, per-template metadata and source manifests record the refresh.

Evidence: refresh-plan.json, refresh-complete.json, refresh-integrity-final.json, baseline/ and metadata-before snapshots in this folder. No transferred-file hash mismatches remain.

Library previews restored: Auto Best http://127.0.0.1:6461/, Modern http://127.0.0.1:6462/cars, Carwow http://127.0.0.1:6463/. The original M: source previews were left running. Refreshed master entry pages render at 390 and 1440 without broken images, browser errors or horizontal overflow. Carwow's cold Vite compilation exceeded the first timeout; the warm recheck passed at both widths. Auto Best validation/build, Modern typecheck and Carwow check/build passed.

## Client trials

J:/cars/clients/asko-96/auto-best — http://127.0.0.1:6611/

J:/cars/clients/asko-96/modern — http://127.0.0.1:6612/cars

J:/cars/clients/asko-96/carwow — http://127.0.0.1:6613/

Cloned with scripts/new-client.mjs from the refreshed versions. Layouts and interactions retained, official branding/gold colors/copy/contact details applied, and 16 actual representative listings personalized. Details and exact per-project checks are in each .client/project.json and QA.md. All three have passing framework checks/builds and desktop/mobile rendered route and interaction evidence.

Source-backed facts and image provenance are in J:/cars/clients/asko-96/business-facts.json, stock.json and assets/provenance.json. Content comes from the supplied official website, Mobile.bg inventory/contact page and official YouTube channel. No stock availability, review count, finance guarantee or total inventory count was invented. Only 16 representative listings were selected; inconsistent upstream total counters were not used.

Generic decorative hero/service vehicles remain to retain the source artwork composition. Generated transparent cutout attempts contained baked backgrounds and were not shipped. Actual stock/gallery and showroom photos are sourced from the dealer. Old ASKO96-2/Plovdiv records and clients/asko96 were preserved. No CRM mutation, commit, push, public deployment or outreach occurred. Local forms and enquiry summaries do not establish delivery, and template legal copy needs dealer review before publication.
