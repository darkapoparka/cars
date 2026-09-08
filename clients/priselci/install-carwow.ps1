$ErrorActionPreference='Continue'
$env:PATH='C:\nvm4w\nodejs;'+$env:PATH
Set-Location J:/cars/clients/priselci/carwow
npm.cmd ci *> ../evidence/carwow-install.log
exit $LASTEXITCODE


