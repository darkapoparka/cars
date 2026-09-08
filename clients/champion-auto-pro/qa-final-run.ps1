$ErrorActionPreference='Stop'
$env:QA_OUTPUT='J:/cars/clients/champion-auto-pro/qa-final'
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' J:/cars/clients/avangard-auto/verify-final.mjs champion-auto-pro
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/champion-auto-pro/modern
$env:SKIP_ENV_VALIDATION='true'
cmd /c "pnpm.cmd --filter web typecheck > ../qa-final/typecheck-modern.log 2>&1"
if($LASTEXITCODE){throw 'Modern typecheck failed'}

$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
Set-Location J:/cars/clients/champion-auto-pro/carwow
cmd /c "npm.cmd run check > ../qa-final/check-carwow.log 2>&1"
if($LASTEXITCODE){throw 'Carwow check failed'}
cmd /c "npm.cmd run build > ../qa-final/build-carwow.log 2>&1"
if($LASTEXITCODE){throw 'Carwow build failed'}
