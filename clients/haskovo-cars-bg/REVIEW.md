# ХАСКОВО КАРС БГ local review

Branch source: `codex/astra-bg-10`.

After the coordinator fetches/integrates this branch into the isolated review checkout:

```powershell
./scripts/start-client.ps1 -Client haskovo-cars-bg -Prepare
./scripts/start-client.ps1 -Client haskovo-cars-bg
```

Expected entries using standard trio ports after confirming availability:
- Auto Best: `http://127.0.0.1:6631/`
- Modern: `http://127.0.0.1:6632/cars`
- Carwow: `http://127.0.0.1:6633/`

No runtime/build/browser pass is inherited or claimed. Run Auto Best `npm run validate`; Modern frozen install, local Prisma package generation, web typecheck/build; Carwow `npm run check` and `npm run build`, then browser-review home/inventory/detail/contact/search/menu at 390 and 1440, plus 320 header/logo.

Before publication replace documented template/demo vehicle media with cleared, listing-matched dealer photos and finish stale-identity/browser QA. Do not submit external enquiries during review.
