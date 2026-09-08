$ErrorActionPreference='Stop'
Set-Location J:/cars/clients/astracar
node svelte-review.mjs carwow
if($LASTEXITCODE -ne 0){throw 'Svelte analysis failed'}
& ./preview-qa.ps1 -Variant carwow
