$ErrorActionPreference="Continue"
$env:PATH="C:/Users/radev/AppData/Local/nvm/v22.23.2;"+$env:PATH
Set-Location 'J:/cars/clients/champion-auto-pro/auto-best'
npm.cmd run validate *> 'J:/cars/clients/champion-auto-pro/qa/validate-auto-best.log'
exit $LASTEXITCODE
