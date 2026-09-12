# ЕВРОКАР ВАРНА 09 — source review

After fetching codex/astra-bg-03 into the coordinator's chosen review checkout:

```powershell
./scripts/start-client.ps1 -Client evrocar-varna-09 -Prepare
./scripts/start-client.ps1 -Client evrocar-varna-09
```

Expected, not exercised here: Auto Best http://127.0.0.1:6631/ ; Modern http://127.0.0.1:6632/cars ; Carwow http://127.0.0.1:6633/ . First detail: /listing-detail-v1/1, /bg/listing/chevrolet-spark-2011, /inventory/chevrolet-spark-2011 respectively.

Auto Best: Node22, npm ci, npm run validate. Modern: Node >=22.22 <23, pnpm11.4, frozen install, pnpm --filter @repo/database build, pnpm --filter web typecheck and configured web build. Carwow: Node24, npm ci, npm run check, npm run build. Retained TEMPLATE.md files supply original environment instructions. No runtime commands ran in this cloud session. QA flags and owner review remain pending. Real galleries and a complete supporting-page sweep are still missing. No deployment, public-origin mounting, FAB or external messages.
