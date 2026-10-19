# Cars Studio batch 3 — UAE dealer packs

Base: `a999878a921fb61b37bf198c43275550814f88cc` from `astra/m1-dealer-pack-pipeline` ([PR #16](https://github.com/darkapoparka/cars/pull/16)). Working branch: `astra/batch-3`. This report covers exactly the 100 assigned priority research IDs.

## Progress and scope

This is an in-progress checkpoint. `pending` means research, artwork or validation is still underway; it is not a completed or failed pack. Final status will use ready, skipped and failed.

Ready: **6**. Skipped: **1**. Failed: **0**. Remaining: **93**.

Ready means the existing retained-input replay and the existing production logo pixel checks have passed after visual review. Build acceptance is recorded separately below. Original logo source bytes or actual imagegen execution output identifiers are retained in each pack. All generated identities and redraws remain independent, unapproved previews.

Only assigned `dealers/<slug>/` folders and this report are changed. Registry and client identities were checked against the pinned source. Existing templates, scripts, workflows, locks, registry and clients are preserved. No provider writes or dealer contact. Public stock snapshots omit prices and retain at most three downscaled photos; availability is unconfirmed. Unknown contacts, addresses or hours remain empty. Named personal contacts and marketplace support/relay contacts are omitted.

## Smoke builds

Two sequential workflow dispatches are pending. No provider deployment is part of this batch.

## Per-lead status

| ID | Slug | Status | Logo source | Stock source | Notes / reason |
| --- | --- | --- | --- | --- | --- |
| `ae-dubai-best-cars-exporter-dxb` | `best-cars-exporter-dxb` | pending | redraw | [Public source](https://www.dubicars.com/dealers/dubai-best-cars-exporter-dxb-2897) | First retained-input replay passed; source logo being revised to pass production pixel contrast thresholds before readiness. |
| `ae-dubai-best-wheels-specialized-vehicles` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-billion-auto` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-car-4-me-fz` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-car-avenue-llc` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-car-links-motor-trading` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-car-nation-used-automobile-trading-for-export-llc` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-carmind-motors` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-chiron-used-cars-trading` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-chrome-used-cars` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-day-feliz-general-trading` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-delya-trading-llc` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-designo-car-trading-llc` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-designo-cars-trading` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-dream-motors-used-car-trading-llc` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-dubuy-auto-cars` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-durmaz-auto-export-and-trading-fzco` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-eco-international-motors` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-elena-used-cars` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-express-motors` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-first-edition-used-automobile-trading` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-fiyafe-cars` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-fox-l-t-d-used-automobile-trading` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-gangsta-world-luxury-automobiles-trading-llc-fz` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-ginza-motors` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-global-network-motors` | `global-network-motors` | ready | redraw | [Public source](https://auto.ae/globalnw/) | ['Current catalogue has one advertised Ford F-150; older Mercedes examples excluded. Current catalogue business phone used; historical directory number differs.'] |
| `ae-dubai-gma-star-used-automobile-trading-for-export` | `gma-star-used-automobile-trading-for-export` | ready | redraw | [Public source](https://www.dubicars.com/dealers/dubai-gma-star-used-automobile-trading-for-export-3308) | [] |
| `ae-dubai-golden-century-motors` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-golden-coast-auto` | `golden-coast-auto` | pending | redraw | [Public source](https://www.dubicars.com/dealers/dubai-golden-coast-auto-2511) | ['Email omitted: source address appears personal, ambiguous, or malformed.'] |
| `ae-dubai-great-west-east-auto` | `great-west-east-auto` | pending | redraw | [Public source](https://auto.ae/geartweauto/) | ['Published hours from AUTO.AE showroom page; not independently confirmed.'] |
| `ae-dubai-haroon-sharif-motors-fze` | `haroon-sharif-motors-fze` | pending | redraw | [Public source](https://www.oneclickdrive.com/company/dubai/haroon-sharif-motors-fze) | ['Marketplace relay numbers excluded; source catalogue provides address and published shop hours.', 'Phone is the dealer-attributed call link in the public vehicle card; common platform WhatsApp relay omitted.', 'Opening hours omitted because the platform repeats a generic schedule and independent verification is unavailable.'] |
| `ae-dubai-hh-motors-corporation` | `hh-motors-corporation` | pending | redraw | [Public source](https://www.dubicars.com/dealers/dubai-hh-motors-corporation-3299) | ['Email omitted: source address appears personal, ambiguous, or malformed.'] |
| `ae-dubai-hk-used-automobile-trading` | `hk-used-automobile-trading` | pending | redraw | [Public source](https://www.oneclickdrive.com/company/dubai/hk-used-automobile-trading) | ['Marketplace relay numbers excluded; source catalogue provides address and published shop hours.', 'Phone is the dealer-attributed call link in the public vehicle card; common platform WhatsApp relay omitted.', 'Opening hours omitted because the platform repeats a generic schedule and independent verification is unavailable.'] |
| `ae-dubai-huapeng-automobile-trading-fze` | `huapeng-automobile-trading-fze` | pending | redraw | [Public source](https://www.dubicars.com/dealers/dubai-huapeng-automobile-trading-fze-3368?page=1) | ['Email omitted: source address appears personal, ambiguous, or malformed.'] |
| `ae-dubai-impera-motors-llc` | `impera-motors-llc` | pending | redraw | [Public source](https://www.dubicars.com/dealers/dubai-impera-motors-llc-3421) | ['Email omitted: source address appears personal, ambiguous, or malformed.'] |
| `ae-dubai-intercars` | `intercars` | pending | redraw | [Public source](https://www.dubicars.com/dealers/dubai-intercars-2469) | [] |
| `ae-dubai-jr-auto-fzco` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-jump-sky-automobile-trading-fze` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-leader-automobile` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-liana-used-cars-trading-llc` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-low-mileage-llc-fz` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-mabuhay-motors-used-cars-trading-llc` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-macan-luxury-cars` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-mangame-motors` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-master-cars-used-car-trading-llc-fz` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-mehran-motors-fzco` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-metro-motors-llc` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-miran-motors-fzco` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-mirza-automobile-fze` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-mizdawy-motors` | — | pending | — | — | Research / pack preparation in progress. |
| `ae-dubai-mohd-fairoos` | — | skipped | — | [Public source](https://www.dubicars.com/dealers/dubai-mohd-fairoos-2908) | Seller account identifies a named individual; legal business identity unresolved after exact-name research. No personal-name pack or personal contacts retained. |
| `ae-dubai-motorx-group` | — | pending | — | [Public source](https://www.dubicars.com/dealers/dubai-motorx-group-3189) |  |
| `ae-dubai-mpi-middle-east` | `mpi-middle-east` | ready | proposal | [Public source](https://www.dubicars.com/dealers/dubai-mpi-middle-east-2184) | Three current attributed listing samples retained. Named email omitted. |
| `ae-dubai-muscle-cars-fze` | — | pending | — | [Public source](https://www.oneclickdrive.com/company/dubai/muscle-cars-fze) |  |
| `ae-dubai-my-way-motors` | — | pending | — | [Public source](https://mywayautos.com/) |  |
| `ae-dubai-new-abu-taj-motors` | `new-abu-taj-motors` | pending | redraw | [Public source](https://www.dubicars.com/dealers/dubai-new-abu-taj-motors-247) | Input check passes but production logo contrast requires removal of filled badge. Redraw underway. |
| `ae-dubai-noor-al-islam-used-cars` | — | pending | — | [Public source](https://uae.yallamotor.com/auto-companies/noor-al-islam-used-cars-10946) |  |
| `ae-dubai-passion-motors` | — | pending | — | [Public source](https://www.dubicars.com/dealers/dubai-passion-motors-3287) |  |
| `ae-dubai-pegasus-automobile-fze` | `pegasus-automobile-fze` | ready | redraw | [Public source](https://www.dubicars.com/dealers/dubai-pegasus-automobile-2488) | Three current attributed stock samples; faithful logo redraw with white monochrome dark/accent variants; input and production pixel checks passed. |
| `ae-dubai-pinnacle-automotive-international` | `pinnacle-automotive` | ready | redraw | [Public source](https://www.dubicars.com/dealers/dubai-pinnacle-automotive-international-2545) | Three current attributed stock samples; faithful logo redraw with white monochrome dark/accent variants; input and production pixel checks passed. |
| `ae-dubai-quick-cars` | — | pending | — | [Public source](https://www.dubicars.com/dealers/dubai-quick-cars-2977) |  |
| `ae-dubai-ramna-international-motors-fzco` | — | pending | — | [Public source](https://www.oneclickdrive.com/company/dubai/ramna-international-motors-fzco) |  |
| `ae-dubai-resource-motors` | — | pending | — | [Public source](https://www.oneclickdrive.com/company/dubai/resource-motors) |  |
| `ae-dubai-rose-auto` | `rose-auto` | ready | redraw | [Public source](https://www.dubicars.com/dealers/dubai-rose-auto-3267) | Three current attributed stock samples; faithful logo redraw with white monochrome dark/accent variants; input and production pixel checks passed. |
| `ae-dubai-roseva-motors` | — | pending | — | [Public source](https://dubai.dubizzle.com/motors/used-cars/tesla/model-y/2026/08/29/tesla-y-2024-2-447---1fd78ecfef54422180ecaeb168ba3964/) |  |
| `ae-dubai-royal-diamond-motors` | — | pending | — | [Public source](https://royaldiamondmotors.ae/ourcars/) |  |
| `ae-dubai-s-m-p-motors` | — | pending | — | [Public source](https://www.dubicars.com/dealers/dubai-s-m-p-motors-3086) |  |
| `ae-dubai-shabir-motors` | — | pending | — | [Public source](https://www.dubicars.com/dealers/dubai-shabir-motors-2280) |  |
| `ae-dubai-shamil-motors-llc` | — | pending | — | [Public source](https://www.oneclickdrive.com/company/dubai/shamil-motors-l.l.c) |  |
| `ae-dubai-sinolink-new-automobile-trading-dwc-llc` | — | pending | — | [Public source](https://www.dubicars.com/ar/dealers/dubai-sinolink-new-automobile-trading-dwc-llc-3352) |  |
| `ae-dubai-someet-motors-fze` | — | pending | — | [Public source](https://www.dubicars.com/dealers/dubai-someet-motors-2235) |  |
| `ae-dubai-speed-motors-llcfz` | — | pending | — | [Public source](https://www.dubicars.com/ar/dealers/dubai-speed-motors-llcfz-3350) |  |
| `ae-dubai-style-motors` | — | pending | — | [Public source](https://www.dubicars.com/dealers/dubai-style-motors-2538) |  |
| `ae-dubai-szs-auto-planet-trading-llc` | — | pending | — | [Public source](https://www.oneclickdrive.com/company/dubai/szs-auto-planet-trading-l.l.c) |  |
| `ae-dubai-tao-cars` | — | pending | — | [Public source](https://www.dubicars.com/dealers/dubai-tao-cars-3170) |  |
| `ae-dubai-three-camels-trading` | `three-camels-trading` | pending | redraw | [Public source](https://www.dubicars.com/dealers/dubai-three-camels-trading-3021) | ['Three dated public listing photos retained; no listing prices.', 'Faithful ImageGen redraw and proposed compact mark; source artwork and actual generation metadata retained.', 'Missing or uncertain public facts and personal contacts omitted.'] |
| `ae-dubai-trio-enterprises` | `trio-enterprises` | pending | pending | [Public source](https://www.dubicars.com/dealers/dubai-trio-enterprises-2929) | [] |
| `ae-dubai-us-motors` | `us-motors` | pending | pending | [Public source](https://www.oneclickdrive.com/company/dubai/us-motors) | [] |
| `ae-dubai-v8-motors` | `v8-motors` | pending | pending | [Public source](https://www.dubicars.com/dealers/dubai-v8-motors-3262) | [] |
| `ae-dubai-verona-used-cars` | `verona-used-cars` | pending | pending | [Public source](https://www.dubicars.com/dealers/dubai-verona-used-cars-3202) | [] |
| `ae-dubai-vip-class-motors-llc-fz` | `vip-class-motors-llc-fz` | pending | pending | [Public source](https://www.oneclickdrive.com/company/dubai/vip-class-motors-llc-fz) | [] |
| `ae-dubai-vip-stars-used-cars` | `vip-stars-used-cars` | pending | pending | [Public source](https://auto.ae/vipstars/) | [] |
| `ae-dubai-zohaan-motors-fzco` | `zohaan-motors-fzco` | pending | pending | [Public source](https://www.dubicars.com/dealers/dubai-zohaan-motors-fzco-3146) | [] |
| `ae-ras-al-khaimah-cantrust-used-cars` | `cantrust-used-cars-trading-llc-opc` | pending | pending | [Public source](https://licenseplate.ae/ar/cars/dealer/cantrust-used-cars-trading-llc-opc) | [] |
| `ae-ras-al-khaimah-texas-used-auto-trading` | `texas-used-auto-trading` | pending | pending | [Public source](https://www.instagram.com/texas__cars/) | [] |
| `ae-sharjah-abdo-al-muthannna-used-cars` | `abdo-al-muthannna-used-cars` | pending | pending | [Public source](https://licenseplate.ae/cars/dealer/abdo-al-muthannna-used-cars) | [] |
| `ae-sharjah-abdulla-al-jaberi-used-cars` | `abdulla-al-jaberi-used-cars` | pending | pending | [Public source](https://www.dubicars.com/dealers/sharjah-abdulla-al-jaberi-used-cars-2114) | [] |
| `ae-sharjah-abo-saif` | `abo-saif` | pending | pending | [Public source](https://auto.ae/abosaif/) | [] |
| `ae-sharjah-ahmad-alnajem-used-cars` | `ahmad-alnajem-used-cars` | pending | pending | [Public source](https://ae.opensooq.com/en/shops/shop-10216703) | [] |
| `ae-sharjah-ajman-tawhib-cars-trading` | `tawhib-cars-trading` | pending | pending | [Public source](https://ae.opensooq.com/en/shops/shop-46363162) | [] |
| `ae-sharjah-al-ahd-used-cars` | `al-ahd-used-cars` | pending | redraw | [Public source](https://www.oneclickdrive.com/company/sharjah/al-ahd-used-cars) | ['Three dated public listing photos retained; no listing prices.', 'Faithful ImageGen redraw and proposed compact mark; source artwork and actual generation metadata retained.', 'Missing or uncertain public facts and personal contacts omitted.'] |
| `ae-sharjah-al-anwar-al-khamsa-used-cars` | `al-anwar-al-khamsa-used-cars` | pending | pending | [Public source](https://licenseplate.ae/cars/dealer/al-anwar-al-khamsa-used-cars-trading-fzc) | [] |
| `ae-sharjah-al-aqsa-used-cars` | `al-aqsa-used-cars` | pending | redraw | [Public source](https://www.oneclickdrive.com/company/sharjah/al-aqsa-used-cars) | ['Three dated public listing photos retained; no listing prices.', 'Faithful ImageGen redraw and proposed compact mark; source artwork and actual generation metadata retained.', 'Missing or uncertain public facts and personal contacts omitted.'] |
| `ae-sharjah-al-asalh-used-cars` | `al-asalh-used-cars` | pending | pending | [Public source](https://licenseplate.ae/cars/dealer/al-asalh-used-cars-exhb) | [] |
| `ae-sharjah-al-bahrain-used-cars` | `al-bahrain-used-cars` | pending | pending | [Public source](https://licenseplate.ae/cars/dealer/al-bahrain-used-cars-tr-llc-sp) | [] |
| `ae-sharjah-al-behar-used-cars` | `al-behar-used-cars` | pending | pending | [Public source](https://licenseplate.ae/cars/dealer/al-behar-used-cars-exhb-llc-sp) | [] |
| `ae-sharjah-al-eman-opensooq` | `al-eman-used-cars-opensooq-company` | pending | pending | [Public source](https://ae.opensooq.com/en/shops/shop-66913328) | [] |
| `ae-sharjah-al-fadi-used-cars` | `al-fadi-used-cars` | pending | pending | [Public source](https://licenseplate.ae/cars/dealer/al-fadi-used-cars) | [] |
| `ae-sharjah-al-fakhamah-used-cars-llc` | `al-fakhamah-used-cars-llc` | pending | redraw | [Public source](https://www.oneclickdrive.com/company/sharjah/al-fakhamah-used-cars-llc) | ['Three dated public listing photos retained; no listing prices.', 'Faithful ImageGen redraw and proposed compact mark; source artwork and actual generation metadata retained.', 'Missing or uncertain public facts and personal contacts omitted.'] |
| `ae-sharjah-al-faras-al-thahabi-used-cars` | `al-faras-al-thahabi-used-cars` | pending | pending | [Public source](https://auto.ae/alfarasalthahabiusedcars/) | [] |

## Tool issues and limitations

The exact pipeline input checks are necessary but do not include production pixel contrast checks. The additional existing `inspectLogoPixels` gate identified source artwork requiring correction; shared tooling is unchanged. Environment-only public fetches required network-enabled execution because the default proxy was unavailable. No blocker has been worked around by relaxing the pack or logo contracts.

The inherited Signature desktop example-editorial disclosure limitation documented in PR #16 remains a shared-template issue outside this batch. Inputs do not imply dealer approval, hosted acceptance or release approval.
