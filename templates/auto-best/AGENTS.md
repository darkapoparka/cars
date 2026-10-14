# Auto Best template instructions

This is the authoritative reusable master at templates/auto-best in darkapoparka/cars. Follow [Cars ownership](../../AGENTS.md); the former standalone repository is retained history, not an active master. The current user request determines scope. Preserve the existing rendered design unless the requested shared improvement changes it.

## Task routing

- Shared template frontend/code work: work here, keep changes reusable, and read only the relevant architecture/style/QA reference.
- Dealer build or correction: use canonical clients/<slug>/ in [Cars](https://github.com/darkapoparka/cars), through its workflow. Do not personalize this master.
- Template release: follow [Cars template releases](../../docs/TEMPLATE-PROMOTION.md); promotion selects an exact reviewed commit and leaves existing dealers independent.
- Audit/status: inspect without edits or publication unless fixes are requested.

Read [TEMPLATE](TEMPLATE.md) for runtime/content boundaries and [docs/TESTING.md](docs/TESTING.md) when verification needs it. [Cars template releases](../../docs/TEMPLATE-PROMOTION.md) owns the source and release contract. Do not load every historical task ledger or resume its backlog.

## Implementation and preservation

### Dealer logos: transparent, with a variant for each background

Every dealer clone must provide transparent logo assets in `src/lib/config/brand.ts`: `logo` for light surfaces and `logoOnDark` for dark surfaces or dark photo overlays. If the lead only has a black logo, create a faithful white version with the same mark, lettering, proportions and clear space. Prefer an approved reversed asset when available. Preserve intentional brand colors only where they remain legible.

Never add a white/colored rectangle, badge, pill, border or shadow behind a dealer logo to make it readable, including backgrounds embedded in the asset. Fix the asset/variant instead. Apply this everywhere the dealer identity appears: desktop/mobile headers, menus, footer and future placements. Keep keyboard focus indicators and an adequate transparent link hit area; neither is a decorative logo box. Preserve the surrounding navigation and page surfaces.

Before accepting a clone, inspect both variants on their actual backgrounds at mobile and desktop widths, including the menu and footer. Check transparency, contrast, aspect ratio, clipping and link hit areas. See [Reuse](REUSE_GUIDE.md#logo-assets).

### Navigation icons

Use **Microsoft Fluent System Icons Regular** for mobile header, menu contents, inventory and other mobile actions through `MobileActionIcon.svelte`. The owner's 14 October 2026 request replaces only the five bottom-dock glyphs with the [new graphite artwork](provenance/graphite-bottom-nav-2026-10-14.md), bound through `dock-artwork.ts` and `BottomNavIcon.svelte`. Keep the transparent 96px canvases in the existing 24px frames; Sell has 2px of internal optical padding. Preserve the dock's localized labels, separate 44px targets, focus rings and selected underline. The owner rejected the earlier generated raster trial on 4 October 2026; retain [its generation record](provenance/generated-bottom-nav.md) as history and do not restore that set. Keep [the official Fluent sources, MIT license and upstream notice](provenance/fluent-icons.md) for the retained action renderers. Lucide remains rejected. Do not redraw paths, add arbitrary strokes, stretch glyphs or replace another icon family without an owner request. Mobile styling requests do not authorize desktop changes; keep mobile renderers separate from desktop/footer consumers. Preserve historical icon notices.

### Typography

Use **Inter v4.1** from the locally bundled, reviewed variable WOFF2 and the shared `--dn-font` token. Body/entry roles use 450, controls 500 and headings/prices 600. Keep the pinned [font provenance and OFL notice](provenance/inter.md), real BG/EN document language and required Ѝ/ѝ coverage. Do not replace the family, add a remote font service or introduce component-local font families without an explicit owner request. Typography validation also checks the visual-system pins. Recheck wrapping and 320/390px controls whenever font roles change.

### Working changes

Confirm physical checkout, remote, current branch/HEAD, relevant dirty paths and listener ownership. Independent files may be edited concurrently. Coordinate only overlapping files and shared Git/index/build output. Preserve unrelated staged, unstaged, untracked and unique branch work; no blanket staging, clean/reset, deletion of unmerged work or force-push. Keep existing lockfiles, runtime, licenses and provenance. Do not switch a working branch or overwrite another template or dealer merely to synchronize it.

Use Node 22.12+ on the 22 line and the retained npm lockfile. Keep source ownership at `src/lib/config/brand.ts`, `src/lib/config/template.ts`, `src/lib/data/`, `src/lib/styles/tokens.css`, `static/`. Reuse actual components and data boundaries. Preserve the existing route and interaction contracts.

Check the changed behavior at relevant mobile/desktop widths and run proportionate existing checks. A full source release needs exact-commit evidence; a local success or prior audit does not prove mounted/public behavior. Forms are demos until real delivery is configured and verified. Do not contact leads.

Commit only reviewed task-owned changes when authorized. Template polish does not authorize dealer deployment. Report changed paths/commit, actual checks, preserved work and remaining limits. Workflow command/compatibility changes update their authoritative references and relevant tests together.

## Main is the working branch

The owner chose a main-only workflow on 13 September 2026. Use the saved checkout on `main` for routine work. Do not create another branch or worktree unless the owner explicitly requests one. Independent tasks may edit disjoint files in the same checkout. Coordinate overlapping files and serialize shared Git/index, configuration and build-output writes; continue unrelated work without waiting for acknowledgements. Inspect the relevant dirty state before editing and preserve other tasks' work. Fetch and review ancestry before integration/publication; commit and push when included in the authorized task.

An explicitly requested temporary branch/worktree must be integrated, verified and removed before the task is called complete. If blocked, record its exact repository, ref, commit, paths and next action in the handoff. Do not leave unfinished source discoverable only through a task title or old branch. Source consolidation preserves work; template release, owner visual acceptance and dealer deployment keep their separate checks.
