$ErrorActionPreference='Continue'
$env:UV_THREADPOOL_SIZE='2'; $env:RAYON_NUM_THREADS='2'
$env:PATH='C:/nvm4w/nodejs;'+$env:PATH
$qaDir='J:/cars/clients/excellent-cars/qa-final'
Set-Location J:/cars
# App restart stopped previous runtimes; launch only on explicitly free assigned ports.
if(Get-NetTCPConnection -State Listen -LocalPort 6623 -ErrorAction SilentlyContinue){throw '6623 occupied; inspect owner before building'}
try {
  Set-Location J:/cars/clients/excellent-cars/carwow
  & npm.cmd run check *> "$qaDir/carwow-check-final.log"
  $checkExit=$LASTEXITCODE
  & npm.cmd run build *> "$qaDir/carwow-build-final.log"
  $buildExit=$LASTEXITCODE
} finally {
  Set-Location J:/cars
  & ./scripts/start-preview.ps1 -Client excellent-cars -Template carwow -Port 6623 | Set-Content "$qaDir/carwow-runtime.json"
}
if ($checkExit -ne 0 -or $buildExit -ne 0) { throw 'Carwow check/build failed' }
$checks=Get-Content "$qaDir/build-results.json" -Raw | ConvertFrom-Json
foreach($row in $checks) { if($row.check -eq 'carwow-check'){$row.exitCode=$checkExit}; if($row.check -eq 'carwow-build'){$row.exitCode=$buildExit} }
$checks | ConvertTo-Json | Set-Content "$qaDir/build-results.json"
foreach($entry in @(@('auto-best',6621),@('modern',6622))){
 if(Get-NetTCPConnection -State Listen -LocalPort $entry[1] -ErrorAction SilentlyContinue){throw "Assigned port $($entry[1]) occupied; inspect owner"}
 & ./audits/2026-09-08/verify/runtime.ps1 -Client excellent-cars -Template $entry[0] -Port $entry[1] | Set-Content "$qaDir/$($entry[0])-runtime-restarted.json"
}
$env:QA_OUTPUT=$qaDir
& node ./audits/2026-09-08/verify/run.mjs excellent-cars *> "$qaDir/browser-retry.log"
$browserExit=$LASTEXITCODE
& node "$qaDir/focus.mjs" *> "$qaDir/focused.log"
$focusExit=$LASTEXITCODE
if($browserExit -ne 0 -or $focusExit -ne 0){throw 'Final browser/focused checks failed; see logs'}
