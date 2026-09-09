# КЪНЧЕВ local review

Branch source: `codex/astra-bg-10`.

After the coordinator deliberately fetches/integrates this branch into the isolated review checkout, use the existing Cars launcher:

```powershell
./scripts/start-client.ps1 -Client kunchev-auto -Prepare
./scripts/start-client.ps1 -Client kunchev-auto
```

Expected entries using the standard trio ports after confirming they are free:
- Auto Best: `http://127.0.0.1:6631/`
- Modern: `http://127.0.0.1:6632/cars`
- Carwow: `http://127.0.0.1:6633/`

Checks are NOT inherited from the masters and were not executed by this GitHub-only handoff. Run Auto Best `npm run validate`; Modern frozen install, Prisma package generation, web typecheck/build; Carwow `npm run check` and `npm run build`, then browser-review 390/1440 and 320 header/logo behavior.

Before publication replace the documented placeholder/template vehicle media in all variants with cleared, listing-matched KUNCHEV photos and finish stale-identity/browser QA. Do not submit external forms during review.
