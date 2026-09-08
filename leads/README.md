# Cars dealer lead research

Research batch: **8 September 2026**. **40 company records: 10 existing Varna accounts plus 30 additional research candidates.** This is a starting pipeline, not a complete census of Bulgaria, the UAE, the USA or Europe, and not a claim that 40 businesses have bad websites.

The offer is **three personalized concepts per qualified, approved dealer: Auto Best, Modern and Carwow**. The recommended entry in a record tells us which design to show first, not which two to omit. Existing demos are reused, not regenerated. Read the [three-design workflow](../docs/THREE-DESIGN-WORKFLOW.md) before building or preparing outreach.

## Where the information lives

| File | Records | Scope |
| --- | ---: | --- |
| [bulgaria.json](bulgaria.json) | 17 | Ten historical Varna accounts with existing project folders; seven additional Sofia, Plovdiv and Burgas candidates |
| [uae.json](uae.json) | 7 | Dubai and Sharjah, including the owner's F1rst Motors nomination and two reserves |
| [usa.json](usa.json) | 10 | Eight states; existing websites with inventory evidence, not yet verified redesign opportunities |
| [europe.json](europe.json) | 6 | UK 3, Germany 1, Netherlands 2; Bulgaria is not counted twice |
| [COVERAGE.md](COVERAGE.md) | — | Evidence rules, research gaps, qualification gates and how to expand |

The JSON files own public research facts. This Markdown is a readable view; keep it consistent in the same change. These files do **not** own private outreach, deal or suppression history, and are not application configuration. There is no new CRM integration, dashboard or automatic record-update script in this change.

Each file supplies common `defaults`, including all three template choices. A consumer must apply the defaults; reading a record alone is not the full contract. `contactHistory: not_checked` is intentionally different from `not_contacted`. `buildApproved: false` and `outreachApproved: false` mean this research batch does not authorize either external action or new application work.

## Use the queue correctly

| Priority | Count | What to do |
| --- | ---: | --- |
| `reuse-first` | 10 | Inspect the existing three-variant work, current QA and actual private contact history. Refresh facts; do not clone another account. |
| `research-first` | 9 | Promising marketplace-led businesses. Confirm identity, an independent-domain search and current relevant stock before approving a build. |
| `audit-first` | 16 | An independent website exists. Demonstrate a useful improvement before spending on three concepts. Inventory size alone is insufficient. |
| `premium-review` | 1 | Owner-nominated F1rst Motors. Assess the existing site and template fit; no bespoke rebuild or high-budget assumption is implied. |
| `reserve` | 4 | Smaller inventory, stale evidence or other unresolved qualification. Not in the default build queue. |

No record is a new `qualified`, `contacted` or `won` declaration. Some existing projects have prior local QA, but that is separate from fresh business qualification and hosted-preview readiness.

## Bulgaria

The first ten counts and website-search conclusions below come from the [7 September Varna research](../audits/2026-09-07/varna-leads/SHORTLIST.md), not a fresh inventory audit. Each linked client folder contains prior work; inspect its current metadata before taking action.

| Dealer | City | Recorded ads | Queue / existing work |
| --- | --- | ---: | --- |
| [Excellent Cars](https://excellent.mobile.bg/) | Varna | 86 | [Reuse existing projects](../clients/excellent-cars/) |
| [AVANGARD AUTO](https://avangard-auto.mobile.bg/) | Varna | 68 | [Reuse existing projects](../clients/avangard-auto/) |
| [Champion Auto Pro](https://championautopro.mobile.bg/) | Varna | 66 | [Reuse existing projects](../clients/champion-auto-pro/) |
| [Астракар](https://astracar.mobile.bg/) | Varna | 59 | [Reuse existing projects](../clients/astracar/) |
| [Аутолайф](https://autolife.mobile.bg/) | Varna | 79 | [Reuse existing projects](../clients/autolife/) |
| [Автокъща Приселци](https://priselci.mobile.bg/) | Varna | 63 | [Reuse existing projects](../clients/priselci/) |
| [Иво Ауто](https://ivoauto-varna.mobile.bg/) | Varna | 53 | [Reuse existing projects](../clients/ivo-auto/) |
| [Аутомаркет Варна](https://automarket.mobile.bg/) | Varna | 46 | [Reuse existing projects](../clients/automarket-varna/) |
| [ELIT AUTO IMPORT EXPORT](https://elitautoimport.mobile.bg/) | Varna | 42 | [Reuse existing projects](../clients/elit-auto-import/); category included a parts vehicle |
| [LEGEND AUTO](https://legendauto1.mobile.bg/) | Varna | 33 | [Reuse existing projects](../clients/legend-auto/); shared-address identity review |
| [VALENTINO AUTO HOUSE](https://valentinoauto.mobile.bg/) | Sofia | 67 | Research first; no independent domain matched in bounded search |
| [Success Automobile](https://success.mobile.bg/) | Plovdiv | 54 | Research first; no independent domain matched in bounded search |
| [K-G Team Auto](https://team-auto.mobile.bg/) | Plovdiv | 43 | Research first; verify domain and missing hours |
| [VOIVODOV AUTO & ANTONIO](https://voivodovauto.mobile.bg/) | Plovdiv | 64 | Research first; verify domain and name aliases |
| [icars](https://icars.mobile.bg/) | Plovdiv | 44 | Research first; resolve similarly named businesses |
| [FIVE AUTO](https://fiveauto.mobile.bg/) | Burgas | 40 | Research first; verify domain and current premium/mixed stock |
| [MG7 Group](https://mg7group.mobile.bg/) | Burgas | 32 | Research first; remove sold/reserved entries from available-stock assessment |

No matching site found means exactly that, not proof a website does not exist. Start new qualification with Valentino, Success, Voivodov and FIVE AUTO; this ordering is an editorial work-priority suggestion, not measured purchase probability.

## United Arab Emirates

| Dealer | City | Retrieved ads / available count | Queue and actual finding |
| --- | --- | ---: | --- |
| [Al Aayan Used Cars](https://www.dubicars.com/dealers/sharjah-al-aayan-used-cars-2515) | Sharjah | 34 | Research first; no independent domain confidently matched |
| [Al Fareed Used Cars](https://www.dubicars.com/dealers/sharjah-al-fareed-used-cars-2655) | Sharjah | 46 | Research first; resolve related/similar marketplace profiles |
| [Al Basma Motors](https://albasmamotors.com/) | Sharjah | 50 | Audit first; an independent site exists |
| [The Dealers Point](https://www.tdp.ae/) | Dubai | 32 | Audit first; ask-price content consistency is a hypothesis to check |
| [F1rst Motors](https://f1rstmotors.com/cars) | Dubai | 59 | Premium review; owner nominated, independent luxury catalogue exists |
| [Al Hamoor Al Thahabi](https://www.dubicars.com/dealers/sharjah-al-hamoor-al-thahabi-used-cars-1414) | Sharjah, verify | 25 | Reserve; location labels and size need review |
| [Car Finder 360](https://www.carfinder360.com/en) | Dubai | 24 | Reserve; existing site and no proven deficiency |

Marketplace source URLs for all counts are in [uae.json](uae.json). F1rst's count comes from its own available-car page. Start with Al Aayan and Al Fareed for domain qualification; inspect The Dealers Point for a specific improvement. Do not characterize any of these businesses as untrustworthy or their websites as AI-generated without evidence.

## United States

These dealers already have websites. Their position in this file is an invitation to audit, not a conclusion that their websites are poor. A common dealer-site vendor is not a defect.

| Dealer | City / state | Retrieved count | Qualification caveat |
| --- | --- | ---: | --- |
| [Texas Drive Auto](https://www.texasdriveauto.com/cars-for-sale) | Dallas, TX | 58 | Verify cash-only policy; do not inherit finance claims |
| [CFO Auto Group](https://www.cfoautogroup.com/inventory/) | Orlando, FL | 57 | Catalogue exists; repeated extracted copy needs rendered verification |
| [Neuhoff Auto Sales](https://www.neuhoffauto.com/) | Evansville, IN | 74 derived | Homepage make-count sum; older inventory snapshot differs |
| [AMT AUTO SALES LLC](https://www.amtautosales.com/cars-for-sale) | Houston, TX | 80 | Catalogue scale, not a verified UX gap |
| [Keen Auto Mall](https://www.keenautomall.com/inventory) | Pompano Beach, FL | 73 stale | Reserve: opened page is old; a different search snapshot showed 100 |
| [Depue Auto Sales Inc](https://www.depueautosales.com/cars-for-sale) | Paw Paw, MI | 100 | Existing filters and enquiries; prove an improvement |
| [MY CAR OUTLET](https://www.mycaroutlet.com/cars-for-sale) | Mount Crawford, VA | 80 | Audit existing mobile catalogue and detail journey |
| [Good Wheels Auto Sales](https://www.goodwheelsautosales.com/cars-for-sale) | Cornelia, GA | 99 | Confirm whether request-price presentation is intended policy |
| [Sevierville Import & Truck Center](https://www.sevierimports.com/cars-for-sale) | Sevierville, TN | 107 mixed | Exclude unsuitable inventory categories; appointments already advertised |
| [Nicky D's](https://www.nickyds.com/cars-for-sale) | Easthampton, MA | 82 | Existing catalogue; no measured design weakness yet |

Crawl ages and changed search/page totals are retained in [usa.json](usa.json). None of these figures is a live-stock guarantee. Prioritize audits with testable content/journey questions rather than automatically building thirty US demos.

## Other European markets

| Dealer | Country / city | Inventory evidence | Qualification caveat |
| --- | --- | ---: | --- |
| [AMH Cars Bhm Ltd](https://www.amhcars.co.uk/) | UK / Birmingham | 34 derived | Homepage make-count sum; zero-stock brand destinations to inspect |
| [Midlands Trade Centre Limited](https://www.midlandstradecentreltd.co.uk/used-cars) | UK / Birmingham | 26 | Reserve; below initial size screen |
| [Heartlands Motor Group](https://www.heartlandsmotorgroup.co.uk/) | UK / Yardley, Birmingham | 57 advertised | Verify trading-name consistency and mobile journey |
| [Autohandel Winter](https://www.autohandelwinter.de/) | Germany / Groß Oesingen | 84 recorded | Own site exists; car details hand off to mobile.de by design |
| [Autobedrijf Spinder](https://www.autobedrijfspinder.nl/) | Netherlands / Elst, Rhenen | More than 100 claimed | Two locations; verify car-specific location clarity |
| [Autobedrijf Wester](https://autobedrijfwester.nl/) | Netherlands / city unverified | More than 100 claimed | Confirm location, actual stock and a concrete website opportunity |

See [europe.json](europe.json) for evidence and next actions. The Dutch figures are dealer statements, not independently counted inventory.

## What was and was not done

Public company pages, catalogue counts and bounded name/domain research were reviewed. Existing Varna work was linked to the inspected repository tree. Research age, uncertainty, identity collisions and missing facts were retained.

No new dealer applications, hosted previews, messages, CRM records or private sales statuses were created. No template, generated client project, dependency or lockfile was changed. No live form was submitted. No visual website audit or independent conversion test was completed; environment-blocked browser access is not a finding against a dealer.

The next useful operation is to **qualify a small batch, then prepare all three designs for each approved account** using the existing workflow. More unqualified names are not a substitute for finding businesses where the offer is genuinely useful.
