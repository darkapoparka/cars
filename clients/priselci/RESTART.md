# Priselci local preview restarts

Run from J:/cars. Only one Priselci preview at a time; the helper refuses an occupied port. Browser QA is serialized with all other batch heavy work.

```powershell
# Complete bounded review jobs; each stops its own preview/browser in finally.
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/priselci/qa-auto.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/priselci/qa-modern.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/priselci/qa-carwow.ps1
```

Exact launcher commands for the owner's later interactive review, after confirming resource availability:

```powershell
./scripts/start-preview.ps1 -Client priselci -Template auto-best -Port 6646
./scripts/start-preview.ps1 -Client priselci -Template carwow -Port 6648

$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6647'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6649'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6650'
./scripts/start-preview.ps1 -Client priselci -Template modern -Port 6647
```

Open http://127.0.0.1:6646/, http://127.0.0.1:6647/cars or http://127.0.0.1:6648/ for the corresponding running variant. The Modern configuration-only 6649/6650 origins do not have active services. No public preview exists.
