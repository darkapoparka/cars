$ErrorActionPreference='Continue'
Set-Location 'J:/cars/clients/legend-auto/carwow'
npm.cmd ci *> '../install-carwow.log'
if($LASTEXITCODE){throw 'Carwow install failed'}
