# Bulgaria session 06 — blocked handoff, not application delivery

**Applications implemented: 0 of 15. Finished dealer trios: 0 of 5.** This branch contains source records and blocked checkpoints, not the requested runnable demos. None is marked implemented-unverified, verified-local or owner-reviewed.

Repository: `darkapoparka/cars`. Assigned branch: `codex/astra-bg-06`. Observation date: 2026-09-09. Actual published base: `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`; base root tree: `d674ef10a5d21d492e46c264640920944542b32a`. The branch was created from that observed main, not from the coordinator's uncommitted files. Main was read back at the same SHA during the closing qualification review.

## Five outcomes

| Client | Outcome | Implemented apps | Qualification checkpoint | Exact remaining gate |
| --- | --- | --- | --- | --- |
| GoldenDreams AUTO | blocked | 0/3 | `3dcde3b24039e5bce8faa1d111cd28f24c8a52a3` | Current showroom, canonical contacts and current whole-car stock unresolved; legacy artwork inspected but current provenance/approval unresolved |
| G Auto, Blagoevgrad | blocked | 0/3 | `dbbea25987c43a1886986ac956b0c09fa6c571fb` | No established reuse scope covering dealer-specific current stock photos; generic AutoDeal media approval is a different scope |
| Крис Кар, Plovdiv | blocked | 0/3 | `a41c5c43c1022ca63e97811f118623886efbb4e2` | No viewable, permission-backed artwork/vehicle gallery set established; source warranty claims remain unverified |
| Slavi Cars, Dupnitsa | blocked | 0/3 | `b807587d35c6a963983146a9f94034f9fe84ab96` | Current photos and signage subsequently viewed, but applicable reuse scope unresolved; source hours conflict |
| FRESH MOTORS, Sheremetya | blocked | 0/3 | `804bb08035991f7cf415f3c78fcab749eb9b5172` | Dated individual Ioniq and photograph inspected; dealer-stock photo reuse scope unresolved |

The closing report commit supplements these checkpoints with corrected G Auto/Slavi visual observations and the missing GoldenDreams REVIEW. Each current client directory contains CLIENT.md, REVIEW.md and sources.json. These are the only client outputs; no app folder, .client/project.json, generated asset or gallery has been fabricated. The candidate records are not complete shared 8–12-car inventories and are not consumed by any application.

## Source and visual evidence

Each client's sources.json contains canonical URLs, individual/candidate URLs, observation dates, evidence levels, price/tax/availability qualifications, failed access attempts and exact image references. Read those current files together with the per-client report; earlier checkpoint prose describes the evidence available at that checkpoint.

Follow-up read-only URL rendering succeeded for G Auto's black C200 cabriolet and Slavi's white Chevrolet/dark Porsche photographs. Actual G-AUTO building lettering and burgundy Slavi Cars signage were inspected. FRESH MOTORS' white Ioniq/plate-frame photograph also rendered. This supersedes the initial G/Slavi web-image Cache-miss finding as a complete description of access. The `.pic` covers still failed visual rendering; binary text is not an inspection. No tool output established permission to copy the current stock photographs into the demos.

G Auto's legacy SOURCE_LICENSE.md and ASSET_PROVENANCE.md were read again: they name the AutoDeal reference and enumerate generic static/assets media. That approval was not expanded to unrelated live dealer galleries. Existing rights outside the records inspected may exist. No broad legal conclusion about the owner's rights is made. Legacy GoldenDreams v2 and G Auto v1 logos were visually inspected, not modified. No image-generation call was made.

Slavi has an independent website and is an alternative-demo prospect. FRESH MOTORS' showroom remains Sheremetya, not the directory's Veliko Tarnovo Centre label. No available-stock total, unconditional credit approval, battery condition, customer review, staff profile, founding date, successful enquiry delivery or live feed has been invented.

## Read-only source lineage — nothing copied

The following published template versions/trees were inspected but **not copied** into client applications:

| Master | Published version | Tree |
| --- | --- | --- |
| Auto Best | `2026.09.08-polish-1` | `97833980ab127f6de8f675ac1a188e4b7f717976` |
| Modern, full workspace | `2026.09.06-refresh-1` | `66bfb8196bbce18832ada6b34b02dda97baba25b` |
| Carwow | `2026.09.08-repair-1` | `d4a08817e87cf84d08c4db1c08a515937245f2dd` |

Read AGENTS.md, catalog.json, WORKFLOW, LEAD-BUILD-GUARDRAILS, LEAD-PUBLISHING, PROJECTS, the three TEMPLATE.md files, client index and relevant Bulgaria screening/account-link/profile records. The explicit owner branch-only allocation superseded historical shared-astra/worktree/publishing instructions. Because qualification did not advance to cloning, scripts/new-client.mjs was not executed and its exclusion logic was not reproduced as a fabricated app.

Duplicate review covered inspected main/index/project records, the old astra client tree `42eab9a0c2222ed95df3f6e98a7b1a38d625ced6`, assigned-branch history and the read-only M: automotive directory listing. No requested trio was found there. Default-branch searches returned no matches even for known research rows; they are not exhaustive all-branch/current-worker proof. No collision was observed in the inspected records, and no occupied application was changed.

## What was actually verified

GitHub create_branch, create_tree, create_commit and non-force update_ref succeeded. Each published checkpoint was read back from the remote branch. The five source JSON files were fetched as actual UTF-8 content at immutable checkpoint SHAs. Comparison of base through `804bb08035991f7cf415f3c78fcab749eb9b5172` returned ahead=5, behind=0 and exactly 19 added text records, all inside the allowed dealer/report paths; no existing-base file was changed or deleted. Closing-source readback/final compare results are supplied with the final handoff, not claimed as application QA.

Cloud capability observations: default Node v22.16.0 and git present. A curl attempt to raw.githubusercontent.com reported DNS error 6; because it was piped to head, its pipeline exit is not asserted as curl's exit. A cloud cover download also failed. These are not evidence that GitHub writes are unavailable. Read-only Desktop Commander local/URL image reads succeeded as described above. No Windows shell/process, checkout, worktree, local clone or server was started. No shared J: or legacy M: file was written.

## Checks not run — all 15 requested apps

| Check | Actual result |
| --- | --- |
| Dependency/retained-lockfile installation | Not run; no application trees |
| Auto Best npm run validate | Not run; no applications |
| Modern database-package generation/build and web typecheck/build | Not run; no applications; no live database/migration used |
| Carwow npm run check and npm run build | Not run; no applications |
| Entry/inventory/real detail/gallery/contact/supporting routes | Not run |
| Search/filter/reset, back state, menu/focus, enquiry destination | Not run |
| Master/client 390 px and 1440 px comparisons | Not run; no screenshots |
| 320 px header/logo, console, images, overflow | Not run |
| Public-origin mounting, design FAB, deployment | Not implemented, not tested |

No install/start URL is claimed for nonexistent applications. No private CRM/correspondence was read, dealer contacted, external form submitted, secret copied, deployment started or shared source modified. There are no background processes or untracked application working paths to coordinate.

## Coordinator handoff

There is **no first finished dealer to launch**. Fetch and inspect this as a blocked qualification branch, not a completed build batch. Do not run scripts/start-client.ps1 for these clients yet. From the coordinator checkout, these commands fetch without switching its branch:

```powershell
git -C J:/cars fetch origin refs/heads/codex/astra-bg-06:refs/remotes/origin/codex/astra-bg-06
git -C J:/cars diff --stat faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca origin/codex/astra-bg-06
git -C J:/cars show origin/codex/astra-bg-06:docs/lead-build/bulgaria-2026-09-09/reports/session-06/README.md
```

The next actionable input is an applicable dealer-photo/artwork reuse record or permitted supplied gallery set; GoldenDreams additionally needs current showroom/contact/stock evidence. After qualification, resume from the current owned client briefs, inspect the actual new-client exclusion logic, retain all three full masters and execute the still-unperformed implementation and QA. No shared fix is proposed by this research-only checkpoint.
