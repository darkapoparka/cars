# Cars projects

All active source lives in `J:\cars` on `main`. Each dealer has one folder; its designs stay together. The master library is in `templates/`. Do not create another session checkout.

This inventory has **17 dealers with three application sources**, **1 dealer with one application**, and **8 research/brief folders**. Another **19 assigned candidates have no project folder**. Source presence is not completed personalization or visual acceptance.

## Three-design review queue

Start one dealer at a time. Keep Auto Best, Modern and Carwow on ports 6631, 6632 and 6633 unless explicitly choosing another free base port.

```powershell
./scripts/start-client.ps1 -List
./scripts/start-client.ps1 -Client navara-car -Prepare
./scripts/start-client.ps1 -Client navara-car
```

`-Prepare` installs missing dependencies from lockfiles and generates Modern's Prisma client locally. It does not start servers or connect a database. Starting checks every selected port and dependency first. Stop only the previous dealer's confirmed listeners before switching. The launcher records project paths and process IDs under `runtime/`. Inspect each design together in the browser before marking it accepted.

| Dealer folder | Designs | Source status |
| --- | --- | --- |
| [al-basma-motors](../clients/al-basma-motors/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [al-hamoor-al-thahabi](../clients/al-hamoor-al-thahabi/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [asko-96](../clients/asko-96/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [astracar](../clients/astracar/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [autolife](../clients/autolife/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [automarket-varna](../clients/automarket-varna/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [avangard-auto](../clients/avangard-auto/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [champion-auto-pro](../clients/champion-auto-pro/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [eliqauto](../clients/eliqauto/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [elit-auto-import](../clients/elit-auto-import/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [excellent-cars](../clients/excellent-cars/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [ivo-auto](../clients/ivo-auto/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [kg-team-auto](../clients/kg-team-auto/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [legend-auto](../clients/legend-auto/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [navara-car](../clients/navara-car/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [priselci](../clients/priselci/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [texas-drive-auto](../clients/texas-drive-auto/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |

## Other existing folders

| Folder | Contents |
| --- | --- |
| [al-aayan-used-cars](../clients/al-aayan-used-cars/) | Research/handoff only; no application source |
| [al-fareed-used-cars](../clients/al-fareed-used-cars/) | Research/handoff only; no application source |
| [asko96](../clients/asko96/) | Legacy brief for asko-96; use that existing application folder |
| [cfo-auto-group](../clients/cfo-auto-group/) | Research/handoff only; no application source |
| [dayandnight](../clients/dayandnight/) | rencar |
| [keen-auto-mall](../clients/keen-auto-mall/) | Research/handoff only; no application source |
| [mg7-group](../clients/mg7-group/) | Research/handoff only; no application source |
| [midlands-trade-centre](../clients/midlands-trade-centre/) | Research/handoff only; no application source |
| [neuhoff-auto-sales](../clients/neuhoff-auto-sales/) | Research/handoff only; no application source |

## Assigned but never created

- VALENTINO AUTO HOUSE — `clients/valentino-auto-house`
- Success Automobile — `clients/success-automobile`
- VOIVODOV AUTO & ANTONIO — `clients/voivodov-auto-antonio`
- icars — `clients/icars-plovdiv`
- FIVE AUTO — `clients/five-auto`
- The Dealers Point — `clients/the-dealers-point`
- F1rst Motors — `clients/f1rst-motors`
- AMT AUTO SALES LLC — `clients/amt-auto-sales`
- Depue Auto Sales Inc — `clients/depue-auto-sales`
- MY CAR OUTLET — `clients/my-car-outlet`
- Good Wheels Auto Sales, Inc — `clients/good-wheels-auto-sales`
- Sevierville Import & Truck Center — `clients/sevierville-import-truck-center`
- Nicky D's — `clients/nicky-ds`
- AMH Cars Bhm Ltd — `clients/amh-cars-bhm`
- Heartlands Motor Group — `clients/heartlands-motor-group`
- Autohandel Winter — `clients/autohandel-winter`
- Autobedrijf Spinder — `clients/autobedrijf-spinder`
- Autobedrijf Wester — `clients/autobedrijf-wester`
- Car Finder 360 — `clients/car-finder-360`

These are retained research records, not missing Git pulls. Building them is a separate task.

## Preservation and review

See [recovery record](LEAD-RECOVERY.md) for source checkpoints and local archives. Existing [manual review notes](MANUAL-REVIEW.md) remain intact; this inventory does not change their results. Regenerate this list with `node scripts/index-clients.mjs`. Machine-readable inventory: [clients/index.json](../clients/index.json). No recovered demo was deployed as part of consolidation.
