# Теси Кар — three-template implementation

Status: **in progress, not review-ready**. This checkpoint contains actual independent Auto Best, complete-workspace Modern and Carwow applications. It is not a report-only replacement for them. All three are copied from the published main baseline `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`; the masters, existing clients, global index and launchers are untouched.

| App | Retained master | Entry | Source tree |
|---|---|---|---|
| auto-best | 2026.09.08-polish-1 | `/` | `97833980ab127f6de8f675ac1a188e4b7f717976` |
| modern | 2026.09.06-refresh-1 | `/cars` / `/bg/cars` | `66bfb8196bbce18832ada6b34b02dda97baba25b` |
| carwow | 2026.09.08-repair-1 | `/` | `d4a08817e87cf84d08c4db1c08a515937245f2dd` |

## Actual source boundaries wired

Auto Best's brand and inventory modules consume the local facts file. Modern's site configuration and actual domain listing provider consume it; the full monorepo is retained, including database/auth/API and other workspace packages. Carwow's site, raw-listing and vehicle modules consume it. Existing interfaces are retained rather than building replacement lookalike pages. All providers use the same eight real advertised source records, not inherited template stock.

Published sources observed on 2026-09-09: https://tesicar.mobile.bg/ ; https://tesicar.mobile.bg/contacts ; https://tesicar.mobile.bg/about ; https://www.cars.bg/company/tesicar/ . Full vehicle-specific source URLs and two matched photo references per vehicle are in `source/dealer-facts.json` and its identical local app copies.

Contacts: +359886965047 and +359898694330. Directions: Varna, Tsar Osvoboditel Boulevard, after Metro toward Aksakovo, last on the left. No invented street number or exact coordinates. The contact page has no hours entered; sampled ads say Monday–Saturday 09:00–18:00 and Sunday by telephone arrangement, so visitors must confirm before travel. Registration/transit-plate assistance is dealer-stated. Finance is mentioned but no terms or in-house lending were verified. No independent domain or dealer-owned social account was established in the bounded search; that is not proof of absence.

The source advertises 52 category entries. The apps contain an eight-car source snapshot; neither number is a verified live-stock count. Conflicting Yaris year, Pulsar viewing in Sofia and C350/C320 model records are excluded explicitly.

## Branding and assets

The published Cars.bg logo at https://g1-bg.cars.bg/users_logos/184.jpg was visually inspected. Its white-background derivative is an actual bundled PNG in each app, not a text placeholder. Local PNG verification passed (150×55 pixels). Derivative SHA-256: `ff20f654b03a9e89f8411b84437f8ed04746d11c85a3a5b85580fa64bf00e89b`; Git blob `6105dcb70f8d94c430c49b5b7e05ff27613a7b4a`. It is not dealer-approved. Further asset sizing/light-dark treatment remains in progress.

Stock photographs currently use their exact original source URLs. The required local stock-photo transfer and final asset integration are **not complete**. No third-party photo licence is inferred from public access or from the original template's separate licence. Public deployment remains out of scope and requires factual/media review.

## Verification and remaining work

Modern provider: TypeScript transpilation plus 17 source assertions passed; tested local bytes match uploaded blob `8a5ab996e65bc81acf8328ab3ac43b245c43274d`. Carwow provider: transpilation plus 10 source assertions passed; tested bytes match blob `01bc3b29132d3d2b4572c3aecfe9f32fc33222f5`. These are not application/workspace/browser checks.

Still required: complete all remaining text/media/data consumers and supporting pages; handle the unverified-availability filter and empty-review states in the retained UI; bundle and check stock images; finalize logo variants/icons; install dependencies and run actual template checks; inspect 390/1440 and narrow-header behavior, console/network, galleries, contact paths and back state. Do not infer these checks from the source master or from generated presentation imagery.

No deployment, dealer communication, CRM registration, private sales records, shared Windows source writes, checkout changes, worktrees or competing servers were created. Files are handed off only on `codex/astra-bg-01` for the coordinator to integrate and run with the existing launcher.
