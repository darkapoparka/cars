# ELIQ AUTO Import — Batch Execution and QA Contract

## Absolute execution rule

Root `tasks.md` is the only implementation authorization.

- Execute only the ACTIVE BATCH or task IDs explicitly named by the owner.
- Maximum normal batch: 1–5 tasks.
- Do not touch future tasks, perform general cleanup, or refactor “for later”.
- Stop after the selected batch. Do not automatically activate the next batch.
- Mark tasks `READY FOR OWNER REVIEW`; only the owner marks `DONE`.
- Default: commit locally after verification, but do not push unless the current prompt explicitly requests it.

## Required workflow

1. Read all canonical docs and the selected task records.
2. Record current status and preserve pre-existing work.
3. Run the untouched application.
4. Reproduce each selected issue before editing.
5. Capture before screenshots at the exact task viewports.
6. Inspect the named allowed files and ownership boundaries.
7. Implement only the selected tasks.
8. Capture after screenshots and preservation screenshots.
9. Run task-relevant checks plus the stack checks below.
10. Review the diff against each task's file/change budget.
11. Mark selected tasks `READY FOR OWNER REVIEW` and stop.

## Scope firewall

- If a fix needs an unlisted file, stop and report why before editing it.
- If the issue cannot be reproduced, do not “improve” the surface speculatively.
- If the task budget would be exceeded, stop with a proposed split.
- If a selected task reveals another issue, add it to the report; do not implement it unless explicitly selected.
- Do not update unrelated snapshots, format the whole repository, or include generated evidence binaries in the application commit unless the repository convention requires it.

## Evidence matrix

Each selected task report must contain:

- task ID and status;
- exact route and viewport;
- before screenshot path;
- after screenshot path;
- preservation screenshot path(s);
- changed files;
- relevant interaction steps;
- checks run and results;
- known limitation or blocker;
- diff-size note against the task budget.

Evidence should use a clear local folder such as:

`artifacts/final-polish/<batch-id>/<task-id>/`

Do not commit large screenshot sets unless explicitly requested. Report their local paths.

## Baseline viewport set

Use task-specific viewports first. For a broad responsive task, include:

- 320×700
- 360×800
- 390×844
- 430×932
- 768×1024
- 1024×768
- 1280×800
- 1440×900
- 1920×1080

## Interaction checks when relevant

- pointer and keyboard;
- mobile touch emulation;
- Escape/backdrop/close;
- focus entry and restoration;
- body-scroll lock/restoration;
- browser Back/Forward and refresh;
- mobile keyboard and browser-toolbar behavior;
- long Bulgarian content and large BGN prices;
- loading, empty, error, disabled, success, and image-failure states;
- console errors and failed local assets;
- page scroll width versus viewport width.

## Repository checks

- `npm run check`
- `npm run lint`
- `npm run test:unit -- --run`
- `npm run build`
- `npm run test:e2e (when the selected batch changes browser flows and Playwright is available)`

Run the smallest relevant checks during implementation and the required full set for the selected batch before review. A successful build alone does not prove UI quality.

## Version-control rule

Keep one coherent commit per selected batch or per high-risk task. Do not mix docs unrelated to status/evidence, dependency upgrades, backend cleanup, or future-batch preparation.

## Final batch report

Return:

1. Selected batch and task IDs.
2. Status of each task: `READY FOR OWNER REVIEW`, `BLOCKED`, or `N/A — VERIFIED`.
3. Exact files changed.
4. Behavior and visual changes.
5. Checks and results.
6. Evidence locations.
7. Diff-size/budget summary.
8. Any new issue discovered but intentionally not implemented.
9. Commit SHA, and whether it was pushed.

Then stop.
