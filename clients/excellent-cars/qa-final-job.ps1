$ErrorActionPreference = 'Stop'
$carQa = 'J:/cars/clients/excellent-cars/qa-final'
New-Item -ItemType Directory -Path $carQa -Force | Out-Null
$env:UV_THREADPOOL_SIZE='2'; $env:RAYON_NUM_THREADS='2'
$env:NEXT_TELEMETRY_DISABLED='1'
$env:SKIP_ENV_VALIDATION='true'; $env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6622'
$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6624'
$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6625'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$carBuilds=@()
Set-Location J:/cars/clients/excellent-cars/auto-best
$ErrorActionPreference='Continue'
& npm.cmd run validate *> "$carQa/auto-validate.log"
$carBuilds += @{check='auto-validate';exitCode=$LASTEXITCODE}
$ErrorActionPreference='Stop'
try {
  & J:/cars/audits/2026-09-08/verify/runtime.ps1 -StopPid 18272 -Port 6622
  Set-Location J:/cars/clients/excellent-cars/modern
  $ErrorActionPreference='Continue'
  & pnpm.cmd --filter web typecheck *> "$carQa/modern-typecheck.log"
  $carBuilds += @{check='modern-typecheck';exitCode=$LASTEXITCODE}
  if($LASTEXITCODE -eq 0) {
    & pnpm.cmd --filter web build *> "$carQa/modern-build.log"
    $carBuilds += @{check='modern-build';exitCode=$LASTEXITCODE}
  }
} finally {
  $ErrorActionPreference='Stop'
  Set-Location J:/cars
  & ./scripts/start-preview.ps1 -Client excellent-cars -Template modern -Port 6622 | Set-Content "$carQa/modern-runtime.json"
}
try {
  & J:/cars/audits/2026-09-08/verify/runtime.ps1 -StopPid 65528 -Port 6623
  $env:PATH='C:/nvm4w/nodejs;'+$env:PATH
  Set-Location J:/cars/clients/excellent-cars/carwow
  $ErrorActionPreference='Continue'
  & npm.cmd run check *> "$carQa/carwow-check.log"
  $carBuilds += @{check='carwow-check';exitCode=$LASTEXITCODE}
  if($LASTEXITCODE -eq 0) {
    & npm.cmd run build *> "$carQa/carwow-build.log"
    $carBuilds += @{check='carwow-build';exitCode=$LASTEXITCODE}
  }
} finally {
  $ErrorActionPreference='Stop'
  Set-Location J:/cars
  & ./scripts/start-preview.ps1 -Client excellent-cars -Template carwow -Port 6623 | Set-Content "$carQa/carwow-runtime.json"
  $carBuilds | ConvertTo-Json | Set-Content "$carQa/build-results.json"
}
$env:QA_OUTPUT=$carQa
& node J:/cars/audits/2026-09-08/verify/run.mjs excellent-cars *> "$carQa/browser.log"
& node "$carQa/focus.mjs" *> "$carQa/focused.log"
