$ErrorActionPreference='Continue'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location 'J:/cars/clients/excellent-cars/modern'
& pnpm.cmd install --frozen-lockfile *> 'J:/cars/clients/excellent-cars/install-modern.log'
if($LASTEXITCODE -ne 0){throw "Install failed: $LASTEXITCODE"}

