# Varna client demos — final local verification

2026-09-08. **30/30 variants verified for local demo review** across 10 dealerships. Each has one Auto Best, Modern and Carwow project from template version 2026.09.06-refresh-1.

316 route/viewport checks and 60 main-flow interaction checks at 390px and 1440px. The current client reports link framework/build logs, rendered screenshots, contact checks and any narrower caveats. This is local demo acceptance, not production or message-delivery certification.

| Dealer | Auto Best | Modern | Carwow | Evidence |
| --- | --- | --- | --- | --- |
| Excellent Cars | Pass · 6621 | Pass · 6622 | Pass · 6623 | [Client report](../../../clients/excellent-cars/qa-final/FINAL.md) |
| AVANGARD AUTO | Pass · 6626 | Pass · 6627 | Pass · 6628 | [Client report](../../../clients/avangard-auto/qa-final/FINAL.md) |
| Champion Auto Pro | Pass · 6631 | Pass · 6632 | Pass · 6633 | [Client report](../../../clients/champion-auto-pro/qa-final/FINAL.md) |
| Астракар | Pass · 6636 | Pass · 6637 | Pass · 6638 | [Client report](../../../clients/astracar/qa-final/FINAL.md) |
| Аутолайф | Pass · 6641 | Pass · 6642 | Pass · 6643 | [Client report](../../../clients/autolife/qa-final/FINAL.md) |
| Автокъща Приселци | Pass · 6646 | Pass · 6647 | Pass · 6648 | [Client report](../../../clients/priselci/qa-final/FINAL.md) |
| Иво Ауто | Pass · 6651 | Pass · 6652 | Pass · 6653 | [Client report](../../../clients/ivo-auto/qa-final/FINAL.md) |
| Аутомаркет Варна | Pass · 6656 | Pass · 6657 | Pass · 6658 | [Client report](../../../clients/automarket-varna/qa-final/FINAL.md) |
| ELIT AUTO IMPORT EXPORT | Pass · 6661 | Pass · 6662 | Pass · 6663 | [Client report](../../../clients/elit-auto-import/qa-final/FINAL.md) |
| LEGEND AUTO | Pass · 6671 | Pass · 6672 | Pass · 6673 | [Client report](../../../clients/legend-auto/qa-final/FINAL.md) |

## Coverage and fixes

Checked entry/home, inventory, a real vehicle detail, contact and about/import routes; search/filter, navigation, mobile menu dismissal and focus, gallery where offered, and enquiry/contact destinations. Screenshots were visually inspected instead of trusting DOM text or HTTP status alone.

Repairs include stale Modern sample-directory references and invalid data shapes, duplicate dictionary keys, empty-team prerender configuration, stock-derived search choices/budget content, correct parsing of non-breaking spaces in numeric prices/mileages, readable client logos, inherited chat-brand media, verified financing phone/map links, unconfigured social placeholders, and stale manifests/static proposal pages. Original proposal/concept artifacts are preserved outside the served site. Some earlier successful builds are reused; later scoped logo, copy or static-asset changes have framework checks and rendered evidence as recorded in the individual client reports. This does not certify a freshly built deployable artifact for every final source snapshot.

The initial sweep remains in this audit folder. Final evidence lives under each client qa-final folder. Initial Vite dependency-optimization issues, smooth-scroll capture timing and a test-induced React attribute mismatch were investigated separately from product defects; final reports identify any retained runtime caveats.

## Local review

The four owner review previews are retained: [Excellent Auto Best](http://127.0.0.1:6621/), [Excellent Modern](http://127.0.0.1:6622/cars), [Excellent Carwow](http://127.0.0.1:6623/), and [Champion Auto Best](http://127.0.0.1:6631/). Other QA runtimes are stopped after verification. Ports in the table are assigned review addresses, not a claim that all 30 servers run simultaneously. Legend uses safe ports 6671/6672/6673, replacing browser-blocked 6666/6667/6668.

Inventory/photos and prices are the dated source snapshots recorded in the client briefs; availability must be confirmed with the dealer. Forms, chat, private accounts, live import feeds and external delivery retain their documented demo limits. Excellent Modern has a recorded lightbox keyboard-focus restoration gap; its image navigation and dismissal work, and menu focus checks pass. Source-derived sample admin/team/partner surfaces are not proof of real staff, customers or partnerships. No public deployment, outreach, commit, push or CRM registration occurred.

Shared templates were not overwritten. Reusable defects discovered here should be incorporated into a separately reviewed template refresh; these independent client copies retain their own fixes.
