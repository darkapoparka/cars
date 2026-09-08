# Restart for local review

From J:/cars, first confirm the assigned port is free. Keep at most one Autolife server running. During the Varna batch, browser review must use the memory-gated shared wrapper.

```powershell
./scripts/start-preview.ps1 -Client autolife -Template auto-best -Port 6641
./scripts/start-preview.ps1 -Client autolife -Template carwow -Port 6643 -NodePath C:/nvm4w/nodejs/node.exe
```

Modern public demo mode (configuration-only API/app origins):

```powershell
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6642'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6644'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6645'
./scripts/start-preview.ps1 -Client autolife -Template modern -Port 6642
```

The helper returns exact PID and logs. Verify the listener/command before stopping only that server. Never run Modern build while that Modern preview is active.
