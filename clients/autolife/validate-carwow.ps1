$ErrorActionPreference='Continue'
$env:PATH='C:\nvm4w\nodejs;'+$env:PATH
Set-Location J:/cars/clients/autolife/carwow
npm.cmd run check *> ../evidence/check-carwow.log
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
npm.cmd run build *> ../evidence/build-carwow.log
exit $LASTEXITCODE
