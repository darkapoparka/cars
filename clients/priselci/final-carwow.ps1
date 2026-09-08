$ErrorActionPreference='Continue'
$env:PATH='C:\nvm4w\nodejs;'+$env:PATH
Set-Location J:/cars/clients/priselci/carwow
npm.cmd run check *> ../evidence/carwow-check.log
$checkExit=$LASTEXITCODE
npm.cmd run build *> ../evidence/carwow-build.log
$buildExit=$LASTEXITCODE
Set-Location J:/cars
node clients/priselci/autofixer.mjs carwow *> clients/priselci/evidence/carwow-autofixer-summary.log
& J:/cars/clients/priselci/qa-variant.ps1 -Variant carwow -Port 6648
if($checkExit -ne 0){exit $checkExit}
exit $buildExit
