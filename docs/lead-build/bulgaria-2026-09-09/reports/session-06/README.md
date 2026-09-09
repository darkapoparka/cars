# Bulgaria session 06 — current implementation handoff

## Five outcomes

| Dealer | Current outcome | Implemented application sources |
| --- | --- | --- |
| GoldenDreams AUTO | Blocked on current showroom/contact/stock identity under the explicit account exception | 0/3 |
| G Auto, Blagoevgrad | Implemented-unverified; full framework/browser review pending | 3/3 |
| Крис Кар, Plovdiv | Pending; current facts and visual references preserved, apps not built | 0/3 |
| Slavi Cars, Dupnitsa | Pending; prior research preserved, apps not built | 0/3 |
| FRESH MOTORS, Sheremetya | Pending; prior research preserved, apps not built | 0/3 |

This is three implemented sources, not a completed fifteen-application batch. G Auto is the first dealer source set for coordinator inspection. None is owner-reviewed, runtime-verified or deployed. The remaining unimplemented accounts are not a GitHub-access failure.

## Actual application commits

- `5311c5e37a4fe324b57a01c22645cf023a709ffe`: independent retained template trees, eight seller-advertised vehicles and 32 matched gallery photographs per design.
- `689d2a7380f97120dbb46a58b0edeb2da8c6f1b3`: native content, gallery and Unicode price parsing, whole-logo integration, metadata, supporting pages, honest preview behavior and review handoff.

After publication, every G Auto application blob was compared with its intended bytes using Git object hashes. File counts: 274 Auto Best, 1264 full-workspace Modern, 1367 Carwow. All assets are local independent files, not a download-later script.

Source base: `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`. Master versions and trees are in each `.client/project.json`, `.template/source-manifest.json` and `clients/g-auto/HANDOFF.md`. No main/astra write or template/shared-index edit was performed.

## Executed checks

In-memory Svelte server compilation: 53 Auto Best and 321 Carwow files, zero errors and two/three unused-CSS warnings. TypeScript/TSX transpile syntax: 22 Auto Best, 877 Modern and 189 Carwow files, zero syntax diagnostics. These are not full framework builds or semantic typechecks.

Executed actual data-module assertions covered all eight prices, Carwow mileage parsing, four matching photos per car, slug lookup, Auto Best BMW filter (five), price sorting/filtering (3999/6999/8999 EUR under 10000), Carwow budget counts, and Modern unverified-seller/media consistency. Thirty-eight binary assets per app were Git-hash verified. The committed whole-logo PNG was visually inspected; this is asset evidence, not application viewport evidence.

Not run: dependency installation, Prisma generation, full SvelteKit/Next validation/typecheck/build, app browser review, 320/390/1440 screenshots, UI menu/focus/gallery checks or owner visual acceptance. No visual pass is inferred from source checks. The exact evidence is in `clients/g-auto/checks/source-verification.json`.

An image-generation attempt for the next dealer returned unrelated output. It was rejected and not added to any application or counted as a logo, screenshot, repository-state evidence or completed work.

## Implementation limits

G Auto is a dated advertisement sample, not a live inventory feed or independently verified stock. Sold/reserved and conflicting records were excluded. No reviews, separate staff members, unconditional finance approval or successful demo enquiry delivery are fabricated. Native routes use the personalized data; historical raw reference HTML remains disabled under the retained empty raw-route allowlist. Generic illustrations are not represented as the dealer's premises, staff or current stock. No new dealer media licence or official approval is asserted.

No public origin, design FAB, deployment, dealership contact, private correspondence read, database migration or Windows source-checkout write was performed. The shared-origin switcher belongs to the coordinator publishing pass.

## Coordinator

Fetch `codex/astra-bg-06` without switching or overwriting a dirty shared checkout. Inspect the scoped changes, preserve local edits and integrate the owned paths deliberately. Then use `scripts/start-client.ps1 -Client g-auto -Prepare` and `scripts/start-client.ps1 -Client g-auto`.

Suggested entries after startup: Auto Best http://127.0.0.1:6631/ ; Modern http://127.0.0.1:6632/cars ; Carwow http://127.0.0.1:6633/ . These are proposed local entries, not listeners launched by this worker. See `clients/g-auto/REVIEW.md` for exact routes and commands.
