# В.В.Ц - АУТО — session 07

Status: **blocked**, observed 2026-09-09. **None of the three requested applications is implemented.** This checkpoint is research, not a runnable build or owner-approved demo.

## Identity and existing work

Destination: `clients/vvc-auto/`, as assigned by the session-07 packet. No VVC application directory was present in the inspected main/old-astra client trees at `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca` and `bcff94eabfba2b3c604bb61d6ea916584e61e4d5`, or the main client index. Indexed search was inconclusive and other workers' unpublished files were not inspected. No occupied application, shared index, other branch or private CRM record was changed.

Primary profile: <https://vvc-auto.mobile.bg/>. The [Peugeot detail](https://vvc-auto.mobile.bg/obiava-11761335952643297-peugeot-rcz-1-6turbo) and [Auto.bg profile](https://www.auto.bg/dealer/vvc-auto) match **0888629959**, secondary **0894629959**, and **гр. София, Орландовци, ул. Железопътна 24Б**. A [Cars.bg profile](https://www.cars.bg/company/vvc-auto) has the same primary phone but says **улица Костадин Т Петров 3**. That older address is not silently substituted or treated as a second showroom. Reconcile its relationship before choosing a map pin.

Primary `/contacts` and `/about` failed to render; no confirmed hours, email or coordinates were established. Bounded name/domain searches did not establish an independent website or matched public social page. No social recency claim is made. Marketplace membership since 2017 is not proof of founding date; seller experience/finance statements are not independently verified guarantees.

## Listing observations and exclusions

The root currently reports 80 category advertisements but the header reports two. Neither is an independently verified available-stock count. Preserve request prices as null with **Цена при запитване**; never display zero or use them as the lowest cash-price offer.

The following primary references were inspected. They are a partial source sample, not the required completed 8–12-vehicle/gallery set. Prices are EUR, VAT not charged; advertised availability is unverified.

| Vehicle/source | EUR | Production / km | Specifications / retrieval |
| --- | ---: | --- | --- |
| [Dacia Sandero, 11788262701282201](https://vvc-auto.mobile.bg/obiava-11788262701282201-dacia-sandero-15000km) | 4,999 | 2016-01 / 15,000 | Petrol, manual, 73 hp, 1149 cm³, Euro 5, hatchback; root card read, detail cache miss |
| [Toyota Verso, 11781272211357816](https://vvc-auto.mobile.bg/obiava-11781272211357816-toyota-verso-1-8benzin-avtomatik) | 7,299 | 2012-04 / 166,000 | Petrol, automatic, 147 hp, 1800 cm³, minivan; root and detail read |
| [Peugeot RCZ, 11761335952643297](https://vvc-auto.mobile.bg/obiava-11761335952643297-peugeot-rcz-1-6turbo) | 5,999 | 2011-03 / 130,000 | Petrol, manual, 1600 cm³, coupe; power unknown; detail edited 2026-08-25 |

**Do not include as available stock:** [Mercedes E220, Car24 ID 53837657](https://www.car24.bg/obiava/53837657/mercedes-benz-e-220-cdi-amg-line) is price-on-request and explicitly flagged **Капариран\Продаден**. It is a white 2019-05 diesel automatic sedan, 216,000 km, 194 hp, 1950 cm³, Euro 6, with the matching phone/address. The combined status does not resolve reserved versus sold; preserve that uncertainty and exclude it from an available-only selection.

[Ford Fiesta, Mobile ID 11615984505730179](https://vvc-auto.mobile.bg/obiava-11615984505730179-ford-fiesta-1-6-tdci-74000km) was surfaced in an older indexed record explicitly categorized **За части**, with some components already sold. Its EUR 750 headline is not evidence of a sale-ready whole car. The direct detail fetch failed; the dated search evidence is sufficient to exclude it pending recheck, not to certify present condition. Do not use the old parts price as a showroom starting price.

## Visual/media gate

The Cars.bg profile exposes a [logo reference](https://g1-bg.cars.bg/users_logos/05348475f961b22cb608b046b1af0fd6.jpg), but direct image retrieval failed. Because that profile has an address discrepancy, the graphic must also be matched before adoption. Text extraction is not a visual determination that no branding exists.

Primary gallery references were followed: [Peugeot first photo](https://mobistatic2.focus.bg/mobile/photosorg/297/1/big1/11761335952643297_ER.webp) and [Toyota first photo](https://mobistatic3.focus.bg/mobile/photosorg/816/1/big1/11781272211357816_1y.webp). Both failed with cache misses. The Car24 Mercedes first-photo fetch failed too. These URLs are source references, not downloaded assets or a completed provenance manifest.

`publishedBranding`: unresolved visual verification. `sourceLogoUrl`: the unrendered Cars.bg reference above, not approved. `workingLogoPath`: null. `creationMethod`: none. `approvalStatus`: unresolved. No image generation or local asset integration occurred.

No applicable photograph-reuse authorization was found in the inspected source/repository records. There is no complete accessible permitted image set or usable visually verified logo. These are the essential unresolved media prerequisites; public visibility is not relabelled as permission. The explicit blocked-dealer rule applies, and the next named account is Maverik.

## Review and resume

Resume at visual-brand verification, applicable media provenance and accessible originals; then finish the representative whole-car sample and copy/personalize all three complete masters in an independent runner. No app source, per-variant metadata, dependency install, build/check, dev server, route matrix or viewport screenshots exist. There are no application review links yet; no test is marked passed. No deployment, dealer contact, Windows-drive work or background job occurred.
