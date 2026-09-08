$ErrorActionPreference="Continue"
$env:PATH="C:/nvm4w/nodejs;"+$env:PATH
Set-Location 'J:/cars/clients/automarket-varna/carwow'
& C:/nvm4w/nodejs/npm.cmd run check *> 'J:/cars/clients/automarket-varna/evidence/carwow-check.log'
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
& C:/nvm4w/nodejs/npm.cmd run build *> 'J:/cars/clients/automarket-varna/evidence/carwow-build.log'
exit $LASTEXITCODE
