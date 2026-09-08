$ErrorActionPreference="Stop"
$env:PATH="C:/Users/radev/AppData/Local/nvm/v22.23.2;"+$env:PATH
Set-Location 'J:/cars/clients/automarket-varna/auto-best'
& C:/Users/radev/AppData/Local/nvm/v22.23.2/npm.cmd ci *> 'J:/cars/clients/automarket-varna/evidence/install-auto-best.log'
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
