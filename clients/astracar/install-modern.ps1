$ErrorActionPreference='Stop'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/astracar/modern
cmd /c "pnpm.cmd install --frozen-lockfile > ../evidence/modern-install.log 2>&1"
if($LASTEXITCODE -ne 0){throw 'modern frozen install failed'}
