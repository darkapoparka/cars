# Where the dealer projects live

All current dealer source folders are under `L:/CODEX/cars/clients/<slug>/`. This includes prospect demos; the word clients does not mean that the business has bought a site.

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

The registry contains 25 dealer public aliases below. These rows are generated from ../docs/DEPLOYMENT-INVENTORY.json; they are a source-location guide, not a fresh visual acceptance report.

| Dealer / local folder | Source ownership | Publishing repository | Vercel project | Public website |
| --- | --- | --- | --- | --- |
| Al Basma Motors — `al-basma-motors/` | Cars repository | [darkapoparka/cars-albasmamotors](https://github.com/darkapoparka/cars-albasmamotors) | `cars-albasmamotors` | [cars-albasmamotors.vercel.app](https://cars-albasmamotors.vercel.app/) |
| Al Hamoor Al Thahabi Used Cars — `al-hamoor-al-thahabi/` | Cars repository | [darkapoparka/cars-alhamooralthahabi](https://github.com/darkapoparka/cars-alhamooralthahabi) | `cars-alhamooralthahabi` | [cars-alhamooralthahabi.vercel.app](https://cars-alhamooralthahabi.vercel.app/) |
| Al Reef Used Cars — `al-reef-used-cars/` | Own Git repository (not tracked by Cars) | [darkapoparka/cars-alreefusedcars](https://github.com/darkapoparka/cars-alreefusedcars) | `cars-alreefusedcars` | [cars-alreefusedcars.vercel.app](https://cars-alreefusedcars.vercel.app/) |
| АСКО 96 — `asko-96/` | Cars repository | [darkapoparka/cars-asko96](https://github.com/darkapoparka/cars-asko96) | `cars-asko96` | [cars-asko96.vercel.app](https://cars-asko96.vercel.app/) |
| Астракар — `astracar/` | Cars repository | [darkapoparka/cars-astracar](https://github.com/darkapoparka/cars-astracar) | `cars-astracar` | [cars-astracar.vercel.app](https://cars-astracar.vercel.app/) |
| Аутолайф — `autolife/` | Cars repository | [darkapoparka/cars-autolife](https://github.com/darkapoparka/cars-autolife) | `cars-autolife` | [cars-autolife.vercel.app](https://cars-autolife.vercel.app/) |
| Аутомаркет Варна — `automarket-varna/` | Cars repository | [darkapoparka/cars-automarketvarna](https://github.com/darkapoparka/cars-automarketvarna) | `cars-automarketvarna` | [cars-automarketvarna.vercel.app](https://cars-automarketvarna.vercel.app/) |
| AVANGARD AUTO — `avangard-auto/` | Cars repository | [darkapoparka/cars-avangardauto](https://github.com/darkapoparka/cars-avangardauto) | `cars-avangardauto` | [cars-avangardauto.vercel.app](https://cars-avangardauto.vercel.app/) |
| Champion Auto Pro — `champion-auto-pro/` | Cars repository | [darkapoparka/cars-championautopro](https://github.com/darkapoparka/cars-championautopro) | `cars-championautopro` | [cars-championautopro.vercel.app](https://cars-championautopro.vercel.app/) |
| Day and Night Auto Group — `day-and-night-auto-group/` | Cars repository | [darkapoparka/day-and-night-autodeal](https://github.com/darkapoparka/day-and-night-autodeal) | `day-and-night-a` | [day-and-night-a.vercel.app](https://day-and-night-a.vercel.app/) |
| eliqauto — `eliqauto/` | Cars repository | [darkapoparka/cars-eliqauto](https://github.com/darkapoparka/cars-eliqauto) | `cars-eliqauto` | [cars-eliqauto.vercel.app](https://cars-eliqauto.vercel.app/) |
| ELIT AUTO IMPORT EXPORT — `elit-auto-import/` | Cars repository | [darkapoparka/cars-elitautoimport](https://github.com/darkapoparka/cars-elitautoimport) | `cars-elitautoimport` | [cars-elitautoimport.vercel.app](https://cars-elitautoimport.vercel.app/) |
| Excellent Cars — `excellent-cars/` | Cars repository | [darkapoparka/excellent-cars](https://github.com/darkapoparka/excellent-cars) | `excellent-cars` | [excellent-cars.vercel.app](https://excellent-cars.vercel.app/) |
| F1rst Motors — `f1rst-motors/` | Cars repository | [darkapoparka/cars-f1rstmotors](https://github.com/darkapoparka/cars-f1rstmotors) | `cars-f1rstmotors` | [cars-f1rstmotors.vercel.app](https://cars-f1rstmotors.vercel.app/) |
| IS Auto Varna — `isauto-varna/` | Cars repository | [darkapoparka/cars-isautovarna](https://github.com/darkapoparka/cars-isautovarna) | `cars-isautovarna` | [cars-isautovarna.vercel.app](https://cars-isautovarna.vercel.app/) |
| Иво Ауто — `ivo-auto/` | Cars repository | [darkapoparka/cars-ivoauto](https://github.com/darkapoparka/cars-ivoauto) | `cars-ivoauto` | [cars-ivoauto.vercel.app](https://cars-ivoauto.vercel.app/) |
| K-G Team Auto — `kg-team-auto/` | Cars repository | [darkapoparka/cars-kgteamauto](https://github.com/darkapoparka/cars-kgteamauto) | `cars-kgteamauto` | [cars-kgteamauto.vercel.app](https://cars-kgteamauto.vercel.app/) |
| LEGEND AUTO — `legend-auto/` | Cars repository | [darkapoparka/cars-legendauto](https://github.com/darkapoparka/cars-legendauto) | `cars-legendauto` | [cars-legendauto.vercel.app](https://cars-legendauto.vercel.app/) |
| Навара кар — `navara-car/` | Cars repository | [darkapoparka/cars-navaracar](https://github.com/darkapoparka/cars-navaracar) | `cars-navaracar` | [cars-navaracar.vercel.app](https://cars-navaracar.vercel.app/) |
| OUTLETCARS.BG — Варна — `outletcars-varna/` | Cars repository | [darkapoparka/cars-outletcarsvarna](https://github.com/darkapoparka/cars-outletcarsvarna) | `cars-outletcarsvarna` | [cars-outletcarsvarna.vercel.app](https://cars-outletcarsvarna.vercel.app/) |
| Перфект Ауто — `perfect-auto-varna/` | Cars repository | [darkapoparka/cars-perfectauto](https://github.com/darkapoparka/cars-perfectauto) | `cars-perfectauto` | [cars-perfectauto.vercel.app](https://cars-perfectauto.vercel.app/) |
| Автокъща Приселци — `priselci/` | Cars repository | [darkapoparka/cars-priselci](https://github.com/darkapoparka/cars-priselci) | `cars-priselci` | [cars-priselci.vercel.app](https://cars-priselci.vercel.app/) |
| Promosale Varna — `promosale-varna/` | Cars repository | [darkapoparka/cars-promosalevarna](https://github.com/darkapoparka/cars-promosalevarna) | `cars-promosalevarna` | [cars-promosalevarna.vercel.app](https://cars-promosalevarna.vercel.app/) |
| Texas Drive Auto — `texas-drive-auto/` | Cars repository | [darkapoparka/cars-texasdriveauto](https://github.com/darkapoparka/cars-texasdriveauto) | `cars-texasdriveauto` | [cars-texasdriveauto.vercel.app](https://cars-texasdriveauto.vercel.app/) |
| The Dealers Point — `the-dealers-point/` | Cars repository | [darkapoparka/cars-thedealerspoint](https://github.com/darkapoparka/cars-thedealerspoint) | `cars-thedealerspoint` | [cars-thedealerspoint.vercel.app](https://cars-thedealerspoint.vercel.app/) |

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
