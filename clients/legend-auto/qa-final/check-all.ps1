$ErrorActionPreference='Continue'
foreach($slug in @('legend-auto','elit-auto-import','automarket-varna')) {
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true'; $env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$task = (Get-Content J:/cars/audits/2026-09-07/varna-leads/build-tasks.json -Raw | ConvertFrom-Json).tasks | Where-Object slug -eq $slug
$env:NEXT_PUBLIC_WEB_URL="http://127.0.0.1:$($task.ports.modern)"; $env:NEXT_PUBLIC_API_URL="http://127.0.0.1:$($task.ports.modernApi)"; $env:NEXT_PUBLIC_APP_URL="http://127.0.0.1:$($task.ports.modernApp)"
Set-Location "J:/cars/clients/$slug/modern"
pnpm.cmd --filter web typecheck *> ../qa-final/modern-typecheck.log
"typecheck=$LASTEXITCODE" | Set-Content ../qa-final/build-status.txt
pnpm.cmd --filter web build *> ../qa-final/modern-build.log
"build=$LASTEXITCODE" | Add-Content ../qa-final/build-status.txt
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
Set-Location "J:/cars/clients/$slug/carwow"
npm.cmd run check *> ../qa-final/carwow-check.log
"carwow-check=$LASTEXITCODE" | Add-Content ../qa-final/build-status.txt
npm.cmd run build *> ../qa-final/carwow-build.log
"carwow-build=$LASTEXITCODE" | Add-Content ../qa-final/build-status.txt
}
Set-Location J:/cars
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
foreach($slug in @('legend-auto','elit-auto-import','automarket-varna')) {
$env:QA_OUTPUT="J:/cars/clients/$slug/qa-final"
node audits/2026-09-08/verify/run-astra-last.mjs $slug *> "J:/cars/clients/$slug/qa-final/browser.log"
}

