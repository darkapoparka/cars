$ErrorActionPreference='Continue'
$env:PATH='C:\Users\radev\AppData\Local\nvm\v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/priselci/modern
pnpm.cmd install --frozen-lockfile *> ../evidence/modern-install.log
exit $LASTEXITCODE

