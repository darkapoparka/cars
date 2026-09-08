$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/priselci/auto-best
npm.cmd ci *> ../evidence/auto-install.log
exit $LASTEXITCODE

