# Where the dealer projects live

Existing dealer application folders are under `L:/CODEX/cars/clients/<slug>/`. Compact expansion packs are under `dealers/<slug>/`; their published source links and displayed details use the exact deployment receipt commit. This includes prospect demos; the word clients does not mean that the business has bought a site.

## Navara example

`clients/navara-car/` contains `auto-best/`, `modern/`, `carwow/`, `app/`, the dealer manifest and shared branding assets. The folder name is **navara-car**, while its publishing repository and Vercel project use **cars-navaracar**.

`Cars clients/navara-car source -> reviewed package/export -> darkapoparka/cars-navaracar -> Vercel cars-navaracar`

Vercel deploys the dedicated repository. A local edit or folder move does not update the hosted site. Use the timestamped source, deployment and browser evidence in the registry; compare current GitHub source and preserved local changes before publishing.

## One visible folder; two existing Git ownership modes

**Cars-owned:** Most dealer folders are source in the Cars repository. Their dedicated GitHub repositories contain the deployable packages. Use Cars packaging/export tools and preserve any publishing-only fixes.

**Independent:** `al-reef-used-cars/` sits beside the other dealers but keeps its own `.git` and `darkapoparka/cars-alreefusedcars` repository. Cars explicitly ignores that application tree. Open/publish the independent repository directly; never run the legacy Cars exporter over it. Independent means Git ownership, not a second client-directory location.

`L:/CODEX/cars-clients` was the old one-dealer pilot container and has been removed. The old I: compatibility path points to the shared clients directory. Recovery snapshots are not active source.

`L:/CODEX/cars` is the canonical Cars workspace. `J:/cars` is a compatibility junction to it. Former `J:/template-repos` copies are recovery material; current template masters live under `templates/` in Cars.

## Registered public dealer projects

The registry contains 129 dealer public aliases below. These rows are generated from ../docs/DEPLOYMENT-INVENTORY.json; they are a source-location guide, not a fresh visual acceptance report.

| Dealer / source folder | Source ownership | Published source | Hosting project / Worker | Public website |
| --- | --- | --- | --- | --- |
| Not recorded — `abcbulgaria-varna/` | Cars repository | [darkapoparka/cars-abcbulgaria-varna](https://github.com/darkapoparka/cars-abcbulgaria-varna) | `Not recorded` | [abcbulgaria-varna.webpreviews.site](https://abcbulgaria-varna.webpreviews.site/) |
| Al Basma Motors — `al-basma-motors/` | Cars repository | [darkapoparka/cars-albasmamotors](https://github.com/darkapoparka/cars-albasmamotors) | `cars-albasmamotors` | [cars-albasmamotors.vercel.app](https://cars-albasmamotors.vercel.app/) |
| Al Hamoor Al Thahabi Used Cars — `al-hamoor-al-thahabi/` | Cars repository | [darkapoparka/cars-alhamooralthahabi](https://github.com/darkapoparka/cars-alhamooralthahabi) | `cars-alhamooralthahabi` | [cars-alhamooralthahabi.vercel.app](https://cars-alhamooralthahabi.vercel.app/) |
| Al Reef Used Cars — `al-reef-used-cars/` | Own Git repository (not tracked by Cars) | [darkapoparka/cars-alreefusedcars](https://github.com/darkapoparka/cars-alreefusedcars) | `cars-alreefusedcars` | [cars-alreefusedcars.vercel.app](https://cars-alreefusedcars.vercel.app/) |
| Not recorded — `am-varna-varna/` | Cars repository | [darkapoparka/cars-am-varna-varna](https://github.com/darkapoparka/cars-am-varna-varna) | `Not recorded` | [am-varna-varna.webpreviews.site](https://am-varna-varna.webpreviews.site/) |
| АСКО 96 — `asko-96/` | Cars repository | [darkapoparka/cars-asko96](https://github.com/darkapoparka/cars-asko96) | `cars-asko96` | [cars-asko96.vercel.app](https://cars-asko96.vercel.app/) |
| Астракар — `astracar/` | Cars repository | [darkapoparka/cars-astracar](https://github.com/darkapoparka/cars-astracar) | `cars-astracar` | [cars-astracar.vercel.app](https://cars-astracar.vercel.app/) |
| Not recorded — `atanasov-varna/` | Cars repository | [darkapoparka/cars-atanasov-varna](https://github.com/darkapoparka/cars-atanasov-varna) | `Not recorded` | [atanasov-varna.webpreviews.site](https://atanasov-varna.webpreviews.site/) |
| Not recorded — `auto-insurance-import-varna/` | Cars repository | [darkapoparka/cars-auto-insurance-import-varna](https://github.com/darkapoparka/cars-auto-insurance-import-varna) | `Not recorded` | [auto-insurance-import-varna.webpreviews.site](https://auto-insurance-import-varna.webpreviews.site/) |
| Not recorded — `autobora-varna/` | Cars repository | [darkapoparka/cars-autobora-varna](https://github.com/darkapoparka/cars-autobora-varna) | `Not recorded` | [autobora-varna.webpreviews.site](https://autobora-varna.webpreviews.site/) |
| Аутофест — `autofest-varna/` | Cars repository | [darkapoparka/cars-autofestvarna](https://github.com/darkapoparka/cars-autofestvarna) | `Not recorded` | [autofest-varna.webpreviews.site](https://autofest-varna.webpreviews.site/) |
| Not recorded — `autojo-di-varna/` | Cars repository | [darkapoparka/cars-autojo-di-varna](https://github.com/darkapoparka/cars-autojo-di-varna) | `Not recorded` | [autojo-di-varna.webpreviews.site](https://autojo-di-varna.webpreviews.site/) |
| Аутолайф — `autolife/` | Cars repository | [darkapoparka/cars-autolife](https://github.com/darkapoparka/cars-autolife) | `cars-autolife` | [cars-autolife.vercel.app](https://cars-autolife.vercel.app/) |
| Аутомаркет Варна — `automarket-varna/` | Cars repository | [darkapoparka/cars-automarketvarna](https://github.com/darkapoparka/cars-automarketvarna) | `cars-automarketvarna` | [cars-automarketvarna.vercel.app](https://cars-automarketvarna.vercel.app/) |
| AUTOROAD — `autoroad-varna/` | Cars repository | [darkapoparka/cars-autoroadvarna](https://github.com/darkapoparka/cars-autoroadvarna) | `Not recorded` | [autoroad-varna.webpreviews.site](https://autoroad-varna.webpreviews.site/) |
| Not recorded — `autostar21-varna/` | Cars repository | [darkapoparka/cars-autostar21-varna](https://github.com/darkapoparka/cars-autostar21-varna) | `Not recorded` | [autostar21-varna.webpreviews.site](https://autostar21-varna.webpreviews.site/) |
| AVANGARD AUTO — `avangard-auto/` | Cars repository | [darkapoparka/cars-avangardauto](https://github.com/darkapoparka/cars-avangardauto) | `cars-avangardauto` | [cars-avangardauto.vercel.app](https://cars-avangardauto.vercel.app/) |
| АВТОБОРСА МАНИЯ — `avtoborsa-mania/` | Cars repository | [darkapoparka/cars-avtoborsa-mania](https://github.com/darkapoparka/cars-avtoborsa-mania) | `Not recorded` | [avtoborsa-mania.webpreviews.site](https://avtoborsa-mania.webpreviews.site/) |
| Not recorded — `balkan-car-varna/` | Cars repository | [darkapoparka/cars-balkan-car-varna](https://github.com/darkapoparka/cars-balkan-car-varna) | `Not recorded` | [balkan-car-varna.webpreviews.site](https://balkan-car-varna.webpreviews.site/) |
| AS Motor Group — `batley-as-motor-group/` | Cars repository | [darkapoparka/cars-uk-batley-as-motor-group](https://github.com/darkapoparka/cars-uk-batley-as-motor-group) | `Not recorded` | [batley-as-motor-group.webpreviews.site](https://batley-as-motor-group.webpreviews.site/) |
| Not recorded — `bavaria-auto-varna/` | Cars repository | [darkapoparka/cars-bavaria-auto-varna](https://github.com/darkapoparka/cars-bavaria-auto-varna) | `Not recorded` | [bavaria-auto-varna.webpreviews.site](https://bavaria-auto-varna.webpreviews.site/) |
| Not recorded — `bavaro-varna/` | Cars repository | [darkapoparka/cars-bavaro-varna](https://github.com/darkapoparka/cars-bavaro-varna) | `Not recorded` | [bavaro-varna.webpreviews.site](https://bavaro-varna.webpreviews.site/) |
| Best Cars Exporter DXB — `dealers/best-cars-exporter-dxb/` | Cars dealer pack | [darkapoparka/cars @ 10add42ed89b](https://github.com/darkapoparka/cars/tree/10add42ed89b1dfdc08436a78b7fb83fbee46777/dealers/best-cars-exporter-dxb/) | `cars-best-cars-exporter-dxb` | [best-cars-exporter-dxb.webpreviews.site](https://best-cars-exporter-dxb.webpreviews.site/) |
| Not recorded — `biemaauto-varna/` | Cars repository | [darkapoparka/cars-biemaauto-varna](https://github.com/darkapoparka/cars-biemaauto-varna) | `Not recorded` | [biemaauto-varna.webpreviews.site](https://biemaauto-varna.webpreviews.site/) |
| Square One Motors — `birmingham-square-one-motors/` | Cars repository | [darkapoparka/cars-uk-birmingham-square-one-motors](https://github.com/darkapoparka/cars-uk-birmingham-square-one-motors) | `Not recorded` | [birmingham-square-one-motors.webpreviews.site](https://birmingham-square-one-motors.webpreviews.site/) |
| Trade Car Sales — `birmingham-trade-car-sales-grasmere/` | Cars repository | [darkapoparka/cars-uk-birmingham-trade-car-sales-grasmere](https://github.com/darkapoparka/cars-uk-birmingham-trade-car-sales-grasmere) | `Not recorded` | [birmingham-trade-car-sales-grasmere.webpreviews.site](https://birmingham-trade-car-sales-grasmere.webpreviews.site/) |
| Not recorded — `bora-car-varna/` | Cars repository | [darkapoparka/cars-bora-car-varna](https://github.com/darkapoparka/cars-bora-car-varna) | `Not recorded` | [bora-car-varna.webpreviews.site](https://bora-car-varna.webpreviews.site/) |
| Cherry Tree Cars Ltd — `bradford-cherry-tree-cars/` | Cars repository | [darkapoparka/cars-uk-bradford-cherry-tree-cars](https://github.com/darkapoparka/cars-uk-bradford-cherry-tree-cars) | `Not recorded` | [bradford-cherry-tree-cars.webpreviews.site](https://bradford-cherry-tree-cars.webpreviews.site/) |
| Not recorded — `buscenter-varna/` | Cars repository | [darkapoparka/cars-buscenter-varna](https://github.com/darkapoparka/cars-buscenter-varna) | `Not recorded` | [buscenter-varna.webpreviews.site](https://buscenter-varna.webpreviews.site/) |
| Not recorded — `cali-cars-varna/` | Cars repository | [darkapoparka/cars-cali-cars-varna](https://github.com/darkapoparka/cars-cali-cars-varna) | `Not recorded` | [cali-cars-varna.webpreviews.site](https://cali-cars-varna.webpreviews.site/) |
| CAR POINT TRADE LTD — `car-point-trade-varna/` | Cars repository | [darkapoparka/cars-carpointtradevarna](https://github.com/darkapoparka/cars-carpointtradevarna) | `Not recorded` | [car-point-trade-varna.webpreviews.site](https://car-point-trade-varna.webpreviews.site/) |
| Not recorded — `carnova-varna/` | Cars repository | [darkapoparka/cars-carnova-varna](https://github.com/darkapoparka/cars-carnova-varna) | `Not recorded` | [carnova-varna.webpreviews.site](https://carnova-varna.webpreviews.site/) |
| Ц Е Н Т Р А Л-АВТОСАЛОН — `centralauto-varna/` | Cars repository | [darkapoparka/cars-centralauto-varna](https://github.com/darkapoparka/cars-centralauto-varna) | `Not recorded` | [centralauto-varna.webpreviews.site](https://centralauto-varna.webpreviews.site/) |
| Champion Auto Pro — `champion-auto-pro/` | Cars repository | [darkapoparka/cars-championautopro](https://github.com/darkapoparka/cars-championautopro) | `cars-championautopro` | [cars-championautopro.vercel.app](https://cars-championautopro.vercel.app/) |
| Not recorded — `champion-auto-varna/` | Cars repository | [darkapoparka/cars-champion-auto-varna](https://github.com/darkapoparka/cars-champion-auto-varna) | `Not recorded` | [champion-auto-varna.webpreviews.site](https://champion-auto-varna.webpreviews.site/) |
| Черно море — `chernomore-varna/` | Cars repository | [darkapoparka/cars-chernomore-varna](https://github.com/darkapoparka/cars-chernomore-varna) | `Not recorded` | [chernomore-varna.webpreviews.site](https://chernomore-varna.webpreviews.site/) |
| Сити Карс — `city-cars-varna/` | Cars repository | [darkapoparka/cars-citycarsvarna](https://github.com/darkapoparka/cars-citycarsvarna) | `Not recorded` | [city-cars-varna.webpreviews.site](https://city-cars-varna.webpreviews.site/) |
| Not recorded — `crazy-fox-motors-varna/` | Cars repository | [darkapoparka/cars-crazy-fox-motors-varna](https://github.com/darkapoparka/cars-crazy-fox-motors-varna) | `Not recorded` | [crazy-fox-motors-varna.webpreviews.site](https://crazy-fox-motors-varna.webpreviews.site/) |
| Day and Night Auto Group — `day-and-night-auto-group/` | Cars repository | [darkapoparka/day-and-night-autodeal](https://github.com/darkapoparka/day-and-night-autodeal) | `day-and-night-a` | [day-and-night-a.vercel.app](https://day-and-night-a.vercel.app/) |
| Not recorded — `dein-auto-varna/` | Cars repository | [darkapoparka/cars-dein-auto-varna](https://github.com/darkapoparka/cars-dein-auto-varna) | `Not recorded` | [dein-auto-varna.webpreviews.site](https://dein-auto-varna.webpreviews.site/) |
| Car Market Yorkshire — `dewsbury-car-market-yorkshire/` | Cars repository | [darkapoparka/cars-uk-dewsbury-car-market-yorkshire](https://github.com/darkapoparka/cars-uk-dewsbury-car-market-yorkshire) | `Not recorded` | [dewsbury-car-market-yorkshire.webpreviews.site](https://dewsbury-car-market-yorkshire.webpreviews.site/) |
| D&M - Auto Varna — `dm-auto-varna/` | Cars repository | [darkapoparka/cars-dmautovarna](https://github.com/darkapoparka/cars-dmautovarna) | `Not recorded` | [dm-auto-varna.webpreviews.site](https://dm-auto-varna.webpreviews.site/) |
| DREAM DRIVE — `dream-drive-varna/` | Cars repository | [darkapoparka/cars-dreamdrivevarna](https://github.com/darkapoparka/cars-dreamdrivevarna) | `Not recorded` | [dream-drive-varna.webpreviews.site](https://dream-drive-varna.webpreviews.site/) |
| Dynamic Auto Varna — `dynamic-auto-varna/` | Cars repository | [darkapoparka/cars-dynamicautovarna](https://github.com/darkapoparka/cars-dynamicautovarna) | `Not recorded` | [dynamic-auto-varna.webpreviews.site](https://dynamic-auto-varna.webpreviews.site/) |
| Not recorded — `ecodrive-varna/` | Cars repository | [darkapoparka/cars-ecodrive-varna](https://github.com/darkapoparka/cars-ecodrive-varna) | `Not recorded` | [ecodrive-varna.webpreviews.site](https://ecodrive-varna.webpreviews.site/) |
| Not recorded — `electricauto-varna/` | Cars repository | [darkapoparka/cars-electricauto-varna](https://github.com/darkapoparka/cars-electricauto-varna) | `Not recorded` | [electricauto-varna.webpreviews.site](https://electricauto-varna.webpreviews.site/) |
| Not recorded — `elegantcar-varna/` | Cars repository | [darkapoparka/cars-elegantcar-varna](https://github.com/darkapoparka/cars-elegantcar-varna) | `Not recorded` | [elegantcar-varna.webpreviews.site](https://elegantcar-varna.webpreviews.site/) |
| Not recorded — `elexiscars-varna/` | Cars repository | [darkapoparka/cars-elexiscars-varna](https://github.com/darkapoparka/cars-elexiscars-varna) | `Not recorded` | [elexiscars-varna.webpreviews.site](https://elexiscars-varna.webpreviews.site/) |
| eliqauto — `eliqauto/` | Cars repository | [darkapoparka/cars-eliqauto](https://github.com/darkapoparka/cars-eliqauto) | `cars-eliqauto` | [cars-eliqauto.vercel.app](https://cars-eliqauto.vercel.app/) |
| ELIT AUTO IMPORT EXPORT — `elit-auto-import/` | Cars repository | [darkapoparka/cars-elitautoimport](https://github.com/darkapoparka/cars-elitautoimport) | `cars-elitautoimport` | [cars-elitautoimport.vercel.app](https://cars-elitautoimport.vercel.app/) |
| Not recorded — `eurocar6-varna/` | Cars repository | [darkapoparka/cars-eurocar6-varna](https://github.com/darkapoparka/cars-eurocar6-varna) | `Not recorded` | [eurocar6-varna.webpreviews.site](https://eurocar6-varna.webpreviews.site/) |
| Европа — `europa-varna/` | Cars repository | [darkapoparka/cars-europa-varna](https://github.com/darkapoparka/cars-europa-varna) | `Not recorded` | [evropavarna-varna.webpreviews.site](https://evropavarna-varna.webpreviews.site/) |
| ЕВРОКАР ВАРНА 09 — `evrocar-varna-09/` | Cars repository | [darkapoparka/cars-evrocar-varna-09](https://github.com/darkapoparka/cars-evrocar-varna-09) | `Not recorded` | [evrocarvarna09-varna.webpreviews.site](https://evrocarvarna09-varna.webpreviews.site/) |
| Excellent Cars — `excellent-cars/` | Cars repository | [darkapoparka/excellent-cars](https://github.com/darkapoparka/excellent-cars) | `excellent-cars` | [excellent-cars.vercel.app](https://excellent-cars.vercel.app/) |
| Exclusive Auto — `exclusive-auto-varna/` | Cars repository | [darkapoparka/cars-exclusive-auto-varna](https://github.com/darkapoparka/cars-exclusive-auto-varna) | `Not recorded` | [exclusive-auto-varna.webpreviews.site](https://exclusive-auto-varna.webpreviews.site/) |
| Not recorded — `express-auto-varna/` | Cars repository | [darkapoparka/cars-express-auto-varna](https://github.com/darkapoparka/cars-express-auto-varna) | `Not recorded` | [express-auto-varna.webpreviews.site](https://express-auto-varna.webpreviews.site/) |
| ЕКСТРА КАР-СМ — `extra-car-sm/` | Cars repository | [darkapoparka/cars-extra-car-sm](https://github.com/darkapoparka/cars-extra-car-sm) | `Not recorded` | [extra-car-sm.webpreviews.site](https://extra-car-sm.webpreviews.site/) |
| F1rst Motors — `f1rst-motors/` | Cars repository | [darkapoparka/cars-f1rstmotors](https://github.com/darkapoparka/cars-f1rstmotors) | `cars-f1rstmotors` | [cars-f1rstmotors.vercel.app](https://cars-f1rstmotors.vercel.app/) |
| Not recorded — `focus1-varna/` | Cars repository | [darkapoparka/cars-focus1-varna](https://github.com/darkapoparka/cars-focus1-varna) | `Not recorded` | [focus1-varna.webpreviews.site](https://focus1-varna.webpreviews.site/) |
| Not recorded — `fusion-auto-varna/` | Cars repository | [darkapoparka/cars-fusion-auto-varna](https://github.com/darkapoparka/cars-fusion-auto-varna) | `Not recorded` | [fusion-auto-varna.webpreviews.site](https://fusion-auto-varna.webpreviews.site/) |
| Not recorded — `garage24-varna/` | Cars repository | [darkapoparka/cars-garage24-varna](https://github.com/darkapoparka/cars-garage24-varna) | `Not recorded` | [garage24-varna.webpreviews.site](https://garage24-varna.webpreviews.site/) |
| Granada Auto Sales LLC — `dealers/granada-auto-sales/` | Cars dealer pack | [darkapoparka/cars @ 599adb6c1012](https://github.com/darkapoparka/cars/tree/599adb6c101219eecbe8b4117e62189f7f168f16/dealers/granada-auto-sales/) | `cars-granada-auto-sales` | [granada-auto-sales.webpreviews.site](https://granada-auto-sales.webpreviews.site/) |
| Not recorded — `grand-auto-varna/` | Cars repository | [darkapoparka/cars-grand-auto-varna](https://github.com/darkapoparka/cars-grand-auto-varna) | `Not recorded` | [grand-auto-varna.webpreviews.site](https://grand-auto-varna.webpreviews.site/) |
| Not recorded — `i1-auto-varna/` | Cars repository | [darkapoparka/cars-i1-auto-varna](https://github.com/darkapoparka/cars-i1-auto-varna) | `Not recorded` | [i1-auto-varna.webpreviews.site](https://i1-auto-varna.webpreviews.site/) |
| IS Auto Varna — `isauto-varna/` | Cars repository | [darkapoparka/cars-isautovarna](https://github.com/darkapoparka/cars-isautovarna) | `cars-isautovarna` | [cars-isautovarna.vercel.app](https://cars-isautovarna.vercel.app/) |
| Иво Ауто — `ivo-auto/` | Cars repository | [darkapoparka/cars-ivoauto](https://github.com/darkapoparka/cars-ivoauto) | `cars-ivoauto` | [cars-ivoauto.vercel.app](https://cars-ivoauto.vercel.app/) |
| Kalchev Correct — `kalchev-varna/` | Cars repository | [darkapoparka/cars-kalchev-varna](https://github.com/darkapoparka/cars-kalchev-varna) | `Not recorded` | [kalchev-varna.webpreviews.site](https://kalchev-varna.webpreviews.site/) |
| Not recorded — `kalo-0404-varna/` | Cars repository | [darkapoparka/cars-kalo-0404-varna](https://github.com/darkapoparka/cars-kalo-0404-varna) | `Not recorded` | [kalo-0404-varna.webpreviews.site](https://kalo-0404-varna.webpreviews.site/) |
| Not recorded — `kalokars-varna/` | Cars repository | [darkapoparka/cars-kalokars-varna](https://github.com/darkapoparka/cars-kalokars-varna) | `Not recorded` | [kalokars-varna.webpreviews.site](https://kalokars-varna.webpreviews.site/) |
| Капитол — `kapitol-varna/` | Cars repository | [darkapoparka/cars-kapitol-varna](https://github.com/darkapoparka/cars-kapitol-varna) | `Not recorded` | [kapitol-varna.webpreviews.site](https://kapitol-varna.webpreviews.site/) |
| K-G Team Auto — `kg-team-auto/` | Cars repository | [darkapoparka/cars-kgteamauto](https://github.com/darkapoparka/cars-kgteamauto) | `cars-kgteamauto` | [cars-kgteamauto.vercel.app](https://cars-kgteamauto.vercel.app/) |
| Not recorded — `kk-auto-varna/` | Cars repository | [darkapoparka/cars-kk-auto-varna](https://github.com/darkapoparka/cars-kk-auto-varna) | `Not recorded` | [kk-auto-varna.webpreviews.site](https://kk-auto-varna.webpreviews.site/) |
| Kolarov Cars — `kolarov-cars/` | Cars repository | [darkapoparka/cars-kolarovcars](https://github.com/darkapoparka/cars-kolarovcars) | `Not recorded` | [kolarov-cars.webpreviews.site](https://kolarov-cars.webpreviews.site/) |
| Not recorded — `kolevi-auto-varna/` | Cars repository | [darkapoparka/cars-kolevi-auto-varna](https://github.com/darkapoparka/cars-kolevi-auto-varna) | `Not recorded` | [kolevi-auto-varna.webpreviews.site](https://kolevi-auto-varna.webpreviews.site/) |
| Not recorded — `kris-varna/` | Cars repository | [darkapoparka/cars-kris-varna](https://github.com/darkapoparka/cars-kris-varna) | `Not recorded` | [kris-varna.webpreviews.site](https://kris-varna.webpreviews.site/) |
| LEGEND AUTO — `legend-auto/` | Cars repository | [darkapoparka/cars-legendauto](https://github.com/darkapoparka/cars-legendauto) | `cars-legendauto` | [cars-legendauto.vercel.app](https://cars-legendauto.vercel.app/) |
| Not recorded — `lionauto1-varna/` | Cars repository | [darkapoparka/cars-lionauto1-varna](https://github.com/darkapoparka/cars-lionauto1-varna) | `Not recorded` | [lionauto1-varna.webpreviews.site](https://lionauto1-varna.webpreviews.site/) |
| Not recorded — `m-car-varna/` | Cars repository | [darkapoparka/cars-m-car-varna](https://github.com/darkapoparka/cars-m-car-varna) | `Not recorded` | [m-car-varna.webpreviews.site](https://m-car-varna.webpreviews.site/) |
| Not recorded — `mgauto-varna/` | Cars repository | [darkapoparka/cars-mgauto-varna](https://github.com/darkapoparka/cars-mgauto-varna) | `Not recorded` | [mgauto-varna.webpreviews.site](https://mgauto-varna.webpreviews.site/) |
| Not recorded — `miraj-auto-varna/` | Cars repository | [darkapoparka/cars-miraj-auto-varna](https://github.com/darkapoparka/cars-miraj-auto-varna) | `Not recorded` | [miraj-auto-varna.webpreviews.site](https://miraj-auto-varna.webpreviews.site/) |
| Not recorded — `mladost2-varna/` | Cars repository | [darkapoparka/cars-mladost2-varna](https://github.com/darkapoparka/cars-mladost2-varna) | `Not recorded` | [mladost2-varna.webpreviews.site](https://mladost2-varna.webpreviews.site/) |
| Not recorded — `monarh-varna/` | Cars repository | [darkapoparka/cars-monarh-varna](https://github.com/darkapoparka/cars-monarh-varna) | `Not recorded` | [monarh-varna.webpreviews.site](https://monarh-varna.webpreviews.site/) |
| Motors Castle — `motherwell-motors-castle/` | Cars repository | [darkapoparka/cars-uk-motherwell-motors-castle](https://github.com/darkapoparka/cars-uk-motherwell-motors-castle) | `Not recorded` | [motherwell-motors-castle.webpreviews.site](https://motherwell-motors-castle.webpreviews.site/) |
| Not recorded — `multizaza-varna/` | Cars repository | [darkapoparka/cars-multizaza-varna](https://github.com/darkapoparka/cars-multizaza-varna) | `Not recorded` | [multizaza-varna.webpreviews.site](https://multizaza-varna.webpreviews.site/) |
| Навара кар — `navara-car/` | Cars repository | [darkapoparka/cars-navaracar](https://github.com/darkapoparka/cars-navaracar) | `cars-navaracar` | [cars-navaracar.vercel.app](https://cars-navaracar.vercel.app/) |
| Not recorded — `nordic-auto-varna/` | Cars repository | [darkapoparka/cars-nordic-auto-varna](https://github.com/darkapoparka/cars-nordic-auto-varna) | `Not recorded` | [nordic-auto-varna.webpreviews.site](https://nordic-auto-varna.webpreviews.site/) |
| North Norfolk Car Sales — `north-norfolk-car-sales/` | Cars repository | [darkapoparka/cars-uk-north-norfolk-car-sales](https://github.com/darkapoparka/cars-uk-north-norfolk-car-sales) | `Not recorded` | [north-norfolk-car-sales.webpreviews.site](https://north-norfolk-car-sales.webpreviews.site/) |
| S A Motors — `nottingham-s-a-motors/` | Cars repository | [darkapoparka/cars-uk-nottingham-s-a-motors](https://github.com/darkapoparka/cars-uk-nottingham-s-a-motors) | `Not recorded` | [nottingham-s-a-motors.webpreviews.site](https://nottingham-s-a-motors.webpreviews.site/) |
| Not recorded — `nunki-1-varna/` | Cars repository | [darkapoparka/cars-nunki-1-varna](https://github.com/darkapoparka/cars-nunki-1-varna) | `Not recorded` | [nunki-1-varna.webpreviews.site](https://nunki-1-varna.webpreviews.site/) |
| OUTLETCARS.BG — Варна — `outletcars-varna/` | Cars repository | [darkapoparka/cars-outletcarsvarna](https://github.com/darkapoparka/cars-outletcarsvarna) | `cars-outletcarsvarna` | [cars-outletcarsvarna.vercel.app](https://cars-outletcarsvarna.vercel.app/) |
| Not recorded — `part-mag-cars-varna/` | Cars repository | [darkapoparka/cars-part-mag-cars-varna](https://github.com/darkapoparka/cars-part-mag-cars-varna) | `Not recorded` | [part-mag-cars-varna.webpreviews.site](https://part-mag-cars-varna.webpreviews.site/) |
| Перфект Ауто — `perfect-auto-varna/` | Cars repository | [darkapoparka/cars-perfectauto](https://github.com/darkapoparka/cars-perfectauto) | `cars-perfectauto` | [cars-perfectauto.vercel.app](https://cars-perfectauto.vercel.app/) |
| PM SELECT AUTOMOTIVE — `pm-select-automotive/` | Cars repository | [darkapoparka/cars-pmselectautomotive](https://github.com/darkapoparka/cars-pmselectautomotive) | `Not recorded` | [pm-select-automotive.webpreviews.site](https://pm-select-automotive.webpreviews.site/) |
| Not recorded — `porsche-varna/` | Cars repository | [darkapoparka/cars-porsche-varna](https://github.com/darkapoparka/cars-porsche-varna) | `Not recorded` | [porsche-varna.webpreviews.site](https://porsche-varna.webpreviews.site/) |
| Автосалон ПРЕСТИЖ — `prestige-varna/` | Cars repository | [darkapoparka/cars-prestige-varna](https://github.com/darkapoparka/cars-prestige-varna) | `Not recorded` | [prestige-varna.webpreviews.site](https://prestige-varna.webpreviews.site/) |
| PRIME AUTO — `prime-auto-varna/` | Cars repository | [darkapoparka/cars-primeautovarna](https://github.com/darkapoparka/cars-primeautovarna) | `Not recorded` | [prime-auto-varna.webpreviews.site](https://prime-auto-varna.webpreviews.site/) |
| Автокъща Приселци — `priselci/` | Cars repository | [darkapoparka/cars-priselci](https://github.com/darkapoparka/cars-priselci) | `cars-priselci` | [cars-priselci.vercel.app](https://cars-priselci.vercel.app/) |
| Promosale Varna — `promosale-varna/` | Cars repository | [darkapoparka/cars-promosalevarna](https://github.com/darkapoparka/cars-promosalevarna) | `cars-promosalevarna` | [cars-promosalevarna.vercel.app](https://cars-promosalevarna.vercel.app/) |
| Not recorded — `promotors82-varna/` | Cars repository | [darkapoparka/cars-promotors82-varna](https://github.com/darkapoparka/cars-promotors82-varna) | `Not recorded` | [promotors82-varna.webpreviews.site](https://promotors82-varna.webpreviews.site/) |
| Not recorded — `richicar-varna/` | Cars repository | [darkapoparka/cars-richicar-varna](https://github.com/darkapoparka/cars-richicar-varna) | `Not recorded` | [richicar-varna.webpreviews.site](https://richicar-varna.webpreviews.site/) |
| R.Q.S. Auto – Team — `rqs-auto-team/` | Cars repository | [darkapoparka/cars-rqs-auto-team](https://github.com/darkapoparka/cars-rqs-auto-team) | `Not recorded` | [rqs-auto-team.webpreviews.site](https://rqs-auto-team.webpreviews.site/) |
| АВТОКЪЩА СЕВИ КАР — `sevicar-varna/` | Cars repository | [darkapoparka/cars-sevicar-varna](https://github.com/darkapoparka/cars-sevicar-varna) | `Not recorded` | [sevicar-varna.webpreviews.site](https://sevicar-varna.webpreviews.site/) |
| Not recorded — `specialcarood-varna/` | Cars repository | [darkapoparka/cars-specialcarood-varna](https://github.com/darkapoparka/cars-specialcarood-varna) | `Not recorded` | [specialcarood-varna.webpreviews.site](https://specialcarood-varna.webpreviews.site/) |
| Спринт ауто — `sprint-auto-varna/` | Cars repository | [darkapoparka/cars-sprint-auto-varna](https://github.com/darkapoparka/cars-sprint-auto-varna) | `Not recorded` | [sprint-varna.webpreviews.site](https://sprint-varna.webpreviews.site/) |
| Not recorded — `stadiona-varna/` | Cars repository | [darkapoparka/cars-stadiona-varna](https://github.com/darkapoparka/cars-stadiona-varna) | `Not recorded` | [stadiona-varna.webpreviews.site](https://stadiona-varna.webpreviews.site/) |
| Not recorded — `stefancar-varna/` | Cars repository | [darkapoparka/cars-stefancar-varna](https://github.com/darkapoparka/cars-stefancar-varna) | `Not recorded` | [stefancar-varna.webpreviews.site](https://stefancar-varna.webpreviews.site/) |
| Broadbent Car and Servicing — `stockport-broadbent-car-and-servicing/` | Cars repository | [darkapoparka/cars-uk-stockport-broadbent-car-and-servicing](https://github.com/darkapoparka/cars-uk-stockport-broadbent-car-and-servicing) | `Not recorded` | [stockport-broadbent-car-and-servicing.webpreviews.site](https://stockport-broadbent-car-and-servicing.webpreviews.site/) |
| Norton Grange Trade Cars — `stockton-norton-grange-trade-cars/` | Cars repository | [darkapoparka/cars-uk-stockton-norton-grange-trade-cars](https://github.com/darkapoparka/cars-uk-stockton-norton-grange-trade-cars) | `Not recorded` | [stockton-norton-grange-trade-cars.webpreviews.site](https://stockton-norton-grange-trade-cars.webpreviews.site/) |
| СЪНИ — `sunny-varna/` | Cars repository | [darkapoparka/cars-sunny-varna](https://github.com/darkapoparka/cars-sunny-varna) | `Not recorded` | [sunny-varna.webpreviews.site](https://sunny-varna.webpreviews.site/) |
| Not recorded — `technocar-varna/` | Cars repository | [darkapoparka/cars-technocar-varna](https://github.com/darkapoparka/cars-technocar-varna) | `Not recorded` | [technocar-varna.webpreviews.site](https://technocar-varna.webpreviews.site/) |
| Теси Кар — `tesi-car-varna/` | Cars repository | [darkapoparka/cars-tesi-car-varna](https://github.com/darkapoparka/cars-tesi-car-varna) | `Not recorded` | [tesi-car-varna.webpreviews.site](https://tesi-car-varna.webpreviews.site/) |
| Not recorded — `tesla-varna/` | Cars repository | [darkapoparka/cars-tesla-varna](https://github.com/darkapoparka/cars-tesla-varna) | `Not recorded` | [tesla-varna.webpreviews.site](https://tesla-varna.webpreviews.site/) |
| Texas Drive Auto — `texas-drive-auto/` | Cars repository | [darkapoparka/cars-texasdriveauto](https://github.com/darkapoparka/cars-texasdriveauto) | `cars-texasdriveauto` | [cars-texasdriveauto.vercel.app](https://cars-texasdriveauto.vercel.app/) |
| The Dealers Point — `the-dealers-point/` | Cars repository | [darkapoparka/cars-thedealerspoint](https://github.com/darkapoparka/cars-thedealerspoint) | `cars-thedealerspoint` | [cars-thedealerspoint.vercel.app](https://cars-thedealerspoint.vercel.app/) |
| Not recorded — `tonyem4m-varna/` | Cars repository | [darkapoparka/cars-tonyem4m-varna](https://github.com/darkapoparka/cars-tonyem4m-varna) | `Not recorded` | [tonyem4m-varna.webpreviews.site](https://tonyem4m-varna.webpreviews.site/) |
| Not recorded — `top-auto-varna/` | Cars repository | [darkapoparka/cars-top-auto-varna](https://github.com/darkapoparka/cars-top-auto-varna) | `Not recorded` | [top-auto-varna.webpreviews.site](https://top-auto-varna.webpreviews.site/) |
| Not recorded — `transcar-varna/` | Cars repository | [darkapoparka/cars-transcar-varna](https://github.com/darkapoparka/cars-transcar-varna) | `Not recorded` | [transcar-varna.webpreviews.site](https://transcar-varna.webpreviews.site/) |
| Not recorded — `triumf-varna/` | Cars repository | [darkapoparka/cars-triumf-varna](https://github.com/darkapoparka/cars-triumf-varna) | `Not recorded` | [triumf-varna.webpreviews.site](https://triumf-varna.webpreviews.site/) |
| Not recorded — `unitrade-varna/` | Cars repository | [darkapoparka/cars-unitrade-varna](https://github.com/darkapoparka/cars-unitrade-varna) | `Not recorded` | [unitrade-varna.webpreviews.site](https://unitrade-varna.webpreviews.site/) |
| Not recorded — `vaen-cars-varna/` | Cars repository | [darkapoparka/cars-vaen-cars-varna](https://github.com/darkapoparka/cars-vaen-cars-varna) | `Not recorded` | [vaen-cars-varna.webpreviews.site](https://vaen-cars-varna.webpreviews.site/) |
| Not recorded — `valkov-cars-varna/` | Cars repository | [darkapoparka/cars-valkov-cars-varna](https://github.com/darkapoparka/cars-valkov-cars-varna) | `Not recorded` | [valkov-cars-varna.webpreviews.site](https://valkov-cars-varna.webpreviews.site/) |
| Not recorded — `varnacarexpress-varna/` | Cars repository | [darkapoparka/cars-varnacarexpress-varna](https://github.com/darkapoparka/cars-varnacarexpress-varna) | `Not recorded` | [varnacarexpress-varna.webpreviews.site](https://varnacarexpress-varna.webpreviews.site/) |
| Not recorded — `vichenca-varna/` | Cars repository | [darkapoparka/cars-vichenca-varna](https://github.com/darkapoparka/cars-vichenca-varna) | `Not recorded` | [vichenca-varna.webpreviews.site](https://vichenca-varna.webpreviews.site/) |
| Not recorded — `vvcars-varna/` | Cars repository | [darkapoparka/cars-vvcars-varna](https://github.com/darkapoparka/cars-vvcars-varna) | `Not recorded` | [vvcars-varna.webpreviews.site](https://vvcars-varna.webpreviews.site/) |
| Wadishee Used Cars — `dealers/wadishee-used-cars/` | Cars dealer pack | [darkapoparka/cars @ 599adb6c1012](https://github.com/darkapoparka/cars/tree/599adb6c101219eecbe8b4117e62189f7f168f16/dealers/wadishee-used-cars/) | `cars-wadishee-used-cars` | [wadishee-used-cars.webpreviews.site](https://wadishee-used-cars.webpreviews.site/) |
| Not recorded — `watt-a-car-varna/` | Cars repository | [darkapoparka/cars-watt-a-car-varna](https://github.com/darkapoparka/cars-watt-a-car-varna) | `Not recorded` | [watt-a-car-varna.webpreviews.site](https://watt-a-car-varna.webpreviews.site/) |
| Not recorded — `wildivaka-varna/` | Cars repository | [darkapoparka/cars-wildivaka-varna](https://github.com/darkapoparka/cars-wildivaka-varna) | `Not recorded` | [wildivaka-varna.webpreviews.site](https://wildivaka-varna.webpreviews.site/) |
| Not recorded — `xcar-varna/` | Cars repository | [darkapoparka/cars-xcar-varna](https://github.com/darkapoparka/cars-xcar-varna) | `Not recorded` | [xcar-varna.webpreviews.site](https://xcar-varna.webpreviews.site/) |
| Z A Motors — `dealers/za-motors/` | Cars dealer pack | [darkapoparka/cars @ 599adb6c1012](https://github.com/darkapoparka/cars/tree/599adb6c101219eecbe8b4117e62189f7f168f16/dealers/za-motors/) | `cars-za-motors` | [za-motors.webpreviews.site](https://za-motors.webpreviews.site/) |

## Source-map verification

Checked 2026-09-30T16:49:33.857Z: 25 registered dealer folders and 100 local application folders. This establishes presence, not equality with hosted code.

The following provider metadata was read directly; other hosting names above come from recorded registry data. Existing build/browser evidence is retained separately.

| Dealer | Provider-reported commit | Observed ref | Checked |
| --- | --- | --- | --- |
| al-basma-motors | `f9c35d1ef6713af2e9407fd5596c3023e2b7ca5b` | `main` | 2026-09-30T16:41:37.430Z |
| al-hamoor-al-thahabi | `c7aed788007bb7eac1bf91b7c158a14dc5c53330` | `main` | 2026-09-30T16:41:41.447Z |
| al-reef-used-cars | `8bac5e0355f2580ee3050246ce235ed0b545638d` | `main` | 2026-09-30T16:41:33.652Z |
| asko-96 | `f67b671b251960f87d4339a473c9793b30aeafc5` | `main` | 2026-09-30T16:41:38.636Z |
| astracar | `1d12b699e2a830a52f4137cb63bd412950b215e9` | `main` | 2026-09-30T16:41:35.332Z |
| autolife | `e28afdd250c7e9ac8b5048ac77cf87ebd294b5ea` | `main` | 2026-09-30T16:41:37.728Z |
| automarket-varna | `2691644565e580f5b9cb8521e508a4f8cd402681` | `main` | 2026-09-30T16:41:40.639Z |
| avangard-auto | `1ed331bdd9e1121a7eeb0b0db0d0d15a2e4392ad` | `main` | 2026-09-30T16:41:37.429Z |
| champion-auto-pro | `f777b607d31f920cd9d5e54e8c6f8b4b8c2dc564` | `main` | 2026-09-30T16:41:36.141Z |
| day-and-night-auto-group | `3d6225f0a57f3bcc59763b464a4fd448d5f0e3a6` | `main` | 2026-09-30T16:41:37.727Z |
| eliqauto | `c6494e902515f62583ca82fa335caa1853deb270` | `main` | 2026-09-30T16:41:35.099Z |
| elit-auto-import | `cd86bfa89154b4ce49ac8b365c9322079e72efc5` | `main` | 2026-09-30T16:41:41.120Z |
| excellent-cars | `cdc2dd375e20bac2b94c9d4b724c78b6927416c1` | `main` | 2026-09-30T16:41:40.500Z |
| f1rst-motors | `7ddba964ffcdae8e566f8f6c4573812639eb3e4b` | `main` | 2026-09-30T16:41:40.264Z |
| isauto-varna | `29f2223f7d04278b15c3258d77a8858224e23d5d` | `main` | 2026-09-30T16:41:40.313Z |
| ivo-auto | `e6418c881c629c967b58cf51dd1c5add9ace3894` | `main` | 2026-09-30T16:41:40.984Z |
| kg-team-auto | `172799d55aec5895ed61c4d3e49ec12a4a8f21d0` | `main` | 2026-09-30T16:41:41.120Z |
| legend-auto | `7f056f0130897ba2e4aeebfcc09719791e4a5ee6` | `main` | 2026-09-30T16:41:41.659Z |
| navara-car | `e28713a76f90ad163538c79f483911caa099e6f0` | `main` | 2026-09-30T16:41:40.650Z |
| outletcars-varna | `9165fd22a217675b7131ad4e2c5043ae9e61897f` | `main` | 2026-09-30T16:41:41.304Z |
| perfect-auto-varna | `363053482731ca8d793b8b9745c55926e233fcea` | `main` | 2026-09-30T16:41:40.333Z |
| priselci | `f3dc6d7131d815113574229f5a2d627cc7ccb5fd` | `main` | 2026-09-30T16:41:40.363Z |
| promosale-varna | `55315bc7cc5e9d90fc2b148e1fb880cc9f872679` | `main` | 2026-09-30T16:41:40.638Z |
| texas-drive-auto | `fb6c1441b56a5c8da147bb2c7e4f389997cdf0ed` | `main` | 2026-09-30T16:41:41.404Z |
| the-dealers-point | `2fa069742136946c991a06f99a6748b3fb845558` | `main` | 2026-09-30T16:41:40.983Z |

## Other folders are not another deployed fleet

The remaining entries under clients/ include research-only prospects, unfinished work, aliases and retained recovery material. Do not infer a deployment, sale, or outreach event from a folder name. The table above is the deployed-project directory; the full technical inventory is ../docs/DEPLOYMENTS.md.

Day & Night and IS-AUTO previously had source omitted by a sparse checkout. Their active dealer folders are now under the shared clients directory. Read dealer.json for the actual offered designs and the registry for dated release evidence; recovering a folder alone does not publish it.

## Find, edit and publish

1. Search this page by the Vercel project name, repository name or dealer name. Open the matching local folder.
2. Read dealer.json and the folder instructions. Keep every declared design and the shared business assets together.
3. Use the recorded source owner: Cars packaging/export for Cars-owned folders; the dedicated checkout for Al Reef.
4. Publish only reviewed source, then verify the public alias. A folder move, source commit and hosted release are separate steps.

Regenerate this page and the other registry views with `node scripts/index-deployments.mjs --views-only`. This command does not deploy or overwrite dealer applications.
