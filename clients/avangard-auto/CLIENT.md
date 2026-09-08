# AVANGARD AUTO — three local Fast Skin demos

Prospect, Varna. Captured 2026-09-07. No sale, outreach, publication or CRM registration is implied.

## Verified business facts

- Name: AVANGARD AUTO, matched at https://avangard-auto.mobile.bg/ and its contact page.
- Address: бул. Цар Освободител 289, Варна, Владислав Варненчик.
- Phones: 0877 800 921 and 0896 391 615.
- Working hours and email are not published in the inspected Mobile.bg profile. Call before visiting.
- Advertised services: sale vehicles, assistance with registration and transit plates, transport in Bulgaria, and leasing under vehicle-specific terms. No claims of own finance, warranty, verified vehicle condition, trade-in, staff identities or customer reviews are adopted.
- Public social identities matched: Facebook avangardautovarna; Instagram avangard_auto_varna. Evidence saved locally.

## Inventory and media

16 representative sale adverts from the current 68-ad Mobile.bg catalogue, with real year, mileage, fuel, transmission, power and EUR price. Each has four original gallery photos (64 total). This is a dated snapshot, not a live feed; availability and price must be reconfirmed before visiting. Watermarks are preserved. Full source URLs and capture evidence are in stock.json, evidence/, and assets/provenance.json.

The original Mobile.bg logo is only 66x40 and Instagram's exposed image is 100x100. Both are preserved, along with the official Facebook cover. Header wordmarks are temporary plain typography in dark/light versions for legibility, explicitly not presented as a reconstructed official logo. The current social identity uses black, silver and white. Generic source decorative car cutouts are retained where they do not represent stock.

## Projects

All three copied from current master version 2026.09.06-refresh-1 with scripts/new-client.mjs after dry run; each file was hash-verified by the clone helper. Actual source layouts, routes and framework retained. ASKO was read-only implementation guidance, never a copy source.

| Variant | Folder | Assigned local entry |
| --- | --- | --- |
| Auto Best | auto-best | http://127.0.0.1:6626/ |
| Modern | modern | http://127.0.0.1:6627/cars |
| Carwow | carwow | http://127.0.0.1:6628/ |

Modern retains its entire monorepo. API 6629 and private app 6630 are configuration origins only; no services are running on those ports.

## Scope and limitations

- Forms are demonstrations. Auto Best prepares a local enquiry; Carwow shows a demo message without posting to the backend; Modern retains static demo mode. Phone links are the real contact path. No external enquiry was submitted in QA.
- Retained import/sell/calculator/account controls are sample flows, not a claim that every source service or provider is available. Conditions outside verified advertised services require direct confirmation.
- Source asset and license notes remain in each copy; this work makes no new rights determination. Unused historical assets may remain in Carwow/Modern source packages; wired dealer photos and identity were replaced.
- No production credentials, database connection, deployment binding, public preview, CRM write or outreach.
- Builds and browser QA run serially with the shared memory gate. Machine commit exhaustion caused an initial Node/Prisma failure; those attempts are not counted as passes.

See BUILD-STATUS.md for current checks and preview state; each .client/project.json and evidence/ contains final verification records. Preview jobs stop their own processes after testing.


## Final local QA — 2026-09-08

All three variants have final 390/1440 route and interaction evidence in qa-final/FINAL.md and qa-final/final-results.json. This supersedes older pending status notes. Public URL remains null; forms/providers remain demos.
