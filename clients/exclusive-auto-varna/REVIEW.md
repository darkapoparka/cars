# Exclusive Auto branch checkpoint

**Not ready for owner acceptance or publication.** Source exists in all three application folders; the Carwow data connection, Auto Best asset-validator adaptation, final content sweep and runtime review remain unfinished.

## Coordinator fetch — does not switch the shared checkout

```powershell
git fetch origin codex/astra-bg-04
git log --oneline main..FETCH_HEAD
git diff --stat main...FETCH_HEAD -- clients/exclusive-auto-varna docs/lead-build/bulgaria-2026-09-09/reports/session-04
```

Inspect and integrate using the coordinator's normal scoped workflow. Do not reset or overwrite unrelated dirty files. Do not launch Carwow as though it were already personalized.

## Retained install/check commands

| Application folder | Runtime | Commands from that folder | Review entry |
| --- | --- | --- | --- |
| auto-best | Node 22.12+ in Node 22 | npm ci; npm run validate | / |
| modern | Node >=22.22 <23; pnpm 11.4.0 | pnpm install --frozen-lockfile; pnpm --filter @repo/database build; pnpm --filter web typecheck; pnpm --filter web build | /cars |
| carwow | Node 24 per packet; check retained manifest | npm ci; npm run check; npm run build | / |

These commands have **not** been run for this client. The Auto Best retained asset gate needs its client-specific update before validate can pass. Modern's Prisma generation is local only; do not migrate or connect a database.

After the source is integrated and dependencies prepared, use the existing coordinator launcher from J:/cars:

```powershell
./scripts/start-client.ps1 -Client exclusive-auto-varna -Prepare
./scripts/start-client.ps1 -Client exclusive-auto-varna
```

Proposed entries, not running listeners: http://127.0.0.1:6631/ ; http://127.0.0.1:6632/cars ; http://127.0.0.1:6633/ . The launcher must confirm all ports are free. No listeners were started or stopped by this branch task.

## Exact current evidence

- Actual independent Git-tree copies, with fresh lineage metadata and excluded bindings/environment files.
- Eight unique source IDs, positive advertised EUR prices and kilometre values; all sixteen gallery paths have verified uploaded Git blobs.
- In-memory Svelte server compilation, TypeScript transpilation and JSON parsing: 50 changed source files, exit 0. Node 24.18.0; Svelte 5.57.0; TypeScript 5.9.3. This is syntax/compiler evidence, not dependency-resolution typechecking or a full application build. Retained CSS warnings are listed in evidence/source-compilation.json.
- Full check/build commands, browser routes, filters/reset/back state, galleries, enquiry flows, mobile/desktop layout and image rendering remain unexecuted.

Representative implemented-data links after launch: Auto Best /listing-detail-v1/1 ; Modern /bg/listing/toyota-camry-hybrid-680634 . The latter route is a proposed review target, not an observed HTTP/browser result. Carwow still uses the master adapter and must be completed before selecting its review vehicle.

Public-origin mounting and the design FAB are not implemented. No public preview exists. Never submit a real enquiry during review.
