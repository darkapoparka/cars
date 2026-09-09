# Спринт ауто — source review

After fetching codex/astra-bg-03 into the coordinator's chosen review checkout:

```powershell
./scripts/start-client.ps1 -Client sprint-auto-varna -Prepare
./scripts/start-client.ps1 -Client sprint-auto-varna
```

Expected entries, not exercised in this cloud session: Auto Best http://127.0.0.1:6631/ ; Modern http://127.0.0.1:6632/cars ; Carwow http://127.0.0.1:6633/ . First detail: /listing-detail-v1/1, /bg/listing/toyota-rav4-2017 and /inventory/toyota-rav4-2017 respectively.

Retained checks: Auto Best Node22, npm ci, npm run validate. Modern Node >=22.22 <23, pnpm11.4, pnpm install --frozen-lockfile, pnpm --filter @repo/database build, pnpm --filter web typecheck and configured web build. Carwow Node24, npm ci, npm run check, npm run build. Each TEMPLATE.md retains its environment guidance. No runtime commands or browser checks ran here; QA flags remain false and owner review pending.

Real galleries and the complete supporting/legacy content sweep remain unfinished. No deployment, shared-origin mounting, design FAB or externally delivered enquiries have been added.
