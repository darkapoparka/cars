# СЪНИ — Varna

Status: **in-progress**. Three actual independent master-based applications now exist, with integrated local proposed logos, icons, business identity and an eight-listing public-source snapshot. This supersedes the earlier documentation-only / zero-application status, preserved verbatim in RESEARCH-2026-09-09.md.

Branch-only handoff on `codex/astra-bg-03`. The owner explicitly elected to run application tests locally. No installs, framework builds or app browser checks are claimed here; owner review remains pending. No deployment, new dealer repository, outreach, Windows checkout or background process.

## Sources and identity

Published account: https://sunny.mobile.bg/ . Primary phone: 0898 644 464, `tel:+359898644464`. Address: бул. „Цар Освободител“ 256, Кайсиева градина, Варна. Hours are the published about-page schedule, qualified by a request to confirm before visiting. Conflicting secondary contact and tenure claims remain documented in the original research. Unknown socials and email are not replaced with another business's accounts.

The application data snapshot was observed on 2026-09-09. Two individual details (Beetle and Smart) were read; the remaining six records use the opened catalogue cards, with that limitation retained per record. Source IDs, URLs, advertised EUR prices, kilometres, tax wording and source conflicts are preserved in the actual imported data modules. Eight demo records are not a claim that the business has only eight cars, that all cars remain available, or that mileage/condition was independently verified.

## Actual implementation boundaries

- Auto Best: original full SvelteKit application; `brand.ts`, `inventory.ts`, the retained footer, showroom map, palette tokens and app icon tags now consume this dealer's identity/content.
- Modern: original **full workspace**, including all apps and required packages. `packages/marketplace/lead-site.ts` and the actual `marketplace-domain/testing/mock-data.ts` source used by the public demo read the dealer snapshot. Old inventory, fake buyer leads and sample trust/transaction records were not relabelled as real dealer facts.
- Carwow: original full SvelteKit application; site/navigation data, current inventory and vehicle detail/filter data now use the same source snapshot. Inherited customer reviews are empty rather than fabricated.
- Every app includes local `brand/` SVG logo variants, matching favicon, PNG/touch export, abstract decorative illustration and explicit missing-photo artwork. These files are present in the app trees, not download-later scripts or external hotlinks.

## Remaining work at this checkpoint

The route-by-route supporting-content and legacy hardcoded-identity sweep is still in progress. Do not treat this checkpoint as complete personalization. The original vehicle-photo access/reuse gap is **still open**: dated real vehicle records render explicit missing-photo tiles, never another dealer's cars. No real galleries have been bundled. Runtime tests are deferred to the owner, independently of that content/asset limitation.

The logos are custom outlined-vector **demo proposals**, not dealer-approved originals and not ImageGen output. ImageGen returned that generation had not started. SVG/PNG export and contact-sheet inspection are asset preparation only, not full app verification. See each app's `brand/PROVENANCE.md`.

See REVIEW.md for retained install/check/start commands and expected localhost entries. All `.client/project.json` QA flags remain false. Shared public-origin/FAB integration is intentionally not implemented in this branch-only phase.
