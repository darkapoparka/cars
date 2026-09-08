# Local review and QA

Only one preview for this client may run at a time. During the Varna batch, start + browser QA + teardown must remain inside the shared slot. These commands run the complete bounded review job and stop the preview before releasing the slot:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/champion-auto-pro/qa-auto-best.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/champion-auto-pro/qa-modern.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/champion-auto-pro/qa-carwow.ps1
```

The jobs call these exact launch commands only after the slot is acquired and the assigned port is free:

```powershell
J:/cars/scripts/start-preview.ps1 -Client champion-auto-pro -Template auto-best -Port 6631 -NodePath C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe

$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6632'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6634'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6635'
J:/cars/scripts/start-preview.ps1 -Client champion-auto-pro -Template modern -Port 6632 -NodePath C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe

J:/cars/scripts/start-preview.ps1 -Client champion-auto-pro -Template carwow -Port 6633 -NodePath C:/Users/radev/AppData/Local/nvm/v24.20.0/node.exe
```

6634/6635 are distinct configuration origins, not running API/private-app services. Modern keeps its complete monorepo and launches from apps/web. Stop its preview before production builds. Do not silently change any port or stop another task's listener.
