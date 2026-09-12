# Bulgaria session 07 — branch handoff

Date: **2026-09-09**. Branch: **`codex/astra-bg-07`**. Overall outcome: **blocked; 0 of 15 requested applications implemented**. Four client research checkpoints were committed. A fifth client checkpoint write was rejected. This report is not a substitute for the requested applications, and this branch is **not ready for application review or publication**.

## Authority and exact baseline

The owner's attached “GPT Pro session 07: Sofia: first group” packet governs these five accounts, branch-only delivery and physical isolation. No replacement dealers were selected. Historical shared-astra allocations and automatic deployment instructions were not used.

The assigned branch was created from the current published main at **`faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`**, root tree `d674ef10a5d21d492e46c264640920944542b32a`. The old astra branch was read at `bcff94eabfba2b3c604bb61d6ea916584e61e4d5` for duplicate context only. The client's explicit branch scope overrides the repository's later shared-main working-directory instructions.

Read: `AGENTS.md`, `catalog.json`, `docs/WORKFLOW.md`, `docs/LEAD-BUILD-GUARDRAILS.md`, `docs/LEAD-PUBLISHING.md`, `docs/PROJECTS.md`, all three selected `TEMPLATE.md` files, Sofia profiles/screening, account-links, `clients/index.json`, and `scripts/copy-source.mjs`.

### Published masters inspected — none copied

| Master | Published version | Source tree at the base commit |
| --- | --- | --- |
| Auto Best | `2026.09.08-polish-1` | `97833980ab127f6de8f675ac1a188e4b7f717976` |
| Modern | `2026.09.06-refresh-1` | `66bfb8196bbce18832ada6b34b02dda97baba25b` |
| Carwow | `2026.09.08-repair-1` | `d4a08817e87cf84d08c4db1c08a515937245f2dd` |

The source-tree IDs are intended lineage, **not evidence of any client copy**. No source-manifest, application metadata or inherited pass flags were manufactured.

## Five outcomes

| Assigned dealer and source | Outcome / implemented apps | Committed result | Exact outstanding gate |
| --- | --- | --- | --- |
| [VALENTINO AUTO HOUSE](https://valentinoauto.mobile.bg/) | blocked / 0 of 3 | `clients/valentino-auto-house/CLIENT.md`, commit `f44d713f7f9a431346e18f24e362cad503932648` | Eight source references and visual branding/photo observations recorded; no applicable media-reuse authorization established and direct source-file downloads failed. No integrated logo or local photo pack. |
| [TROYA AUTO](https://troya-auto.mobile.bg/) | blocked / 0 of 3 | **No client file committed.** Its checkpoint write was rejected. | Visual cover verification and accessible permitted media remain unresolved; sampled detail retrieval was incomplete. The rejected write produced no commit and is not represented as preserved client content. |
| [ФАДИ КАРС](https://fadicars.mobile.bg/) | blocked / 0 of 3 | `clients/fadi-cars/CLIENT.md`, commit `86c178d7f406c9115dd59e29e80e26e812c1d40c` | Three primary details and a visible dealer plate recorded; standalone brand asset, complete representative sample and accessible permitted photo pack remain incomplete. Direct photo download failed. |
| [В.В.Ц - АУТО](https://vvc-auto.mobile.bg/) | blocked / 0 of 3 | `clients/vvc-auto/CLIENT.md`, commit `b9cc3a649894f8858473be623dbb494f13b89f0e` | Partial sample only; address discrepancy, reserved/sold and parts exclusions recorded. Cover/photo retrieval failed; no complete permitted local assets. |
| [МАВЕРИК](https://maverik.mobile.bg/) | blocked / 0 of 3 | `clients/maverik-sofia/CLIENT.md`, commit `f5a044321fbf429b4a4436b9bfd58e6cb5a8f536` | Four listing references, a viewed Mazda photo, and location/status distinctions recorded. Cover failed visual retrieval; direct photo download failed; no complete permitted local pack. |

Every successful `CLIENT.md` records the observation date, primary URLs, fact uncertainty, asset-reference URLs, and exact resume point. Representative references in Markdown are **not application data**. No verified available-stock total, dealership approval, private contact history or final brand acceptance is claimed.

The essential media gate is missing applicable authorization/provenance plus accessible original files. It is not a statement that writing dealer websites is prohibited, or a determination that all possible uses of public photos are unlawful. The packet explicitly requires permitted local media and directs blocked accounts to be recorded rather than substituted. No source permissions were invented to clear that gate.

## Duplicate checks and preservation

Actual main/old-astra client directory trees and the main client index were inspected; none of these five application folders existed at those recorded baselines. The assigned branch's four additions were subsequently compared against its base. Account-link/screening context was read, including the historical Valentino reservation. GitHub indexed code search returned no matches even for a known research term, so it was not accepted as exhaustive alias proof. Other workers' unpublished files/branches and private CRM records were not fully inspected; do not read this as proof that no off-branch duplicate exists.

No master, existing dealer application, shared launcher, `catalog.json`, `clients/index.json`, root instruction, global lead data or other session report was changed. No Windows connector, `J:/cars` shell, alternate local drive, worktree, deployment, Vercel project, new dealer repository, CRM, enquiry form or outreach action was used.

## Executed capabilities and failures

| Operation | Environment / actual result | Exit or evidence limit |
| --- | --- | --- |
| `node --version`; `npm --version` | Isolated Linux tool shell: `v22.16.0`, `10.9.2` | Runtime probe only; not an application command |
| `command -v pnpm` | No executable found | Exact shell exit was not separately retained |
| `git ls-remote https://github.com/darkapoparka/cars.git refs/heads/main` | Isolated shell: `Could not resolve host: github.com` | No checkout obtained; the command was piped during probing, so no standalone Git exit is asserted |
| `getent hosts github.com` and image-host lookups | No addresses returned | Network diagnostic, not framework verification |
| Direct source-logo/photo downloads | Isolated-cloud download tool failed for tested Valentino, Troya, Fadi and Maverik files | API error, not a successful saved file; source URLs are in the corresponding notes where committed |
| GitHub branch creation and contents writes | Branch creation and four distinct client-file commits succeeded | Writable connector confirmed; a shell DNS failure does **not** mean GitHub is read-only |
| Troya `create_file` attempt | Connector rejected the write; no commit returned | Tool message: “This tool call was blocked by OpenAI because we couldn't determine the safety status of the request.” The ref readback remained `f44d713f7f9a431346e18f24e362cad503932648`; no alternate operation was used to bypass that rejection |
| Branch ref readbacks | Each successful checkpoint was read back on `codex/astra-bg-07` | Remote published commit evidence, not application completion |
| Base-to-checkpoint compare | `faf76e81...` to `f5a04432...`: ahead by 4, behind by 0; exactly four added `CLIENT.md` files, zero deletions | Confirms no application or asset changes at that checkpoint |
| Client-file readback | First twelve UTF-8 lines and current blob SHAs of all four added files were fetched at `f5a04432...` | Header/status readback, not a full application audit |

Readback blob SHAs: Valentino `197797df4a92500b633a3a7ff271a9847260ade8`; Fadi `235c90472527ed596a5c65a58a256660f69f2cc3`; VVC `325f65e54ef288c34b7632a733ca16d21eeca16c`; Maverik `e06f7be460f0d111695f604ae04cef600c4063be`.

The report's own resulting commit is necessarily returned after this file is written. The final chat handoff will give that exact SHA and the final base-to-head comparison; this document does not guess its own commit ID.

## Checks not run — applies to all fifteen applications

No `new-client` dry run/copy, retained-tree replication, dependency install, Svelte check, production build, Modern Prisma generation/typecheck, browser launch, route verification, interaction test, console/image audit, visual comparison or screenshot capture was performed. No image-generation call occurred. No locally saved/generated asset or integrated favicon exists. There are no client dev-server processes from this task.

| Requested design | Required checks still outstanding | Entry and visual evidence |
| --- | --- | --- |
| Auto Best, all five dealers | Retained lockfile install; `npm run validate`; real browser/interaction review | Intended `/` only. No verified entry, screenshot or pass at 320/390/1440 px |
| Modern, all five dealers | Full-workspace copy; documented Node/pnpm; frozen install; local database-package build; web typecheck/build in static demo mode | Intended `/cars` only. No verified entry, screenshot or pass at 320/390/1440 px |
| Carwow, all five dealers | Retained lockfile install; actual package runtime; `npm run check` and `npm run build`; real browser review | Intended `/` only. No verified entry, screenshot or pass at 320/390/1440 px |

No `REVIEW.md`, per-variant `.client/project.json`, application-folder link or localhost URL is supplied for nonexistent applications. The shared-origin mounting/FAB is not implemented or tested. There is no public preview and no owner manual-review completion.

## Coordinator handoff

There is **no first finished dealer to launch**. Fetch and inspect the research-only branch without switching or overwriting the coordinator's checkout:

```powershell
git -C J:/cars fetch origin codex/astra-bg-07
git -C J:/cars diff --stat faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca origin/codex/astra-bg-07
git -C J:/cars show origin/codex/astra-bg-07:docs/lead-build/bulgaria-2026-09-09/reports/session-07/REPORT.md
```

These are instructions for the local coordinator, **not commands executed by this session**. Do not treat this branch as fifteen completed projects or merge it under that description.

Exact implementation resume point: before copying any master, establish applicable media authorization/provenance and accessible original image files; reconcile the recorded identity/status conflicts and complete the representative whole-car sample; then perform the full three-design Fast Skin and required tests in an authorized isolated runner. All fifteen application builds remain outstanding. No unattended process will continue this work.
