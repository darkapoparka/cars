# Астракар — локален рестарт

По текущата batch политика preview и browser QA се изпълняват заедно през общия mutex, само един job наведнъж. Всеки job стартира точния порт и спира собствения сървър след QA.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/astracar/qa-auto.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/astracar/qa-modern.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/astracar/qa-carwow.ps1
```

Вътрешни точни launcher команди (само при разрешено самостоятелно local review извън текущата batch опашка):

```powershell
J:/cars/scripts/start-preview.ps1 -Client astracar -Template auto-best -Port 6636
$env:SKIP_ENV_VALIDATION='true'
$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6637'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6639'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6640'
J:/cars/scripts/start-preview.ps1 -Client astracar -Template modern -Port 6637
J:/cars/scripts/start-preview.ps1 -Client astracar -Template carwow -Port 6638
```

Node 22.23.2 за auto-best и modern; Node 24.x за carwow. URLs: http://127.0.0.1:6636/ ; http://127.0.0.1:6637/cars ; http://127.0.0.1:6638/ . API 6639 и app 6640 не са стартирани. Проверете BUILD-STATUS.md за актуалното stopped/running състояние.
