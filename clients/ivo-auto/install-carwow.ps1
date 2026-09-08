$ErrorActionPreference='Continue'
Set-Location J:/cars/clients/ivo-auto/carwow
& npm.cmd ci *> ../evidence/carwow-install.log
if($LASTEXITCODE -ne 0){throw 'Carwow install failed'}
