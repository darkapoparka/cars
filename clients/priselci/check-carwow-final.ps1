$ErrorActionPreference='Continue'
$env:PATH='C:\nvm4w\nodejs;'+$env:PATH
Set-Location J:/cars/clients/priselci/carwow
npm.cmd run check *> ../evidence/carwow-check.log
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
npm.cmd run build *> ../evidence/carwow-build.log
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
Set-Location J:/cars
node clients/priselci/autofixer.mjs carwow *> clients/priselci/evidence/carwow-autofixer-summary.log
