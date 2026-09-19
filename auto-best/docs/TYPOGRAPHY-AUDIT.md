# Typography audit — 13 September 2026

Scope: all live text in the reusable master, including shared navigation/footer, home discovery and services, inventory and filters, vehicle details and finance, company/contact pages, Sell/Import enquiry and help dialogs, editorial pages and error states. Baseline: `156421d278baee98344dc8565a35e1a163819dfc` on `main`, clean checkout. Local browser: this repository's Node 22 Vite server on port 6477.

## Findings and resolution

Owner refinement after the initial audit: entry segments now use 16px/500 pill options with white selection on pale gray, so the 18px/400 bordered input is more prominent. Primary actions remain 18px/500. Both workflow call links are now one shared text-link placement outside the card. The table below records the initial audit; [Styling](STYLING.md) is the current contract. `smoke:typography` asserts the revised input/tab hierarchy and external call-link placement.

The source audit found 1,096 typography declarations in 46 files; 865 supplied local literal values rather than shared tokens/inheritance. The bundled family was already Onest throughout the sampled live text. The inconsistency came from local scales, weights and competing component/route rules, rather than multiple downloaded font families.

| Finding | Baseline rendered evidence | Resolution |
| --- | --- | --- |
| Primary action weaker than call action | Sell: 16px/600 mobile and 16px/700 desktop; call: 18px/500 | Primary actions 18px/500; secondary call controls 16px/500 |
| Small, heavy entry tabs | Home Buy/Import: 14px/650; desktop Sell/Import: 14px/700 | One shared segmented control with 18px/500 labels and minimum 44px hit height |
| Import action hidden inside the field | Circular arrow was the only primary request control | Separate labeled “Заяви внос” action for both link and criteria entry |
| Competing responsive patches | Mobile workflow route CSS overrode component action/tab typography | Remove competing entry overrides; consume the shared type roles |
| Dense supporting text | Local 10–13px labels, hints and supporting copy | 14px metadata/helper role, 16px prose/inputs, regular text weight |
| Inconsistent emphasis | Local weights 450/650/680/700/750/760/800 | Regular 400, medium 500, semibold 600 |
| Larger copy constrained by old geometry | Fixed compact service copy and enquiry step rows | Service copy reserves artwork space; long labels and steps wrap; action height can grow |
| No enforcement | Local sizes could return after any component edit | `check:typography` rejects literal typography values outside `tokens.css` and runs in `validate` |

The final role contract is maintained in [Styling](STYLING.md). Typography remains with the existing component/route owner; no global `!important` override layer, new font dependency or framework change was added.

## Verification

- Source inventory and before/after rendered samples: 12 representative routes at 390px and 1440px. Local artifacts: `artifacts/typography/`.
- Existing `route-smoke.mjs`: 72 passing cases covering every vehicle/article record, core routes, empty results, invalid routes and eight additional responsive samples. Assertions cover overflow, missing images, page errors and document landmarks; screenshots were inspected for representative pages.
- `smoke:typography`: 320/390/768/1440px, keyboard Buy/Import switching, CTA size/weight hierarchy, validation, Sell form/photo/review screens, Import link/criteria/contact/review screens, help opening, Escape and focus restoration. It checks control clipping and records screenshots under `artifacts/typography-smoke/`.
- Additional rendered checks cover home/inventory search dialogs, mobile menu, Import help, and Sell entry/form at 125% text size. Search dialog submit actions also use the 18px CTA role.
- Official Svelte autofixer reviewed the changed components. Its remaining dynamic-href warnings refer to existing telephone/external destinations or route URLs supplied by existing helpers; attachment suggestions are unrelated to typography.
- `check:typography`, `check:assets`, `check:domain`, Svelte/TypeScript `check` (zero errors/warnings), and the production build passed with Node 22.23.2. The combined `validate` command stops at the existing architecture violation in `Header.svelte`: its footer visibility observer uses `document.querySelector`. The same code is present in the baseline commit; typography work does not change that behavior. The remaining checks were run individually.

This is local source and browser evidence. It does not promote a Cars snapshot, publish a dealer, verify form delivery or constitute owner visual acceptance. Existing image-baked lettering (logos, vehicle-photo watermarks, finance/seller artwork) and third-party map text cannot inherit CSS tokens and were preserved. The older combined `smoke` chain includes an enquiry test targeting the retired Sell component; current Sell/Import coverage is in `smoke:typography`.
