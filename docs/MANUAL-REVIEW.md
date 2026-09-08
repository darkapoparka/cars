# Manual client review

Current dealer: **1. Excellent Cars** — in progress.

Progress: **0 / 10 dealers reviewed · 0 / 30 variants reviewed**. Created 2026-09-08.

This file is the source of truth for the owner's manual review. Automated QA results do not tick these boxes. No previous casual approval has been converted into a completed review.

## How we work

1. Open one dealer's three variants. Review mobile (390px) and desktop (1440px).
2. Check home/entry, inventory, a vehicle detail/gallery, contact, navigation, search/filter and enquiry destination. Check logo, photos, copy and real contact information.
3. Record separate mobile/desktop scores out of 10, an outcome and any concrete fixes.
4. Tick a variant only after you say its manual review is finished. A reviewed variant may still need fixes or be rejected.
5. Pick a preferred variant (or leave undecided), tick the dealer after all three are reviewed, then move to the next unchecked dealer. Stop the previous dealer's three servers and use the next dealer's assigned ports.
6. After fixes, recheck only affected items/widths and append a dated note. Do not erase completed reviews or repeat the full review unless requested.

You can edit this file or give ratings/notes in chat and have them saved here. Example: “Excellent Auto Best: mobile 8, desktop 7, reviewed, needs fixes: header logo too small.” Blank scores mean unrated. Outcomes: **Keep / Needs fixes / Reject**.

## Queue

- [ ] 1. [Excellent Cars](#excellent-cars) — CURRENT
- [ ] 2. [AVANGARD AUTO](#avangard-auto)
- [ ] 3. [Champion Auto Pro](#champion-auto-pro)
- [ ] 4. [Астракар](#astracar)
- [ ] 5. [Аутолайф](#autolife)
- [ ] 6. [Автокъща Приселци](#priselci)
- [ ] 7. [Иво Ауто](#ivo-auto)
- [ ] 8. [Аутомаркет Варна](#automarket-varna)
- [ ] 9. [ELIT AUTO IMPORT EXPORT](#elit-auto-import)
- [ ] 10. [LEGEND AUTO](#legend-auto)

## Review records

<a id="excellent-cars"></a>

### 1. Excellent Cars

Public preview: [All three designs](https://excellent-cars.vercel.app) — use the floating Design button. Hosted QA passed at 390/1440px on 2026-09-08; manual review boxes remain unchanged.

Status: In progress · Preferred variant: — · Reviewed on: —

| Variant | Preview | Mobile /10 | Desktop /10 | Outcome | Notes / fixes |
| --- | --- | --- | --- | --- | --- |
| Auto Best | [Open 6621](http://127.0.0.1:6621/) | — | — | — | Mobile header tagline hidden; larger name in a compact 140 × 54px frame. Awaiting owner recheck. |
| Modern | [Open 6622](http://127.0.0.1:6622/cars) | — | — | — | Mobile header tagline hidden and logo proportions corrected. Awaiting owner recheck. |
| Carwow | [Open 6623](http://127.0.0.1:6623/) | — | — | — | Mobile home tagline hidden; larger name in a compact 140 × 54px frame clear of tabs. Awaiting owner recheck. |

- [ ] Auto Best — manual review finished
- [ ] Modern — manual review finished
- [ ] Carwow — manual review finished

Fix/recheck log:

- 2026-09-08 — Owner flagged Auto Best's tiny mobile logo and Carwow's oversized mobile logo. Auto Best now uses the existing transparent white logo in a 120 × 64px mobile-home frame; Carwow logo width reduced from 170px to 120px. Browser checked at 390/1440px with no page errors or horizontal overflow; desktop appearance preserved. Svelte autofixer clean for both edited components. Awaiting owner visual acceptance; review boxes and scores remain unchanged. Evidence: `runtime/manual-review/excellent-logo/`.

- 2026-09-08 — Owner requested removal of the lower autocenter tagline to give the main name more room without excess height. Cropped the displayed mobile header logo in all three Excellent variants, preserving original artwork. Auto Best and Carwow use 140 × 54px frames; Modern uses a 128px-wide cropped frame with the correct source image proportions. Visually checked all three entry previews at 390px: main name intact, tagline hidden, no page errors or horizontal overflow. Both Svelte components pass autofixer. Awaiting owner acceptance; no review boxes or scores changed. Evidence: `runtime/manual-review/excellent-logo/no-tagline-*.png` and `no-tagline.json`. Review other dealers' logo proportions individually as their turn comes up.

Existing QA note to consider: Modern gallery changes photos and closes, but keyboard focus does not return to the opening photo control. This is a recorded limitation, not an owner rating.

<a id="avangard-auto"></a>

### 2. AVANGARD AUTO

Status: Not started · Preferred variant: — · Reviewed on: —

| Variant | Preview | Mobile /10 | Desktop /10 | Outcome | Notes / fixes |
| --- | --- | --- | --- | --- | --- |
| Auto Best | [Open 6626](http://127.0.0.1:6626/) | — | — | — | — |
| Modern | [Open 6627](http://127.0.0.1:6627/cars) | — | — | — | — |
| Carwow | [Open 6628](http://127.0.0.1:6628/) | — | — | — | — |

- [ ] Auto Best — manual review finished
- [ ] Modern — manual review finished
- [ ] Carwow — manual review finished

Fix/recheck log: No owner findings recorded yet.

<a id="champion-auto-pro"></a>

### 3. Champion Auto Pro

Status: Not started · Preferred variant: — · Reviewed on: —

| Variant | Preview | Mobile /10 | Desktop /10 | Outcome | Notes / fixes |
| --- | --- | --- | --- | --- | --- |
| Auto Best | [Open 6631](http://127.0.0.1:6631/) | — | — | — | — |
| Modern | [Open 6632](http://127.0.0.1:6632/cars) | — | — | — | — |
| Carwow | [Open 6633](http://127.0.0.1:6633/) | — | — | — | — |

- [ ] Auto Best — manual review finished
- [ ] Modern — manual review finished
- [ ] Carwow — manual review finished

Fix/recheck log: No owner findings recorded yet.

<a id="astracar"></a>

### 4. Астракар

Status: Not started · Preferred variant: — · Reviewed on: —

| Variant | Preview | Mobile /10 | Desktop /10 | Outcome | Notes / fixes |
| --- | --- | --- | --- | --- | --- |
| Auto Best | [Open 6636](http://127.0.0.1:6636/) | — | — | — | — |
| Modern | [Open 6637](http://127.0.0.1:6637/cars) | — | — | — | — |
| Carwow | [Open 6638](http://127.0.0.1:6638/) | — | — | — | — |

- [ ] Auto Best — manual review finished
- [ ] Modern — manual review finished
- [ ] Carwow — manual review finished

Fix/recheck log: No owner findings recorded yet.

<a id="autolife"></a>

### 5. Аутолайф

Status: Not started · Preferred variant: — · Reviewed on: —

| Variant | Preview | Mobile /10 | Desktop /10 | Outcome | Notes / fixes |
| --- | --- | --- | --- | --- | --- |
| Auto Best | [Open 6641](http://127.0.0.1:6641/) | — | — | — | — |
| Modern | [Open 6642](http://127.0.0.1:6642/cars) | — | — | — | — |
| Carwow | [Open 6643](http://127.0.0.1:6643/) | — | — | — | — |

- [ ] Auto Best — manual review finished
- [ ] Modern — manual review finished
- [ ] Carwow — manual review finished

Fix/recheck log: No owner findings recorded yet.

<a id="priselci"></a>

### 6. Автокъща Приселци

Status: Not started · Preferred variant: — · Reviewed on: —

| Variant | Preview | Mobile /10 | Desktop /10 | Outcome | Notes / fixes |
| --- | --- | --- | --- | --- | --- |
| Auto Best | [Open 6646](http://127.0.0.1:6646/) | — | — | — | — |
| Modern | [Open 6647](http://127.0.0.1:6647/cars) | — | — | — | — |
| Carwow | [Open 6648](http://127.0.0.1:6648/) | — | — | — | — |

- [ ] Auto Best — manual review finished
- [ ] Modern — manual review finished
- [ ] Carwow — manual review finished

Fix/recheck log: No owner findings recorded yet.

<a id="ivo-auto"></a>

### 7. Иво Ауто

Status: Not started · Preferred variant: — · Reviewed on: —

| Variant | Preview | Mobile /10 | Desktop /10 | Outcome | Notes / fixes |
| --- | --- | --- | --- | --- | --- |
| Auto Best | [Open 6651](http://127.0.0.1:6651/) | — | — | — | — |
| Modern | [Open 6652](http://127.0.0.1:6652/cars) | — | — | — | — |
| Carwow | [Open 6653](http://127.0.0.1:6653/) | — | — | — | — |

- [ ] Auto Best — manual review finished
- [ ] Modern — manual review finished
- [ ] Carwow — manual review finished

Fix/recheck log: No owner findings recorded yet.

<a id="automarket-varna"></a>

### 8. Аутомаркет Варна

Status: Not started · Preferred variant: — · Reviewed on: —

| Variant | Preview | Mobile /10 | Desktop /10 | Outcome | Notes / fixes |
| --- | --- | --- | --- | --- | --- |
| Auto Best | [Open 6656](http://127.0.0.1:6656/) | — | — | — | — |
| Modern | [Open 6657](http://127.0.0.1:6657/cars) | — | — | — | — |
| Carwow | [Open 6658](http://127.0.0.1:6658/) | — | — | — | — |

- [ ] Auto Best — manual review finished
- [ ] Modern — manual review finished
- [ ] Carwow — manual review finished

Fix/recheck log: No owner findings recorded yet.

<a id="elit-auto-import"></a>

### 9. ELIT AUTO IMPORT EXPORT

Status: Not started · Preferred variant: — · Reviewed on: —

| Variant | Preview | Mobile /10 | Desktop /10 | Outcome | Notes / fixes |
| --- | --- | --- | --- | --- | --- |
| Auto Best | [Open 6661](http://127.0.0.1:6661/) | — | — | — | — |
| Modern | [Open 6662](http://127.0.0.1:6662/cars) | — | — | — | — |
| Carwow | [Open 6663](http://127.0.0.1:6663/) | — | — | — | — |

- [ ] Auto Best — manual review finished
- [ ] Modern — manual review finished
- [ ] Carwow — manual review finished

Fix/recheck log: No owner findings recorded yet.

<a id="legend-auto"></a>

### 10. LEGEND AUTO

Status: Not started · Preferred variant: — · Reviewed on: —

| Variant | Preview | Mobile /10 | Desktop /10 | Outcome | Notes / fixes |
| --- | --- | --- | --- | --- | --- |
| Auto Best | [Open 6671](http://127.0.0.1:6671/) | — | — | — | — |
| Modern | [Open 6672](http://127.0.0.1:6672/cars) | — | — | — | — |
| Carwow | [Open 6673](http://127.0.0.1:6673/) | — | — | — | — |

- [ ] Auto Best — manual review finished
- [ ] Modern — manual review finished
- [ ] Carwow — manual review finished

Fix/recheck log: No owner findings recorded yet.

## Session log

- 2026-09-08: Started structured manual review with Excellent Cars. Reused its previews on 6621/6622/6623; stopped the prior Champion preview on 6631. All manual-review boxes remain unchecked. Preview links for queued dealers work only while their servers run.

