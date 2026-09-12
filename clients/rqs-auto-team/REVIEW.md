# R.Q.S. — local source review

All three app folders contain actual independent source. Status is in-progress; see CLIENT.md for missing media and remaining supporting-copy work.

From the coordinator's chosen review checkout after fetching codex/astra-bg-03:

```powershell
./scripts/start-client.ps1 -Client rqs-auto-team -Prepare
./scripts/start-client.ps1 -Client rqs-auto-team
```

Expected entries, not runtime-verified here: Auto Best http://127.0.0.1:6631/ ; Modern http://127.0.0.1:6632/cars ; Carwow http://127.0.0.1:6633/ . Review the Toyota Auris first: Auto Best /listing-detail-v1/1, Modern /bg/listing/toyota-auris-hybrid-2017, Carwow /inventory/toyota-auris-hybrid-2017.

Retained commands: Auto Best Node22 `npm ci` and `npm run validate`; Modern Node >=22.22 <23, pnpm11.4, `pnpm install --frozen-lockfile`, `pnpm --filter @repo/database build`, `pnpm --filter web typecheck` and configured `pnpm --filter web build`; Carwow Node24 `npm ci`, `npm run check`, `npm run build`. Each TEMPLATE.md retains environment instructions. None ran in this cloud session. All QA flags remain false. No services or messages are configured as delivered, and no shared-origin/FAB or deployment was added.
