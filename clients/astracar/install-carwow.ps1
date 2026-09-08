$ErrorActionPreference='Stop'
# Carwow retains its Node 24 requirement; use the host Node 24 runtime.
Set-Location J:/cars/clients/astracar/carwow
cmd /c "npm.cmd ci > ../evidence/carwow-install.log 2>&1"
if($LASTEXITCODE -ne 0){throw 'carwow npm ci failed'}
