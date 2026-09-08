$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.18.0;'+$env:PATH
Set-Location 'J:/cars/clients/excellent-cars/carwow'
& npm.cmd ci *> 'J:/cars/clients/excellent-cars/install-carwow.log'
if($LASTEXITCODE -ne 0){throw "Install failed: $LASTEXITCODE"}



