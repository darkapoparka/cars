# Cars projects

All active source lives in `J:\cars` on `main`. Each dealer has one folder; its designs stay together. The master library is in `templates/`. Do not create another session checkout.

This inventory now has **43 dealer folders with Auto Best / Modern / Carwow source trees**, **1 dealer with one legacy Rencar application**, and **1 legacy alias/brief folder**. On 9 September 2026, the 26 campaign candidates that previously lacked the requested trio were seeded from the exact current template trees in commit `a5e4eba7c0e221604a49f758c898aa983f9c6216`. Those 26 are source-copy checkpoints only: they still contain master identity/content until explicitly personalized. Source presence is not completed personalization, QA, visual acceptance or publication.

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
| [al-aayan-used-cars](../clients/al-aayan-used-cars/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [al-basma-motors](../clients/al-basma-motors/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [al-fareed-used-cars](../clients/al-fareed-used-cars/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [al-hamoor-al-thahabi](../clients/al-hamoor-al-thahabi/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [amh-cars-bhm](../clients/amh-cars-bhm/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [amt-auto-sales](../clients/amt-auto-sales/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [asko-96](../clients/asko-96/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [astracar](../clients/astracar/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [autobedrijf-spinder](../clients/autobedrijf-spinder/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [autobedrijf-wester](../clients/autobedrijf-wester/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [autohandel-winter](../clients/autohandel-winter/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [autolife](../clients/autolife/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [automarket-varna](../clients/automarket-varna/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [avangard-auto](../clients/avangard-auto/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [car-finder-360](../clients/car-finder-360/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [cfo-auto-group](../clients/cfo-auto-group/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [champion-auto-pro](../clients/champion-auto-pro/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [depue-auto-sales](../clients/depue-auto-sales/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [eliqauto](../clients/eliqauto/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [elit-auto-import](../clients/elit-auto-import/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [excellent-cars](../clients/excellent-cars/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [f1rst-motors](../clients/f1rst-motors/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [five-auto](../clients/five-auto/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [good-wheels-auto-sales](../clients/good-wheels-auto-sales/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [heartlands-motor-group](../clients/heartlands-motor-group/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [icars-plovdiv](../clients/icars-plovdiv/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [ivo-auto](../clients/ivo-auto/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [keen-auto-mall](../clients/keen-auto-mall/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [kg-team-auto](../clients/kg-team-auto/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [legend-auto](../clients/legend-auto/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [mg7-group](../clients/mg7-group/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [midlands-trade-centre](../clients/midlands-trade-centre/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [my-car-outlet](../clients/my-car-outlet/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [navara-car](../clients/navara-car/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [neuhoff-auto-sales](../clients/neuhoff-auto-sales/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [nicky-ds](../clients/nicky-ds/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [priselci](../clients/priselci/) | Auto Best / Modern / Carwow | Existing; owner review pending |
| [sevierville-import-truck-center](../clients/sevierville-import-truck-center/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [success-automobile](../clients/success-automobile/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [texas-drive-auto](../clients/texas-drive-auto/) | Auto Best / Modern / Carwow | Recovered; unfinished, review pending |
| [the-dealers-point](../clients/the-dealers-point/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [valentino-auto-house](../clients/valentino-auto-house/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |
| [voivodov-auto-antonio](../clients/voivodov-auto-antonio/) | Auto Best / Modern / Carwow | Seeded exact masters; **needs personalization and QA** |

## Other existing folders

| Folder | Contents |
| --- | --- |
| [asko96](../clients/asko96/) | Legacy brief for `asko-96`; use that existing application folder |
| [dayandnight](../clients/dayandnight/) | Legacy Rencar application |

## Seed checkpoint

The 26 newly seeded dealer trios use the exact published `main` template trees from the seed commit's parent:

- Auto Best: `97833980ab127f6de8f675ac1a188e4b7f717976`
- Modern full workspace: `66bfb8196bbce18832ada6b34b02dda97baba25b`
- Carwow: `d4a08817e87cf84d08c4db1c08a515937245f2dd`

This deliberately creates independent source trees first; it does **not** assert dealer branding, stock, contacts, local assets, content sweep, framework checks or browser QA. Do not treat a seeded row as a finished demo or publish it before personalization and verification.

## Preservation and review

See [recovery record](LEAD-RECOVERY.md) for older source checkpoints and local archives. Existing [manual review notes](MANUAL-REVIEW.md) remain intact; this inventory does not change their results. Machine-readable [clients/index.json](../clients/index.json) predates the seed commit and must be regenerated by the coordinator before it is used as authoritative inventory. No deployment or dealer contact was performed as part of the seed checkpoint.
