> This multi-session campaign is closed. All recovered applications now live in `J:/cars/clients` on `main`. The prompts and reports below are retained as history; use [Cars projects](../PROJECTS.md) for current work. Do not create session worktrees or publish new work to astra.

# Ten-session lead implementation batch

Batch ID: `lead-build-2026-09-08`. This is the owner's requested implementation campaign, not a deployment/outreach campaign. It applies the [guardrails](../LEAD-BUILD-GUARDRAILS.md) to a fixed, auditable queue.

## Coverage and authorization

The inspected research branch `leads/international-shortlist-2026-09-08` at `25b5dc4acefc29dc7df968edfde371ff9240835b` contains **40 records: 10 existing Varna accounts and 30 additional candidates**. [Source snapshots](source/README.md) retain the four original JSON blobs unchanged. Both `main` at `6998a7ce8092b99422cdb9cccc0b18449ff2f541` and `astra` at `e12a37997e09fbcacce5d0a19350880d67b174bb` were inspected for client directory ownership when these assignments were prepared. This is a planning snapshot, not fresh dealer qualification or an application QA claim.

Ten sessions each own exactly **three candidate records**, built one dealer at a time with `auto-best`, `modern` and `carwow`: at most **30 new dealer sets / 90 new applications**, not ten randomly selected leads or 120 duplicate applications. Each session also has one existing Varna account for **read-only reuse inspection**. Never count its directory as newly built or verified merely because it exists.

The current owner request and pasted session prompt authorize implementation of assigned candidates after current identity/catalogue/asset checks. Historical `buildApproved: false` fields describe the research batch; they are not a request for another routine name approval. Do not rewrite those historical defaults or create public sales statuses. This authorization does not permit outreach, deployment, private record changes or unauthorized media reuse.

Four candidates had reserve caveats (Al Hamoor Al Thahabi, Car Finder 360, Keen Auto Mall, Midlands Trade Centre). They are assigned, not silently discarded. Recheck the recorded caveats; build when current facts and template fit support it, documenting any justified departure from the historical 30-ad size screen. Otherwise record an evidence-backed blocker. Do not automatically call them qualified, invent a replacement from someone else's allocation or count a blocked lead as built.

'All leads' here means every record in this frozen 40-record batch is accounted for. It does not mean every possible dealership in every country, that all 40 are freshly qualified, or that pre-existing projects have passed current QA. Navara, ELIQ, Day & Night and both ASKO spellings are protected existing work outside this candidate allocation. The successful Navara logo patch is not certification that its broader apps are complete.

## Fixed ownership

[assignments.json](assignments.json) owns the partition. [prompts/](prompts/) contains ten individually pasteable task prompts. No worker edits the manifest, source snapshots, guardrails, masters or another worker's report. Candidate IDs remain stable; proposed slugs must be checked against BOTH live branches and public alias/contact evidence before creating directories.

Sessions may run in parallel with distinct checkouts/worktrees or via GitHub. Use only the assigned new client paths plus `docs/lead-build/reports/session-XX.json`. An existing account's listed path is read-only. If a proposed slug collides with a different business, record a stable disambiguated slug in the session report before creating it; if it matches the same business, reuse-inspect instead of duplicating. Never rename an occupied folder to make room.

Do not launch two workers for the same session ID at once. Rerunning the same prompt after a worker stops resumes its recorded partial work; it does not generate the applications again or pick three new leads. Unavailable or conflicting ownership is a blocker, not permission to overwrite.

## Per-dealer execution contract

1. Load your assignment and prior report. Read root `AGENTS.md`, `docs/WORKFLOW.md`, the guardrails, `catalog.json`, all three masters' `TEMPLATE.md` and the corresponding source record including its file-level defaults. Check live branch heads and both client trees; identity-match public names, domains, profiles and phones. Do not rely on default-branch code search for `astra` coverage.
2. Revalidate business identity, location, services, relevant stock and opportunity. Visually inspect branding; build one coherent fact/asset pack and approximately 8–12 listing samples with observation dates. Resolve market language/currency/units and essential asset access before calling this a viable build. Published business channels are not permission to send messages.
3. Copy real masters with the helper or equivalent filtered Git trees. Preserve the full Modern workspace. Record exact source lineage and fresh, false QA flags. An early actual-copy commit plus an in-progress session report can record ownership, but does not count as completed personalization. Do not stop after reserving a lead.
4. Personalize all actual consumers and retained routes; integrate the same professional logo family, local permitted photos, inventory and facts into every variant. Complete the full inherited-identity sweep. Keep honest demo integrations. Do not generate an image in chat and stop: save, integrate, check and commit its bytes.
5. Run supported checks and resolve repairable errors. Add the handoff and truthful per-variant metadata. Finish and commit this dealer before opening another assigned build, unless an evidenced external blocker prevents completion. Continue with the remaining assigned records rather than fabricating results or asking for routine approval.
6. Read back remote `astra`, confirm the final paths/commit, and update only your report. At the end, all three candidate IDs must have an explicit outcome, plus the reuse inspection. Do not delegate branding, inventory collection or content cleanup to the owner's local preview agent.

## Fresh-head publishing — no lost updates

GitHub API workflow:

- Read `refs/heads/astra` and the corresponding COMMIT to get its actual root TREE SHA. Keep commit IDs and tree IDs distinct.
- Inspect the intended paths on that head. Construct a tree based on that CURRENT root tree, applying only your allowlisted file changes. Reused asset blobs must exist in this repository and contain the intended bytes.
- Create a commit whose parent is that head. Before updating the ref, compare the commit to its parent and inspect every changed path.
- Update `astra` without force. If the head moved / update is non-fast-forward, read the new head, inspect conflicting paths and reapply ONLY your owned delta onto the new root tree. Create a new commit with the new parent. Never retry by forcing or attaching your old full tree to a newer parent: that can erase other workers' files even with a fast-forward commit.
- On a same-path conflict not clearly owned by this session, preserve the other work and report it. After success, read the ref back; verify your commit is reachable if another worker has already advanced the head. A blob/tree/commit creation response alone is not publication.

Local Git workflow: inspect dirty work and remote identity first. Use an isolated worktree/local branch when necessary, not the same working directory as another session. Fetch current `origin/astra`, reconcile only your commits with new remote work, and push the completed owned delta to `astra` without force. Do not reset/clean/stash someone else's work, blindly merge into the current branch or create a remote branch instead of delivering the requested `astra` update. Do not merge into `main`.

## Session report and completion accounting

Create `docs/lead-build/reports/session-XX.json` with `schemaVersion: 1`, `batchId`, `sessionId`, `updatedAt` and one `candidates` entry per assigned ID. Entries record `leadId`, actual `clientPath`, `state`, implementation `commitShas`, public evidence paths, `variants` and `blockers`. Each variant has `implemented`, `committed`, `checksPassed`, `checksNotRun` and `knownLimitations`. Evidence may use a reachable earlier implementation commit; do not fabricate the current report commit's SHA inside itself.

Use candidate states `pending`, `in-progress`, `implemented-unverified`, `verified-local`, `blocked`, or `existing-reuse`. `verified-local` requires actual full app evidence for all three variants. An isolated logo render cannot produce that state. A report initialized by a worker does not grant a sales status or retroactively approve media rights.

The `reuseInspection` records the assigned existing lead ID/path, variants actually found, inspected metadata/commit, actual checks and outstanding technical gaps. Read only; do not recreate, repair or upgrade the existing apps under this allocation. Record `needs-owner-scoped-repair` when appropriate rather than silently including unrelated fixes. Existing work may require a separate, explicitly scoped repair task before it can be called complete.

Reports contain technical/public-source facts only. No contact history, private email, prices for the sales engagement, prospect rejection notes, personal credentials or CRM exports. An unresolved private-history check does not prevent an authorized local concept build and does not authorize outreach.

Batch completion means **30 candidate outcomes + 10 reuse outcomes**, with counts of actually implemented and verified applications. Pending/blocked items must remain visible. New research after this snapshot belongs in a new coordinator-issued batch; workers must not repartition a running queue.

## Local handoff

Retained manifests and selected `TEMPLATE.md` files are authoritative for runtimes and commands. Do not guess one Node version for every app. At this inspected baseline Auto Best and Modern use Node 22, Modern pins pnpm 11.4.0, and Carwow uses Node 24; reread current manifests before installation. Keep original lockfiles. Use the repository preview launcher where appropriate and generate Modern's local Prisma client if required without database migrations.

The assignment's proposed port triples are unique across the batch but still require local availability/ownership checks. Never kill unrelated processes. Give the local agent commands to fetch/pull safely, install retained dependencies and start existing applications, not a script to create them. Distinguish process launch from browser acceptance.

Every session's final response must give the selected/blocked/existing outcomes, duplicate-check evidence, reachable `astra` commit(s), links to the three app folders for each actual build, implemented changes, checks passed/not run, remaining limitations and a short local pull/start/inspect prompt. No deployment or dealer contact.

## Session map

| Session | Three candidate builds | Existing read-only inspection | Proposed port range |
| --- | --- | --- | --- |
| [01](prompts/session-01.md) | VALENTINO AUTO HOUSE; Success Automobile; VOIVODOV AUTO & ANTONIO | Excellent Cars | 7401–7409 |
| [02](prompts/session-02.md) | K-G Team Auto; icars; FIVE AUTO | AVANGARD AUTO | 7411–7419 |
| [03](prompts/session-03.md) | MG7 Group; Al Aayan Used Cars; Al Fareed Used Cars | Champion Auto Pro | 7421–7429 |
| [04](prompts/session-04.md) | Al Basma Motors; The Dealers Point; F1rst Motors | Астракар | 7431–7439 |
| [05](prompts/session-05.md) | Texas Drive Auto; CFO Auto Group; Neuhoff Auto Sales | Аутолайф | 7441–7449 |
| [06](prompts/session-06.md) | AMT AUTO SALES LLC; Depue Auto Sales Inc; MY CAR OUTLET | Автокъща Приселци | 7451–7459 |
| [07](prompts/session-07.md) | Good Wheels Auto Sales, Inc; Sevierville Import & Truck Center; Nicky D's | Иво Ауто | 7461–7469 |
| [08](prompts/session-08.md) | AMH Cars Bhm Ltd; Heartlands Motor Group; Autohandel Winter | Аутомаркет Варна | 7471–7479 |
| [09](prompts/session-09.md) | Autobedrijf Spinder; Autobedrijf Wester; Car Finder 360 | ELIT AUTO IMPORT EXPORT | 7481–7489 |
| [10](prompts/session-10.md) | Al Hamoor Al Thahabi Used Cars; Keen Auto Mall; Midlands Trade Centre Limited | LEGEND AUTO | 7491–7499 |
