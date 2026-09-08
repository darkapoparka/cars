$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/autolife/modern
pnpm.cmd install --frozen-lockfile *> ../evidence/install-modern.log
exit $LASTEXITCODE
