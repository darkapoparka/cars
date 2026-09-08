# Restart and QA commands

All URLs are local review only. Previews are stopped after QA; no public preview is deployed.

During the concurrent Varna batch, use the current shared slot for every start + browser + teardown job. These bounded scripts record launch PIDs and stop only their own descendants in finally:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/elit-auto-import/finish-auto-job.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/elit-auto-import/qa-modern-job.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/elit-auto-import/finish-carwow-job.ps1
```

For owner-controlled manual review after batch resource coordination is complete, start one at a time from J:/cars with the exact launcher commands below. The launcher refuses occupied ports. Preserve its returned PID/log paths and verify ownership before stopping it.

```powershell
./scripts/start-preview.ps1 -Client elit-auto-import -Template auto-best -Port 6661
# http://127.0.0.1:6661/

$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6662'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6664'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6665'
./scripts/start-preview.ps1 -Client elit-auto-import -Template modern -Port 6662
# http://127.0.0.1:6662/cars

./scripts/start-preview.ps1 -Client elit-auto-import -Template carwow -Port 6663 -NodePath C:/Users/radev/AppData/Local/nvm/v24.20.0/node.exe
# http://127.0.0.1:6663/
```

Node 22.23.2 is pinned for Auto Best/Modern. Carwow retains its Node 24 requirement. Modern's 6664/6665 origins are configuration only, not provider services. Do not run a Next production build while its dev server is active.
