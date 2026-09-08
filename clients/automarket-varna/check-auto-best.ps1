$ErrorActionPreference="Continue"
$env:PATH="C:/Users/radev/AppData/Local/nvm/v22.23.2;"+$env:PATH
Set-Location 'J:/cars/clients/automarket-varna/auto-best'
& C:/Users/radev/AppData/Local/nvm/v22.23.2/npm.cmd run validate *> 'J:/cars/clients/automarket-varna/evidence/auto-best-validate.log'
exit $LASTEXITCODE
