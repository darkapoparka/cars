$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.20.0;'+$env:PATH
Set-Location 'J:/cars/clients/elit-auto-import/carwow'
npm.cmd run check *> '../carwow-check.log'
if($LASTEXITCODE -ne 0){throw 'Carwow check failed'}
npm.cmd run build *> '../carwow-build.log'
if($LASTEXITCODE -ne 0){throw 'Carwow build failed'}
