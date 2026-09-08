$ErrorActionPreference='Stop'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location 'J:/cars/clients/elit-auto-import/modern'
pnpm.cmd install --frozen-lockfile *> '../install-modern.log'
if($LASTEXITCODE -ne 0){throw 'Modern install failed'}
