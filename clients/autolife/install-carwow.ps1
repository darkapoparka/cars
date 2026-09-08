$ErrorActionPreference='Continue'
$env:PATH='C:\nvm4w\nodejs;'+$env:PATH
Set-Location J:/cars/clients/autolife/carwow
npm.cmd ci *> ../evidence/install-carwow.log
exit $LASTEXITCODE

