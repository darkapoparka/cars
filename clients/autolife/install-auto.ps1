$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/autolife/auto-best
npm.cmd ci *> ../evidence/install-auto.log
exit $LASTEXITCODE
