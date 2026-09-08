$ErrorActionPreference='Stop'
# Carwow retains its Node 24 requirement; use the host Node 24 runtime.
Set-Location J:/cars/clients/astracar/carwow
cmd /c "npm.cmd run check > ../evidence/carwow-check.log 2>&1"
if($LASTEXITCODE -ne 0){throw 'carwow check failed'}
cmd /c "npm.cmd run build > ../evidence/carwow-build.log 2>&1"
if($LASTEXITCODE -ne 0){throw 'carwow build failed'}

& J:/cars/clients/astracar/qa-carwow.ps1
