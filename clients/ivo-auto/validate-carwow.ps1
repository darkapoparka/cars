$ErrorActionPreference='Continue'
Set-Location J:/cars/clients/ivo-auto/carwow
& npm.cmd run check *> ../evidence/carwow-check.log
if($LASTEXITCODE -ne 0){throw 'Carwow check failed'}
& npm.cmd run build *> ../evidence/carwow-build.log
if($LASTEXITCODE -ne 0){throw 'Carwow build failed'}
& node.exe J:/cars/clients/ivo-auto/svelte-review.mjs
