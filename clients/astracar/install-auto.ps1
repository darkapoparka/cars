$ErrorActionPreference='Stop'
$env:PATH='C:/Users/radev/AppData/Local/nvm/v22.23.2;'+$env:PATH
Set-Location J:/cars/clients/astracar/auto-best
cmd /c "npm.cmd ci > ../evidence/auto-install.log 2>&1"
if($LASTEXITCODE -ne 0){throw 'auto npm ci failed'}
