$ErrorActionPreference="Continue"
$env:PATH="C:/nvm4w/nodejs;"+$env:PATH
Set-Location 'J:/cars/clients/automarket-varna/carwow'
& C:/nvm4w/nodejs/npm.cmd ci *> 'J:/cars/clients/automarket-varna/evidence/install-carwow.log'
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}

