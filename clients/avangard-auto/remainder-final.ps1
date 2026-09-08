$ErrorActionPreference='Stop'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
Set-Location J:/cars/clients/champion-auto-pro/carwow
cmd /c "npm.cmd run check > ../qa-final/check-carwow.log 2>&1"
if($LASTEXITCODE){throw 'Champion check failed'}
cmd /c "npm.cmd run build > ../qa-final/build-carwow.log 2>&1"
if($LASTEXITCODE){throw 'Champion build failed'}
Set-Location J:/cars
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' clients/avangard-auto/remainder-final.mjs
if($LASTEXITCODE){throw 'Focused remainder failed'}
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' clients/avangard-auto/numeric-browser-final.mjs
& 'C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe' clients/avangard-auto/restore-owner-final.mjs
