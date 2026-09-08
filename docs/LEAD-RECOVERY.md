# Lead consolidation — 9 September 2026

The owner replaced the earlier completion task with consolidation: bring all existing projects and lead research into J:/cars and the main Cars repository, remove redundant working copies, then review each dealer together. Application completion is paused. No recovered demo was deployed and no outreach or CRM writes were performed.

## Canonical sources

Every active dealer project is under `J:/cars/clients/<slug>`. The [project inventory](PROJECTS.md) lists actual applications, research-only folders and assigned candidates never created. Auto Best, Modern and Carwow remain independent applications inside each dealer's folder. `scripts/start-client.ps1` prepares and launches one dealer's existing designs for review.

| Recovered dealer | Preserved checkpoint | State carried into main |
| --- | --- | --- |
| Navara Car | `4fb4aa58` | Three apps, local source media and partial corrections; full acceptance pending |
| ELIQ AUTO | Original `astra` history | Three first-pass apps; full acceptance pending |
| K-G Team Auto | `43497784` | Latest I: implementation and handoff; unfinished |
| Al Basma Motors | `04c0f1a8` plus newer `astra` handoff | Three unfinished copies, assets and source facts |
| Texas Drive Auto | `d9c086dd` | Final detached-script output preserved across all three apps; unfinished |
| Al Hamoor Al Thahabi | `6b0dd1f9` | Three copies, source facts and downloaded assets; unfinished |

The main history includes the complete astra branch, the international research branch, and local recovery snapshots. Earlier K-G snapshots (`76d711ab`, `42831a16`) and the initial Texas snapshot (`5d763ac5`) are retained in merge history while their newer working versions are used. The older Al Basma handoff remains in its checkpoint; main retains the later remote interruption report.

## Local preservation evidence

`runtime/consolidation-2026-09-09/` is ignored local recovery storage. It contains source hashes, before/after checks, snapshot identities, archived logs, environment files and research tools. These archives are not active workspaces and must not be published. Most duplicate worktree files and generated dependencies were removed. Residual Navara files were moved into this archive after a browser-test process blocked removal. All remaining source is also recoverable from Git history.

The root preservation check verified 883 pre-existing files unchanged, excluding the explicitly updated AGENTS.md. Existing dirty template and Excellent Cars application edits were retained in the working tree, outside the consolidation commits. Existing manual-review notes were preserved. Newer K-G and Texas output produced by already-running Web scripts was checkpointed again before final cleanup.

The prior session prompts, assignments and reports are historical evidence. Their separate-checkout and publish-to-astra directions no longer apply. Continue work only in J:/cars on main, preserving unrelated dirty changes.

## Review boundary

Consolidation establishes source location and recoverability. It does not certify these dealers' branding, every page, stock, legal copy, enquiry delivery, deployment or three-design public switcher. Review each actual app with the owner before completing or publishing that dealer. Navara's canonical-folder launcher is the first local startup check; its previous route evidence remains archived, with known incomplete content and flow checks.
