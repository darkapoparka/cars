# Cars workspace instructions

Cars is the integration workspace for dealer demos. The owner's current request takes precedence over workflow guidance; use judgment for routine implementation choices and finish the authorized scope.

## Ownership

- Shared frontend/code improvements belong to the authoritative standalone repositories at `J:/template-repos/cars-template-{auto-best,modern,carwow,import}`.
- `templates/<key>` holds managed release snapshots selected by `templates.lock.json`. Unreconciled copies are frozen holdings, not approved releases. Never maintain another master here.
- `clients/<slug>/` is canonical editable dealer source, with all selected designs together. Dedicated dealer repositories are publishing mirrors; preserve unmatched mirror fixes before exporting.
- Use this Cars checkout at `J:/cars`. Keep its current `main` checkout and unrelated work intact; do not create another Cars worktree or sibling session copy. Derived packages and evidence go in ignored `runtime/`.
- `docs/DEPLOYMENT-INVENTORY.json` owns technical project/deployment records. Regional `leads/*.json` owns public research. Agency OS remains the private CRM authority; never put sales notes, credentials or CRM exports in this public repository.

## Route the task

| Request | Read / use |
| --- | --- |
| New dealer or dealer correction | [WORKFLOW](docs/WORKFLOW.md), `cars-lead-build` skill |
| Shared template polish | Open the standalone template; read its AGENTS and relevant technical reference |
| Review/promote an upstream release | [TEMPLATE-PROMOTION](docs/TEMPLATE-PROMOTION.md), `cars-template-release` skill |
| Package/publish one dealer | [LEAD-PUBLISHING](docs/LEAD-PUBLISHING.md), `cars-publish` skill |
| Audit or status | Inspect relevant source/evidence; remain read-only unless fixes are requested |
| Research | [Lead index](leads/README.md) and [coverage](leads/COVERAGE.md) |

Read only the references needed for the task. Historical campaigns and old source task ledgers are evidence, not an active queue. The old branch name `astra` is unrelated to model selection.

## Working contract

Confirm physical path, Git remote/branch/HEAD and relevant dirty paths before writing. One writer owns each checkout/index/build output. Verify listener/process ownership before using a port; never stop an unrelated server or silently substitute ports. Preserve staged, unstaged, untracked and unique branch work. No blanket staging, resets, cleans, force-pushes or history deletion. Use scoped commits or a separate temporary index for reviewed paths when the owner's index is occupied.

New dealer work uses the actual template source and preserves layout, spacing, typography, components, routes and interactions while changing sourced identity/content. [LEAD-BUILD-GUARDRAILS](docs/LEAD-BUILD-GUARDRAILS.md) owns branding, content and source requirements. Do not inherit another dealer's facts or claim sample forms deliver messages.

## Dealer adaptation invariants

Dealer personalization is a controlled content/identity layer, not permission to redesign a template. Unless the owner explicitly requests shared template work, preserve the selected template's composition, component geometry, typography, spacing, breakpoints, navigation, interactions and intended media treatment.

- Keep the master hero system as designed. Do not invent replacement hero layouts, collages, masks or one-off compositions, and do not change crop/zoom/object-position behavior so dealer media becomes awkwardly framed. A dealer-specific hero asset is allowed only when the template already exposes that content boundary or the owner explicitly requests it; it must fit the existing composition at mobile and desktop widths.
- Normal dealer changes are sourced logo/identity assets, theme colors within existing boundaries, inventory/listing data and permitted vehicle media, business facts, localized copy, contact destinations, metadata and other factual content.
- A dealer-specific styling defect that requires changing reusable layout behavior belongs upstream in the authoritative template. Do not hide it with client-only redesigns unless the smallest local consumer fix is required for correctness.

Logo handling is mandatory visual research, not text-only inference. Check the dealer's rendered website and public visual sources such as search/image results, business listings, marketplace profiles, social profiles, signage/banner imagery and listing watermarks where useful. Use a suitable permitted original logo when one exists. If the recognizable source is too blurry, dated or unusable for the required surfaces, use the available image-generation tool to create a professional refresh of that same identity. If no recognizable branding exists after documented visual checks, use image generation to create a clearly labeled proposal/demo identity. Do not skip a needed image-generation step for convenience.

Final dealer branding must be integrated as committed image assets. CSS-only wordmarks, plain text fallbacks, font tricks, quick text SVGs and similar workaround logos are temporary development aids only and cannot satisfy completion. Do not replace a suitable real logo with generated artwork merely to make it different. When image generation is required but cannot be completed, record the branding blocker and keep the build incomplete rather than shipping a workaround as final.

Verify the chosen logo asset and appropriate surface variants in every offered design and all relevant consumers: desktop header, mobile header/drawer, sticky navigation, footer, dealer cards where present, metadata, favicon/touch icon and manifest. Verify bytes are committed and inspect clipping, transparent padding, backgrounds, masks, filters, dimensions and small-size legibility. The detailed acceptance rules and provenance fields live in [LEAD-BUILD-GUARDRAILS](docs/LEAD-BUILD-GUARDRAILS.md).

A requested new dealer build includes appropriate QA, scoped commit/push, its private publishing repository, one Vercel project and hosted verification, unless the user narrows the scope. Standard trio: Auto Best, Modern, Carwow. An intentional Import trio uses Auto Best, Import, Carwow. Existing manifests determine actual offered designs; four available templates do not imply four designs. Reuse recorded names and domains. Publishing never authorizes outreach or mass deployment.

Run focused checks for the changed behavior. [QA](docs/QA.md) defines application and mounted-preview evidence. Source, build, deployment, browser verification and owner review are separate facts. Report gaps honestly and continue independent authorized work. If a specific instruction blocks completion, identify its file and exact requirement rather than inventing a new approval step.

## Maintenance

Workflow commands, release compatibility and publishing changes update their authoritative docs and relevant tests together. [Documentation index](docs/README.md) and [coordination](docs/COORDINATION.md) locate references and handoff conventions. Run `node scripts/check-workflow.mjs` and `node --test scripts/*.test.mjs` for workflow changes.
## Main is the working branch

The owner chose a main-only workflow on 13 September 2026. Use the saved checkout on `main` for routine work. Do not create another branch or worktree unless the owner explicitly requests one. One task owns writes to a checkout; concurrent tasks may review read-only or work in a different repository. Fetch and inspect status before writing, preserve other tasks' work, and finish authorized implementation with scoped commits and a non-force push to main.

An explicitly requested temporary branch/worktree must be integrated, verified and removed before the task is called complete. If blocked, record its exact repository, ref, commit, paths and next action in the handoff. Do not leave unfinished source discoverable only through a task title or old branch. Source consolidation preserves work; template release, owner visual acceptance and dealer deployment keep their separate checks.
