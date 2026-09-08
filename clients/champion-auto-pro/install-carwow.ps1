$ErrorActionPreference="Continue"
$env:PATH="C:/Users/radev/AppData/Local/nvm/v24.20.0;"+$env:PATH
Set-Location 'J:/cars/clients/champion-auto-pro/carwow'
npm.cmd ci *> 'J:/cars/clients/champion-auto-pro/qa/install-carwow.log'
exit $LASTEXITCODE


