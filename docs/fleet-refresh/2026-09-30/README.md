# Cars fleet refresh — 30 September 2026

All five template publishing repositories and Vercel projects are current. All 25 existing dealer repositories and public aliases serve the reviewed four-design refresh. 2807 final dealer browser checks passed, alongside 139 template hosted checks and 282 workflow tests. Evidence was finalized at 2026-09-30T16:49:33.857Z; each deployment report records its actual provider observation time.

`L:/CODEX/cars` on `main` is the canonical source. `J:/cars` is a compatibility junction to it; former `J:/template-repos` copies are recovery material. Al Reef remains an independently owned Git repository inside the shared clients directory.

Original dealer identities, branding assets, contacts and stock were retained. Preservation assertions covered 6116 protected file checks and all original fields of 325 Auto Best inventory records, plus the original App dealer/inventory and Modern stock data. Original variant stock counts and source gaps were kept; sample inventories were not unified or invented.

Each dealer deployment contains four designs and the shared admin-demo link. 23 dealers use Auto Best / Modern / Carwow / App; Outletcars and PromoSale use Auto Best / Import / Carwow / App. No additional dealer projects were created. Git publication used existing repository history without a force push. Bounded QA corrections required follow-up deployments.

## Template releases

The immutable canonical template revision is `b66693e3a475ef563ab45f51e4297e7073830ec1`. [Approved release evidence](../../releases/final-polish-2026-09-30/publishing-source-mapping.json) binds each dedicated publishing commit to its canonical subtree.

| Template | Public website | Publishing commit | Exact deployment |
| --- | --- | --- | --- |
| auto-best | [Open](https://cars-template-auto-best.vercel.app/) | `e4e1c7840416478d7f8dc285ab4f600e30a8f63b` | `dpl_DyEQ16sDVqe81ZtaGnuvYAizLDxn` |
| modern | [Open](https://cars-template-modern.vercel.app/) | `4f6e759e7480b66707ca855ea8bb5fc2611d9afe` | `dpl_HRWDBhDDptapT6oDGaoE8Bkh2deE` |
| carwow | [Open](https://cars-template-carwow.vercel.app/) | `d23b2a392ad6e511547d5501573428ea2fda4e26` | `dpl_5Dkn8YK5zLTKb1MQ4V9rYMJLJESK` |
| import | [Open](https://cars-template-import.vercel.app/) | `5bbcb962dd671237f2a360dcae8229638d51d947` | `dpl_BbgLUrgFQUPWZWkb2djooyH1Kj3n` |
| app | [Open](https://cars-template-app.vercel.app/) | `8ab7571fedc0bf66473fc81ce077fd700c3231b7` | `dpl_3ZmJbvM9ewh8ZxLnwkGz1vg5UGtJ` |

## Dealer production evidence

| Dealer | Designs | Public website | Source commit | Publishing commit | Deployment | Browser checks |
| --- | --- | --- | --- | --- | --- | --- |
| Al Basma Motors | auto-best / modern / carwow / app | [Open](https://cars-albasmamotors.vercel.app/) | `69ece503a0c4bcd806b3f7b0275a61e43c687776` | `f9c35d1ef6713af2e9407fd5596c3023e2b7ca5b` | `dpl_hP7y3P8K3MEtAxcAATM1ZmrHaM7E` | [111 passed](al-basma-motors/browser-report.json) |
| Al Hamoor Al Thahabi Used Cars | auto-best / modern / carwow / app | [Open](https://cars-alhamooralthahabi.vercel.app/) | `69ece503a0c4bcd806b3f7b0275a61e43c687776` | `c7aed788007bb7eac1bf91b7c158a14dc5c53330` | `dpl_4wbyD8vay9VxpLi3ka2ZhngZGn9K` | [111 passed](al-hamoor-al-thahabi/browser-report.json) |
| Al Reef Used Cars | auto-best / modern / carwow / app | [Open](https://cars-alreefusedcars.vercel.app/) | `48f3c43724f52df498a9b06d2fa7d5baae75d41d` | `8bac5e0355f2580ee3050246ce235ed0b545638d` | `dpl_BfsjuKiPkoTAKovuevKqTYdMBuPm` | [111 passed](al-reef-used-cars/browser-report.json) |
| АСКО 96 | auto-best / modern / carwow / app | [Open](https://cars-asko96.vercel.app/) | `1b2b533eb7f04ebe2d2fef6c330aaa2e75254792` | `f67b671b251960f87d4339a473c9793b30aeafc5` | `dpl_BfqT84DrmfapcgcF8QoWt4mCYzBB` | [107 passed](asko-96/browser-report.json) |
| Астракар | auto-best / modern / carwow / app | [Open](https://cars-astracar.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `1d12b699e2a830a52f4137cb63bd412950b215e9` | `dpl_8X2Fr8ocAYb3uqCmLGT85WpSyq8h` | [108 passed](astracar/browser-report.json) |
| Аутолайф | auto-best / modern / carwow / app | [Open](https://cars-autolife.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `e28afdd250c7e9ac8b5048ac77cf87ebd294b5ea` | `dpl_3Fbrq7yQLpXohXHzSxdRuBJNExoE` | [108 passed](autolife/browser-report.json) |
| Аутомаркет Варна | auto-best / modern / carwow / app | [Open](https://cars-automarketvarna.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `2691644565e580f5b9cb8521e508a4f8cd402681` | `dpl_7zZ316iM4FZSBDewsW6PGGkobdSk` | [108 passed](automarket-varna/browser-report.json) |
| AVANGARD AUTO | auto-best / modern / carwow / app | [Open](https://cars-avangardauto.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `1ed331bdd9e1121a7eeb0b0db0d0d15a2e4392ad` | `dpl_ES1xCeT4fns6msvBmhRXC5ey9Wyr` | [108 passed](avangard-auto/browser-report.json) |
| Champion Auto Pro | auto-best / modern / carwow / app | [Open](https://cars-championautopro.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `f777b607d31f920cd9d5e54e8c6f8b4b8c2dc564` | `dpl_DReff4mraUo7G7cwsHVjjhBEmjPb` | [108 passed](champion-auto-pro/browser-report.json) |
| Day and Night Auto Group | auto-best / modern / carwow / app | [Open](https://day-and-night-a.vercel.app/) | `8871d64f7c3cce26786a4864f2ff07087df57667` | `3d6225f0a57f3bcc59763b464a4fd448d5f0e3a6` | `dpl_4Vy1b9CbVyvpE3qMZq7LAKk4TNVw` | [106 passed](day-and-night-auto-group/browser-report.json) |
| eliqauto | auto-best / modern / carwow / app | [Open](https://cars-eliqauto.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `c6494e902515f62583ca82fa335caa1853deb270` | `dpl_7BwA7YRCjYneQkQ4w3Sn1rezR4R9` | [168 passed](eliqauto/browser-report.json) |
| ELIT AUTO IMPORT EXPORT | auto-best / modern / carwow / app | [Open](https://cars-elitautoimport.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `cd86bfa89154b4ce49ac8b365c9322079e72efc5` | `dpl_8Pc3hUvWjXNHqjVBdULz53S19kz3` | [108 passed](elit-auto-import/browser-report.json) |
| Excellent Cars | auto-best / modern / carwow / app | [Open](https://excellent-cars.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `cdc2dd375e20bac2b94c9d4b724c78b6927416c1` | `dpl_FYH1mqeLdw4YVem7diHyTZrdUFo3` | [108 passed](excellent-cars/browser-report.json) |
| F1rst Motors | auto-best / modern / carwow / app | [Open](https://cars-f1rstmotors.vercel.app/) | `69ece503a0c4bcd806b3f7b0275a61e43c687776` | `7ddba964ffcdae8e566f8f6c4573812639eb3e4b` | `dpl_BoQkVyFCn2N6whcKUEFeS2kmZEgy` | [111 passed](f1rst-motors/browser-report.json) |
| IS Auto Varna | auto-best / modern / carwow / app | [Open](https://cars-isautovarna.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `29f2223f7d04278b15c3258d77a8858224e23d5d` | `dpl_26QVkgsQngkf1MSZ1nhBiVFSyFJW` | [108 passed](isauto-varna/browser-report.json) |
| Иво Ауто | auto-best / modern / carwow / app | [Open](https://cars-ivoauto.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `e6418c881c629c967b58cf51dd1c5add9ace3894` | `dpl_2x5vDFvWVASRWjt1kn4nk5n8U4gK` | [108 passed](ivo-auto/browser-report.json) |
| K-G Team Auto | auto-best / modern / carwow / app | [Open](https://cars-kgteamauto.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `172799d55aec5895ed61c4d3e49ec12a4a8f21d0` | `dpl_D7zunBRarFy1iDW3YzAsxiCHJFD9` | [108 passed](kg-team-auto/browser-report.json) |
| LEGEND AUTO | auto-best / modern / carwow / app | [Open](https://cars-legendauto.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `7f056f0130897ba2e4aeebfcc09719791e4a5ee6` | `dpl_4RqBgzJ5RpeDUNLpXChZaHMHP3vX` | [108 passed](legend-auto/browser-report.json) |
| Навара кар | auto-best / modern / carwow / app | [Open](https://cars-navaracar.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `e28713a76f90ad163538c79f483911caa099e6f0` | `dpl_3KJXn9VfE7Ff4tCqTP47zEYW8dMo` | [108 passed](navara-car/browser-report.json) |
| OUTLETCARS.BG — Варна | auto-best / import / carwow / app | [Open](https://cars-outletcarsvarna.vercel.app/) | `0d543209bc29c04724ce4a95254eace9c6ceb5e4` | `9165fd22a217675b7131ad4e2c5043ae9e61897f` | `dpl_AjqHM5R6U3qHNbUWSL56htVanSam` | [124 passed](outletcars-varna/browser-report.json) |
| Перфект Ауто | auto-best / modern / carwow / app | [Open](https://cars-perfectauto.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `363053482731ca8d793b8b9745c55926e233fcea` | `dpl_9yg9p9Sf73SQQB3cVKBj6sZ538SH` | [108 passed](perfect-auto-varna/browser-report.json) |
| Автокъща Приселци | auto-best / modern / carwow / app | [Open](https://cars-priselci.vercel.app/) | `cc0e0520c9b5d85694c9b8d76203d9929f1fd928` | `f3dc6d7131d815113574229f5a2d627cc7ccb5fd` | `dpl_6vagoGbNzVAgTmCpHBTFQsuL6a8a` | [108 passed](priselci/browser-report.json) |
| Promosale Varna | auto-best / import / carwow / app | [Open](https://cars-promosalevarna.vercel.app/) | `0d543209bc29c04724ce4a95254eace9c6ceb5e4` | `55315bc7cc5e9d90fc2b148e1fb880cc9f872679` | `dpl_Anbqsb3aKzfwSKXriKZZTTgyWU9H` | [124 passed](promosale-varna/browser-report.json) |
| Texas Drive Auto | auto-best / modern / carwow / app | [Open](https://cars-texasdriveauto.vercel.app/) | `69ece503a0c4bcd806b3f7b0275a61e43c687776` | `fb6c1441b56a5c8da147bb2c7e4f389997cdf0ed` | `dpl_3a4ewWfrqkz3vrEXSmw1fRxDKGw9` | [111 passed](texas-drive-auto/browser-report.json) |
| The Dealers Point | auto-best / modern / carwow / app | [Open](https://cars-thedealerspoint.vercel.app/) | `69ece503a0c4bcd806b3f7b0275a61e43c687776` | `2fa069742136946c991a06f99a6748b3fb845558` | `dpl_5B7R9U5aKP8cHBpacSYTbMWPPqBv` | [111 passed](the-dealers-point/browser-report.json) |

## Verification and corrections

The prepared package digest, committed canonical source, reconciled publishing commit, Vercel deployment and public alias are checked independently. Browser checks cover EN/BG, 320px and 390px mobile widths, 1440px desktop, inventory and representative detail pages, contact/store routes, loaded visible media, JavaScript errors, original App inventory counts and byte-identical dealer logos. The four-design switcher and existing shared admin demo are retained. All browser requests were limited to read methods; no customer enquiries or outreach were sent.

Corrections made during review: removed inherited Carwow dealer contact/market defaults; fixed grouped AED/USD price parsing and selected price-filter labels without changing stored prices; repaired IS-AUTO’s stale public alias; corrected Day & Night labels from BGN to EUR after proving its original listings were euro-valued; displayed Eliq’s missing price as “Price on request” / “Цена при запитване” and omitted zero-price structured offers; localized template-composed viewing copy through dealer-owned catalogs. Native/App seals and preservation assertions passed after the reviewed changes.

[Source and preservation reports](./) bind the final release to the pre-refresh baseline hashes. [Current screenshot reviews](visual-reviews.json) bind the actual mobile proofs to the final source and publishing commits. [Prior registry records](prior-registry-records.json) preserve both committed evidence and pre-existing working draft evidence before this refresh. Unrequested dealer drafts remain unchanged and uncommitted.

Outletcars and PromoSale also received a reviewed Import configuration correction: the charcoal header now uses their existing approved on-dark logo. The original logo files were preserved byte-for-byte; the displayed header asset is checked at all offered test widths and languages. Stored contact sheets preserve the reviewed screenshots; individual viewport captures remain in ignored runtime evidence and their SHA-256 hashes are recorded in the visual review.

## Limits

This is a hosted proposal refresh. Stock remains dated sample data with its original disclosure and source gaps. Labeled concept illustrations or unavailable-photo placeholders remain where they were already part of the dealer source. Forms and the shared admin remain demos; these checks do not certify a live CMS, payment system or enquiry delivery backend. Codex screenshot inspection is separate from owner visual acceptance. Known Carwow limitations at 200% enlarged text remain in the template audit; no broader accessibility, performance or device certification is claimed. The separate Cars Admin repository was inspected for drift and left outside this requested release.
