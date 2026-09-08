$ErrorActionPreference="Stop"
$env:PATH="C:/Users/radev/AppData/Local/nvm/v22.23.2;"+$env:PATH
Set-Location 'J:/cars/clients/champion-auto-pro/modern'
pnpm.cmd install --frozen-lockfile *> 'J:/cars/clients/champion-auto-pro/qa/install-modern.log'
exit $LASTEXITCODE
