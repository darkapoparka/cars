$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true';$env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6672';$env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6674';$env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6675'
Set-Location J:/cars/clients/legend-auto/modern
pnpm.cmd --filter web typecheck *> ../qa-final/modern-typecheck-retry.log
$typeExit=$LASTEXITCODE
if($typeExit){throw 'Legend modern retry typecheck failed'}
pnpm.cmd --filter web build *> ../qa-final/modern-build-retry.log
$buildExit=$LASTEXITCODE
if($buildExit){throw 'Legend modern retry build failed'}
$report=Get-Content ../qa-final/build-status.txt -Raw
$report=$report.Replace('typecheck=2','typecheck=0') -replace '(?m)^build=1\r?$','build=0'
$report | Set-Content ../qa-final/build-status.txt

$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
Set-Location J:/cars/clients/legend-auto/carwow
npm.cmd run check *> ../qa-final/carwow-check-retry.log
if($LASTEXITCODE){throw 'Legend Carwow retry check failed'}
npm.cmd run build *> ../qa-final/carwow-build-retry.log
if($LASTEXITCODE){throw 'Legend Carwow retry build failed'}
$report=Get-Content ../qa-final/build-status.txt -Raw
$report=$report.Replace('carwow-check=1','carwow-check=0').Replace('carwow-build=1','carwow-build=0')
$report | Set-Content ../qa-final/build-status.txt

