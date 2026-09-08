$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location 'J:/cars/clients/excellent-cars/auto-best'
& npm.cmd ci *> 'J:/cars/clients/excellent-cars/install-auto-best.log'
if($LASTEXITCODE -ne 0){throw "Install failed: $LASTEXITCODE"}

