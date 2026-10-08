# App import validation — 26 September 2026

## Scope

Faithful local working copy and Cars candidate registration. No client personalization, approved release, public deployment or UI redesign. Original `L:/cars-app` source and port 4173 preview are preserved.

## Evidence

- Node runtime: 22.23.2.
- Retained dependency lock installed with `npm ci --no-audit --no-fund` (403 packages).
- Copy: all 3,371 selected files verified by SHA-256, with a second source stability check. See `.template/source-manifest.json`.
- `node scripts/check-workflow.mjs`: passed from Cars root.
- `node --test scripts/*.test.mjs`: 214 passed, zero failed. Log: Cars `runtime/app-import-workflow-tests.log`.
- `npm run check`: passed in the new folder (ESLint, `tsc --noEmit`, and Next.js webpack production build; 205 static pages generated). Log: Cars `runtime/app-import-check.log`.
- Dev preview: `http://127.0.0.1:6473`, Next.js process PID 28596, started from `templates/app` using Node 22.23.2. Process/log details: Cars `runtime/app-6473-dev.json` and matching dev logs.
- Browser: homepage visually inspected at 320x812, 390x844 and 1440x900; inventory at 390x844. Meaningful content rendered, no captured browser errors; sampled homepage/inventory DOM checks found no broken loaded images or page-wide horizontal overflow. Initial cold dev compilation required a navigation retry.
- Screenshots: Cars `runtime/app-import-320.png`, `app-import-390.png`, `app-import-1440.png`, `app-import-inventory.png`.
- Visual limits retained from source: cramped service labels at 320px, login overlay over mobile content, large desktop service tiles and promotional artwork. These are future polish work, not accepted as a finished client design. Deep transaction flows were not revalidated for this import.
- Next dev appended its standard `nextjs-agent-rules` block to the new template's AGENTS.md while preserving the Cars-specific instructions. Application code and lockfile remain unchanged.

## Git handoff

Repository: `L:/CODEX/cars`, remote `https://github.com/darkapoparka/cars.git`, branch `main`, current HEAD `31aab0f8a493e48055252ce2464597fb8b2ae55d`. Fetched main was 28 commits ahead at `a67b1939e`.

The non-force fast-forward attempt stopped on the pre-existing `.git/index.lock` (zero bytes, last modified 26 September at 21:30:26 local time). The lock was left untouched. Nine unrelated paths were already staged and extensive other local work exists. No task source was committed or pushed.

Task-owned paths: new `templates/app/` and only the added App entry in `catalog.json`. The catalog root-path change from J: to L: predates this task and must be preserved separately. Runtime scripts/logs and local reference captures are ignored.

Next Git action: resolve the existing index lock with its owning workflow, reconcile the pre-existing Cars changes against fetched main, then scope-stage only the App import and its catalog entry, verify and commit/push non-force on main. Do not reset, clean, blanket-stage, or commit other staged work as part of this import. Candidate release approval and dealer delivery remain separate follow-up work.
