# Preview restart commands

Run from J:\cars. Ports are exclusive allocations, not proof of a running listener. Use the shared queue for browser QA during the batch. All supplied URLs are local review links.

```powershell
# Auto Best
./scripts/start-preview.ps1 -Client avangard-auto -Template auto-best -Port 6626

# Modern — configure these distinct local origins first
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6627'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6629'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6630'
./scripts/start-preview.ps1 -Client avangard-auto -Template modern -Port 6627

# Carwow
./scripts/start-preview.ps1 -Client avangard-auto -Template carwow -Port 6628 -NodePath C:/Users/radev/AppData/Local/nvm/v24.20.0/node.exe
```

For a complete bounded QA run, pass finish-auto-best.ps1, finish-modern.ps1 or finish-carwow.ps1 to audits/2026-09-07/varna-leads/with-build-slot.ps1. The scripts keep the launcher process alive, save its PID/command, and stop only that preview in finally. Install/check logs live in evidence/.
