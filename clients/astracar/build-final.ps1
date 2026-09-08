$ErrorActionPreference='Stop'
$base='J:/cars/clients/astracar'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$env:SKIP_ENV_VALIDATION='true'; $env:AUTOMARKET_PUBLIC_DATA_MODE='demo'
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6637'; $env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6639'; $env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6640'
New-Item -ItemType Directory -Force "$base/qa-final" | Out-Null
Set-Location "$base/modern"
cmd /c "pnpm.cmd --filter web typecheck > ../qa-final/typecheck-modern.log 2>&1"
if($LASTEXITCODE){throw 'Modern typecheck failed'}
cmd /c "pnpm.cmd --filter web build > ../qa-final/build-modern.log 2>&1"
if($LASTEXITCODE){throw 'Modern build failed'}
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
Set-Location "$base/carwow"
cmd /c "npm.cmd run check > ../qa-final/check-carwow.log 2>&1"
if($LASTEXITCODE){throw 'Carwow check failed'}
cmd /c "npm.cmd run build > ../qa-final/build-carwow.log 2>&1"
if($LASTEXITCODE){throw 'Carwow build failed'}
$env:QA_OUTPUT='J:/cars/clients/astracar/qa-final/modern-final'
$env:QA_TEMPLATE='modern'
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' J:/cars/clients/avangard-auto/verify-final.mjs astracar
$env:QA_OUTPUT='J:/cars/clients/astracar/qa-final/carwow-final'
$env:QA_TEMPLATE='carwow'
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' J:/cars/clients/avangard-auto/verify-final.mjs astracar
Remove-Item Env:QA_TEMPLATE


$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
$env:NEXT_PUBLIC_WEB_URL='http://127.0.0.1:6627'; $env:NEXT_PUBLIC_API_URL='http://127.0.0.1:6629'; $env:NEXT_PUBLIC_APP_URL='http://127.0.0.1:6630'
Set-Location J:/cars/clients/avangard-auto/modern
cmd /c "pnpm.cmd --filter web typecheck > ../qa-final/typecheck-modern.log 2>&1"
if($LASTEXITCODE){throw 'Avangard final typecheck failed'}
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' J:/cars/clients/avangard-auto/logo-capture-final.mjs
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' J:/cars/clients/avangard-auto/supplement-final.mjs
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
Set-Location J:/cars/clients/champion-auto-pro/carwow
cmd /c "npm.cmd run check > ../qa-final/check-carwow.log 2>&1"
if($LASTEXITCODE){throw 'Champion final check failed'}
cmd /c "npm.cmd run build > ../qa-final/build-carwow.log 2>&1"
if($LASTEXITCODE){throw 'Champion final build failed'}
