$ErrorActionPreference="Continue"
$env:PATH="C:/Users/radev/AppData/Local/nvm/v24.20.0;"+$env:PATH
Set-Location 'J:/cars/clients/champion-auto-pro/carwow'
npm.cmd run check *> 'J:/cars/clients/champion-auto-pro/qa/check-carwow.log'
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
npm.cmd run build *> 'J:/cars/clients/champion-auto-pro/qa/build-carwow.log'
exit $LASTEXITCODE
