$ErrorActionPreference="Stop"
$env:PATH="C:/Users/radev/AppData/Local/nvm/v22.23.2;"+$env:PATH
Set-Location 'J:/cars/clients/champion-auto-pro/auto-best'
npm.cmd ci *> 'J:/cars/clients/champion-auto-pro/qa/install-auto-best.log'
exit $LASTEXITCODE
