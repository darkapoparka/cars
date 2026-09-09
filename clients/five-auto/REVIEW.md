# FIVE AUTO — review entries

Incomplete source/media checkpoint. Do not treat these as live or accepted demos. After the coordinator has completed the recorded content and integration work, use the existing Cars launcher from J:/cars:

```powershell
./scripts/start-client.ps1 -Client five-auto -Prepare
./scripts/start-client.ps1 -Client five-auto
```

Default proposed entries: Auto Best http://127.0.0.1:6631/ ; Modern http://127.0.0.1:6632/cars ; Carwow http://127.0.0.1:6633/ . No listener or port availability was claimed by this worker.

Install/check commands from the retained masters: Auto Best (Node 22): npm ci, npm run validate. Modern (retained Node 22 / pnpm 11.4.0): pnpm install --frozen-lockfile, pnpm --filter @repo/database build, pnpm --filter web typecheck, then its documented static-demo web build/launch configuration. Carwow (Node 24): npm ci, npm run check, npm run build. No live database or migrations.

Review home, stock list, a connected real detail/gallery, contact, navigation, filters/reset, back-to-list state and non-delivery enquiry behavior at 390 and 1440px; inspect logo/header at 320px too. These checks were not run.
