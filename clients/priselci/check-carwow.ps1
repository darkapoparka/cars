$ErrorActionPreference='Continue'
$env:PATH='C:\nvm4w\nodejs;'+$env:PATH
Set-Location J:/cars/clients/priselci/carwow
npm.cmd run check *> ../evidence/carwow-check.log
if ($LASTEXITCODE -ne 0) {exit $LASTEXITCODE}
npm.cmd run build *> ../evidence/carwow-build.log
exit $LASTEXITCODE


