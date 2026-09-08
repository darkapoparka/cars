$ErrorActionPreference='Continue'
node 'J:/cars/clients/legend-auto/svelte-audit.mjs' carwow *> 'J:/cars/clients/legend-auto/svelte-audit-carwow.log'
Set-Location 'J:/cars/clients/legend-auto/carwow'
npm.cmd run check *> '../check-carwow.log'
if($LASTEXITCODE){throw 'Carwow check failed'}
npm.cmd run build *> '../build-carwow.log'
if($LASTEXITCODE){throw 'Carwow build failed'}
