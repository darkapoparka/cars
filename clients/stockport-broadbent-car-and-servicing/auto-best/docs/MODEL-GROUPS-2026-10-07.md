# Desktop model families — 7 October 2026

The approved desktop picker now starts with expandable model families. BMW shows 1–8 Series before X, M, i and Z; Mercedes-Benz shows its Class families before historical standalone numbers; Audi groups A/Q lines with their S/RS derivatives. Other makes reuse the preserved native tree and explicit named variants. The catalogue includes historical models and does not claim to be a live manufacturer production list.

Family disclosures open the corresponding model choices. Search finds choices across collapsed families and brands. Selected choices are revealed when reopening; users can collapse them again. Availability is computed from the dealer's actual inventory, including zero-stock choices. No listing was added. Model-family counts count each matching car once; overlapping broad models and exact trim choices are alternatives rather than additive stock totals.

The same editor serves desktop Home, inventory shortcuts and the full form's compact nested Model picker. Its scroll pane owns the expanded content. The existing 840/640/480px selector widths, compact All models control, search header, action footer, focus restoration and opacity-only opening remain in their owners. Mobile and tablet retain their stock-derived editor.

New model values are readable, make-prefixed values in the existing repeated `model` parameter. Existing exact stock values, return links, unknown dealer models and GET semantics remain supported. Numeric matching excludes different model numbers; BMW M Sport trims do not imply X-series M models, and Mercedes GLE does not enter G-Class. Duplicate native parent records are merged without losing their model choices. Domain checks validate unique family and child keys across all 182 source makes.

## Verification

- Full Node 22 validation and production build passed, with 0 Svelte errors and 0 warnings; architecture, CSS policy, tokens, typography, assets, domain, enquiry-resource and overlay checks passed.
- Model-family browser checks: 12 Chromium cases and 6 WebKit cases across BG/EN, Home, inventory and nested full-form editors, at 992×600 and/or 1440×900. Chromium exercised normal opening motion; WebKit exercised reduced motion. Checks cover keyboard and pointer disclosure, stationary page/footer, usable targets, zero-stock application, search, cancelled drafts and exact legacy results.
- Existing Home regression: 10 BG/EN viewport cases including tablet, desktop and a short window.
- Existing inventory/full-form regression: 14 cases, including outside-stock values and the development-only large equipment fixture.
- Existing filter-code regression: 6 BG/EN cases at 320, 390 and 1440px.
- Existing mobile journeys: 4 widths, including 320 and 390px.

The model-tree source snapshot and presentation adapters are documented in [catalogue provenance](../provenance/model-catalogue.md). Browser reports and matched desktop captures remain in ignored `artifacts/` and `runtime/auto-best-model-groups-2026-10-07-01a115ed/`. These are local source checks; no dealer deployment or release-lock change is included.

## Source boundaries

`model-catalogue-data.ts` owns the pinned model names. `model-catalogue.ts` owns model matching, grouping and counts. `DesktopModelGroups.svelte` owns the desktop disclosures and reuses `DesktopFilterChoice.svelte`. The three existing editor owners supply their current draft/search and retain their lifecycle.

Unrelated font roles, range placeholder edits and authored documentation drafts in the shared checkout are preserved and excluded from this scoped change.
