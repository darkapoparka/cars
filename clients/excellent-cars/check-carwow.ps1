$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v24.18.0;'+$env:PATH
Set-Location 'J:/cars/clients/excellent-cars/carwow'
& npm.cmd run check *> 'J:/cars/clients/excellent-cars/check-carwow.log'
if($LASTEXITCODE -ne 0){throw "Check failed: $LASTEXITCODE"}
& npm.cmd run build *> 'J:/cars/clients/excellent-cars/build-carwow.log'
if($LASTEXITCODE -ne 0){throw "Build failed: $LASTEXITCODE"}

