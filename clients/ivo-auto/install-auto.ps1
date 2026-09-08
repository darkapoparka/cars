$ErrorActionPreference='Stop'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/ivo-auto/auto-best
npm ci *> ../evidence/auto-install.log
exit $LASTEXITCODE
