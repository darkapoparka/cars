# Европа — local source review

After fetching codex/astra-bg-03 into the coordinator's chosen review checkout:

```powershell
./scripts/start-client.ps1 -Client europa-varna -Prepare
./scripts/start-client.ps1 -Client europa-varna
```

Expected entries, not executed here: Auto Best http://127.0.0.1:6631/ ; Modern http://127.0.0.1:6632/cars ; Carwow http://127.0.0.1:6633/ . First detail: /listing-detail-v1/1, /bg/listing/mazda-cx3-2019 and /inventory/mazda-cx3-2019 respectively.

Retained checks: Auto Best Node22, npm ci and npm run validate. Modern Node >=22.22 <23, pnpm11.4, frozen install, pnpm --filter @repo/database build, pnpm --filter web typecheck and configured web build. Carwow Node24, npm ci, npm run check and npm run build. Each retained TEMPLATE.md contains the relevant environment guidance. None ran in this cloud session. QA flags remain false and owner review pending.

Real galleries and complete supporting/legacy copy are still missing. Shared-origin mounting and design FAB are intentionally left to the coordinator's later publishing phase. No deployment or external messages.
